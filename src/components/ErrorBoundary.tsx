'use client'

import { Component, ErrorInfo, ReactNode } from 'react'
import { styleService } from '@/services/styleService'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      const styles = styleService.generateStyle({
        theme: 'dark',
        accentColor: '#676FFF'
      });

      return this.props.fallback || (
        <div 
          className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-900 to-black"
          style={styles}
        >
          <div className="text-center p-8 rounded-lg bg-purple-900/50 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-4">Something went wrong!</h2>
            <p className="text-purple-200 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 