'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function loadFiles() {
    try {
      const res = await fetch('/api/files', { cache: 'no-store' });
      const data = await res.json();
      setFiles(data.files || []);
    } catch (err) {
      setMessage('Erro ao carregar PDFs.');
    }
  }

  useEffect(() => {
    loadFiles();
  }, []);

  async function handleUpload(e) {
    e.preventDefault();
    const file = e.target.pdf.files[0];

    if (!file) {
      setMessage('Escolha um PDF.');
      return;
    }

    if (file.type !== 'application/pdf') {
      setMessage('Envie apenas arquivo PDF.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setMessage('Enviando PDF...');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro no upload.');
      }

      e.target.reset();
      setMessage('PDF enviado com sucesso.');
      await loadFiles();
    } catch (err) {
      setMessage(err.message || 'Erro ao enviar PDF.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(url) {
    const ok = confirm('Deseja excluir este PDF?');
    if (!ok) return;

    setLoading(true);
    setMessage('Excluindo PDF...');

    try {
      const res = await fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao excluir.');
      }

      setMessage('PDF excluído com sucesso.');
      await loadFiles();
    } catch (err) {
      setMessage(err.message || 'Erro ao excluir PDF.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="hero">
        <div>
          <span className="badge">Servidor de PDFs</span>
          <h1>RedePDF</h1>
          <p>Envie, organize, abra e baixe seus PDFs online usando Vercel Blob.</p>
        </div>
      </section>

      <section className="card upload-card">
        <h2>Enviar novo PDF</h2>
        <form onSubmit={handleUpload}>
          <input name="pdf" type="file" accept="application/pdf" />
          <button disabled={loading}>{loading ? 'Aguarde...' : 'Enviar PDF'}</button>
        </form>
        {message && <p className="message">{message}</p>}
      </section>

      <section className="card">
        <div className="list-head">
          <h2>Arquivos disponíveis</h2>
          <button className="ghost" onClick={loadFiles} disabled={loading}>Atualizar</button>
        </div>

        {files.length === 0 ? (
          <p className="empty">Nenhum PDF enviado ainda.</p>
        ) : (
          <div className="file-list">
            {files.map((file) => (
              <div className="file-item" key={file.url}>
                <div>
                  <strong>{file.pathname.replace('pdfs/', '')}</strong>
                  <small>{new Date(file.uploadedAt).toLocaleString('pt-BR')}</small>
                </div>
                <div className="actions">
                  <a href={file.url} target="_blank">Abrir</a>
                  <a href={file.url} download>Baixar</a>
                  <button onClick={() => handleDelete(file.url)} disabled={loading}>Excluir</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
