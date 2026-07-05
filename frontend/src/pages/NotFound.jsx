import { Home, SearchX } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NotFound() {
    const { isAuthenticated } = useAuth();
    const homePath = isAuthenticated ? "/dashboard" : "/";

    return (
        <main className="min-h-screen bg-[#F6F8FB] px-4 py-12 text-slate-900 dark:bg-slate-950 dark:text-white">
            <section className="mx-auto flex max-w-2xl flex-col items-center rounded-[2rem] border border-sky-100 bg-white p-8 text-center shadow-[0_18px_50px_rgba(23,50,77,0.12)] dark:border-slate-800 dark:bg-slate-900 sm:p-12">
                <div className="mb-6 grid h-20 w-20 place-items-center rounded-[1.75rem] bg-sky-100 text-[#1CB0F6] dark:bg-sky-950 dark:text-sky-300">
                    <SearchX className="h-10 w-10" aria-hidden="true" />
                </div>

                <p className="text-sm font-black uppercase tracking-[0.18em] text-[#58CC02]">
                    404 Not Found
                </p>
                <h1 className="mt-3 text-3xl font-black sm:text-4xl">
                    This lesson path does not exist
                </h1>
                <p className="mt-4 max-w-lg text-sm font-semibold leading-6 text-slate-500 dark:text-slate-300">
                    The page may have moved, or the route is not available in this learning space.
                </p>

                <Link
                    to={homePath}
                    className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#58CC02] px-5 py-3 text-sm font-black text-white shadow-[0_8px_0_#46a302] transition hover:-translate-y-0.5 hover:bg-[#4db302] focus:outline-none focus:ring-4 focus:ring-green-200 active:translate-y-1 active:shadow-none"
                >
                    <Home className="h-4 w-4" aria-hidden="true" />
                    Back to home
                </Link>
            </section>
        </main>
    );
}

export default NotFound;
