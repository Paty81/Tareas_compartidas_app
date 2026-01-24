import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
          <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-6 max-w-2xl w-full shadow-2xl">
            <h1 className="text-2xl font-bold text-red-700 mb-4">¡Algo salió mal! (Crash Report)</h1>
            <p className="text-red-600 font-medium mb-4">Por favor, comparte la siguiente información con el desarrollador:</p>
            
            <div className="bg-white border border-red-200 rounded-xl p-4 overflow-auto max-h-[60vh]">
              <p className="font-mono text-red-600 font-bold mb-2">
                {this.state.error && this.state.error.toString()}
              </p>
              <pre className="font-mono text-xs text-slate-600 whitespace-pre-wrap">
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </div>

            <button
               onClick={() => window.location.reload()}
               className="mt-6 bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-all w-full"
            >
               Recargar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
