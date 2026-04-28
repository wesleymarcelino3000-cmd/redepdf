export const metadata = {
  title: 'RedePDF Premium',
  description: 'Servidor premium de PDFs com Vercel Blob',
  icons: {
    icon: '/icon.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: '#07111f',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
