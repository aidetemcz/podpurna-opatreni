import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Asistent pro individualizaci výuky',
  description:
    'Konverzační asistent pro učitele — individualizace výuky žáků se SVP na základě Katalogu podpůrných opatření.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body>{children}</body>
    </html>
  );
}
