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
 * Get referral statistics
 */
export async function getReferralStats(userId: string, loginCode: string): Promise<ReferralStatsResponse> {
  const response = await fetch(
    `${BASE_URL}/api/v2/user/referral_stats?userId=${encodeURIComponent(userId)}&loginCode=${encodeURIComponent(loginCode)}`
  );
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
// CARD API FUNCTIONS (Physical Cards & Maplerad Virtual Cards)
// ============================================================================

export interface Card {
  id: string;
  card_id: string;
  card_type: 'physical' | 'virtual';
  card_brand: 'visa' | 'mastercard';
  card_name: string;
  card_number_masked: string;
  last_four: string;
  expiry_month: string;
  expiry_year: string;
  cvv_masked: string;
  cardholder_name: string;
  status: 'active' | 'frozen' | 'blocked' | 'pending' | 'expired';
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
    `${BASE_URL}/api/v2/Cards/list?userId=${encodeURIComponent(userId)}&loginCode=${encodeURIComponent(loginCode)}`
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
  const params = new URLSearchParams({ userId, loginCode, cardId });
  if (options?.page) params.append('page', options.page.toString());
  if (options?.limit) params.append('limit', options.limit.toString());
  if (options?.from_date) params.append('from_date', options.from_date);
  if (options?.to_date) params.append('to_date', options.to_date);

  const response = await fetch(`${BASE_URL}/api/v2/Cards/transactions?${params.toString()}`);
  return response.json();
}

/**
 * Get card spending summary
 */
export async function getCardSpendingSummary(
  userId: string,
  loginCode: string,
  cardId: string
): Promise<{ status: boolean; data: CardSpendingSummary }> {
  const response = await fetch(
    `${BASE_URL}/api/v2/Cards/spending_summary?userId=${encodeURIComponent(userId)}&loginCode=${encodeURIComponent(loginCode)}&cardId=${encodeURIComponent(cardId)}`
  );
  return response.json();
}

/**
 * Get card limits
 */
export async function getCardLimits(
  userId: string,
  loginCode: string,
  cardId: string
): Promise<{ status: boolean; data: CardLimits }> {
  const response = await fetch(
    `${BASE_URL}/api/v2/Cards/limits?userId=${encodeURIComponent(userId)}&loginCode=${encodeURIComponent(loginCode)}&cardId=${encodeURIComponent(cardId)}`
  );
  return response.json();
}

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
  params.append('cardId', cardId);

  const response = await fetch(`${BASE_URL}/api/v2/Cards/freeze`, {
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
  params.append('cardId', cardId);

  const response = await fetch(`${BASE_URL}/api/v2/Cards/unfreeze`, {
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
  params.append('cardId', cardId);

  const response = await fetch(`${BASE_URL}/api/v2/Cards/view_pin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
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
    `${BASE_URL}/api/v2/Cards/maplerad/details?userId=${encodeURIComponent(userId)}&loginCode=${encodeURIComponent(loginCode)}&cardId=${encodeURIComponent(cardId)}`
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
  const params = new URLSearchParams({ userId, loginCode, cardId });
  if (options?.page) params.append('page', options.page.toString());
  if (options?.limit) params.append('limit', options.limit.toString());

  const response = await fetch(`${BASE_URL}/api/v2/Cards/maplerad/transactions?${params.toString()}`);
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
  params.append('recipient', data.recipient);
  params.append('amount', data.amount.toString());
  if (data.currency) params.append('currency', data.currency);
  if (data.note) params.append('note', data.note);

  const response = await fetch(`${BASE_URL}/api/v2/Transaction/p2p_transfer`, {
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
  params.append('recipient', recipient);

  const response = await fetch(`${BASE_URL}/api/v2/Transaction/lookup_recipient?${params.toString()}`);
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
export async function unlinkBankAccount(
  userId: string,
  loginCode: string,
  accountId: string
): Promise<{ status: boolean; message?: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('account_id', accountId);

  const response = await fetch(`${BASE_URL}/api/v2/BankAccount/unlink`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
  return response.json();
}

// ============================================
// SUPPORT TICKET APIs
// ============================================

export interface SupportTicket {
  id: string;
  ticket_id: string;
  subject: string;
  description: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
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
  status?: string
): Promise<{ status: boolean; message?: string; data?: SupportTicket[] }> {
  let url = `${BASE_URL}/api/v2/Support/tickets?userId=${encodeURIComponent(userId)}&loginCode=${encodeURIComponent(loginCode)}`;
  if (status) url += `&status=${encodeURIComponent(status)}`;
  const response = await fetch(url);
  return response.json();
}

/**
 * Get a single support ticket with messages
 */
export async function getTicketDetails(
  userId: string,
  loginCode: string,
  ticketId: string
): Promise<{ status: boolean; message?: string; data?: SupportTicket }> {
  const response = await fetch(
    `${BASE_URL}/api/v2/Support/ticket/${ticketId}?userId=${encodeURIComponent(userId)}&loginCode=${encodeURIComponent(loginCode)}`
  );
  return response.json();
}

/**
 * Create a new support ticket
 */
export async function createSupportTicket(
  userId: string,
  loginCode: string,
  data: CreateTicketRequest
): Promise<{ status: boolean; message?: string; data?: SupportTicket }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('subject', data.subject);
  params.append('description', data.description);
  params.append('category', data.category);
  if (data.priority) params.append('priority', data.priority);

  const response = await fetch(`${BASE_URL}/api/v2/Support/ticket/create`, {
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
  ticketId: string,
  message: string
): Promise<{ status: boolean; message?: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('ticket_id', ticketId);
  params.append('message', message);

  const response = await fetch(`${BASE_URL}/api/v2/Support/ticket/reply`, {
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
  ticketId: string
): Promise<{ status: boolean; message?: string }> {
  const params = new URLSearchParams();
  params.append('userId', userId);
  params.append('loginCode', loginCode);
  params.append('ticket_id', ticketId);

  const response = await fetch(`${BASE_URL}/api/v2/Support/ticket/close`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });
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
    `${BASE_URL}/api/v2/User/check_username?username=${encodeURIComponent(username)}`
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
