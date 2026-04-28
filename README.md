# RedePDF - Vercel Blob

Sistema simples para enviar, listar, abrir, baixar e excluir PDFs usando Next.js + Vercel Blob.

## Deploy no Vercel

1. Suba este projeto no GitHub.
2. Importe no Vercel.
3. Configure o projeto como Next.js.
4. Crie ou conecte um Vercel Blob público ao projeto.
5. Confira em Environment Variables se existe:

```env
BLOB_READ_WRITE_TOKEN
```

6. Clique em Redeploy.

## Rodar localmente

Crie `.env.local` com:

```env
BLOB_READ_WRITE_TOKEN=seu_token_do_vercel_blob
```

Depois rode:

```bash
npm install
npm run dev
```
