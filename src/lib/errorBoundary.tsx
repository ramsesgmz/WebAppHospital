import { Component, ErrorInfo, ReactNode } from 'react'
import { captureException } from '@/lib/sentry'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    captureException(error, { extra: errorInfo })
  }

  public render() {
    if (this.state.hasError) {
      return <h1>Lo sentimos, algo salió mal.</h1>
    }

    return this.props.children
  }
} 