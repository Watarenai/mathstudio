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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8 text-center text-slate-700">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
            <h1 className="text-xl font-bold text-rose-600 mb-4 flex items-center justify-center gap-2">
              <span className="text-2xl">⚠️</span> エラーが発生しました
            </h1>
            <p className="text-slate-500 mb-6 text-sm leading-relaxed">
              予期せぬエラーによりアプリケーションが停止しました。<br />
              再読み込みしても直らない場合は、以下のエラー内容をコピーして開発者にお知らせください。
            </p>

            <div className="bg-slate-100 p-4 rounded-lg text-left mb-6 overflow-auto max-h-40 border border-slate-200 relative group">
              <pre className="text-xs font-mono text-slate-600 whitespace-pre-wrap break-all">
                {this.state.error?.message}
                {this.state.error?.stack && `\n\n${this.state.error.stack.slice(0, 300)}...`}
              </pre>
              <button
                onClick={() => {
                  const text = `${this.state.error?.name}: ${this.state.error?.message}\n\n${this.state.error?.stack}`;
                  navigator.clipboard.writeText(text);
                  alert('エラー内容をコピーしました');
                }}
                className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-md shadow-sm border border-slate-200 text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity hover:text-blue-600 hover:border-blue-200"
                title="エラー内容をコピー"
              >
                📋 コピー
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                再読み込み
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.reload();
                }}
                className="px-4 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition-colors text-xs"
                title="キャッシュをクリアして再読み込み"
              >
                初期化
              </button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
