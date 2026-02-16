from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.posts import router as posts_router

app = FastAPI(title="Smart Blog Editor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(posts_router)


@app.get("/")
async def root():
    return {"message": "Smart Blog Editor API is running"}
