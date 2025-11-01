import { NextRequest, NextResponse } from 'next/server';

// Type definitions for Dokan vendor creation
interface DokanVendorRequest {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  store_name: string;
  phone: string;
  address: {
    street_1: string;
    city: string;
    zip: string;
    state: string;
    country: string;
  };
  payment?: {
    bank?: {
      ac_name?: string;
      ac_number?: string;
      bank_name?: string;
      bank_addr?: string;
      routing_number?: string;
      iban?: string;
      swift?: string;
    };
  };
  social?: {
    fb?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  ein?: string;
}

interface DokanVendorResponse {
  success: boolean;
  vendor_id?: number;
  message: string;
  error?: string;
  data?: any;
}

/**
 * POST /api/create-dokan-vendor
 * Creates a vendor account in Dokan after business signup
 */
export async function POST(request: NextRequest) {
  // Wrap everything to ensure we ALWAYS return JSON
  try {
    console.log('=== Dokan Vendor Creation API Called ===');
    
    // Parse request body
    let body: DokanVendorRequest;
    try {
      body = await request.json();
      console.log('Request body parsed:', { email: body.email, store_name: body.store_name });
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request body',
          error: 'INVALID_REQUEST',
        } as DokanVendorResponse,
        { status: 400 }
      );
    }
    
    // Get Dokan API credentials from environment
    console.log('Checking environment variables...');
    console.log('DOKAN_API_URL exists:', !!process.env.DOKAN_API_URL);
    console.log('DOKAN_API_USERNAME exists:', !!process.env.DOKAN_API_USERNAME);
    console.log('DOKAN_API_PASSWORD exists:', !!process.env.DOKAN_API_PASSWORD);
    const dokanApiUrl = process.env.DOKAN_API_URL || 'https://vaultpay.shop/wp-json/dokan/v1';
    const dokanUsername = process.env.DOKAN_API_USERNAME;
    const dokanPassword = process.env.DOKAN_API_PASSWORD;

    if (!dokanUsername || !dokanPassword) {
      console.error('Dokan API credentials not configured');
      
      // In development, return mock success
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({
          success: true,
          vendor_id: Math.floor(Math.random() * 10000),
          message: 'Development mode: Vendor account created (mock)',
          data: {
            username: body.username || body.email.split('@')[0],
            email: body.email,
            store_name: body.store_name,
          },
        } as DokanVendorResponse);
      }

      return NextResponse.json(
        {
          success: false,
          message: 'Dokan API not configured',
          error: 'SERVICE_UNAVAILABLE',
        } as DokanVendorResponse,
        { status: 503 }
      );
    }

    // Generate username with fallback logic - GUARANTEES valid username
    let username = '';
    
    // Try 1: Use provided username (cleaned)
    if (body.username && body.username.trim()) {
      username = body.username
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, '')
        .substring(0, 60);
    }
    
    // Try 2: Generate from store name (cleaned)
    if (!username && body.store_name && body.store_name.trim()) {
      username = body.store_name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/gi, '')
        .replace(/\s+/g, '')
        .substring(0, 60);
    }
    
    // Try 3: Generate from email local part (before @)
    if (!username && body.email) {
      username = body.email.split('@')[0]
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, '')
        .substring(0, 60);
    }
    
    // Try 4: Generate from first and last name
    if (!username && (body.first_name || body.last_name)) {
      username = `${body.first_name || ''}${body.last_name || ''}`
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, '')
        .substring(0, 60);
    }
    
    // Fallback 5: Use timestamp-based username as last resort
    if (!username || username.length < 3) {
      username = `vendor${Date.now()}`.substring(0, 60);
    }
    
    console.log('Generated username:', username, 'Length:', username.length);
    
    // Generate a random password (will be sent to user via email by WordPress)
    const randomPassword = generateRandomPassword();

    // Prepare vendor payload for POST /dokan/v1/stores
    const vendorPayload = {
      user_login: username,  // ⚠️ CRITICAL: Dokan expects user_login, not username
      user_pass: randomPassword,
      user_email: body.email,
      store_name: body.store_name,
      first_name: body.first_name || body.store_name.split(' ')[0] || '',
      last_name: body.last_name || body.store_name.split(' ').slice(1).join(' ') || '',
      phone: body.phone || '',
      address: {
        street_1: body.address?.street_1 || '',
        city: body.address?.city || '',
        zip: body.address?.zip || '',
        state: body.address?.state || '',
        country: body.address?.country || 'US',
      },
    };

    console.log('Creating Dokan vendor:', { 
      email: body.email, 
      store_name: body.store_name,
      username: username,
      endpoint: `${dokanApiUrl}/stores` 
    });
    console.log('Full vendor payload:', JSON.stringify(vendorPayload, null, 2));

    // Create Basic Auth header
    const authHeader = 'Basic ' + Buffer.from(`${dokanUsername}:${dokanPassword}`).toString('base64');

    // Create vendor using POST /dokan/v1/stores
    let response;
    try {
      response = await fetch(`${dokanApiUrl}/stores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader,
        },
        body: JSON.stringify(vendorPayload),
      });
    } catch (fetchError) {
      console.error('Failed to connect to Dokan API:', fetchError);
      return NextResponse.json(
        {
          success: false,
          message: 'Unable to connect to vendor registration service',
          error: 'CONNECTION_FAILED',
        } as DokanVendorResponse,
        { status: 503 }
      );
    }

    // Check response content type
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!response.ok) {
      let errorData: any = {};
      
      if (isJson) {
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
        }
      } else {
        try {
          const errorText = await response.text();
          console.error('Non-JSON error response:', errorText.substring(0, 300));
          errorData = { message: 'Invalid response from server' };
        } catch (textError) {
          console.error('Failed to read error response:', textError);
        }
      }

      console.error('Dokan vendor creation failed:', response.status, errorData);

      // Handle specific error cases
      if (response.status === 400 && errorData.message?.includes('email')) {
        return NextResponse.json({
          success: false,
          message: 'This email address is already registered',
          error: 'ALREADY_EXISTS',
        } as DokanVendorResponse);
      }

      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          {
            success: false,
            message: 'Authentication failed with vendor service',
            error: 'AUTH_FAILED',
          } as DokanVendorResponse,
          { status: 503 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: errorData.message || 'Failed to create vendor account',
          error: 'CREATION_FAILED',
        } as DokanVendorResponse,
        { status: response.status }
      );
    }

    // Parse successful vendor creation response
    let vendorData;
    if (isJson) {
      try {
        vendorData = await response.json();
      } catch (parseError) {
        console.error('Failed to parse vendor creation response:', parseError);
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid response from vendor service',
            error: 'INVALID_RESPONSE',
          } as DokanVendorResponse,
          { status: 502 }
        );
      }
    } else {
      console.error('Expected JSON response but got:', contentType);
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid response format from vendor service',
          error: 'INVALID_RESPONSE_FORMAT',
        } as DokanVendorResponse,
        { status: 502 }
      );
    }

    console.log('Dokan vendor created successfully:', vendorData);

    return NextResponse.json({
      success: true,
      vendor_id: vendorData.id || vendorData.ID,
      message: 'Vendor account created successfully',
      data: {
        vendor_id: vendorData.id || vendorData.ID,
        username: username,
        email: body.email,
        store_name: body.store_name,
        store_url: vendorData.store_url || `${dokanApiUrl.replace('/wp-json/dokan/v1', '')}/store/${username}`,
      },
    } as DokanVendorResponse);

  } catch (outerError) {
    // Outer catch - ensures we ALWAYS return JSON even for unexpected errors
    console.error('=== CRITICAL: Unexpected Error in API Route ===');
    console.error('Error:', outerError);
    console.error('Stack:', outerError instanceof Error ? outerError.stack : 'No stack');
    
    return NextResponse.json(
      {
        success: false,
        message: 'Critical error in vendor creation service',
        error: 'CRITICAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? String(outerError) : undefined,
      } as DokanVendorResponse,
      { status: 500 }
    );
  }
}

/**
 * Generate a random secure password
 */
function generateRandomPassword(length: number = 16): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'Dokan Vendor Creation',
    timestamp: new Date().toISOString(),
  });
}
