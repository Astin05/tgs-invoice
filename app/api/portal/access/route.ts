import { NextRequest, NextResponse } from 'next/server';
import { requestPortalAccess } from '@/app/lib/db-services';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const { data, error } = await requestPortalAccess(email);

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    // In a real app, you would send an email here
    // For now, we'll just return the token in the response
    console.log('Magic link token:', data?.token);

    return NextResponse.json({
      success: true,
      message: 'Access link sent successfully',
      token: data?.token, // Remove this in production, use email instead
    });
  } catch (error) {
    console.error('Error requesting portal access:', error);
    return NextResponse.json(
      { error: 'Failed to send access link' },
      { status: 500 }
    );
  }
}
