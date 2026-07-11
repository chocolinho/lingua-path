import { Home, SearchX } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NotFound() {
    const { isAuthenticated } = useAuth();
    const homePath = isAuthenticated ? "/dashboard" : "/";

    return (
        <main className="min-h-dvh bg-[#F8FAFC] px-4 py-12 text-slate-900 dark:bg-slate-950 dark:text-white">
            <section className="mx-auto flex max-w-2xl flex-col items-center rounded-2xl border border-sky-100 bg-white p-8 text-center shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-12">
                <div className="mb-6 grid h-20 w-20 place-items-center rounded-2xl bg-sky-100 text-[#4338CA] dark:bg-sky-950 dark:text-sky-300">
                    <SearchX className="h-10 w-10" aria-hidden="true" />
                </div>

                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0F766E]">
                    404 Not Found
                </p>
                <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                    This lesson path does not exist
                </h1>
                <p className="mt-4 max-w-lg text-sm font-semibold leading-6 text-slate-500 dark:text-slate-300">
                    The page may have moved, or the route is not available in this learning space.
                </p>

                <Link
                    to={homePath}
                    className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#0F766E] px-5 py-3 text-sm font-bold text-white shadow-sm transition  hover:bg-[#0D6B64] focus:outline-none focus:ring-4 focus:ring-green-200  active:shadow-none"
                >
                    <Home className="h-4 w-4" aria-hidden="true" />
                    Back to home
                </Link>
            </section>
        </main>
    );
}

export default NotFound;
