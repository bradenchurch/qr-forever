import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { qrCode } from '@/lib/schema';
import { eq, and } from 'drizzle-orm';
import { headers } from 'next/headers';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const qr = await db.query.qrCode.findFirst({
      where: and(
        eq(qrCode.id, id),
        eq(qrCode.userId, session.user.id)
      ),
    });

    if (!qr) {
      return NextResponse.json({ error: 'QR Code not found' }, { status: 404 });
    }

    return NextResponse.json(qr);
  } catch (error) {
    console.error('Error fetching QR code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, formData, styling } = body;

    const updateData: Partial<typeof qrCode.$inferInsert> = { updatedAt: new Date() };
    if (name) updateData.name = name;
    if (formData) updateData.formData = typeof formData === 'string' ? formData : JSON.stringify(formData);
    if (styling) updateData.styling = typeof styling === 'string' ? styling : JSON.stringify(styling);

    const result = await db.update(qrCode)
      .set(updateData)
      .where(and(
        eq(qrCode.id, id),
        eq(qrCode.userId, session.user.id)
      ))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: 'QR Code not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error('Error updating QR code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await db.delete(qrCode)
      .where(and(
        eq(qrCode.id, id),
        eq(qrCode.userId, session.user.id)
      ))
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: 'QR Code not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting QR code:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
