import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled error caught by ErrorBoundary:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#0A1628' }}>
          <div className="glass-card glow-br w-full max-w-sm p-8 flex flex-col items-center text-center">
            <div className="text-white text-xl font-black">Something went wrong</div>
            <div className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </div>
            <button className="btn-mint mt-6 w-full" onClick={() => window.location.reload()}>
              Reload page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
