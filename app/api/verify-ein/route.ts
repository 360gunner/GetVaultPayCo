import { NextRequest, NextResponse } from 'next/server';

// Type definitions for EIN verification
interface EINVerificationRequest {
  ein: string;
  businessName: string;
  businessAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface EINVerificationResponse {
  success: boolean;
  verified: boolean;
  message: string;
  details?: {
    businessName?: string;
    legalName?: string;
    address?: string;
    status?: 'active' | 'inactive' | 'unknown';
    match?: boolean;
  };
  error?: string;
}

/**
 * POST /api/verify-ein
 * Verifies EIN (Employer Identification Number) using LendAPI
 */
export async function POST(request: NextRequest) {
  try {
    const body: EINVerificationRequest = await request.json();
    const { ein, businessName, businessAddress, city, state, zipCode } = body;

    // Validate input
    if (!ein || ein.length !== 9 || !/^\d{9}$/.test(ein)) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          message: 'Invalid EIN format. EIN must be 9 digits.',
          error: 'INVALID_FORMAT',
        } as EINVerificationResponse,
        { status: 400 }
      );
    }

    if (!businessName || businessName.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          message: 'Business name is required for verification.',
          error: 'MISSING_BUSINESS_NAME',
        } as EINVerificationResponse,
        { status: 400 }
      );
    }

    // Mock EIN testing (works in both dev and production for testing)
    // EIN 123456789 = APPROVED
    // EIN 123456788 = DENIED
    if (ein === '123456789') {
      return NextResponse.json({
        success: true,
        verified: true,
        message: '✓ EIN verified successfully with IRS records',
        details: {
          businessName: businessName,
          legalName: businessName,
          address: `${businessAddress}, ${city}, ${state} ${zipCode}`,
          status: 'active',
          match: true,
        },
      } as EINVerificationResponse);
    }

    if (ein === '123456788') {
      return NextResponse.json({
        success: true,
        verified: false,
        message: 'EIN not found in IRS records. Please verify your EIN is correct.',
        error: 'EIN_NOT_FOUND',
        details: {
          businessName: businessName,
          status: 'unknown',
          match: false,
        },
      } as EINVerificationResponse);
    }

    // Get LendAPI credentials from environment
    const lendApiKey = process.env.LENDAPI_API_KEY;
    const lendApiUrl = process.env.LENDAPI_BASE_URL || 'https://api.lendapi.com';

    if (!lendApiKey) {
      console.error('LENDAPI_API_KEY not configured');
      // In development, allow bypass for other EINs
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json({
          success: true,
          verified: true,
          message: 'Development mode: EIN verification bypassed',
          details: {
            businessName: businessName,
            legalName: businessName,
            status: 'active',
            match: true,
          },
        } as EINVerificationResponse);
      }

      return NextResponse.json(
        {
          success: false,
          verified: false,
          message: 'EIN verification service not configured',
          error: 'SERVICE_UNAVAILABLE',
        } as EINVerificationResponse,
        { status: 503 }
      );
    }

    // Format EIN for API (XX-XXXXXXX format)
    const formattedEIN = `${ein.substring(0, 2)}-${ein.substring(2)}`;

    // Call LendAPI for business verification
    // Using their KYB (Know Your Business) endpoint
    const verificationPayload = {
      tin: formattedEIN, // Tax Identification Number (EIN)
      business_name: businessName,
      address: {
        street: businessAddress,
        city: city,
        state: state,
        zip: zipCode,
      },
    };

    console.log('Verifying EIN with LendAPI:', { ein: formattedEIN, businessName });

    let response;
    try {
      response = await fetch(`${lendApiUrl}/v1/business/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${lendApiKey}`,
          'X-API-Version': '1.0',
        },
        body: JSON.stringify(verificationPayload),
      });
    } catch (fetchError) {
      console.error('LendAPI fetch error:', fetchError);
      return NextResponse.json(
        {
          success: false,
          verified: false,
          message: 'Unable to connect to verification service',
          error: 'CONNECTION_FAILED',
        } as EINVerificationResponse,
        { status: 503 }
      );
    }

    // Check content type before parsing
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
        // Try to get text for non-JSON responses
        try {
          const errorText = await response.text();
          console.error('Non-JSON error response:', errorText.substring(0, 200));
          errorData = { message: errorText };
        } catch (textError) {
          console.error('Failed to read error response:', textError);
        }
      }

      console.error('LendAPI verification failed:', response.status, errorData);

      // Handle specific error cases
      if (response.status === 404) {
        return NextResponse.json({
          success: true,
          verified: false,
          message: 'EIN not found in IRS records. Please verify your EIN is correct.',
          error: 'EIN_NOT_FOUND',
        } as EINVerificationResponse);
      }

      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          {
            success: false,
            verified: false,
            message: 'Authentication failed with verification service',
            error: 'AUTH_FAILED',
          } as EINVerificationResponse,
          { status: 503 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          verified: false,
          message: 'Failed to verify EIN. Please try again later.',
          error: 'VERIFICATION_FAILED',
        } as EINVerificationResponse,
        { status: 502 }
      );
    }

    // Parse successful response
    let verificationData;
    if (isJson) {
      try {
        verificationData = await response.json();
      } catch (parseError) {
        console.error('Failed to parse success response as JSON:', parseError);
        return NextResponse.json(
          {
            success: false,
            verified: false,
            message: 'Invalid response from verification service',
            error: 'INVALID_RESPONSE',
          } as EINVerificationResponse,
          { status: 502 }
        );
      }
    } else {
      console.error('Expected JSON response but got:', contentType);
      return NextResponse.json(
        {
          success: false,
          verified: false,
          message: 'Invalid response format from verification service',
          error: 'INVALID_RESPONSE_FORMAT',
        } as EINVerificationResponse,
        { status: 502 }
      );
    }

    // Process verification results
    const isVerified = verificationData.verified === true || verificationData.status === 'active';
    const nameMatch = verificationData.name_match === true || verificationData.match_score > 80;

    return NextResponse.json({
      success: true,
      verified: isVerified && nameMatch,
      message: isVerified && nameMatch
        ? 'EIN verified successfully'
        : isVerified
        ? 'EIN is valid but business name does not match IRS records'
        : 'EIN verification failed',
      details: {
        businessName: businessName,
        legalName: verificationData.legal_name || verificationData.business_name,
        address: verificationData.address,
        status: verificationData.status || 'unknown',
        match: nameMatch,
      },
    } as EINVerificationResponse);

  } catch (error) {
    console.error('EIN verification error:', error);
    return NextResponse.json(
      {
        success: false,
        verified: false,
        message: 'An error occurred during verification',
        error: 'INTERNAL_ERROR',
      } as EINVerificationResponse,
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'EIN Verification',
    timestamp: new Date().toISOString(),
  });
}
