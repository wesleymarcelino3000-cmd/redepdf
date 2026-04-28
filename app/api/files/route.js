import { list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: 'Variável BLOB_READ_WRITE_TOKEN não encontrada no Vercel.', files: [] }, { status: 500 });
    }

    const result = await list({ prefix: 'pdfs/' });
    const files = (result.blobs || []).sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    return NextResponse.json({ files });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Erro ao listar PDFs.', files: [] }, { status: 500 });
  }
}
