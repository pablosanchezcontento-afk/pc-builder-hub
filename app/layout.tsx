import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PC Builder Hub',
  description: 'Multi-language PC component comparison and builder platform with official specs',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
