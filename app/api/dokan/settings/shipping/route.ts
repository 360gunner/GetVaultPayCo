import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const dokanApiUrl = process.env.DOKAN_API_URL || 'https://vaultpay.shop/wp-json/dokan/v1';
    const apiUsername = process.env.DOKAN_API_USERNAME;
    const apiPassword = process.env.DOKAN_API_PASSWORD;

    if (!apiUsername || !apiPassword) {
      return NextResponse.json(
        { success: false, message: 'API credentials not configured' },
        { status: 500 }
      );
    }

    const authString = Buffer.from(`${apiUsername}:${apiPassword}`).toString('base64');

    const response = await fetch(`${dokanApiUrl}/settings/shipping`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Dokan shipping settings API error:', response.status);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch shipping settings' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('Shipping settings API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const dokanApiUrl = process.env.DOKAN_API_URL || 'https://vaultpay.shop/wp-json/dokan/v1';
    const apiUsername = process.env.DOKAN_API_USERNAME;
    const apiPassword = process.env.DOKAN_API_PASSWORD;

    if (!apiUsername || !apiPassword) {
      return NextResponse.json(
        { success: false, message: 'API credentials not configured' },
        { status: 500 }
      );
    }

    const authString = Buffer.from(`${apiUsername}:${apiPassword}`).toString('base64');

    const response = await fetch(`${dokanApiUrl}/settings/shipping`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('Dokan shipping settings update API error:', response.status);
      return NextResponse.json(
        { success: false, message: 'Failed to update shipping settings' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('Shipping settings update API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
