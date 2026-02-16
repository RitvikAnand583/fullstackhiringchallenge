import { Outlet, Link, useLocation } from "react-router-dom";
import { PenLine, FileText } from "lucide-react";

function Layout() {
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <header className="border-b border-neutral-200 bg-white">
                <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
                    <Link to="/" className="text-lg font-semibold text-neutral-900 tracking-tight">
                        SmartBlog
                    </Link>
                    <nav className="flex items-center gap-3">
                        {!isHome && (
                            <Link
                                to="/"
                                className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                            >
                                <FileText size={16} />
                                All Posts
                            </Link>
                        )}
                        <Link
                            to="/editor"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-neutral-900 rounded-md hover:bg-neutral-800 transition-colors"
                        >
                            <PenLine size={16} />
                            New Post
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="max-w-5xl mx-auto px-6 py-8">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
