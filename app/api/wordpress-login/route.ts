import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    console.log('🔐 Attempting WordPress authentication for:', username);

    // Use Application Password authentication (WordPress standard for REST API)
    const authHeader = 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

    // Try multiple WordPress endpoints to verify authentication
    const endpoints = [
      'https://vaultpay.shop/wp-json/wp/v2/users/me',
      'https://vaultpay.shop/wp-json/dokan/v1/stores',
      'https://vaultpay.shop/wp-json/wp/v2/posts'
    ];

    let authenticated = false;
    let userData = null;
    let lastError = '';

    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 Testing endpoint: ${endpoint}`);

        const response = await fetch(endpoint, {
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
            'User-Agent': 'WordPress-API-Client'
          },
        });

        console.log(`📊 Response from ${endpoint}: ${response.status}`);

        if (response.ok) {
          console.log(`✅ Authentication successful with ${endpoint}`);
          authenticated = true;

          // Try to get user data if this is the users endpoint
          if (endpoint.includes('/users/me')) {
            try {
              userData = await response.json();
              console.log('👤 User data retrieved:', userData);
            } catch (e) {
              console.log('⚠️ Could not parse user data');
            }
          }
          break;

        } else if (response.status === 401) {
          console.log(`❌ Authentication failed for ${endpoint}: 401 Unauthorized`);
          lastError = 'Invalid Application Password. Please create an Application Password in WordPress → Users → Profile.';
        } else if (response.status === 403) {
          console.log(`🚫 Access forbidden for ${endpoint}: 403 (authenticated but restricted)`);
          // 403 means authenticated but no permission - this is actually success
          authenticated = true;
          userData = { name: username, restricted: true };
          break;
        } else {
          console.log(`⚠️ Unexpected response for ${endpoint}: ${response.status}`);
        }
      } catch (endpointError) {
        console.warn(`🚨 Endpoint ${endpoint} failed:`, endpointError);
        continue;
      }
    }

    if (authenticated) {
      console.log('🎉 WordPress authentication successful!');

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: userData || { name: username }
      });
    } else {
      console.log('❌ All authentication attempts failed');
      return NextResponse.json(
        { error: lastError || 'Authentication failed. Please try again.' },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error('💥 WordPress authentication error:', error);
    return NextResponse.json(
      { error: 'Server error during authentication. Please try again.' },
      { status: 500 }
    );
  }
}
