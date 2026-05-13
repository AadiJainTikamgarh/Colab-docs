import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock3,
  FileText,
  LogOut,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useAuthStore } from "../store/auth.store";
import useDocumentStore from "../store/document.store";

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const {
    documents,
    isLoading,
    fetchUserDocuments,
    createDocument,
    deleteDocument,
    setLastDocument,
  } = useDocumentStore();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    // console.log("Dashboard mounted, fetching documents...");
    fetchUserDocuments();
    // console.log(documents);
  }, [fetchUserDocuments]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;

    setIsCreating(true);
    try {
      await createDocument(newDocTitle, {});
      setNewDocTitle("");
      setShowCreateModal(false);
    } catch (error) {
      console.error("Failed to create document:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteDocument = async (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteDocument(docId);
      } catch (error) {
        console.error("Failed to delete document:", error);
      }
    }
  };

  const handleNavigateToDocument = (docId: string) => {
    const docs = documents.find((doc) => doc._id === docId);
    setLastDocument(docs as any);
    navigate(`/document/${docId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#eef1f5] text-slate-900">
      <nav className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 shadow-[0_12px_40px_-34px_rgba(15,23,42,0.55)] backdrop-blur">
        <div className="mx-auto max-w-[1440px] px-3 sm:px-5 lg:px-8">
          <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-900 text-white shadow-sm">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Workspace
                </p>
                <h1 className="truncate text-lg font-semibold leading-6 text-slate-950 sm:text-xl">
                  Colab Docs
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm sm:inline-flex">
                Welcome, {user?.username || "User"}
              </span>
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

      <main className="mx-auto max-w-[1440px] px-3 py-6 sm:px-5 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 rounded-lg border border-slate-200/80 bg-white/80 p-4 shadow-[0_18px_60px_-46px_rgba(15,23,42,0.65)] backdrop-blur sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-500">
              {documents?.length}{" "}
              {documents?.length === 1 ? "document" : "documents"} available
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              My Documents
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-11 min-w-0 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-slate-500 shadow-sm sm:w-72">
              <Search className="h-4 w-4 shrink-0" />
              <span className="truncate text-sm">Select a document to edit</span>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <Plus className="h-4 w-4" />
              New Document
            </button>
          </div>
        </div>

        {isLoading && documents?.length === 0 && (
          <div className="flex justify-center py-16">
            <div className="h-11 w-11 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900"></div>
          </div>
        )}

        {!isLoading && documents?.length === 0 && (
          <div className="mx-auto max-w-xl rounded-lg border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-[0_18px_60px_-48px_rgba(15,23,42,0.7)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-slate-900 text-white">
              <FileText className="h-7 w-7" />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-slate-950">
              No documents yet
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Get started by creating your first document.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              <Plus className="h-4 w-4" />
              Create Document
            </button>
          </div>
        )}

        {documents?.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {documents.map((doc) => (
              <div
                key={doc._id}
                onClick={() => handleNavigateToDocument(doc._id)}
                className="group cursor-pointer rounded-lg border border-slate-200 bg-white shadow-[0_18px_58px_-44px_rgba(15,23,42,0.9)] transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_24px_70px_-42px_rgba(15,23,42,0.85)]"
              >
                <div className="p-5">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
                      <div className="flex h-11 w-9 shrink-0 items-center justify-center rounded-sm border border-slate-200 bg-[#f8fafc] text-slate-500 shadow-sm">
                        <FileText className="h-4 w-4" />
                      </div>
                      <h3 className="line-clamp-2 text-lg font-semibold leading-6 text-slate-950 transition-colors group-hover:text-slate-700">
                        {doc.title}
                      </h3>
                    </div>
                    <button
                      onClick={(e) => handleDeleteDocument(doc._id, e)}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
                      title="Delete document"
                      aria-label={`Delete ${doc.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-slate-400" />
                      <span>Updated {formatDate(doc.updatedAt)}</span>
                    </div>

                    {doc.collaborators && doc.collaborators.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span>
                          {doc.collaborators.length}{" "}
                          {doc.collaborators.length === 1
                            ? "collaborator"
                            : "collaborators"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-5 py-3">
                  <span className="text-xs font-medium text-slate-500">
                    Version {doc.version}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 transition-colors group-hover:text-slate-900">
                    Open
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Document Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/20 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowCreateModal(false);
              setNewDocTitle("");
            }
          }}
        >
          <div
            className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.9)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  New file
                </p>
                <h3 className="mt-1 text-xl font-semibold text-slate-950">
                  Create Document
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCreateModal(false);
                  setNewDocTitle("");
                }}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950"
                aria-label="Close modal"
                disabled={isCreating}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreateDocument}>
              <div className="mb-5">
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Document Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="h-11 w-full rounded-md border border-slate-300 px-3 text-slate-950 shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  placeholder="Enter document title..."
                  autoFocus
                  disabled={isCreating}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewDocTitle("");
                  }}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isCreating || !newDocTitle.trim()}
                >
                  {isCreating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
