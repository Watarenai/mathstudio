import { Component, ErrorInfo, ReactNode } from 'react'
import * as Sentry from '@sentry/react'

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
    Sentry.captureException(error, { extra: { componentStack: info.componentStack } })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-700 mb-4">
            申し訳ありません、エラーが発生しました
          </h1>
          <p className="text-gray-500 mb-6 text-sm">
            {this.state.error?.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            再読み込みする
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
