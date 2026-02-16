import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usePostStore from "../store/usePostStore";
import { Badge, Button, Spinner } from "../components/ui";
import { Trash2, ArrowRight } from "lucide-react";

function PostsPage() {
    const { posts, loading, fetchPosts, deletePost, createPost } = usePostStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleNew = async () => {
        const post = await createPost();
        if (post) navigate(`/editor/${post.id}`);
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        await deletePost(id);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    if (loading && posts.length === 0) {
        return (
            <div className="flex justify-center py-20">
                <Spinner size={28} />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-neutral-900">Your Posts</h1>
                <Button onClick={handleNew}>New Post</Button>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-neutral-500 mb-4">No posts yet</p>
                    <Button onClick={handleNew}>Create your first post</Button>
                </div>
            ) : (
                <div className="space-y-3">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            onClick={() => navigate(`/editor/${post.id}`)}
                            className="flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-lg cursor-pointer hover:border-neutral-300 transition-colors"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-base font-medium text-neutral-900 truncate">
                                        {post.title}
                                    </h3>
                                    <Badge status={post.status}>{post.status}</Badge>
                                </div>
                                <p className="text-xs text-neutral-400">
                                    Updated {formatDate(post.updated_at)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                                <button
                                    onClick={(e) => handleDelete(e, post.id)}
                                    className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors rounded"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <ArrowRight size={16} className="text-neutral-300" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PostsPage;
