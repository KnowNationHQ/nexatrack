"use client"
import { Component } from "react"

export default class ErrorBoundary extends Component<{ children: React.ReactNode }> {
  state = { error: null as Error | null }
  static getDerivedStateFromError(error: Error) { return { error } }
  componentDidCatch(error: Error, info: any) {
    console.error("[ErrorBoundary]", error.message, error.stack, info.componentStack)
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, textAlign: "center", fontFamily: "sans-serif" }}>
          <h2 style={{ color: "#FF3E41", marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ color: "#6b7280", fontSize: 14 }}>Please refresh the page or try again later.</p>
          <button
            onClick={() => { this.setState({ error: null }); window.location.reload() }}
            style={{ marginTop: 12, padding: "8px 20px", background: "#FF3E41", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}
          >
            Reload page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}