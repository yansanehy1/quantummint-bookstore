import React from "react";

type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    console.error("ErrorBoundary caught: ", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Something went wrong.</h1>
            <p className="text-gray-600">Please reload the page.</p>
          </div>
        </div>
      );
    }
    return this.props.children as React.ReactNode;
  }
}
