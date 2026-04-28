import { put } from '@vercel/blob';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return Response.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    const uploads = [];

    for (const file of files) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        continue;
      }

      const safeName = file.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9._-]/g, '_');

      const blob = await put(`pdfs/${Date.now()}-${safeName}`, file, {
        access: 'public',
        addRandomSuffix: true,
      });

      uploads.push(blob);
    }

    return Response.json({ success: true, uploads });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
