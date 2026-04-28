import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: 'Variável BLOB_READ_WRITE_TOKEN não encontrada no Vercel.' }, { status: 500 });
    }

    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL não enviada.' }, { status: 400 });
    }

    await del(url);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Erro ao excluir PDF.' }, { status: 500 });
  }
}
