import { NextRequest, NextResponse } from 'next/server';

export const dynamic = "force-static";
export const revalidate = 0;

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

    const response = await fetch(`${dokanApiUrl}/products`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Dokan products API error:', response.status);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch products' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('Products API error:', error);
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

    // Transform payload to match Dokan API expected format
    const dokanPayload = {
      name: body.name,
      type: body.type || 'simple',
      regular_price: body.regular_price,
      description: body.description,
      short_description: body.short_description,
      categories: body.categories || [],
      images: body.images || [],
      downloadable: body.downloadable !== false,
      download_limit: body.download_limit || -1,
      download_expiry: body.download_expiry || -1,
      downloads: body.downloads || [],
      status: 'publish'
    };

    console.log('Creating product with payload:', JSON.stringify(dokanPayload, null, 2));

    const authString = Buffer.from(`${apiUsername}:${apiPassword}`).toString('base64');

    const response = await fetch(`${dokanApiUrl}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dokanPayload),
    });

    if (!response.ok) {
      console.error('Dokan products create API error:', response.status);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      return NextResponse.json(
        { success: false, message: 'Failed to create product' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });

  } catch (error) {
    console.error('Products create API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
