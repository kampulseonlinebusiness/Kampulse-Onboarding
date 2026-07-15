import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Global error boundary — wraps the entire router so any unhandled render
 * error shows a branded recovery screen instead of a blank white page.
 *
 * Navigating to "/" unmounts this tree and resets the boundary automatically
 * because Wouter swaps out the page component, clearing the error state.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Keep errors visible in the browser console for debugging.
    console.error("[ErrorBoundary] Uncaught render error:", error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ error: null });
    // Navigate to home so the reset component tree renders a clean page.
    window.location.href = "/";
  };

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full text-center space-y-6">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <img
              src="/images/kampulse-logo.webp"
              alt="Kampulse"
              className="h-12 w-auto object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </div>

          {/* Heading + message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              An unexpected error occurred. Your progress has not been lost — please
              return to the homepage and try again.
            </p>
          </div>

          {/* Error detail (collapsed; dev aid) */}
          {import.meta.env.DEV && this.state.error.message && (
            <details className="text-left bg-muted/40 border rounded-lg p-4 text-xs text-muted-foreground">
              <summary className="cursor-pointer font-medium mb-1 select-none">
                Error detail (dev only)
              </summary>
              <pre className="whitespace-pre-wrap break-all mt-2">
                {this.state.error.message}
              </pre>
            </details>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button onClick={this.handleReset} className="gap-2">
              <Home className="w-4 h-4" />
              Go to Home
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-4 h-4" />
              Reload page
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
