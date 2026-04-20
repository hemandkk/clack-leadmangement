import { redirect } from 'next/navigation';

export default function RootPage() {
  // Middleware handles auth — this just ensures the root goes somewhere
  redirect('/login');
}