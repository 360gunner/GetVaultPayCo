"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getAccountBalance, getDashboardTransactionsExtended, getDashboardTransactionsByCurrency, createCurrencyWallet, getUserCards, getCardTransactions, freezeCard, unfreezeCard, getCardPin, fundCard, withdrawFromCard, generatePaymentQRCode, generateProfileQRCode, getUserQRCodes, p2pTransfer, lookupP2PRecipient, getLiveRates, convertCurrency, getBinanceMinimumWithdrawal, binancePayout, usdWithdrawal, euroWithdrawalNew, swiftWithdrawal, getUserBankAccounts, linkBankAccount, deleteBankAccount, getLinkedBankAccounts, createPlaidLinkToken, unlinkPlaidAccount, getReferralStats, getReferralLevels, getSupportTickets, createSupportTicket, replyToTicket, closeTicket, getTicketCategories, getTicketDetails, checkUsernameAvailability, updateUsername, changePassword, getNotifications, markNotificationAsRead, markAllNotificationsAsRead, lookupUserForDepositRequest, createDepositRequest, getSentDepositRequests, getReceivedDepositRequests, manageDepositRequest, respondToDepositRequest, findUserByIdentifier, generateCryptoAddress, redeemGiftCard, getPhysicalCard, freezePhysicalCard, getPhysicalCardPin, getCardStatus, activateCard, getMapleradCardDetails, getMapleradCardTransactions, uploadProfilePicture, uploadCoverPhoto, getSocialStats, getFollowers, getFollowing, getFollowRequestsCount, getFollowRequests, acceptFollowRequest, rejectFollowRequest, setProfilePrivacy, DashboardTransaction, BalanceResponse, Card, CardTransaction, CardSpendingSummary, CardLimits, PaymentQRCode, ProfileQRCode, LinkedBankAccount, ReferralStats, ReferralLevel, SupportTicket, NotificationItem, DepositRequest, CryptoCoin, PhysicalCard, CardStatusResponse, TicketCategory, TicketCounts, TicketReply } from "@/lib/vaultpay-api";

type DashboardTab = "dashboard" | "feed" | "payments" | "accounts" | "cards" | "friends" | "rewards" | "qrcodes" | "helpdesk" | "profile" | "settings";

const CURRENCY_SYMBOLS: Record<string, string> = { USD: "$", EUR: "E", GBP: "L", NGN: "N", CAD: "C$", AUD: "A$", JPY: "Y" };
const CURRENCY_NAMES: Record<string, string> = { USD: "US Dollar", EUR: "Euro", GBP: "British Pound", NGN: "Nigerian Naira" };

// Helper to normalize image URLs (fix double slashes and ensure correct path)
const normalizeImageUrl = (url: string | null | undefined): string | null => {
  if (!url) return null;
  // Replace double slashes (except after protocol)
  let normalized = url.replace(/([^:])\/\//g, '$1/');
  // If URL doesn't start with http, prepend the base
  if (!normalized.startsWith('http')) {
    normalized = `http://98.83.36.86/api/uploads/${normalized.replace(/^\/*(api\/)?uploads\//, '')}`;
  }
  return normalized;
};

const CARD_STYLES: Record<string, { bg: string; text: string }> = {
  default: { bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", text: "#fff" },
  debit: { bg: "linear-gradient(135deg, #0f3460 0%, #16213e 100%)", text: "#fff" },
  gold: { bg: "linear-gradient(135deg, #b8860b 0%, #daa520 50%, #b8860b 100%)", text: "#000" },
  rewards: { bg: "linear-gradient(135deg, #1e3a5f 0%, #2e5a8f 100%)", text: "#fff" },
  virtual: { bg: "linear-gradient(135deg, #06FF89 0%, #00c853 100%)", text: "#000" },
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [balances, setBalances] = useState<BalanceResponse["data"] | null>(null);
  const [dashboardTransactions, setDashboardTransactions] = useState<DashboardTransaction[]>([]);
  const [walletTransactions, setWalletTransactions] = useState<DashboardTransaction[]>([]);
  const [walletTransactionsLoading, setWalletTransactionsLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);
  const [addWalletLoading, setAddWalletLoading] = useState(false);
  const [selectedNewCurrency, setSelectedNewCurrency] = useState<string | null>(null);
  
  // Card type tab state
  const [cardType, setCardType] = useState<'physical' | 'virtual'>('virtual');
  
  // Virtual cards state
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [cardTransactions, setCardTransactions] = useState<CardTransaction[]>([]);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [cardDetailsLoading, setCardDetailsLoading] = useState(false);
  const [showCardNumbers, setShowCardNumbers] = useState(false);
  const [mapleradEnrolled, setMapleradEnrolled] = useState<boolean | null>(null);
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [spendingSummary, setSpendingSummary] = useState<CardSpendingSummary | null>(null);
  const [cardLimits, setCardLimits] = useState<CardLimits | null>(null);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [showExpiry, setShowExpiry] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [cardRequestStatus, setCardRequestStatus] = useState<string | null>(null);
  const [isCheckingCardStatus, setIsCheckingCardStatus] = useState(false);
  const [showLimitsModal, setShowLimitsModal] = useState(false);
  
  // Physical card state
  const [physicalCard, setPhysicalCard] = useState<PhysicalCard | null>(null);
  const [physicalCardBalance, setPhysicalCardBalance] = useState('0.00');
  const [physicalCardLoading, setPhysicalCardLoading] = useState(false);
  const [cardStatus, setCardStatus] = useState<CardStatusResponse | null>(null);
  const [physicalCardFrozen, setPhysicalCardFrozen] = useState(false);
  
  // Card modals
  const [showPinModal, setShowPinModal] = useState(false);
  const [cardPin, setCardPin] = useState<string | null>(null);
  const [showCardFundModal, setShowCardFundModal] = useState(false);
  const [showCardWithdrawModal, setShowCardWithdrawModal] = useState(false);
  const [cardFundAmount, setCardFundAmount] = useState("");
  const [cardWithdrawAmount, setCardWithdrawAmount] = useState("");
  const [cardOperationLoading, setCardOperationLoading] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [addCardForm, setAddCardForm] = useState({ brand: 'VISA', currency: 'USD', type: 'VIRTUAL', fundAmount: '', cardPin: '' });
  const [addCardLoading, setAddCardLoading] = useState(false);

  // QR Code states
  const [qrSubTab, setQrSubTab] = useState<"generate" | "myqrcodes" | "scanner">("generate");
  const [qrPaymentAmount, setQrPaymentAmount] = useState<string>("0.00");
  const [qrPaymentDescription, setQrPaymentDescription] = useState<string>("");

  // Payments states
  const [paymentsSubTab, setPaymentsSubTab] = useState<"send" | "convert" | "withdraw" | "transfer">("send");
  const [sendAmount, setSendAmount] = useState<string>("0.00");
  const [sendRecipient, setSendRecipient] = useState<string>("");
  const [sendNote, setSendNote] = useState<string>("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [phoneContacts, setPhoneContacts] = useState<{ name: string; phone?: string; email?: string; initials: string }[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [contactsSupported, setContactsSupported] = useState(true);
  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
  const [recipientInfo, setRecipientInfo] = useState<{ user_id: string; user_name: string; first_name: string; last_name: string; ppic: string; is_verified: boolean } | null>(null);
  const [recipientLoading, setRecipientLoading] = useState(false);
  const [paymentSigning, setPaymentSigning] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionResult, setTransactionResult] = useState<{ txn_code: string; amount: number; recipient_name: string } | null>(null);
  const [transferType, setTransferType] = useState<"select" | "bank" | "sepa" | "international">("select");
  const [convertFromCurrency, setConvertFromCurrency] = useState<string>("USD");
  const [convertToCurrency, setConvertToCurrency] = useState<string>("EUR");
  const [convertAmount, setConvertAmount] = useState<string>("");
  const [liveRates, setLiveRates] = useState<Record<string, { code: string; value: number }>>({});
  const [convertLoading, setConvertLoading] = useState(false);
  const [ratesLoading, setRatesLoading] = useState(false);
  const [includeProfilePic, setIncludeProfilePic] = useState(true);
  const [includeContactInfo, setIncludeContactInfo] = useState(true);
  const [allowDirectPayments, setAllowDirectPayments] = useState(true);
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [myQRCodes, setMyQRCodes] = useState<PaymentQRCode[]>([]);
  const [profileQR, setProfileQR] = useState<ProfileQRCode | null>(null);
  const [linkedBankAccounts, setLinkedBankAccounts] = useState<LinkedBankAccount[]>([]);
  const [bankAccountsLoading, setBankAccountsLoading] = useState(false);
  const [plaidLoading, setPlaidLoading] = useState(false);
  const [userCountry, setUserCountry] = useState<string>("");
  const [showBankLinkModal, setShowBankLinkModal] = useState(false);
  const [bankLinkRegion, setBankLinkRegion] = useState<'us-canada' | 'europe' | 'global' | null>(null);
  const [bankLinkForm, setBankLinkForm] = useState({ currency: 'USD', bankName: '', routingNumber: '', accountNumber: '', confirmAccountNumber: '', accountType: 'checking', iban: '', confirmIban: '', swiftCode: '', bankAddress: '' });
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [referralLevels, setReferralLevels] = useState<ReferralLevel[]>([]);
  const [referralLoading, setReferralLoading] = useState(false);
  const [profileSection, setProfileSection] = useState<"personal" | "password" | "privacy" | "notifications">("personal");
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [showPhotoUploadModal, setShowPhotoUploadModal] = useState(false);
  const [photoUploadType, setPhotoUploadType] = useState<'profile' | 'cover'>('profile');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [followersModalType, setFollowersModalType] = useState<'followers' | 'following'>('followers');
  const [followersList, setFollowersList] = useState<any[]>([]);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [socialStats, setSocialStats] = useState<{ followers_count: number; following_count: number } | null>(null);
  const [isPrivateProfile, setIsPrivateProfile] = useState(false);
  const [pendingFollowRequests, setPendingFollowRequests] = useState(0);
  const [followRequestsList, setFollowRequestsList] = useState<any[]>([]);
  const [showFollowRequestsModal, setShowFollowRequestsModal] = useState(false);
  const [followRequestsLoading, setFollowRequestsLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "", email: "", secondaryEmail: "", phone: "", dob: "", address: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({ profileVisibility: "public", showActivity: true, allowTagging: true, showOnlineStatus: true });
  const [notificationSettings, setNotificationSettings] = useState({ emailNotifications: true, pushNotifications: true, smsNotifications: false, marketingEmails: false, transactionAlerts: true, securityAlerts: true, weeklyReport: true });
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [connectedDevices] = useState([
    { id: "1", name: "Windows PC - Chrome", location: "New York, US", lastActive: "Active now", current: true, icon: "💻" },
    { id: "2", name: "iPhone 14 Pro - Safari", location: "New York, US", lastActive: "2 hours ago", current: false, icon: "📱" },
    { id: "3", name: "MacBook Pro - Chrome", location: "Los Angeles, US", lastActive: "3 days ago", current: false, icon: "💻" },
  ]);
  const [helpSubTab, setHelpSubTab] = useState<"faq" | "tickets" | "contact">("faq");
  const [faqSearch, setFaqSearch] = useState("");
  const [selectedFaq, setSelectedFaq] = useState<{ question: string; answer: string; category: string } | null>(null);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({ subject: "", message: "", category_id: 0, priority: "medium" as 'low' | 'medium' | 'high' });
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketReply, setTicketReply] = useState("");
  const [ticketCategories, setTicketCategories] = useState<TicketCategory[]>([]);
  const [ticketCounts, setTicketCounts] = useState<TicketCounts | null>(null);
  const [ticketLimitReached, setTicketLimitReached] = useState(false);
  const [weeklyTicketCount, setWeeklyTicketCount] = useState(0);
  const [ticketReplies, setTicketReplies] = useState<TicketReply[]>([]);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string>("All");
  const [showAllTickets, setShowAllTickets] = useState(false);
  const [allTicketsFilter, setAllTicketsFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const WEEKLY_TICKET_LIMIT = 3;
  const [newUsername, setNewUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameUpdating, setUsernameUpdating] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedTopUpMethod, setSelectedTopUpMethod] = useState<string | null>(null);
  const [selectedCryptoCoin, setSelectedCryptoCoin] = useState<CryptoCoin>('USDC');
  const [cryptoAddress, setCryptoAddress] = useState<string | null>(null);
  const [cryptoLoading, setCryptoLoading] = useState(false);
  const [cryptoTimeRemaining, setCryptoTimeRemaining] = useState(0);
  const [giftCardCode, setGiftCardCode] = useState('');
  const [giftCardLoading, setGiftCardLoading] = useState(false);
  const [binanceEmail, setBinanceEmail] = useState('');
  const [binanceAmount, setBinanceAmount] = useState('');
  const [binanceLoading, setBinanceLoading] = useState(false);
  const [binanceMinWithdrawal, setBinanceMinWithdrawal] = useState(10);
  const [binanceMinLoading, setBinanceMinLoading] = useState(false);
  const [bankTransferForm, setBankTransferForm] = useState({ bankName: '', accountNumber: '', routingNumber: '', accountHolder: '', amount: '', accountType: 'checking', recipientCountry: '', recipientCity: '', recipientAddress: '', recipientZipCode: '', purpose: '' });
  const [bankTransferLoading, setBankTransferLoading] = useState(false);
  const [sepaTransferForm, setSepaTransferForm] = useState({ iban: '', bicSwift: '', beneficiaryName: '', reference: '', amount: '' });
  const [sepaTransferLoading, setSepaTransferLoading] = useState(false);
  const [swiftTransferForm, setSwiftTransferForm] = useState({ recipientCountry: '', swiftCode: '', accountNumber: '', beneficiaryName: '', beneficiaryAddress: '', recipientCity: '', recipientZipCode: '', transferPurpose: '', amount: '' });
  const [swiftTransferLoading, setSwiftTransferLoading] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [showRequestPayment, setShowRequestPayment] = useState(false);
  const [requestPaymentTab, setRequestPaymentTab] = useState<"create" | "pending" | "received" | "history">("create");
  const [paymentRequests, setPaymentRequests] = useState<Array<{ id: string; email: string; amount: number; status: "pending" | "accepted" | "declined" | "expired"; created_at: string; note?: string }>>([]);
  const [requestForm, setRequestForm] = useState({ email: "", amount: "", note: "" });
  const [requestLoading, setRequestLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [sentDepositRequests, setSentDepositRequests] = useState<DepositRequest[]>([]);
  const [receivedDepositRequests, setReceivedDepositRequests] = useState<DepositRequest[]>([]);
  const [depositRequestsLoading, setDepositRequestsLoading] = useState(false);
  const [lookupUser, setLookupUser] = useState<{ user_id: string; userId: string; first_name: string; last_name: string; email: string; ppic?: string } | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const [inactivityCountdown, setInactivityCountdown] = useState(20);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  const MOCK_OTP = "12345";
  const INACTIVITY_TIMEOUT = 5 * 60 * 1000;
  const COUNTDOWN_SECONDS = 20;

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    setShowInactivityWarning(false);
    setInactivityCountdown(COUNTDOWN_SECONDS);
    
    if (otpVerified && isAuthenticated) {
      inactivityTimerRef.current = setTimeout(() => {
        setShowInactivityWarning(true);
        setInactivityCountdown(COUNTDOWN_SECONDS);
        countdownTimerRef.current = setInterval(() => {
          setInactivityCountdown((prev) => {
            if (prev <= 1) {
              if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
              logout();
              router.push("/signin");
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, INACTIVITY_TIMEOUT);
    }
  }, [otpVerified, isAuthenticated, logout, router]);

  useEffect(() => {
    if (authLoading) return; // Wait for auth to finish loading from localStorage
    if (!isAuthenticated) { router.push("/signin"); return; }
    // Load user country from localStorage
    const storedCountry = localStorage.getItem("signupCountry") || "";
    setUserCountry(storedCountry);
    const otpVerifiedSession = sessionStorage.getItem("otp_verified");
    if (otpVerifiedSession === "true") {
      setOtpVerified(true);
      loadDashboardData();
    } else {
      setShowOtpModal(true);
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (activeTab === "cards" && user) loadCardsData();
  }, [activeTab, user]);

  useEffect(() => {
    if (selectedCard && user) loadCardDetails(selectedCard.card_id);
  }, [selectedCard, user]);

  useEffect(() => {
    if (activeTab === "qrcodes" && user && qrSubTab === "myqrcodes") loadMyQRCodes();
  }, [activeTab, user, qrSubTab]);

  useEffect(() => {
    if (activeTab === "accounts" && user) loadBankAccounts();
  }, [activeTab, user]);

  useEffect(() => {
    if (activeTab === "rewards" && user) loadReferralData();
  }, [activeTab, user]);

  useEffect(() => {
    if (activeTab === "helpdesk" && user) loadSupportTickets();
  }, [activeTab, user]);

  useEffect(() => {
    if (activeTab === "profile" && user) {
      loadSocialStats();
      loadPrivacyState();
    }
  }, [activeTab, user]);

  useEffect(() => {
    if (otpVerified && isAuthenticated) {
      const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];
      events.forEach((event) => window.addEventListener(event, resetInactivityTimer));
      resetInactivityTimer();
      return () => {
        events.forEach((event) => window.removeEventListener(event, resetInactivityTimer));
        if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      };
    }
  }, [otpVerified, isAuthenticated, resetInactivityTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);
    setOtpError("");
    if (value && index < 4) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const verifyOtp = () => {
    const enteredOtp = otpCode.join("");
    if (enteredOtp === MOCK_OTP) {
      setOtpVerified(true);
      setShowOtpModal(false);
      sessionStorage.setItem("otp_verified", "true");
      loadDashboardData();
    } else {
      setOtpError("Invalid verification code. Please try again.");
      setOtpCode(["", "", "", "", ""]);
    }
  };

  const handleStayLoggedIn = () => {
    setShowInactivityWarning(false);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    setInactivityCountdown(COUNTDOWN_SECONDS);
    resetInactivityTimer();
  };

  const loadSupportTickets = async () => {
    if (!user) return;
    setTicketsLoading(true);
    try {
      const [ticketsRes, categoriesRes] = await Promise.all([
        getSupportTickets(user.user_id, user.login_code),
        getTicketCategories(user.user_id, user.login_code)
      ]);
      
      if (ticketsRes.status && ticketsRes.data) {
        // Normalize ticket data - add status based on resolved field
        const normalizedTickets = ticketsRes.data.map(ticket => ({
          ...ticket,
          status: ticket.resolved === '1' ? 'resolved' : 'open',
          description: ticket.message || ticket.description,
          created_at: ticket.createdDtm || ticket.created_at,
          ticket_id: ticket.id,
        }));
        setSupportTickets(normalizedTickets as any);
        
        // Calculate counts from tickets
        const openCount = normalizedTickets.filter(t => t.status === 'open').length;
        const resolvedCount = normalizedTickets.filter(t => t.status === 'resolved').length;
        setTicketCounts({ open: openCount, resolved: resolvedCount, total: normalizedTickets.length });
      }
      
      // Handle categories with fallback
      if (categoriesRes.status && categoriesRes.data && categoriesRes.data.length > 0) {
        setTicketCategories(categoriesRes.data);
      } else {
        setTicketCategories([
          { categoryId: 1, categoryName: 'Technical Support' },
          { categoryId: 2, categoryName: 'Account Issues' },
          { categoryId: 3, categoryName: 'Billing' },
          { categoryId: 4, categoryName: 'Feature Request' },
          { categoryId: 5, categoryName: 'General Inquiry' }
        ]);
      }
      
      // Check weekly ticket limit
      checkTicketLimit();
    } catch (error) { console.error("Error loading tickets:", error); }
    finally { setTicketsLoading(false); }
  };

  const checkTicketLimit = async () => {
    if (!user) return false;
    try {
      const [openRes, resolvedRes] = await Promise.all([
        getSupportTickets(user.user_id, user.login_code, 'open'),
        getSupportTickets(user.user_id, user.login_code, 'resolved')
      ]);
      
      const allTickets = [...(openRes.data || []), ...(resolvedRes.data || [])];
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const ticketsThisWeek = allTickets.filter(ticket => {
        const ticketDate = new Date(ticket.created_at);
        return ticketDate >= oneWeekAgo;
      });
      
      const count = ticketsThisWeek.length;
      setWeeklyTicketCount(count);
      const isLimitReached = count >= WEEKLY_TICKET_LIMIT;
      setTicketLimitReached(isLimitReached);
      return isLimitReached;
    } catch (error) {
      console.error('Error checking ticket limit:', error);
      return false;
    }
  };

  const handleCreateTicket = async () => {
    if (!user || !newTicketForm.subject || !newTicketForm.message || newTicketForm.category_id === 0) {
      alert("Please fill in all required fields");
      return;
    }
    
    // Check ticket limit before creating
    const isLimitReached = await checkTicketLimit();
    if (isLimitReached) {
      setTicketLimitReached(true);
      return;
    }
    
    try {
      const res = await createSupportTicket(
        user.user_id,
        user.login_code,
        newTicketForm.subject,
        newTicketForm.message,
        newTicketForm.category_id,
        newTicketForm.priority
      );
      if (res.status) {
        alert("Ticket created successfully!");
        setShowNewTicket(false);
        setNewTicketForm({ subject: "", message: "", category_id: 0, priority: "medium" });
        loadSupportTickets();
      } else {
        alert(res.message || "Failed to create ticket");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to create ticket");
    }
  };

  const handleReplyTicket = async () => {
    if (!user || !selectedTicket || !ticketReply) return;
    try {
      const ticketId = parseInt(selectedTicket.ticket_id || selectedTicket.id);
      const res = await replyToTicket(user.user_id, user.login_code, ticketId, ticketReply);
      if (res.status) {
        setTicketReply("");
        loadSupportTickets();
        alert("Reply sent!");
      }
    } catch (error) {
      console.error("Error replying to ticket:", error);
    }
  };

  const handleCloseTicket = async (ticketId: string) => {
    if (!user || !confirm("Are you sure you want to close this ticket?")) return;
    try {
      const ticketIdNum = parseInt(ticketId);
      const res = await closeTicket(user.user_id, user.login_code, ticketIdNum);
      if (res.status) {
        loadSupportTickets();
        setSelectedTicket(null);
        alert("Ticket closed");
      }
    } catch (error) {
      console.error("Error closing ticket:", error);
    }
  };

  const loadBankAccounts = async () => {
    if (!user) return;
    setBankAccountsLoading(true);
    try {
      const [usdRes, eurRes] = await Promise.all([
        getUserBankAccounts(user.user_id, user.login_code, 'USD'),
        getUserBankAccounts(user.user_id, user.login_code, 'EUR')
      ]);
      const allAccounts = [
        ...(usdRes.status && usdRes.data ? usdRes.data : []),
        ...(eurRes.status && eurRes.data ? eurRes.data : [])
      ];
      setLinkedBankAccounts(allAccounts);
    } catch (error) { console.error("Error loading bank accounts:", error); }
    finally { setBankAccountsLoading(false); }
  };

  const loadReferralData = async () => {
    if (!user) return;
    setReferralLoading(true);
    try {
      const [statsRes, levelsRes] = await Promise.all([
        getReferralStats(user.user_id, user.login_code),
        getReferralLevels(user.user_id, user.login_code)
      ]);
      if (statsRes.status && statsRes.data) setReferralStats(statsRes.data);
      if (levelsRes.status && levelsRes.data) setReferralLevels(levelsRes.data);
    } catch (error) { console.error("Error loading referral data:", error); }
    finally { setReferralLoading(false); }
  };

  const handleCheckUsername = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    setUsernameChecking(true);
    try {
      const res = await checkUsernameAvailability(username);
      setUsernameAvailable(res.available);
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameAvailable(null);
    }
    finally { setUsernameChecking(false); }
  };

  const handleUpdateUsername = async () => {
    if (!user || !newUsername || usernameAvailable !== true) return;
    setUsernameUpdating(true);
    try {
      const res = await updateUsername(user.user_id, user.login_code, newUsername);
      if (res.status) {
        alert("Username updated successfully! You can change it again in 30 days.");
        setNewUsername("");
        setUsernameAvailable(null);
        setProfileEditMode(false);
      } else {
        alert(res.message || "Failed to update username");
      }
    } catch (error) {
      console.error("Error updating username:", error);
      alert("Failed to update username");
    }
    finally { setUsernameUpdating(false); }
  };

  // Photo upload handlers
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadingPhoto(true);
    try {
      if (photoUploadType === 'profile') {
        const res = await uploadProfilePicture(user.user_id, user.login_code, file);
        if (res.status) {
          alert("Profile picture updated successfully!");
          window.location.reload();
        } else {
          alert("Failed to upload profile picture");
        }
      } else {
        const res = await uploadCoverPhoto(user.user_id, user.login_code, file);
        if (res.status) {
          alert("Cover photo updated successfully!");
          window.location.reload();
        } else {
          alert("Failed to upload cover photo");
        }
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
      setShowPhotoUploadModal(false);
    }
  };

  // Load social stats
  const loadSocialStats = async () => {
    if (!user) return;
    try {
      const res = await getSocialStats(user.user_id, user.login_code);
      if (res.status && res.data) {
        setSocialStats(res.data);
      }
    } catch (error) {
      console.error("Error loading social stats:", error);
    }
  };

  // Load followers/following list
  const loadFollowersList = async (type: 'followers' | 'following') => {
    if (!user) return;
    setFollowersLoading(true);
    try {
      const res = type === 'followers' 
        ? await getFollowers(user.user_id, user.login_code)
        : await getFollowing(user.user_id, user.login_code);
      if (res.status && res.data) {
        setFollowersList(Array.isArray(res.data) ? res.data : []);
      }
    } catch (error) {
      console.error(`Error loading ${type}:`, error);
    } finally {
      setFollowersLoading(false);
    }
  };

  const openFollowersModal = (type: 'followers' | 'following') => {
    setFollowersModalType(type);
    setShowFollowersModal(true);
    loadFollowersList(type);
  };

  // Load privacy state and follow requests count
  const loadPrivacyState = async () => {
    if (!user) return;
    try {
      // Check if user is_private from user object
      setIsPrivateProfile(user.is_private === '1' || user.is_private === 1);
      
      // Load pending follow requests count
      const res = await getFollowRequestsCount(user.user_id, user.login_code);
      if (res.status && res.data) {
        setPendingFollowRequests(res.data.pending_requests || 0);
      }
    } catch (error) {
      console.error("Error loading privacy state:", error);
    }
  };

  // Toggle profile privacy
  const handleTogglePrivacy = async () => {
    if (!user) return;
    try {
      const newPrivacy = !isPrivateProfile;
      const res = await setProfilePrivacy(user.user_id, user.login_code, newPrivacy);
      if (res.status) {
        setIsPrivateProfile(newPrivacy);
        alert(newPrivacy ? "Your profile is now private. New followers will need your approval." : "Your profile is now public. Anyone can follow you.");
      } else {
        alert(res.message || "Failed to update privacy settings");
      }
    } catch (error) {
      console.error("Error toggling privacy:", error);
      alert("Failed to update privacy settings");
    }
  };

  // Load follow requests list
  const loadFollowRequests = async () => {
    if (!user) return;
    setFollowRequestsLoading(true);
    try {
      const res = await getFollowRequests(user.user_id, user.login_code);
      if (res.status && res.data) {
        setFollowRequestsList(Array.isArray(res.data) ? res.data : []);
      }
    } catch (error) {
      console.error("Error loading follow requests:", error);
    } finally {
      setFollowRequestsLoading(false);
    }
  };

  // Handle accept follow request
  const handleAcceptFollowRequest = async (requesterId: number) => {
    if (!user) return;
    try {
      const res = await acceptFollowRequest(user.user_id, user.login_code, requesterId);
      if (res.status) {
        setFollowRequestsList(prev => prev.filter(r => r.user_id !== requesterId));
        setPendingFollowRequests(prev => Math.max(0, prev - 1));
        loadSocialStats();
      } else {
        alert(res.message || "Failed to accept request");
      }
    } catch (error) {
      console.error("Error accepting follow request:", error);
    }
  };

  // Handle reject follow request
  const handleRejectFollowRequest = async (requesterId: number) => {
    if (!user) return;
    try {
      const res = await rejectFollowRequest(user.user_id, user.login_code, requesterId);
      if (res.status) {
        setFollowRequestsList(prev => prev.filter(r => r.user_id !== requesterId));
        setPendingFollowRequests(prev => Math.max(0, prev - 1));
      } else {
        alert(res.message || "Failed to reject request");
      }
    } catch (error) {
      console.error("Error rejecting follow request:", error);
    }
  };

  const [passwordChanging, setPasswordChanging] = useState(false);

  const handleChangePassword = async () => {
    if (!user) return;
    if (!passwordForm.currentPassword) { alert("Please enter your current password"); return; }
    if (!passwordForm.newPassword) { alert("Please enter a new password"); return; }
    if (passwordForm.newPassword.length < 8) { alert("Password must be at least 8 characters"); return; }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { alert("Passwords do not match"); return; }
    if (passwordForm.currentPassword === passwordForm.newPassword) { alert("New password must be different from current password"); return; }
    
    setPasswordChanging(true);
    try {
      const res = await changePassword(user.email, passwordForm.currentPassword, passwordForm.newPassword);
      if (res.status) {
        alert("Password changed successfully!");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        alert(res.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password");
    }
    finally { setPasswordChanging(false); }
  };

  const canChangeUsername = () => {
    if (!user?.last_username_change) return true;
    const lastChange = new Date(user.last_username_change);
    const now = new Date();
    const daysSinceChange = Math.floor((now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceChange >= 30;
  };

  const daysUntilUsernameChange = () => {
    if (!user?.last_username_change) return 0;
    const lastChange = new Date(user.last_username_change);
    const now = new Date();
    const daysSinceChange = Math.floor((now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, 30 - daysSinceChange);
  };

  const handleConnectBank = async () => {
    if (!user) return;
    setPlaidLoading(true);
    try {
      const res = await createPlaidLinkToken(user.user_id, user.login_code);
      if (res.status && res.data?.link_token) {
        // Open Plaid Link with the token
        const plaidScript = document.createElement('script');
        plaidScript.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
        plaidScript.onload = () => {
          const handler = (window as any).Plaid.create({
            token: res.data!.link_token,
            onSuccess: async (publicToken: string, metadata: any) => {
              // Exchange the public token
              alert("Bank connected successfully! Your account will be linked shortly.");
              loadBankAccounts();
            },
            onExit: (err: any) => {
              if (err) console.error("Plaid Link exit error:", err);
              setPlaidLoading(false);
            },
          });
          handler.open();
        };
        document.head.appendChild(plaidScript);
      } else {
        alert((res as { message?: string }).message || "Failed to initialize bank connection. Please try again.");
      }
    } catch (error) {
      console.error("Error connecting bank:", error);
      alert("Failed to connect bank. Please try again.");
    }
    finally { setPlaidLoading(false); }
  };

  const handleUnlinkBank = async (accountId: string) => {
    if (!user || !confirm("Are you sure you want to unlink this bank account?")) return;
    try {
      const res = await deleteBankAccount(user.user_id, user.login_code, accountId);
      if (res.status) {
        setLinkedBankAccounts(prev => prev.filter(a => a.id !== accountId));
        alert("Bank account unlinked successfully.");
      } else {
        alert(res.message || "Failed to unlink account.");
      }
    } catch (error) {
      console.error("Error unlinking bank:", error);
      alert("Failed to unlink account.");
    }
  };

  const loadDashboardData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Fetch balance and transactions for both USD and EUR accounts
      const [balanceRes, usdTransactionsRes, eurTransactionsRes] = await Promise.all([
        getAccountBalance(user.user_id, user.login_code),
        getDashboardTransactionsExtended(user.user_id, user.login_code, { account_type: 0, size: 50, page: 1 }),
        getDashboardTransactionsExtended(user.user_id, user.login_code, { account_type: 1, size: 50, page: 1 }),
      ]);
      if (balanceRes.status && balanceRes.data) setBalances(balanceRes.data);
      // Combine USD and EUR transactions for stats
      const allTransactions: DashboardTransaction[] = [];
      if (usdTransactionsRes.status && usdTransactionsRes.data) allTransactions.push(...usdTransactionsRes.data);
      if (eurTransactionsRes.status && eurTransactionsRes.data) allTransactions.push(...eurTransactionsRes.data);
      setDashboardTransactions(allTransactions);
      // Also load notifications
      loadNotifications();
      loadDepositRequests();
    } catch (error) { console.error("Error:", error); }
    finally { setIsLoading(false); }
  };

  const loadNotifications = async () => {
    if (!user) return;
    setNotificationsLoading(true);
    try {
      const res = await getNotifications(user.user_id, user.login_code);
      if (res.status && res.data) {
        setNotifications(res.data);
        setNotificationCount(res.data.filter(n => n.is_read === 0).length);
      }
    } catch (error) { console.error("Error loading notifications:", error); }
    finally { setNotificationsLoading(false); }
  };

  const loadDepositRequests = async () => {
    if (!user) return;
    setDepositRequestsLoading(true);
    try {
      const [sentRes, receivedRes] = await Promise.all([
        getSentDepositRequests(user.user_id, user.login_code),
        getReceivedDepositRequests(user.user_id, user.login_code),
      ]);
      if (sentRes.status && sentRes.transactions) setSentDepositRequests(sentRes.transactions);
      if (receivedRes.status && receivedRes.transactions) setReceivedDepositRequests(receivedRes.transactions);
    } catch (error) { console.error("Error loading deposit requests:", error); }
    finally { setDepositRequestsLoading(false); }
  };

  const handleMarkNotificationRead = async (notificationId: number) => {
    if (!user) return;
    try {
      await markNotificationAsRead(user.user_id, user.login_code, notificationId.toString());
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, is_read: 1 } : n));
      setNotificationCount(prev => Math.max(0, prev - 1));
    } catch (error) { console.error("Error marking notification as read:", error); }
  };

  const handleMarkAllNotificationsRead = async () => {
    if (!user) return;
    try {
      await markAllNotificationsAsRead(user.user_id, user.login_code);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      setNotificationCount(0);
    } catch (error) { console.error("Error marking all notifications as read:", error); }
  };

  const handleLookupUserForRequest = async (emailOrPhone: string) => {
    if (!user || !emailOrPhone.trim()) return;
    setLookupLoading(true);
    setLookupUser(null);
    try {
      const res = await lookupUserForDepositRequest(user.user_id, user.login_code, emailOrPhone);
      if (res.status && res.data) {
        setLookupUser(res.data);
      } else {
        setLookupUser(null);
      }
    } catch (error) { console.error("Error looking up user:", error); }
    finally { setLookupLoading(false); }
  };

  const handleCreateDepositRequest = async () => {
    if (!user || !lookupUser || !requestForm.amount) return;
    setRequestLoading(true);
    try {
      const amount = parseFloat(requestForm.amount);
      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount");
        setRequestLoading(false);
        return;
      }
      const res = await createDepositRequest(
        user.user_id,
        user.login_code,
        requestForm.email,
        amount,
        lookupUser.userId,  // Use hashed userId, not plain user_id
        requestForm.note || undefined
      );
      if (res.status) {
        alert("Payment request sent successfully!");
        setRequestForm({ email: "", amount: "", note: "" });
        setLookupUser(null);
        setRequestPaymentTab("pending");
        loadDepositRequests();
      } else {
        alert(res.message || "Failed to create payment request");
      }
    } catch (error) { console.error("Error creating deposit request:", error); alert("Failed to create payment request"); }
    finally { setRequestLoading(false); }
  };

  const handleDeleteDepositRequest = async (depositId: string) => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete this request?")) return;
    try {
      const res = await manageDepositRequest(user.user_id, user.login_code, depositId, true);
      if (res.status) {
        loadDepositRequests();
      } else {
        alert(res.message || "Failed to delete request");
      }
    } catch (error) { console.error("Error deleting deposit request:", error); }
  };

  const handleRespondToDepositRequest = async (depositId: string, accept: boolean) => {
    if (!user) return;
    const action = accept ? "accept" : "reject";
    if (!confirm(`Are you sure you want to ${action} this request?`)) return;
    try {
      const res = await respondToDepositRequest(user.user_id, user.login_code, depositId, accept);
      if (res.status) {
        alert(`Request ${accept ? "accepted" : "rejected"} successfully!`);
        loadDepositRequests();
      } else {
        alert(res.message || `Failed to ${action} request`);
      }
    } catch (error) { console.error(`Error ${action}ing deposit request:`, error); alert(`Failed to ${action} request`); }
  };

  const handleGenerateCryptoAddress = async () => {
    if (!user) return;
    console.log('Generating crypto address with:', { userId: user.user_id, loginCode: user.login_code ? '***' : 'MISSING', coin: selectedCryptoCoin });
    setCryptoLoading(true);
    setCryptoAddress(null);
    try {
      const res = await generateCryptoAddress(user.user_id, user.login_code, selectedCryptoCoin);
      console.log('Crypto address response:', res);
      if (res.status && res.data?.address) {
        setCryptoAddress(res.data.address);
        setCryptoTimeRemaining(15 * 60); // 15 minutes
      } else {
        if (res.message?.toLowerCase().includes('maplerad customer not found')) {
          alert("You need to order a virtual card first before you can deposit crypto.");
        } else {
          alert(res.message || "Failed to generate crypto address");
        }
      }
    } catch (error) { console.error("Error generating crypto address:", error); alert("Failed to generate crypto address"); }
    finally { setCryptoLoading(false); }
  };

  const handleRedeemGiftCard = async () => {
    if (!user) return;
    if (giftCardCode.length !== 8) {
      alert("Please enter a valid 8-digit gift card code");
      return;
    }
    setGiftCardLoading(true);
    try {
      const res = await redeemGiftCard(user.user_id, user.login_code, giftCardCode);
      if (res.status) {
        alert(res.msg || res.message || "Gift card redeemed successfully!");
        setGiftCardCode('');
        setShowTopUpModal(false);
        setSelectedTopUpMethod(null);
        loadDashboardData();
      } else {
        alert(res.message || res.msg || "Failed to redeem gift card. Please check the code and try again.");
      }
    } catch (error) { console.error("Error redeeming gift card:", error); alert("Failed to redeem gift card"); }
    finally { setGiftCardLoading(false); }
  };

  // Crypto countdown timer
  useEffect(() => {
    if (cryptoAddress && cryptoTimeRemaining > 0) {
      const timer = setInterval(() => {
        setCryptoTimeRemaining(prev => {
          if (prev <= 1) {
            setCryptoAddress(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cryptoAddress, cryptoTimeRemaining]);

  const formatCryptoTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyToClipboard = async (text: string, fieldName?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (fieldName) {
        setCopiedField(fieldName);
        setTimeout(() => setCopiedField(null), 2000);
      } else {
        alert("Copied to clipboard!");
      }
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const loadWalletTransactions = async (currency: string) => {
    if (!user) return;
    setWalletTransactionsLoading(true);
    try {
      // Use extended API (returns all transactions, we filter by currency on frontend)
      const res = await getDashboardTransactionsExtended(user.user_id, user.login_code, { 
        account_type: 0, 
        size: 100,
        page: 1 
      });
      
      if (res.status && res.data) {
        // Filter transactions by currency field (API returns all currencies mixed)
        const filteredTransactions = res.data.filter(
          txn => txn.currency?.toLowerCase() === currency.toLowerCase()
        );
        setWalletTransactions(filteredTransactions.slice(0, 50));
      } else {
        setWalletTransactions([]);
      }
    } catch (error) { 
      console.error("Error loading wallet transactions:", error); 
      setWalletTransactions([]);
    }
    finally { setWalletTransactionsLoading(false); }
  };

  const handleWalletClick = (currency: string) => {
    if (selectedCurrency === currency) {
      setSelectedCurrency(null);
      setWalletTransactions([]);
    } else {
      setSelectedCurrency(currency);
      loadWalletTransactions(currency);
    }
  };

  // Available currencies for adding new wallets (matching app's ALLOWED_CREATE_CODES)
  const AVAILABLE_CURRENCIES = [
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'TRY', name: 'Turkish Lira', flag: '🇹🇷' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
    { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
    { code: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳' },
    { code: 'MXN', name: 'Mexican Peso', flag: '🇲🇽' },
    { code: 'BRL', name: 'Brazilian Real', flag: '🇧🇷' },
    { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳' },
    { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
    { code: 'THB', name: 'Thai Baht', flag: '🇹🇭' },
    { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾' },
    { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩' },
    { code: 'PHP', name: 'Philippine Peso', flag: '🇵🇭' },
    { code: 'VND', name: 'Vietnamese Dong', flag: '🇻🇳' },
    { code: 'SEK', name: 'Swedish Krona', flag: '🇸🇪' },
    { code: 'NOK', name: 'Norwegian Krone', flag: '🇳🇴' },
    { code: 'DKK', name: 'Danish Krone', flag: '🇩🇰' },
    { code: 'PLN', name: 'Polish Zloty', flag: '🇵🇱' },
    { code: 'CZK', name: 'Czech Koruna', flag: '🇨🇿' },
    { code: 'HUF', name: 'Hungarian Forint', flag: '🇭🇺' },
    { code: 'RON', name: 'Romanian Leu', flag: '🇷🇴' },
    { code: 'HRK', name: 'Croatian Kuna', flag: '🇭🇷' },
    { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
    { code: 'HKD', name: 'Hong Kong Dollar', flag: '🇭🇰' },
    { code: 'NZD', name: 'New Zealand Dollar', flag: '🇳🇿' },
    { code: 'ZAR', name: 'South African Rand', flag: '🇿🇦' },
  ];

  const addableCurrencies = useMemo(() => {
    if (!balances) return AVAILABLE_CURRENCIES;
    const existingCurrencies = Object.keys(balances);
    return AVAILABLE_CURRENCIES.filter(c => !existingCurrencies.includes(c.code));
  }, [balances]);

  const handleAddWallet = async () => {
    if (!user || !selectedNewCurrency) return;
    setAddWalletLoading(true);
    try {
      const res = await createCurrencyWallet(user.user_id, user.login_code, selectedNewCurrency);
      if (res.status) {
        // Refresh balances
        await loadDashboardData();
        setShowAddWalletModal(false);
        setSelectedNewCurrency(null);
      } else {
        alert(res.message || 'Failed to create wallet');
      }
    } catch (error) {
      console.error('Error creating wallet:', error);
      alert('Failed to create wallet');
    } finally {
      setAddWalletLoading(false);
    }
  };

  const loadCardsData = async () => {
    if (!user) return;
    setCardsLoading(true);
    setPhysicalCardLoading(true);
    try {
      // Load virtual cards (Maplerad)
      const cardsRes = await getUserCards(user.user_id, user.login_code);
      if (cardsRes.status && cardsRes.data) {
        const transformedCards: Card[] = cardsRes.data.map((card: any) => ({
          id: card.id,
          card_id: card.id,
          card_type: (card.type?.toLowerCase() === 'virtual' ? 'virtual' : 'physical') as 'physical' | 'virtual',
          card_brand: card.issuer?.toLowerCase() || 'visa',
          card_name: card.name || 'Card',
          card_number_masked: card.masked_pan || '****',
          last_four: card.masked_pan?.slice(-4) || '****',
          expiry_month: card.expiry?.split('/')[0] || '**',
          expiry_year: card.expiry?.split('/')[1] || '**',
          cvv: card.cvv || '***',
          cvv_masked: '***',
          cardholder_name: card.name || user.first_name + ' ' + user.last_name,
          status: card.status?.toLowerCase() === 'active' ? 'active' : card.status?.toLowerCase() === 'disabled' ? 'frozen' : 'inactive',
          currency: card.currency || 'USD',
          balance: card.balance || 0,
          daily_limit: 0,
          monthly_limit: 0,
          used_today: 0,
          used_this_month: 0,
          created_at: card.created_at || new Date().toISOString(),
          provider: 'maplerad' as const,
          card_style: card.issuer?.toLowerCase() === 'visa' ? 'virtual' : 'default' as const
        }));
        setCards(transformedCards);
        if (transformedCards.length > 0 && !selectedCard) {
          // Fetch details for the first card to get correct balance
          const firstCard = transformedCards[0];
          setSelectedCard(firstCard);
          try {
            const details = await getMapleradCardDetails(user.user_id, user.login_code, firstCard.card_id || firstCard.id);
            if (details.status && details.data) {
              const updatedCard = { ...firstCard, cvv: details.data.cvv, balance: details.data.balance || details.data.balance_minor || firstCard.balance };
              setSelectedCard(updatedCard);
              setCards(prevCards => prevCards.map(c => c.id === firstCard.id ? updatedCard : c));
            }
          } catch (err) {
            console.error('Error loading first card details:', err);
          }
        }
      }
      
      // Load physical card (screen=1, accounts=1, card=1)
      const physicalRes = await getPhysicalCard(user.user_id, user.login_code);
      console.log('Physical card response:', physicalRes);
      if (physicalRes.status && physicalRes.data && physicalRes.data.length > 0) {
        const card = physicalRes.data[0];
        setPhysicalCard(card);
        setPhysicalCardBalance(physicalRes.total_balance || '0.00');
        setPhysicalCardFrozen(card.isFreeze === '1');
      } else {
        setPhysicalCard(null);
        // Check card request status
        try {
          const statusRes = await getCardStatus(user.user_id, user.login_code);
          setCardStatus(statusRes);
          if (statusRes.card_status === 'PENDING') {
            setCardRequestStatus('pending_approval');
          } else if (statusRes.card_status === 'APPROVED') {
            setCardRequestStatus('approved');
          } else {
            setCardRequestStatus('can_request');
          }
        } catch (e) {
          setCardRequestStatus('can_request');
        }
      }
    } catch (error) { console.error("Error loading cards:", error); }
    finally { 
      setCardsLoading(false);
      setPhysicalCardLoading(false);
    }
  };

  const loadCardDetails = async (cardId: string) => {
    if (!user) return;
    try {
      const txnRes = await getCardTransactions(user.user_id, user.login_code, cardId, { limit: 5 });
      if (txnRes.status && txnRes.data) setCardTransactions(txnRes.data);
    } catch (error) { console.error("Error loading card details:", error); }
  };

  const handleShowCardNumbers = async () => {
    if (!currentCard || !user) return;
    if (showCardNumbers) {
      setShowCardNumbers(false);
      return;
    }
    try {
      const params = new URLSearchParams();
      params.append('userId', user.user_id);
      params.append('loginCode', user.login_code);
      params.append('card_id', currentCard.card_id);
      const response = await fetch(`http://98.83.36.86/api/v2/Maplerad/card_details?${params.toString()}`);
      const result = await response.json();
      if (result.status && result.data) {
        const fullNumber = result.data.card_number || result.data.masked_pan;
        setCards(cards.map(c => c.id === currentCard.id ? { ...c, card_number_masked: fullNumber } : c));
        setSelectedCard({ ...currentCard, card_number_masked: fullNumber });
        setShowCardNumbers(true);
      } else {
        alert('Failed to load card details');
      }
    } catch (error) {
      console.error('Error loading full card number:', error);
      alert('Failed to load card details');
    }
  };

  const handleAddCard = async () => {
    if (!user) return;
    setAddCardLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('userId', user.user_id);
      params.append('loginCode', user.login_code);
      params.append('brand', addCardForm.brand);
      params.append('currency', addCardForm.currency);
      params.append('type', addCardForm.type);
      if (addCardForm.fundAmount) params.append('fund_amount', addCardForm.fundAmount);
      if (addCardForm.cardPin) params.append('card_pin', addCardForm.cardPin);

      const response = await fetch(`http://98.83.36.86/api/v2/Maplerad/card_create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      });
      const result = await response.json();
      if (result.status) {
        alert('Card created successfully!');
        setShowAddCardModal(false);
        setAddCardForm({ brand: 'VISA', currency: 'USD', type: 'VIRTUAL', fundAmount: '', cardPin: '' });
        loadCardsData();
      } else {
        alert(result.message || 'Failed to create card');
      }
    } catch (error) {
      console.error('Error creating card:', error);
      alert('Failed to create card');
    } finally {
      setAddCardLoading(false);
    }
  };

  const loadMyQRCodes = async () => {
    if (!user) return;
    try {
      const res = await getUserQRCodes(user.user_id, user.login_code);
      if (res.status && res.data) {
        setMyQRCodes(res.data.payment_qr_codes || []);
        setProfileQR(res.data.profile_qr_code || null);
      }
    } catch (error) { console.error("Error loading QR codes:", error); }
  };

  const handleFreezeCard = async () => {
    if (!user || !selectedCard) return;
    try {
      const res = selectedCard.status === "frozen" 
        ? await unfreezeCard(user.user_id, user.login_code, selectedCard.card_id)
        : await freezeCard(user.user_id, user.login_code, selectedCard.card_id);
      if (res.status) loadCardsData();
    } catch (error) { console.error("Error:", error); }
  };

  const handleViewPin = async () => {
    if (!user || !selectedCard) return;
    try {
      const res = await getCardPin(user.user_id, user.login_code, selectedCard.card_id);
      if (res.status) { setCardPin(res.data.pin); setShowPinModal(true); }
    } catch (error) { console.error("Error:", error); }
  };

  const handleFundCard = async () => {
    if (!user || !selectedCard) return;
    const amount = parseFloat(cardFundAmount) || 0;
    if (amount <= 0) { alert("Please enter a valid amount"); return; }
    setCardOperationLoading(true);
    try {
      const res = await fundCard(user.user_id, user.login_code, selectedCard.card_id, amount);
      if (res.status) {
        alert(`Successfully funded card with $${amount.toFixed(2)}`);
        setShowCardFundModal(false);
        setCardFundAmount("");
        loadCardsData();
        loadDashboardData();
      } else {
        alert(res.message || "Failed to fund card");
      }
    } catch (error) { console.error("Error funding card:", error); alert("Error funding card"); }
    finally { setCardOperationLoading(false); }
  };

  const handleWithdrawFromCard = async () => {
    if (!user || !selectedCard) return;
    const amount = parseFloat(cardWithdrawAmount) || 0;
    if (amount <= 0) { alert("Please enter a valid amount"); return; }
    setCardOperationLoading(true);
    try {
      const res = await withdrawFromCard(user.user_id, user.login_code, selectedCard.card_id, amount);
      if (res.status) {
        alert(`Successfully withdrew $${amount.toFixed(2)} to wallet`);
        setShowCardWithdrawModal(false);
        setCardWithdrawAmount("");
        loadCardsData();
        loadDashboardData();
      } else {
        alert(res.message || "Failed to withdraw from card");
      }
    } catch (error) { console.error("Error withdrawing from card:", error); alert("Error withdrawing from card"); }
    finally { setCardOperationLoading(false); }
  };

  const handleGeneratePaymentQR = async () => {
    if (!user) return;
    const amount = parseFloat(qrPaymentAmount) || 0;
    if (amount <= 0) return;
    setQrLoading(true);
    try {
      const res = await generatePaymentQRCode(user.user_id, user.login_code, amount, "USD", qrPaymentDescription || undefined);
      if (res.status && res.data) setGeneratedQR(res.data.qr_code_image);
    } catch (error) { console.error("Error generating QR:", error); }
    finally { setQrLoading(false); }
  };

  const handleSendPayment = async () => {
    if (!user || !sendRecipient) {
      alert("Please enter a recipient");
      return;
    }
    const amount = parseFloat(sendAmount) || 0;
    if (amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    setRecipientLoading(true);
    try {
      const res = await lookupP2PRecipient(user.user_id, user.login_code, sendRecipient);
      if (res.status && res.data) {
        setRecipientInfo(res.data);
        setShowPaymentConfirm(true);
        setPaymentSuccess(false);
        setTransactionResult(null);
      } else {
        alert(res.message || "Recipient not found. Please check the username, email, or phone number.");
      }
    } catch (error) {
      console.error("Error looking up recipient:", error);
      alert("Failed to find recipient. Please check your connection and try again.");
    }
    finally { setRecipientLoading(false); }
  };

  const handleSignPayment = async () => {
    if (!user || !recipientInfo) return;
    const amount = parseFloat(sendAmount) || 0;
    setPaymentSigning(true);
    try {
      const res = await p2pTransfer(user.user_id, user.login_code, {
        recipient: sendRecipient,
        amount: amount,
        currency: "USD",
        note: sendNote || undefined,
      });
      if (res.status && res.data) {
        setTransactionResult({
          txn_code: res.data.txn_code,
          amount: amount,
          recipient_name: recipientInfo?.first_name + ' ' + recipientInfo?.last_name || 'Recipient',
        });
        setPaymentSuccess(true);
        setSendAmount("0.00");
        setSendRecipient("");
        setSendNote("");
        loadDashboardData();
      } else {
        alert(res.message || "Failed to send payment. Please try again.");
        setShowPaymentConfirm(false);
      }
    } catch (error) {
      console.error("Error sending payment:", error);
      alert("Failed to send payment. Please check your connection and try again.");
      setShowPaymentConfirm(false);
    }
    finally { setPaymentSigning(false); }
  };

  const closePaymentConfirm = () => {
    setShowPaymentConfirm(false);
    setRecipientInfo(null);
    setPaymentSuccess(false);
    setTransactionResult(null);
  };

  const loadLiveRates = async (baseCurrency: string) => {
    if (!user) return;
    setRatesLoading(true);
    try {
      const res = await getLiveRates(user.user_id, user.login_code, baseCurrency);
      if (res.status && res.data) {
        setLiveRates(res.data);
      }
    } catch (error) { console.error("Error loading live rates:", error); }
    finally { setRatesLoading(false); }
  };

  const handleConvert = async () => {
    if (!user || !convertAmount || parseFloat(convertAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    
    // Calculate minimum amount in source currency (equivalent to $2 USD)
    const MIN_USD_AMOUNT = 2;
    let minAmountInSourceCurrency = MIN_USD_AMOUNT;
    
    if (convertFromCurrency !== 'USD') {
      // Get USD rate for the source currency to calculate minimum
      // If source is EUR and 1 USD = 0.92 EUR, then min EUR = 2 * 0.92 = 1.84
      const usdToSourceRate = liveRates['USD']?.value;
      if (usdToSourceRate && usdToSourceRate > 0) {
        // liveRates are based on convertFromCurrency, so we need inverse
        minAmountInSourceCurrency = MIN_USD_AMOUNT / usdToSourceRate;
      } else {
        // Fallback: fetch or use approximate rates
        const approximateRates: Record<string, number> = {
          EUR: 0.92, GBP: 0.79, CAD: 1.36, AUD: 1.53, JPY: 149, NGN: 1550, TRY: 32
        };
        minAmountInSourceCurrency = MIN_USD_AMOUNT * (approximateRates[convertFromCurrency] || 1);
      }
    }
    
    if (parseFloat(convertAmount) < minAmountInSourceCurrency) {
      alert(`Minimum conversion amount is ${CURRENCY_SYMBOLS[convertFromCurrency] || ''}${minAmountInSourceCurrency.toFixed(2)} ${convertFromCurrency} (equivalent to $2.00 USD)`);
      return;
    }
    
    setConvertLoading(true);
    try {
      const res = await convertCurrency(user.user_id, user.login_code, convertFromCurrency, convertToCurrency, parseFloat(convertAmount));
      if (res.status && res.data) {
        alert(`Successfully converted ${CURRENCY_SYMBOLS[convertFromCurrency] || ''}${parseFloat(convertAmount).toFixed(2)} ${convertFromCurrency} to ${CURRENCY_SYMBOLS[convertToCurrency] || ''}${res.data.converted_amount.toFixed(2)} ${convertToCurrency}`);
        setConvertAmount("");
        loadDashboardData();
      } else {
        alert((res as { message?: string }).message || "Conversion failed. Please try again.");
      }
    } catch (error) {
      console.error("Error converting currency:", error);
      alert("Conversion failed. Please check your connection and try again.");
    }
    finally { setConvertLoading(false); }
  };

  const handleBinanceWithdraw = async () => {
    if (!user || !binanceEmail || !binanceAmount) {
      alert("Please fill in all fields");
      return;
    }
    const amount = parseFloat(binanceAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (amount < binanceMinWithdrawal) {
      alert(`Minimum withdrawal amount is $${binanceMinWithdrawal.toFixed(2)} USDT`);
      return;
    }
    const usdBalance = walletCurrencies.find(w => w.currency === 'USD')?.balance || 0;
    if (amount > usdBalance) {
      alert(`Insufficient balance. Your USD balance is $${usdBalance.toFixed(2)}`);
      return;
    }
    setBinanceLoading(true);
    try {
      const res = await binancePayout(user.user_id, user.login_code, binanceEmail, amount, 'BSC', 'USDT');
      if (res.status) {
        alert(`Successfully initiated withdrawal of $${amount.toFixed(2)} USDT to ${binanceEmail}. You will receive approximately $${(amount - 1).toFixed(2)} USDT after network fees.`);
        setBinanceEmail('');
        setBinanceAmount('');
        loadDashboardData();
      } else {
        alert(res.message || "Withdrawal failed. Please try again.");
      }
    } catch (error) {
      console.error("Error processing Binance withdrawal:", error);
      alert("Withdrawal failed. Please check your connection and try again.");
    }
    finally { setBinanceLoading(false); }
  };

  const handleBankTransfer = async () => {
    if (!user || !bankTransferForm.accountNumber || !bankTransferForm.routingNumber || !bankTransferForm.accountHolder || !bankTransferForm.amount) {
      alert("Please fill in all required fields");
      return;
    }
    if (!bankTransferForm.recipientCountry || !bankTransferForm.recipientCity || !bankTransferForm.recipientAddress || !bankTransferForm.recipientZipCode) {
      alert("Please complete recipient address: country, city, address, and ZIP code");
      return;
    }
    const amount = parseFloat(bankTransferForm.amount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    if (amount < 10) {
      alert("Minimum withdrawal is $10.00 USD");
      return;
    }
    const usdBalance = walletCurrencies.find(w => w.currency === 'USD')?.balance || 0;
    if (amount > usdBalance) {
      alert(`Insufficient balance. Your USD balance is $${usdBalance.toFixed(2)}`);
      return;
    }
    setBankTransferLoading(true);
    try {
      const res = await usdWithdrawal(user.user_id, user.login_code, {
        account_title: bankTransferForm.accountHolder,
        routing_number: bankTransferForm.routingNumber,
        account_number: bankTransferForm.accountNumber,
        account_type: bankTransferForm.accountType,
        amount: amount,
        recipient_type: 'someone_else',
        reference_no: bankTransferForm.purpose || 'Bank Transfer',
        recipient_country: bankTransferForm.recipientCountry,
        recipient_city: bankTransferForm.recipientCity,
        recipient_address: bankTransferForm.recipientAddress,
        recipient_zip_code: bankTransferForm.recipientZipCode,
      });
      if (res.status) {
        alert(`Successfully initiated bank transfer of $${amount.toFixed(2)}. Transaction will be processed in 1-2 business days.`);
        setBankTransferForm({ bankName: '', accountNumber: '', routingNumber: '', accountHolder: '', amount: '', accountType: 'checking', recipientCountry: '', recipientCity: '', recipientAddress: '', recipientZipCode: '', purpose: '' });
        setTransferType('select');
        loadDashboardData();
      } else {
        alert(res.message || "Transfer failed. Please try again.");
      }
    } catch (error) {
      console.error("Error processing bank transfer:", error);
      alert("Transfer failed. Please check your connection and try again.");
    }
    finally { setBankTransferLoading(false); }
  };

  const handleSepaTransfer = async () => {
    if (!user || !sepaTransferForm.iban || !sepaTransferForm.beneficiaryName || !sepaTransferForm.amount) {
      alert("Please fill in all required fields");
      return;
    }
    if (!sepaTransferForm.reference) {
      alert("Please enter the purpose of transfer");
      return;
    }
    const amount = parseFloat(sepaTransferForm.amount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    const eurBalance = walletCurrencies.find(w => w.currency === 'EUR')?.balance || 0;
    if (amount > eurBalance) {
      alert(`Insufficient balance. Your EUR balance is €${eurBalance.toFixed(2)}`);
      return;
    }
    setSepaTransferLoading(true);
    try {
      const cleanIban = sepaTransferForm.iban.replace(/\s/g, '').toUpperCase();
      const res = await euroWithdrawalNew(user.user_id, user.login_code, {
        recipient_type: 'someone_else_local',
        amount: amount,
        reference: sepaTransferForm.reference,
        from_currency_id: 3,
        to_currency_id: 3,
        iban: cleanIban,
        bank_code: sepaTransferForm.bicSwift?.toUpperCase(),
        recipient_name: sepaTransferForm.beneficiaryName.trim(),
      });
      if (res.status) {
        alert(`Successfully initiated SEPA transfer of €${amount.toFixed(2)}. Transfer will arrive same day or next day.`);
        setSepaTransferForm({ iban: '', bicSwift: '', beneficiaryName: '', reference: '', amount: '' });
        setTransferType('select');
        loadDashboardData();
      } else {
        alert(res.message || "Transfer failed. Please try again.");
      }
    } catch (error) {
      console.error("Error processing SEPA transfer:", error);
      alert("Transfer failed. Please check your connection and try again.");
    }
    finally { setSepaTransferLoading(false); }
  };

  const handleSwiftTransfer = async () => {
    if (!user || !swiftTransferForm.recipientCountry || !swiftTransferForm.swiftCode || !swiftTransferForm.accountNumber || !swiftTransferForm.beneficiaryName || !swiftTransferForm.amount) {
      alert("Please fill in all required fields");
      return;
    }
    if (!swiftTransferForm.beneficiaryAddress || !swiftTransferForm.recipientCity || !swiftTransferForm.recipientZipCode) {
      alert("Please complete recipient address: address, city, and ZIP code");
      return;
    }
    const amount = parseFloat(swiftTransferForm.amount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    const usdBalance = walletCurrencies.find(w => w.currency === 'USD')?.balance || 0;
    if (amount > usdBalance) {
      alert(`Insufficient balance. Your USD balance is $${usdBalance.toFixed(2)}`);
      return;
    }
    setSwiftTransferLoading(true);
    try {
      const res = await swiftWithdrawal(user.user_id, user.login_code, {
        recipient_name: swiftTransferForm.beneficiaryName.trim(),
        amount: amount,
        reference: swiftTransferForm.transferPurpose || 'International Transfer',
        from_currency_id: 1,
        to_currency_id: 1,
        swift: swiftTransferForm.swiftCode.toUpperCase(),
        recipient_country: swiftTransferForm.recipientCountry,
        recipient_city: swiftTransferForm.recipientCity,
        recipient_address: swiftTransferForm.beneficiaryAddress,
        recipient_zip_code: swiftTransferForm.recipientZipCode,
        account_name: swiftTransferForm.accountNumber,
      });
      if (res.status) {
        alert(`Successfully initiated international transfer of $${amount.toFixed(2)}. Transfer will arrive in 2-5 business days.`);
        setSwiftTransferForm({ recipientCountry: '', swiftCode: '', accountNumber: '', beneficiaryName: '', beneficiaryAddress: '', recipientCity: '', recipientZipCode: '', transferPurpose: '', amount: '' });
        setTransferType('select');
        loadDashboardData();
      } else {
        alert(res.message || "Transfer failed. Please try again.");
      }
    } catch (error) {
      console.error("Error processing SWIFT transfer:", error);
      alert("Transfer failed. Please check your connection and try again.");
    }
    finally { setSwiftTransferLoading(false); }
  };

  useEffect(() => {
    if (paymentsSubTab === "convert" && user) {
      loadLiveRates(convertFromCurrency);
    }
  }, [paymentsSubTab, convertFromCurrency, user]);

  useEffect(() => {
    if (paymentsSubTab === "withdraw" && user) {
      loadBinanceMinimum();
    }
  }, [paymentsSubTab, user]);

  const loadBinanceMinimum = async () => {
    if (!user) return;
    setBinanceMinLoading(true);
    try {
      const res = await getBinanceMinimumWithdrawal(user.user_id, user.login_code, 'BNB', 'USDT');
      if (res.status && res.data?.minimum_withdrawal) {
        setBinanceMinWithdrawal(res.data.minimum_withdrawal);
      }
    } catch (error) {
      console.error("Error loading Binance minimum:", error);
    }
    finally { setBinanceMinLoading(false); }
  };

  const getConvertedAmount = () => {
    if (!convertAmount || !liveRates[convertToCurrency]) return "0.00";
    const amount = parseFloat(convertAmount) || 0;
    const rate = liveRates[convertToCurrency]?.value || 1;
    return (amount * rate).toFixed(2);
  };

  const handleGenerateProfileQR = async () => {
    if (!user) return;
    setQrLoading(true);
    try {
      const res = await generateProfileQRCode(user.user_id, user.login_code, {
        include_profile_picture: includeProfilePic,
        include_contact_info: includeContactInfo,
        allow_direct_payments: allowDirectPayments,
      });
      if (res.status && res.data) {
        setGeneratedQR(res.data.qr_code_image);
        setProfileQR(res.data);
      }
    } catch (error) { console.error("Error generating profile QR:", error); }
    finally { setQrLoading(false); }
  };

  const handleDownloadQR = () => {
    if (!generatedQR) return;
    const link = document.createElement("a");
    link.href = generatedQR;
    link.download = "vaultpay-qr-code.png";
    link.click();
  };

  const handleCopyQR = async () => {
    if (!generatedQR) return;
    try {
      await navigator.clipboard.writeText(generatedQR);
      alert("QR code copied to clipboard!");
    } catch (error) { console.error("Error copying:", error); }
  };

  const handleImportContacts = async () => {
    if (!("contacts" in navigator && "ContactsManager" in window)) {
      setContactsSupported(false);
      return;
    }
    setContactsLoading(true);
    try {
      const props = ["name", "email", "tel"];
      const opts = { multiple: true };
      // @ts-ignore - Contact Picker API types
      const contacts = await navigator.contacts.select(props, opts);
      const importedContacts = contacts.map((contact: { name?: string[]; email?: string[]; tel?: string[] }) => {
        const name = contact.name?.[0] || "Unknown";
        const nameParts = name.split(" ");
        const initials = nameParts.length >= 2 
          ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
          : name.substring(0, 2).toUpperCase();
        return {
          name,
          email: contact.email?.[0],
          phone: contact.tel?.[0],
          initials,
        };
      });
      setPhoneContacts(importedContacts);
    } catch (error) {
      console.error("Error importing contacts:", error);
    } finally {
      setContactsLoading(false);
    }
  };

  const handleLogout = () => { logout(); router.push("/"); };

  const walletCurrencies = useMemo(() => {
    if (!balances) return [];
    return Object.entries(balances).filter(([_, v]) => v !== undefined && v !== null).map(([currency, balance]) => ({
      currency, balance: balance as number, symbol: CURRENCY_SYMBOLS[currency] || currency, name: CURRENCY_NAMES[currency] || currency,
    }));
  }, [balances]);

  const transactionStats = useMemo(() => {
    const now = new Date();
    let income = 0, expenses = 0, pending = 0;
    dashboardTransactions.forEach((txn) => {
      const txnDate = new Date(txn.created_at);
      const amount = parseFloat(txn.amount) || 0;
      const transferStatus = txn.transfer_status?.toLowerCase() || '';
      const isCurrentMonth = txnDate.getMonth() === now.getMonth() && txnDate.getFullYear() === now.getFullYear();
      
      if (isCurrentMonth) {
        if (transferStatus === 'pending') {
          pending += Math.abs(amount);
        } else if (transferStatus === 'received') {
          // Incoming transaction
          income += Math.abs(amount);
        } else if (transferStatus === 'approved' || transferStatus === 'sent') {
          // Outgoing transaction
          expenses += Math.abs(amount);
        } else if (transferStatus === 'completed' || transferStatus === 'success') {
          // For 'completed'/'success' status, determine direction by amount sign or type
          const type = txn.type?.toLowerCase() || '';
          if (type.includes('deposit') || type.includes('receive') || type.includes('wire') || type.includes('refund')) {
            income += Math.abs(amount);
          } else {
            expenses += Math.abs(amount);
          }
        }
      }
    });
    return { income, expenses, pending };
  }, [dashboardTransactions]);

  const totalBalanceUSD = balances?.USD || 0;

  if (authLoading || !isAuthenticated || !user) {
    return (<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a", color: "#fff" }}><p>{authLoading ? "Loading..." : "Redirecting..."}</p></div>);
  }

  const navItems = [
    { id: "dashboard" as DashboardTab, label: "Dashboard", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
    { id: "payments" as DashboardTab, label: "Payments", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
    { id: "accounts" as DashboardTab, label: "Accounts", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    { id: "cards" as DashboardTab, label: "Cards", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
    { id: "rewards" as DashboardTab, label: "Rewards", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
    { id: "helpdesk" as DashboardTab, label: "Help Desk", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  ];

  const formatCurrency = (amount: number, currency: string = "USD") => {
    const symbol = CURRENCY_SYMBOLS[currency] || "$";
    return symbol + Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
  const getCardStyle = (card: Card) => CARD_STYLES[card.card_style || "default"] || CARD_STYLES.default;

  const currentCard = selectedCard || (cards.length > 0 ? cards[0] : null);
  const displaySpendingSummary = spendingSummary || { this_month: 0, last_month: 0, average_monthly: 0 };
  const displayCardLimits = cardLimits || { daily_limit: 0, used_today: 0, remaining_today: 0, monthly_limit: 0, used_this_month: 0, remaining_this_month: 0 };


  // Handle physical card freeze
  const handleFreezePhysicalCard = async () => {
    if (!user || !physicalCard) return;
    try {
      const freezeFlag = physicalCardFrozen ? 2 : 1; // 1=freeze, 2=unfreeze
      await freezePhysicalCard(user.user_id, user.login_code, physicalCard.accountIdHash, freezeFlag as 1 | 2);
      setPhysicalCardFrozen(!physicalCardFrozen);
    } catch (error) {
      console.error('Error freezing physical card:', error);
    }
  };

  // Handle view physical card PIN
  const handleViewPhysicalPin = async () => {
    if (!user || !physicalCard) return;
    try {
      const response = await getPhysicalCardPin(user.user_id, user.login_code, physicalCard.accountIdHash);
      if (response.status && response.data?.pin) {
        setCardPin(response.data.pin);
        setShowPinModal(true);
      }
    } catch (error) {
      console.error('Error getting physical card PIN:', error);
    }
  };

  const renderCardsTab = () => {
    return (
      <div>
        {/* Card Type Tabs */}
        <div style={{ display: "flex", gap: 0, marginBottom: 24, background: "#141414", borderRadius: 8, padding: 4 }}>
          <button onClick={() => setCardType('virtual')} style={{ flex: 1, padding: "12px 24px", background: cardType === 'virtual' ? "#06FF89" : "transparent", color: cardType === 'virtual' ? "#000" : "#888", border: "none", borderRadius: 6, fontSize: 14, fontWeight: cardType === 'virtual' ? 600 : 400, cursor: "pointer" }}>Virtual Cards</button>
          <button onClick={() => setCardType('physical')} style={{ flex: 1, padding: "12px 24px", background: cardType === 'physical' ? "#06FF89" : "transparent", color: cardType === 'physical' ? "#000" : "#888", border: "none", borderRadius: 6, fontSize: 14, fontWeight: cardType === 'physical' ? 600 : 400, cursor: "pointer" }}>Physical Card</button>
        </div>

        {cardType === 'physical' ? renderPhysicalCardTab() : renderVirtualCardTab()}
      </div>
    );
  };

  // Physical Card Tab
  const renderPhysicalCardTab = () => {
    if (physicalCardLoading) {
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 48, height: 48, border: "3px solid #1f1f1f", borderTopColor: "#06FF89", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
            <p style={{ color: "#666" }}>Loading card...</p>
          </div>
        </div>
      );
    }

    if (!physicalCard) {
      return renderCardOrderingScreen();
    }

    return renderPhysicalCardDisplay();
  };

  // Card Ordering Screen (when no physical card)
  const renderCardOrderingScreen = () => (
    <div style={{ background: "#0a0a0a", borderRadius: 16, overflow: "hidden" }}>
      {/* Hero Section */}
      <div style={{ position: "relative", padding: "40px 24px", background: "linear-gradient(180deg, #000 0%, #0a0a0a 100%)", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, borderRadius: "50%", background: "rgba(6, 255, 137, 0.05)" }} />
        
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1 }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, background: "rgba(6, 255, 137, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, border: "2px solid rgba(6, 255, 137, 0.3)" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 8px 0" }}>VaultPay Card</h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", margin: "0 0 24px 0" }}>Premium Debit Card</p>
          
          {/* Card Preview */}
          <div style={{ width: "100%", maxWidth: 340, background: "linear-gradient(135deg, #06FF89 0%, #00c853 100%)", borderRadius: 16, padding: 20, position: "relative", overflow: "hidden", boxShadow: "0 8px 32px rgba(6, 255, 137, 0.3)" }}>
            <div style={{ position: "absolute", top: -60, right: -60, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 28 }}>
              <div style={{ width: 40, height: 30, background: "#d4af37", borderRadius: 6 }} />
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/></svg>
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#000", letterSpacing: 3, fontFamily: "monospace", marginBottom: 20 }}>•••• •••• •••• ••••</div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 8, color: "rgba(0,0,0,0.6)", marginBottom: 2 }}>CARD HOLDER</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#000" }}>YOUR NAME</div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#000", fontStyle: "italic" }}>VISA</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Section */}
      <div style={{ padding: 24 }}>
        <div style={{ background: "#141414", borderRadius: 16, padding: 24, textAlign: "center", border: "1px solid #1f1f1f" }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            {isCheckingCardStatus ? (
              <div style={{ width: 24, height: 24, border: "2px solid #e5e7eb", borderTopColor: "#06FF89", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            )}
          </div>
          <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 8px 0" }}>
            {cardRequestStatus === 'pending_approval' ? 'Card Request Pending' : 'Order Your VaultPay Card'}
          </h3>
          <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 20px 0" }}>
            {cardRequestStatus === 'pending_approval' ? "We'll notify you once approved." : 'Get your physical debit card delivered'}
          </p>
          <button onClick={() => setShowAddCardModal(true)} style={{ background: "#06FF89", color: "#000", border: "none", padding: "14px 32px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            {cardRequestStatus === 'pending_approval' ? 'Check Status' : 'Order Card'}
          </button>
        </div>
        
        {/* Features */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginTop: 24 }}>
          {[
            { icon: "⚡", title: "Instant Payments", color: "#f59e0b" },
            { icon: "🛡️", title: "Secure", color: "#3b82f6" },
            { icon: "🌍", title: "Global Access", color: "#06FF89" },
            { icon: "💎", title: "No Hidden Fees", color: "#ec4899" },
          ].map((f, i) => (
            <div key={i} style={{ background: "#141414", borderRadius: 12, padding: 16, border: "1px solid #1f1f1f", textAlign: "center" }}>
              <span style={{ fontSize: 24 }}>{f.icon}</span>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 500, marginTop: 8 }}>{f.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Physical Card Display
  const renderPhysicalCardDisplay = () => (
    <div>
      {/* Physical Card - Using card image like the app */}
      <div style={{ position: "relative", marginBottom: 24, borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", aspectRatio: "1.586" }}>
        {/* Card Background Image */}
        <img 
          src="https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/hguuzpvgcw9qv8qj1c2lc" 
          alt="VaultPay Card" 
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: physicalCardFrozen ? "grayscale(0.5) brightness(0.7)" : "none" }}
        />
        
        {/* Card Overlay Content */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {/* Header with Eye Toggle */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button onClick={() => setShowCardNumber(!showCardNumber)} style={{ padding: 8, borderRadius: 20, background: "rgba(0,0,0,0.3)", border: "none", cursor: "pointer", backdropFilter: "blur(4px)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">{showCardNumber ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></> : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></>}</svg>
            </button>
          </div>
          
          {/* Bottom Section */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            {/* Left - Card Number & Name */}
            <div>
              <div onClick={() => showCardNumber && physicalCard?.accountNo && copyToClipboard(physicalCard.accountNo, 'cardNumber')} style={{ cursor: showCardNumber ? "pointer" : "default", marginBottom: 8 }}>
                <span style={{ color: "#fff", fontSize: 18, fontWeight: 600, letterSpacing: 2, fontFamily: "'SF Mono', 'Roboto Mono', monospace", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
                  {showCardNumber 
                    ? (physicalCard?.accountNo?.replace(/(\d{4})(?=\d)/g, '$1 ') || '•••• •••• •••• ••••') 
                    : `${physicalCard?.accountNo?.slice(0, 4) || '••••'} •••• •••• ${physicalCard?.accountNo?.slice(-4) || '••••'}`
                  }
                </span>
              </div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
                {user?.first_name?.toUpperCase()} {user?.last_name?.toUpperCase()}
              </div>
            </div>
            
            {/* Right - EXP & CVV */}
            <div style={{ display: "flex", gap: 20 }}>
              <div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 9, marginBottom: 2, textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>EXP</div>
                <div style={{ color: "#fff", fontSize: 13, fontFamily: "monospace", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
                  {showCardNumber ? (physicalCard?.expiryDt || '••/••') : '••/••'}
                </div>
              </div>
              <div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 9, marginBottom: 2, textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>CVV</div>
                <div style={{ color: "#fff", fontSize: 13, fontFamily: "monospace", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
                  {showCardNumber ? (physicalCard?.cvv || '•••') : '•••'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Frozen Overlay */}
        {physicalCardFrozen && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 18, fontWeight: 700, textTransform: "uppercase", letterSpacing: 2 }}>Card Frozen</span>
          </div>
        )}
      </div>
      
      {/* Card Balance - Separate section like the app */}
      <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 16, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "#888", fontSize: 12, marginBottom: 4 }}>Available Balance</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>
              {showBalance ? parseFloat(physicalCardBalance).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '••••••'}
            </span>
            <span style={{ color: "#888", fontSize: 14 }}>DZD</span>
          </div>
        </div>
        <button onClick={() => setShowBalance(!showBalance)} style={{ padding: 10, borderRadius: 10, background: "rgba(6,255,137,0.1)", border: "none", cursor: "pointer" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2">{showBalance ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></> : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></>}</svg>
        </button>
      </div>
      
      {/* Card Actions - Matching app design */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <button 
          onClick={handleFreezePhysicalCard} 
          style={{ 
            flex: 1, 
            display: "flex", 
            flexDirection: "column",
            alignItems: "center", 
            justifyContent: "center",
            padding: "16px 12px", 
            background: physicalCardFrozen ? "#06FF89" : "#f3f4f6", 
            border: "none", 
            borderRadius: 12, 
            cursor: "pointer" 
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" style={{ marginBottom: 8 }}>
            {physicalCardFrozen ? (
              <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></>
            ) : (
              <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>
            )}
          </svg>
          <span style={{ color: "#000", fontSize: 13, fontWeight: 600 }}>{physicalCardFrozen ? "Unfreeze Card" : "Freeze Card"}</span>
        </button>
        
        <button 
          style={{ 
            flex: 1, 
            display: "flex", 
            flexDirection: "column",
            alignItems: "center", 
            justifyContent: "center",
            padding: "16px 12px", 
            background: "#f3f4f6", 
            border: "none", 
            borderRadius: 12, 
            cursor: "pointer" 
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" style={{ marginBottom: 8 }}>
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
          <span style={{ color: "#000", fontSize: 13, fontWeight: 600 }}>Transactions</span>
        </button>
        
        <button 
          onClick={handleViewPhysicalPin} 
          style={{ 
            flex: 1, 
            display: "flex", 
            flexDirection: "column",
            alignItems: "center", 
            justifyContent: "center",
            padding: "16px 12px", 
            background: "#f3f4f6", 
            border: "none", 
            borderRadius: 12, 
            cursor: "pointer" 
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" style={{ marginBottom: 8 }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span style={{ color: "#000", fontSize: 13, fontWeight: 600 }}>PIN Code</span>
        </button>
      </div>

      {/* Limits Modal */}
      {showLimitsModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowLimitsModal(false)}>
          <div style={{ background: "#141414", borderRadius: 16, padding: 32, width: 400, maxWidth: "90%" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0 }}>Card Limits</h3>
              <button onClick={() => setShowLimitsModal(false)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#888", fontSize: 13 }}>Daily Limit</span>
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{formatCurrency(displayCardLimits.daily_limit)}</span>
              </div>
              <div style={{ background: "#1f1f1f", borderRadius: 8, height: 8, overflow: "hidden", marginBottom: 8 }}>
                <div style={{ background: "linear-gradient(90deg, #06FF89, #B8FF9F)", height: "100%", width: `${displayCardLimits.daily_limit > 0 ? (displayCardLimits.used_today / displayCardLimits.daily_limit) * 100 : 0}%`, borderRadius: 8 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666", fontSize: 11 }}>Used: {formatCurrency(displayCardLimits.used_today)}</span>
                <span style={{ color: "#06FF89", fontSize: 11 }}>Remaining: {formatCurrency(displayCardLimits.remaining_today)}</span>
              </div>
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#888", fontSize: 13 }}>Monthly Limit</span>
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{formatCurrency(displayCardLimits.monthly_limit)}</span>
              </div>
              <div style={{ background: "#1f1f1f", borderRadius: 8, height: 8, overflow: "hidden", marginBottom: 8 }}>
                <div style={{ background: "linear-gradient(90deg, #3b82f6, #60a5fa)", height: "100%", width: `${displayCardLimits.monthly_limit > 0 ? (displayCardLimits.used_this_month / displayCardLimits.monthly_limit) * 100 : 0}%`, borderRadius: 8 }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#666", fontSize: 11 }}>Used: {formatCurrency(displayCardLimits.used_this_month)}</span>
                <span style={{ color: "#3b82f6", fontSize: 11 }}>Remaining: {formatCurrency(displayCardLimits.remaining_this_month)}</span>
              </div>
            </div>
            
            <button onClick={() => setShowLimitsModal(false)} style={{ width: "100%", background: "#06FF89", color: "#000", border: "none", padding: "14px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}

      {/* PIN Modal for Physical Card */}
      {showPinModal && cardType === 'physical' && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowPinModal(false)}>
          <div style={{ background: "#141414", borderRadius: 16, padding: 32, textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: 64, height: 64, borderRadius: 32, background: "rgba(6, 255, 137, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 8px 0" }}>Your Card PIN</h3>
            <p style={{ color: "#666", fontSize: 13, margin: "0 0 24px 0" }}>Keep this PIN secure and do not share it</p>
            <div style={{ fontSize: 36, fontWeight: 700, color: "#06FF89", letterSpacing: 12, marginBottom: 24, fontFamily: "monospace" }}>{cardPin || "••••"}</div>
            <button onClick={() => setShowPinModal(false)} style={{ background: "#06FF89", color: "#000", border: "none", padding: "12px 32px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Close</button>
          </div>
        </div>
      )}

      {/* Fund Card Modal for Physical Card */}
      {showCardFundModal && cardType === 'physical' && physicalCard && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowCardFundModal(false)}>
          <div style={{ background: "#141414", borderRadius: 16, padding: 32, width: 380 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 8px 0" }}>Top Up Card</h3>
            <p style={{ color: "#666", fontSize: 13, margin: "0 0 24px 0" }}>Add funds to your physical card ending in {physicalCard.accountNo?.slice(-4)}</p>
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 8 }}>Amount (DZD)</label>
              <input type="number" value={cardFundAmount} onChange={(e) => setCardFundAmount(e.target.value)} placeholder="0.00" style={{ width: "100%", padding: "14px 16px", background: "#1f1f1f", border: "1px solid #333", borderRadius: 10, color: "#fff", fontSize: 20, fontWeight: 600 }} />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowCardFundModal(false)} style={{ flex: 1, padding: "14px", background: "#333", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, cursor: "pointer" }}>Cancel</button>
              <button onClick={() => { /* TODO: Implement physical card funding */ setShowCardFundModal(false); }} disabled={cardOperationLoading || !cardFundAmount} style={{ flex: 1, padding: "14px", background: "#06FF89", color: "#000", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: cardOperationLoading ? "wait" : "pointer", opacity: cardOperationLoading || !cardFundAmount ? 0.6 : 1 }}>{cardOperationLoading ? "Processing..." : "Top Up"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Virtual Card Tab with Carousel - App-matching design
  const renderVirtualCardTab = () => {
    if (cardsLoading) {
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 48, height: 48, border: "3px solid #1f1f1f", borderTopColor: "#06FF89", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
            <p style={{ color: "#666" }}>Loading cards...</p>
          </div>
        </div>
      );
    }

    if (cards.length === 0) {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh", textAlign: "center", padding: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, background: "rgba(6, 255, 137, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
          <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 600, margin: "0 0 8px 0" }}>No Virtual Cards Yet</h3>
          <p style={{ color: "#666", fontSize: 14, margin: "0 0 24px 0" }}>Create a virtual card for secure online payments</p>
          <button onClick={() => setShowAddCardModal(true)} style={{ background: "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: "#000", border: "none", padding: "14px 32px", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
            Create Virtual Card
          </button>
        </div>
      );
    }

    const activeCard = currentCard || cards[0];
    const displayBalance = (activeCard.balance / 100).toFixed(2);

    // Handle card selection and load details
    const handleCardSelect = async (card: typeof cards[0]) => {
      setSelectedCard(card);
      // Load card details when card is selected
      if (user) {
        try {
          const details = await getMapleradCardDetails(user.user_id, user.login_code, card.card_id || card.id);
          if (details.status && details.data) {
            // Update the card with fresh details - balance is in cents (minor units)
            const updatedCard = { ...card, cvv: details.data.cvv, balance: details.data.balance || details.data.balance_minor || card.balance };
            setSelectedCard(updatedCard);
            setCards(prevCards => prevCards.map(c => 
              c.id === card.id ? updatedCard : c
            ));
          }
          // Also load transactions
          const txnRes = await getMapleradCardTransactions(user.user_id, user.login_code, card.card_id || card.id);
          if (txnRes.status && txnRes.data) {
            setCardTransactions(txnRes.data);
          }
        } catch (err) {
          console.error('Error loading card details:', err);
        }
      }
    };

    return (
      <div style={{ width: "100%", maxWidth: "100%", overflow: "hidden" }}>
        {/* Cards Carousel - Responsive */}
        <div style={{ marginBottom: 32, position: "relative", width: "100%", maxWidth: "100%" }}>
          <div 
            style={{ 
              display: "flex", 
              gap: 20, 
              overflowX: "auto", 
              scrollSnapType: "x mandatory", 
              paddingBottom: 20,
              paddingLeft: 4,
              paddingRight: 4,
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
              width: "100%",
              maxWidth: "100%"
            }}
            className="hide-scrollbar"
          >
            {cards.map((card) => {
              const cardIsVisa = card.card_brand?.toLowerCase() === 'visa';
              const isActive = activeCard.id === card.id;
              const isFrozen = card.status === 'frozen' || card.status === 'inactive';
              // Only show balance for active card, use the balance from card details (already updated via handleCardSelect)
              const cardBalance = isActive ? (activeCard.balance / 100).toFixed(2) : null;
              
              // App-matching gradients: Visa = green-blue, Mastercard = orange-red
              const cardGradient = cardIsVisa 
                ? "linear-gradient(135deg, #19F28F 0%, #6B89FF 55%, #0A42FF 100%)"
                : "linear-gradient(135deg, #FF6A00 0%, #FF3D00 60%, #B00020 100%)";
              
              return (
                <div 
                  key={card.id} 
                  onClick={() => handleCardSelect(card)}
                  style={{ 
                    flex: "0 0 auto",
                    width: "min(340px, calc(100vw - 80px))",
                    aspectRatio: "1.586",
                    borderRadius: 24, 
                    cursor: "pointer",
                    scrollSnapAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                    background: cardGradient,
                    boxShadow: isActive 
                      ? "0 12px 40px rgba(6, 255, 137, 0.4), 0 4px 16px rgba(0,0,0,0.3)" 
                      : "0 8px 32px rgba(0,0,0,0.4)",
                    transform: isActive ? "scale(1)" : "scale(0.95)",
                    opacity: isFrozen ? 0.7 : 1,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}
                >
                  {/* VaultPay Logo - Top Left */}
                  <div style={{ position: "absolute", top: 20, left: 24, zIndex: 2 }}>
                    <img 
                      src="https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/yh680pky1mdxx0vxyr1j9" 
                      alt="VaultPay" 
                      style={{ height: 28, width: "auto" }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>

                  {/* Balance - Top Right - Only show for active card */}
                  {isActive && (
                    <div style={{ position: "absolute", top: 20, right: 24, textAlign: "right", zIndex: 2 }}>
                      <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, fontWeight: 500, letterSpacing: 0.5, marginBottom: 4 }}>Balance</div>
                      <div style={{ color: "#fff", fontSize: 16, fontWeight: 700, letterSpacing: 0.5 }}>
                        {showCardNumbers && cardBalance ? `$${cardBalance}` : '••••••'}
                      </div>
                    </div>
                  )}

                  {/* Card Brand Logo - Bottom Right */}
                  <div style={{ position: "absolute", bottom: 60, right: -20, zIndex: 1, opacity: 0.9 }}>
                    <img 
                      src={cardIsVisa 
                        ? "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/p7dc18pbi8tb8d6dn2rgg"
                        : "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/sujdlo921tk0r6m2269s3"
                      }
                      alt={cardIsVisa ? "Visa" : "Mastercard"}
                      style={{ height: 60, width: "auto" }}
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>

                  {/* Card Details Overlay */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 24, zIndex: 2 }}>
                    {/* Card Number */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <div style={{ color: "#fff", fontSize: 15, fontWeight: 600, letterSpacing: 2, fontFamily: "'SF Mono', 'Roboto Mono', monospace" }}>
                        {showCardNumbers 
                          ? (card.card_number_masked || `•••• •••• •••• ${card.last_four}`).replace(/(.{4})/g, '$1 ').trim()
                          : `•••• •••• •••• ${card.last_four}`
                        }
                      </div>
                      {showCardNumbers && (
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            navigator.clipboard.writeText(card.card_number_masked?.replace(/\s/g, '') || '');
                            alert('Card number copied!');
                          }}
                          style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 6, padding: 6, cursor: "pointer", display: "flex" }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        </button>
                      )}
                    </div>
                    
                    {/* EXP & CVV Row */}
                    <div style={{ display: "flex", gap: 24, marginBottom: 8 }}>
                      <div>
                        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 9, fontWeight: 500, letterSpacing: 0.5, marginBottom: 4 }}>EXP</div>
                        <div style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>
                          {showCardNumbers ? `${card.expiry_month}/${card.expiry_year}` : '••/••'}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 9, fontWeight: 500, letterSpacing: 0.5, marginBottom: 4 }}>CVV</div>
                        <div style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>
                          {showCardNumbers ? (card.cvv || '•••') : '•••'}
                        </div>
                      </div>
                    </div>

                    {/* Cardholder Name */}
                    <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: 500, letterSpacing: 0.8, textTransform: "uppercase" }}>
                      {showCardNumbers ? (card.cardholder_name || 'CARDHOLDER') : '••••••••••'}
                    </div>
                  </div>

                  {/* Status Badge & Card Type - Bottom Right */}
                  <div style={{ position: "absolute", bottom: 20, right: 24, textAlign: "right", zIndex: 2 }}>
                    <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 10, fontWeight: 500, marginBottom: 4 }}>
                      {card.card_type?.toUpperCase() || 'VIRTUAL'} • {cardIsVisa ? 'VISA' : 'MASTERCARD'}
                    </div>
                    <div style={{ 
                      display: "inline-block",
                      background: card.status === 'active' ? "rgba(34, 197, 94, 0.25)" : card.status === 'frozen' ? "rgba(255, 184, 0, 0.25)" : "rgba(239, 68, 68, 0.25)",
                      color: card.status === 'active' ? "#22C55E" : card.status === 'frozen' ? "#FFB800" : "#EF4444",
                      fontSize: 10, 
                      fontWeight: 600, 
                      padding: "4px 10px", 
                      borderRadius: 12,
                      letterSpacing: 0.3
                    }}>
                      {card.status === 'frozen' ? 'FROZEN' : card.status?.toUpperCase() || 'ACTIVE'}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Add Card Button - In Carousel */}
            <div 
              onClick={() => setShowAddCardModal(true)}
              style={{ 
                flex: "0 0 auto",
                width: "min(340px, calc(100vw - 80px))",
                aspectRatio: "1.586",
                borderRadius: 24, 
                border: "3px dashed #06FF89",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                background: "rgba(6, 255, 137, 0.08)",
                scrollSnapAlign: "center",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(6, 255, 137, 0.15)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(6, 255, 137, 0.08)"; }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              <div style={{ color: "#06FF89", fontSize: 16, fontWeight: 700, marginTop: 16 }}>Create Virtual Card</div>
            </div>
          </div>
          
          {/* Carousel Indicators */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
            {cards.map((card) => (
              <button 
                key={card.id} 
                onClick={() => handleCardSelect(card)}
                style={{ 
                  width: activeCard.id === card.id ? 28 : 10, 
                  height: 10, 
                  borderRadius: 5, 
                  background: activeCard.id === card.id ? "#06FF89" : "#333", 
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease" 
                }} 
              />
            ))}
          </div>
        </div>

        {/* Card Actions Grid - 2x2 on mobile, 4 cols on desktop */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 16px 0" }}>Card Actions</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
            {/* Top Up */}
            <button 
              onClick={() => activeCard.status === 'frozen' ? alert('Please unfreeze your card first') : setShowCardFundModal(true)} 
              style={{ 
                background: "#06FF89", 
                border: "none", 
                borderRadius: 16, 
                padding: "18px 16px", 
                cursor: "pointer", 
                textAlign: "center",
                boxShadow: "0 4px 15px rgba(6, 255, 137, 0.3)",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ width: 40, height: 40, borderRadius: 20, background: "rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
              </div>
              <div style={{ color: "#000", fontSize: 14, fontWeight: 700 }}>Top Up</div>
              <div style={{ color: "rgba(0,0,0,0.6)", fontSize: 11 }}>Add funds</div>
            </button>

            {/* Withdraw */}
            <button 
              onClick={() => activeCard.status === 'frozen' ? alert('Please unfreeze your card first') : setShowCardWithdrawModal(true)} 
              style={{ 
                background: "#B8FF9F", 
                border: "none", 
                borderRadius: 16, 
                padding: "18px 16px", 
                cursor: "pointer", 
                textAlign: "center",
                boxShadow: "0 4px 15px rgba(184, 255, 159, 0.3)",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ width: 40, height: 40, borderRadius: 20, background: "rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
              </div>
              <div style={{ color: "#000", fontSize: 14, fontWeight: 700 }}>Withdraw</div>
              <div style={{ color: "rgba(0,0,0,0.6)", fontSize: 11 }}>To wallet</div>
            </button>

            {/* Freeze/Unfreeze */}
            <button 
              onClick={handleFreezeCard} 
              style={{ 
                background: activeCard.status === 'frozen' ? "#1f1f1f" : "#5C023D", 
                border: "none", 
                borderRadius: 16, 
                padding: "18px 16px", 
                cursor: "pointer", 
                textAlign: "center",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ width: 40, height: 40, borderRadius: 20, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                {activeCard.status === 'frozen' 
                  ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                }
              </div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>{activeCard.status === 'frozen' ? 'Unfreeze' : 'Freeze'}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>{activeCard.status === 'frozen' ? 'Enable card' : 'Disable card'}</div>
            </button>

            {/* Details */}
            <button 
              onClick={() => loadCardDetails(activeCard.id)} 
              style={{ 
                background: "#9CA9B9", 
                border: "none", 
                borderRadius: 16, 
                padding: "18px 16px", 
                cursor: "pointer", 
                textAlign: "center",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ width: 40, height: 40, borderRadius: 20, background: "rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              </div>
              <div style={{ color: "#000", fontSize: 14, fontWeight: 700 }}>Details</div>
              <div style={{ color: "rgba(0,0,0,0.6)", fontSize: 11 }}>Card info</div>
            </button>

            {/* Transactions */}
            <button 
              onClick={() => loadCardDetails(activeCard.id)} 
              style={{ 
                background: "#DEC5E2", 
                border: "none", 
                borderRadius: 16, 
                padding: "18px 16px", 
                cursor: "pointer", 
                textAlign: "center",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ width: 40, height: 40, borderRadius: 20, background: "rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              </div>
              <div style={{ color: "#000", fontSize: 14, fontWeight: 700 }}>Transactions</div>
              <div style={{ color: "rgba(0,0,0,0.6)", fontSize: 11 }}>View history</div>
            </button>

            {/* Limits */}
            <button 
              onClick={() => setShowLimitsModal(true)} 
              style={{ 
                background: "#0100FE", 
                border: "none", 
                borderRadius: 16, 
                padding: "18px 16px", 
                cursor: "pointer", 
                textAlign: "center",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ width: 40, height: 40, borderRadius: 20, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>Limits</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>View limits</div>
            </button>
          </div>
        </div>

        {/* Transaction Summary */}
        {cardTransactions.length > 0 && (() => {
          const debitTxns = cardTransactions.filter(t => {
            const isCardIssuance = t.description?.toLowerCase().includes('card issu');
            return (t.transaction_type === 'purchase' || t.transaction_type === 'fee' || (t as any).entry === 'DEBIT') && !isCardIssuance;
          });
          const creditTxns = cardTransactions.filter(t => {
            const isCardIssuance = t.description?.toLowerCase().includes('card issu');
            return t.transaction_type === 'refund' || (t as any).entry === 'CREDIT' || isCardIssuance;
          });
          const totalSpent = debitTxns.reduce((sum, t) => sum + (t.amount / 100), 0);
          const totalCredit = creditTxns.reduce((sum, t) => sum + (t.amount / 100), 0);
          
          return (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
                </div>
                <div>
                  <div style={{ color: "#888", fontSize: 12, marginBottom: 2 }}>Spent</div>
                  <div style={{ color: "#ef4444", fontSize: 18, fontWeight: 700 }}>${totalSpent.toFixed(2)}</div>
                </div>
              </div>
              <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(6,255,137,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                </div>
                <div>
                  <div style={{ color: "#888", fontSize: 12, marginBottom: 2 }}>Credit</div>
                  <div style={{ color: "#06FF89", fontSize: 18, fontWeight: 700 }}>+${totalCredit.toFixed(2)}</div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Recent Transactions */}
        <div style={{ background: "#141414", borderRadius: 16, border: "1px solid #1f1f1f", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1f1f1f", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 700, margin: 0 }}>Recent Transactions</h3>
            <button onClick={() => loadCardDetails(activeCard.id)} style={{ background: "transparent", border: "none", color: "#06FF89", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              Refresh
            </button>
          </div>
          {cardTransactions.length > 0 ? cardTransactions.map((txn, i) => {
            const isCardIssuance = txn.description?.toLowerCase().includes('card issu');
            const isDebit = (txn.transaction_type === 'purchase' || txn.transaction_type === 'fee' || (txn as any).entry === 'DEBIT') && !isCardIssuance;
            const txnDate = new Date(txn.created_at);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const dateLabel = txnDate.toDateString() === today.toDateString() ? 'Today' : 
              txnDate.toDateString() === yesterday.toDateString() ? 'Yesterday' : 
              txnDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const timeLabel = txnDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            const status = (txn.status || '').toUpperCase();
            const showStatus = status !== 'COMPLETED' && status !== 'SUCCESS' && status !== '';
            
            return (
              <div key={txn.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: i < cardTransactions.length - 1 ? "1px solid #1a1a1a" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(6,255,137,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  </div>
                  <div>
                    <div style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>{txn.merchant_name || (txn as any).merchant?.name || 'Transaction'}</div>
                    <div style={{ color: "#666", fontSize: 12 }}>{dateLabel} • {timeLabel}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: isDebit ? "#ef4444" : "#06FF89", fontSize: 14, fontWeight: 600 }}>
                    {isDebit ? '-' : '+'}{formatCurrency(txn.amount / 100, txn.currency)}
                  </div>
                  {showStatus && (
                    <span style={{ background: "rgba(255,200,0,0.1)", color: "#FFC800", fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, textTransform: "uppercase" }}>{txn.status}</span>
                  )}
                </div>
              </div>
            );
          }) : (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" style={{ margin: "0 auto 12px" }}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              <div style={{ color: "#666", fontSize: 14 }}>No transactions yet</div>
            </div>
          )}
        </div>

        {/* Modals */}
        {showPinModal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowPinModal(false)}>
            <div style={{ background: "#141414", borderRadius: 20, padding: 32, textAlign: "center", border: "1px solid #333" }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 16px 0" }}>Your Card PIN</h3>
              <div style={{ fontSize: 36, fontWeight: 700, color: "#06FF89", letterSpacing: 12, marginBottom: 24, fontFamily: "monospace" }}>{cardPin || "****"}</div>
              <button onClick={() => setShowPinModal(false)} style={{ background: "#06FF89", color: "#000", border: "none", padding: "12px 32px", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Close</button>
            </div>
          </div>
        )}
        {showCardFundModal && currentCard && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowCardFundModal(false)}>
            <div style={{ background: "#141414", borderRadius: 20, padding: 32, width: "min(400px, 90vw)", border: "1px solid #333" }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 8px 0" }}>Top Up Card</h3>
              <p style={{ color: "#666", fontSize: 14, margin: "0 0 24px 0" }}>Transfer funds from your wallet to card •••• {currentCard.last_four}</p>
              <div style={{ marginBottom: 20 }}>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 8 }}>Amount (USD)</label>
                <input type="number" value={cardFundAmount} onChange={(e) => setCardFundAmount(e.target.value)} placeholder="0.00" style={{ width: "100%", padding: "14px 16px", background: "#0a0a0a", border: "1px solid #333", borderRadius: 12, color: "#fff", fontSize: 20, fontWeight: 600, boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setShowCardFundModal(false)} style={{ flex: 1, padding: "14px", background: "#333", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                <button onClick={handleFundCard} disabled={cardOperationLoading} style={{ flex: 1, padding: "14px", background: "#06FF89", color: "#000", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: cardOperationLoading ? "wait" : "pointer", opacity: cardOperationLoading ? 0.6 : 1 }}>{cardOperationLoading ? "Processing..." : "Top Up"}</button>
              </div>
            </div>
          </div>
        )}
        {showCardWithdrawModal && currentCard && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowCardWithdrawModal(false)}>
            <div style={{ background: "#141414", borderRadius: 20, padding: 32, width: "min(400px, 90vw)", border: "1px solid #333" }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: "0 0 8px 0" }}>Withdraw to Wallet</h3>
              <p style={{ color: "#666", fontSize: 14, margin: "0 0 16px 0" }}>Transfer funds from card •••• {currentCard.last_four} to your wallet</p>
              <p style={{ color: "#06FF89", fontSize: 16, fontWeight: 600, margin: "0 0 24px 0" }}>Card Balance: ${(currentCard.balance / 100).toFixed(2)}</p>
              <div style={{ marginBottom: 20 }}>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 8 }}>Amount (USD)</label>
                <input type="number" value={cardWithdrawAmount} onChange={(e) => setCardWithdrawAmount(e.target.value)} placeholder="0.00" style={{ width: "100%", padding: "14px 16px", background: "#0a0a0a", border: "1px solid #333", borderRadius: 12, color: "#fff", fontSize: 20, fontWeight: 600, boxSizing: "border-box" }} />
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => setShowCardWithdrawModal(false)} style={{ flex: 1, padding: "14px", background: "#333", color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                <button onClick={handleWithdrawFromCard} disabled={cardOperationLoading} style={{ flex: 1, padding: "14px", background: "#06FF89", color: "#000", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: cardOperationLoading ? "wait" : "pointer", opacity: cardOperationLoading ? 0.6 : 1 }}>{cardOperationLoading ? "Processing..." : "Withdraw"}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderQRCodesTab = () => (
    <div>
      <div style={{ display: "flex", gap: 0, marginBottom: 24, background: "#141414", borderRadius: 8, padding: 4 }}>
        {[{ id: "generate" as const, label: "Generate" }, { id: "myqrcodes" as const, label: "My QR Codes" }, { id: "scanner" as const, label: "Scanner" }].map((tab) => (
          <button key={tab.id} onClick={() => setQrSubTab(tab.id)} style={{ flex: 1, padding: "12px 24px", background: qrSubTab === tab.id ? "#06FF89" : "transparent", color: qrSubTab === tab.id ? "#000" : "#888", border: "none", borderRadius: 6, fontSize: 14, fontWeight: qrSubTab === tab.id ? 600 : 400, cursor: "pointer" }}>{tab.label}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ flex: 1 }}>
          {qrSubTab === "generate" && (
            <>
              <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 20, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{ color: "#06FF89", fontSize: 16 }}>$</span>
                  <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: 0 }}>Payment QR Code</h3>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Amount</label>
                  <div style={{ display: "flex", alignItems: "center", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px" }}>
                    <span style={{ color: "#06FF89", fontSize: 16, marginRight: 8 }}>$</span>
                    <input type="text" value={qrPaymentAmount} onChange={(e) => setQrPaymentAmount(e.target.value)} placeholder="0.00" style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 16, outline: "none" }} />
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Description (optional)</label>
                  <input type="text" value={qrPaymentDescription} onChange={(e) => setQrPaymentDescription(e.target.value)} placeholder="What is this payment for?" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                </div>
                <button onClick={handleGeneratePaymentQR} disabled={qrLoading} style={{ width: "100%", background: "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: "#000", border: "none", padding: "14px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  {qrLoading ? "Generating..." : "Generate Payment QR"}
                </button>
              </div>
              <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 16 }}>👤</span>
                  <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: 0 }}>Profile QR Code</h3>
                </div>
                <p style={{ color: "#666", fontSize: 12, marginBottom: 16 }}>Generate a QR code that others can scan to quickly add you as a contact or send you payments.</p>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", cursor: "pointer" }}>
                    <span style={{ color: "#fff", fontSize: 13 }}>Include profile picture</span>
                    <input type="checkbox" checked={includeProfilePic} onChange={(e) => setIncludeProfilePic(e.target.checked)} style={{ width: 18, height: 18, accentColor: "#06FF89" }} />
                  </label>
                  <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", cursor: "pointer" }}>
                    <span style={{ color: "#fff", fontSize: 13 }}>Include contact info</span>
                    <input type="checkbox" checked={includeContactInfo} onChange={(e) => setIncludeContactInfo(e.target.checked)} style={{ width: 18, height: 18, accentColor: "#06FF89" }} />
                  </label>
                  <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", cursor: "pointer" }}>
                    <span style={{ color: "#fff", fontSize: 13 }}>Allow direct payments</span>
                    <input type="checkbox" checked={allowDirectPayments} onChange={(e) => setAllowDirectPayments(e.target.checked)} style={{ width: 18, height: 18, accentColor: "#06FF89" }} />
                  </label>
                </div>
                <button onClick={handleGenerateProfileQR} disabled={qrLoading} style={{ width: "100%", background: "transparent", color: "#fff", border: "1px solid #333", padding: "14px 24px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                  {qrLoading ? "Generating..." : "Generate Profile QR"}
                </button>
              </div>
            </>
          )}
          {qrSubTab === "myqrcodes" && (
            <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 20 }}>
              <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: "0 0 16px 0" }}>My QR Codes</h3>
              {myQRCodes.length > 0 ? myQRCodes.map((qr) => (
                <div key={qr.id} onClick={() => setGeneratedQR(qr.qr_code_image)} style={{ display: "flex", justifyContent: "space-between", padding: 16, background: "#0a0a0a", borderRadius: 8, cursor: "pointer", border: "1px solid #333", marginBottom: 8 }}>
                  <div><div style={{ color: "#fff", fontSize: 14 }}>{formatCurrency(qr.amount, qr.currency)}</div><div style={{ color: "#666", fontSize: 12 }}>{qr.description || "Payment QR"}</div></div>
                  <div style={{ textAlign: "right" }}><div style={{ color: qr.status === "active" ? "#06FF89" : "#666", fontSize: 12 }}>{qr.status}</div><div style={{ color: "#666", fontSize: 11 }}>{formatDate(qr.created_at)}</div></div>
                </div>
              )) : <div style={{ textAlign: "center", padding: 40, color: "#666" }}><div style={{ fontSize: 32, marginBottom: 12 }}>📱</div><p>No QR codes yet</p></div>}
            </div>
          )}
          {qrSubTab === "scanner" && (
            <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 40, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📷</div>
              <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: "0 0 8px 0" }}>QR Scanner</h3>
              <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>Use your camera to scan QR codes</p>
              <button style={{ background: "#06FF89", color: "#000", border: "none", padding: "14px 32px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Open Camera</button>
            </div>
          )}
        </div>
        <div style={{ width: 400 }}>
          <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 24 }}>
            <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: "0 0 24px 0" }}>QR Code Preview</h3>
            <div style={{ background: "#0a0a0a", borderRadius: 12, padding: 32, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 280, marginBottom: 24 }}>
              {generatedQR ? (
                <img src={generatedQR} alt="QR Code" style={{ maxWidth: "100%", maxHeight: 250, borderRadius: 8 }} />
              ) : (
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 180, height: 180, background: "#1a1a1a", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", border: "2px dashed #333" }}>
                    <span style={{ fontSize: 64, opacity: 0.3 }}>📱</span>
                  </div>
                  <p style={{ color: "#fff", fontSize: 14, fontWeight: 500, margin: "0 0 4px 0" }}>Your QR Code</p>
                  <p style={{ color: "#666", fontSize: 12, margin: 0 }}>Generate a QR code above to see it here</p>
                </div>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              <button onClick={handleDownloadQR} disabled={!generatedQR} style={{ padding: "12px 16px", background: generatedQR ? "#1a1a1a" : "#0f0f0f", color: generatedQR ? "#fff" : "#444", border: "1px solid #333", borderRadius: 8, fontSize: 13, cursor: generatedQR ? "pointer" : "not-allowed" }}>Download</button>
              <button disabled={!generatedQR} style={{ padding: "12px 16px", background: generatedQR ? "#1a1a1a" : "#0f0f0f", color: generatedQR ? "#fff" : "#444", border: "1px solid #333", borderRadius: 8, fontSize: 13, cursor: generatedQR ? "pointer" : "not-allowed" }}>Share</button>
              <button onClick={handleCopyQR} disabled={!generatedQR} style={{ padding: "12px 16px", background: generatedQR ? "#1a1a1a" : "#0f0f0f", color: generatedQR ? "#fff" : "#444", border: "1px solid #333", borderRadius: 8, fontSize: 13, cursor: generatedQR ? "pointer" : "not-allowed" }}>Copy</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const copyReferralCode = async () => {
    if (!referralStats?.referral_code) return;
    try {
      await navigator.clipboard.writeText(referralStats.referral_code);
      alert('Referral code copied to clipboard!');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      alert('Failed to copy referral code');
    }
  };

  const shareReferralCode = async () => {
    if (!referralStats?.referral_code) return;
    const message = `Join VaultPay using my referral code: ${referralStats.referral_code}\n\nGet started with digital payments and earn rewards!`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Join VaultPay', text: message });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyReferralCode();
    }
  };

  const renderRewardsTab = () => {
    const currentShares = referralStats?.total_referrals || 0;
    const referralCode = referralStats?.referral_code || 'N/A';
    const currentLevel = referralStats?.current_level || 1;
    const awaitingKyc = referralStats?.awaiting_kyc || 0;
    const claimableRewards = referralStats?.claimable_level_rewards || [];

    const isLevelCompleted = (level: number): boolean => {
      const levelData = referralLevels[level - 1];
      if (!levelData) return false;
      return currentShares >= levelData.shares_required;
    };

    const getLevelProgress = (level: number): number => {
      const levelData = referralLevels[level - 1];
      if (!levelData || levelData.shares_required <= 0) return 0;
      const progress = (currentShares / levelData.shares_required) * 100;
      return Math.min(progress, 100);
    };

    if (referralLoading) {
      return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400, color: "#666" }}>Loading referral data...</div>;
    }

    return (
      <div>
        {claimableRewards.length > 0 && (
          <div style={{ background: "linear-gradient(90deg, #FFD700 0%, #FFA500 100%)", borderRadius: 12, padding: 16, marginBottom: 24, cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#000", fontSize: 16, fontWeight: 600 }}>🎉 {claimableRewards.length} Reward{claimableRewards.length > 1 ? 's' : ''} Available!</div>
                <div style={{ color: "#000", fontSize: 13, opacity: 0.8 }}>👆 Tap here to claim your reward{claimableRewards.length > 1 ? 's' : ''} now!</div>
              </div>
              <div style={{ color: "#000", fontSize: 20 }}>→</div>
            </div>
          </div>
        )}
        {awaitingKyc > 0 && (
          <div style={{ background: "#1a1a1a", borderRadius: 8, padding: 12, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span style={{ color: "#888", fontSize: 13 }}>{awaitingKyc} referral{awaitingKyc > 1 ? 's' : ''} pending KYC verification</span>
          </div>
        )}
        <div style={{ background: "linear-gradient(135deg, #06FF89 0%, #B8FF9F 100%)", borderRadius: 16, padding: 40, textAlign: "center", marginBottom: 24 }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 16px" }}><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>
          <h2 style={{ color: "#000", fontSize: 32, fontWeight: 700, margin: "0 0 8px" }}>Refer & Win!</h2>
          <p style={{ color: "#000", fontSize: 16, margin: 0, opacity: 0.8 }}>Share and unlock rewards</p>
        </div>
        <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 20, marginBottom: 24 }}>
          <div style={{ color: "#888", fontSize: 12, marginBottom: 8 }}>Your Referral Code</div>
          <div style={{ background: "#0a0a0a", borderRadius: 8, padding: 16, marginBottom: 16 }}>
            <div style={{ color: "#fff", fontSize: 24, fontWeight: 700, textAlign: "center", letterSpacing: 2 }}>{referralCode}</div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={copyReferralCode} style={{ flex: 1, background: "#1a1a1a", color: "#fff", border: "1px solid #333", padding: "12px 16px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copy Code
            </button>
            <button onClick={shareReferralCode} style={{ flex: 1, background: "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: "#000", border: "none", padding: "12px 16px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              Share
            </button>
          </div>
        </div>
        <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 20, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: 0 }}>Referral Levels</h3>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#FFD700", padding: "4px 12px", borderRadius: 12 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#000" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span style={{ color: "#000", fontSize: 13, fontWeight: 600 }}>Level {currentLevel}</span>
            </div>
          </div>
          <div style={{ background: "#0a0a0a", borderRadius: 8, padding: 12, marginBottom: 16 }}>
            <div style={{ color: "#888", fontSize: 12, marginBottom: 4 }}>Your KYC-Verified Shares:</div>
            <div style={{ color: "#06FF89", fontSize: 24, fontWeight: 700 }}>{currentShares}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {referralLevels.slice(0, 6).map((level, index) => {
              const levelNum = index + 1;
              const isCompleted = isLevelCompleted(levelNum);
              const progress = getLevelProgress(levelNum);
              const isGold = levelNum === 6;
              return (
                <div key={levelNum} style={{ background: isGold ? "linear-gradient(135deg, #FFD700 20%, #FFA500 100%)" : "#1a1a1a", borderRadius: 12, padding: 16, border: isCompleted ? "2px solid #06FF89" : "1px solid #333", opacity: !isCompleted && levelNum > 1 && !isLevelCompleted(levelNum - 1) ? 0.5 : 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={isGold ? "#000" : "#FFD700"} stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      <span style={{ color: isGold ? "#000" : "#fff", fontSize: 16, fontWeight: 600 }}>{isGold ? "Gold Reward" : `Level ${levelNum}`}</span>
                    </div>
                    {isCompleted && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00FF00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                  </div>
                  <div style={{ color: isGold ? "#000" : "#888", fontSize: 13, marginBottom: 4 }}>Share {level.shares_required} times</div>
                  <div style={{ color: isGold ? "#000" : "#fff", fontSize: 14, fontWeight: 600, marginBottom: 8 }}>🎁 {level.reward_description}</div>
                  {!isCompleted && (
                    <div>
                      <div style={{ background: isGold ? "rgba(0,0,0,0.2)" : "#0a0a0a", borderRadius: 4, height: 6, overflow: "hidden", marginBottom: 4 }}>
                        <div style={{ background: "#06FF89", height: "100%", width: `${progress}%`, transition: "width 0.3s" }} />
                      </div>
                      <div style={{ color: isGold ? "#000" : "#666", fontSize: 12 }}>{currentShares}/{level.shares_required} shares</div>
                    </div>
                  )}
                  {isCompleted && <div style={{ color: "#00FF00", fontSize: 13, fontWeight: 600 }}>✓ Completed</div>}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 20 }}>
          <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: "0 0 16px" }}>How It Works</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(6,255,137,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              </div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Share Your Code</div>
              <div style={{ color: "#666", fontSize: 12 }}>Send your unique code to friends</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(6,255,137,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>They Sign Up</div>
              <div style={{ color: "#666", fontSize: 12 }}>Friend creates account with your code</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(6,255,137,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
              </div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>You Both Earn</div>
              <div style={{ color: "#666", fontSize: 12 }}>Get rewarded after first transaction</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAccountsTab = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 600, margin: 0 }}>Linked Bank Accounts</h2>
          <p style={{ color: "#666", fontSize: 13, margin: "4px 0 0" }}>Connect your bank accounts to easily transfer funds</p>
        </div>
        <button onClick={() => setShowBankLinkModal(true)} style={{ background: "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: "#000", border: "none", padding: "12px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg> Connect Bank Account
        </button>
      </div>

      {bankAccountsLoading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200, color: "#666" }}>Loading bank accounts...</div>
      ) : linkedBankAccounts.length === 0 ? (
        <div style={{ background: "#141414", borderRadius: 16, border: "1px solid #1f1f1f", padding: 48, textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(6,255,137,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>
          </div>
          <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: "0 0 8px" }}>No Bank Accounts Linked</h3>
          <p style={{ color: "#666", fontSize: 14, margin: "0 0 24px", maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>Link your bank account to enable withdrawals and transfers.</p>
          <button onClick={() => setShowBankLinkModal(true)} style={{ background: "#06FF89", color: "#000", border: "none", padding: "14px 32px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Link Bank Account</button>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 32, paddingTop: 24, borderTop: "1px solid #1f1f1f" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#06FF89"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
              <span style={{ color: "#888", fontSize: 12 }}>Bank-level security</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#06FF89"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>
              <span style={{ color: "#888", fontSize: 12 }}>256-bit encryption</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#06FF89"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              <span style={{ color: "#888", fontSize: 12 }}>Secure linking</span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {linkedBankAccounts.map((account, index) => (
            <div key={account.id || `bank-${index}`} style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h4 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: 0 }}>{account.bank_name || account.institution_name}</h4>
                  <span style={{ background: "rgba(6,255,137,0.1)", color: "#06FF89", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>Active</span>
                </div>
                <p style={{ color: "#888", fontSize: 13, margin: "4px 0 0" }}>{account.account_type || 'Checking'} •••• {account.account_number?.slice(-4) || account.iban?.slice(-4) || '****'}</p>
                <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                  <span style={{ color: "#666", fontSize: 12 }}>{account.currency || 'USD'}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => handleUnlinkBank(account.id || account.bankId)} style={{ background: "transparent", color: "#ff4444", border: "1px solid rgba(255,68,68,0.3)", padding: "8px 16px", borderRadius: 6, fontSize: 13, cursor: "pointer" }}>Unlink</button>
              </div>
            </div>
          ))}

          <div style={{ background: "#0f0f0f", borderRadius: 12, border: "1px dashed #333", padding: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} onClick={() => setShowBankLinkModal(true)}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(6,255,137,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              </div>
              <div>
                <p style={{ color: "#fff", fontSize: 14, fontWeight: 500, margin: 0 }}>Add Another Bank Account</p>
                <p style={{ color: "#666", fontSize: 12, margin: 0 }}>Link more bank accounts</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderProfileTab = () => (
    <div style={{ display: "flex", gap: 24 }}>
      {/* Left Sidebar Menu */}
      <div style={{ width: 280, flexShrink: 0 }}>
        <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", overflow: "hidden" }}>
          {/* Cover Photo */}
          <div style={{ height: 100, background: user.cover_photo ? `url(${user.cover_photo}) center/cover` : "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", position: "relative" }}>
            <button onClick={() => { setPhotoUploadType('cover'); setShowPhotoUploadModal(true); }} style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              <span style={{ color: "#fff", fontSize: 10 }}>Edit</span>
            </button>
          </div>
          {/* Profile Header */}
          <div style={{ padding: "0 24px 24px", textAlign: "center", marginTop: -40 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", margin: "0 auto 12px", overflow: "hidden", border: "3px solid #06FF89", background: "#141414", position: "relative", cursor: "pointer" }} onClick={() => { setPhotoUploadType('profile'); setShowPhotoUploadModal(true); }}>
              {user.ppic ? (
                <img src={normalizeImageUrl(user.ppic) || ''} alt={`${user.first_name} ${user.last_name}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "#06FF89", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "#000" }}>{user.first_name[0]}{user.last_name[0]}</div>
              )}
              <div style={{ position: "absolute", bottom: 0, right: 0, width: 24, height: 24, borderRadius: "50%", background: "#06FF89", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #141414" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </div>
            </div>
            <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: "0 0 4px" }}>{user.first_name} {user.last_name}</h3>
            <p style={{ color: "#666", fontSize: 13, margin: 0 }}>@{user.user_name}</p>
            {user.is_kyc_verified === "2" && <span style={{ display: "inline-block", marginTop: 8, background: "rgba(6,255,137,0.1)", color: "#06FF89", fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 20 }}>✓ Verified Account</span>}
            {/* Followers / Following */}
            <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 16, paddingTop: 16, borderTop: "1px solid #1f1f1f" }}>
              <button onClick={() => openFollowersModal('followers')} style={{ textAlign: "center", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
                <p style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: 0 }}>{(socialStats?.followers_count ?? user.followers_count ?? 0).toLocaleString()}</p>
                <p style={{ color: "#666", fontSize: 11, margin: "2px 0 0" }}>Followers</p>
              </button>
              <div style={{ width: 1, background: "#1f1f1f" }} />
              <button onClick={() => openFollowersModal('following')} style={{ textAlign: "center", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
                <p style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: 0 }}>{(socialStats?.following_count ?? user.following_count ?? 0).toLocaleString()}</p>
                <p style={{ color: "#666", fontSize: 11, margin: "2px 0 0" }}>Following</p>
              </button>
            </div>
          </div>
          {/* Menu Items */}
          <div style={{ padding: 8 }}>
            {[
              { id: "personal" as const, label: "Personal Information", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
              { id: "password" as const, label: "Change Password", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> },
              { id: "privacy" as const, label: "Privacy Control", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
              { id: "notifications" as const, label: "Notification Settings", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
            ].map((item) => (
              <button key={item.id} onClick={() => setProfileSection(item.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", marginBottom: 4, background: profileSection === item.id ? "rgba(6,255,137,0.1)" : "transparent", border: "none", borderRadius: 8, cursor: "pointer", color: profileSection === item.id ? "#06FF89" : "#888", transition: "all 0.2s" }}>
                {item.icon}
                <span style={{ fontSize: 14 }}>{item.label}</span>
              </button>
            ))}
          </div>
          {/* Social Links */}
          <div style={{ padding: 16, borderTop: "1px solid #1f1f1f" }}>
            <p style={{ color: "#666", fontSize: 12, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.5 }}>Follow Us</p>
            <div style={{ display: "flex", gap: 8 }}>
              <a href="https://facebook.com/vaultpay" target="_blank" rel="noopener noreferrer" style={{ width: 36, height: 36, borderRadius: 8, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", textDecoration: "none", transition: "all 0.2s" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://instagram.com/vaultpay" target="_blank" rel="noopener noreferrer" style={{ width: 36, height: 36, borderRadius: 8, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", textDecoration: "none", transition: "all 0.2s" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://youtube.com/vaultpay" target="_blank" rel="noopener noreferrer" style={{ width: 36, height: 36, borderRadius: 8, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", textDecoration: "none", transition: "all 0.2s" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
          {/* Get the App */}
          <div style={{ padding: 16, borderTop: "1px solid #1f1f1f" }}>
            <p style={{ color: "#666", fontSize: 12, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.5 }}>Get the App</p>
            <div style={{ display: "flex", gap: 8 }}>
              <a href="https://apps.apple.com/us/app/vaultpay-borderless-payments/id6755896628" target="_blank" rel="noopener noreferrer" style={{ width: 36, height: 36, borderRadius: 8, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", textDecoration: "none", transition: "all 0.2s" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.venmob.app" target="_blank" rel="noopener noreferrer" style={{ width: 36, height: 36, borderRadius: 8, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", textDecoration: "none", transition: "all 0.2s" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg>
              </a>
            </div>
          </div>
          {/* Trustpilot */}
          <div style={{ padding: 16, borderTop: "1px solid #1f1f1f" }}>
            <a href="https://www.trustpilot.com/review/vaultpay.com" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "#1a1a1a", borderRadius: 8, textDecoration: "none", transition: "all 0.2s" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#00B67A"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              <div>
                <p style={{ color: "#fff", fontSize: 13, fontWeight: 500, margin: 0 }}>Rate us on Trustpilot</p>
                <p style={{ color: "#666", fontSize: 11, margin: 0 }}>Share your experience</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div style={{ flex: 1 }}>
        {/* Personal Information Section */}
        {profileSection === "personal" && (
          <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: 0 }}>Personal Information</h3>
                <p style={{ color: "#666", fontSize: 13, margin: "4px 0 0" }}>View your personal details</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Username - Editable once per month */}
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={{ color: "#888", fontSize: 12 }}>Username</label>
                  {!canChangeUsername() && <span style={{ color: "#FFC800", fontSize: 11 }}>Can change in {daysUntilUsernameChange()} days</span>}
                </div>
                {profileEditMode && canChangeUsername() ? (
                  <div>
                    <div style={{ display: "flex", gap: 12 }}>
                      <div style={{ flex: 1, position: "relative" }}>
                        <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", color: "#666" }}>@</span>
                        <input type="text" placeholder="Enter new username" value={newUsername} onChange={(e) => { setNewUsername(e.target.value); handleCheckUsername(e.target.value); }} style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: `1px solid ${usernameAvailable === true ? "#06FF89" : usernameAvailable === false ? "#ff4444" : "#333"}`, padding: "12px 16px 12px 32px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                        {usernameChecking && <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#666", fontSize: 12 }}>Checking...</span>}
                        {!usernameChecking && usernameAvailable === true && <svg style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }} width="16" height="16" viewBox="0 0 24 24" fill="#06FF89"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>}
                        {!usernameChecking && usernameAvailable === false && <svg style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)" }} width="16" height="16" viewBox="0 0 24 24" fill="#ff4444"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/></svg>}
                      </div>
                      <button onClick={handleUpdateUsername} disabled={usernameAvailable !== true || usernameUpdating} style={{ background: usernameAvailable === true ? "#06FF89" : "#333", color: usernameAvailable === true ? "#000" : "#666", border: "none", padding: "12px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: usernameAvailable === true ? "pointer" : "not-allowed" }}>{usernameUpdating ? "Saving..." : "Save"}</button>
                      <button onClick={() => { setProfileEditMode(false); setNewUsername(""); setUsernameAvailable(null); }} style={{ background: "transparent", color: "#888", border: "1px solid #333", padding: "12px 20px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Cancel</button>
                    </div>
                    {usernameAvailable === false && <p style={{ color: "#ff4444", fontSize: 11, margin: "6px 0 0" }}>This username is already taken</p>}
                    {usernameAvailable === true && <p style={{ color: "#06FF89", fontSize: 11, margin: "6px 0 0" }}>Username is available!</p>}
                    <p style={{ color: "#555", fontSize: 11, margin: "8px 0 0" }}>You can only change your username once every 30 days</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1, background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#888", fontSize: 14 }}>@{user.user_name}</div>
                    {canChangeUsername() && <button onClick={() => setProfileEditMode(true)} style={{ background: "transparent", color: "#06FF89", border: "1px solid #06FF89", padding: "10px 16px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Change</button>}
                  </div>
                )}
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Date of Birth</label>
                <div style={{ background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#888", fontSize: 14 }}>{user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Not set"}</div>
              </div>
              {/* Full Name - Not editable */}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <label style={{ color: "#888", fontSize: 12 }}>First Name</label>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div style={{ background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#888", fontSize: 14 }}>{user.first_name}</div>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <label style={{ color: "#888", fontSize: 12 }}>Last Name</label>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div style={{ background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#888", fontSize: 14 }}>{user.last_name}</div>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <label style={{ color: "#888", fontSize: 12 }}>Primary Email</label>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div style={{ background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#888", fontSize: 14 }}>{user.email}</div>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <label style={{ color: "#888", fontSize: 12 }}>Phone Number</label>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div style={{ background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#888", fontSize: 14 }}>{user.mobile || "Not set"}</div>
              </div>
            </div>
            <div style={{ marginTop: 20, padding: 16, background: "#0a0a0a", borderRadius: 8, border: "1px solid #1f1f1f" }}>
              <p style={{ color: "#888", fontSize: 12, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFC800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                Your full name, email, phone number, and date of birth cannot be changed. Contact support if you need to update these details.
              </p>
            </div>
          </div>
        )}

        {/* Change Password Section */}
        {profileSection === "password" && (
          <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 24 }}>
            <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: "0 0 4px" }}>Change Password</h3>
            <p style={{ color: "#666", fontSize: 13, margin: "0 0 24px" }}>Update your password to keep your account secure</p>
            <div style={{ maxWidth: 400, display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Current Password</label>
                <div style={{ position: "relative" }}>
                  <input type={showCurrentPwd ? "text" : "password"} placeholder="Enter current password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", paddingRight: 44, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  <button type="button" onClick={() => setShowCurrentPwd(!showCurrentPwd)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                    {showCurrentPwd ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>New Password</label>
                <div style={{ position: "relative" }}>
                  <input type={showNewPwd ? "text" : "password"} placeholder="Enter new password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", paddingRight: 44, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  <button type="button" onClick={() => setShowNewPwd(!showNewPwd)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                    {showNewPwd ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Confirm New Password</label>
                <div style={{ position: "relative" }}>
                  <input type={showConfirmPwd ? "text" : "password"} placeholder="Confirm new password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", paddingRight: 44, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                    {showConfirmPwd ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                  </button>
                </div>
              </div>
              <button onClick={handleChangePassword} disabled={passwordChanging} style={{ background: "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: "#000", border: "none", padding: "14px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: passwordChanging ? "wait" : "pointer", marginTop: 8, opacity: passwordChanging ? 0.6 : 1 }}>{passwordChanging ? "Updating..." : "Update Password"}</button>
            </div>
            <div style={{ marginTop: 24, padding: 16, background: "#0a0a0a", borderRadius: 8, border: "1px solid #1f1f1f" }}>
              <p style={{ color: "#888", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                <strong style={{ color: "#fff" }}>Password requirements:</strong><br />
                • At least 8 characters long<br />
                • Contains uppercase and lowercase letters<br />
                • Contains at least one number<br />
                • Contains at least one special character
              </p>
            </div>
          </div>
        )}

        {/* Privacy Control Section */}
        {profileSection === "privacy" && (
          <div>
            {/* Profile Privacy - Main Section */}
            <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 24, marginBottom: 20 }}>
              <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: "0 0 4px" }}>Profile Privacy</h3>
              <p style={{ color: "#666", fontSize: 13, margin: "0 0 20px" }}>Control who can follow you and see your content</p>
              
              {/* Private Profile Toggle */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, background: "#0a0a0a", borderRadius: 8, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: isPrivateProfile ? "rgba(6,255,137,0.1)" : "rgba(102,102,102,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {isPrivateProfile ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    )}
                  </div>
                  <div>
                    <p style={{ color: "#fff", fontSize: 14, fontWeight: 500, margin: 0 }}>Private Profile</p>
                    <p style={{ color: "#666", fontSize: 12, margin: "4px 0 0" }}>
                      {isPrivateProfile ? "Only followers can see your content" : "Anyone can see your profile and follow you"}
                    </p>
                  </div>
                </div>
                <button onClick={handleTogglePrivacy} style={{ width: 48, height: 26, borderRadius: 13, background: isPrivateProfile ? "#06FF89" : "#333", border: "none", cursor: "pointer", position: "relative", transition: "all 0.2s" }}>
                  <span style={{ position: "absolute", top: 3, left: isPrivateProfile ? 25 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "all 0.2s" }} />
                </button>
              </div>

              {/* Follow Requests - Only show when private */}
              {isPrivateProfile && pendingFollowRequests > 0 && (
                <button 
                  onClick={() => { setShowFollowRequestsModal(true); loadFollowRequests(); }}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, background: "rgba(251,191,36,0.1)", borderRadius: 8, border: "1px solid rgba(251,191,36,0.2)", cursor: "pointer" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(251,191,36,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <p style={{ color: "#fbbf24", fontSize: 14, fontWeight: 500, margin: 0 }}>Follow Requests</p>
                      <p style={{ color: "#888", fontSize: 12, margin: "4px 0 0" }}>{pendingFollowRequests} pending request{pendingFollowRequests > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              )}
            </div>

            {/* Other Privacy Settings */}
            <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 24 }}>
              <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: "0 0 4px" }}>Visibility Settings</h3>
              <p style={{ color: "#666", fontSize: 13, margin: "0 0 20px" }}>Control what others can see</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { key: "showActivity", label: "Show Activity Status", desc: "Let others see when you're active", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
                  { key: "allowTagging", label: "Allow Tagging", desc: "Let others tag you in transactions", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> },
                  { key: "showOnlineStatus", label: "Show Online Status", desc: "Display when you're online", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg> },
                ].map((item) => (
                  <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, background: "#0a0a0a", borderRadius: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(6,255,137,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {item.icon}
                      </div>
                      <div>
                        <p style={{ color: "#fff", fontSize: 14, fontWeight: 500, margin: 0 }}>{item.label}</p>
                        <p style={{ color: "#666", fontSize: 12, margin: "4px 0 0" }}>{item.desc}</p>
                      </div>
                    </div>
                    <button onClick={() => setPrivacySettings({ ...privacySettings, [item.key]: !privacySettings[item.key as keyof typeof privacySettings] })} style={{ width: 48, height: 26, borderRadius: 13, background: privacySettings[item.key as keyof typeof privacySettings] ? "#06FF89" : "#333", border: "none", cursor: "pointer", position: "relative", transition: "all 0.2s" }}>
                      <span style={{ position: "absolute", top: 3, left: privacySettings[item.key as keyof typeof privacySettings] ? 25 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "all 0.2s" }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Info Card */}
            <div style={{ marginTop: 20, padding: 16, background: "rgba(6,255,137,0.05)", borderRadius: 12, border: "1px solid rgba(6,255,137,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span style={{ color: "#06FF89", fontSize: 14, fontWeight: 600 }}>Your Privacy Matters</span>
              </div>
              <p style={{ color: "#888", fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                We take your privacy seriously. Your data is encrypted and never shared without your consent. You can control exactly who sees your profile and activity.
              </p>
            </div>
          </div>
        )}

        {/* Notification Settings Section */}
        {profileSection === "notifications" && (
          <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 24 }}>
            <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: "0 0 4px" }}>Notification Settings</h3>
            <p style={{ color: "#666", fontSize: 13, margin: "0 0 24px" }}>Choose what notifications you receive</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { key: "emailNotifications", label: "Email Notifications", desc: "Receive updates via email" },
                { key: "pushNotifications", label: "Push Notifications", desc: "Receive push notifications on your device" },
                { key: "smsNotifications", label: "SMS Notifications", desc: "Receive updates via text message" },
                { key: "transactionAlerts", label: "Transaction Alerts", desc: "Get notified for every transaction" },
                { key: "securityAlerts", label: "Security Alerts", desc: "Important security notifications" },
                { key: "weeklyReport", label: "Weekly Report", desc: "Receive weekly spending summary" },
                { key: "marketingEmails", label: "Marketing Emails", desc: "Promotions and offers" },
              ].map((item) => (
                <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, background: "#0a0a0a", borderRadius: 8 }}>
                  <div>
                    <p style={{ color: "#fff", fontSize: 14, fontWeight: 500, margin: 0 }}>{item.label}</p>
                    <p style={{ color: "#666", fontSize: 12, margin: "4px 0 0" }}>{item.desc}</p>
                  </div>
                  <button onClick={() => setNotificationSettings({ ...notificationSettings, [item.key]: !notificationSettings[item.key as keyof typeof notificationSettings] })} style={{ width: 48, height: 26, borderRadius: 13, background: notificationSettings[item.key as keyof typeof notificationSettings] ? "#06FF89" : "#333", border: "none", cursor: "pointer", position: "relative", transition: "all 0.2s" }}>
                    <span style={{ position: "absolute", top: 3, left: notificationSettings[item.key as keyof typeof notificationSettings] ? 25 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "all 0.2s" }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div style={{ marginTop: 24, background: "#1a0a0a", borderRadius: 12, border: "1px solid #3a1a1a", padding: 24 }}>
          <h3 style={{ color: "#ff4444", fontSize: 16, fontWeight: 600, margin: "0 0 8px", display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Danger Zone
          </h3>
          <p style={{ color: "#888", fontSize: 13, margin: "0 0 16px" }}>Irreversible and destructive actions</p>
          <button onClick={() => { if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) { alert("Account deletion request submitted. You will receive a confirmation email."); } }} style={{ background: "transparent", color: "#ff4444", border: "1px solid #ff4444", padding: "10px 20px", borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Delete Account</button>
        </div>
      </div>

      {/* Photo Upload Modal */}
      {showPhotoUploadModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowPhotoUploadModal(false)}>
          <div style={{ background: "#0a0a0a", borderRadius: 16, width: "min(400px, 90vw)", padding: 24 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: 0 }}>
                {photoUploadType === 'profile' ? 'Update Profile Picture' : 'Update Cover Photo'}
              </h3>
              <button onClick={() => setShowPhotoUploadModal(false)} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", padding: 4 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <p style={{ color: "#888", fontSize: 13, margin: "0 0 20px" }}>
              {photoUploadType === 'profile' 
                ? 'Choose a square image for best results. Recommended size: 400x400 pixels.'
                : 'Choose a wide image for best results. Recommended size: 1200x400 pixels.'}
            </p>
            <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, background: "#141414", borderRadius: 12, border: "2px dashed #333", cursor: "pointer", transition: "all 0.2s" }}>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} disabled={uploadingPhoto} />
              {uploadingPhoto ? (
                <>
                  <div style={{ width: 40, height: 40, border: "3px solid #1f1f1f", borderTopColor: "#06FF89", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: 12 }} />
                  <span style={{ color: "#888", fontSize: 14 }}>Uploading...</span>
                </>
              ) : (
                <>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2" style={{ marginBottom: 12 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <span style={{ color: "#fff", fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Click to upload</span>
                  <span style={{ color: "#666", fontSize: 12 }}>PNG, JPG up to 5MB</span>
                </>
              )}
            </label>
          </div>
        </div>
      )}

      {/* Followers/Following Modal */}
      {showFollowersModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowFollowersModal(false)}>
          <div style={{ background: "#0a0a0a", borderRadius: 16, width: "min(450px, 90vw)", maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #1f1f1f" }}>
              <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: 0 }}>
                {followersModalType === 'followers' ? 'Followers' : 'Following'}
              </h3>
              <button onClick={() => setShowFollowersModal(false)} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", padding: 4 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
              {followersLoading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
                  <div style={{ width: 32, height: 32, border: "3px solid #1f1f1f", borderTopColor: "#06FF89", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                </div>
              ) : followersList.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40 }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5" style={{ marginBottom: 16 }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <p style={{ color: "#888", fontSize: 14, margin: 0 }}>
                    {followersModalType === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {followersList.map((person: any, index: number) => (
                    <div key={person.user_id || index} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "#141414", borderRadius: 10 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", background: "#1f1f1f", flexShrink: 0 }}>
                        {person.ppic ? (
                          <img src={normalizeImageUrl(person.ppic) || ''} alt={person.user_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", background: "#06FF89", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 600, color: "#000" }}>
                            {(person.first_name?.[0] || person.user_name?.[0] || '?').toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: "#fff", fontSize: 14, fontWeight: 500, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {person.first_name && person.last_name ? `${person.first_name} ${person.last_name}` : person.user_name}
                        </p>
                        <p style={{ color: "#666", fontSize: 12, margin: "2px 0 0" }}>@{person.user_name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Follow Requests Modal */}
      {showFollowRequestsModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowFollowRequestsModal(false)}>
          <div style={{ background: "#0a0a0a", borderRadius: 16, width: "min(450px, 90vw)", maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #1f1f1f" }}>
              <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: 0 }}>Follow Requests</h3>
              <button onClick={() => setShowFollowRequestsModal(false)} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", padding: 4 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
              {followRequestsLoading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
                  <div style={{ width: 32, height: 32, border: "3px solid #1f1f1f", borderTopColor: "#06FF89", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                </div>
              ) : followRequestsList.length === 0 ? (
                <div style={{ textAlign: "center", padding: 40 }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="1.5" style={{ marginBottom: 16 }}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                  <p style={{ color: "#888", fontSize: 14, margin: 0 }}>No pending follow requests</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {followRequestsList.map((request: any, index: number) => (
                    <div key={request.user_id || index} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "#141414", borderRadius: 10 }}>
                      <div style={{ width: 48, height: 48, borderRadius: "50%", overflow: "hidden", background: "#1f1f1f", flexShrink: 0 }}>
                        {request.ppic ? (
                          <img src={normalizeImageUrl(request.ppic) || ''} alt={request.user_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", background: "#06FF89", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 600, color: "#000" }}>
                            {(request.first_name?.[0] || request.user_name?.[0] || '?').toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: "#fff", fontSize: 14, fontWeight: 500, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {request.first_name && request.last_name ? `${request.first_name} ${request.last_name}` : request.user_name}
                        </p>
                        <p style={{ color: "#666", fontSize: 12, margin: "2px 0 0" }}>@{request.user_name}</p>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button 
                          onClick={() => handleAcceptFollowRequest(request.user_id)}
                          style={{ background: "#06FF89", color: "#000", border: "none", padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleRejectFollowRequest(request.user_id)}
                          style={{ background: "transparent", color: "#888", border: "1px solid #333", padding: "8px 16px", borderRadius: 6, fontSize: 13, cursor: "pointer" }}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSettingsTab = () => (
    <div style={{ maxWidth: 800 }}>
      {/* Language Section */}
      <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 24, marginBottom: 20 }}>
        <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: "0 0 4px", display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          Language & Region
        </h3>
        <p style={{ color: "#666", fontSize: 13, margin: "0 0 20px" }}>Choose your preferred language and currency</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Language</label>
            <select value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)} style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", cursor: "pointer" }}>
              <option value="en">🇺🇸 English (US)</option>
              <option value="en-gb">🇬🇧 English (UK)</option>
              <option value="es">🇪🇸 Español</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="de">🇩🇪 Deutsch</option>
              <option value="pt">🇵🇹 Português</option>
              <option value="zh">🇨🇳 中文</option>
              <option value="ja">🇯🇵 日本語</option>
              <option value="ar">🇸🇦 العربية</option>
            </select>
          </div>
          <div>
            <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Currency</label>
            <div style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#666", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span>🇺🇸 USD - US Dollar</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <p style={{ color: "#555", fontSize: 11, margin: "6px 0 0" }}>Default currency cannot be changed</p>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication Section */}
      <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 24, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: "0 0 4px", display: "flex", alignItems: "center", gap: 10 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Two-Factor Authentication
            </h3>
            <p style={{ color: "#666", fontSize: 13, margin: 0 }}>Add an extra layer of security to your account</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {twoFactorEnabled && <span style={{ background: "rgba(6,255,137,0.1)", color: "#06FF89", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 4 }}>ENABLED</span>}
            <button onClick={() => twoFactorEnabled ? setTwoFactorEnabled(false) : setShow2FASetup(true)} style={{ width: 48, height: 26, borderRadius: 13, background: twoFactorEnabled ? "#06FF89" : "#333", border: "none", cursor: "pointer", position: "relative", transition: "all 0.2s" }}>
              <span style={{ position: "absolute", top: 3, left: twoFactorEnabled ? 25 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "all 0.2s" }} />
            </button>
          </div>
        </div>

        {show2FASetup && !twoFactorEnabled && (
          <div style={{ background: "#0a0a0a", borderRadius: 8, padding: 20, border: "1px solid #1f1f1f" }}>
            <div style={{ display: "flex", gap: 24 }}>
              <div style={{ width: 160, height: 160, background: "#fff", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <div style={{ width: 140, height: 140, background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23000' x='10' y='10' width='10' height='10'/%3E%3Crect fill='%23000' x='20' y='10' width='10' height='10'/%3E%3Crect fill='%23000' x='30' y='10' width='10' height='10'/%3E%3Crect fill='%23000' x='40' y='10' width='10' height='10'/%3E%3Crect fill='%23000' x='50' y='10' width='10' height='10'/%3E%3Crect fill='%23000' x='60' y='10' width='10' height='10'/%3E%3Crect fill='%23000' x='70' y='10' width='10' height='10'/%3E%3Crect fill='%23000' x='10' y='20' width='10' height='10'/%3E%3Crect fill='%23000' x='70' y='20' width='10' height='10'/%3E%3Crect fill='%23000' x='10' y='30' width='10' height='10'/%3E%3Crect fill='%23000' x='30' y='30' width='10' height='10'/%3E%3Crect fill='%23000' x='50' y='30' width='10' height='10'/%3E%3Crect fill='%23000' x='70' y='30' width='10' height='10'/%3E%3Crect fill='%23000' x='10' y='40' width='10' height='10'/%3E%3Crect fill='%23000' x='30' y='40' width='10' height='10'/%3E%3Crect fill='%23000' x='50' y='40' width='10' height='10'/%3E%3Crect fill='%23000' x='70' y='40' width='10' height='10'/%3E%3Crect fill='%23000' x='10' y='50' width='10' height='10'/%3E%3Crect fill='%23000' x='30' y='50' width='10' height='10'/%3E%3Crect fill='%23000' x='50' y='50' width='10' height='10'/%3E%3Crect fill='%23000' x='70' y='50' width='10' height='10'/%3E%3Crect fill='%23000' x='10' y='60' width='10' height='10'/%3E%3Crect fill='%23000' x='70' y='60' width='10' height='10'/%3E%3Crect fill='%23000' x='10' y='70' width='10' height='10'/%3E%3Crect fill='%23000' x='20' y='70' width='10' height='10'/%3E%3Crect fill='%23000' x='30' y='70' width='10' height='10'/%3E%3Crect fill='%23000' x='40' y='70' width='10' height='10'/%3E%3Crect fill='%23000' x='50' y='70' width='10' height='10'/%3E%3Crect fill='%23000' x='60' y='70' width='10' height='10'/%3E%3Crect fill='%23000' x='70' y='70' width='10' height='10'/%3E%3C/svg%3E")`, backgroundSize: "contain" }} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: "0 0 8px" }}>Scan QR Code</h4>
                <p style={{ color: "#888", fontSize: 13, margin: "0 0 16px", lineHeight: 1.5 }}>Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.) or enter the code manually:</p>
                <div style={{ background: "#141414", borderRadius: 6, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <code style={{ color: "#06FF89", fontSize: 13, letterSpacing: 1 }}>JBSWY3DPEHPK3PXP</code>
                  <button onClick={() => { navigator.clipboard.writeText("JBSWY3DPEHPK3PXP"); alert("Code copied!"); }} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", padding: 4 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </button>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <input type="text" placeholder="Enter 6-digit code" value={twoFactorCode} onChange={(e) => setTwoFactorCode(e.target.value)} maxLength={6} style={{ flex: 1, background: "#141414", borderRadius: 6, border: "1px solid #333", padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none", letterSpacing: 4, textAlign: "center" }} />
                  <button onClick={() => { if (twoFactorCode.length === 6) { setTwoFactorEnabled(true); setShow2FASetup(false); setTwoFactorCode(""); alert("2FA enabled successfully!"); } else { alert("Please enter a valid 6-digit code"); } }} style={{ background: "#06FF89", color: "#000", border: "none", padding: "10px 20px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Verify & Enable</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {twoFactorEnabled && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, background: "rgba(6,255,137,0.05)", borderRadius: 8, border: "1px solid rgba(6,255,137,0.2)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#06FF89"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            <div>
              <p style={{ color: "#fff", fontSize: 14, fontWeight: 500, margin: 0 }}>Two-factor authentication is active</p>
              <p style={{ color: "#888", fontSize: 12, margin: "2px 0 0" }}>Your account is protected with an authenticator app</p>
            </div>
          </div>
        )}
      </div>

      {/* Connected Devices Section */}
      <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 24 }}>
        <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: "0 0 4px", display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          Connected Devices
        </h3>
        <p style={{ color: "#666", fontSize: 13, margin: "0 0 20px" }}>Manage devices that have access to your account</p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {connectedDevices.map((device) => (
            <div key={device.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, background: "#0a0a0a", borderRadius: 8, border: device.current ? "1px solid rgba(6,255,137,0.3)" : "1px solid #1f1f1f" }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{device.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <p style={{ color: "#fff", fontSize: 14, fontWeight: 500, margin: 0 }}>{device.name}</p>
                  {device.current && <span style={{ background: "#06FF89", color: "#000", fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4 }}>This device</span>}
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                  <span style={{ color: "#666", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    {device.location}
                  </span>
                  <span style={{ color: device.lastActive === "Active now" ? "#06FF89" : "#666", fontSize: 12 }}>{device.lastActive}</span>
                </div>
              </div>
              {!device.current && (
                <button onClick={() => { if (confirm(`Remove "${device.name}" from your account?`)) alert("Device removed successfully."); }} style={{ background: "transparent", color: "#ff4444", border: "1px solid rgba(255,68,68,0.3)", padding: "8px 16px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Remove</button>
              )}
            </div>
          ))}
        </div>

        <button style={{ width: "100%", marginTop: 16, background: "transparent", color: "#ff4444", border: "1px solid rgba(255,68,68,0.3)", padding: "12px 20px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }} onClick={() => { if (confirm("This will log you out from all other devices. Continue?")) alert("All other devices have been logged out."); }}>
          Log Out All Other Devices
        </button>
      </div>
    </div>
  );

  const faqData = [
    { question: "How do I add money to my account?", answer: "You can add money to your VaultPay account by clicking the 'Top Up' button and choosing from Crypto, Credit/Debit Card, Gift Card, Web3 Wallet, or Bank Transfer. Each method has different processing times and fees.", category: "Account", helpful: 45 },
    { question: "What are the fees for transfers?", answer: "VaultPay offers free transfers between VaultPay users. External bank transfers may incur a small fee depending on your account type and transfer amount. Premium members enjoy reduced fees on all transactions.", category: "Transfers", helpful: 32 },
    { question: "How do I dispute a transaction?", answer: "To dispute a transaction, go to your transaction history, find the transaction in question, and click 'Report Issue'. You can also create a support ticket with details about the disputed transaction. Our team will investigate within 24-48 hours.", category: "Transaction", helpful: 28 },
    { question: "Is my money safe?", answer: "Yes, your funds are protected. VaultPay uses bank-level 256-bit encryption and partners with FDIC-insured banks. We also offer two-factor authentication for added security. Your funds are held in segregated accounts.", category: "Security", helpful: 67 },
    { question: "How do I enable two-factor authentication?", answer: "Go to Settings > Two-Factor Authentication and toggle it on. You'll need an authenticator app like Google Authenticator or Authy to scan the QR code and complete setup. This adds an extra layer of security to your account.", category: "Security", helpful: 41 },
  ];

  const filteredFaqs = faqData.filter(faq => 
    faq.question.toLowerCase().includes(faqSearch.toLowerCase()) || 
    faq.category.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const renderHelpTab = () => {
    const faqCategories = ["All", "Account", "Transfers", "Transaction", "Security"];
    
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'high': return '#ef4444';
        case 'medium': return '#fbbf24';
        case 'low': return '#22c55e';
        default: return '#666';
      }
    };

    const getStatusIcon = (status: string) => {
      if (status === 'resolved' || status === 'closed') {
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>;
      }
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
    };

    const handleViewTicketDetails = async (ticket: SupportTicket) => {
      setSelectedTicket(ticket);
      if (user) {
        try {
          const ticketId = parseInt(ticket.ticket_id || ticket.id);
          const res = await getTicketDetails(user.user_id, user.login_code, ticketId);
          if (res.status && res.data?.replies) {
            setTicketReplies(res.data.replies);
          }
        } catch (error) {
          console.error('Error loading ticket details:', error);
        }
      }
    };

    return (
    <div>
      {/* Search Bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ position: "relative" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input 
            type="text" 
            placeholder="Search for help..." 
            value={faqSearch} 
            onChange={(e) => setFaqSearch(e.target.value)} 
            style={{ width: "100%", background: "#141414", borderRadius: 12, border: "1px solid rgba(102,102,102,0.3)", padding: "14px 16px 14px 48px", color: "#fff", fontSize: 16, outline: "none", boxSizing: "border-box" }} 
          />
        </div>
      </div>

      {/* Category Chips */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 16, marginBottom: 16 }} className="hide-scrollbar">
        {faqCategories.map((category) => (
          <button 
            key={category} 
            onClick={() => setSelectedFaqCategory(category)}
            style={{ 
              padding: "10px 20px", 
              borderRadius: 20, 
              background: selectedFaqCategory === category ? "#06FF89" : "#141414", 
              border: selectedFaqCategory === category ? "none" : "1px solid rgba(102,102,102,0.3)",
              color: selectedFaqCategory === category ? "#000" : "#fff", 
              fontSize: 14, 
              fontWeight: 600, 
              cursor: "pointer",
              whiteSpace: "nowrap",
              minWidth: 80,
              textAlign: "center"
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* My Tickets Section */}
      <div style={{ background: "#141414", borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: 0 }}>My Tickets</h3>
          <button 
            onClick={() => setShowAllTickets(true)}
            style={{ display: "flex", alignItems: "center", gap: 4, background: "transparent", border: "none", color: "#06FF89", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            View All
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
        
        {ticketsLoading ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <div style={{ width: 24, height: 24, border: "2px solid #1f1f1f", borderTopColor: "#06FF89", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <span style={{ color: "#666", fontSize: 14, marginLeft: 12 }}>Loading tickets...</span>
          </div>
        ) : supportTickets.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {supportTickets.slice(0, 3).map((ticket) => (
              <div 
                key={ticket.id} 
                onClick={() => handleViewTicketDetails(ticket)}
                style={{ 
                  background: "#0a0a0a", 
                  borderRadius: 12, 
                  padding: 12, 
                  border: "1px solid rgba(102,102,102,0.2)",
                  cursor: "pointer",
                  transition: "border-color 0.2s"
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ marginRight: 12, marginTop: 2 }}>{getStatusIcon(ticket.status)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{ticket.subject}</div>
                    <div style={{ color: "#666", fontSize: 12 }}>{ticket.category || 'General'}</div>
                  </div>
                  <div style={{ 
                    background: getPriorityColor(ticket.priority), 
                    padding: "2px 6px", 
                    borderRadius: 4 
                  }}>
                    <span style={{ color: "#fff", fontSize: 10, fontWeight: 600 }}>{ticket.priority?.toUpperCase()}</span>
                  </div>
                </div>
                <div style={{ color: "#666", fontSize: 12, textAlign: "right" }}>
                  {new Date(ticket.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: 24 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" style={{ margin: "0 auto 12px" }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <div style={{ color: "#fff", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>No open tickets</div>
            <div style={{ color: "#666", fontSize: 14 }}>Create a ticket to get started</div>
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div style={{ marginBottom: 24 }}>
        {filteredFaqs.filter(faq => selectedFaqCategory === "All" || faq.category === selectedFaqCategory).map((faq, index) => (
          <div 
            key={index} 
            onClick={() => setSelectedFaq(selectedFaq?.question === faq.question ? null : faq)}
            style={{ 
              background: "#141414", 
              borderRadius: 16, 
              padding: 16, 
              marginBottom: 12, 
              border: "1px solid rgba(102,102,102,0.2)",
              cursor: "pointer"
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: "rgba(6,255,137,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 12, flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: "#06FF89", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{faq.category}</div>
                <div style={{ color: "#fff", fontSize: 16, fontWeight: 600, lineHeight: 1.4 }}>{faq.question}</div>
                {selectedFaq?.question === faq.question && (
                  <div style={{ color: "#888", fontSize: 14, lineHeight: 1.5, marginTop: 12 }}>{faq.answer}</div>
                )}
              </div>
              <svg 
                width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" 
                style={{ marginLeft: 8, transform: selectedFaq?.question === faq.question ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
              >
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Still Need Help Section */}
      <div style={{ borderTop: "1px solid rgba(102,102,102,0.3)", paddingTop: 24 }}>
        <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Still need help?</h3>
        <p style={{ color: "#666", fontSize: 14, textAlign: "center", marginBottom: 24 }}>Contact our support team for personalized assistance</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          {/* Create Ticket Card */}
          <button 
            onClick={async () => { await checkTicketLimit(); setShowNewTicket(true); }}
            style={{ 
              background: "#141414", 
              borderRadius: 16, 
              padding: 16, 
              border: "1px solid rgba(102,102,102,0.2)",
              cursor: "pointer",
              textAlign: "center"
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 24, background: "rgba(6,255,137,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Support Tickets</div>
            <div style={{ color: "#666", fontSize: 12 }}>{ticketLimitReached ? 'Limit reached' : 'Create a ticket'}</div>
          </button>

          {/* My Tickets Card */}
          <button 
            onClick={() => setHelpSubTab("tickets")}
            style={{ 
              background: "#141414", 
              borderRadius: 16, 
              padding: 16, 
              border: "1px solid rgba(102,102,102,0.2)",
              cursor: "pointer",
              textAlign: "center"
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 24, background: "rgba(6,255,137,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>My Tickets</div>
            <div style={{ color: "#666", fontSize: 12 }}>{ticketCounts?.open || 0} open</div>
          </button>
        </div>

        {/* Email Support Card */}
        <button 
          onClick={() => window.open('mailto:support@getvaultpay.co', '_blank')}
          style={{ 
            width: "100%",
            background: "#141414", 
            borderRadius: 16, 
            padding: 16, 
            border: "1px solid rgba(102,102,102,0.2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center"
          }}
        >
          <div style={{ width: 48, height: 48, borderRadius: 24, background: "rgba(6,255,137,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <div style={{ flex: 1, textAlign: "left" }}>
            <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>Email Support</div>
            <div style={{ color: "#666", fontSize: 12 }}>support@getvaultpay.co</div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      {/* Create Ticket Modal */}
      {showNewTicket && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowNewTicket(false)}>
          <div style={{ background: "#0a0a0a", borderRadius: 20, width: "min(500px, 90vw)", maxHeight: "90vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid rgba(102,102,102,0.3)" }}>
              <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 700, margin: 0 }}>Create Support Ticket</h3>
              <button onClick={() => setShowNewTicket(false)} style={{ width: 40, height: 40, borderRadius: 20, background: "#141414", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div style={{ padding: 20 }}>
              {ticketLimitReached ? (
                /* Ticket Limit Reached View */
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 80, height: 80, borderRadius: 40, background: "rgba(251,191,36,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <h4 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Weekly Ticket Limit Reached</h4>
                  <p style={{ color: "#666", fontSize: 15, lineHeight: 1.5, marginBottom: 24 }}>
                    You've reached your limit of {WEEKLY_TICKET_LIMIT} support tickets this week. This helps us provide quality support to all users.
                  </p>
                  
                  {/* Email Alternative */}
                  <div style={{ background: "#141414", borderRadius: 12, padding: 16, marginBottom: 20, display: "flex", alignItems: "center", border: "1px solid rgba(6,255,137,0.3)" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2" style={{ marginRight: 12 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <div style={{ flex: 1, textAlign: "left" }}>
                      <div style={{ color: "#666", fontSize: 13, marginBottom: 4 }}>Contact us by email:</div>
                      <a href="mailto:support@getvaultpay.co" style={{ color: "#06FF89", fontSize: 16, fontWeight: 600, textDecoration: "none" }}>support@getvaultpay.co</a>
                    </div>
                  </div>

                  {/* Pro Plan Card */}
                  <div style={{ background: "#141414", borderRadius: 16, padding: 20, border: "1px solid rgba(6,255,137,0.4)", marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                      <span style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>Want Priority Support?</span>
                    </div>
                    <p style={{ color: "#666", fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>
                      Upgrade to Pro Plan for unlimited tickets, priority responses, and dedicated support.
                    </p>
                    <div style={{ display: "flex", alignItems: "baseline", marginBottom: 16 }}>
                      <span style={{ color: "#06FF89", fontSize: 32, fontWeight: 700 }}>$5</span>
                      <span style={{ color: "#666", fontSize: 16, marginLeft: 4 }}>/month</span>
                    </div>
                    <button 
                      onClick={() => window.open('mailto:support@getvaultpay.co?subject=Pro%20Plan%20Inquiry', '_blank')}
                      style={{ width: "100%", background: "#06FF89", color: "#000", border: "none", padding: "14px", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                      Go Pro
                    </button>
                  </div>

                  <p style={{ color: "#666", fontSize: 13 }}>Tickets used this week: {weeklyTicketCount}/{WEEKLY_TICKET_LIMIT}</p>
                </div>
              ) : (
                /* Create Ticket Form */
                <div>
                  <h4 style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Ticket Information</h4>
                  
                  {/* Subject */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ color: "#fff", fontSize: 16, fontWeight: 500, display: "block", marginBottom: 8 }}>Subject *</label>
                    <input 
                      type="text" 
                      placeholder="Brief description of your issue" 
                      value={newTicketForm.subject} 
                      onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                      style={{ width: "100%", background: "#141414", borderRadius: 8, border: "1px solid rgba(102,102,102,0.3)", padding: "12px 16px", color: "#fff", fontSize: 16, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  {/* Category */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ color: "#fff", fontSize: 16, fontWeight: 500, display: "block", marginBottom: 8 }}>Category *</label>
                    <select 
                      value={newTicketForm.category_id} 
                      onChange={(e) => setNewTicketForm({ ...newTicketForm, category_id: parseInt(e.target.value) })}
                      style={{ width: "100%", background: "#141414", borderRadius: 8, border: "1px solid rgba(102,102,102,0.3)", padding: "12px 16px", color: "#fff", fontSize: 16, outline: "none", boxSizing: "border-box", cursor: "pointer" }}
                    >
                      <option value={0}>Select a category</option>
                      {ticketCategories.map((cat) => (
                        <option key={cat.categoryId} value={cat.categoryId}>{cat.categoryName}</option>
                      ))}
                    </select>
                  </div>

                  {/* Priority */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ color: "#fff", fontSize: 16, fontWeight: 500, display: "block", marginBottom: 8 }}>Priority</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {(['low', 'medium', 'high'] as const).map((priority) => (
                        <button 
                          key={priority}
                          onClick={() => setNewTicketForm({ ...newTicketForm, priority })}
                          style={{ 
                            flex: 1, 
                            padding: "12px", 
                            borderRadius: 8, 
                            background: newTicketForm.priority === priority ? "#06FF89" : "#141414", 
                            border: newTicketForm.priority === priority ? "none" : "1px solid rgba(102,102,102,0.3)",
                            color: newTicketForm.priority === priority ? "#000" : "#fff", 
                            fontSize: 14, 
                            fontWeight: newTicketForm.priority === priority ? 600 : 500,
                            cursor: "pointer",
                            textTransform: "capitalize"
                          }}
                        >
                          {priority}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ color: "#fff", fontSize: 16, fontWeight: 500, display: "block", marginBottom: 8 }}>Message *</label>
                    <textarea 
                      placeholder="Describe your issue in detail" 
                      value={newTicketForm.message} 
                      onChange={(e) => setNewTicketForm({ ...newTicketForm, message: e.target.value })}
                      style={{ width: "100%", background: "#141414", borderRadius: 8, border: "1px solid rgba(102,102,102,0.3)", padding: "12px 16px", color: "#fff", fontSize: 16, outline: "none", boxSizing: "border-box", minHeight: 120, resize: "vertical" }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button 
                    onClick={handleCreateTicket}
                    disabled={!newTicketForm.subject || !newTicketForm.message || newTicketForm.category_id === 0}
                    style={{ 
                      width: "100%", 
                      background: newTicketForm.subject && newTicketForm.message && newTicketForm.category_id !== 0 ? "#06FF89" : "rgba(102,102,102,0.3)", 
                      color: "#000", 
                      border: "none", 
                      padding: "16px", 
                      borderRadius: 8, 
                      fontSize: 16, 
                      fontWeight: 600, 
                      cursor: newTicketForm.subject && newTicketForm.message && newTicketForm.category_id !== 0 ? "pointer" : "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Submit Ticket
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* View All Tickets Modal */}
      {showAllTickets && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowAllTickets(false)}>
          <div style={{ background: "#0a0a0a", borderRadius: 20, width: "min(600px, 95vw)", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column" }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid rgba(102,102,102,0.3)" }}>
              <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 600, margin: 0 }}>Support Tickets</h3>
              <button onClick={() => setShowAllTickets(false)} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", padding: 8 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: "flex", gap: 8, padding: "16px 20px", borderBottom: "1px solid rgba(102,102,102,0.2)" }}>
              {(['all', 'open', 'resolved'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setAllTicketsFilter(filter)}
                  style={{
                    flex: 1,
                    padding: "10px 16px",
                    background: allTicketsFilter === filter ? "#06FF89" : "rgba(102,102,102,0.2)",
                    color: allTicketsFilter === filter ? "#000" : "#888",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  {filter === 'open' && ticketCounts && <span style={{ marginLeft: 6, opacity: 0.7 }}>({ticketCounts.open})</span>}
                  {filter === 'resolved' && ticketCounts && <span style={{ marginLeft: 6, opacity: 0.7 }}>({ticketCounts.resolved})</span>}
                  {filter === 'all' && ticketCounts && <span style={{ marginLeft: 6, opacity: 0.7 }}>({ticketCounts.total})</span>}
                </button>
              ))}
            </div>

            {/* Tickets List */}
            <div style={{ flex: 1, overflow: "auto", padding: 20 }}>
              {(() => {
                const filteredTickets = supportTickets.filter(ticket => {
                  const ticketStatus = ticket.status || (ticket.resolved === '0' ? 'open' : 'resolved');
                  if (allTicketsFilter === 'all') return true;
                  return ticketStatus === allTicketsFilter;
                });

                if (filteredTickets.length === 0) {
                  return (
                    <div style={{ textAlign: "center", padding: 40 }}>
                      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(102,102,102,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      </div>
                      <h4 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: "0 0 8px" }}>No {allTicketsFilter === 'all' ? '' : allTicketsFilter} tickets</h4>
                      <p style={{ color: "#666", fontSize: 13, margin: 0 }}>
                        {allTicketsFilter === 'open' ? "You don't have any open tickets" : 
                         allTicketsFilter === 'resolved' ? "No resolved tickets yet" : 
                         "You haven't created any tickets yet"}
                      </p>
                    </div>
                  );
                }

                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {filteredTickets.map((ticket) => {
                      const ticketStatus = ticket.status || (ticket.resolved === '0' ? 'open' : 'resolved');
                      const isResolved = ticketStatus === 'resolved';
                      const formatDate = (dateStr: string) => {
                        const date = new Date(dateStr);
                        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                      };
                      return (
                        <div 
                          key={ticket.id} 
                          onClick={() => { setShowAllTickets(false); handleViewTicketDetails(ticket); }}
                          style={{ 
                            background: "#141414", 
                            borderRadius: 12, 
                            padding: 16, 
                            border: "1px solid rgba(102,102,102,0.2)",
                            cursor: "pointer",
                            transition: "border-color 0.2s"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              {isResolved ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                              ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                              )}
                              <span style={{ color: "#fff", fontSize: 15, fontWeight: 600 }}>{ticket.subject}</span>
                            </div>
                            <span style={{ 
                              background: isResolved ? "rgba(6,255,137,0.1)" : "rgba(251,191,36,0.1)", 
                              color: isResolved ? "#06FF89" : "#fbbf24", 
                              fontSize: 11, 
                              fontWeight: 600, 
                              padding: "4px 8px", 
                              borderRadius: 4, 
                              textTransform: "uppercase" 
                            }}>
                              {ticketStatus}
                            </span>
                          </div>
                          <p style={{ color: "#888", fontSize: 13, margin: "0 0 8px", overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as any }}>
                            {ticket.description || ticket.message}
                          </p>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ color: "#666", fontSize: 12 }}>{ticket.category_name || 'General'}</span>
                            <span style={{ color: "#666", fontSize: 12 }}>{formatDate(ticket.created_at || ticket.createdDtm || '')}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Footer with New Ticket Button */}
            <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(102,102,102,0.2)" }}>
              <button 
                onClick={() => { setShowAllTickets(false); setShowNewTicket(true); }}
                style={{ 
                  width: "100%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  gap: 8, 
                  background: "#06FF89", 
                  color: "#000", 
                  border: "none", 
                  padding: "14px", 
                  borderRadius: 12, 
                  fontSize: 15, 
                  fontWeight: 600, 
                  cursor: "pointer" 
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Create New Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => { setSelectedTicket(null); setTicketReplies([]); }}>
          <div style={{ background: "#0a0a0a", borderRadius: 20, width: "min(500px, 90vw)", maxHeight: "90vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid rgba(102,102,102,0.3)" }}>
              <button onClick={() => { setSelectedTicket(null); setTicketReplies([]); }} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", padding: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <div style={{ flex: 1 }}>
                <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: 0 }}>{selectedTicket.subject}</h3>
                <p style={{ color: "#666", fontSize: 12, margin: "4px 0 0" }}>#{selectedTicket.ticket_id}</p>
              </div>
              <span style={{ 
                background: (selectedTicket.status || (selectedTicket.resolved === '0' ? 'open' : 'resolved')) === "open" ? "rgba(6,255,137,0.1)" : (selectedTicket.status || (selectedTicket.resolved === '0' ? 'open' : 'resolved')) === "in_progress" ? "rgba(255,200,0,0.1)" : "rgba(102,102,102,0.1)", 
                color: (selectedTicket.status || (selectedTicket.resolved === '0' ? 'open' : 'resolved')) === "open" ? "#06FF89" : (selectedTicket.status || (selectedTicket.resolved === '0' ? 'open' : 'resolved')) === "in_progress" ? "#FFC800" : "#666", 
                fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 4, textTransform: "uppercase" 
              }}>
                {(selectedTicket.status || (selectedTicket.resolved === '0' ? 'open' : 'resolved')).replace("_", " ")}
              </span>
            </div>

            <div style={{ padding: 20 }}>
              {/* Original Message */}
              <div style={{ background: "#141414", borderRadius: 8, padding: 16, marginBottom: 16 }}>
                <p style={{ color: "#aaa", fontSize: 14, margin: 0, lineHeight: 1.6 }}>{selectedTicket.description}</p>
              </div>

              {/* Replies */}
              {ticketReplies.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  {ticketReplies.map((reply, index) => (
                    <div key={`reply-${reply.id || index}`} style={{ 
                      background: reply.isAdmin ? "rgba(6,255,137,0.1)" : "#141414", 
                      borderRadius: 8, 
                      padding: 12, 
                      marginBottom: 8,
                      borderLeft: reply.isAdmin ? "3px solid #06FF89" : "none"
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ color: reply.isAdmin ? "#06FF89" : "#fff", fontSize: 12, fontWeight: 600 }}>
                          {reply.isAdmin ? 'Support Team' : reply.user_name || 'You'}
                        </span>
                        <span style={{ color: "#666", fontSize: 11 }}>{new Date(reply.createdDtm).toLocaleString()}</span>
                      </div>
                      <p style={{ color: "#aaa", fontSize: 14, margin: 0 }}>{reply.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Input */}
              {(selectedTicket.status || (selectedTicket.resolved === '0' ? 'open' : 'resolved')) !== "closed" && (selectedTicket.status || (selectedTicket.resolved === '0' ? 'open' : 'resolved')) !== "resolved" && (
                <div style={{ display: "flex", gap: 12 }}>
                  <input 
                    type="text" 
                    placeholder="Type your reply..." 
                    value={ticketReply} 
                    onChange={(e) => setTicketReply(e.target.value)} 
                    style={{ flex: 1, background: "#141414", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none" }} 
                  />
                  <button onClick={handleReplyTicket} style={{ background: "#06FF89", color: "#000", border: "none", padding: "12px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Send</button>
                  <button onClick={() => handleCloseTicket(selectedTicket.ticket_id)} style={{ background: "transparent", color: "#ff4444", border: "1px solid rgba(255,68,68,0.3)", padding: "12px 20px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Close</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )};

  const renderPaymentsTab = () => (
    <div>
      <div style={{ display: "flex", gap: 0, marginBottom: 24, background: "#141414", borderRadius: 8, padding: 4 }}>
        {[
          { id: "send" as const, label: "Send", icon: "✈" },
          { id: "convert" as const, label: "Convert", icon: "⇄" },
          { id: "withdraw" as const, label: "Withdraw", icon: "↑" },
          { id: "transfer" as const, label: "Transfer", icon: "↔" },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setPaymentsSubTab(tab.id)} style={{ flex: 1, padding: "12px 24px", background: paymentsSubTab === tab.id ? "#06FF89" : "transparent", color: paymentsSubTab === tab.id ? "#000" : "#888", border: "none", borderRadius: 6, fontSize: 14, fontWeight: paymentsSubTab === tab.id ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ flex: 1 }}>
          {paymentsSubTab === "send" && (
            <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 24 }}>
              <h3 style={{ color: "#06FF89", fontSize: 16, fontWeight: 600, margin: "0 0 20px 0" }}>Send Payment</h3>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Amount</label>
                <div style={{ display: "flex", alignItems: "center", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px" }}>
                  <span style={{ color: "#06FF89", fontSize: 16, marginRight: 8 }}>$</span>
                  <input type="text" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} placeholder="0.00" style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 16, outline: "none" }} />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Recipient</label>
                <input type="text" value={sendRecipient} onChange={(e) => setSendRecipient(e.target.value)} placeholder="Enter email or phone number" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Note (optional)</label>
                <input type="text" value={sendNote} onChange={(e) => setSendNote(e.target.value)} placeholder="What's this for?" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <button onClick={handleSendPayment} disabled={recipientLoading} style={{ width: "100%", background: "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: "#000", border: "none", padding: "14px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {recipientLoading ? (
                  <><svg width="18" height="18" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round"/></svg> Looking up...</>
                ) : (
                  <><span>✈</span> Send Payment</>
                )}
              </button>
            </div>
          )}

          {paymentsSubTab === "convert" && (
            <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #06FF89, #B8FF9F)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                </div>
                <div>
                  <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: 0 }}>Convert Currency</h3>
                  <p style={{ color: "#666", fontSize: 12, margin: 0 }}>Exchange between your wallets at live rates</p>
                </div>
                {ratesLoading && <div style={{ marginLeft: "auto", color: "#06FF89", fontSize: 12 }}>Updating rates...</div>}
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>From</label>
                <div style={{ display: "flex", gap: 12 }}>
                  <select value={convertFromCurrency} onChange={(e) => setConvertFromCurrency(e.target.value)} style={{ width: 140, background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none" }}>
                    {walletCurrencies.map((bal) => (
                      <option key={bal.currency} value={bal.currency}>{bal.currency} - {CURRENCY_NAMES[bal.currency] || bal.currency}</option>
                    ))}
                  </select>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px" }}>
                    <span style={{ color: "#06FF89", fontSize: 16, marginRight: 8 }}>{CURRENCY_SYMBOLS[convertFromCurrency] || ""}</span>
                    <input type="text" value={convertAmount} onChange={(e) => setConvertAmount(e.target.value)} placeholder="0.00" style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 16, outline: "none" }} />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <span style={{ color: "#666", fontSize: 12 }}>Available: {CURRENCY_SYMBOLS[convertFromCurrency]}{walletCurrencies.find(b => b.currency === convertFromCurrency)?.balance.toFixed(2) || "0.00"}</span>
                  <button onClick={() => setConvertAmount(walletCurrencies.find(b => b.currency === convertFromCurrency)?.balance.toString() || "0")} style={{ background: "transparent", border: "none", color: "#06FF89", fontSize: 12, cursor: "pointer" }}>MAX</button>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "center", margin: "16px 0" }}>
                <button onClick={() => { const temp = convertFromCurrency; setConvertFromCurrency(convertToCurrency); setConvertToCurrency(temp); }} style={{ width: 40, height: 40, borderRadius: "50%", background: "#1a1a1a", border: "1px solid #333", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                </button>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>To</label>
                <div style={{ display: "flex", gap: 12 }}>
                  <select value={convertToCurrency} onChange={(e) => setConvertToCurrency(e.target.value)} style={{ width: 140, background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none" }}>
                    {walletCurrencies.filter(b => b.currency !== convertFromCurrency).map((bal) => (
                      <option key={bal.currency} value={bal.currency}>{bal.currency} - {CURRENCY_NAMES[bal.currency] || bal.currency}</option>
                    ))}
                  </select>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px" }}>
                    <span style={{ color: "#06FF89", fontSize: 16, marginRight: 8 }}>{CURRENCY_SYMBOLS[convertToCurrency] || ""}</span>
                    <input type="text" value={getConvertedAmount()} readOnly placeholder="0.00" style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 16, outline: "none" }} />
                  </div>
                </div>
                <div style={{ marginTop: 8 }}>
                  <span style={{ color: "#666", fontSize: 12 }}>Current balance: {CURRENCY_SYMBOLS[convertToCurrency]}{walletCurrencies.find(b => b.currency === convertToCurrency)?.balance.toFixed(2) || "0.00"}</span>
                </div>
              </div>

              <div style={{ background: "#0a0a0a", borderRadius: 8, padding: 16, marginBottom: 20, border: "1px solid #1f1f1f" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10 }}>
                  <span style={{ color: "#666" }}>Exchange Rate</span>
                  <span style={{ color: "#fff", fontWeight: 500 }}>1 {convertFromCurrency} = {liveRates[convertToCurrency]?.value?.toFixed(4) || "..."} {convertToCurrency}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10 }}>
                  <span style={{ color: "#666" }}>Fee</span>
                  <span style={{ color: "#06FF89", fontWeight: 500 }}>Free</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#666" }}>You will receive</span>
                  <span style={{ color: "#fff", fontWeight: 600 }}>{CURRENCY_SYMBOLS[convertToCurrency]}{getConvertedAmount()} {convertToCurrency}</span>
                </div>
              </div>

              <button onClick={handleConvert} disabled={convertLoading || !convertAmount || parseFloat(convertAmount) <= 0} style={{ width: "100%", background: convertLoading || !convertAmount || parseFloat(convertAmount) <= 0 ? "#333" : "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: convertLoading || !convertAmount || parseFloat(convertAmount) <= 0 ? "#666" : "#000", border: "none", padding: "14px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: convertLoading || !convertAmount || parseFloat(convertAmount) <= 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {convertLoading ? (
                  <><svg width="18" height="18" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round"/></svg> Converting...</>
                ) : (
                  <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg> Convert Now</>
                )}
              </button>
            </div>
          )}

          {paymentsSubTab === "withdraw" && (
            <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: "#F0B90B", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="#000"><path d="M12 2L6.5 7.5L8.5 9.5L12 6L15.5 9.5L17.5 7.5L12 2ZM2 12L4 10L6 12L4 14L2 12ZM6.5 16.5L12 22L17.5 16.5L15.5 14.5L12 18L8.5 14.5L6.5 16.5ZM18 12L20 10L22 12L20 14L18 12ZM12 10L10 12L12 14L14 12L12 10Z"/></svg>
                </div>
                <div>
                  <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: 0 }}>Binance Withdrawal</h3>
                  <p style={{ color: "#666", fontSize: 12, margin: 0 }}>Withdraw USDT to your Binance account</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                <div style={{ flex: 1, background: "#0a0a0a", borderRadius: 8, padding: 12, border: "1px solid #1f1f1f" }}>
                  <p style={{ color: "#666", fontSize: 11, margin: "0 0 4px 0", textTransform: "uppercase" }}>Network</p>
                  <p style={{ color: "#F0B90B", fontSize: 14, fontWeight: 600, margin: 0 }}>BNB Smart Chain (BEP20)</p>
                </div>
                <div style={{ flex: 1, background: "#0a0a0a", borderRadius: 8, padding: 12, border: "1px solid #1f1f1f" }}>
                  <p style={{ color: "#666", fontSize: 11, margin: "0 0 4px 0", textTransform: "uppercase" }}>Asset</p>
                  <p style={{ color: "#26A17B", fontSize: 14, fontWeight: 600, margin: 0 }}>USDT (Tether)</p>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Binance Email</label>
                <input type="email" value={binanceEmail} onChange={(e) => setBinanceEmail(e.target.value)} placeholder="Enter your Binance account email" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Amount (USDT)</label>
                <div style={{ display: "flex", alignItems: "center", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px" }}>
                  <span style={{ color: "#26A17B", fontSize: 16, marginRight: 8 }}>₮</span>
                  <input type="text" value={binanceAmount} onChange={(e) => setBinanceAmount(e.target.value)} placeholder="0.00" style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 16, outline: "none" }} />
                  <span style={{ color: "#666", fontSize: 12 }}>USDT</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                  <span style={{ color: "#666", fontSize: 12 }}>Available: ${walletCurrencies.find(w => w.currency === 'USD')?.balance.toFixed(2) || "0.00"}</span>
                  <span style={{ color: "#666", fontSize: 12 }}>{binanceMinLoading ? "Loading min..." : `Min: $${binanceMinWithdrawal.toFixed(2)}`}</span>
                </div>
              </div>

              <div style={{ background: "#0a0a0a", borderRadius: 8, padding: 16, marginBottom: 20, border: "1px solid #1f1f1f" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10 }}>
                  <span style={{ color: "#666" }}>Network Fee</span>
                  <span style={{ color: "#fff", fontWeight: 500 }}>$1.00 <span style={{ color: "#666", fontWeight: 400 }}>(Fixed)</span></span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10 }}>
                  <span style={{ color: "#666" }}>You will receive</span>
                  <span style={{ color: "#06FF89", fontWeight: 500 }}>${binanceAmount ? Math.max(0, parseFloat(binanceAmount) - 1).toFixed(2) : "0.00"} USDT</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#666" }}>Estimated arrival</span>
                  <span style={{ color: "#F0B90B", fontWeight: 500 }}>1-6 hours</span>
                </div>
              </div>

              <div style={{ background: "rgba(240,185,11,0.1)", borderRadius: 8, padding: 12, marginBottom: 20, border: "1px solid rgba(240,185,11,0.2)" }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#F0B90B" style={{ flexShrink: 0, marginTop: 2 }}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  <p style={{ color: "#F0B90B", fontSize: 12, margin: 0, lineHeight: 1.5 }}>Make sure you enter the correct Binance email. Funds sent to the wrong address cannot be recovered.</p>
                </div>
              </div>

              <button onClick={handleBinanceWithdraw} disabled={binanceLoading || !binanceEmail || !binanceAmount} style={{ width: "100%", background: binanceLoading || !binanceEmail || !binanceAmount ? "#333" : "linear-gradient(90deg, #F0B90B 0%, #F8D12F 100%)", color: binanceLoading || !binanceEmail || !binanceAmount ? "#666" : "#000", border: "none", padding: "14px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: binanceLoading || !binanceEmail || !binanceAmount ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {binanceLoading ? (
                  <><svg width="18" height="18" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round"/></svg> Processing...</>
                ) : (
                  <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg> Withdraw to Binance</>
                )}
              </button>
            </div>
          )}

          {paymentsSubTab === "transfer" && (
            <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 24 }}>
              {transferType === "select" ? (
                <>
                  <h3 style={{ color: "#06FF89", fontSize: 16, fontWeight: 600, margin: "0 0 20px 0" }}>Transfer Money</h3>
                  <p style={{ color: "#888", fontSize: 13, margin: "0 0 24px 0" }}>Choose your preferred transfer method</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <button onClick={() => setTransferType("bank")} style={{ display: "flex", alignItems: "center", gap: 16, padding: 20, background: "#0a0a0a", border: "1px solid #1f1f1f", borderRadius: 12, cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="8" y1="12" x2="8" y2="16"/><line x1="16" y1="12" x2="16" y2="16"/></svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: "#fff", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Bank Transfer</div>
                        <div style={{ color: "#666", fontSize: 12 }}>Transfer to local bank accounts • 1-2 business days</div>
                      </div>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                    <button onClick={() => setTransferType("sepa")} style={{ display: "flex", alignItems: "center", gap: 16, padding: 20, background: "#0a0a0a", border: "1px solid #1f1f1f", borderRadius: 12, cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: "#fff", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>SEPA Transfer</div>
                        <div style={{ color: "#666", fontSize: 12 }}>Euro transfers within Europe • Same day or next day</div>
                      </div>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                    <button onClick={() => setTransferType("international")} style={{ display: "flex", alignItems: "center", gap: 16, padding: 20, background: "#0a0a0a", border: "1px solid #1f1f1f", borderRadius: 12, cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #06FF89, #10b981)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: "#fff", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>International Transfer</div>
                        <div style={{ color: "#666", fontSize: 12 }}>Send money worldwide • 2-5 business days</div>
                      </div>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  </div>
                </>
              ) : transferType === "bank" ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                    <button onClick={() => setTransferType("select")} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"/><path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"/></svg>
                    </div>
                    <div>
                      <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: 0 }}>Bank Transfer</h3>
                      <p style={{ color: "#666", fontSize: 12, margin: 0 }}>Transfer to local bank accounts</p>
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Bank Name</label>
                    <input type="text" value={bankTransferForm.bankName} onChange={(e) => setBankTransferForm({...bankTransferForm, bankName: e.target.value})} placeholder="Enter bank name" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Account Number</label>
                    <input type="text" value={bankTransferForm.accountNumber} onChange={(e) => setBankTransferForm({...bankTransferForm, accountNumber: e.target.value})} placeholder="Enter account number" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Routing Number</label>
                    <input type="text" value={bankTransferForm.routingNumber} onChange={(e) => setBankTransferForm({...bankTransferForm, routingNumber: e.target.value})} placeholder="Enter routing number" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Account Holder Name</label>
                    <input type="text" value={bankTransferForm.accountHolder} onChange={(e) => setBankTransferForm({...bankTransferForm, accountHolder: e.target.value})} placeholder="Enter account holder name" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Account Type</label>
                    <div style={{ display: "flex", gap: 12 }}>
                      <button type="button" onClick={() => setBankTransferForm({...bankTransferForm, accountType: 'checking'})} style={{ flex: 1, padding: "10px 16px", background: bankTransferForm.accountType === 'checking' ? "#06FF89" : "#0a0a0a", color: bankTransferForm.accountType === 'checking' ? "#000" : "#fff", border: "1px solid #333", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Checking</button>
                      <button type="button" onClick={() => setBankTransferForm({...bankTransferForm, accountType: 'savings'})} style={{ flex: 1, padding: "10px 16px", background: bankTransferForm.accountType === 'savings' ? "#06FF89" : "#0a0a0a", color: bankTransferForm.accountType === 'savings' ? "#000" : "#fff", border: "1px solid #333", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Savings</button>
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Recipient Country</label>
                    <input type="text" value={bankTransferForm.recipientCountry} onChange={(e) => setBankTransferForm({...bankTransferForm, recipientCountry: e.target.value})} placeholder="e.g., US" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Recipient City</label>
                    <input type="text" value={bankTransferForm.recipientCity} onChange={(e) => setBankTransferForm({...bankTransferForm, recipientCity: e.target.value})} placeholder="Enter city" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Recipient Address</label>
                    <input type="text" value={bankTransferForm.recipientAddress} onChange={(e) => setBankTransferForm({...bankTransferForm, recipientAddress: e.target.value})} placeholder="Street address" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Recipient ZIP Code</label>
                    <input type="text" value={bankTransferForm.recipientZipCode} onChange={(e) => setBankTransferForm({...bankTransferForm, recipientZipCode: e.target.value})} placeholder="ZIP/Postal code" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Purpose / Notes (Optional)</label>
                    <textarea value={bankTransferForm.purpose} onChange={(e) => setBankTransferForm({...bankTransferForm, purpose: e.target.value})} placeholder="What's this transfer for?" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", minHeight: 80, resize: "vertical" }} />
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Amount</label>
                    <div style={{ display: "flex", alignItems: "center", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px" }}>
                      <span style={{ color: "#06FF89", fontSize: 16, marginRight: 8 }}>$</span>
                      <input type="text" value={bankTransferForm.amount} onChange={(e) => setBankTransferForm({...bankTransferForm, amount: e.target.value})} placeholder="0.00" style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 16, outline: "none" }} />
                    </div>
                  </div>
                  <div style={{ background: "#0a0a0a", borderRadius: 8, padding: 12, marginBottom: 16, display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "#666" }}>Transfer Fee</span>
                    <span style={{ color: "#fff" }}>$2.50</span>
                  </div>
                  <button onClick={handleBankTransfer} disabled={bankTransferLoading} style={{ width: "100%", background: bankTransferLoading ? "#333" : "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: bankTransferLoading ? "#666" : "#000", border: "none", padding: "14px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: bankTransferLoading ? "not-allowed" : "pointer" }}>{bankTransferLoading ? "Processing..." : "Submit Transfer"}</button>
                </>
              ) : transferType === "sepa" ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                    <button onClick={() => setTransferType("select")} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #8b5cf6, #6d28d9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
                    </div>
                    <div>
                      <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: 0 }}>SEPA Transfer</h3>
                      <p style={{ color: "#666", fontSize: 12, margin: 0 }}>Euro transfers within Europe</p>
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>IBAN</label>
                    <input type="text" value={sepaTransferForm.iban} onChange={(e) => setSepaTransferForm({...sepaTransferForm, iban: e.target.value})} placeholder="e.g., DE89370400440532013000" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>BIC/SWIFT Code</label>
                    <input type="text" value={sepaTransferForm.bicSwift} onChange={(e) => setSepaTransferForm({...sepaTransferForm, bicSwift: e.target.value})} placeholder="e.g., COBADEFFXXX" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Beneficiary Name</label>
                    <input type="text" value={sepaTransferForm.beneficiaryName} onChange={(e) => setSepaTransferForm({...sepaTransferForm, beneficiaryName: e.target.value})} placeholder="Enter beneficiary name" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Purpose / Reference *</label>
                    <input type="text" value={sepaTransferForm.reference} onChange={(e) => setSepaTransferForm({...sepaTransferForm, reference: e.target.value})} placeholder="What's this transfer for?" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Amount (EUR)</label>
                    <div style={{ display: "flex", alignItems: "center", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px" }}>
                      <span style={{ color: "#8b5cf6", fontSize: 16, marginRight: 8 }}>€</span>
                      <input type="text" value={sepaTransferForm.amount} onChange={(e) => setSepaTransferForm({...sepaTransferForm, amount: e.target.value})} placeholder="0.00" style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 16, outline: "none" }} />
                    </div>
                  </div>
                  <div style={{ background: "#0a0a0a", borderRadius: 8, padding: 12, marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                      <span style={{ color: "#666" }}>Transfer Fee</span>
                      <span style={{ color: "#fff" }}>€0.00</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: "#666" }}>Estimated Arrival</span>
                      <span style={{ color: "#06FF89" }}>Same day</span>
                    </div>
                  </div>
                  <button onClick={handleSepaTransfer} disabled={sepaTransferLoading} style={{ width: "100%", background: sepaTransferLoading ? "#333" : "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: sepaTransferLoading ? "#666" : "#000", border: "none", padding: "14px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: sepaTransferLoading ? "not-allowed" : "pointer" }}>{sepaTransferLoading ? "Processing..." : "Submit Transfer"}</button>
                </>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                    <button onClick={() => setTransferType("select")} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    </button>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #06FF89, #10b981)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    </div>
                    <div>
                      <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: 0 }}>International Transfer</h3>
                      <p style={{ color: "#666", fontSize: 12, margin: 0 }}>Send money worldwide</p>
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Recipient Country</label>
                    <select value={swiftTransferForm.recipientCountry} onChange={(e) => setSwiftTransferForm({...swiftTransferForm, recipientCountry: e.target.value})} style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none" }}>
                      <option value="">Select country</option>
                      <option value="GB">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="NG">Nigeria</option>
                      <option value="IN">India</option>
                      <option value="JP">Japan</option>
                      <option value="CN">China</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>SWIFT/BIC Code</label>
                    <input type="text" value={swiftTransferForm.swiftCode} onChange={(e) => setSwiftTransferForm({...swiftTransferForm, swiftCode: e.target.value})} placeholder="Enter SWIFT/BIC code" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Account Number / IBAN</label>
                    <input type="text" value={swiftTransferForm.accountNumber} onChange={(e) => setSwiftTransferForm({...swiftTransferForm, accountNumber: e.target.value})} placeholder="Enter account number or IBAN" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Beneficiary Name</label>
                    <input type="text" value={swiftTransferForm.beneficiaryName} onChange={(e) => setSwiftTransferForm({...swiftTransferForm, beneficiaryName: e.target.value})} placeholder="Enter beneficiary full name" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Beneficiary Address</label>
                    <input type="text" value={swiftTransferForm.beneficiaryAddress} onChange={(e) => setSwiftTransferForm({...swiftTransferForm, beneficiaryAddress: e.target.value})} placeholder="Street address" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Recipient City</label>
                    <input type="text" value={swiftTransferForm.recipientCity} onChange={(e) => setSwiftTransferForm({...swiftTransferForm, recipientCity: e.target.value})} placeholder="Enter city" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Recipient ZIP Code</label>
                    <input type="text" value={swiftTransferForm.recipientZipCode} onChange={(e) => setSwiftTransferForm({...swiftTransferForm, recipientZipCode: e.target.value})} placeholder="ZIP/Postal code" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Transfer Purpose</label>
                    <select value={swiftTransferForm.transferPurpose} onChange={(e) => setSwiftTransferForm({...swiftTransferForm, transferPurpose: e.target.value})} style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none" }}>
                      <option value="">Select purpose</option>
                      <option value="family">Family Support</option>
                      <option value="business">Business Payment</option>
                      <option value="education">Education Fees</option>
                      <option value="medical">Medical Expenses</option>
                      <option value="property">Property Purchase</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Amount (USD)</label>
                    <div style={{ display: "flex", alignItems: "center", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px" }}>
                      <span style={{ color: "#06FF89", fontSize: 16, marginRight: 8 }}>$</span>
                      <input type="text" value={swiftTransferForm.amount} onChange={(e) => setSwiftTransferForm({...swiftTransferForm, amount: e.target.value})} placeholder="0.00" style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 16, outline: "none" }} />
                    </div>
                  </div>
                  <div style={{ background: "#0a0a0a", borderRadius: 8, padding: 12, marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                      <span style={{ color: "#666" }}>Transfer Fee</span>
                      <span style={{ color: "#fff" }}>$15.00</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                      <span style={{ color: "#666" }}>Exchange Rate</span>
                      <span style={{ color: "#fff" }}>Market rate</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                      <span style={{ color: "#666" }}>Estimated Arrival</span>
                      <span style={{ color: "#f59e0b" }}>2-5 business days</span>
                    </div>
                  </div>
                  <button onClick={handleSwiftTransfer} disabled={swiftTransferLoading} style={{ width: "100%", background: swiftTransferLoading ? "#333" : "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: swiftTransferLoading ? "#666" : "#000", border: "none", padding: "14px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: swiftTransferLoading ? "not-allowed" : "pointer" }}>{swiftTransferLoading ? "Processing..." : "Submit Transfer"}</button>
                </>
              )}
            </div>
          )}
        </div>

        <div style={{ width: 400 }}>
          <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>👥</span>
                <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: 0 }}>Quick Send to Contacts</h3>
              </div>
              <button onClick={handleImportContacts} disabled={contactsLoading} style={{ background: "#06FF89", color: "#000", border: "none", padding: "8px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                {contactsLoading ? "Importing..." : "Import"}
              </button>
            </div>
            {!contactsSupported && (
              <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, padding: 12, marginBottom: 16 }}>
                <p style={{ color: "#f59e0b", fontSize: 12, margin: 0 }}>Contact import is only available on mobile devices with supported browsers (Chrome on Android).</p>
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 320, overflowY: "auto" }}>
              {phoneContacts.length > 0 ? (
                phoneContacts.map((contact, index) => (
                  <div key={index} onClick={() => setSendRecipient(contact.phone || contact.email || "")} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "#0a0a0a", borderRadius: 8, cursor: "pointer", border: "1px solid #1f1f1f" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, color: "#06FF89" }}>{contact.initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: "#fff", fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{contact.name}</div>
                      <div style={{ color: "#666", fontSize: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{contact.phone || contact.email || "No contact info"}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", padding: 24 }}>
                  <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.5 }}>📱</div>
                  <p style={{ color: "#888", fontSize: 13, margin: "0 0 4px 0" }}>No contacts imported yet</p>
                  <p style={{ color: "#666", fontSize: 12, margin: 0 }}>Tap "Import" to add contacts from your phone</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboardTab = () => (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        <div style={{ background: "linear-gradient(135deg, #06FF89, #B8FF9F)", borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><span style={{ color: "#000", fontSize: 13, opacity: 0.7 }}>Total Balance (USD)</span><button onClick={() => setShowBalance(!showBalance)} style={{ background: "rgba(0,0,0,0.1)", border: "none", padding: 6, borderRadius: 6, cursor: "pointer", fontSize: 11 }}>{showBalance ? "Hide" : "Show"}</button></div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#000" }}>{showBalance ? formatCurrency(totalBalanceUSD, "USD") : "****"}</div>
          <div style={{ fontSize: 12, color: "#000", opacity: 0.6, marginTop: 8 }}>{walletCurrencies.length} currencies available</div>
        </div>
        <div style={{ background: "#141414", borderRadius: 16, padding: 20, border: "1px solid #1f1f1f" }}><span style={{ color: "#888", fontSize: 13 }}>This Month</span><div style={{ fontSize: 28, fontWeight: 700, color: "#06FF89", marginTop: 16 }}>+{formatCurrency(transactionStats.income, "USD")}</div><div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>Income received</div></div>
        <div style={{ background: "#141414", borderRadius: 16, padding: 20, border: "1px solid #1f1f1f" }}><span style={{ color: "#888", fontSize: 13 }}>Expenses</span><div style={{ fontSize: 28, fontWeight: 700, color: "#ff6b6b", marginTop: 16 }}>-{formatCurrency(transactionStats.expenses, "USD")}</div><div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>Total spent</div></div>
        <div style={{ background: "#141414", borderRadius: 16, padding: 20, border: "1px solid #1f1f1f" }}><span style={{ color: "#888", fontSize: 13 }}>Pending</span><div style={{ fontSize: 28, fontWeight: 700, color: "#f59e0b", marginTop: 16 }}>{formatCurrency(transactionStats.pending, "USD")}</div><div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>Awaiting confirmation</div></div>
      </div>
      <div style={{ background: "#141414", borderRadius: 16, border: "1px solid #1f1f1f", marginBottom: 28, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #1f1f1f", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}><h2 style={{ fontSize: 18, fontWeight: 600, color: "#fff", margin: 0 }}>Wallet Currencies</h2><span style={{ color: "#666", fontSize: 13 }}>Max 4 wallets • Click to view transactions</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 1, background: "#1a1a1a" }}>
          {walletCurrencies.length > 0 ? walletCurrencies.map((w) => {
            const currencyToCountry: Record<string, string> = { USD: "us", EUR: "eu", GBP: "gb", NGN: "ng", CAD: "ca", AUD: "au", JPY: "jp", CHF: "ch", CNY: "cn", INR: "in", BRL: "br", MXN: "mx", ZAR: "za", KRW: "kr", SGD: "sg", HKD: "hk", NZD: "nz", SEK: "se", NOK: "no", DKK: "dk", PLN: "pl", THB: "th", IDR: "id", MYR: "my", PHP: "ph", AED: "ae", SAR: "sa", TRY: "tr", RUB: "ru", COP: "co", ARS: "ar", CLP: "cl", PEN: "pe", EGP: "eg", KES: "ke", GHS: "gh", XOF: "sn", XAF: "cm", CZK: "cz", HUF: "hu", ILS: "il", TWD: "tw", VND: "vn", PKR: "pk", BDT: "bd", UAH: "ua", RON: "ro", BGN: "bg", HRK: "hr", ISK: "is" };
            const countryCode = currencyToCountry[w.currency] || "un";
            const currencySymbols: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", NGN: "₦", JPY: "¥", CNY: "¥", INR: "₹", KRW: "₩", THB: "฿", PLN: "zł", TRY: "₺", RUB: "₽", ILS: "₪", PHP: "₱", VND: "₫", UAH: "₴" };
            const displaySymbol = currencySymbols[w.currency] || w.symbol;
            const secondaryText = w.currency === "EUR" && user?.iban ? user.iban : w.name;
            return (
              <div key={w.currency} onClick={() => handleWalletClick(w.currency)} style={{ padding: "16px 20px", background: selectedCurrency === w.currency ? "#1a2a1f" : "#141414", cursor: "pointer", borderLeft: selectedCurrency === w.currency ? "3px solid #06FF89" : "3px solid transparent", transition: "all 0.2s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                    <img src={`https://flagcdn.com/w40/${countryCode}.png`} srcSet={`https://flagcdn.com/w80/${countryCode}.png 2x`} alt={w.currency} style={{ width: 28, height: 20, objectFit: "cover", borderRadius: 3, flexShrink: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: selectedCurrency === w.currency ? "#06FF89" : "#fff", fontSize: 14, fontWeight: 500 }}>{w.currency}</div>
                      <div style={{ color: "#666", fontSize: 12, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{secondaryText}</div>
                    </div>
                  </div>
                  <div style={{ color: selectedCurrency === w.currency ? "#06FF89" : "#fff", fontSize: 16, fontWeight: 600, flexShrink: 0 }}>{showBalance ? displaySymbol + w.balance.toLocaleString("en-US", {minimumFractionDigits: 2}) : "****"}</div>
                </div>
              </div>
            );
          }) : null}
          {/* Convert Button - show when user has at least 1 wallet */}
          {walletCurrencies.length >= 1 && (
            <button onClick={() => { setActiveTab("payments"); setPaymentsSubTab("convert"); }} style={{ padding: "16px 20px", background: "#0a0a0a", cursor: "pointer", border: "none", borderLeft: "3px solid transparent", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 70 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, rgba(6,255,137,0.2), rgba(184,255,159,0.2))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ color: "#06FF89", fontSize: 14, fontWeight: 500 }}>Convert</div>
                <div style={{ color: "#555", fontSize: 11 }}>Exchange currencies</div>
              </div>
            </button>
          )}
          {/* Add Wallet Button - show only if less than 4 wallets */}
          {walletCurrencies.length < 4 && (
            <button onClick={() => setShowAddWalletModal(true)} style={{ padding: "16px 20px", background: "#0a0a0a", cursor: "pointer", border: "none", borderLeft: "3px solid transparent", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 70 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(6,255,137,0.1)", border: "2px dashed #06FF89", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ color: "#06FF89", fontSize: 14, fontWeight: 500 }}>Add Wallet</div>
                <div style={{ color: "#555", fontSize: 11 }}>{4 - walletCurrencies.length} slot{4 - walletCurrencies.length > 1 ? "s" : ""} available</div>
              </div>
            </button>
          )}
          {walletCurrencies.length === 0 && <div style={{ padding: "40px 20px", textAlign: "center", color: "#666", gridColumn: "1 / -1" }}>No wallet currencies found</div>}
        </div>
      </div>

      {selectedCurrency && (
        <div style={{ background: "#141414", borderRadius: 16, border: "1px solid #06FF89", marginBottom: 28, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #1f1f1f", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: "#06FF89", margin: 0 }}>{selectedCurrency} Transactions</h2>
              {walletTransactionsLoading && <span style={{ color: "#888", fontSize: 12 }}>Loading...</span>}
            </div>
            <button onClick={() => { setSelectedCurrency(null); setWalletTransactions([]); }} style={{ background: "transparent", border: "1px solid #333", color: "#888", padding: "6px 12px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>Close</button>
          </div>
          {walletTransactionsLoading ? (
            <div style={{ padding: "40px 20px", textAlign: "center", color: "#666" }}>Loading transactions...</div>
          ) : walletTransactions.length > 0 ? walletTransactions.map((txn, i) => {
            const transferStatus = txn.transfer_status?.toLowerCase() || '';
            const isIncoming = transferStatus === 'received';
            const isOutgoing = transferStatus === 'approved' || transferStatus === 'sent';
            const amount = parseFloat(txn.amount) || 0;
            const txnName = txn.transaction_name || (isIncoming && txn.from_first_name ? `${txn.from_first_name} ${txn.from_last_name}`.trim() : null) || txn.type?.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') || 'Transaction';
            const txnDate = txn.created_at ? new Date(txn.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
            const statusDisplay = transferStatus === 'received' || transferStatus === 'approved' || transferStatus === 'sent' ? 'completed' : transferStatus === 'pending' ? 'pending' : transferStatus || 'unknown';
            return (
              <div key={`wallet-txn-${i}-${txn.transaction_id || txn.txnCode}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: i < walletTransactions.length - 1 ? "1px solid #1a1a1a" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: isIncoming ? "#06FF89" : "#ff6b6b" }} />
                  <div><div style={{ color: "#fff", fontSize: 14 }}>{txnName}</div><div style={{ color: "#666", fontSize: 12, marginTop: 2 }}>{txnDate}</div></div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ color: isIncoming ? "#06FF89" : "#fff", fontSize: 14, fontWeight: 600 }}>{isIncoming ? "+" : "-"}{formatCurrency(Math.abs(amount), txn.currency || selectedCurrency)}</span>
                  <span style={{ background: statusDisplay === "completed" ? "rgba(6,255,137,0.1)" : statusDisplay === "pending" ? "rgba(245,158,11,0.1)" : "rgba(255,107,107,0.1)", color: statusDisplay === "completed" ? "#06FF89" : statusDisplay === "pending" ? "#f59e0b" : "#ff6b6b", fontSize: 11, padding: "4px 10px", borderRadius: 20 }}>{statusDisplay}</span>
                </div>
              </div>
            );
          }) : <div style={{ padding: "40px 20px", textAlign: "center", color: "#666" }}>No {selectedCurrency} transactions found</div>}
        </div>
      )}

      {/* Add Wallet Modal */}
      {showAddWalletModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#141414", borderRadius: 16, padding: 24, width: "100%", maxWidth: 400, border: "1px solid #1f1f1f" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 600, margin: 0 }}>Add Currency Wallet</h2>
              <button onClick={() => { setShowAddWalletModal(false); setSelectedNewCurrency(null); }} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", fontSize: 24 }}>×</button>
            </div>
            {addableCurrencies.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
                <p>No more currencies available to add.</p>
                <p style={{ fontSize: 13, marginTop: 8 }}>You have reached the maximum wallet limit or already have all available currencies.</p>
              </div>
            ) : (
              <>
                <p style={{ color: "#888", fontSize: 14, marginBottom: 20 }}>Select a currency to create a new wallet:</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflowY: "auto" }}>
                  {addableCurrencies.map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => setSelectedNewCurrency(currency.code)}
                      style={{
                        display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                        background: selectedNewCurrency === currency.code ? "rgba(6,255,137,0.1)" : "#0a0a0a",
                        border: selectedNewCurrency === currency.code ? "1px solid #06FF89" : "1px solid #1f1f1f",
                        borderRadius: 12, cursor: "pointer", transition: "all 0.2s"
                      }}
                    >
                      <span style={{ fontSize: 24 }}>{currency.flag}</span>
                      <div style={{ textAlign: "left", flex: 1 }}>
                        <div style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>{currency.name}</div>
                        <div style={{ color: "#666", fontSize: 12 }}>{currency.code}</div>
                      </div>
                      {selectedNewCurrency === currency.code && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleAddWallet}
                  disabled={!selectedNewCurrency || addWalletLoading}
                  style={{
                    width: "100%", marginTop: 20, padding: "14px 20px",
                    background: selectedNewCurrency ? "linear-gradient(135deg, #06FF89, #00c853)" : "#333",
                    border: "none", borderRadius: 12, color: selectedNewCurrency ? "#000" : "#666",
                    fontSize: 15, fontWeight: 600, cursor: selectedNewCurrency ? "pointer" : "not-allowed",
                    opacity: addWalletLoading ? 0.7 : 1
                  }}
                >
                  {addWalletLoading ? "Creating Wallet..." : "Create Wallet"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );

  const getTabTitle = () => {
    switch (activeTab) {
      case "cards": return { title: "Cards", subtitle: "Manage your payment cards and view spending" };
      case "qrcodes": return { title: "QR Codes", subtitle: "Generate and manage QR codes for payments and sharing" };
      case "payments": return { title: "Payments", subtitle: "Send, receive, and manage your transactions" };
      default: return { title: "Dashboard", subtitle: "Welcome back! Here is your financial overview." };
    }
  };

  const tabInfo = getTabTitle();

  const renderActiveTab = () => {
    if (activeTab === "cards") return renderCardsTab();
    if (activeTab === "qrcodes") return renderQRCodesTab();
    if (activeTab === "payments") return renderPaymentsTab();
    if (activeTab === "accounts") return renderAccountsTab();
    if (activeTab === "rewards") return renderRewardsTab();
    if (activeTab === "profile") return renderProfileTab();
    if (activeTab === "settings") return renderSettingsTab();
    if (activeTab === "helpdesk") return renderHelpTab();
    return renderDashboardTab();
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", background: "#0a0a0a", fontFamily: "system-ui", overflow: "auto" }}>
      {/* Global styles for hiding scrollbar */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
      <aside style={{ width: 220, background: "#0f0f0f", borderRight: "1px solid #1a1a1a", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100 }}>
        <div style={{ padding: "20px 16px", borderBottom: "1px solid #1a1a1a" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <Image unoptimized src="/vault_logo_icon_white.svg" alt="VP" width={28} height={28} className="no-fade" />
            <span style={{ color: "#fff", fontSize: 18, fontWeight: 600 }}>vaultpay</span>
          </Link>
        </div>
        <div style={{ padding: 16, borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: 10 }}>
          {user.ppic ? (
            <img src={normalizeImageUrl(user.ppic) || ''} alt={`${user.first_name} ${user.last_name}`} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#06FF89", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#000" }}>{user.first_name[0]}{user.last_name[0]}</div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ color: "#fff", fontSize: 14 }}>{user.first_name} {user.last_name}</div>
            <div style={{ color: "#666", fontSize: 12 }}>@{user.user_name}</div>
          </div>
          {user.is_kyc_verified === "2" && <span style={{ background: "#06FF89", color: "#000", fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4 }}>Pro</span>}
        </div>
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {navItems.map((item) => (<button key={item.id} onClick={() => setActiveTab(item.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", marginBottom: 2, background: activeTab === item.id ? "rgba(6,255,137,0.1)" : "transparent", border: "none", borderRadius: 8, cursor: "pointer", color: activeTab === item.id ? "#06FF89" : "#888" }}><span style={{ display: "flex", alignItems: "center" }}>{item.icon}</span><span style={{ fontSize: 14 }}>{item.label}</span></button>))}
          <button onClick={() => setActiveTab("profile")} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", marginTop: 8, background: activeTab === "profile" ? "rgba(6,255,137,0.1)" : "transparent", border: "none", borderRadius: 8, cursor: "pointer", color: activeTab === "profile" ? "#06FF89" : "#888" }}><span style={{ display: "flex", alignItems: "center" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span><span style={{ fontSize: 14 }}>Profile</span></button>
        </nav>
        <div style={{ padding: "12px 8px", borderTop: "1px solid #1a1a1a" }}>
          <button onClick={() => setActiveTab("settings")} style={{ width: "100%", padding: "10px 12px", marginBottom: 4, background: activeTab === "settings" ? "rgba(6,255,137,0.1)" : "transparent", border: "none", borderRadius: 8, cursor: "pointer", display: "flex" }}><span style={{ color: activeTab === "settings" ? "#06FF89" : "#888", fontSize: 14 }}>Settings</span></button>
          <button onClick={handleLogout} style={{ width: "100%", padding: "10px 12px", background: "transparent", border: "none", borderRadius: 8, cursor: "pointer", display: "flex" }}><span style={{ color: "#888", fontSize: 14 }}>Sign Out</span></button>
        </div>
      </aside>
      <main style={{ flex: 1, marginLeft: 220, padding: "24px 32px", minWidth: 0, overflow: "hidden" }}>
        <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 28, position: "relative" }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 600, color: "#fff", margin: 0 }}>{tabInfo.title}</h1>
            <p style={{ fontSize: 14, color: "#666", margin: "4px 0 0" }}>{tabInfo.subtitle}</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {activeTab === "cards" ? (
              <>
                <button onClick={handleShowCardNumbers} style={{ background: "transparent", color: "#fff", border: "1px solid #333", padding: "10px 20px", borderRadius: 8, fontSize: 14, cursor: "pointer" }}>{showCardNumbers ? "Hide Numbers" : "Show Numbers"}</button>
                <button onClick={() => setShowAddCardModal(true)} style={{ background: "#06FF89", color: "#000", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>+ Add Card</button>
              </>
            ) : activeTab === "qrcodes" ? (
              <button onClick={() => setQrSubTab("scanner")} style={{ background: "#06FF89", color: "#000", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>+ Scan QR code</button>
            ) : (
              <>
                {/* Notification Icon */}
                <div style={{ position: "relative" }}>
                  <button onClick={() => setShowNotifications(!showNotifications)} style={{ background: showNotifications ? "#06FF89" : "#1a1a1a", border: "1px solid #333", borderRadius: 8, padding: 10, cursor: "pointer", position: "relative" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={showNotifications ? "#000" : "#fff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                    {notificationCount > 0 && !showNotifications && <span style={{ position: "absolute", top: -4, right: -4, background: "#ff4444", color: "#fff", fontSize: 10, fontWeight: 600, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{notificationCount}</span>}
                  </button>
                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", width: 360, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", zIndex: 100 }}>
                      <div style={{ padding: "16px 20px", borderBottom: "1px solid #1f1f1f", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: 0 }}>Notifications {notificationsLoading && <span style={{ fontSize: 12, color: "#666" }}>(loading...)</span>}</h3>
                        <button onClick={handleMarkAllNotificationsRead} style={{ background: "transparent", border: "none", color: "#06FF89", fontSize: 12, cursor: "pointer", padding: 0 }}>Mark all read</button>
                      </div>
                      <div style={{ maxHeight: 400, overflow: "auto" }}>
                        {notifications.length > 0 ? notifications.map((notif) => (
                          <div key={notif.id} onClick={() => handleMarkNotificationRead(notif.id)} style={{ padding: "14px 20px", borderBottom: "1px solid #1f1f1f", cursor: "pointer", background: notif.is_read === 0 ? "rgba(6,255,137,0.03)" : "transparent", transition: "background 0.2s" }}>
                            <div style={{ display: "flex", gap: 12 }}>
                              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{notif.pic_url ? <img src={normalizeImageUrl(notif.pic_url) || ''} alt="" style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover" }} /> : notif.type === 1 ? "💰" : notif.type === 2 ? "🔐" : "🔔"}</div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                                  <p style={{ color: "#fff", fontSize: 13, fontWeight: 500, margin: 0 }}>{notif.title}</p>
                                  {notif.is_read === 0 && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#06FF89", flexShrink: 0, marginTop: 4 }} />}
                                </div>
                                <p style={{ color: "#888", fontSize: 12, margin: "4px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{notif.message}</p>
                                <p style={{ color: "#555", fontSize: 11, margin: "6px 0 0" }}>{new Date(notif.created_at).toLocaleString()}</p>
                              </div>
                            </div>
                          </div>
                        )) : (
                          <div style={{ padding: 40, textAlign: "center" }}>
                            <p style={{ color: "#666", fontSize: 14, margin: 0 }}>{notificationsLoading ? "Loading..." : "No notifications"}</p>
                          </div>
                        )}
                      </div>
                      <div style={{ padding: "12px 20px", borderTop: "1px solid #1f1f1f" }}>
                        <button onClick={() => { setShowNotifications(false); loadNotifications(); }} style={{ width: "100%", background: "transparent", border: "none", color: "#888", fontSize: 13, cursor: "pointer", padding: 0 }}>Refresh notifications</button>
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={() => setShowTopUpModal(true)} style={{ background: "#06FF89", color: "#000", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Top Up
                </button>
                <button onClick={() => setShowRequestPayment(!showRequestPayment)} style={{ background: showRequestPayment ? "#06FF89" : "transparent", color: showRequestPayment ? "#000" : "#fff", border: showRequestPayment ? "none" : "1px solid #333", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: showRequestPayment ? 600 : 400, cursor: "pointer" }}>Request Payment</button>
              </>
            )}
          </div>

          {/* Request Payment Dropdown */}
          {showRequestPayment && (
            <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 8, background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", width: 400, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", zIndex: 100 }}>
              {/* Tabs */}
              <div style={{ display: "flex", borderBottom: "1px solid #1f1f1f" }}>
                {[
                  { id: "create" as const, label: "New" },
                  { id: "pending" as const, label: `Sent (${sentDepositRequests.filter(r => Number(r.status) === 4).length})` },
                  { id: "received" as const, label: `Received (${receivedDepositRequests.filter(r => Number(r.status) === 4).length})` },
                  { id: "history" as const, label: "History" },
                ].map((tab) => (
                  <button key={tab.id} onClick={() => setRequestPaymentTab(tab.id)} style={{ flex: 1, padding: "10px 8px", background: "transparent", border: "none", color: requestPaymentTab === tab.id ? "#06FF89" : "#666", fontSize: 12, fontWeight: requestPaymentTab === tab.id ? 600 : 400, cursor: "pointer", borderBottom: requestPaymentTab === tab.id ? "2px solid #06FF89" : "2px solid transparent" }}>{tab.label}</button>
                ))}
              </div>

              <div style={{ padding: 16 }}>
                {requestPaymentTab === "create" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div>
                      <label style={{ color: "#888", fontSize: 11, display: "block", marginBottom: 4 }}>Email or Username</label>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input type="text" placeholder="email@example.com or @username" value={requestForm.email} onChange={(e) => { setRequestForm({ ...requestForm, email: e.target.value }); setLookupUser(null); }} onBlur={() => requestForm.email && handleLookupUserForRequest(requestForm.email)} style={{ flex: 1, background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "10px 12px", color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                        {lookupLoading && <span style={{ color: "#666", fontSize: 12, alignSelf: "center" }}>...</span>}
                      </div>
                      {lookupUser && (
                        <div style={{ marginTop: 8, padding: 10, background: "rgba(6,255,137,0.05)", borderRadius: 8, border: "1px solid rgba(6,255,137,0.2)" }}>
                          <p style={{ color: "#06FF89", fontSize: 12, margin: 0 }}>✓ Found: {lookupUser.first_name} {lookupUser.last_name}</p>
                          <p style={{ color: "#666", fontSize: 11, margin: "2px 0 0" }}>{lookupUser.email}</p>
                        </div>
                      )}
                      {requestForm.email && !lookupLoading && !lookupUser && (
                        <p style={{ color: "#ff4444", fontSize: 11, margin: "4px 0 0" }}>User not found. Enter a valid email or username.</p>
                      )}
                    </div>
                    <div>
                      <label style={{ color: "#888", fontSize: 11, display: "block", marginBottom: 4 }}>Amount (USD)</label>
                      <div style={{ display: "flex", alignItems: "center", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "10px 12px" }}>
                        <span style={{ color: "#06FF89", fontSize: 14, marginRight: 6 }}>$</span>
                        <input type="number" placeholder="0.00" value={requestForm.amount} onChange={(e) => setRequestForm({ ...requestForm, amount: e.target.value })} style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 14, outline: "none" }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ color: "#888", fontSize: 11, display: "block", marginBottom: 4 }}>Note (optional)</label>
                      <input type="text" placeholder="What's this for?" value={requestForm.note} onChange={(e) => setRequestForm({ ...requestForm, note: e.target.value })} style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "10px 12px", color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <button disabled={!lookupUser || !requestForm.amount || requestLoading} onClick={handleCreateDepositRequest} style={{ width: "100%", background: (!lookupUser || !requestForm.amount) ? "#333" : "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: (!lookupUser || !requestForm.amount) ? "#666" : "#000", border: "none", padding: "12px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: (!lookupUser || !requestForm.amount) ? "not-allowed" : "pointer" }}>{requestLoading ? "Sending..." : "Send Request"}</button>
                  </div>
                )}

                {requestPaymentTab === "pending" && (
                  <div>
                    {depositRequestsLoading ? (
                      <div style={{ textAlign: "center", padding: "24px 0" }}>
                        <p style={{ color: "#666", fontSize: 13, margin: 0 }}>Loading...</p>
                      </div>
                    ) : sentDepositRequests.filter(r => Number(r.status) === 4).length === 0 ? (
                      <div style={{ textAlign: "center", padding: "24px 0" }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        <p style={{ color: "#666", fontSize: 13, margin: 0 }}>No pending requests</p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflow: "auto" }}>
                        {sentDepositRequests.filter(r => Number(r.status) === 4).map((req) => (
                          <div key={req.id} style={{ background: "#0a0a0a", borderRadius: 8, padding: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                              <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>{req.from_first_name} {req.from_last_name}</span>
                              <span style={{ color: "#06FF89", fontSize: 14, fontWeight: 600 }}>${Number(req.amount).toFixed(2)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ color: "#666", fontSize: 11 }}>{new Date(req.createdDtm).toLocaleDateString()}</span>
                              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                <span style={{ background: "rgba(255,200,0,0.1)", color: "#FFC800", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4 }}>PENDING</span>
                                <button onClick={() => handleDeleteDepositRequest(req.id)} style={{ background: "transparent", border: "none", color: "#ff4444", fontSize: 11, cursor: "pointer", padding: 0 }}>Cancel</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {requestPaymentTab === "received" && (
                  <div>
                    {depositRequestsLoading ? (
                      <div style={{ textAlign: "center", padding: "24px 0" }}>
                        <p style={{ color: "#666", fontSize: 13, margin: 0 }}>Loading...</p>
                      </div>
                    ) : receivedDepositRequests.filter(r => Number(r.status) === 4).length === 0 ? (
                      <div style={{ textAlign: "center", padding: "24px 0" }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        <p style={{ color: "#666", fontSize: 13, margin: 0 }}>No incoming requests</p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflow: "auto" }}>
                        {receivedDepositRequests.filter(r => Number(r.status) === 4).map((req) => (
                          <div key={req.id} style={{ background: "#0a0a0a", borderRadius: 8, padding: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1f1f1f", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#888" }}>
                                  {req.from_first_name?.charAt(0) || "?"}
                                </div>
                                <div>
                                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 500, display: "block" }}>{req.from_first_name} {req.from_last_name}</span>
                                  <span style={{ color: "#666", fontSize: 10 }}>{req.from_email}</span>
                                </div>
                              </div>
                              <span style={{ color: "#06FF89", fontSize: 16, fontWeight: 600 }}>${Number(req.amount).toFixed(2)}</span>
                            </div>
                            {req.purpose && <p style={{ color: "#888", fontSize: 11, margin: "0 0 8px", padding: "6px 8px", background: "#141414", borderRadius: 4 }}>{req.purpose}</p>}
                            <div style={{ display: "flex", gap: 8 }}>
                              <button onClick={() => handleRespondToDepositRequest(req.id, true)} style={{ flex: 1, background: "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: "#000", border: "none", padding: "8px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Accept & Pay</button>
                              <button onClick={() => handleRespondToDepositRequest(req.id, false)} style={{ flex: 1, background: "transparent", color: "#ff4444", border: "1px solid #ff4444", padding: "8px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer" }}>Decline</button>
                            </div>
                            <p style={{ color: "#555", fontSize: 10, margin: "8px 0 0", textAlign: "center" }}>{new Date(req.createdDtm).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {requestPaymentTab === "history" && (
                  <div>
                    {depositRequestsLoading ? (
                      <div style={{ textAlign: "center", padding: "24px 0" }}>
                        <p style={{ color: "#666", fontSize: 13, margin: 0 }}>Loading...</p>
                      </div>
                    ) : sentDepositRequests.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "24px 0" }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <p style={{ color: "#666", fontSize: 13, margin: 0 }}>No request history</p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflow: "auto" }}>
                        {sentDepositRequests.map((req) => (
                          <div key={req.id} style={{ background: "#0a0a0a", borderRadius: 8, padding: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                              <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>{req.from_first_name} {req.from_last_name}</span>
                              <span style={{ color: Number(req.status) === 3 ? "#06FF89" : Number(req.status) === 5 ? "#ff4444" : "#fff", fontSize: 14, fontWeight: 600 }}>${Number(req.amount).toFixed(2)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ color: "#666", fontSize: 11 }}>{new Date(req.createdDtm).toLocaleDateString()}</span>
                              <span style={{ background: Number(req.status) === 4 ? "rgba(255,200,0,0.1)" : Number(req.status) === 3 ? "rgba(6,255,137,0.1)" : "rgba(255,68,68,0.1)", color: Number(req.status) === 4 ? "#FFC800" : Number(req.status) === 3 ? "#06FF89" : "#ff4444", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>{Number(req.status) === 4 ? "PENDING" : Number(req.status) === 3 ? "APPROVED" : "REJECTED"}</span>
                            </div>
                            {req.purpose && <p style={{ color: "#555", fontSize: 11, margin: "6px 0 0" }}>{req.purpose}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </header>
        {isLoading || (activeTab === "cards" && cardsLoading) ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh", color: "#666" }}>Loading...</div>
        ) : renderActiveTab()}
      </main>

      {/* Payment Confirmation Modal */}
      {showPaymentConfirm && recipientInfo && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
          <div style={{ background: "#141414", borderRadius: 20, border: "1px solid #1f1f1f", width: 420, maxWidth: "90vw", overflow: "hidden", animation: "fadeInScale 0.3s ease-out" }}>
            {!paymentSuccess ? (
              <>
                {/* Header */}
                <div style={{ padding: "24px 24px 0", textAlign: "center" }}>
                  <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 600, margin: "0 0 8px" }}>Confirm Payment</h2>
                  <p style={{ color: "#666", fontSize: 13, margin: 0 }}>Review and sign to complete</p>
                </div>

                {/* Recipient Info */}
                <div style={{ padding: 24, textAlign: "center" }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: recipientInfo.ppic ? "transparent" : "linear-gradient(135deg, #06FF89, #B8FF9F)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", overflow: "hidden", border: "3px solid #06FF89" }}>
                    {recipientInfo.ppic ? (
                      <img src={normalizeImageUrl(recipientInfo.ppic) || ''} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: 28, fontWeight: 700, color: "#000" }}>{recipientInfo.first_name[0]}{recipientInfo.last_name[0]}</span>
                    )}
                  </div>
                  <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: "0 0 4px" }}>{recipientInfo.first_name} {recipientInfo.last_name}</h3>
                  <p style={{ color: "#888", fontSize: 13, margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                    @{recipientInfo.user_name}
                    {recipientInfo.is_verified && <svg width="14" height="14" viewBox="0 0 24 24" fill="#06FF89"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>}
                  </p>
                </div>

                {/* Amount */}
                <div style={{ padding: "0 24px 24px" }}>
                  <div style={{ background: "#0a0a0a", borderRadius: 12, padding: 20, textAlign: "center", border: "1px solid #1f1f1f" }}>
                    <p style={{ color: "#666", fontSize: 12, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 1 }}>Amount</p>
                    <p style={{ color: "#06FF89", fontSize: 36, fontWeight: 700, margin: 0 }}>${parseFloat(sendAmount).toFixed(2)}</p>
                    <p style={{ color: "#888", fontSize: 12, margin: "8px 0 0" }}>USD</p>
                  </div>
                </div>

                {/* Details */}
                <div style={{ padding: "0 24px 24px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#666" }}>Date</span>
                      <span style={{ color: "#fff" }}>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#666" }}>Time</span>
                      <span style={{ color: "#fff" }}>{new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    {sendNote && (
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "#666" }}>Note</span>
                        <span style={{ color: "#fff", maxWidth: 200, textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sendNote}</span>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "#666" }}>Fee</span>
                      <span style={{ color: "#06FF89" }}>Free</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ padding: "0 24px 24px", display: "flex", gap: 12 }}>
                  <button onClick={closePaymentConfirm} disabled={paymentSigning} style={{ flex: 1, padding: "14px 24px", background: "transparent", color: "#fff", border: "1px solid #333", borderRadius: 12, fontSize: 14, fontWeight: 500, cursor: "pointer" }}>Cancel</button>
                  <button onClick={handleSignPayment} disabled={paymentSigning} style={{ flex: 1, padding: "14px 24px", background: "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: "#000", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    {paymentSigning ? (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round"/></svg>
                        Signing...
                      </>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                        Sign & Send
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Success State */}
                <div style={{ padding: 40, textAlign: "center" }}>
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #06FF89, #B8FF9F)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", animation: "successPop 0.5s ease-out" }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 600, margin: "0 0 8px" }}>Payment Sent!</h2>
                  <p style={{ color: "#888", fontSize: 14, margin: "0 0 24px" }}>Your payment has been successfully processed</p>
                  
                  <div style={{ background: "#0a0a0a", borderRadius: 12, padding: 20, marginBottom: 24, border: "1px solid #1f1f1f" }}>
                    <p style={{ color: "#06FF89", fontSize: 32, fontWeight: 700, margin: "0 0 4px" }}>${transactionResult?.amount.toFixed(2)}</p>
                    <p style={{ color: "#888", fontSize: 13, margin: 0 }}>sent to {transactionResult?.recipient_name}</p>
                  </div>

                  <div style={{ background: "#0a0a0a", borderRadius: 8, padding: 12, marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, border: "1px solid #1f1f1f" }}>
                    <span style={{ color: "#666", fontSize: 12 }}>Transaction ID:</span>
                    <span style={{ color: "#fff", fontSize: 12, fontFamily: "monospace" }}>{transactionResult?.txn_code}</span>
                  </div>

                  <button onClick={closePaymentConfirm} style={{ width: "100%", padding: "14px 24px", background: "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: "#000", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Done</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes successPop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={() => { setShowTopUpModal(false); setSelectedTopUpMethod(null); }}>
          <div style={{ background: "#141414", borderRadius: 16, border: "1px solid #1f1f1f", width: "100%", maxWidth: 520, maxHeight: "90vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #1f1f1f", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 600, margin: 0 }}>Top Up Your Wallet</h2>
                <p style={{ color: "#666", fontSize: 13, margin: "4px 0 0" }}>Choose a payment method to add funds</p>
              </div>
              <button onClick={() => { setShowTopUpModal(false); setSelectedTopUpMethod(null); }} style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer", padding: 4 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {/* Payment Methods */}
            <div style={{ padding: 24 }}>
              {!selectedTopUpMethod ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {/* Plaid - Featured (US only) */}
                  {userCountry === "US" && (
                    <button onClick={() => setSelectedTopUpMethod("plaid")} style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)", borderRadius: 12, border: "1px solid #00D87A", padding: 20, textAlign: "left", cursor: "pointer", transition: "all 0.2s", gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 56, height: 56, borderRadius: 12, background: "linear-gradient(135deg, #00D87A 0%, #00B368 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <h4 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: 0 }}>Plaid</h4>
                          <span style={{ background: "#00D87A", color: "#000", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4 }}>RECOMMENDED</span>
                        </div>
                        <p style={{ color: "#888", fontSize: 13, margin: "4px 0 0" }}>Instant bank transfers via Plaid • Secure & Fast</p>
                      </div>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00D87A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </button>
                  )}
                  {[
                    { id: "crypto", label: "Crypto", desc: "USDC, USDT, PYUSD", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F7931A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.5 9.5c0-1.5 1.5-2 3-2s2.5.5 2.5 2-1 1.5-2.5 2h-1v3h2c1.5 0 2.5.5 2.5 2s-1 2-2.5 2-3-.5-3-2"/><path d="M12 5.5v2m0 9v2"/></svg>, color: "#F7931A", disabled: false },
                    { id: "card", label: "Credit/Debit Card", desc: "Visa, Mastercard, Amex", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0096FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, color: "#0096FF", disabled: true, badge: "SOON" },
                    { id: "giftcard", label: "Gift Card", desc: "Redeem gift card codes", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A020F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>, color: "#A020F0", disabled: false },
                    { id: "web3", label: "Web3 Wallet", desc: "MetaMask, WalletConnect", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><circle cx="18" cy="12" r="2"/></svg>, color: "#06FF89", disabled: true, badge: "SOON" },
                    { id: "bank", label: "Bank Transfer", desc: "Direct bank deposit", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFC800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>, color: "#FFC800", disabled: false },
                  ].map((method) => (
                    <button 
                      key={method.id} 
                      onClick={() => !method.disabled && setSelectedTopUpMethod(method.id)} 
                      disabled={method.disabled}
                      style={{ 
                        background: "#0a0a0a", 
                        borderRadius: 12, 
                        border: "1px solid #1f1f1f", 
                        padding: 20, 
                        textAlign: "left", 
                        cursor: method.disabled ? "not-allowed" : "pointer", 
                        transition: "all 0.2s",
                        opacity: method.disabled ? 0.5 : 1,
                        position: "relative"
                      }}
                    >
                      {method.badge && (
                        <span style={{ position: "absolute", top: 8, right: 8, background: "#333", color: "#888", fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4 }}>{method.badge}</span>
                      )}
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: `${method.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12, opacity: method.disabled ? 0.5 : 1 }}>{method.icon}</div>
                      <h4 style={{ color: method.disabled ? "#666" : "#fff", fontSize: 15, fontWeight: 600, margin: "0 0 4px" }}>{method.label}</h4>
                      <p style={{ color: "#666", fontSize: 12, margin: 0 }}>{method.desc}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <div>
                  <button onClick={() => setSelectedTopUpMethod(null)} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, marginBottom: 20, padding: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                    Back to methods
                  </button>

                  {selectedTopUpMethod === "crypto" && (
                    <div>
                      <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: "0 0 16px" }}>Deposit Stablecoin</h3>
                      {!cryptoAddress ? (
                        <>
                          <p style={{ color: "#888", fontSize: 13, margin: "0 0 16px" }}>Select a stablecoin to generate a deposit address. Only USDC, USDT, and PYUSD are supported.</p>
                          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                            {[
                              { code: 'USDC' as CryptoCoin, name: "USD Coin", desc: "Circle's stablecoin", color: "#2775CA" },
                              { code: 'USDT' as CryptoCoin, name: "Tether", desc: "Most popular stablecoin", color: "#26A17B" },
                              { code: 'PYUSD' as CryptoCoin, name: "PayPal USD", desc: "PayPal's stablecoin", color: "#0070BA" },
                            ].map((coin) => (
                              <button key={coin.code} onClick={() => setSelectedCryptoCoin(coin.code)} style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, background: selectedCryptoCoin === coin.code ? "rgba(6,255,137,0.1)" : "#0a0a0a", borderRadius: 8, border: selectedCryptoCoin === coin.code ? "1px solid #06FF89" : "1px solid #1f1f1f", cursor: "pointer", textAlign: "left" }}>
                                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${coin.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: coin.color, fontWeight: 700 }}>{coin.code.charAt(0)}</div>
                                <div style={{ flex: 1 }}>
                                  <p style={{ color: "#fff", fontSize: 14, fontWeight: 500, margin: 0 }}>{coin.code}</p>
                                  <p style={{ color: "#666", fontSize: 12, margin: 0 }}>{coin.desc}</p>
                                </div>
                                {selectedCryptoCoin === coin.code && <svg width="20" height="20" viewBox="0 0 24 24" fill="#06FF89"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>}
                              </button>
                            ))}
                          </div>
                          <button onClick={handleGenerateCryptoAddress} disabled={cryptoLoading} style={{ width: "100%", background: cryptoLoading ? "#333" : "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: cryptoLoading ? "#666" : "#000", border: "none", padding: "14px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: cryptoLoading ? "wait" : "pointer" }}>{cryptoLoading ? "Generating Address..." : `Generate ${selectedCryptoCoin} Address`}</button>
                        </>
                      ) : (
                        <div>
                          <div style={{ background: "rgba(6,255,137,0.1)", borderRadius: 8, padding: 12, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#06FF89"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                            <span style={{ color: "#06FF89", fontSize: 13 }}>Address generated for {selectedCryptoCoin}</span>
                          </div>
                          <div style={{ background: "#0a0a0a", borderRadius: 8, padding: 16, marginBottom: 16 }}>
                            <p style={{ color: "#888", fontSize: 11, margin: "0 0 8px", textTransform: "uppercase" }}>Deposit Address</p>
                            <p style={{ color: "#fff", fontSize: 13, margin: 0, wordBreak: "break-all", fontFamily: "monospace", lineHeight: 1.6 }}>{cryptoAddress}</p>
                          </div>
                          <button onClick={() => copyToClipboard(cryptoAddress)} style={{ width: "100%", background: "#1a1a1a", color: "#fff", border: "1px solid #333", padding: "12px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 16 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                            Copy Address
                          </button>
                          <div style={{ background: "rgba(255,200,0,0.1)", borderRadius: 8, padding: 12, display: "flex", gap: 10, marginBottom: 16 }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFC800"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2" stroke="#000" strokeWidth="2" fill="none"/></svg>
                            <div>
                              <p style={{ color: "#FFC800", fontSize: 12, margin: 0, fontWeight: 600 }}>Time Remaining: {formatCryptoTime(cryptoTimeRemaining)}</p>
                              <p style={{ color: "#FFC800", fontSize: 11, margin: "4px 0 0", opacity: 0.8 }}>Send {selectedCryptoCoin} to this address before it expires</p>
                            </div>
                          </div>
                          <button onClick={() => { setCryptoAddress(null); setCryptoTimeRemaining(0); }} style={{ width: "100%", background: "transparent", color: "#888", border: "1px solid #333", padding: "12px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Generate New Address</button>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedTopUpMethod === "card" && (
                    <div>
                      <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: "0 0 16px" }}>Add with Card</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                          <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Amount</label>
                          <div style={{ display: "flex", alignItems: "center", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px" }}>
                            <span style={{ color: "#06FF89", fontSize: 18, marginRight: 8 }}>$</span>
                            <input type="text" placeholder="0.00" style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 18, outline: "none" }} />
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          {["$50", "$100", "$250", "$500"].map((amount) => (
                            <button key={amount} style={{ flex: 1, padding: "10px", background: "#1a1a1a", border: "1px solid #333", borderRadius: 6, color: "#fff", fontSize: 13, cursor: "pointer" }}>{amount}</button>
                          ))}
                        </div>
                        <button style={{ width: "100%", background: "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: "#000", border: "none", padding: "14px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 8 }}>Continue to Payment</button>
                      </div>
                    </div>
                  )}

                  {selectedTopUpMethod === "giftcard" && (
                    <div>
                      <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: "0 0 16px" }}>Redeem Gift Card</h3>
                      <p style={{ color: "#888", fontSize: 13, margin: "0 0 16px" }}>Enter your 8-digit VaultPay gift card code to add funds to your wallet.</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                          <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Gift Card Code</label>
                          <input 
                            type="text" 
                            placeholder="XXXX XXXX" 
                            value={giftCardCode.replace(/(\d{4})(\d{0,4})/, '$1 $2').trim()}
                            onChange={(e) => {
                              const cleaned = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
                              setGiftCardCode(cleaned);
                            }}
                            style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "14px 16px", color: "#fff", fontSize: 20, outline: "none", boxSizing: "border-box", letterSpacing: 4, textAlign: "center", fontFamily: "monospace" }} 
                          />
                          <p style={{ color: "#666", fontSize: 11, margin: "8px 0 0", textAlign: "center" }}>{giftCardCode.length}/8 digits</p>
                        </div>
                        <button 
                          onClick={handleRedeemGiftCard} 
                          disabled={giftCardCode.length !== 8 || giftCardLoading}
                          style={{ width: "100%", background: (giftCardCode.length !== 8 || giftCardLoading) ? "#333" : "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: (giftCardCode.length !== 8 || giftCardLoading) ? "#666" : "#000", border: "none", padding: "14px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: (giftCardCode.length !== 8 || giftCardLoading) ? "not-allowed" : "pointer" }}
                        >
                          {giftCardLoading ? "Redeeming..." : "Redeem Gift Card"}
                        </button>
                      </div>
                      <div style={{ background: "rgba(6,255,137,0.05)", borderRadius: 8, padding: 12, marginTop: 16 }}>
                        <p style={{ color: "#888", fontSize: 12, margin: 0, lineHeight: 1.5 }}>
                          <strong style={{ color: "#fff" }}>Note:</strong> Gift cards can only be redeemed once. Make sure you enter the code correctly.
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedTopUpMethod === "web3" && (
                    <div>
                      <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: "0 0 16px" }}>Connect Web3 Wallet</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {[
                          { name: "MetaMask", icon: "🦊", desc: "Popular browser wallet" },
                          { name: "WalletConnect", icon: "🔗", desc: "Connect mobile wallets" },
                          { name: "Coinbase Wallet", icon: "🔵", desc: "Coinbase's self-custody wallet" },
                          { name: "Trust Wallet", icon: "🛡️", desc: "Multi-chain mobile wallet" },
                        ].map((wallet) => (
                          <button key={wallet.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, background: "#0a0a0a", borderRadius: 8, border: "1px solid #1f1f1f", cursor: "pointer", textAlign: "left" }}>
                            <div style={{ width: 40, height: 40, borderRadius: 10, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{wallet.icon}</div>
                            <div style={{ flex: 1 }}>
                              <p style={{ color: "#fff", fontSize: 14, fontWeight: 500, margin: 0 }}>{wallet.name}</p>
                              <p style={{ color: "#666", fontSize: 12, margin: 0 }}>{wallet.desc}</p>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTopUpMethod === "bank" && (
                    <div>
                      <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: "0 0 16px" }}>Bank Transfer</h3>
                      <div style={{ background: "#0a0a0a", borderRadius: 8, padding: 16, marginBottom: 16 }}>
                        <p style={{ color: "#888", fontSize: 13, margin: "0 0 12px" }}>Transfer funds to the following account:</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "#666", fontSize: 12 }}>Account Number</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ color: "#fff", fontSize: 13, fontFamily: "monospace" }}>8333684592</span>
                              <button onClick={() => copyToClipboard("8333684592")} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
                            </div>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "#666", fontSize: 12 }}>SWIFT/BIC</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ color: "#fff", fontSize: 13, fontFamily: "monospace" }}>CMFGUS33</span>
                              <button onClick={() => copyToClipboard("CMFGUS33")} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
                            </div>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "#666", fontSize: 12 }}>Beneficiary</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ color: "#fff", fontSize: 13 }}>VENMOB LLC</span>
                              <button onClick={() => copyToClipboard("VENMOB LLC")} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
                            </div>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "#666", fontSize: 12 }}>Bank Name</span>
                            <span style={{ color: "#fff", fontSize: 13 }}>Community Federal Savings Bank</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <span style={{ color: "#666", fontSize: 12 }}>Bank Address</span>
                            <span style={{ color: "#fff", fontSize: 12, textAlign: "right", maxWidth: 200 }}>5 Penn Plaza, 14th Floor, New York, NY 10001, US</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #1f1f1f", paddingTop: 12, marginTop: 4 }}>
                            <span style={{ color: "#666", fontSize: 12 }}>Reference (Required)</span>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ color: "#06FF89", fontSize: 13, fontFamily: "monospace", fontWeight: 600 }}>{user?.short_user_id || user?.user_id?.slice(-7) || "VP123456"}</span>
                              <button onClick={() => copyToClipboard(user?.short_user_id || user?.user_id?.slice(-7) || "VP123456")} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div style={{ background: "rgba(255,200,0,0.1)", borderRadius: 8, padding: 12, display: "flex", gap: 10 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFC800"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                        <p style={{ color: "#FFC800", fontSize: 12, margin: 0, lineHeight: 1.5 }}>Always include your reference code in the transfer memo. Transfers typically arrive within 1-3 business days.</p>
                      </div>
                    </div>
                  )}

                  {selectedTopUpMethod === "plaid" && (
                    <div>
                      <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: "0 0 8px" }}>Pay with Plaid</h3>
                      <p style={{ color: "#888", fontSize: 13, margin: "0 0 20px" }}>Select your preferred payment method</p>
                      
                      {/* Payment Method Selection */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                        <button onClick={() => window.open("https://relay.cash/pay/c1KTpw0etEnrK_Ca", "_blank")} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 16, background: "#0a0a0a", borderRadius: 12, border: "2px solid #00D87A", cursor: "pointer", textAlign: "left" }}>
                          <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid #00D87A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#00D87A" }}></div>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ color: "#fff", fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Online Bank Transfer</div>
                            <div style={{ color: "#888", fontSize: 12, lineHeight: 1.4 }}>Securely log into your bank to transfer instantly. No account numbers needed.</div>
                          </div>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00D87A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                        </button>
                      </div>

                      <div style={{ background: "rgba(0,216,122,0.1)", borderRadius: 8, padding: 12, display: "flex", gap: 10 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#00D87A"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
                        <p style={{ color: "#00D87A", fontSize: 12, margin: 0, lineHeight: 1.5 }}>Your bank credentials are never shared with VaultPay. Plaid uses bank-level encryption.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
          <div style={{ background: "#141414", borderRadius: 20, border: "1px solid #1f1f1f", width: 420, maxWidth: "90vw", padding: 32, textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(6,255,137,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 600, margin: "0 0 8px" }}>Verify Your Identity</h2>
            <p style={{ color: "#888", fontSize: 14, margin: "0 0 24px", lineHeight: 1.5 }}>We&apos;ve sent a verification code to your email<br /><span style={{ color: "#06FF89" }}>{user?.email}</span></p>
            
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 16 }}>
              {otpCode.map((digit, index) => (
                <input key={index} id={`otp-${index}`} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(e) => handleOtpChange(index, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(index, e)} style={{ width: 52, height: 60, background: "#0a0a0a", border: otpError ? "2px solid #ff4444" : "2px solid #333", borderRadius: 12, textAlign: "center", fontSize: 24, fontWeight: 600, color: "#fff", outline: "none" }} />
              ))}
            </div>

            {otpError && <p style={{ color: "#ff4444", fontSize: 13, margin: "0 0 16px" }}>{otpError}</p>}

            <button onClick={verifyOtp} disabled={otpCode.some((d) => !d)} style={{ width: "100%", background: otpCode.some((d) => !d) ? "#333" : "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: otpCode.some((d) => !d) ? "#666" : "#000", border: "none", padding: "14px 20px", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: otpCode.some((d) => !d) ? "not-allowed" : "pointer", marginBottom: 16 }}>Verify Code</button>

            <p style={{ color: "#666", fontSize: 13, margin: 0 }}>Didn&apos;t receive the code? <button onClick={() => alert("Code resent!")} style={{ background: "none", border: "none", color: "#06FF89", cursor: "pointer", fontSize: 13, padding: 0 }}>Resend</button></p>
            
            <div style={{ marginTop: 20, padding: 12, background: "rgba(255,200,0,0.1)", borderRadius: 8 }}>
              <p style={{ color: "#FFC800", fontSize: 12, margin: 0 }}>🔑 Demo: Use code <strong>12345</strong></p>
            </div>
          </div>
        </div>
      )}

      {/* Add Virtual Card Modal */}
      {showAddCardModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, backdropFilter: "blur(8px)" }} onClick={() => setShowAddCardModal(false)}>
          <div style={{ background: "#141414", borderRadius: 20, border: "1px solid #1f1f1f", width: 500, maxWidth: "90vw", maxHeight: "85vh", overflow: "auto", padding: 32 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 600, margin: 0 }}>Create Virtual Card</h2>
              <button onClick={() => setShowAddCardModal(false)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 8 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Card Brand Selection */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 12 }}>Select Card Brand</label>
              <div style={{ display: "flex", gap: 16 }}>
                <button 
                  onClick={() => setAddCardForm({...addCardForm, brand: 'VISA'})}
                  style={{ 
                    flex: 1, 
                    padding: 20, 
                    background: "linear-gradient(135deg, #00C851 0%, #007E33 100%)", 
                    border: addCardForm.brand === 'VISA' ? "3px solid #06FF89" : "3px solid transparent", 
                    borderRadius: 16, 
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <img 
                    src="https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/p7dc18pbi8tb8d6dn2rgg" 
                    alt="VISA" 
                    style={{ height: 40, width: "auto" }}
                  />
                  {addCardForm.brand === 'VISA' && (
                    <div style={{ position: "absolute", top: 8, right: 8, width: 20, height: 20, borderRadius: "50%", background: "#06FF89", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                </button>
                <button 
                  onClick={() => setAddCardForm({...addCardForm, brand: 'MASTERCARD', cardPin: ''})}
                  style={{ 
                    flex: 1, 
                    padding: 20, 
                    background: "linear-gradient(135deg, #00C851 0%, #007E33 100%)", 
                    border: addCardForm.brand === 'MASTERCARD' ? "3px solid #06FF89" : "3px solid transparent", 
                    borderRadius: 16, 
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <img 
                    src="https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/m4yyjyhb1f71tr580hfji" 
                    alt="Mastercard" 
                    style={{ height: 40, width: "auto" }}
                  />
                  {addCardForm.brand === 'MASTERCARD' && (
                    <div style={{ position: "absolute", top: 8, right: 8, width: 20, height: 20, borderRadius: "50%", background: "#06FF89", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* PIN Input - Only for VISA */}
            {addCardForm.brand === 'VISA' && (
              <div style={{ marginBottom: 24 }}>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 8 }}>Card PIN (4 digits)</label>
                <p style={{ color: "#666", fontSize: 12, margin: "0 0 12px" }}>Enter a 4-digit PIN for your VISA card</p>
                <input 
                  type="password" 
                  inputMode="numeric"
                  maxLength={4}
                  value={addCardForm.cardPin} 
                  onChange={(e) => setAddCardForm({...addCardForm, cardPin: e.target.value.replace(/\D/g, '').slice(0, 4)})} 
                  placeholder="••••" 
                  style={{ width: "100%", background: "#0a0a0a", border: "1px solid #333", borderRadius: 12, padding: "14px 16px", color: "#fff", fontSize: 24, fontWeight: 600, textAlign: "center", letterSpacing: 8, boxSizing: "border-box", fontFamily: "monospace" }} 
                />
              </div>
            )}

            {/* Initial Funding Amount */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 8 }}>Initial Funding Amount</label>
              <p style={{ color: "#666", fontSize: 12, margin: "0 0 12px" }}>Minimum amount is $5 USD</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#0a0a0a", border: "1px solid #333", borderRadius: 12, padding: "12px 16px" }}>
                <span style={{ color: "#888", fontSize: 20 }}>$</span>
                <input 
                  type="number" 
                  value={addCardForm.fundAmount} 
                  onChange={(e) => setAddCardForm({...addCardForm, fundAmount: e.target.value})} 
                  placeholder="0.00" 
                  style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 24, fontWeight: 600, outline: "none" }} 
                />
                <span style={{ color: "#888", fontSize: 14 }}>USD</span>
              </div>
            </div>

            {/* Card Preview */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 12 }}>Card Preview</label>
              <div style={{ 
                background: addCardForm.brand === 'VISA' 
                  ? "linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)" 
                  : "linear-gradient(135deg, #0F3460 0%, #16213E 100%)", 
                borderRadius: 16, 
                padding: 20, 
                aspectRatio: "1.586",
                position: "relative",
                overflow: "hidden"
              }}>
                <div style={{ position: "absolute", top: 16, right: 16 }}>
                  <img 
                    src={addCardForm.brand === 'VISA' 
                      ? "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/p7dc18pbi8tb8d6dn2rgg"
                      : "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/m4yyjyhb1f71tr580hfji"
                    }
                    alt={addCardForm.brand}
                    style={{ height: 30, width: "auto" }}
                  />
                </div>
                <div style={{ position: "absolute", bottom: 60, left: 20 }}>
                  <div style={{ color: "#fff", fontSize: 16, fontWeight: 600, letterSpacing: 2, fontFamily: "monospace", marginBottom: 12 }}>•••• •••• •••• ••••</div>
                  <div style={{ display: "flex", gap: 24 }}>
                    <div>
                      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 8, marginBottom: 2 }}>EXP</div>
                      <div style={{ color: "#fff", fontSize: 12, fontFamily: "monospace" }}>••/••</div>
                    </div>
                    <div>
                      <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 8, marginBottom: 2 }}>CVV</div>
                      <div style={{ color: "#fff", fontSize: 12, fontFamily: "monospace" }}>•••</div>
                    </div>
                  </div>
                </div>
                <div style={{ position: "absolute", bottom: 20, left: 20 }}>
                  <div style={{ color: "#fff", fontSize: 12, fontWeight: 600 }}>{user?.first_name?.toUpperCase()} {user?.last_name?.toUpperCase()}</div>
                </div>
                <div style={{ position: "absolute", bottom: 20, right: 20, background: "rgba(255,255,255,0.1)", padding: "4px 8px", borderRadius: 4 }}>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>VIRTUAL • {addCardForm.brand}</span>
                </div>
              </div>
            </div>

            {/* Promo Features - Show when no brand selected or as info */}
            <div style={{ background: "#0a0a0a", borderRadius: 12, padding: 16, marginBottom: 24 }}>
              <p style={{ color: "#06FF89", fontSize: 14, fontWeight: 600, margin: "0 0 12px" }}>Enjoy the lowest fees in the market</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#06FF89"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                  <span style={{ color: "#888", fontSize: 13 }}>VISA and Mastercard accepted worldwide</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#06FF89"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                  <span style={{ color: "#888", fontSize: 13 }}>Shop on Netflix, Shopify, Google, Apple etc</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#06FF89"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                  <span style={{ color: "#888", fontSize: 13 }}>Instant card issuance</span>
                </div>
              </div>
            </div>

            {/* Create Button */}
            <button 
              onClick={handleAddCard} 
              disabled={addCardLoading || !addCardForm.brand || (addCardForm.brand === 'VISA' && addCardForm.cardPin.length !== 4) || !addCardForm.fundAmount || parseFloat(addCardForm.fundAmount) < 5}
              style={{ 
                width: "100%", 
                padding: "16px 24px", 
                background: addCardLoading || !addCardForm.brand || (addCardForm.brand === 'VISA' && addCardForm.cardPin.length !== 4) || !addCardForm.fundAmount || parseFloat(addCardForm.fundAmount) < 5 
                  ? "#333" 
                  : "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", 
                color: addCardLoading || !addCardForm.brand || (addCardForm.brand === 'VISA' && addCardForm.cardPin.length !== 4) || !addCardForm.fundAmount || parseFloat(addCardForm.fundAmount) < 5 
                  ? "#666" 
                  : "#000", 
                border: "none", 
                borderRadius: 12, 
                fontSize: 16, 
                fontWeight: 600, 
                cursor: addCardLoading || !addCardForm.brand || (addCardForm.brand === 'VISA' && addCardForm.cardPin.length !== 4) || !addCardForm.fundAmount || parseFloat(addCardForm.fundAmount) < 5 
                  ? "not-allowed" 
                  : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8
              }}
            >
              {addCardLoading ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round"/></svg>
                  Creating Card...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  Create {addCardForm.brand} Card
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Bank Link Modal */}
      {showBankLinkModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, backdropFilter: "blur(8px)" }} onClick={() => { setShowBankLinkModal(false); setBankLinkRegion(null); }}>
          <div style={{ background: "#141414", borderRadius: 20, border: "1px solid #1f1f1f", width: 500, maxWidth: "90vw", maxHeight: "85vh", overflow: "auto", padding: 32 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 600, margin: 0 }}>{bankLinkRegion ? (bankLinkRegion === 'us-canada' ? 'US & Canada Bank' : 'European Bank') : 'Link Bank Account'}</h2>
              <button onClick={() => { setShowBankLinkModal(false); setBankLinkRegion(null); }} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 8 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {!bankLinkRegion ? (
              <div>
                <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>Choose your bank region to link your account for withdrawals and transfers.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <button onClick={() => setBankLinkRegion('us-canada')} style={{ display: "flex", alignItems: "center", gap: 16, padding: 20, background: "#0a0a0a", border: "1px solid #1f1f1f", borderRadius: 12, cursor: "pointer", textAlign: "left" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(6,255,137,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 24 }}>🇺🇸</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#fff", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>US & Canada</div>
                      <div style={{ color: "#666", fontSize: 13 }}>Routing number & Account number</div>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                  <button onClick={() => setBankLinkRegion('europe')} style={{ display: "flex", alignItems: "center", gap: 16, padding: 20, background: "#0a0a0a", border: "1px solid #1f1f1f", borderRadius: 12, cursor: "pointer", textAlign: "left" }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(6,255,137,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 24 }}>🇪🇺</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "#fff", fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Europe</div>
                      <div style={{ color: "#666", fontSize: 13 }}>IBAN & SWIFT/BIC code</div>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
                <div style={{ marginTop: 24, padding: 16, background: "rgba(6,255,137,0.05)", borderRadius: 12, display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <p style={{ color: "#888", fontSize: 12, margin: 0, lineHeight: 1.5 }}>Your bank information is encrypted with bank-level security. We never store your login credentials.</p>
                </div>
              </div>
            ) : bankLinkRegion === 'us-canada' ? (
              <div>
                <button onClick={() => setBankLinkRegion(null)} style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", color: "#06FF89", fontSize: 13, cursor: "pointer", marginBottom: 20, padding: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                  Back to regions
                </button>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 8 }}>Bank Name</label>
                    <input type="text" placeholder="e.g. Chase, Bank of America" value={bankLinkForm.bankName} onChange={(e) => setBankLinkForm({...bankLinkForm, bankName: e.target.value})} style={{ width: "100%", background: "#0a0a0a", border: "1px solid #333", borderRadius: 8, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 8 }}>Account Type</label>
                    <div style={{ display: "flex", gap: 12 }}>
                      <button onClick={() => setBankLinkForm({...bankLinkForm, accountType: 'checking'})} style={{ flex: 1, padding: "12px", background: bankLinkForm.accountType === 'checking' ? "rgba(6,255,137,0.1)" : "#0a0a0a", border: bankLinkForm.accountType === 'checking' ? "2px solid #06FF89" : "1px solid #333", borderRadius: 8, color: bankLinkForm.accountType === 'checking' ? "#06FF89" : "#888", fontSize: 14, cursor: "pointer" }}>Checking</button>
                      <button onClick={() => setBankLinkForm({...bankLinkForm, accountType: 'savings'})} style={{ flex: 1, padding: "12px", background: bankLinkForm.accountType === 'savings' ? "rgba(6,255,137,0.1)" : "#0a0a0a", border: bankLinkForm.accountType === 'savings' ? "2px solid #06FF89" : "1px solid #333", borderRadius: 8, color: bankLinkForm.accountType === 'savings' ? "#06FF89" : "#888", fontSize: 14, cursor: "pointer" }}>Savings</button>
                    </div>
                  </div>
                  <div>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 8 }}>Routing Number (9 digits)</label>
                    <input type="text" placeholder="123456789" value={bankLinkForm.routingNumber} onChange={(e) => setBankLinkForm({...bankLinkForm, routingNumber: e.target.value.replace(/\D/g, '').slice(0, 9)})} maxLength={9} style={{ width: "100%", background: "#0a0a0a", border: "1px solid #333", borderRadius: 8, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "monospace" }} />
                  </div>
                  <div>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 8 }}>Account Number</label>
                    <input type="text" placeholder="Enter account number" value={bankLinkForm.accountNumber} onChange={(e) => setBankLinkForm({...bankLinkForm, accountNumber: e.target.value.replace(/\D/g, '').slice(0, 20)})} maxLength={20} style={{ width: "100%", background: "#0a0a0a", border: "1px solid #333", borderRadius: 8, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "monospace" }} />
                  </div>
                  <div>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 8 }}>Confirm Account Number</label>
                    <input type="text" placeholder="Re-enter account number" value={bankLinkForm.confirmAccountNumber} onChange={(e) => setBankLinkForm({...bankLinkForm, confirmAccountNumber: e.target.value.replace(/\D/g, '').slice(0, 20)})} maxLength={20} style={{ width: "100%", background: "#0a0a0a", border: bankLinkForm.accountNumber && bankLinkForm.confirmAccountNumber && bankLinkForm.accountNumber !== bankLinkForm.confirmAccountNumber ? "1px solid #ff4444" : "1px solid #333", borderRadius: 8, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "monospace" }} />
                    {bankLinkForm.accountNumber && bankLinkForm.confirmAccountNumber && bankLinkForm.accountNumber !== bankLinkForm.confirmAccountNumber && <p style={{ color: "#ff4444", fontSize: 11, margin: "6px 0 0" }}>Account numbers do not match</p>}
                  </div>
                  <button onClick={async () => {
                    if (!user || !bankLinkForm.bankName || !bankLinkForm.routingNumber || bankLinkForm.routingNumber.length !== 9 || !bankLinkForm.accountNumber || bankLinkForm.accountNumber !== bankLinkForm.confirmAccountNumber) {
                      alert('Please fill in all fields correctly');
                      return;
                    }
                    try {
                      const res = await linkBankAccount({
                        userId: user.user_id,
                        loginCode: user.login_code,
                        currency: 'USD',
                        bank_name: bankLinkForm.bankName,
                        routing_number: bankLinkForm.routingNumber,
                        account_number: bankLinkForm.accountNumber,
                        confirm_account_number: bankLinkForm.confirmAccountNumber,
                        account_type: bankLinkForm.accountType
                      });
                      if (res.status) {
                        alert('Bank account linked successfully!');
                        setShowBankLinkModal(false);
                        setBankLinkRegion(null);
                        setBankLinkForm({ currency: 'USD', bankName: '', routingNumber: '', accountNumber: '', confirmAccountNumber: '', accountType: 'checking', iban: '', confirmIban: '', swiftCode: '', bankAddress: '' });
                        loadBankAccounts();
                      } else {
                        alert(res.message || 'Failed to link bank account');
                      }
                    } catch (e) { alert('Error linking bank account'); }
                  }} style={{ width: "100%", background: "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: "#000", border: "none", padding: "14px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 8 }}>Link Bank Account</button>
                </div>
              </div>
            ) : (
              <div>
                <button onClick={() => setBankLinkRegion(null)} style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", color: "#06FF89", fontSize: 13, cursor: "pointer", marginBottom: 20, padding: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                  Back to regions
                </button>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 8 }}>Bank Name</label>
                    <input type="text" placeholder="e.g. Deutsche Bank, BNP Paribas" value={bankLinkForm.bankName} onChange={(e) => setBankLinkForm({...bankLinkForm, bankName: e.target.value})} style={{ width: "100%", background: "#0a0a0a", border: "1px solid #333", borderRadius: 8, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 8 }}>Bank Address</label>
                    <input type="text" placeholder="Enter bank address" value={bankLinkForm.bankAddress} onChange={(e) => setBankLinkForm({...bankLinkForm, bankAddress: e.target.value})} style={{ width: "100%", background: "#0a0a0a", border: "1px solid #333", borderRadius: 8, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 8 }}>IBAN</label>
                    <input type="text" placeholder="GB29 NWBK 6016 1331 9268 19" value={bankLinkForm.iban} onChange={(e) => setBankLinkForm({...bankLinkForm, iban: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/(.{4})/g, '$1 ').trim()})} style={{ width: "100%", background: "#0a0a0a", border: "1px solid #333", borderRadius: 8, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "monospace" }} />
                  </div>
                  <div>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 8 }}>Confirm IBAN</label>
                    <input type="text" placeholder="Re-enter IBAN" value={bankLinkForm.confirmIban} onChange={(e) => setBankLinkForm({...bankLinkForm, confirmIban: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').replace(/(.{4})/g, '$1 ').trim()})} style={{ width: "100%", background: bankLinkForm.iban && bankLinkForm.confirmIban && bankLinkForm.iban.replace(/\s/g, '') !== bankLinkForm.confirmIban.replace(/\s/g, '') ? "1px solid #ff4444" : "#0a0a0a", border: "1px solid #333", borderRadius: 8, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "monospace" }} />
                    {bankLinkForm.iban && bankLinkForm.confirmIban && bankLinkForm.iban.replace(/\s/g, '') !== bankLinkForm.confirmIban.replace(/\s/g, '') && <p style={{ color: "#ff4444", fontSize: 11, margin: "6px 0 0" }}>IBANs do not match</p>}
                  </div>
                  <div>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 8 }}>BIC/SWIFT Code</label>
                    <input type="text" placeholder="NWBKGB2L" value={bankLinkForm.swiftCode} onChange={(e) => setBankLinkForm({...bankLinkForm, swiftCode: e.target.value.toUpperCase().slice(0, 11)})} maxLength={11} style={{ width: "100%", background: "#0a0a0a", border: "1px solid #333", borderRadius: 8, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "monospace" }} />
                  </div>
                  <button onClick={async () => {
                    const cleanIban = bankLinkForm.iban.replace(/\s/g, '');
                    const cleanConfirmIban = bankLinkForm.confirmIban.replace(/\s/g, '');
                    if (!user || !bankLinkForm.bankName || !bankLinkForm.bankAddress || !cleanIban || cleanIban !== cleanConfirmIban || !bankLinkForm.swiftCode) {
                      alert('Please fill in all fields correctly');
                      return;
                    }
                    try {
                      const res = await linkBankAccount({
                        userId: user.user_id,
                        loginCode: user.login_code,
                        currency: 'EUR',
                        bank_name: bankLinkForm.bankName,
                        iban: cleanIban,
                        confirm_iban: cleanConfirmIban,
                        swift_code: bankLinkForm.swiftCode,
                        bank_address: bankLinkForm.bankAddress
                      });
                      if (res.status) {
                        alert('Bank account linked successfully!');
                        setShowBankLinkModal(false);
                        setBankLinkRegion(null);
                        setBankLinkForm({ currency: 'USD', bankName: '', routingNumber: '', accountNumber: '', confirmAccountNumber: '', accountType: 'checking', iban: '', confirmIban: '', swiftCode: '', bankAddress: '' });
                        loadBankAccounts();
                      } else {
                        alert(res.message || 'Failed to link bank account');
                      }
                    } catch (e) { alert('Error linking bank account'); }
                  }} style={{ width: "100%", background: "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: "#000", border: "none", padding: "14px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 8 }}>Link Bank Account</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inactivity Warning Modal */}
      {showInactivityWarning && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000, backdropFilter: "blur(8px)" }}>
          <div style={{ background: "#141414", borderRadius: 20, border: "1px solid #ff4444", width: 400, maxWidth: "90vw", padding: 32, textAlign: "center", animation: "pulse 1s infinite" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(255,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", position: "relative" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <div style={{ position: "absolute", top: -8, right: -8, width: 36, height: 36, borderRadius: "50%", background: "#ff4444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#fff" }}>{inactivityCountdown}</div>
            </div>
            <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 600, margin: "0 0 12px" }}>Session Timeout Warning</h2>
            <p style={{ color: "#888", fontSize: 14, margin: "0 0 24px", lineHeight: 1.6 }}>Due to inactivity, your session will end in <span style={{ color: "#ff4444", fontWeight: 600 }}>{inactivityCountdown} seconds</span> for security reasons.</p>
            
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => { logout(); router.push("/signin"); }} style={{ flex: 1, background: "transparent", color: "#888", border: "1px solid #333", padding: "12px 20px", borderRadius: 10, fontSize: 14, cursor: "pointer" }}>Sign Out</button>
              <button onClick={handleStayLoggedIn} style={{ flex: 1, background: "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: "#000", border: "none", padding: "12px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Stay Logged In</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}
