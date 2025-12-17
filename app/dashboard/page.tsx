"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getAccountBalance, getTransactionHistory, getUserCards, getCardTransactions, getCardSpendingSummary, getCardLimits, freezeCard, unfreezeCard, getCardPin, generatePaymentQRCode, generateProfileQRCode, getUserQRCodes, p2pTransfer, lookupP2PRecipient, getLiveRates, convertCurrency, getLinkedBankAccounts, createPlaidLinkToken, unlinkBankAccount, getSupportTickets, createSupportTicket, replyToTicket, closeTicket, checkUsernameAvailability, updateUsername, Transaction, BalanceResponse, Card, CardTransaction, CardSpendingSummary, CardLimits, PaymentQRCode, ProfileQRCode, LinkedBankAccount, SupportTicket } from "@/lib/vaultpay-api";

type DashboardTab = "dashboard" | "feed" | "payments" | "accounts" | "cards" | "friends" | "rewards" | "qrcodes" | "helpdesk" | "profile" | "settings";

const CURRENCY_SYMBOLS: Record<string, string> = { USD: "$", EUR: "E", GBP: "L", NGN: "N", CAD: "C$", AUD: "A$", JPY: "Y" };
const CURRENCY_NAMES: Record<string, string> = { USD: "US Dollar", EUR: "Euro", GBP: "British Pound", NGN: "Nigerian Naira" };

const CARD_STYLES: Record<string, { bg: string; text: string }> = {
  default: { bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", text: "#fff" },
  debit: { bg: "linear-gradient(135deg, #0f3460 0%, #16213e 100%)", text: "#fff" },
  gold: { bg: "linear-gradient(135deg, #b8860b 0%, #daa520 50%, #b8860b 100%)", text: "#000" },
  rewards: { bg: "linear-gradient(135deg, #1e3a5f 0%, #2e5a8f 100%)", text: "#fff" },
  virtual: { bg: "linear-gradient(135deg, #06FF89 0%, #00c853 100%)", text: "#000" },
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [balances, setBalances] = useState<BalanceResponse["data"] | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletTransactions, setWalletTransactions] = useState<Transaction[]>([]);
  const [walletTransactionsLoading, setWalletTransactionsLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [cardTransactions, setCardTransactions] = useState<CardTransaction[]>([]);
  const [spendingSummary, setSpendingSummary] = useState<CardSpendingSummary | null>(null);
  const [cardLimits, setCardLimits] = useState<CardLimits | null>(null);
  const [showCardNumbers, setShowCardNumbers] = useState(false);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [cardPin, setCardPin] = useState<string | null>(null);
  const [showPinModal, setShowPinModal] = useState(false);

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
  const [profileSection, setProfileSection] = useState<"personal" | "password" | "privacy" | "notifications">("personal");
  const [profileEditMode, setProfileEditMode] = useState(false);
  const [profileForm, setProfileForm] = useState({ firstName: "", lastName: "", email: "", secondaryEmail: "", phone: "", dob: "", address: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
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
  const [newTicketForm, setNewTicketForm] = useState({ subject: "", description: "", category: "general", priority: "medium" });
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketReply, setTicketReply] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [usernameUpdating, setUsernameUpdating] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedTopUpMethod, setSelectedTopUpMethod] = useState<string | null>(null);
  const [showRequestPayment, setShowRequestPayment] = useState(false);
  const [requestPaymentTab, setRequestPaymentTab] = useState<"create" | "pending" | "history">("create");
  const [paymentRequests, setPaymentRequests] = useState<Array<{ id: string; email: string; amount: number; status: "pending" | "accepted" | "declined" | "expired"; created_at: string; note?: string }>>([]);
  const [requestForm, setRequestForm] = useState({ email: "", amount: "", note: "" });
  const [requestLoading, setRequestLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
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
    if (!isAuthenticated) { router.push("/signin"); return; }
    const otpVerifiedSession = sessionStorage.getItem("otp_verified");
    if (otpVerifiedSession === "true") {
      setOtpVerified(true);
      loadDashboardData();
    } else {
      setShowOtpModal(true);
    }
  }, [isAuthenticated, router]);

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
    if (activeTab === "helpdesk" && user && helpSubTab === "tickets") loadSupportTickets();
  }, [activeTab, user, helpSubTab]);

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
      const res = await getSupportTickets(user.user_id, user.login_code);
      if (res.status && res.data) setSupportTickets(res.data);
    } catch (error) { console.error("Error loading tickets:", error); }
    finally { setTicketsLoading(false); }
  };

  const handleCreateTicket = async () => {
    if (!user || !newTicketForm.subject || !newTicketForm.description) {
      alert("Please fill in all required fields");
      return;
    }
    try {
      const res = await createSupportTicket(user.user_id, user.login_code, newTicketForm);
      if (res.status) {
        alert("Ticket created successfully!");
        setShowNewTicket(false);
        setNewTicketForm({ subject: "", description: "", category: "general", priority: "medium" });
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
      const res = await replyToTicket(user.user_id, user.login_code, selectedTicket.ticket_id, ticketReply);
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
      const res = await closeTicket(user.user_id, user.login_code, ticketId);
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
      const res = await getLinkedBankAccounts(user.user_id, user.login_code);
      if (res.status && res.data) setLinkedBankAccounts(res.data);
    } catch (error) { console.error("Error loading bank accounts:", error); }
    finally { setBankAccountsLoading(false); }
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
      const res = await unlinkBankAccount(user.user_id, user.login_code, accountId);
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
      const [balanceRes, transactionsRes] = await Promise.all([
        getAccountBalance(user.user_id, user.login_code),
        getTransactionHistory(user.user_id, user.login_code, { limit: 10 }),
      ]);
      if (balanceRes.status && balanceRes.data) setBalances(balanceRes.data);
      if (transactionsRes.status && transactionsRes.data) setTransactions(transactionsRes.data);
    } catch (error) { console.error("Error:", error); }
    finally { setIsLoading(false); }
  };

  const loadWalletTransactions = async (currency: string) => {
    if (!user) return;
    setWalletTransactionsLoading(true);
    try {
      const res = await getTransactionHistory(user.user_id, user.login_code, { limit: 50, currency: currency });
      if (res.status && res.data) {
        setWalletTransactions(res.data);
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

  const loadCardsData = async () => {
    if (!user) return;
    setCardsLoading(true);
    try {
      const cardsRes = await getUserCards(user.user_id, user.login_code);
      if (cardsRes.status && cardsRes.data) {
        setCards(cardsRes.data);
        if (cardsRes.data.length > 0 && !selectedCard) setSelectedCard(cardsRes.data[0]);
      }
    } catch (error) { console.error("Error loading cards:", error); }
    finally { setCardsLoading(false); }
  };

  const loadCardDetails = async (cardId: string) => {
    if (!user) return;
    try {
      const [txnRes, summaryRes, limitsRes] = await Promise.all([
        getCardTransactions(user.user_id, user.login_code, cardId, { limit: 5 }),
        getCardSpendingSummary(user.user_id, user.login_code, cardId),
        getCardLimits(user.user_id, user.login_code, cardId),
      ]);
      if (txnRes.status) setCardTransactions(txnRes.data);
      if (summaryRes.status) setSpendingSummary(summaryRes.data);
      if (limitsRes.status) setCardLimits(limitsRes.data);
    } catch (error) { console.error("Error:", error); }
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
          amount: res.data.amount,
          recipient_name: res.data.recipient_name,
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

  useEffect(() => {
    if (paymentsSubTab === "convert" && user) {
      loadLiveRates(convertFromCurrency);
    }
  }, [paymentsSubTab, convertFromCurrency, user]);

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
    transactions.forEach((txn) => {
      const txnDate = new Date(txn.CreatedDTM);
      const amount = parseFloat(txn.amount) || 0;
      if (txnDate.getMonth() === now.getMonth() && txnDate.getFullYear() === now.getFullYear()) {
        if (txn.status === 0) pending += Math.abs(amount);
        else if (amount > 0) income += amount;
        else expenses += Math.abs(amount);
      }
    });
    return { income, expenses, pending };
  }, [transactions]);

  const totalBalanceUSD = balances?.USD || 0;

  if (!isAuthenticated || !user) {
    return (<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0a", color: "#fff" }}><p>Redirecting...</p></div>);
  }

  const navItems = [
    { id: "dashboard" as DashboardTab, label: "Dashboard", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
    { id: "feed" as DashboardTab, label: "Feed", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
    { id: "payments" as DashboardTab, label: "Payments", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
    { id: "accounts" as DashboardTab, label: "Accounts", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    { id: "cards" as DashboardTab, label: "Cards", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
    { id: "friends" as DashboardTab, label: "Friends", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { id: "rewards" as DashboardTab, label: "Rewards", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
    { id: "qrcodes" as DashboardTab, label: "QR Codes", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="5" y="5" width="3" height="3"/><rect x="16" y="5" width="3" height="3"/><rect x="5" y="16" width="3" height="3"/></svg> },
    { id: "helpdesk" as DashboardTab, label: "Help Desk", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
  ];

  const formatCurrency = (amount: number, currency: string = "USD") => {
    const symbol = CURRENCY_SYMBOLS[currency] || "$";
    return symbol + Math.abs(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
  const getTransactionType = (txn: Transaction) => (parseFloat(txn.amount) || 0) >= 0 ? "incoming" : "outgoing";
  const getTransactionStatus = (status: number) => status === 0 ? "pending" : status === 1 ? "completed" : status === 2 ? "failed" : "unknown";
  const getCardStyle = (card: Card) => CARD_STYLES[card.card_style || "default"] || CARD_STYLES.default;

  const currentCard = selectedCard || (cards.length > 0 ? cards[0] : null);
  const displaySpendingSummary = spendingSummary || { this_month: 0, last_month: 0, average_monthly: 0 };
  const displayCardLimits = cardLimits || { daily_limit: 0, used_today: 0, remaining_today: 0, monthly_limit: 0, used_this_month: 0, remaining_this_month: 0 };

  const renderCardsTab = () => {
    if (cards.length === 0 || !currentCard) {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💳</div>
          <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 600, margin: "0 0 8px 0" }}>No Cards Yet</h3>
          <p style={{ color: "#666", fontSize: 14, margin: "0 0 24px 0" }}>You dont have any cards. Add a physical or virtual card to get started.</p>
          <button style={{ background: "#06FF89", color: "#000", border: "none", padding: "12px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>+ Add Your First Card</button>
        </div>
      );
    }

    return (
      <div style={{ display: "flex", gap: 24 }}>
        <div style={{ flex: 1 }}>
          <div style={{ background: getCardStyle(currentCard).bg, borderRadius: 16, padding: 24, marginBottom: 16, minHeight: 180 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Image unoptimized src="/vault_logo_icon_white.svg" alt="VP" width={24} height={24} className="no-fade" />
                <span style={{ color: getCardStyle(currentCard).text, fontSize: 14, fontWeight: 600 }}>{currentCard.provider === "maplerad" ? "Maplerad" : "VaultPay"}</span>
              </div>
              <span style={{ background: "rgba(6,255,137,0.2)", color: "#06FF89", fontSize: 11, padding: "4px 10px", borderRadius: 4 }}>{currentCard.card_type === "virtual" ? "Virtual" : "Physical"}</span>
            </div>
            <div style={{ color: getCardStyle(currentCard).text, fontSize: 22, fontWeight: 500, letterSpacing: 3, marginBottom: 24 }}>
              {showCardNumbers ? currentCard.card_number_masked : "**** **** **** " + currentCard.last_four}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ color: getCardStyle(currentCard).text, opacity: 0.6, fontSize: 10, marginBottom: 4 }}>CARD HOLDER</div>
                <div style={{ color: getCardStyle(currentCard).text, fontSize: 14, fontWeight: 500 }}>{currentCard.cardholder_name}</div>
              </div>
              <div>
                <div style={{ color: getCardStyle(currentCard).text, opacity: 0.6, fontSize: 10, marginBottom: 4 }}>EXPIRES</div>
                <div style={{ color: getCardStyle(currentCard).text, fontSize: 14 }}>{currentCard.expiry_month}/{currentCard.expiry_year}</div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: getCardStyle(currentCard).text, fontStyle: "italic" }}>{currentCard.card_brand.toUpperCase()}</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 24 }}>
            {cards.map((card) => (
              <div key={card.id} onClick={() => setSelectedCard(card)} style={{ background: getCardStyle(card).bg, borderRadius: 12, padding: 16, cursor: "pointer", border: currentCard.id === card.id ? "2px solid #06FF89" : "2px solid transparent" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ color: getCardStyle(card).text, opacity: 0.7, fontSize: 10, fontWeight: 600 }}>{card.card_name}</div>
                  {card.card_type === "virtual" && <span style={{ background: "rgba(6,255,137,0.3)", color: "#06FF89", fontSize: 9, padding: "2px 6px", borderRadius: 3 }}>Virtual</span>}
                </div>
                <div style={{ color: getCardStyle(card).text, fontSize: 14, letterSpacing: 1, marginBottom: 8 }}>**** {card.last_four}</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: getCardStyle(card).text, opacity: 0.6, fontSize: 11 }}>{formatCurrency(card.balance, card.currency)}</span>
                  <span style={{ color: getCardStyle(card).text, opacity: 0.6, fontSize: 11 }}>{card.expiry_month}/{card.expiry_year}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #1f1f1f" }}>
              <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 600, margin: 0 }}>Recent Transactions</h3>
            </div>
            {cardTransactions.length > 0 ? cardTransactions.map((txn, i) => (
              <div key={txn.id} style={{ display: "flex", justifyContent: "space-between", padding: "12px 20px", borderBottom: i < cardTransactions.length - 1 ? "1px solid #1a1a1a" : "none" }}>
                <div><div style={{ color: "#fff", fontSize: 13 }}>{txn.merchant_name}</div><div style={{ color: "#666", fontSize: 11 }}>{txn.merchant_category}</div></div>
                <div style={{ textAlign: "right" }}><div style={{ color: "#fff", fontSize: 13 }}>{formatCurrency(txn.amount, txn.currency)}</div><div style={{ color: "#666", fontSize: 11 }}>{formatDate(txn.created_at)}</div></div>
              </div>
            )) : <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>No transactions yet</div>}
          </div>
        </div>
        <div style={{ width: 280 }}>
          <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 20, marginBottom: 16 }}>
            <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>Card Details</h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><span style={{ color: "#666", fontSize: 13 }}>Type</span><span style={{ color: "#fff", fontSize: 13 }}>{currentCard.card_type}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><span style={{ color: "#666", fontSize: 13 }}>Status</span><span style={{ color: currentCard.status === "active" ? "#06FF89" : "#f59e0b", fontSize: 13 }}>{currentCard.status}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#666", fontSize: 13 }}>Brand</span><span style={{ color: "#fff", fontSize: 13 }}>{currentCard.card_brand.toUpperCase()}</span></div>
          </div>
          <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 20, marginBottom: 16 }}>
            <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>Card Controls</h3>
            <button onClick={handleFreezeCard} style={{ width: "100%", padding: "10px 12px", background: "transparent", border: "none", borderRadius: 8, cursor: "pointer", marginBottom: 8, textAlign: "left" }}><span style={{ color: "#888", fontSize: 13 }}>{currentCard.status === "frozen" ? "Unfreeze Card" : "Freeze Card"}</span></button>
            <button onClick={handleViewPin} style={{ width: "100%", padding: "10px 12px", background: "transparent", border: "none", borderRadius: 8, cursor: "pointer", textAlign: "left" }}><span style={{ color: "#888", fontSize: 13 }}>View PIN</span></button>
          </div>
          <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 20 }}>
            <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 600, margin: "0 0 16px 0" }}>Spending Summary</h3>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><span style={{ color: "#666", fontSize: 13 }}>This Month</span><span style={{ color: "#fff", fontSize: 13 }}>{formatCurrency(displaySpendingSummary.this_month)}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#666", fontSize: 13 }}>Last Month</span><span style={{ color: "#06FF89", fontSize: 13 }}>{formatCurrency(displaySpendingSummary.last_month)}</span></div>
          </div>
        </div>
        {showPinModal && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={() => setShowPinModal(false)}>
            <div style={{ background: "#141414", borderRadius: 16, padding: 32, textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ color: "#fff", fontSize: 18, margin: "0 0 16px 0" }}>Your Card PIN</h3>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#06FF89", letterSpacing: 8, marginBottom: 16 }}>{cardPin || "****"}</div>
              <button onClick={() => setShowPinModal(false)} style={{ background: "#06FF89", color: "#000", border: "none", padding: "10px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Close</button>
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

  const renderAccountsTab = () => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 600, margin: 0 }}>Linked Bank Accounts</h2>
          <p style={{ color: "#666", fontSize: 13, margin: "4px 0 0" }}>Connect your bank accounts to easily transfer funds</p>
        </div>
        <button onClick={handleConnectBank} disabled={plaidLoading} style={{ background: "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: "#000", border: "none", padding: "12px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: plaidLoading ? "wait" : "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          {plaidLoading ? (
            <><svg width="18" height="18" viewBox="0 0 24 24" style={{ animation: "spin 1s linear infinite" }}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round"/></svg> Connecting...</>
          ) : (
            <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg> Connect Bank Account</>
          )}
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
          <p style={{ color: "#666", fontSize: 14, margin: "0 0 24px", maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>Connect your bank account securely using Plaid to enable instant transfers and deposits.</p>
          <button onClick={handleConnectBank} disabled={plaidLoading} style={{ background: "#06FF89", color: "#000", border: "none", padding: "14px 32px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Connect with Plaid</button>
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
              <span style={{ color: "#888", fontSize: 12 }}>Instant verification</span>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {linkedBankAccounts.map((account) => (
            <div key={account.id} style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 12, background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {account.institution_logo ? (
                  <img src={account.institution_logo} alt={account.institution_name} style={{ width: 40, height: 40, objectFit: "contain" }} />
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h4 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: 0 }}>{account.institution_name}</h4>
                  <span style={{ background: account.status === "active" ? "rgba(6,255,137,0.1)" : "rgba(255,200,0,0.1)", color: account.status === "active" ? "#06FF89" : "#FFC800", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>{account.status}</span>
                </div>
                <p style={{ color: "#888", fontSize: 13, margin: "4px 0 0" }}>{account.account_name} •••• {account.account_mask}</p>
                <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                  <span style={{ color: "#666", fontSize: 12 }}>{account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)}</span>
                  {account.current_balance !== undefined && (
                    <span style={{ color: "#06FF89", fontSize: 12, fontWeight: 500 }}>{CURRENCY_SYMBOLS[account.currency] || "$"}{account.current_balance.toLocaleString()}</span>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ background: "#1a1a1a", color: "#fff", border: "1px solid #333", padding: "8px 16px", borderRadius: 6, fontSize: 13, cursor: "pointer" }}>Refresh</button>
                <button onClick={() => handleUnlinkBank(account.id)} style={{ background: "transparent", color: "#ff4444", border: "1px solid rgba(255,68,68,0.3)", padding: "8px 16px", borderRadius: 6, fontSize: 13, cursor: "pointer" }}>Unlink</button>
              </div>
            </div>
          ))}

          <div style={{ background: "#0f0f0f", borderRadius: 12, border: "1px dashed #333", padding: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} onClick={handleConnectBank}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(6,255,137,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              </div>
              <div>
                <p style={{ color: "#fff", fontSize: 14, fontWeight: 500, margin: 0 }}>Add Another Bank Account</p>
                <p style={{ color: "#666", fontSize: 12, margin: 0 }}>Connect more accounts with Plaid</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 32, background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <img src="https://plaid.com/assets/img/navbar/logo.svg" alt="Plaid" style={{ height: 24, filter: "brightness(0) invert(1)" }} />
          <span style={{ color: "#666", fontSize: 13 }}>Powered by Plaid</span>
        </div>
        <p style={{ color: "#888", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
          Plaid is a secure service that helps you connect your bank accounts to VaultPay. Your bank credentials are encrypted and never stored on our servers. Plaid is trusted by major financial apps and banks worldwide.
        </p>
      </div>
    </div>
  );

  const renderProfileTab = () => (
    <div style={{ display: "flex", gap: 24 }}>
      {/* Left Sidebar Menu */}
      <div style={{ width: 280, flexShrink: 0 }}>
        <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", overflow: "hidden" }}>
          {/* Cover Photo */}
          <div style={{ height: 100, background: user.cover_photo ? `url(${user.cover_photo}) center/cover` : "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", position: "relative" }}>
            <button style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: 6, padding: "6px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              <span style={{ color: "#fff", fontSize: 10 }}>Edit</span>
            </button>
          </div>
          {/* Profile Header */}
          <div style={{ padding: "0 24px 24px", textAlign: "center", marginTop: -40 }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", margin: "0 auto 12px", overflow: "hidden", border: "3px solid #06FF89", background: "#141414" }}>
              {user.ppic ? (
                <img src={user.ppic} alt={`${user.first_name} ${user.last_name}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: "#06FF89", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "#000" }}>{user.first_name[0]}{user.last_name[0]}</div>
              )}
            </div>
            <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: "0 0 4px" }}>{user.first_name} {user.last_name}</h3>
            <p style={{ color: "#666", fontSize: 13, margin: 0 }}>@{user.user_name}</p>
            {user.is_kyc_verified === "2" && <span style={{ display: "inline-block", marginTop: 8, background: "rgba(6,255,137,0.1)", color: "#06FF89", fontSize: 11, fontWeight: 600, padding: "4px 12px", borderRadius: 20 }}>✓ Verified Account</span>}
            {/* Followers / Following */}
            <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 16, paddingTop: 16, borderTop: "1px solid #1f1f1f" }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: 0 }}>{user.followers_count?.toLocaleString() || 0}</p>
                <p style={{ color: "#666", fontSize: 11, margin: "2px 0 0" }}>Followers</p>
              </div>
              <div style={{ width: 1, background: "#1f1f1f" }} />
              <div style={{ textAlign: "center" }}>
                <p style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: 0 }}>{user.following_count?.toLocaleString() || 0}</p>
                <p style={{ color: "#666", fontSize: 11, margin: "2px 0 0" }}>Following</p>
              </div>
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
              <div>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>User ID</label>
                <div style={{ background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#666", fontSize: 14 }}>{user.short_user_id || user.user_id.slice(0, 8)}</div>
              </div>
              <div>
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
                <input type="password" placeholder="Enter current password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>New Password</label>
                <input type="password" placeholder="Enter new password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Confirm New Password</label>
                <input type="password" placeholder="Confirm new password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <button style={{ background: "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: "#000", border: "none", padding: "14px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 8 }}>Update Password</button>
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
          <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 24 }}>
            <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: "0 0 4px" }}>Privacy Control</h3>
            <p style={{ color: "#666", fontSize: 13, margin: "0 0 24px" }}>Manage who can see your information</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, background: "#0a0a0a", borderRadius: 8 }}>
                <div>
                  <p style={{ color: "#fff", fontSize: 14, fontWeight: 500, margin: 0 }}>Profile Visibility</p>
                  <p style={{ color: "#666", fontSize: 12, margin: "4px 0 0" }}>Control who can view your profile</p>
                </div>
                <select value={privacySettings.profileVisibility} onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })} style={{ background: "#141414", border: "1px solid #333", borderRadius: 6, padding: "8px 12px", color: "#fff", fontSize: 13, outline: "none" }}>
                  <option value="public">Public</option>
                  <option value="friends">Friends Only</option>
                  <option value="private">Private</option>
                </select>
              </div>
              {[
                { key: "showActivity", label: "Show Activity Status", desc: "Let others see when you're active" },
                { key: "allowTagging", label: "Allow Tagging", desc: "Let others tag you in transactions" },
                { key: "showOnlineStatus", label: "Show Online Status", desc: "Display when you're online" },
              ].map((item) => (
                <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16, background: "#0a0a0a", borderRadius: 8 }}>
                  <div>
                    <p style={{ color: "#fff", fontSize: 14, fontWeight: 500, margin: 0 }}>{item.label}</p>
                    <p style={{ color: "#666", fontSize: 12, margin: "4px 0 0" }}>{item.desc}</p>
                  </div>
                  <button onClick={() => setPrivacySettings({ ...privacySettings, [item.key]: !privacySettings[item.key as keyof typeof privacySettings] })} style={{ width: 48, height: 26, borderRadius: 13, background: privacySettings[item.key as keyof typeof privacySettings] ? "#06FF89" : "#333", border: "none", cursor: "pointer", position: "relative", transition: "all 0.2s" }}>
                    <span style={{ position: "absolute", top: 3, left: privacySettings[item.key as keyof typeof privacySettings] ? 25 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "all 0.2s" }} />
                  </button>
                </div>
              ))}
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

  const renderHelpTab = () => (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700, margin: 0 }}>Help & Support</h2>
          <p style={{ color: "#666", fontSize: 14, margin: "4px 0 0" }}>Get help with your account and payments</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button style={{ background: "#06FF89", color: "#000", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>
            Call Support
          </button>
          <button style={{ background: "transparent", color: "#06FF89", border: "1px solid #06FF89", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Live Chat
          </button>
        </div>
      </div>

      {/* Support Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 24, textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(6,255,137,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <h4 style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: "0 0 4px" }}>Live Chat</h4>
          <p style={{ color: "#666", fontSize: 12, margin: "0 0 8px" }}>Get instant help from our support team</p>
          <span style={{ color: "#06FF89", fontSize: 11, fontWeight: 600 }}>Available 24/7</span>
        </div>
        <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 24, textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(0,150,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0096FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <h4 style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: "0 0 4px" }}>Phone Support</h4>
          <p style={{ color: "#666", fontSize: 12, margin: "0 0 8px" }}>Speak directly with a support agent</p>
          <span style={{ color: "#0096FF", fontSize: 11, fontWeight: 600 }}>Mon-Fri 9AM-6PM</span>
        </div>
        <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 24, textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(160,32,240,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A020F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>
          <h4 style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: "0 0 4px" }}>Email Support</h4>
          <p style={{ color: "#666", fontSize: 12, margin: "0 0 8px" }}>Send us a detailed message</p>
          <span style={{ color: "#A020F0", fontSize: 11, fontWeight: 600 }}>Response within 24h</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "#141414", borderRadius: 8, marginBottom: 24, overflow: "hidden" }}>
        {[
          { id: "faq" as const, label: "FAQ" },
          { id: "tickets" as const, label: "Support Tickets" },
          { id: "contact" as const, label: "Contact Us" },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setHelpSubTab(tab.id)} style={{ flex: 1, padding: "14px 24px", background: helpSubTab === tab.id ? "#06FF89" : "transparent", color: helpSubTab === tab.id ? "#000" : "#666", border: "none", fontSize: 14, fontWeight: helpSubTab === tab.id ? 600 : 400, cursor: "pointer" }}>{tab.label}</button>
        ))}
      </div>

      {/* FAQ Section */}
      {helpSubTab === "faq" && (
        <div>
          {/* Search */}
          <div style={{ position: "relative", marginBottom: 24 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Search frequently asked questions..." value={faqSearch} onChange={(e) => setFaqSearch(e.target.value)} style={{ width: "100%", background: "#141414", borderRadius: 8, border: "1px solid #1f1f1f", padding: "14px 16px 14px 48px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* FAQ List */}
            <div>
              <h4 style={{ color: "#06FF89", fontSize: 13, fontWeight: 600, margin: "0 0 16px", textTransform: "uppercase", letterSpacing: 0.5 }}>Frequently Asked Questions</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {filteredFaqs.map((faq, index) => (
                  <button key={index} onClick={() => setSelectedFaq(faq)} style={{ width: "100%", background: selectedFaq?.question === faq.question ? "rgba(6,255,137,0.1)" : "#141414", borderRadius: 8, border: selectedFaq?.question === faq.question ? "1px solid rgba(6,255,137,0.3)" : "1px solid #1f1f1f", padding: 16, textAlign: "left", cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: "#fff", fontSize: 14, fontWeight: 500, margin: "0 0 6px" }}>{faq.question}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ color: faq.category === "Account" ? "#06FF89" : faq.category === "Transfers" ? "#0096FF" : faq.category === "Transaction" ? "#FFC800" : "#A020F0", fontSize: 11, fontWeight: 600 }}>{faq.category}</span>
                          <span style={{ color: "#555", fontSize: 11 }}>👍 {faq.helpful} helpful</span>
                        </div>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Answer Panel */}
            <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 24, height: "fit-content" }}>
              <h4 style={{ color: "#06FF89", fontSize: 13, fontWeight: 600, margin: "0 0 20px", textTransform: "uppercase", letterSpacing: 0.5 }}>Select a question</h4>
              {selectedFaq ? (
                <div>
                  <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: "0 0 16px" }}>{selectedFaq.question}</h3>
                  <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{selectedFaq.answer}</p>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <p style={{ color: "#666", fontSize: 14 }}>Select a question from the list to view the answer</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Support Tickets Section */}
      {helpSubTab === "tickets" && (
        <div>
          {!showNewTicket && !selectedTicket ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: 0 }}>Your Support Tickets</h3>
                <button onClick={() => setShowNewTicket(true)} style={{ background: "#06FF89", color: "#000", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  New Ticket
                </button>
              </div>
              {ticketsLoading ? (
                <div style={{ textAlign: "center", padding: 40, color: "#666" }}>Loading tickets...</div>
              ) : supportTickets.length === 0 ? (
                <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 48, textAlign: "center" }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(6,255,137,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  </div>
                  <h4 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: "0 0 8px" }}>No Support Tickets</h4>
                  <p style={{ color: "#666", fontSize: 13, margin: "0 0 20px" }}>You haven't created any support tickets yet</p>
                  <button onClick={() => setShowNewTicket(true)} style={{ background: "#06FF89", color: "#000", border: "none", padding: "12px 24px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Create Your First Ticket</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {supportTickets.map((ticket) => (
                    <div key={ticket.id} onClick={() => setSelectedTicket(ticket)} style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 20, cursor: "pointer" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div>
                          <h4 style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: "0 0 4px" }}>{ticket.subject}</h4>
                          <p style={{ color: "#666", fontSize: 12, margin: 0 }}>#{ticket.ticket_id} • {ticket.category}</p>
                        </div>
                        <span style={{ background: ticket.status === "open" ? "rgba(6,255,137,0.1)" : ticket.status === "in_progress" ? "rgba(255,200,0,0.1)" : "rgba(102,102,102,0.1)", color: ticket.status === "open" ? "#06FF89" : ticket.status === "in_progress" ? "#FFC800" : "#666", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 4, textTransform: "uppercase" }}>{ticket.status.replace("_", " ")}</span>
                      </div>
                      <p style={{ color: "#888", fontSize: 13, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ticket.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : showNewTicket ? (
            <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <button onClick={() => setShowNewTicket(false)} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", padding: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: 0 }}>Create New Ticket</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Subject</label>
                  <input type="text" placeholder="Brief description of your issue" value={newTicketForm.subject} onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })} style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Category</label>
                    <select value={newTicketForm.category} onChange={(e) => setNewTicketForm({ ...newTicketForm, category: e.target.value })} style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none" }}>
                      <option value="general">General Inquiry</option>
                      <option value="account">Account Issues</option>
                      <option value="payment">Payment Problems</option>
                      <option value="security">Security Concerns</option>
                      <option value="technical">Technical Support</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Priority</label>
                    <select value={newTicketForm.priority} onChange={(e) => setNewTicketForm({ ...newTicketForm, priority: e.target.value })} style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none" }}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Description</label>
                  <textarea placeholder="Please describe your issue in detail..." value={newTicketForm.description} onChange={(e) => setNewTicketForm({ ...newTicketForm, description: e.target.value })} style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", minHeight: 120, resize: "vertical" }} />
                </div>
                <button onClick={handleCreateTicket} style={{ width: "100%", background: "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: "#000", border: "none", padding: "14px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Submit Ticket</button>
              </div>
            </div>
          ) : selectedTicket && (
            <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <button onClick={() => setSelectedTicket(null)} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", padding: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: 0 }}>{selectedTicket.subject}</h3>
                  <p style={{ color: "#666", fontSize: 12, margin: "4px 0 0" }}>#{selectedTicket.ticket_id}</p>
                </div>
                <span style={{ background: selectedTicket.status === "open" ? "rgba(6,255,137,0.1)" : selectedTicket.status === "in_progress" ? "rgba(255,200,0,0.1)" : "rgba(102,102,102,0.1)", color: selectedTicket.status === "open" ? "#06FF89" : selectedTicket.status === "in_progress" ? "#FFC800" : "#666", fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 4, textTransform: "uppercase" }}>{selectedTicket.status.replace("_", " ")}</span>
              </div>
              <div style={{ background: "#0a0a0a", borderRadius: 8, padding: 16, marginBottom: 20 }}>
                <p style={{ color: "#aaa", fontSize: 14, margin: 0, lineHeight: 1.6 }}>{selectedTicket.description}</p>
              </div>
              {selectedTicket.status !== "closed" && (
                <div style={{ display: "flex", gap: 12 }}>
                  <input type="text" placeholder="Type your reply..." value={ticketReply} onChange={(e) => setTicketReply(e.target.value)} style={{ flex: 1, background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none" }} />
                  <button onClick={handleReplyTicket} style={{ background: "#06FF89", color: "#000", border: "none", padding: "12px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Send</button>
                  <button onClick={() => handleCloseTicket(selectedTicket.ticket_id)} style={{ background: "transparent", color: "#ff4444", border: "1px solid rgba(255,68,68,0.3)", padding: "12px 20px", borderRadius: 8, fontSize: 13, cursor: "pointer" }}>Close</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Contact Us Section */}
      {helpSubTab === "contact" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 24 }}>
            <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: "0 0 20px" }}>Send us a Message</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Your Name</label>
                <input type="text" value={`${user?.first_name} ${user?.last_name}`} disabled style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#666", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Email Address</label>
                <input type="email" value={user?.email} disabled style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#666", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Message</label>
                <textarea placeholder="How can we help you?" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", minHeight: 120, resize: "vertical" }} />
              </div>
              <button style={{ width: "100%", background: "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: "#000", border: "none", padding: "14px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Send Message</button>
            </div>
          </div>
          <div>
            <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 24, marginBottom: 16 }}>
              <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, margin: "0 0 20px" }}>Contact Information</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(6,255,137,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <div>
                    <p style={{ color: "#888", fontSize: 12, margin: 0 }}>Email</p>
                    <p style={{ color: "#fff", fontSize: 14, margin: 0 }}>support@vaultpay.com</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(0,150,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0096FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <div>
                    <p style={{ color: "#888", fontSize: 12, margin: 0 }}>Phone</p>
                    <p style={{ color: "#fff", fontSize: 14, margin: 0 }}>+1 (800) 123-4567</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(160,32,240,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A020F0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div>
                    <p style={{ color: "#888", fontSize: 12, margin: 0 }}>Address</p>
                    <p style={{ color: "#fff", fontSize: 14, margin: 0 }}>123 Finance St, New York, NY 10001</p>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", padding: 24 }}>
              <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: "0 0 16px" }}>Business Hours</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#888", fontSize: 13 }}>Monday - Friday</span>
                  <span style={{ color: "#fff", fontSize: 13 }}>9:00 AM - 6:00 PM EST</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#888", fontSize: 13 }}>Saturday</span>
                  <span style={{ color: "#fff", fontSize: 13 }}>10:00 AM - 4:00 PM EST</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#888", fontSize: 13 }}>Sunday</span>
                  <span style={{ color: "#666", fontSize: 13 }}>Closed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

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
                <input type="email" placeholder="Enter your Binance account email" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Amount (USDT)</label>
                <div style={{ display: "flex", alignItems: "center", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px" }}>
                  <span style={{ color: "#26A17B", fontSize: 16, marginRight: 8 }}>₮</span>
                  <input type="text" placeholder="0.00" style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 16, outline: "none" }} />
                  <span style={{ color: "#666", fontSize: 12 }}>USDT</span>
                </div>
              </div>

              <div style={{ background: "#0a0a0a", borderRadius: 8, padding: 16, marginBottom: 20, border: "1px solid #1f1f1f" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10 }}>
                  <span style={{ color: "#666" }}>Network Fee</span>
                  <span style={{ color: "#fff", fontWeight: 500 }}>$1.00 <span style={{ color: "#666", fontWeight: 400 }}>(Fixed)</span></span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 10 }}>
                  <span style={{ color: "#666" }}>You will receive</span>
                  <span style={{ color: "#06FF89", fontWeight: 500 }}>Amount - $1.00</span>
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

              <button style={{ width: "100%", background: "linear-gradient(90deg, #F0B90B 0%, #F8D12F 100%)", color: "#000", border: "none", padding: "14px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
                Withdraw to Binance
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
                    <input type="text" placeholder="Enter bank name" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Account Number</label>
                    <input type="text" placeholder="Enter account number" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Routing Number</label>
                    <input type="text" placeholder="Enter routing number" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Account Holder Name</label>
                    <input type="text" placeholder="Enter account holder name" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Amount</label>
                    <div style={{ display: "flex", alignItems: "center", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px" }}>
                      <span style={{ color: "#06FF89", fontSize: 16, marginRight: 8 }}>$</span>
                      <input type="text" placeholder="0.00" style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 16, outline: "none" }} />
                    </div>
                  </div>
                  <div style={{ background: "#0a0a0a", borderRadius: 8, padding: 12, marginBottom: 16, display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ color: "#666" }}>Transfer Fee</span>
                    <span style={{ color: "#fff" }}>$2.50</span>
                  </div>
                  <button style={{ width: "100%", background: "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: "#000", border: "none", padding: "14px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Continue to Review</button>
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
                    <input type="text" placeholder="e.g., DE89370400440532013000" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>BIC/SWIFT Code</label>
                    <input type="text" placeholder="e.g., COBADEFFXXX" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Beneficiary Name</label>
                    <input type="text" placeholder="Enter beneficiary name" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Payment Reference</label>
                    <input type="text" placeholder="Optional reference" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Amount (EUR)</label>
                    <div style={{ display: "flex", alignItems: "center", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px" }}>
                      <span style={{ color: "#8b5cf6", fontSize: 16, marginRight: 8 }}>€</span>
                      <input type="text" placeholder="0.00" style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 16, outline: "none" }} />
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
                  <button style={{ width: "100%", background: "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: "#000", border: "none", padding: "14px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Continue to Review</button>
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
                    <select style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none" }}>
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
                    <input type="text" placeholder="Enter SWIFT/BIC code" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Account Number / IBAN</label>
                    <input type="text" placeholder="Enter account number or IBAN" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Beneficiary Name</label>
                    <input type="text" placeholder="Enter beneficiary full name" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Beneficiary Address</label>
                    <input type="text" placeholder="Enter beneficiary address" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Transfer Purpose</label>
                    <select style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none" }}>
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
                      <input type="text" placeholder="0.00" style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 16, outline: "none" }} />
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
                  <button style={{ width: "100%", background: "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: "#000", border: "none", padding: "14px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Continue to Review</button>
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
          {/* Add Wallet Button - show only if less than 4 wallets */}
          {walletCurrencies.length < 4 && (
            <button onClick={() => alert("Add wallet feature coming soon! You can add up to " + (4 - walletCurrencies.length) + " more wallet(s).")} style={{ padding: "16px 20px", background: "#0a0a0a", cursor: "pointer", border: "none", borderLeft: "3px solid transparent", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 70 }}>
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
            const type = getTransactionType(txn);
            const status = getTransactionStatus(txn.status);
            const amount = parseFloat(txn.amount) || 0;
            return (
              <div key={txn.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: i < walletTransactions.length - 1 ? "1px solid #1a1a1a" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: type === "incoming" ? "#06FF89" : "#ff6b6b" }} />
                  <div><div style={{ color: "#fff", fontSize: 14 }}>{txn.name || txn.description || "Transaction " + txn.txnCode}</div><div style={{ color: "#666", fontSize: 12, marginTop: 2 }}>{formatDate(txn.CreatedDTM)}</div></div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ color: type === "incoming" ? "#06FF89" : "#fff", fontSize: 14, fontWeight: 600 }}>{type === "incoming" ? "+" : "-"}{formatCurrency(Math.abs(amount), txn.currency || selectedCurrency)}</span>
                  <span style={{ background: status === "completed" ? "rgba(6,255,137,0.1)" : status === "pending" ? "rgba(245,158,11,0.1)" : "rgba(255,107,107,0.1)", color: status === "completed" ? "#06FF89" : status === "pending" ? "#f59e0b" : "#ff6b6b", fontSize: 11, padding: "4px 10px", borderRadius: 20 }}>{status}</span>
                </div>
              </div>
            );
          }) : <div style={{ padding: "40px 20px", textAlign: "center", color: "#666" }}>No {selectedCurrency} transactions found</div>}
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
    if (activeTab === "profile") return renderProfileTab();
    if (activeTab === "settings") return renderSettingsTab();
    if (activeTab === "helpdesk") return renderHelpTab();
    return renderDashboardTab();
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", background: "#0a0a0a", fontFamily: "system-ui", overflow: "auto" }}>
      <aside style={{ width: 220, background: "#0f0f0f", borderRight: "1px solid #1a1a1a", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100 }}>
        <div style={{ padding: "20px 16px", borderBottom: "1px solid #1a1a1a" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <Image unoptimized src="/vault_logo_icon_white.svg" alt="VP" width={28} height={28} className="no-fade" />
            <span style={{ color: "#fff", fontSize: 18, fontWeight: 600 }}>vaultpay</span>
          </Link>
        </div>
        <div style={{ padding: 16, borderBottom: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: 10 }}>
          {user.ppic ? (
            <img src={user.ppic} alt={`${user.first_name} ${user.last_name}`} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
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
      <main style={{ flex: 1, marginLeft: 220, padding: "24px 32px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 28, position: "relative" }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 600, color: "#fff", margin: 0 }}>{tabInfo.title}</h1>
            <p style={{ fontSize: 14, color: "#666", margin: "4px 0 0" }}>{tabInfo.subtitle}</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {activeTab === "cards" ? (
              <>
                <button onClick={() => setShowCardNumbers(!showCardNumbers)} style={{ background: "transparent", color: "#fff", border: "1px solid #333", padding: "10px 20px", borderRadius: 8, fontSize: 14, cursor: "pointer" }}>{showCardNumbers ? "Hide Numbers" : "Show Numbers"}</button>
                <button style={{ background: "#06FF89", color: "#000", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>+ Add Card</button>
              </>
            ) : activeTab === "qrcodes" ? (
              <button onClick={() => setQrSubTab("scanner")} style={{ background: "#06FF89", color: "#000", border: "none", padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>+ Scan QR code</button>
            ) : (
              <>
                {/* Notification Icon */}
                <button style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, padding: 10, cursor: "pointer", position: "relative" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                  {notificationCount > 0 && <span style={{ position: "absolute", top: -4, right: -4, background: "#ff4444", color: "#fff", fontSize: 10, fontWeight: 600, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{notificationCount}</span>}
                </button>
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
            <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 8, background: "#141414", borderRadius: 12, border: "1px solid #1f1f1f", width: 380, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", zIndex: 100 }}>
              {/* Tabs */}
              <div style={{ display: "flex", borderBottom: "1px solid #1f1f1f" }}>
                {[
                  { id: "create" as const, label: "New Request" },
                  { id: "pending" as const, label: "Pending" },
                  { id: "history" as const, label: "History" },
                ].map((tab) => (
                  <button key={tab.id} onClick={() => setRequestPaymentTab(tab.id)} style={{ flex: 1, padding: "12px 16px", background: "transparent", border: "none", color: requestPaymentTab === tab.id ? "#06FF89" : "#666", fontSize: 13, fontWeight: requestPaymentTab === tab.id ? 600 : 400, cursor: "pointer", borderBottom: requestPaymentTab === tab.id ? "2px solid #06FF89" : "2px solid transparent" }}>{tab.label}</button>
                ))}
              </div>

              <div style={{ padding: 16 }}>
                {requestPaymentTab === "create" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div>
                      <label style={{ color: "#888", fontSize: 11, display: "block", marginBottom: 4 }}>Email Address</label>
                      <input type="email" placeholder="recipient@email.com" value={requestForm.email} onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })} style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "10px 12px", color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label style={{ color: "#888", fontSize: 11, display: "block", marginBottom: 4 }}>Amount (USD)</label>
                      <div style={{ display: "flex", alignItems: "center", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "10px 12px" }}>
                        <span style={{ color: "#06FF89", fontSize: 14, marginRight: 6 }}>$</span>
                        <input type="text" placeholder="0.00" value={requestForm.amount} onChange={(e) => setRequestForm({ ...requestForm, amount: e.target.value })} style={{ flex: 1, background: "transparent", border: "none", color: "#fff", fontSize: 14, outline: "none" }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ color: "#888", fontSize: 11, display: "block", marginBottom: 4 }}>Note (optional)</label>
                      <input type="text" placeholder="What's this for?" value={requestForm.note} onChange={(e) => setRequestForm({ ...requestForm, note: e.target.value })} style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "10px 12px", color: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <button disabled={!requestForm.email || !requestForm.amount || requestLoading} onClick={() => { setRequestLoading(true); setTimeout(() => { setPaymentRequests([{ id: Date.now().toString(), email: requestForm.email, amount: parseFloat(requestForm.amount), status: "pending", created_at: new Date().toISOString(), note: requestForm.note }, ...paymentRequests]); setRequestForm({ email: "", amount: "", note: "" }); setRequestLoading(false); setRequestPaymentTab("pending"); }, 1000); }} style={{ width: "100%", background: (!requestForm.email || !requestForm.amount) ? "#333" : "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: (!requestForm.email || !requestForm.amount) ? "#666" : "#000", border: "none", padding: "12px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: (!requestForm.email || !requestForm.amount) ? "not-allowed" : "pointer" }}>{requestLoading ? "Sending..." : "Send Request"}</button>
                  </div>
                )}

                {requestPaymentTab === "pending" && (
                  <div>
                    {paymentRequests.filter(r => r.status === "pending").length === 0 ? (
                      <div style={{ textAlign: "center", padding: "24px 0" }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        <p style={{ color: "#666", fontSize: 13, margin: 0 }}>No pending requests</p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {paymentRequests.filter(r => r.status === "pending").map((req) => (
                          <div key={req.id} style={{ background: "#0a0a0a", borderRadius: 8, padding: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                              <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>{req.email}</span>
                              <span style={{ color: "#06FF89", fontSize: 14, fontWeight: 600 }}>${req.amount.toFixed(2)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ color: "#666", fontSize: 11 }}>{new Date(req.created_at).toLocaleDateString()}</span>
                              <span style={{ background: "rgba(255,200,0,0.1)", color: "#FFC800", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4 }}>PENDING</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {requestPaymentTab === "history" && (
                  <div>
                    {paymentRequests.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "24px 0" }}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <p style={{ color: "#666", fontSize: 13, margin: 0 }}>No request history</p>
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 240, overflow: "auto" }}>
                        {paymentRequests.map((req) => (
                          <div key={req.id} style={{ background: "#0a0a0a", borderRadius: 8, padding: 12 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                              <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>{req.email}</span>
                              <span style={{ color: req.status === "accepted" ? "#06FF89" : req.status === "declined" ? "#ff4444" : "#fff", fontSize: 14, fontWeight: 600 }}>${req.amount.toFixed(2)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ color: "#666", fontSize: 11 }}>{new Date(req.created_at).toLocaleDateString()}</span>
                              <span style={{ background: req.status === "pending" ? "rgba(255,200,0,0.1)" : req.status === "accepted" ? "rgba(6,255,137,0.1)" : req.status === "declined" ? "rgba(255,68,68,0.1)" : "rgba(102,102,102,0.1)", color: req.status === "pending" ? "#FFC800" : req.status === "accepted" ? "#06FF89" : req.status === "declined" ? "#ff4444" : "#666", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>{req.status}</span>
                            </div>
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
                      <img src={recipientInfo.ppic} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
                  {/* Plaid - Featured */}
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
                  {[
                    { id: "crypto", label: "Crypto", desc: "BTC, ETH, USDT & more", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F7931A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.5 9.5c0-1.5 1.5-2 3-2s2.5.5 2.5 2-1 1.5-2.5 2h-1v3h2c1.5 0 2.5.5 2.5 2s-1 2-2.5 2-3-.5-3-2"/><path d="M12 5.5v2m0 9v2"/></svg>, color: "#F7931A" },
                    { id: "card", label: "Credit/Debit Card", desc: "Visa, Mastercard, Amex", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0096FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, color: "#0096FF" },
                    { id: "giftcard", label: "Gift Card", desc: "Redeem gift card codes", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A020F0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>, color: "#A020F0" },
                    { id: "web3", label: "Web3 Wallet", desc: "MetaMask, WalletConnect", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#06FF89" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><circle cx="18" cy="12" r="2"/></svg>, color: "#06FF89" },
                    { id: "bank", label: "Bank Transfer", desc: "Direct bank deposit", icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFC800" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>, color: "#FFC800" },
                  ].map((method) => (
                    <button key={method.id} onClick={() => setSelectedTopUpMethod(method.id)} style={{ background: "#0a0a0a", borderRadius: 12, border: "1px solid #1f1f1f", padding: 20, textAlign: "left", cursor: "pointer", transition: "all 0.2s" }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: `${method.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>{method.icon}</div>
                      <h4 style={{ color: "#fff", fontSize: 15, fontWeight: 600, margin: "0 0 4px" }}>{method.label}</h4>
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
                      <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600, margin: "0 0 16px" }}>Deposit Crypto</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {[
                          { symbol: "BTC", name: "Bitcoin", icon: "₿", color: "#F7931A" },
                          { symbol: "ETH", name: "Ethereum", icon: "Ξ", color: "#627EEA" },
                          { symbol: "USDT", name: "Tether", icon: "₮", color: "#26A17B" },
                          { symbol: "USDC", name: "USD Coin", icon: "$", color: "#2775CA" },
                        ].map((coin) => (
                          <button key={coin.symbol} style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, background: "#0a0a0a", borderRadius: 8, border: "1px solid #1f1f1f", cursor: "pointer", textAlign: "left" }}>
                            <div style={{ width: 40, height: 40, borderRadius: "50%", background: `${coin.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: coin.color }}>{coin.icon}</div>
                            <div style={{ flex: 1 }}>
                              <p style={{ color: "#fff", fontSize: 14, fontWeight: 500, margin: 0 }}>{coin.symbol}</p>
                              <p style={{ color: "#666", fontSize: 12, margin: 0 }}>{coin.name}</p>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                          </button>
                        ))}
                      </div>
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
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                          <label style={{ color: "#888", fontSize: 12, display: "block", marginBottom: 6 }}>Gift Card Code</label>
                          <input type="text" placeholder="Enter gift card code" style={{ width: "100%", background: "#0a0a0a", borderRadius: 8, border: "1px solid #333", padding: "14px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", letterSpacing: 2, textTransform: "uppercase" }} />
                        </div>
                        <button style={{ width: "100%", background: "linear-gradient(90deg, #06FF89 0%, #B8FF9F 100%)", color: "#000", border: "none", padding: "14px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Redeem Gift Card</button>
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
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#666", fontSize: 12 }}>Bank Name</span>
                            <span style={{ color: "#fff", fontSize: 13 }}>VaultPay Trust Bank</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#666", fontSize: 12 }}>Account Number</span>
                            <span style={{ color: "#fff", fontSize: 13, fontFamily: "monospace" }}>1234567890</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#666", fontSize: 12 }}>Routing Number</span>
                            <span style={{ color: "#fff", fontSize: 13, fontFamily: "monospace" }}>021000021</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#666", fontSize: 12 }}>Reference</span>
                            <span style={{ color: "#06FF89", fontSize: 13, fontFamily: "monospace" }}>{user?.short_user_id || "VP123456"}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ background: "rgba(255,200,0,0.1)", borderRadius: 8, padding: 12, display: "flex", gap: 10 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFC800"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                        <p style={{ color: "#FFC800", fontSize: 12, margin: 0, lineHeight: 1.5 }}>Always include your reference code. Transfers typically arrive within 1-3 business days.</p>
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
