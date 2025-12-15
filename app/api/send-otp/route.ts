import { NextRequest, NextResponse } from 'next/server';

const otpStore = new Map<string, { otp: string; timestamp: number }>();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { status: false, message: 'Valid email required' },
        { status: 400 }
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    otpStore.set(email, {
      otp,
      timestamp: Date.now(),
    });

    console.log(`OTP for ${email}: ${otp}`);

    return NextResponse.json({
      status: true,
      message: 'OTP sent successfully',
      otp,
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { status: false, message: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');
  const otp = request.nextUrl.searchParams.get('otp');

  if (!email || !otp) {
    return NextResponse.json(
      { status: false, message: 'Email and OTP required' },
      { status: 400 }
    );
  }

  const stored = otpStore.get(email);

  if (!stored) {
    return NextResponse.json(
      { status: false, message: 'OTP not found or expired' },
      { status: 400 }
    );
  }

  const isExpired = Date.now() - stored.timestamp > 5 * 60 * 1000;

  if (isExpired) {
    otpStore.delete(email);
    return NextResponse.json(
      { status: false, message: 'OTP expired' },
      { status: 400 }
    );
  }

  if (stored.otp !== otp) {
    return NextResponse.json(
      { status: false, message: 'Invalid OTP' },
      { status: 400 }
    );
  }

  otpStore.delete(email);

  return NextResponse.json({
    status: true,
    message: 'OTP verified successfully',
  });
}
