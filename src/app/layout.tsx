import type { Metadata } from 'next';
import './globals.css';
import Navigation from '@/components/Navigation';
import MathBackground from '@/components/MathBackground';

export const metadata: Metadata = {
  title: 'MindGrid',
  description: 'Challenge Your Mind',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <MathBackground />
        <Navigation />
        <main style={{ position: 'relative', zIndex: 1, minHeight: 'calc(100vh - var(--nav-height, 64px))', paddingTop: 'var(--nav-height, 64px)', display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
