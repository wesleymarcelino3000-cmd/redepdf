'use client';

import { useEffect, useMemo, useState } from 'react';
import './style.css';

function formatBytes(bytes = 0) {
  if (!bytes) return '0 B';
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

function cleanName(pathname = '') {
  return pathname.replace('pdfs/', '').replace(/^\d+-/, '').replace(/-[a-zA-Z0-9]+(?=\.pdf$)/, '').replaceAll('_', ' ');
}

export default function Home() {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  async function loadFiles() {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/list', { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao listar PDFs');
      setFiles(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(e) {
    const list = Array.from(e.target.files || []).filter((file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'));
    setSelectedFiles(list);
    setProgress(0);
    setMessage(list.length ? `${list.length} PDF(s) selecionado(s)` : 'Selecione apenas arquivos PDF');
  }

  async function uploadFiles() {
    if (!selectedFiles.length) {
      setMessage('Selecione um ou mais PDFs primeiro.');
      return;
    }

    setUploading(true);
    setProgress(8);
    setMessage('Enviando arquivos...');

    const fakeProgress = setInterval(() => {
      setProgress((old) => (old < 88 ? old + 6 : old));
    }, 250);

    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append('files', file));

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao enviar PDFs');

      setProgress(100);
      setMessage(`${data.uploads?.length || selectedFiles.length} PDF(s) enviado(s) com sucesso.`);
      setSelectedFiles([]);
      await loadFiles();
    } catch (error) {
      setMessage(error.message);
    } finally {
      clearInterval(fakeProgress);
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 900);
    }
  }

  async function deleteFile(file) {
    const ok = confirm(`Excluir este PDF?\n\n${cleanName(file.pathname)}`);
    if (!ok) return;

    setMessage('Excluindo arquivo...');
    try {
      const res = await fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: file.url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao excluir PDF');
      setMessage('PDF excluído com sucesso.');
      await loadFiles();
    } catch (error) {
      setMessage(error.message);
    }
  }

  const filteredFiles = useMemo(() => {
    return files.filter((file) => cleanName(file.pathname).toLowerCase().includes(search.toLowerCase()));
  }, [files, search]);

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <main className="page">
      <section className="hero">
        <div>
          <span className="badge">Servidor de PDFs</span>
          <h1>RedePDF Premium</h1>
          <p>Envie, organize, abra, baixe e exclua PDFs salvos online no Vercel Blob.</p>
        </div>
        <div className="stats">
          <div><strong>{files.length}</strong><span>PDFs</span></div>
          <div><strong>{formatBytes(files.reduce((sum, item) => sum + (item.size || 0), 0))}</strong><span>Total</span></div>
        </div>
      </section>

      <section className="card upload-card">
        <div className="card-title">
          <div>
            <h2>Enviar novos PDFs</h2>
            <p>Selecione vários arquivos de uma vez.</p>
          </div>
          <button className="secondary" onClick={loadFiles} disabled={loading}>{loading ? 'Atualizando...' : 'Atualizar'}</button>
        </div>

        <label className="dropzone">
          <input type="file" accept="application/pdf,.pdf" multiple onChange={handleSelect} />
          <div className="drop-icon">📄</div>
          <strong>Clique para escolher PDFs</strong>
          <span>{selectedFiles.length ? `${selectedFiles.length} arquivo(s) pronto(s) para envio` : 'Upload múltiplo habilitado'}</span>
        </label>

        {selectedFiles.length > 0 && (
          <div className="selected-list">
            {selectedFiles.map((file, index) => (
              <div className="selected-item" key={`${file.name}-${index}`}>
                <span>{file.name}</span>
                <small>{formatBytes(file.size)}</small>
              </div>
            ))}
          </div>
        )}

        <button className="primary" onClick={uploadFiles} disabled={uploading || !selectedFiles.length}>
          {uploading ? 'Enviando...' : 'Enviar PDF(s)'}
        </button>

        {uploading && (
          <div className="progress-wrap">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
            <span>{progress}%</span>
          </div>
        )}

        {message && <p className="message">{message}</p>}
      </section>

      <section className="card">
        <div className="card-title">
          <div>
            <h2>Arquivos disponíveis</h2>
            <p>Pesquise, abra, baixe ou exclua seus PDFs.</p>
          </div>
          <input className="search" placeholder="Buscar PDF..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="file-grid">
          {filteredFiles.length === 0 ? (
            <div className="empty">Nenhum PDF encontrado.</div>
          ) : (
            filteredFiles.map((file) => (
              <article className="file-card" key={file.url}>
                <div className="file-top">
                  <div className="pdf-icon">PDF</div>
                  <button className="delete" onClick={() => deleteFile(file)} title="Excluir">🗑️</button>
                </div>
                <h3 title={cleanName(file.pathname)}>{cleanName(file.pathname)}</h3>
                <p>{formatBytes(file.size)} • {file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString('pt-BR') : 'Online'}</p>
                <div className="actions">
                  <a href={file.url} target="_blank" rel="noreferrer">Abrir</a>
                  <a href={file.url} download>Baixar</a>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
