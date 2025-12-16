/**
 * VaultPay API Service
 * Handles all API calls to the VaultPay backend
 */

// Gateway handles API key injection and rate limiting
const BASE_URL = 'http://98.83.36.86';

export interface RegisterRequest {
  email: string;
  password: string;
  gender: string;
  first_name: string;
  last_name: string;
  user_name: string;
  account_type: number;
  country_id: number;
  state_id: number;
  city_id?: number;
  day: number;
  month: number;
  year: number;
  phone_number?: string;
  mobile?: string;
  mcc?: string;
  address?: string;
  postal_code?: string;
  ssn?: string;
  referral_code?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: boolean;
  message?: string;
  data?: {
    user_id: string;
    login_code: string;
    first_name: string;
    last_name: string;
    email: string;
    mobile: string | null;
    user_name: string;
    account_type: string;
    is_kyc_verified: string;
    ppic: string;
    referral_code: string;
    role: string;
    role_text: string;
    short_user_id: string;
    topup_activation: boolean;
    uid: string;
    is_logged_in: boolean;
    last_login: string;
    login_time: string;
  };
}

export interface Country {
  id: number;
  name: string;
  symbol: string;
  enable: number;
  created_at: string;
  updated_at: string;
}

export interface State {
  id: number;
  name: string;
  country_id: number;
  created_at: string;
  updated_at: string;
}

export interface City {
  id: number;
  name: string;
  state_id: number;
  created_at: string;
  updated_at: string;
}

export interface KYCRequest {
  userId: string;
  loginCode: string;
  id_type: string;
  address_doc_type: string;
  Identification_number: string;
  identification_document: File;
  address_document: File;
  face_verification_image: File;
}

export interface KYCStatusResponse {
  status: boolean;
  msg: string;
  data: {
    overall_status: number;
    is_kyc_verified: number;
    id_document: {
      status: number;
      status_text: 'pending' | 'approved' | 'rejected';
      rejection_reason: string | null;
    };
    address_document: {
      status: number;
      status_text: 'pending' | 'approved' | 'rejected';
      rejection_reason: string | null;
    };
    face_verification: {
      status: number;
      status_text: 'pending' | 'approved' | 'rejected';
      rejection_reason: string | null;
    };
  };
}

/**
 * Register a new user
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  const response = await fetch(`${BASE_URL}/api/v2/auth/register`, {
    method: 'POST',
    body: formData,
  });

  return response.json();
}

/**
 * Login user
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const params = new URLSearchParams();
  params.append('email', data.email);
  params.append('password', data.password);

  const response = await fetch(`${BASE_URL}/api/v2/Auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  return response.json();
}

/**
 * Check if username is available
 */
export async function checkUsername(username: string): Promise<{ status: boolean; is_available: boolean }> {
  const response = await fetch(`${BASE_URL}/api/v2/user/check_username?user_name=${encodeURIComponent(username)}`);
  return response.json();
}

/**
 * Check if email is available
 */
export async function checkEmail(email: string): Promise<{ status: boolean; is_available: boolean; message?: string }> {
  try {
    const response = await fetch(`${BASE_URL}/api/v2/user/check_email?email=${encodeURIComponent(email)}`);
    return response.json();
  } catch (error) {
    console.error('Failed to check email:', error);
    return { status: false, is_available: false, message: 'Network error. Please try again.' };
  }
}

/**
 * Get list of countries
 */
export async function getCountries(): Promise<{ status: boolean; data: Country[] }> {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/country?screen=1`);
    return response.json();
  } catch (error) {
    console.error('Failed to fetch countries:', error);
    return { status: false, data: [] };
  }
}

/**
 * Get states by country ID
 */
export async function getStates(countryId: number): Promise<{ status: boolean; data: State[] }> {
  const response = await fetch(`${BASE_URL}/api/v1/country?screen=2&countryId=${countryId}`);
  return response.json();
}

/**
 * Get cities by state ID
 */
export async function getCities(stateId: number): Promise<{ status: boolean; data: City[] }> {
  const response = await fetch(`${BASE_URL}/api/v1/country?screen=3&stateId=${stateId}`);
  return response.json();
}

/**
 * Submit KYC documents
 */
export async function submitKYC(data: KYCRequest): Promise<{ status: boolean; message?: string }> {
  const formData = new FormData();
  formData.append('userId', data.userId);
  formData.append('loginCode', data.loginCode);
  formData.append('id_type', data.id_type);
  formData.append('address_doc_type', data.address_doc_type);
  formData.append('Identification_number', data.Identification_number);
  formData.append('identification_document', data.identification_document);
  formData.append('address_document', data.address_document);
  formData.append('face_verification_image', data.face_verification_image);

  const response = await fetch(`${BASE_URL}/api/v2/user/kyc`, {
    method: 'POST',
    body: formData,
  });

  return response.json();
}

/**
 * Get detailed KYC verification status
 */
export async function getKYCStatus(userId: string, loginCode: string): Promise<KYCStatusResponse> {
  const formData = new FormData();
  formData.append('userId', userId);
  formData.append('loginCode', loginCode);

  const response = await fetch(`${BASE_URL}/api/v2/user/verification_status`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      userId,
      loginCode,
    }),
  });

  return response.json();
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string, loginCode: string): Promise<AuthResponse> {
  const response = await fetch(
    `${BASE_URL}/api/v2/user/profile?userId=${encodeURIComponent(userId)}&loginCode=${encodeURIComponent(loginCode)}`
  );
  return response.json();
}
