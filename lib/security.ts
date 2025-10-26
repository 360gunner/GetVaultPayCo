/**
 * Security utilities for VaultPay
 * Provides input validation, sanitization, and security helpers
 */

// Email validation with strict regex
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Sanitize string input to prevent XSS
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

// Validate and sanitize name input
export function sanitizeName(name: string): string {
  const sanitized = sanitizeString(name);
  // Allow only letters, spaces, hyphens, and apostrophes
  return sanitized.replace(/[^a-zA-Z\s'-]/g, '').slice(0, 100);
}

// Validate phone number (international format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone.replace(/[\s()-]/g, ''));
}

// Sanitize URL to prevent open redirect
export function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url, 'https://getvaultpay.co');
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '/';
    }
    return url;
  } catch {
    return '/';
  }
}

// Generate secure random token
export function generateToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}

// Validate password strength
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Sanitize form data object
export function sanitizeFormData<T extends Record<string, any>>(data: T): T {
  const sanitized = {} as T;
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeString(value) as any;
    } else {
      sanitized[key as keyof T] = value;
    }
  }
  
  return sanitized;
}

// Check for common SQL injection patterns
export function containsSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(--|\|\||;|\/\*|\*\/)/,
    /(\bOR\b\s+\d+\s*=\s*\d+)/gi,
    /(\bUNION\b.*\bSELECT\b)/gi,
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}

// Validate and sanitize contact form submission
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

export function validateContactForm(data: ContactFormData): {
  isValid: boolean;
  errors: Record<string, string>;
  sanitized: ContactFormData;
} {
  const errors: Record<string, string> = {};
  const sanitized: ContactFormData = {
    firstName: sanitizeName(data.firstName),
    lastName: sanitizeName(data.lastName),
    email: sanitizeString(data.email),
    subject: sanitizeString(data.subject).slice(0, 200),
    message: sanitizeString(data.message).slice(0, 2000),
  };

  // Validate firstName
  if (!sanitized.firstName || sanitized.firstName.length < 2) {
    errors.firstName = 'First name must be at least 2 characters';
  }

  // Validate lastName
  if (!sanitized.lastName || sanitized.lastName.length < 2) {
    errors.lastName = 'Last name must be at least 2 characters';
  }

  // Validate email
  if (!isValidEmail(sanitized.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Validate subject
  if (!sanitized.subject || sanitized.subject.length < 3) {
    errors.subject = 'Subject must be at least 3 characters';
  }

  // Validate message
  if (!sanitized.message || sanitized.message.length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }

  // Check for SQL injection attempts
  Object.values(sanitized).forEach(value => {
    if (typeof value === 'string' && containsSqlInjection(value)) {
      errors.security = 'Invalid input detected';
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  };
}

// CSRF token utilities
const CSRF_TOKEN_KEY = 'vaultpay_csrf_token';

export function generateCsrfToken(): string {
  if (typeof window === 'undefined') return '';
  
  let token = sessionStorage.getItem(CSRF_TOKEN_KEY);
  if (!token) {
    token = generateToken(32);
    sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  }
  return token;
}

export function validateCsrfToken(token: string): boolean {
  if (typeof window === 'undefined') return false;
  
  const storedToken = sessionStorage.getItem(CSRF_TOKEN_KEY);
  return storedToken === token && token.length === 32;
}

// Rate limiting helper (client-side)
export class ClientRateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  canAttempt(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }
  
  reset(key: string): void {
    this.attempts.delete(key);
  }
}
