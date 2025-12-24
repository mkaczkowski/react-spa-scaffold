import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Report to Sentry in production
    if (import.meta.env.PROD) {
      import('@sentry/react')
        .then((Sentry) => {
          Sentry.captureException(error, {
            extra: { componentStack: errorInfo.componentStack },
          });
        })
        .catch(() => {
          // Sentry failed to load, error already logged above
        });
    }
  }

  /**
   * Reset the error boundary state
   */
  reset = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-destructive text-2xl font-bold">Something went wrong</h1>
            <p className="text-muted-foreground mt-2">We're sorry, but something unexpected happened.</p>
            {import.meta.env.DEV && this.state.error && (
              <details className="bg-muted mt-4 rounded-md p-4 text-left">
                <summary className="cursor-pointer font-medium">Error details</summary>
                <pre className="mt-2 overflow-auto text-sm">{this.state.error.message}</pre>
                <pre className="mt-1 overflow-auto text-xs opacity-75">{this.state.error.stack}</pre>
              </details>
            )}
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={this.reset}
                className="bg-secondary text-secondary-foreground rounded px-4 py-2 transition-colors hover:opacity-90"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-primary text-primary-foreground rounded px-4 py-2 transition-colors hover:opacity-90"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
