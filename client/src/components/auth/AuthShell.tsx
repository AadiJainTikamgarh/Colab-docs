import { FileText } from "lucide-react";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  eyebrow?: string;
  description?: ReactNode;
  children: ReactNode;
};

export function AuthShell({
  title,
  eyebrow = "Colab Docs",
  description,
  children,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-[#eef1f5] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[1180px] items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_28px_90px_-52px_rgba(15,23,42,0.9)] lg:grid-cols-[0.95fr_1.05fr]">
          <aside className="hidden bg-slate-950 p-8 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <Link to="/" className="inline-flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-white text-slate-950">
                  <FileText className="h-5 w-5" />
                </span>
                <span className="text-lg font-semibold">Colab Docs</span>
              </Link>
              <div className="mt-16 max-w-sm">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Document workspace
                </p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight">
                  Write, manage, and return to your documents without friction.
                </h1>
                <p className="mt-5 text-sm leading-6 text-slate-300">
                  A focused editor experience with clean document selection,
                  page-style editing, and account controls that stay out of the
                  way.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-sm text-slate-300">
              <div className="rounded-md border border-white/10 bg-white/5 p-3">
                <span className="block text-lg font-semibold text-white">
                  A4
                </span>
                Pages
              </div>
              <div className="rounded-md border border-white/10 bg-white/5 p-3">
                <span className="block text-lg font-semibold text-white">
                  Live
                </span>
                Editing
              </div>
              <div className="rounded-md border border-white/10 bg-white/5 p-3">
                <span className="block text-lg font-semibold text-white">
                  Team
                </span>
                Ready
              </div>
            </div>
          </aside>

          <section className="flex items-center justify-center bg-white px-5 py-8 sm:px-8 lg:px-12">
            <div className="w-full max-w-md">
              <div className="mb-7 text-center lg:text-left">
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-md bg-slate-900 text-white shadow-sm lg:mx-0">
                  <FileText className="h-6 w-6" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {eyebrow}
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  {title}
                </h2>
                {description && (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                )}
              </div>

              {children}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export function AuthAlert({
  tone,
  children,
}: {
  tone: "error" | "success" | "info";
  children: ReactNode;
}) {
  const toneClass =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-700"
      : tone === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <div className={`rounded-md border px-3 py-2.5 text-sm ${toneClass}`}>
      {children}
    </div>
  );
}

export const authInputClass =
  "mt-1 h-11 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200";

export const authPasswordInputClass =
  "mt-1 h-11 w-full rounded-md border border-slate-300 px-3 pr-10 text-sm text-slate-950 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200";

export const authPrimaryButtonClass =
  "flex h-11 w-full items-center justify-center rounded-md bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50";

export const authSecondaryLinkClass =
  "font-medium text-slate-900 underline-offset-4 hover:underline";
