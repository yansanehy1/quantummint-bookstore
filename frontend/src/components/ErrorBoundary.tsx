import React, { Component, ReactNode, ErrorInfo } from "react";
import * as Sentry from "@sentry/react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public props: Props;
  public state: State = {
    hasError: false
  };

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught: ", error, info);
    
    // Send to Sentry
    Sentry.captureException(error, { extra: { componentStack: info.componentStack } });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 text-slate-900">Something went wrong.</h1>
            <p className="text-slate-600">Please reload the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}


