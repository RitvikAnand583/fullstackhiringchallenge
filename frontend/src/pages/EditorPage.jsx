import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import usePostStore from "../store/usePostStore";
import Editor from "../components/editor/Editor";
import { Button, SaveStatus, Badge } from "../components/ui";
import { Send, Trash2 } from "lucide-react";

function EditorPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        activePost,
        saveStatus,
        loading,
        fetchPost,
        createPost,
        updatePost,
        publishPost,
        deletePost,
        clearActivePost,
        setSaveStatus,
    } = usePostStore();

    const [title, setTitle] = useState("");
    const [editorReady, setEditorReady] = useState(false);
    const [initialContent, setInitialContent] = useState(null);
    const debounceTimer = useRef(null);
    const postIdRef = useRef(null);

    useEffect(() => {
        const init = async () => {
            if (id) {
                const post = await fetchPost(id);
                if (post) {
                    setTitle(post.title || "");
                    setInitialContent(
                        post.content ? JSON.stringify(post.content) : null
                    );
                    postIdRef.current = post.id;
                }
            } else {
                const post = await createPost({ title: "Untitled" });
                if (post) {
                    postIdRef.current = post.id;
                    setTitle(post.title || "");
                    navigate(`/editor/${post.id}`, { replace: true });
                }
            }
            setEditorReady(true);
        };
        init();
        return () => {
            clearActivePost();
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [id]);

    const debouncedSave = useCallback(
        (postId, data) => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            setSaveStatus("saving");
            debounceTimer.current = setTimeout(() => {
                updatePost(postId, data);
            }, 1500);
        },
        [updatePost, setSaveStatus]
    );

    const handleContentChange = useCallback(
        (json) => {
            if (!postIdRef.current) return;
            debouncedSave(postIdRef.current, { content: json });
        },
        [debouncedSave]
    );

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (!postIdRef.current) return;
        debouncedSave(postIdRef.current, { title: newTitle });
    };

    const handlePublish = async () => {
        if (!postIdRef.current) return;
        await publishPost(postIdRef.current);
    };

    const handleDelete = async () => {
        if (!postIdRef.current) return;
        await deletePost(postIdRef.current);
        navigate("/");
    };

    if (loading && !editorReady) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin w-6 h-6 border-2 border-neutral-300 border-t-neutral-600 rounded-full" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    {activePost && (
                        <Badge status={activePost.status}>
                            {activePost.status}
                        </Badge>
                    )}
                    <SaveStatus status={saveStatus} />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDelete}
                    >
                        <Trash2 size={15} />
                        Delete
                    </Button>
                    {activePost?.status !== "published" && (
                        <Button size="sm" onClick={handlePublish}>
                            <Send size={15} />
                            Publish
                        </Button>
                    )}
                </div>
            </div>

            <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Post title..."
                className="w-full text-3xl font-bold text-neutral-900 placeholder-neutral-300 border-none outline-none bg-transparent mb-6"
            />

            {editorReady && (
                <Editor
                    initialState={initialContent}
                    onChange={handleContentChange}
                />
            )}
        </div>
    );
}

export default EditorPage;
