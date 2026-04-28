import { del } from '@vercel/blob';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const { url } = await req.json();

    if (!url) {
      return Response.json({ error: 'URL não informada' }, { status: 400 });
    }

    await del(url);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
