import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import RouteGuard from './components/RouteGuard';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Hombres de Blanco',
  description: 'Sistema de Gestión Hospitalaria',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <RouteGuard>
          {children}
        </RouteGuard>
        <Toaster />
      </body>
    </html>
  );
} 