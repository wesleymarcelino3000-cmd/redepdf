# RedePDF Premium

Sistema simples para Vercel + Vercel Blob.

## Estrutura obrigatória
- app/page.js
- app/api/upload/route.js
- app/api/list/route.js
- app/api/delete/route.js
- package.json

## Vercel Blob
Conecte o Blob Store ao projeto no Vercel com prefixo `BLOB`, para criar automaticamente a variável:

BLOB_READ_WRITE_TOKEN

Depois faça Redeploy.
