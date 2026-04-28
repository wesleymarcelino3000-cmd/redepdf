import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

function cleanFileName(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .toLowerCase();
}

export async function POST(request) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: 'Variável BLOB_READ_WRITE_TOKEN não encontrada no Vercel.' }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Envie apenas PDF.' }, { status: 400 });
    }

    const safeName = cleanFileName(file.name || 'arquivo.pdf');
    const pathname = `pdfs/${Date.now()}-${safeName}`;

    const blob = await put(pathname, file, {
      access: 'public',
      addRandomSuffix: false
    });

    return NextResponse.json({ ok: true, file: blob });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Erro interno no upload.' }, { status: 500 });
  }
}
