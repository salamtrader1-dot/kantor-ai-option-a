import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kantor AI Virtual — Option A',
  description: 'Interactive office dashboard with real-time animated leaderboard and activity feed',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
