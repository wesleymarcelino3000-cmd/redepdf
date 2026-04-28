import { list } from '@vercel/blob';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'pdfs/' });
    const sorted = blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    return Response.json(sorted);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
