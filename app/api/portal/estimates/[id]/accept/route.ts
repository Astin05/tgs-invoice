import { NextRequest, NextResponse } from 'next/server';
import { acceptEstimate, declineEstimate } from '@/app/lib/db-services';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const estimateId = params.id;
    const { comments } = await request.json();

    const { error } = await acceptEstimate(estimateId, comments);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to accept estimate' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Estimate accepted successfully',
    });
  } catch (error) {
    console.error('Error accepting estimate:', error);
    return NextResponse.json(
      { error: 'Failed to accept estimate' },
      { status: 500 }
    );
  }
}
