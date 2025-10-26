# Cloudflare Turnstile Configuration

## Implementation Details

This project uses **Explicit Rendering** for Cloudflare Turnstile, which provides better control in React/Next.js applications.

### Script Loading
```html
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>
```

### Widget Rendering
The widget is rendered programmatically using `turnstile.render()` when the user reaches step 9 of the signup flow.

## Keys

### Site Key (Frontend)
```
0x4AAAAAAB8pu5AbnI8uAM9O
```
This key is already configured in: `app/signup/page.tsx`

### Secret Key (Backend - DO NOT COMMIT TO FRONTEND)
```
0x4AAAAAAB8puzgPNEqyribO7RwqecvvnSk
```
⚠️ **Important:** This secret key should ONLY be used on your backend server to verify the captcha token.

## How to Verify (Backend)

When the user submits the form, you'll receive a captcha token. Verify it on your backend:

```javascript
// Example verification endpoint
async function verifyCaptcha(token) {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      secret: '0x4AAAAAAB8puzgPNEqyribO7RwqecvvnSk',
      response: token,
    }),
  });
  
  const data = await response.json();
  return data.success; // true if valid, false if invalid
}
```

### Verification Response
```json
{
  "success": true,
  "challenge_ts": "2024-01-01T12:00:00Z",
  "hostname": "example.com",
  "error-codes": [],
  "action": "signup",
  "cdata": "session_data"
}
```

## Token Lifecycle

- **Expiration**: Tokens expire after 300 seconds (5 minutes)
- **Single Use**: Each token can only be validated once
- **Must Validate**: Server-side validation is mandatory

## Testing

Use the testing sitekey for development:
```
1x00000000000000000000AA (Always passes)
2x00000000000000000000AB (Always blocks)
3x00000000000000000000FF (Forces interactive challenge)
```

## Resources
- Cloudflare Turnstile Docs: https://developers.cloudflare.com/turnstile/
- Client-Side Rendering: https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
- Dashboard: https://dash.cloudflare.com/

## Note
You can change these keys later in the Cloudflare dashboard and update them in `app/signup/page.tsx`.
