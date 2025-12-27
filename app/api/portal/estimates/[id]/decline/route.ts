import { NextRequest, NextResponse } from 'next/server';
import { declineEstimate } from '@/app/lib/db-services';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estimateId } = await params;
    const { reason } = await request.json();

    const { error } = await declineEstimate(estimateId, reason);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to decline estimate' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Estimate declined successfully',
    });
  } catch (error) {
    console.error('Error declining estimate:', error);
    return NextResponse.json(
      { error: 'Failed to decline estimate' },
      { status: 500 }
    );
  }
}
