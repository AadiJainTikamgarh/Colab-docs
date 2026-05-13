import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, LogOut } from "lucide-react";
import useDocumentStore from "../store/document.store";
import { useAuthStore } from "../store/auth.store";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

export default function DocumentEditor() {
  const { docId } = useParams<{ docId: string }>();
  const navigate = useNavigate();
  const { lastDocument, getDocumentById, isLoading } = useDocumentStore();
  const { logout } = useAuthStore();

  useEffect(() => {
    if (docId) {
      getDocumentById(docId);
    }
  }, [docId, getDocumentById]);

  useEffect(() => {
    const root = document.documentElement;
    const hadDarkClass = root.classList.contains("dark");
    const previousColorScheme = root.style.colorScheme;

    root.classList.remove("dark");
    root.style.colorScheme = "light";

    return () => {
      root.style.colorScheme = previousColorScheme;
      if (hadDarkClass) {
        root.classList.add("dark");
      }
    };
  }, []);

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#eef1f5] text-slate-900">
      <nav className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 shadow-[0_12px_40px_-34px_rgba(15,23,42,0.55)] backdrop-blur">
        <div className="mx-auto max-w-[1440px] px-3 sm:px-5 lg:px-8">
          <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <button
                onClick={handleBack}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-300"
                title="Back to dashboard"
                aria-label="Back to dashboard"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="flex min-w-0 items-center gap-3">
                <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-900 text-white shadow-sm sm:flex">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Editing document
                  </p>
                  <h1 className="truncate text-lg font-semibold leading-6 text-slate-950 sm:text-xl">
                    {lastDocument?.title || "Untitled document"}
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 sm:block">
                Ready to edit
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-300"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="h-11 w-11 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900"></div>
          </div>
        ) : (
          <div className="mx-auto flex h-[calc(100vh-6rem)] w-full overflow-hidden">
            <SimpleEditor docContent={lastDocument?.content as any} />
          </div>
        )}
      </main>
    </div>
  );
}
