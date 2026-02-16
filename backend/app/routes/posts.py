from fastapi import APIRouter, HTTPException
from bson import ObjectId
from datetime import datetime
from app.database import posts_collection
from app.models.post import (
    PostCreate,
    PostUpdate,
    PostResponse,
    PostListItem,
    PostStatus,
)

router = APIRouter(prefix="/api/posts", tags=["posts"])


# helper to convert mongo doc to response
def post_to_response(doc) -> dict:
    return {
        "id": str(doc["_id"]),
        "title": doc.get("title", "Untitled"),
        "content": doc.get("content"),
        "status": doc.get("status", "draft"),
        "created_at": doc.get("created_at"),
        "updated_at": doc.get("updated_at"),
    }


@router.post("/", response_model=PostResponse)
async def create_post(data: PostCreate):
    now = datetime.utcnow()
    doc = {
        "title": data.title,
        "content": data.content,
        "status": PostStatus.DRAFT,
        "created_at": now,
        "updated_at": now,
    }
    result = await posts_collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return post_to_response(doc)


@router.get("/", response_model=list[PostListItem])
async def list_posts():
    posts = []
    cursor = posts_collection.find().sort("updated_at", -1)
    async for doc in cursor:
        posts.append({
            "id": str(doc["_id"]),
            "title": doc.get("title", "Untitled"),
            "status": doc.get("status", "draft"),
            "created_at": doc.get("created_at"),
            "updated_at": doc.get("updated_at"),
        })
    return posts


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(post_id: str):
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="Invalid post id")
    doc = await posts_collection.find_one({"_id": ObjectId(post_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Post not found")
    return post_to_response(doc)


@router.patch("/{post_id}", response_model=PostResponse)
async def update_post(post_id: str, data: PostUpdate):
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="Invalid post id")

    # only update fields that were sent
    updates = {}
    if data.title is not None:
        updates["title"] = data.title
    if data.content is not None:
        updates["content"] = data.content
    updates["updated_at"] = datetime.utcnow()

    result = await posts_collection.update_one(
        {"_id": ObjectId(post_id)},
        {"$set": updates},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")

    doc = await posts_collection.find_one({"_id": ObjectId(post_id)})
    return post_to_response(doc)


@router.post("/{post_id}/publish", response_model=PostResponse)
async def publish_post(post_id: str):
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="Invalid post id")

    result = await posts_collection.update_one(
        {"_id": ObjectId(post_id)},
        {"$set": {"status": PostStatus.PUBLISHED, "updated_at": datetime.utcnow()}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")

    doc = await posts_collection.find_one({"_id": ObjectId(post_id)})
    return post_to_response(doc)


@router.delete("/{post_id}")
async def delete_post(post_id: str):
    if not ObjectId.is_valid(post_id):
        raise HTTPException(status_code=400, detail="Invalid post id")

    result = await posts_collection.delete_one({"_id": ObjectId(post_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"message": "Post deleted"}
