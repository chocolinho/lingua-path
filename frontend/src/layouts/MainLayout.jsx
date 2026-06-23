import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function MainLayout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white p-6">
                <h1 className="text-2xl font-bold mb-8">English App</h1>

                <nav className="space-y-3">
                    <Link to="/dashboard" className="block hover:text-blue-300">
                        Dashboard
                    </Link>

                    <Link to="/topics" className="block hover:text-blue-300">
                        Topics
                    </Link>

                    <Link to="/vocabularies" className="block hover:text-blue-300">
                        Vocabulary
                    </Link>

                    <Link to="/quiz" className="block hover:text-blue-300">
                        Quiz
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="mt-6 text-red-300 hover:text-red-400"
                    >
                        Logout
                    </button>
                </nav>
            </aside>

            <main className="ml-64 p-8">
                <Outlet />
            </main>
        </div>
    );
}

export default MainLayout;