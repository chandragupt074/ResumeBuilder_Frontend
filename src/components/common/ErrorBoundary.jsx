import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 px-4 text-center">
          <p className="font-display text-lg font-bold text-gray-900">
            Something went wrong
          </p>
          <p className="max-w-md text-sm text-gray-500">
            {this.state.error?.message || 'An unexpected error occurred while rendering this page.'}
          </p>
          <button onClick={() => this.setState({ hasError: false, error: null })} className="btn-primary mt-2">
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
