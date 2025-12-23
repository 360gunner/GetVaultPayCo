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
  otp?: string;
  device_type?: 'app' | 'web';
}

export interface AuthResponse {
  status: boolean;
  message?: string;
  requires_2fa?: boolean;
  data?: {
    email_masked?: string;
    user_id_temp?: string;
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
    cover_photo: string;
    referral_code: string;
    role: string;
    role_text: string;
    short_user_id: string;
    topup_activation: boolean;
    uid: string;
    is_logged_in: boolean;
    last_login: string;
    login_time: string;
    followers_count: number;
    following_count: number;
    date_of_birth: string;
    last_username_change: string | null;
    iban: string | null;
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
 * Supports email 2FA - if requires_2fa is true, call again with OTP
 */
export async function login(data: LoginRequest): Promise<AuthResponse> {
  const params = new URLSearchParams();
  params.append('email', data.email);
  params.append('password', data.password);
  params.append('device_type', 'web'); // Always send 'web' for website
  
  // Include OTP if provided (for 2FA verification)
  if (data.otp) {
    params.append('otp', data.otp);
  }

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
 * Forgot Password - Send OTP
 */
export async function forgotPassword(email: string): Promise<{ status: boolean; message?: string }> {
  const params = new URLSearchParams();
  params.append('email', email);

  const response = await fetch(`${BASE_URL}/api/v2/Auth/forgot_password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Verify Forgot Password OTP
 */
export async function verifyForgotPasswordOTP(email: string, otp: string): Promise<{ status: boolean; message?: string }> {
  const params = new URLSearchParams();
  params.append('email', email);
  params.append('otp', otp);

  const response = await fetch(`${BASE_URL}/api/v2/Auth/verify_forgot_password_otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Update Password (after OTP verification)
 */
export async function updatePassword(email: string, password: string): Promise<{ status: boolean; message?: string }> {
  const params = new URLSearchParams();
  params.append('email', email);
  params.append('password', password);

  const response = await fetch(`${BASE_URL}/api/v2/Auth/update_password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Change Password (for authenticated users - verifies current password first)
 */
export async function changePassword(
  email: string,
  currentPassword: string,
  newPassword: string
): Promise<{ status: boolean; message?: string }> {
  // First verify current password by attempting login
  const loginParams = new URLSearchParams();
  loginParams.append('email', email);
  loginParams.append('password', currentPassword);

  const loginResponse = await fetch(`${BASE_URL}/api/v2/Auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: loginParams,
  });
  const loginResult = await loginResponse.json();

  if (!loginResult.status) {
    return { status: false, message: 'Current password is incorrect' };
  }

  // Now update to new password
  const updateParams = new URLSearchParams();
  updateParams.append('email', email);
  updateParams.append('password', newPassword);

  const response = await fetch(`${BASE_URL}/api/v2/Auth/update_password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: updateParams,
  });
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

// ============================================================================
// DASHBOARD API FUNCTIONS
// ============================================================================

export interface BalanceResponse {
  status: boolean;
  data: {
    USD: number;
    EUR: number;
    GBP?: number;
    NGN?: number;
    [key: string]: number | undefined;
  };
}

export interface AccountDetails {
  id: string;
  accountIdHash: string;
  accountNo: string;
  accountType: string;
  account_balance: string;
  activatedDt: string;
  cardPin: string;
  createdBy: string;
  createdDtm: string;
  cvv: string;
  delivery_fee: string;
  expiryDt: string;
  isActivated: string;
  isBlock: string;
  isDisable: string;
  isFreeze: string;
  issue_fee: string;
  lastTimePinGenerated: string;
  manufacturedDt: string | null;
  mobile: string;
  residencyAddress: string;
  userId: string;
}

export interface AccountDetailsResponse {
  status: boolean;
  is_smile_verified?: number;
  user_name?: string;
  mobile?: string;
  is_kyc_verified?: number;
  profile_image_url?: string;
  total_balance?: number;
  business_status?: boolean;
  data?: AccountDetails[];
  meta_data?: {
    pricing_url: string;
  };
}

export interface Transaction {
  id: string;
  userId: string;
  userAccountId: string;
  txnCode: string;
  amount: string;
  currency: string;
  amount_percentage: string;
  amount_percentage_symbol: string;
  user_balance: string;
  user_new_balance: string;
  withdrawal_method: string;
  withdrawal_account: string;
  transfer_status: string;
  status: number;
  name: string;
  description: string;
  CreatedBy: string;
  CreatedDTM: string;
}

export interface TransactionHistoryResponse {
  status: boolean;
  data: Transaction[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export interface DashboardTransaction {
  transaction_id: string;
  account_id: string;
  account_no: string;
  user_id: string;
  txnCode: string;
  amount: string;
  currency?: string;
  amount_percentage_symbol: string;
  amount_less_transaction_fee: string | null;
  transaction_fee: string | null;
  transfer_status: string;
  transaction_name: string | null;
  transaction_description: string | null;
  type: string;
  payment_method: string;
  created_at: string;
  created_by: string;
  first_name: string;
  last_name: string;
  from_first_name: string;
  from_last_name: string;
  from_user_id: string;
  from_user_identifier: string;
  from_user_pic: string | null;
  pic: string;
  user_ppic: string;
}

export interface DashboardTransactionsResponse {
  status: boolean;
  data: DashboardTransaction[];
  balance: number;
  meta_data?: {
    total_count: number;
    page: number;
    size: number;
  };
}

export interface SocialUser {
  user_id: string;
  user_name: string;
  first_name: string;
  last_name: string;
  ppic: string;
  is_kyc_verified: number;
  followed_at: string;
}

export interface SocialStatsResponse {
  status: boolean;
  data: {
    followers_count: number;
    following_count: number;
    is_following?: boolean;
  };
}

export interface SocialListResponse {
  status: boolean;
  data: SocialUser[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export interface ReferralStatsResponse {
  status: boolean;
  data: {
    referral_code: string;
    total_referrals: number;
    active_referrals: number;
    total_earnings: number;
    pending_earnings: number;
    withdrawn_earnings: number;
    current_level: number;
    current_level_name: string;
    next_level: number;
    next_level_name: string;
    referrals_to_next_level: number;
  };
}

export interface LeaderboardUser {
  rank: number;
  user_id: string;
  user_name: string;
  first_name: string;
  last_name: string;
  ppic: string;
  total_referrals: number;
  level: number;
  level_name: string;
}

export interface ReferralLeaderboardResponse {
  status: boolean;
  data: {
    leaderboard: LeaderboardUser[];
    current_user_rank: {
      rank: number;
      total_referrals: number;
      level: number;
      level_name: string;
    };
    period: string;
  };
}

export interface TwoFAEnableResponse {
  status: boolean;
  data: {
    qr_code: string;
    secret: string;
  };
}

export interface TwoFAVerifyResponse {
  status: boolean;
  data: {
    verified: boolean;
  };
}

/**
 * Get account balance (all currencies)
 */
export async function getAccountBalance(userId: string, loginCode: string): Promise<BalanceResponse> {
  const response = await fetch(
    `${BASE_URL}/api/v2/Account/balance?userId=${encodeURIComponent(userId)}&loginCode=${encodeURIComponent(loginCode)}`
  );
  return response.json();
}

/**
 * Get account details
 */
export async function getAccountDetails(userId: string, loginCode: string): Promise<AccountDetailsResponse> {
  const response = await fetch(
    `${BASE_URL}/api/v1/accounts?userId=${encodeURIComponent(userId)}&loginCode=${encodeURIComponent(loginCode)}&screen=1&accounts=1`
  );
  return response.json();
}

/**
 * Create a new currency wallet
 */
export async function createCurrencyWallet(
  userId: string,
  loginCode: string,
  currency: string
): Promise<{ status: boolean; message?: string; data?: { currency: string; balance: number; created: boolean } }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('currency', currency);

  const response = await fetch(`${BASE_URL}/api/v2/Account/create_currency_wallet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Get transaction history
 */
export async function getTransactionHistory(
  userId: string,
  loginCode: string,
  options?: {
    page?: number;
    limit?: number;
    type?: 'deposit' | 'withdrawal' | 'transfer';
    status?: 0 | 1 | 2;
    from_date?: string;
    to_date?: string;
    currency?: string;
  }
): Promise<TransactionHistoryResponse> {
  const params = new URLSearchParams({
    userId,
    loginCode,
  });
  
  if (options?.page) params.append('page', options.page.toString());
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.type) params.append('type', options.type);
  if (options?.status !== undefined) params.append('status', options.status.toString());
  if (options?.from_date) params.append('from_date', options.from_date);
  if (options?.to_date) params.append('to_date', options.to_date);
  if (options?.currency) params.append('currency', options.currency);

  const response = await fetch(`${BASE_URL}/api/v2/Transaction/history?${params.toString()}`);
  return response.json();
}

/**
 * Get dashboard transactions extended (better filtering support)
 * This API provides enhanced transaction data with account_type filtering
 */
export async function getDashboardTransactionsExtended(
  userId: string,
  loginCode: string,
  options?: {
    account_type?: number; // 0=USD, 1=EUR, etc.
    month?: number;
    page?: number;
    size?: number;
    from_date?: string;
    to_date?: string;
  }
): Promise<DashboardTransactionsResponse> {
  const params = new URLSearchParams({
    userId,
    loginCode,
  });
  
  if (options?.account_type !== undefined) params.append('account_type', options.account_type.toString());
  if (options?.page) params.append('page', options.page.toString());
  if (options?.size) params.append('size', options.size.toString());
  if (options?.month !== undefined) params.append('month', options.month.toString());
  if (options?.from_date) params.append('from_date', options.from_date);
  if (options?.to_date) params.append('to_date', options.to_date);

  const response = await fetch(`${BASE_URL}/api/v2/Transaction/dashboard_transactions_extended?${params.toString()}`);
  return response.json();
}

/**
 * Get dashboard transactions by currency code
 * Uses the dashboard_currency_transactions endpoint that supports any currency
 */
export async function getDashboardTransactionsByCurrency(
  userId: string,
  loginCode: string,
  currency: string,
  options?: {
    month?: number;
    page?: number;
    page_size?: number;
  }
): Promise<DashboardTransactionsResponse> {
  const params = new URLSearchParams({
    userId,
    loginCode,
    currency: currency.toLowerCase(),
    account_type: '0',
  });
  
  if (options?.page) params.append('page', options.page.toString());
  if (options?.page_size) params.append('page_size', options.page_size.toString());
  if (options?.month !== undefined) params.append('month', options.month.toString());

  const response = await fetch(`${BASE_URL}/api/v2/Transaction/dashboard_currency_transactions?${params.toString()}`);
  return response.json();
}

/**
 * Get social stats (followers/following count)
 */
export async function getSocialStats(userId: string, loginCode: string, targetUserId?: string): Promise<SocialStatsResponse> {
  const params = new URLSearchParams({ userId, loginCode });
  if (targetUserId) params.append('targetUserId', targetUserId);
  
  const response = await fetch(`${BASE_URL}/api/v2/followers/stats?${params.toString()}`);
  return response.json();
}

/**
 * Get followers list
 */
export async function getFollowers(
  userId: string,
  loginCode: string,
  options?: { targetUserId?: string; page?: number; limit?: number }
): Promise<SocialListResponse> {
  const params = new URLSearchParams({ userId, loginCode });
  if (options?.targetUserId) params.append('targetUserId', options.targetUserId);
  if (options?.page) params.append('page', options.page.toString());
  if (options?.limit) params.append('limit', options.limit.toString());
  
  const response = await fetch(`${BASE_URL}/api/v2/followers/followers?${params.toString()}`);
  return response.json();
}

/**
 * Get following list
 */
export async function getFollowing(
  userId: string,
  loginCode: string,
  options?: { targetUserId?: string; page?: number; limit?: number }
): Promise<SocialListResponse> {
  const params = new URLSearchParams({ userId, loginCode });
  if (options?.targetUserId) params.append('targetUserId', options.targetUserId);
  if (options?.page) params.append('page', options.page.toString());
  if (options?.limit) params.append('limit', options.limit.toString());
  
  const response = await fetch(`${BASE_URL}/api/v2/followers/following?${params.toString()}`);
  return response.json();
}

/**
 * Follow a user
 */
export async function followUser(userId: string, loginCode: string, targetUserId: string): Promise<{ status: boolean; message: string; data: { is_following: boolean } }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('target_user_id', targetUserId);

  const response = await fetch(`${BASE_URL}/api/v2/followers/follow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Unfollow a user
 */
export async function unfollowUser(userId: string, loginCode: string, targetUserId: string): Promise<{ status: boolean; message: string; data: { is_following: boolean } }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('target_user_id', targetUserId);

  const response = await fetch(`${BASE_URL}/api/v2/followers/unfollow`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Get count of pending follow requests
 */
export async function getFollowRequestsCount(
  userId: string,
  loginCode: string
): Promise<{ status: boolean; data?: { pending_requests: number } }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);

  const response = await fetch(`${BASE_URL}/api/v2/followers/requests_count?${params.toString()}`);
  return response.json();
}

/**
 * Get pending follow requests list
 */
export async function getFollowRequests(
  userId: string,
  loginCode: string
): Promise<{ status: boolean; data?: any[] }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);

  const response = await fetch(`${BASE_URL}/api/v2/followers/requests?${params.toString()}`);
  return response.json();
}

/**
 * Accept a follow request
 */
export async function acceptFollowRequest(
  userId: string,
  loginCode: string,
  requesterId: number
): Promise<{ status: boolean; message?: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('requester_id', requesterId.toString());

  const response = await fetch(`${BASE_URL}/api/v2/followers/accept_request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Reject a follow request
 */
export async function rejectFollowRequest(
  userId: string,
  loginCode: string,
  requesterId: number
): Promise<{ status: boolean; message?: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('requester_id', requesterId.toString());

  const response = await fetch(`${BASE_URL}/api/v2/followers/reject_request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Set profile privacy (public/private)
 */
export async function setProfilePrivacy(
  userId: string,
  loginCode: string,
  isPrivate: boolean
): Promise<{ status: boolean; data?: { is_private: boolean }; message?: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('is_private', isPrivate ? '1' : '0');

  const response = await fetch(`${BASE_URL}/api/v2/followers/set_privacy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Get referral leaderboard
 */
export async function getReferralLeaderboard(
  userId: string,
  loginCode: string,
  options?: { limit?: number; period?: 'all_time' | 'monthly' | 'weekly' }
): Promise<ReferralLeaderboardResponse> {
  const params = new URLSearchParams({ userId, loginCode });
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.period) params.append('period', options.period);
  
  const response = await fetch(`${BASE_URL}/api/v2/user/referral_leaderboard?${params.toString()}`);
  return response.json();
}

/**
 * Upload profile picture
 */
export async function uploadProfilePicture(userId: string, loginCode: string, file: File): Promise<{ status: boolean; data: { ppic: string } }> {
  const formData = new FormData();
  formData.append('userId', userId);
  formData.append('loginCode', loginCode);
  formData.append('profile_picture', file);

  const response = await fetch(`${BASE_URL}/api/v2/user/upload_profile_picture`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
}

/**
 * Upload cover photo
 */
export async function uploadCoverPhoto(userId: string, loginCode: string, file: File): Promise<{ status: boolean; data: { cover_photo: string } }> {
  const formData = new FormData();
  formData.append('userId', userId);
  formData.append('loginCode', loginCode);
  formData.append('cover_photo', file);

  const response = await fetch(`${BASE_URL}/api/v2/user/upload_cover_photo`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
}

/**
 * Delete profile picture
 */
export async function deleteProfilePicture(userId: string, loginCode: string): Promise<{ status: boolean; message?: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);

  const response = await fetch(`${BASE_URL}/api/v2/user/delete_profile_picture`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Enable 2FA
 */
export async function enable2FA(userId: string, loginCode: string): Promise<TwoFAEnableResponse> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);

  const response = await fetch(`${BASE_URL}/api/v2/Auth/enable_2fa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Verify 2FA token
 */
export async function verify2FA(userId: string, loginCode: string, token: string): Promise<TwoFAVerifyResponse> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('token', token);

  const response = await fetch(`${BASE_URL}/api/v2/Auth/verify_2fa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Disable 2FA
 */
export async function disable2FA(userId: string, loginCode: string): Promise<{ status: boolean; data: { disabled: boolean } }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);

  const response = await fetch(`${BASE_URL}/api/v2/Auth/disable_2fa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Get live exchange rates
 */
export async function getLiveRates(
  userId: string,
  loginCode: string,
  baseCurrency: string = 'USD',
  currencies?: string[]
): Promise<{ status: boolean; data: Record<string, { code: string; value: number; last_updated: string }> }> {
  const params = new URLSearchParams({ userId, loginCode, base_currency: baseCurrency });
  if (currencies) params.append('currencies', currencies.join(','));
  
  const response = await fetch(`${BASE_URL}/api/v2/currency/live_rates?${params.toString()}`);
  return response.json();
}

/**
 * Convert currency
 */
export async function convertCurrency(
  userId: string,
  loginCode: string,
  fromCurrency: string,
  toCurrency: string,
  amount: number
): Promise<{
  status: boolean;
  data: {
    txn_code: string;
    from: string;
    to: string;
    rate: number;
    amount: number;
    converted_amount: number;
    fee_percent: number;
    fee: number;
    net_amount: number;
  };
}> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('from_currency', fromCurrency);
  params.append('to_currency', toCurrency);
  params.append('amount', amount.toString());

  const response = await fetch(`${BASE_URL}/api/v2/Transaction/convert_currency`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

// ============================================================================
// PHYSICAL CARD API FUNCTIONS (Old API - /api/v1/accounts)
// ============================================================================

export interface PhysicalCard {
  accountIdHash: string;
  accountNo: string;
  accountType: string;
  balance: string;
  account_balance?: string;
  isFreeze: string;
  isActivated?: string;
  cvv?: string;
  expiryDt?: string;
  cardholderName?: string;
}

export interface CardStatusResponse {
  status: boolean;
  card_status: 'PENDING' | 'APPROVED' | 'ACTIVE' | 'REJECTED' | 'NOT_SUBMITTED';
  message?: string;
  data?: {
    submission_date?: string;
    rejection_reason_id?: string;
  };
}

/**
 * Get physical card details
 */
export async function getPhysicalCard(
  userId: string,
  loginCode: string
): Promise<{ status: boolean; data: PhysicalCard[]; total_balance: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('screen', '1');
  params.append('accounts', '1');
  params.append('card', '1');

  const response = await fetch(`${BASE_URL}/api/v1/accounts?${params.toString()}`);
  return response.json();
}

/**
 * Freeze or unfreeze physical card
 */
export async function freezePhysicalCard(
  userId: string,
  loginCode: string,
  accountId: string,
  freeze: 1 | 2  // 1=freeze, 2=unfreeze
): Promise<{ status: boolean; msg: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('screen', '5');
  params.append('accounts', '1');
  params.append('freeze', freeze.toString());
  params.append('accountId', accountId);

  const response = await fetch(`${BASE_URL}/api/v1/accounts?${params.toString()}`);
  return response.json();
}

/**
 * Get physical card PIN
 */
export async function getPhysicalCardPin(
  userId: string,
  loginCode: string,
  accountId: string
): Promise<{ status: boolean; data: { pin: string } }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('screen', '5');
  params.append('accounts', '1');
  params.append('card', '1');
  params.append('accountId', accountId);

  const response = await fetch(`${BASE_URL}/api/v1/accounts?${params.toString()}`);
  return response.json();
}

/**
 * Get card status (PENDING/APPROVED/ACTIVE/REJECTED)
 */
export async function getCardStatus(
  userId: string,
  loginCode: string
): Promise<CardStatusResponse> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);

  const response = await fetch(`${BASE_URL}/api/v2/Account/card_status?${params.toString()}`);
  return response.json();
}

/**
 * Activate physical card
 */
export async function activateCard(
  userId: string,
  loginCode: string,
  cvv: string,
  cardExpiry: string
): Promise<{ status: boolean; msg?: string; errmsg?: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('cvv', cvv);
  params.append('cardExpiry', cardExpiry);

  const response = await fetch(`${BASE_URL}/api/v2/Account/activate_card`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

// ============================================================================
// VIRTUAL CARD API FUNCTIONS (Maplerad - /api/v2/Maplerad/*)
// ============================================================================

export interface Card {
  id: string;
  card_id: string;
  card_type: 'physical' | 'virtual';
  card_brand: string;
  card_name: string;
  card_number_masked: string;
  last_four: string;
  expiry_month: string;
  expiry_year: string;
  cvv?: string;
  cvv_masked: string;
  cardholder_name: string;
  status: 'active' | 'frozen' | 'blocked' | 'pending' | 'expired' | 'inactive';
  currency: string;
  balance: number;
  daily_limit: number;
  monthly_limit: number;
  used_today: number;
  used_this_month: number;
  created_at: string;
  provider: 'vaultpay' | 'maplerad';
  card_style?: 'default' | 'gold' | 'rewards' | 'debit' | 'virtual';
}

export interface CardDetails extends Card {
  card_number: string;
  cvv: string;
  billing_address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export interface CardTransaction {
  id: string;
  card_id: string;
  merchant_name: string;
  merchant_category: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'declined' | 'refunded';
  transaction_type: 'purchase' | 'atm' | 'refund' | 'fee';
  created_at: string;
  description?: string;
}

export interface CardsListResponse {
  status: boolean;
  data: Card[];
}

export interface CardDetailsResponse {
  status: boolean;
  data: CardDetails;
}

export interface CardTransactionsResponse {
  status: boolean;
  data: CardTransaction[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export interface CardSpendingSummary {
  this_month: number;
  last_month: number;
  average_monthly: number;
}

export interface CardLimits {
  daily_limit: number;
  used_today: number;
  remaining_today: number;
  monthly_limit: number;
  used_this_month: number;
  remaining_this_month: number;
}

/**
 * Get all user cards (physical + virtual)
 */
export async function getUserCards(userId: string, loginCode: string): Promise<CardsListResponse> {
  const response = await fetch(
    `${BASE_URL}/api/v2/Maplerad/cards?userId=${encodeURIComponent(userId)}&loginCode=${encodeURIComponent(loginCode)}`
  );
  return response.json();
}

/**
 * Get card details (includes full card number and CVV when authorized)
 */
export async function getCardDetails(
  userId: string,
  loginCode: string,
  cardId: string
): Promise<CardDetailsResponse> {
  const response = await fetch(
    `${BASE_URL}/api/v2/Cards/details?userId=${encodeURIComponent(userId)}&loginCode=${encodeURIComponent(loginCode)}&cardId=${encodeURIComponent(cardId)}`
  );
  return response.json();
}

/**
 * Get card transactions
 */
export async function getCardTransactions(
  userId: string,
  loginCode: string,
  cardId: string,
  options?: { page?: number; limit?: number; from_date?: string; to_date?: string }
): Promise<CardTransactionsResponse> {
  const params = new URLSearchParams({ userId, loginCode, card_id: cardId });
  if (options?.page) params.append('page', options.page.toString());
  if (options?.limit) params.append('page_size', options.limit.toString());
  if (options?.from_date) params.append('start_date', options.from_date);
  if (options?.to_date) params.append('end_date', options.to_date);

  const response = await fetch(`${BASE_URL}/api/v2/Maplerad/card_transactions?${params.toString()}`);
  return response.json();
}

/**
 * Get card spending summary
 */

/**
 * Get card limits
 */

/**
 * Freeze card
 */
export async function freezeCard(
  userId: string,
  loginCode: string,
  cardId: string
): Promise<{ status: boolean; message: string; data: { status: string } }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('card_id', cardId);

  const response = await fetch(`${BASE_URL}/api/v2/Maplerad/card_freeze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Unfreeze card
 */
export async function unfreezeCard(
  userId: string,
  loginCode: string,
  cardId: string
): Promise<{ status: boolean; message: string; data: { status: string } }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('card_id', cardId);

  const response = await fetch(`${BASE_URL}/api/v2/Maplerad/card_unfreeze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Block card permanently
 */
export async function blockCard(
  userId: string,
  loginCode: string,
  cardId: string,
  reason: string
): Promise<{ status: boolean; message: string; data: { status: string } }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('cardId', cardId);
  params.append('reason', reason);

  const response = await fetch(`${BASE_URL}/api/v2/Cards/block`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Request card replacement
 */
export async function requestCardReplacement(
  userId: string,
  loginCode: string,
  cardId: string,
  reason: 'lost' | 'stolen' | 'damaged' | 'expired'
): Promise<{ status: boolean; message: string; data: { new_card_id: string; expected_delivery?: string } }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('cardId', cardId);
  params.append('reason', reason);

  const response = await fetch(`${BASE_URL}/api/v2/Cards/replace`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Get card PIN (requires additional verification)
 */
export async function getCardPin(
  userId: string,
  loginCode: string,
  cardId: string
): Promise<{ status: boolean; data: { pin: string; expires_in: number } }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('card_id', cardId);

  const response = await fetch(`${BASE_URL}/api/v2/Maplerad/card_details?${params.toString()}`);
  const result = await response.json();
  return { status: result.status, data: { pin: result.data?.card_pin || result.data?.cvv || '****', expires_in: 300 } };
}

/**
 * Set card PIN
 */
export async function setCardPin(
  userId: string,
  loginCode: string,
  cardId: string,
  pin: string
): Promise<{ status: boolean; message: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('cardId', cardId);
  params.append('pin', pin);

  const response = await fetch(`${BASE_URL}/api/v2/Cards/set_pin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Fund card (load money onto card)
 */
export async function fundCard(
  userId: string,
  loginCode: string,
  cardId: string,
  amount: number
): Promise<{ status: boolean; message?: string; data?: { new_balance: number } }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('card_id', cardId);
  params.append('amount', amount.toString());

  const response = await fetch(`${BASE_URL}/api/v2/Maplerad/card_fund`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Withdraw from card (unload money from card to wallet)
 */
export async function withdrawFromCard(
  userId: string,
  loginCode: string,
  cardId: string,
  amount: number
): Promise<{ status: boolean; message?: string; data?: { new_balance: number } }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('card_id', cardId);
  params.append('amount', amount.toString());

  const response = await fetch(`${BASE_URL}/api/v2/Maplerad/card_withdraw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Update card limits
 */
export async function updateCardLimits(
  userId: string,
  loginCode: string,
  cardId: string,
  limits: { daily_limit?: number; monthly_limit?: number }
): Promise<{ status: boolean; message: string; data: CardLimits }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('cardId', cardId);
  if (limits.daily_limit) params.append('daily_limit', limits.daily_limit.toString());
  if (limits.monthly_limit) params.append('monthly_limit', limits.monthly_limit.toString());

  const response = await fetch(`${BASE_URL}/api/v2/Cards/update_limits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

// ============================================================================
// MAPLERAD VIRTUAL CARDS API
// ============================================================================

export interface MapleradVirtualCard {
  id: string;
  card_number_masked: string;
  last_four: string;
  expiry_month: string;
  expiry_year: string;
  cvv_masked: string;
  brand: 'visa' | 'mastercard';
  type: 'virtual';
  currency: string;
  balance: number;
  status: 'active' | 'frozen' | 'terminated';
  created_at: string;
  name: string;
  billing_address: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

export interface CreateVirtualCardRequest {
  currency: string;
  amount: number;
  card_brand?: 'visa' | 'mastercard';
  name?: string;
}

/**
 * Create Maplerad virtual card
 */
export async function createMapleradVirtualCard(
  userId: string,
  loginCode: string,
  data: CreateVirtualCardRequest
): Promise<{ status: boolean; message: string; data: MapleradVirtualCard }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('currency', data.currency);
  params.append('amount', data.amount.toString());
  if (data.card_brand) params.append('card_brand', data.card_brand);
  if (data.name) params.append('name', data.name);

  const response = await fetch(`${BASE_URL}/api/v2/Cards/maplerad/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Get Maplerad virtual card details
 */
export async function getMapleradCardDetails(
  userId: string,
  loginCode: string,
  cardId: string
): Promise<{ status: boolean; data: MapleradVirtualCard & { card_number: string; cvv: string } }> {
  const response = await fetch(
    `${BASE_URL}/api/v2/Maplerad/card_details?userId=${encodeURIComponent(userId)}&loginCode=${encodeURIComponent(loginCode)}&card_id=${encodeURIComponent(cardId)}`
  );
  return response.json();
}

/**
 * Fund Maplerad virtual card
 */
export async function fundMapleradCard(
  userId: string,
  loginCode: string,
  cardId: string,
  amount: number
): Promise<{ status: boolean; message: string; data: { new_balance: number } }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('cardId', cardId);
  params.append('amount', amount.toString());

  const response = await fetch(`${BASE_URL}/api/v2/Cards/maplerad/fund`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Withdraw from Maplerad virtual card
 */
export async function withdrawFromMapleradCard(
  userId: string,
  loginCode: string,
  cardId: string,
  amount: number
): Promise<{ status: boolean; message: string; data: { new_balance: number } }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('cardId', cardId);
  params.append('amount', amount.toString());

  const response = await fetch(`${BASE_URL}/api/v2/Cards/maplerad/withdraw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Freeze Maplerad virtual card
 */
export async function freezeMapleradCard(
  userId: string,
  loginCode: string,
  cardId: string
): Promise<{ status: boolean; message: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('cardId', cardId);

  const response = await fetch(`${BASE_URL}/api/v2/Cards/maplerad/freeze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Unfreeze Maplerad virtual card
 */
export async function unfreezeMapleradCard(
  userId: string,
  loginCode: string,
  cardId: string
): Promise<{ status: boolean; message: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('cardId', cardId);

  const response = await fetch(`${BASE_URL}/api/v2/Cards/maplerad/unfreeze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Get Maplerad card transactions
 */
export async function getMapleradCardTransactions(
  userId: string,
  loginCode: string,
  cardId: string,
  options?: { page?: number; limit?: number }
): Promise<CardTransactionsResponse> {
  const params = new URLSearchParams({ userId, loginCode, card_id: cardId });
  if (options?.page) params.append('page', options.page.toString());
  if (options?.limit) params.append('page_size', options.limit.toString());

  const response = await fetch(`${BASE_URL}/api/v2/Maplerad/card_transactions?${params.toString()}`);
  return response.json();
}

// ============================================================================
// QR CODE API FUNCTIONS
// ============================================================================

export interface PaymentQRCode {
  id: string;
  qr_code_data: string;
  qr_code_image: string;
  amount: number;
  currency: string;
  description?: string;
  created_at: string;
  expires_at?: string;
  status: 'active' | 'used' | 'expired';
  payment_received?: boolean;
}

export interface ProfileQRCode {
  id: string;
  qr_code_data: string;
  qr_code_image: string;
  include_profile_picture: boolean;
  include_contact_info: boolean;
  allow_direct_payments: boolean;
  created_at: string;
}

export interface QRCodeListResponse {
  status: boolean;
  data: {
    payment_qr_codes: PaymentQRCode[];
    profile_qr_code?: ProfileQRCode;
  };
}

export interface GeneratePaymentQRResponse {
  status: boolean;
  message?: string;
  data: PaymentQRCode;
}

export interface GenerateProfileQRResponse {
  status: boolean;
  message?: string;
  data: ProfileQRCode;
}

export interface ScanQRCodeResponse {
  status: boolean;
  message?: string;
  data: {
    type: 'payment' | 'profile' | 'unknown';
    user_id?: string;
    user_name?: string;
    amount?: number;
    currency?: string;
    description?: string;
  };
}

/**
 * Generate a payment QR code
 */
export async function generatePaymentQRCode(
  userId: string,
  loginCode: string,
  amount: number,
  currency: string = 'USD',
  description?: string
): Promise<GeneratePaymentQRResponse> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('amount', amount.toString());
  params.append('currency', currency);
  if (description) params.append('description', description);

  const response = await fetch(`${BASE_URL}/api/v2/QRCode/generate_payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Generate a profile QR code
 */
export async function generateProfileQRCode(
  userId: string,
  loginCode: string,
  options: {
    include_profile_picture?: boolean;
    include_contact_info?: boolean;
    allow_direct_payments?: boolean;
  } = {}
): Promise<GenerateProfileQRResponse> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  if (options.include_profile_picture !== undefined) 
    params.append('include_profile_picture', options.include_profile_picture.toString());
  if (options.include_contact_info !== undefined) 
    params.append('include_contact_info', options.include_contact_info.toString());
  if (options.allow_direct_payments !== undefined) 
    params.append('allow_direct_payments', options.allow_direct_payments.toString());

  const response = await fetch(`${BASE_URL}/api/v2/QRCode/generate_profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Get user's QR codes
 */
export async function getUserQRCodes(
  userId: string,
  loginCode: string
): Promise<QRCodeListResponse> {
  const response = await fetch(
    `${BASE_URL}/api/v2/QRCode/list?userId=${encodeURIComponent(userId)}&loginCode=${encodeURIComponent(loginCode)}`
  );
  return response.json();
}

/**
 * Scan/decode a QR code
 */
export async function scanQRCode(
  userId: string,
  loginCode: string,
  qrCodeData: string
): Promise<ScanQRCodeResponse> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('qr_code_data', qrCodeData);

  const response = await fetch(`${BASE_URL}/api/v2/QRCode/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Delete a QR code
 */
export async function deleteQRCode(
  userId: string,
  loginCode: string,
  qrCodeId: string
): Promise<{ status: boolean; message: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('qr_code_id', qrCodeId);

  const response = await fetch(`${BASE_URL}/api/v2/QRCode/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

// ============================================================================
// P2P TRANSFER API FUNCTIONS
// ============================================================================

export interface P2PTransferRequest {
  recipient: string;
  amount: number;
  currency?: string;
  note?: string;
}

export interface P2PTransferResponse {
  status: boolean;
  message?: string;
  data?: {
    txn_code: string;
    amount: number;
    currency: string;
    recipient_name: string;
    recipient_username: string;
    fee: number;
    total_amount: number;
    new_balance: number;
    created_at: string;
  };
}

export interface P2PRecipientLookupResponse {
  status: boolean;
  message?: string;
  data?: {
    user_id: string;
    user_name: string;
    first_name: string;
    last_name: string;
    ppic: string;
    is_verified: boolean;
  };
}

/**
 * P2P Transfer - Send money to another user
 * Recipient can be username, email, or phone number
 */
export async function p2pTransfer(
  userId: string,
  loginCode: string,
  data: P2PTransferRequest
): Promise<P2PTransferResponse> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('emailorphone', data.recipient);
  params.append('amount', data.amount.toString());
  if (data.note) params.append('purpose', data.note);

  const response = await fetch(`${BASE_URL}/api/v2/Transaction/direct_peer_transfer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Lookup P2P recipient by username, email, or phone
 */
export async function lookupP2PRecipient(
  userId: string,
  loginCode: string,
  recipient: string
): Promise<P2PRecipientLookupResponse> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('identifier', recipient);

  const response = await fetch(`${BASE_URL}/api/v2/User/find_by_identifier?${params.toString()}`);
  return response.json();
}

// ==================== BANK ACCOUNTS ====================

/**
 * Get user's linked bank accounts by currency
 */
export async function getUserBankAccounts(
  userId: string,
  loginCode: string,
  currency: 'USD' | 'EUR'
): Promise<{ status: boolean; message?: string; data?: any[] }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('currency', currency);

  const response = await fetch(`${BASE_URL}/api/v2/Account/user_bank_accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Link a bank account (USD or EUR)
 */
export async function linkBankAccount(data: {
  userId: string;
  loginCode: string;
  currency: 'USD' | 'EUR';
  bank_name: string;
  routing_number?: string;
  account_number?: string;
  confirm_account_number?: string;
  account_type?: string;
  iban?: string;
  confirm_iban?: string;
  swift_code?: string;
  bank_address?: string;
}): Promise<{ status: boolean; message?: string; data?: any }> {
  const params = new URLSearchParams();
  params.append('userId', data.userId);
  params.append('loginCode', data.loginCode);
  params.append('currency', data.currency);
  params.append('bank_name', data.bank_name);
  
  if (data.currency === 'USD') {
    if (data.routing_number) params.append('routing_number', data.routing_number);
    if (data.account_number) params.append('account_number', data.account_number);
    if (data.confirm_account_number) params.append('confirm_account_number', data.confirm_account_number);
    if (data.account_type) params.append('account_type', data.account_type);
  } else if (data.currency === 'EUR') {
    if (data.iban) params.append('iban', data.iban);
    if (data.confirm_iban) params.append('confirm_iban', data.confirm_iban);
    if (data.swift_code) params.append('swift_code', data.swift_code);
    if (data.bank_address) params.append('bank_address', data.bank_address);
  }

  const response = await fetch(`${BASE_URL}/api/v2/Account/link_bank_account`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Delete a linked bank account
 */
export async function deleteBankAccount(
  userId: string,
  loginCode: string,
  bankId: string
): Promise<{ status: boolean; message?: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('bank_id', bankId);

  const response = await fetch(`${BASE_URL}/api/v2/Account/delete_bank_account`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

// ==================== BANK ACCOUNTS (PLAID) ====================

export interface LinkedBankAccount {
  id: string;
  plaid_account_id: string;
  institution_name: string;
  institution_logo?: string;
  account_name: string;
  account_type: 'checking' | 'savings' | 'credit' | 'loan' | 'investment';
  account_mask: string;
  available_balance?: number;
  current_balance?: number;
  currency: string;
  status: 'active' | 'disconnected' | 'pending';
  created_at: string;
  last_synced?: string;
}

export interface LinkedBankAccountsResponse {
  status: boolean;
  message?: string;
  data?: LinkedBankAccount[];
}

export interface PlaidLinkTokenResponse {
  status: boolean;
  message?: string;
  data?: {
    link_token: string;
    expiration: string;
  };
}

export interface PlaidExchangeTokenResponse {
  status: boolean;
  message?: string;
  data?: {
    accounts: LinkedBankAccount[];
  };
}

/**
 * Get user's linked bank accounts
 */
export async function getLinkedBankAccounts(
  userId: string,
  loginCode: string
): Promise<LinkedBankAccountsResponse> {
  const params = new URLSearchParams({ userId, loginCode });
  const response = await fetch(`${BASE_URL}/api/v2/BankAccount/linked?${params.toString()}`);
  return response.json();
}

/**
 * Create Plaid Link token for connecting a new bank
 */
export async function createPlaidLinkToken(
  userId: string,
  loginCode: string
): Promise<PlaidLinkTokenResponse> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);

  const response = await fetch(`${BASE_URL}/api/v2/Plaid/create_link_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Exchange Plaid public token for access token and link accounts
 */
export async function exchangePlaidToken(
  userId: string,
  loginCode: string,
  publicToken: string,
  accountIds?: string[]
): Promise<PlaidExchangeTokenResponse> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('public_token', publicToken);
  if (accountIds) params.append('account_ids', accountIds.join(','));

  const response = await fetch(`${BASE_URL}/api/v2/Plaid/exchange_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Unlink a bank account
 */
export async function unlinkPlaidAccount(
  userId: string,
  loginCode: string,
  accountId: string
): Promise<{ status: boolean; message?: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('account_id', accountId);

  const response = await fetch(`${BASE_URL}/api/v2/Plaid/unlink_bank_account`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

// ============================================
// REFERRAL APIs
// ============================================

export interface ReferralStats {
  referral_code: string;
  total_referrals: number;
  real_referral_count?: number;
  world_cup_referral_count?: number;
  is_test_mode?: boolean;
  test_referral_count?: number | null;
  completed_referrals: number;
  pending_referrals: number;
  awaiting_kyc: number;
  total_earned: number;
  current_level: number;
  current_level_name: string;
  current_level_color: string;
  next_level: number | null;
  shares_to_next_level: number | null;
  level_progress_percent: number;
  available_to_claim: number;
  claimable_level_rewards: Array<{
    level: number;
    level_name: string;
    reward_type: 'card' | 'cash';
    reward_amount: number | null;
    reward_description: string;
  }>;
}

export interface ReferralLevel {
  level: number;
  shares_required: number;
  reward_type: 'cash' | 'card' | 'bonus';
  reward_amount: number | null;
  reward_description: string;
  level_name: string;
  level_color: string;
}

/**
 * Get referral statistics
 */
export async function getReferralStats(
  userId: string,
  loginCode: string
): Promise<{ status: boolean; message?: string; data?: ReferralStats }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);

  const response = await fetch(`${BASE_URL}/api/v2/user/referral_stats?${params.toString()}`);
  return response.json();
}

/**
 * Get referral levels
 */
export async function getReferralLevels(
  userId: string,
  loginCode: string
): Promise<{ status: boolean; message?: string; data?: ReferralLevel[] }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);

  const response = await fetch(`${BASE_URL}/api/v2/user/referral_levels?${params.toString()}`);
  return response.json();
}

// ============================================
// SUPPORT TICKET APIs
// ============================================

export interface TicketReply {
  id: number;
  ticketId: number;
  userId: number;
  message: string;
  isAdmin: boolean;
  createdDtm: string;
  user_name?: string;
}

export interface SupportTicket {
  id: string;
  ticket_id?: string;
  userId?: string;
  subject: string;
  message?: string;
  description?: string;
  categoryId?: string;
  category_id?: string;
  category_name?: string;
  category?: string;
  resolved?: string;
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  clientReply?: string;
  supportReply?: string;
  createdDtm?: string;
  created_at?: string;
  updated_at?: string;
  userFirstName?: string;
  userLastName?: string;
  userEmail?: string;
  messages?: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  message: string;
  sender: 'user' | 'support';
  sender_name: string;
  created_at: string;
  attachments?: string[];
}

export interface CreateTicketRequest {
  subject: string;
  description: string;
  category: string;
  priority?: string;
}

/**
 * Get all support tickets for a user
 */
export async function getSupportTickets(
  userId: string,
  loginCode: string,
  state?: 'open' | 'resolved'
): Promise<{ status: boolean; message?: string; data?: SupportTicket[]; total_count?: number }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  if (state) params.append('state', state);
  
  const response = await fetch(`${BASE_URL}/api/v2/tickets?${params.toString()}`);
  return response.json();
}

/**
 * Get a single support ticket with replies
 */
export async function getTicketDetails(
  userId: string,
  loginCode: string,
  ticketId: number
): Promise<{ status: boolean; message?: string; data?: { ticket: SupportTicket; replies: TicketReply[] } }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  
  const response = await fetch(`${BASE_URL}/api/v2/tickets/${ticketId}?${params.toString()}`);
  return response.json();
}

/**
 * Create a new support ticket
 */
export async function createSupportTicket(
  userId: string,
  loginCode: string,
  subject: string,
  message: string,
  category_id: number,
  priority: 'low' | 'medium' | 'high'
): Promise<{ status: boolean; message?: string; data?: SupportTicket }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('subject', subject);
  params.append('message', message);
  params.append('category_id', category_id.toString());
  params.append('priority', priority);

  const response = await fetch(`${BASE_URL}/api/v2/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Reply to a support ticket
 */
export async function replyToTicket(
  userId: string,
  loginCode: string,
  ticketId: number,
  message: string
): Promise<{ status: boolean; message?: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('message', message);

  const response = await fetch(`${BASE_URL}/api/v2/tickets/${ticketId}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Close a support ticket
 */
export async function closeTicket(
  userId: string,
  loginCode: string,
  ticketId: number
): Promise<{ status: boolean; message?: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('ticket_id', ticketId.toString());

  const response = await fetch(`${BASE_URL}/api/v2/tickets/${ticketId}/close`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Get ticket categories
 */
export interface TicketCategory {
  categoryId: number;
  categoryName: string;
}

export async function getTicketCategories(
  userId: string,
  loginCode: string
): Promise<{ status: boolean; message?: string; data?: TicketCategory[] }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);

  const response = await fetch(`${BASE_URL}/api/v2/tickets/categories?${params.toString()}`);
  return response.json();
}

/**
 * Get ticket counts (open/resolved)
 */
export interface TicketCounts {
  open: number;
  resolved: number;
  total: number;
}

export async function getTicketCounts(
  userId: string,
  loginCode: string
): Promise<{ status: boolean; message?: string; data?: TicketCounts }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);

  const response = await fetch(`${BASE_URL}/api/v2/tickets/counts?${params.toString()}`);
  return response.json();
}

// ============================================
// USERNAME APIs
// ============================================

/**
 * Check if a username is available
 */
export async function checkUsernameAvailability(
  username: string
): Promise<{ status: boolean; available: boolean; message?: string }> {
  const response = await fetch(
    `${BASE_URL}/api/v2/User/check_username?user_name=${encodeURIComponent(username)}`
  );
  return response.json();
}

/**
 * Update username (limited to once per month)
 */
export async function updateUsername(
  userId: string,
  loginCode: string,
  newUsername: string
): Promise<{ status: boolean; message?: string; data?: { can_change_again: string } }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('new_username', newUsername);

  const response = await fetch(`${BASE_URL}/api/v2/User/update_username`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

// ============================================
// NOTIFICATIONS APIs
// ============================================

export interface NotificationItem {
  id: number;
  to_user_id: number;
  title: string;
  message: string;
  type: number;
  pic_url: string | null;
  is_read: number;
  created_at: string;
}

export interface NotificationResponse {
  status: boolean;
  data: NotificationItem[];
  meta_data?: {
    types: { [key: string]: string };
  };
}

/**
 * Get user notifications
 */
export async function getNotifications(
  userId: string,
  loginCode: string
): Promise<NotificationResponse> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);

  const response = await fetch(`${BASE_URL}/api/v2/notification/get_notifications?${params.toString()}`);
  return response.json();
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(
  userId: string,
  loginCode: string,
  notificationId: string
): Promise<{ status: boolean; message?: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('notificationId', notificationId);

  const response = await fetch(`${BASE_URL}/api/v2/notification/mark_as_read`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(
  userId: string,
  loginCode: string
): Promise<{ status: boolean; message?: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);

  const response = await fetch(`${BASE_URL}/api/v2/notification/mark_all_as_read`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

// ============================================
// DEPOSIT REQUEST (Payment Request) APIs
// ============================================

export interface DepositRequest {
  id: string;
  amount: number | string;
  status: number; // 4=pending, 3=approved, 5=rejected
  createdDtm: string;
  txnCode?: string;
  purpose?: string;
  // Sent requests (to_user info)
  to_first_name?: string;
  to_last_name?: string;
  to_email?: string;
  to_avatar?: string;
  // Received requests (from_user info)
  from_first_name?: string;
  from_last_name?: string;
  from_email?: string;
  from_avatar?: string;
}

/**
 * Lookup user for deposit request
 * Backend returns: user_id (plain numeric), userId (hashed), first_name, last_name, email, ppic
 */
export async function lookupUserForDepositRequest(
  userId: string,
  loginCode: string,
  emailOrPhone: string
): Promise<{ status: boolean; data?: { user_id: string; userId: string; first_name: string; last_name: string; email: string; ppic?: string }; message?: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('screen', '2');
  params.append('emailorphone', emailOrPhone);

  const response = await fetch(`${BASE_URL}/api/v1/transactions?${params.toString()}`);
  return response.json();
}

/**
 * Create deposit request (request payment from someone)
 */
export async function createDepositRequest(
  userId: string,
  loginCode: string,
  emailOrPhone: string,
  amount: number,
  userIdFrom: string,
  purpose?: string
): Promise<{ status: boolean; message?: string; data?: DepositRequest }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('screen', '3');
  params.append('emailorphone', emailOrPhone);
  params.append('amount', amount.toString());
  params.append('userId_from', userIdFrom);
  if (purpose) params.append('purpose', purpose);

  const response = await fetch(`${BASE_URL}/api/v1/transactions?${params.toString()}`);
  return response.json();
}

/**
 * Get sent deposit requests (requests I've sent to others)
 */
export async function getSentDepositRequests(
  userId: string,
  loginCode: string,
  page?: number,
  limit?: number,
  status?: number
): Promise<{ status: boolean; transactions?: DepositRequest[]; pagination?: { page: number; total: number; limit: number | null; pages: number }; message?: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  if (page !== undefined) params.append('page', page.toString());
  if (limit !== undefined) params.append('limit', limit.toString());
  if (status !== undefined) params.append('status', status.toString());

  const response = await fetch(`${BASE_URL}/api/v2/Transaction/sent_deposit_requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Get received deposit requests (requests others have sent to me)
 */
export async function getReceivedDepositRequests(
  userId: string,
  loginCode: string,
  page?: number,
  limit?: number,
  status?: number
): Promise<{ status: boolean; transactions?: DepositRequest[]; pagination?: { page: number; total: number; limit: number | null; pages: number }; message?: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  if (page !== undefined) params.append('page', page.toString());
  if (limit !== undefined) params.append('limit', limit.toString());
  if (status !== undefined) params.append('status', status.toString());

  const response = await fetch(`${BASE_URL}/api/v2/Transaction/received_deposit_requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Respond to deposit request (accept or reject)
 */
export async function respondToDepositRequest(
  userId: string,
  loginCode: string,
  depositId: string,
  accept: boolean
): Promise<{ status: boolean; message?: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('id', depositId);
  params.append('accept', accept ? '1' : '0');
  params.append('reject', accept ? '0' : '1');

  const response = await fetch(`${BASE_URL}/api/v2/Transaction/manage_received_deposit_request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Delete or edit deposit request
 */
export async function manageDepositRequest(
  userId: string,
  loginCode: string,
  depositId: string,
  deleteRequest: boolean,
  newAmount?: number
): Promise<{ status: boolean; message?: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('id', depositId);
  params.append('delete', deleteRequest ? '1' : '0');
  params.append('edit', deleteRequest ? '0' : '1');
  if (newAmount !== undefined) params.append('amount', newAmount.toString());

  const response = await fetch(`${BASE_URL}/api/v2/Transaction/manage_deposit_request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Find user by identifier (email/username/phone)
 */
export async function findUserByIdentifier(
  userId: string,
  loginCode: string,
  identifier: string
): Promise<{ status: boolean; data?: { user_id: string; first_name: string; last_name: string; email: string; user_name: string; ppic?: string }; message?: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('identifier', identifier);

  const response = await fetch(`${BASE_URL}/api/v2/User/find_by_identifier?${params.toString()}`);
  return response.json();
}

// ============================================
// CRYPTO TOP UP APIs
// ============================================

export type CryptoCoin = 'USDC' | 'USDT' | 'PYUSD';

export interface CryptoAddressResponse {
  status: boolean;
  message?: string;
  data?: {
    address: string;
    coin: string;
    network?: string;
  };
}

/**
 * Generate crypto deposit address for USDC, USDT, or PYUSD
 */
export async function generateCryptoAddress(
  userId: string,
  loginCode: string,
  coin: CryptoCoin
): Promise<CryptoAddressResponse> {
  // Build body string manually to ensure correct format
  const body = `userId=${encodeURIComponent(userId)}&loginCode=${encodeURIComponent(loginCode)}&coin=${encodeURIComponent(coin)}`;
  
  console.log('Crypto address request body:', body);

  const response = await fetch(`${BASE_URL}/api/v2/Maplerad/crypto_address`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body,
  });
  return response.json();
}

// ============================================
// BINANCE PAYOUT APIs
// ============================================

export interface BinancePayoutResponse {
  status: boolean;
  message?: string;
  data?: {
    txn_code?: string;
    amount?: number;
    fee?: number;
    net_amount?: number;
  };
}

/**
 * Get Binance minimum withdrawal amount
 */
export async function getBinanceMinimumWithdrawal(
  userId: string,
  loginCode: string,
  network: string = 'BNB',
  asset: string = 'USDT'
): Promise<{ status: boolean; message?: string; data?: { minimum_withdrawal: number } }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('network', network);
  params.append('asset', asset);

  const response = await fetch(`${BASE_URL}/api/v2/Transaction/binance_minimum_withdrawal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

/**
 * Withdraw USDT to Binance account via BEP20 network
 */
export async function binancePayout(
  userId: string,
  loginCode: string,
  email: string,
  amount: number,
  network: string = 'BSC',
  asset: string = 'USDT'
): Promise<BinancePayoutResponse> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('email', email);
  params.append('amount', amount.toString());
  params.append('network', network);
  params.append('asset', asset);

  const response = await fetch(`${BASE_URL}/api/v2/Transaction/binance_payout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

// ============================================
// WITHDRAWAL APIs (Bank Transfers)
// ============================================

export interface UsdWithdrawalResponse {
  status: boolean;
  message?: string;
  data?: {
    txn_code?: string;
    amount?: number;
    fee?: number;
    net_amount?: number;
  };
}

/**
 * USD withdrawal to US bank account
 */
export async function usdWithdrawal(
  userId: string,
  loginCode: string,
  data: {
    account_title: string;
    routing_number: string;
    account_number: string;
    account_type: string;
    amount: number;
    recipient_type: string;
    reference_no: string;
    recipient_country?: string;
    recipient_city?: string;
    recipient_address?: string;
    recipient_zip_code?: string;
  }
): Promise<UsdWithdrawalResponse> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('account_title', data.account_title);
  params.append('routing_number', data.routing_number);
  params.append('account_number', data.account_number);
  params.append('account_type', data.account_type);
  params.append('amount', data.amount.toString());
  params.append('recipient_type', data.recipient_type);
  params.append('reference_no', data.reference_no);
  
  if (data.recipient_country) params.append('recipient_country', data.recipient_country);
  if (data.recipient_city) params.append('recipient_city', data.recipient_city);
  if (data.recipient_address) params.append('recipient_address', data.recipient_address);
  if (data.recipient_zip_code) params.append('recipient_zip_code', data.recipient_zip_code);

  const response = await fetch(`${BASE_URL}/api/v2/Transaction/usd_withdrawal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

export interface EuroWithdrawalResponse {
  status: boolean;
  message?: string;
  data?: {
    txn_code?: string;
    amount?: number;
    fee?: number;
    net_amount?: number;
  };
}

/**
 * EUR withdrawal via SEPA (euro_withdrawal_new endpoint)
 */
export async function euroWithdrawalNew(
  userId: string,
  loginCode: string,
  data: {
    recipient_type: string;
    amount: number;
    reference: string;
    from_currency_id?: number;
    to_currency_id?: number;
    iban?: string;
    bank_code?: string;
    recipient_name?: string;
    recipient_email?: string;
    recipient_country?: string;
    recipient_city?: string;
    recipient_address?: string;
    recipient_zip_code?: string;
    swift?: string;
  }
): Promise<EuroWithdrawalResponse> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('recipient_type', data.recipient_type);
  params.append('amount', data.amount.toString());
  params.append('reference', data.reference);
  params.append('from_currency_id', (data.from_currency_id || 3).toString());
  params.append('to_currency_id', (data.to_currency_id || 3).toString());
  
  if (data.iban) params.append('iban', data.iban);
  if (data.bank_code) params.append('bank_code', data.bank_code);
  if (data.recipient_name) params.append('recipient_name', data.recipient_name);
  if (data.recipient_email) params.append('recipient_email', data.recipient_email);
  if (data.recipient_country) params.append('recipient_country', data.recipient_country);
  if (data.recipient_city) params.append('recipient_city', data.recipient_city);
  if (data.recipient_address) params.append('recipient_address', data.recipient_address);
  if (data.recipient_zip_code) params.append('recipient_zip_code', data.recipient_zip_code);
  if (data.swift) params.append('swift', data.swift);

  const response = await fetch(`${BASE_URL}/api/v2/Transaction/euro_withdrawal_new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

export interface SwiftWithdrawalResponse {
  status: boolean;
  message?: string;
  data?: {
    txn_code?: string;
    amount?: number;
    fee?: number;
    net_amount?: number;
  };
}

/**
 * International withdrawal via SWIFT
 */
export async function swiftWithdrawal(
  userId: string,
  loginCode: string,
  data: {
    recipient_name: string;
    amount: number;
    reference: string;
    from_currency_id: number;
    to_currency_id: number;
    swift: string;
    recipient_country?: string;
    recipient_city?: string;
    recipient_address?: string;
    recipient_zip_code?: string;
    account_name?: string;
  }
): Promise<SwiftWithdrawalResponse> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('recipient_name', data.recipient_name);
  params.append('amount', data.amount.toString());
  params.append('reference', data.reference);
  params.append('from_currency_id', data.from_currency_id.toString());
  params.append('to_currency_id', data.to_currency_id.toString());
  params.append('swift', data.swift);
  
  if (data.recipient_country) params.append('recipient_country', data.recipient_country);
  if (data.recipient_city) params.append('recipient_city', data.recipient_city);
  if (data.recipient_address) params.append('recipient_address', data.recipient_address);
  if (data.recipient_zip_code) params.append('recipient_zip_code', data.recipient_zip_code);
  if (data.account_name) params.append('account_name', data.account_name);

  const response = await fetch(`${BASE_URL}/api/v2/Transaction/swift_withdrawal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

// ============================================
// GIFT CARD APIs
// ============================================

export interface GiftCardRedeemResponse {
  status: boolean;
  message?: string;
  msg?: string;
  data?: {
    amount?: number;
    currency?: string;
  };
}

/**
 * Redeem a gift card code
 */
export async function redeemGiftCard(
  userId: string,
  loginCode: string,
  giftCardCode: string,
  accountId?: string
): Promise<GiftCardRedeemResponse> {
  const params = new URLSearchParams();
  params.append('screen', '8');
  params.append('accountId', accountId || 'default');
  params.append('giftCard', giftCardCode.trim());
  params.append('userId', userId);
  params.append('loginCode', loginCode);

  console.log('Gift card redeem request:', { giftCard: giftCardCode, accountId: accountId || 'default' });

  const response = await fetch(`${BASE_URL}/api/v1/transactions?${params.toString()}`);
  return response.json();
}
