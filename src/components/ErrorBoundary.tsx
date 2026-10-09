import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07090e] text-slate-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-lg w-full bg-slate-900/90 border border-red-500/30 rounded-2xl p-8 shadow-2xl space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
              <AlertOctagon className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Application Error Encountered
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                An unexpected exception occurred during execution. You can reload the page or reset the application state.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 text-left overflow-x-auto text-[11px] font-mono text-red-300">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
