import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', process.env.NEXT_PUBLIC_DOMAIN],
    }),
  ],
})

export const captureException = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, {
    extra: context,
  })
}

export const setUserContext = (user: any) => {
  Sentry.setUser({
    id: user?.id,
    email: user?.email,
    role: user?.role,
  })
} 