import localFont from "next/font/local";
import "./globals.css";
import Script from 'next/script'
import { AuthProvider } from '@/src/contexts/AuthContext'
import { NotificationProvider } from '@/src/contexts/NotificationContext'
import NotificationBell from '@/src/components/notifications/NotificationBell'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Hospital App",
  description: "Sistema de control de acceso hospitalario",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta httpEquiv="Content-Security-Policy" content="script-src 'self' 'unsafe-eval' 'unsafe-inline' https://unpkg.com" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        <Script 
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossOrigin=""
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <NotificationProvider>
            <div id="app">
              <NotificationBell />
              {children}
            </div>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
