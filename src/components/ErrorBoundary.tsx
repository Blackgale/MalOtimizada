import { Component, ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean; error?: any };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, fontFamily: "ui-sans-serif, system-ui" }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>
            Opa — algo quebrou na renderização.
          </h1>
          <pre style={{ whiteSpace: "pre-wrap", background: "#fee", padding: 12, borderRadius: 8, border: "1px solid #fca" }}>
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <p style={{ marginTop: 8 }}>
            Veja também o console do navegador (F12 → Console) para o stacktrace.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
