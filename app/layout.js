import './style.css';

export const metadata = {
  title: 'RedePDF',
  description: 'Servidor simples de PDFs com Vercel Blob'
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
