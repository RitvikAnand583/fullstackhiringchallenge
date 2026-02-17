import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { PenLine, FileText, LogOut } from "lucide-react";
import useAuthStore from "../store/useAuthStore";

function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const isDashboard = location.pathname === "/dashboard";

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <header className="border-b border-neutral-200 bg-white">
                <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
                    <Link to="/" className="text-lg font-semibold text-neutral-900 tracking-tight">
                        SmartBlog
                    </Link>
                    <nav className="flex items-center gap-3">
                        {!isDashboard && (
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-900 transition-colors"
                            >
                                <FileText size={16} />
                                My Posts
                            </Link>
                        )}
                        <Link
                            to="/editor"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-neutral-900 rounded-md hover:bg-neutral-800 transition-colors"
                        >
                            <PenLine size={16} />
                            New Post
                        </Link>
                        {user && (
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors rounded"
                                title="Logout"
                            >
                                <LogOut size={16} />
                            </button>
                        )}
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
