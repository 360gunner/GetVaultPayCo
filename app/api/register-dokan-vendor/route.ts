import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Proxying Dokan vendor registration request...');
    console.log('Full request body:', JSON.stringify(body, null, 2));
    console.log('Username:', body.username, 'Length:', body.username?.length);
    console.log('Password provided:', !!body.password);

    // Call Dokan API from server-side (no CORS issues)
    const dokanApiUrl = 'https://vaultpay.shop/wp-json/dokan/v1/stores';
    
    // Get authentication from environment variables
    const apiUsername = process.env.DOKAN_API_USERNAME;
    const apiPassword = process.env.DOKAN_API_PASSWORD;
    
    if (!apiUsername || !apiPassword) {
      console.error('Missing Dokan API credentials');
      return NextResponse.json(
        {
          success: false,
          message: 'API credentials not configured. Please contact support.',
        },
        { status: 500 }
      );
    }
    
    // Transform payload to match Dokan API expected format
    const dokanPayload = {
      user_login: body.username,  // ✅ Dokan expects user_login, not username
      user_pass: body.password,
      user_email: body.email,
      store_name: body.store_name,
      first_name: body.first_name,
      last_name: body.last_name,
      phone: body.phone,
      address: body.address,
      social: body.social,
    };
    
    console.log('🚀 Transformed Dokan payload:', JSON.stringify(dokanPayload, null, 2));
    
    // Create Basic Auth header
    const authString = Buffer.from(`${apiUsername}:${apiPassword}`).toString('base64');
    
    const response = await fetch(dokanApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`,
      },
      body: JSON.stringify(dokanPayload),
    });

    console.log('Dokan API response status:', response.status);
    console.log('Dokan API response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Raw response:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed response data:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid response from Dokan API: ' + responseText.substring(0, 200),
        },
        { status: 500 }
      );
    }

    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: {
          vendor_id: data.id,
          username: body.username,
          email: body.email,
          store_name: body.store_name,
          store_url: data.store_url || `https://vaultpay.shop/store/${body.username}`,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: data.message || 'Failed to register vendor',
        },
        { status: response.status }
      );
    }
  } catch (error: any) {
    console.error('Dokan vendor registration error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
