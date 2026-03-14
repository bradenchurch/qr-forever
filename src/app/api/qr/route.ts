import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { qrCode } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { headers } from 'next/headers';

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userQrs = await db.query.qrCode.findMany({
      where: eq(qrCode.userId, session.user.id),
      orderBy: [desc(qrCode.createdAt)],
    });

    return NextResponse.json(userQrs);
  } catch (error) {
    console.error('Error fetching QR codes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, type, content, formData, styling } = body;

    if (!type || !content || !formData || !styling) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newQr = {
      id: crypto.randomUUID(),
      userId: session.user.id,
      name: name || 'Untitled QR',
      type,
      content,
      formData: typeof formData === 'string' ? formData : JSON.stringify(formData),
      styling: typeof styling === 'string' ? styling : JSON.stringify(styling),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(qrCode).values(newQr);

    return NextResponse.json(newQr);
  } catch (error) {
    console.error('Error saving QR code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
