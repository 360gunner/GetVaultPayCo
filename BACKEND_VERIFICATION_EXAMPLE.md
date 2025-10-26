# Backend Verification - Cloudflare Turnstile

## ⚠️ IMPORTANT: Server-Side Validation is MANDATORY

The client-side widget alone does NOT provide protection. You MUST validate tokens on your backend because:
- Tokens can be forged by attackers
- Tokens expire after 5 minutes (300 seconds)
- Tokens are single-use and cannot be validated twice

## Your Keys

**Site Key (Frontend):** `0x4AAAAAAB8pu5AbnI8uAM9O`  
**Secret Key (Backend):** `0x4AAAAAAB8puzgPNEqyribO7RwqecvvnSk`

## Implementation Examples

### Node.js / Express Example

```javascript
const express = require('express');
const app = express();

const TURNSTILE_SECRET_KEY = '0x4AAAAAAB8puzgPNEqyribO7RwqecvvnSk';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Validation function
async function verifyTurnstileToken(token, remoteip) {
  const formData = new FormData();
  formData.append('secret', TURNSTILE_SECRET_KEY);
  formData.append('response', token);
  formData.append('remoteip', remoteip);

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Turnstile validation error:', error);
    return { success: false, 'error-codes': ['internal-error'] };
  }
}

// Signup endpoint
app.post('/api/signup', async (req, res) => {
  const { 
    email, 
    password, 
    firstName, 
    lastName,
    username,
    dateOfBirth,
    country,
    homeAddress,
    postalCode,
    acceptTos,
    acceptMarketing,
    captchaToken  // This is the Turnstile token from frontend
  } = req.body;

  // Get user's IP address
  const remoteip = req.headers['cf-connecting-ip'] || 
                   req.headers['x-forwarded-for'] || 
                   req.connection.remoteAddr;

  // 1. VERIFY TURNSTILE TOKEN
  if (!captchaToken) {
    return res.status(400).json({
      success: false,
      error: 'Missing captcha token'
    });
  }

  const verification = await verifyTurnstileToken(captchaToken, remoteip);

  if (!verification.success) {
    console.log('Turnstile verification failed:', verification['error-codes']);
    return res.status(400).json({
      success: false,
      error: 'Captcha verification failed',
      errorCodes: verification['error-codes']
    });
  }

  // 2. VERIFY OTHER REQUIRED FIELDS
  if (!email || !password || !acceptTos) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    });
  }

  // 3. CREATE USER ACCOUNT
  try {
    // TODO: Your user creation logic here
    // - Hash password
    // - Save to database
    // - Send verification email
    
    console.log('User signup successful:', {
      email,
      username,
      hostname: verification.hostname,
      challenge_ts: verification.challenge_ts
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      userId: 'user_123' // Replace with actual user ID
    });

  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error during signup'
    });
  }
});

app.listen(3001, () => {
  console.log('Backend server running on port 3001');
});
```

### Next.js API Route Example

Create: `/app/api/signup/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

const TURNSTILE_SECRET_KEY = '0x4AAAAAAB8puzgPNEqyribO7RwqecvvnSk';

async function verifyTurnstileToken(token: string, remoteip: string) {
  const formData = new FormData();
  formData.append('secret', TURNSTILE_SECRET_KEY);
  formData.append('response', token);
  formData.append('remoteip', remoteip);

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    });

    return await response.json();
  } catch (error) {
    console.error('Turnstile validation error:', error);
    return { success: false, 'error-codes': ['internal-error'] };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { captchaToken, email, password, ...otherData } = body;

    // Get user's IP
    const remoteip = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    // Verify Turnstile
    if (!captchaToken) {
      return NextResponse.json(
        { success: false, error: 'Missing captcha token' },
        { status: 400 }
      );
    }

    const verification = await verifyTurnstileToken(captchaToken, remoteip);

    if (!verification.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Captcha verification failed',
          errorCodes: verification['error-codes']
        },
        { status: 400 }
      );
    }

    // TODO: Create user account
    // - Validate other fields
    // - Hash password
    // - Save to database

    return NextResponse.json({
      success: true,
      message: 'Account created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
```

### Frontend Integration

Update your `handleNext` function to send data to backend:

```typescript
case 9:
  if (!formData.acceptTos) {
    setErrors({ tos: "You must accept the terms of service" });
    return;
  }
  if (!captchaToken) {
    setErrors({ captcha: "Please complete the security verification" });
    return;
  }

  // Send to backend API
  try {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...formData,
        captchaToken: captchaToken,
      }),
    });

    const data = await response.json();

    if (data.success) {
      localStorage.setItem("signupCountry", formData.country);
      setShowSuccess(true);
    } else {
      setErrors({ captcha: data.error || 'Signup failed' });
    }
  } catch (error) {
    console.error('Signup error:', error);
    setErrors({ captcha: 'Network error. Please try again.' });
  }
  return;
```

## Response Format

### Success Response
```json
{
  "success": true,
  "challenge_ts": "2024-01-01T12:00:00.000Z",
  "hostname": "localhost",
  "error-codes": [],
  "action": "signup",
  "cdata": ""
}
```

### Failed Response
```json
{
  "success": false,
  "error-codes": ["invalid-input-response"]
}
```

## Error Codes

| Error Code | Description | Action |
|------------|-------------|--------|
| `missing-input-secret` | Secret not provided | Check secret key |
| `invalid-input-secret` | Invalid secret key | Verify key in dashboard |
| `missing-input-response` | Token not provided | Ensure token is sent |
| `invalid-input-response` | Invalid/expired token | User must retry |
| `timeout-or-duplicate` | Token already used | Each token is single-use |
| `internal-error` | Server error | Retry the request |

## Best Practices

1. **Always verify on backend** - Never trust client-side validation
2. **Check token freshness** - Tokens expire after 5 minutes
3. **Store secret securely** - Use environment variables
4. **Log failures** - Track suspicious patterns
5. **Handle errors gracefully** - Show user-friendly messages
6. **Use HTTPS** - Always validate over secure connections
7. **Single use** - Each token can only be validated once

## Environment Variables

Create `.env.local`:
```
TURNSTILE_SECRET_KEY=0x4AAAAAAB8puzgPNEqyribO7RwqecvvnSk
```

## Testing

Use testing secret key for development:
```
Testing Secret: 1x0000000000000000000000000000000AA
```

## Resources

- API Endpoint: `https://challenges.cloudflare.com/turnstile/v0/siteverify`
- Documentation: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- Dashboard: https://dash.cloudflare.com/
