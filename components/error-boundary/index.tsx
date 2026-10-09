import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  /** Shown instead of the crashed subtree. Defaults to a themed fallback. */
  fallback?: React.ReactNode;
  /** Optional hook for logging (e.g. Sentry) — never throws. */
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Phase 1: a single component crash (e.g. the post-login first-paint crash
 * from a wrong-shaped user object) must not take down the whole app.
 * Wrap page content or risky subtrees with this; the rest of the UI keeps
 * working and the user gets a reload action instead of "Application error".
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    try {
      this.props.onError?.(error, info);
    } catch {
      // Logging must never throw.
    }
    if (process.env.NEXT_PUBLIC_APP_ENV !== "production") {
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  private handleReload = () => {
    if (typeof window !== "undefined") window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 bg-background-shade-1 px-6 py-10 text-center">
          <p className="text-lg font-semibold text-gray-shade-1">
            Something went wrong
          </p>
          <p className="max-w-md text-sm text-gray-shade-7">
            This section hit an unexpected error. Reloading usually fixes it —
            the rest of the app is unaffected.
          </p>
          <button
            onClick={this.handleReload}
            className="bg-primary rounded-lg px-5 py-2 text-sm font-semibold text-white"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
