import { Match } from 'effect';
import { Component, ReactNode } from 'react';

type Props = {
  fallback?: ReactNode | ((error: Error) => ReactNode);
  onError?: (error: Error, info: React.ErrorInfo) => void;
  children: ReactNode;
};

type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.props.onError?.(error, info);
  }

  render() {
    const { error } = this.state;

    return Match.value(error).pipe(
      Match.when(Match.null, () => this.props.children),
      Match.orElse((error) => {
        const { fallback } = this.props;
        if (typeof fallback === 'function') return fallback(error);
        return fallback ?? <DefaultFallback error={error} />;
      }),
    );
  }
}

function DefaultFallback({ error }: { error: Error }) {
  return (
    <div role="alert">
      <p>Something went wrong.</p>
      <pre>{error.message}</pre>
    </div>
  );
}
