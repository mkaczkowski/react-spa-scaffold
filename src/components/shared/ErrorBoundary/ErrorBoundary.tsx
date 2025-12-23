import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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

    // Report to Sentry in production
    if (import.meta.env.PROD) {
      import('@sentry/react').then((Sentry) => {
        Sentry.captureException(error, {
          extra: { componentStack: errorInfo.componentStack },
        });
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="text-center">
              <h1 className="text-destructive text-2xl font-bold">Something went wrong</h1>
              <p className="text-muted-foreground mt-2">Please refresh the page to try again.</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-primary text-primary-foreground mt-4 rounded px-4 py-2"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
