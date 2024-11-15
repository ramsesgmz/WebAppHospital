import { redirect } from 'next/navigation';

export default function Home() {
  // Redirige automáticamente a /auth/login
  redirect('/auth/login');
}