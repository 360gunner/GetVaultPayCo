"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { vars } from "@/styles/theme.css";
import Typography from "@/components/Typography/Typography";
import { fluidUnit } from "@/styles/fluid-unit";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Script from "next/script";

interface BusinessData {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  phoneCountryCode: string;
  businessAddress: string;
  industry: string;
  website: string;
  storeType: "retail" | "digital" | "";
  streetAddress: string;
  city: string;
  zipCode: string;
  state: string;
  ein: string;
  acceptTerms: boolean;
  acceptBusinessFees: boolean;
  qrKitBundle: boolean;
  billingAddress: string;
  billingCity: string;
  billingZipCode: string;
  billingState: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryZipCode: string;
  deliveryState: string;
  sameAsBusinessAddress: boolean;
}

export default function BusinessSignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneCountdown, setPhoneCountdown] = useState(60);
  const [emailCountdown, setEmailCountdown] = useState(60);
  const [canResendPhone, setCanResendPhone] = useState(false);
  const [canResendEmail, setCanResendEmail] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");

  const [formData, setFormData] = useState<BusinessData>({
    businessName: "",
    businessEmail: "",
    businessPhone: "",
    phoneCountryCode: "+1",
    businessAddress: "",
    industry: "",
    website: "",
    storeType: "",
    streetAddress: "",
    city: "",
    zipCode: "",
    state: "",
    ein: "",
    acceptTerms: false,
    acceptBusinessFees: false,
    qrKitBundle: false,
    billingAddress: "",
    billingCity: "",
    billingZipCode: "",
    billingState: "",
    deliveryAddress: "",
    deliveryCity: "",
    deliveryZipCode: "",
    deliveryState: "",
    sameAsBusinessAddress: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const personalEmailDomains = [
    "gmail.com", "yahoo.com", "outlook.com", "hotmail.com",
    "aol.com", "icloud.com", "protonmail.com", "mail.com"
  ];

  const validateBusinessEmail = (email: string) => {
    const domain = email.split("@")[1]?.toLowerCase();
    return !personalEmailDomains.includes(domain);
  };

  // Countdown timers for OTP
  useEffect(() => {
    if (showOtpVerification && phoneCountdown > 0) {
      const timer = setTimeout(() => setPhoneCountdown(phoneCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phoneCountdown === 0) {
      setCanResendPhone(true);
    }
  }, [showOtpVerification, phoneCountdown]);

  useEffect(() => {
    if (showOtpVerification && emailCountdown > 0) {
      const timer = setTimeout(() => setEmailCountdown(emailCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (emailCountdown === 0) {
      setCanResendEmail(true);
    }
  }, [showOtpVerification, emailCountdown]);

  // Cloudflare Turnstile callback
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).onTurnstileCallback = (token: string) => {
        setCaptchaToken(token);
      };
    }
  }, []);

  const sendOtps = () => {
    // TODO: Send OTP to business phone and email
    console.log("Sending OTP to phone:", formData.phoneCountryCode + formData.businessPhone);
    console.log("Sending OTP to email:", formData.businessEmail);
    setShowOtpVerification(true);
    setPhoneCountdown(60);
    setEmailCountdown(60);
    setCanResendPhone(false);
    setCanResendEmail(false);
    setPhoneOtp("");
    setEmailOtp("");
    setPhoneVerified(false);
    setEmailVerified(false);
  };

  const verifyPhoneOtp = () => {
    if (phoneOtp.length !== 6) {
      setErrors({ phoneOtp: "Please enter 6-digit code" });
      return;
    }
    // TODO: Verify phone OTP with backend
    console.log("Verifying phone OTP:", phoneOtp);
    setPhoneVerified(true);
    setErrors({});
  };

  const verifyEmailOtp = () => {
    if (emailOtp.length !== 6) {
      setErrors({ emailOtp: "Please enter 6-digit code" });
      return;
    }
    // TODO: Verify email OTP with backend
    console.log("Verifying email OTP:", emailOtp);
    setEmailVerified(true);
    setErrors({});
  };

  const proceedAfterVerification = () => {
    if (phoneVerified && emailVerified) {
      setShowOtpVerification(false);
      setCurrentStep(3);
    } else {
      setErrors({ verification: "Please verify both phone and email" });
    }
  };

  const resendPhoneOtp = () => {
    if (canResendPhone) {
      console.log("Resending phone OTP");
      setPhoneCountdown(60);
      setCanResendPhone(false);
      setPhoneOtp("");
    }
  };

  const resendEmailOtp = () => {
    if (canResendEmail) {
      console.log("Resending email OTP");
      setEmailCountdown(60);
      setCanResendEmail(false);
      setEmailOtp("");
    }
  };

  const handleNext = () => {
    setErrors({});

    switch (currentStep) {
      case 2:
        if (!formData.businessName) {
          setErrors({ businessName: "Business name is required" });
          return;
        }
        if (!formData.businessEmail) {
          setErrors({ businessEmail: "Business email is required" });
          return;
        }
        if (!validateBusinessEmail(formData.businessEmail)) {
          setErrors({ businessEmail: "Please use a business email (not Gmail, Outlook, etc.)" });
          return;
        }
        if (!formData.businessPhone) {
          setErrors({ businessPhone: "Business phone is required" });
          return;
        }
        if (!formData.businessAddress) {
          setErrors({ businessAddress: "Business address is required" });
          return;
        }
        if (!formData.industry) {
          setErrors({ industry: "Industry is required" });
          return;
        }
        // Send OTPs to phone and email instead of going to next step
        sendOtps();
        return;

      case 3:
        if (!formData.storeType) {
          setErrors({ storeType: "Please select a store type" });
          return;
        }
        break;

      case 4:
        if (formData.storeType === "digital") {
          if (!formData.streetAddress || !formData.city || !formData.zipCode || !formData.state || !formData.ein) {
            setErrors({ address: "All fields are required" });
            return;
          }
          if (formData.ein.length !== 9) {
            setErrors({ ein: "EIN must be 9 digits" });
            return;
          }
        }
        if (formData.storeType === "retail") {
          if (!formData.streetAddress || !formData.city || !formData.zipCode || !formData.state || !formData.ein || !formData.website) {
            setErrors({ address: "All fields including website are required" });
            return;
          }
          if (formData.ein.length !== 9) {
            setErrors({ ein: "EIN must be 9 digits" });
            return;
          }
          if (formData.qrKitBundle) {
            if (!formData.billingAddress || !formData.billingCity || !formData.billingZipCode || !formData.billingState) {
              setErrors({ billing: "Billing address is required for QR kit bundle" });
              return;
            }
            if (!formData.deliveryAddress || !formData.deliveryCity || !formData.deliveryZipCode || !formData.deliveryState) {
              setErrors({ delivery: "Delivery address is required for QR kit bundle" });
              return;
            }
          }
        }
        break;

      case 5:
        if (!formData.acceptTerms) {
          setErrors({ terms: "You must accept the terms and conditions" });
          return;
        }
        if (!formData.acceptBusinessFees) {
          setErrors({ fees: "You must accept the business fees" });
          return;
        }
        // Captcha validation - Optional in DEV mode
        // if (!captchaToken) {
        //   setErrors({ captcha: "Please complete the captcha verification" });
        //   return;
        // }
        console.log("Business signup submitted:", formData, "Captcha:", captchaToken || "Dev mode - no captcha");
        setShowSuccess(true);
        return;
    }

    setCurrentStep(currentStep + 1);
  };

  // Success Screen
  if (showSuccess) {
    return (
      <div style={{
        background: vars.color.vpGreen,
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: fluidUnit(20),
      }}>
        <div style={{ textAlign: 'center', maxWidth: 700, padding: fluidUnit(40) }}>
          <div style={{
            width: fluidUnit(120),
            height: fluidUnit(120),
            background: vars.color.vaultWhite,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            marginBottom: fluidUnit(32),
            border: `4px solid ${vars.color.vaultBlack}`,
          }}>
            <span style={{ fontSize: fluidUnit(60), color: vars.color.neonMint }}>✓</span>
          </div>

          <Typography as="h1" style={{ fontSize: fluidUnit(48), fontWeight: 700, marginBottom: fluidUnit(16), color: vars.color.vaultBlack }}>
            Thank You for Your Submission!
          </Typography>

          <Typography as="p" style={{ fontSize: fluidUnit(20), marginBottom: fluidUnit(32), color: vars.color.vaultBlack, lineHeight: 1.6 }}>
            Our team is reviewing your application and will get back to you within <strong>3 business days</strong>.
          </Typography>

          <div style={{
            padding: fluidUnit(32),
            background: 'rgba(255,255,255,0.7)',
            borderRadius: fluidUnit(16),
            border: `2px solid ${vars.color.vaultBlack}`,
            textAlign: 'left',
          }}>
            <Typography as="h3" style={{ fontSize: fluidUnit(20), fontWeight: 700, marginBottom: fluidUnit(16), color: vars.color.vaultBlack }}>
              What happens next?
            </Typography>
            <ul style={{ fontSize: fluidUnit(16), lineHeight: 1.8, color: vars.color.vaultBlack, paddingLeft: fluidUnit(20) }}>
              <li>Our team will verify your business information</li>
              <li>We'll check your EIN with IRS records</li>
              <li>You'll receive an email with the application status</li>
              <li>Once approved, you can start accepting payments</li>
            </ul>
          </div>

          {/* Download VaultPay Merchant App */}
          <div style={{
            padding: fluidUnit(32),
            background: 'rgba(255,255,255,0.9)',
            borderRadius: fluidUnit(16),
            border: `3px solid ${vars.color.vaultBlack}`,
            textAlign: 'center',
            marginTop: fluidUnit(32),
            boxShadow: '6px 6px 0px 0px rgba(0,0,0,0.2)'
          }}>
            <Typography as="h3" style={{ fontSize: fluidUnit(24), fontWeight: 700, marginBottom: fluidUnit(16), color: vars.color.vaultBlack }}>
              📱 Download VaultPay Merchant App
            </Typography>
            <Typography as="p" style={{ fontSize: fluidUnit(14), marginBottom: fluidUnit(24), color: vars.color.muted }}>
              Scan the QR code to download the app and manage your business on the go
            </Typography>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: fluidUnit(24), marginTop: fluidUnit(24) }}>
              {/* iOS QR Code */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: fluidUnit(150), 
                  height: fluidUnit(150), 
                  margin: '0 auto',
                  background: vars.color.vaultWhite,
                  padding: fluidUnit(8),
                  borderRadius: fluidUnit(12),
                  border: `2px solid ${vars.color.vaultBlack}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: fluidUnit(12)
                }}>
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://apps.apple.com/app/vaultpay-merchant"
                    alt="iOS App QR Code"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <Typography as="p" style={{ fontSize: fluidUnit(16), fontWeight: 700, color: vars.color.vaultBlack }}>
                  iOS App
                </Typography>
                <Typography as="p" style={{ fontSize: fluidUnit(12), color: vars.color.muted }}>
                  iPhone & iPad
                </Typography>
              </div>

              {/* Android QR Code */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  width: fluidUnit(150), 
                  height: fluidUnit(150), 
                  margin: '0 auto',
                  background: vars.color.vaultWhite,
                  padding: fluidUnit(8),
                  borderRadius: fluidUnit(12),
                  border: `2px solid ${vars.color.vaultBlack}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: fluidUnit(12)
                }}>
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://play.google.com/store/apps/details?id=com.vaultpay.merchant"
                    alt="Android App QR Code"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <Typography as="p" style={{ fontSize: fluidUnit(16), fontWeight: 700, color: vars.color.vaultBlack }}>
                  Android App
                </Typography>
                <Typography as="p" style={{ fontSize: fluidUnit(12), color: vars.color.muted }}>
                  All Android devices
                </Typography>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push("/")}
            style={{
              marginTop: fluidUnit(32),
              padding: `${fluidUnit(16)} ${fluidUnit(48)}`,
              background: vars.color.vaultBlack,
              color: vars.color.vaultWhite,
              border: 'none',
              borderRadius: fluidUnit(50),
              fontSize: fluidUnit(18),
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Main Layout
  return (
    <>
      {/* Cloudflare Turnstile Script */}
      <Script 
        src="https://challenges.cloudflare.com/turnstile/v0/api.js" 
        strategy="lazyOnload"
      />
      
      <div style={{
        background: vars.color.vpGreen,
        minHeight: "100vh",
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
      }}>
        <Navbar />

      <main style={{ minHeight: "calc(100vh - 80px)", display: "flex", alignItems: "center", padding: `${fluidUnit(100)} ${fluidUnit(20)} ${fluidUnit(40)}` }}>
        <div style={{ width: "100%", maxWidth: currentStep === 1 ? 1200 : 600, margin: "0 auto" }}>
          
          {/* Step 1: Hero with Image */}
          {currentStep === 1 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: fluidUnit(60), alignItems: "start" }}>
              {/* Image */}
              <div>
                <div style={{ position: "relative", borderRadius: fluidUnit(24), overflow: "hidden", border: `3px solid ${vars.color.vaultBlack}`, boxShadow: '8px 8px 0px 0px rgba(0,0,0,0.1)', marginBottom: fluidUnit(20) }}>
                  <Image
                    src="/business-hero.png"
                    alt="Business Owner in Store"
                    width={600}
                    height={900}
                    style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
                    priority
                  />
                </div>

                {/* Badges below image */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: fluidUnit(12) }}>
                  {/* Live Rush Badge */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: fluidUnit(8), 
                    padding: `${fluidUnit(10)} ${fluidUnit(16)}`, 
                    background: '#FFD700',
                    borderRadius: fluidUnit(12),
                    border: `2px solid ${vars.color.vaultBlack}`,
                    boxShadow: '3px 3px 0px 0px rgba(0,0,0,0.2)'
                  }}>
                    <span style={{ fontSize: fluidUnit(20) }}>⚡</span>
                    <div style={{ flex: 1 }}>
                      <Typography as="span" style={{ fontSize: fluidUnit(14), fontWeight: 700, color: vars.color.vaultBlack }}>
                        Live Rush included
                      </Typography>
                      <Typography as="span" style={{ fontSize: fluidUnit(11), color: '#666', fontStyle: 'italic', marginLeft: fluidUnit(6) }}>
                        *terms apply
                      </Typography>
                    </div>
                  </div>

                  {/* Create Ads Campaigns Badge */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: fluidUnit(8), 
                    padding: `${fluidUnit(10)} ${fluidUnit(16)}`, 
                    background: '#FF6B9D',
                    borderRadius: fluidUnit(12),
                    border: `2px solid ${vars.color.vaultBlack}`,
                    boxShadow: '3px 3px 0px 0px rgba(0,0,0,0.2)'
                  }}>
                    <span style={{ fontSize: fluidUnit(20) }}>📢</span>
                    <div style={{ flex: 1 }}>
                      <Typography as="span" style={{ fontSize: fluidUnit(14), fontWeight: 700, color: vars.color.vaultWhite }}>
                        Create Ads campaigns included
                      </Typography>
                    </div>
                  </div>

                  {/* API Developers Badge */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: fluidUnit(8), 
                    padding: `${fluidUnit(10)} ${fluidUnit(16)}`, 
                    background: '#00D4AA',
                    borderRadius: fluidUnit(12),
                    border: `2px solid ${vars.color.vaultBlack}`,
                    boxShadow: '3px 3px 0px 0px rgba(0,0,0,0.2)'
                  }}>
                    <span style={{ fontSize: fluidUnit(20) }}>💻</span>
                    <div style={{ flex: 1 }}>
                      <Typography as="span" style={{ fontSize: fluidUnit(14), fontWeight: 700, color: vars.color.vaultWhite }}>
                        API developers included
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div>
                <Typography as="h1" style={{ fontSize: fluidUnit(56), fontWeight: 700, marginBottom: fluidUnit(24), color: vars.color.vaultBlack, lineHeight: 1.1 }}>
                  Take Your Business to the Next Level with VaultPay
                </Typography>

                <Typography as="p" style={{ fontSize: fluidUnit(20), marginBottom: fluidUnit(32), color: vars.color.vaultBlack, lineHeight: 1.6 }}>
                  Join thousands of businesses accepting payments, managing expenses, and growing globally with VaultPay's powerful platform.
                </Typography>

                <div style={{ marginBottom: fluidUnit(32) }}>
                  {["Accept payments anywhere", "Team cards & expense management", "Real-time analytics", "Multi-currency support", "Dedicated business support"].map((feature, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: fluidUnit(12), marginBottom: fluidUnit(12) }}>
                      <span style={{ fontSize: fluidUnit(24), color: vars.color.neonMint }}>✓</span>
                      <Typography as="span" style={{ fontSize: fluidUnit(18), fontWeight: 600, color: vars.color.vaultBlack }}>
                        {feature}
                      </Typography>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentStep(2)}
                  style={{
                    width: "100%",
                    padding: fluidUnit(20),
                    background: vars.color.vaultBlack,
                    color: vars.color.vaultWhite,
                    border: 'none',
                    borderRadius: fluidUnit(50),
                    fontSize: fluidUnit(20),
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Start Application →
                </button>

                <Typography as="p" style={{ fontSize: fluidUnit(12), marginTop: fluidUnit(16), color: vars.color.muted, textAlign: "center" }}>
                  📍 Currently available for US businesses only
                </Typography>
              </div>
            </div>
          )}

          {/* Steps 2-5: Form Steps */}
          {currentStep > 1 && (
            <>
              {/* Progress Bar */}
              <div style={{ marginBottom: fluidUnit(40) }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: fluidUnit(16), marginBottom: fluidUnit(12) }}>
                  {currentStep > 2 && (
                    <button onClick={() => setCurrentStep(currentStep - 1)} style={{ background: 'transparent', border: 'none', fontSize: fluidUnit(32), cursor: 'pointer', color: vars.color.vaultBlack }}>←</button>
                  )}
                  <div style={{ flex: 1, height: 4, background: 'rgba(0,0,0,0.1)', borderRadius: 2 }}>
                    <div style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`, height: '100%', background: vars.color.vaultBlack, borderRadius: 2, transition: 'width 0.3s' }} />
                  </div>
                  <Typography as="span" style={{ fontSize: fluidUnit(14), fontWeight: 600, color: vars.color.vaultBlack }}>{currentStep - 1}/{totalSteps - 1}</Typography>
                </div>
              </div>

              {/* Step 2: Business Info */}
              {currentStep === 2 && !showOtpVerification && (
                <>
                  <Typography as="h2" style={{ fontSize: fluidUnit(32), fontWeight: 700, marginBottom: fluidUnit(32), color: vars.color.vaultBlack }}>
                    Tell us about your business
                  </Typography>

                  <div style={{ marginBottom: fluidUnit(24) }}>
                    <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>Business Name *</label>
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      placeholder="Your Company LLC"
                      style={{
                        width: "100%",
                        padding: fluidUnit(16),
                        borderRadius: fluidUnit(12),
                        border: `2px solid ${errors.businessName ? '#c62828' : vars.color.vaultBlack}`,
                        fontSize: fluidUnit(16),
                        backgroundColor: 'rgba(255,255,255,0.9)',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: fluidUnit(24) }}>
                    <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>Business Email *</label>
                    <input
                      type="email"
                      value={formData.businessEmail}
                      onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                      placeholder="contact@yourcompany.com"
                      style={{
                        width: "100%",
                        padding: fluidUnit(16),
                        borderRadius: fluidUnit(12),
                        border: `2px solid ${errors.businessEmail ? '#c62828' : vars.color.vaultBlack}`,
                        fontSize: fluidUnit(16),
                        backgroundColor: 'rgba(255,255,255,0.9)',
                      }}
                    />
                    {errors.businessEmail && (
                      <Typography as="p" style={{ color: '#c62828', fontSize: fluidUnit(12), marginTop: fluidUnit(4) }}>
                        {errors.businessEmail}
                      </Typography>
                    )}
                    <Typography as="p" style={{ fontSize: fluidUnit(12), color: '#666', marginTop: fluidUnit(4) }}>
                      Personal emails (Gmail, Outlook) are not accepted
                    </Typography>
                  </div>

                  <div style={{ marginBottom: fluidUnit(24), display: "grid", gridTemplateColumns: "120px 1fr", gap: fluidUnit(12) }}>
                    <div>
                      <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>Code</label>
                      <input
                        type="text"
                        value={formData.phoneCountryCode}
                        disabled
                        style={{
                          width: "100%",
                          padding: fluidUnit(16),
                          borderRadius: fluidUnit(12),
                          border: `2px solid ${vars.color.vaultBlack}`,
                          fontSize: fluidUnit(16),
                          backgroundColor: 'rgba(0,0,0,0.05)',
                          cursor: 'not-allowed',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>Business Phone *</label>
                      <input
                        type="tel"
                        value={formData.businessPhone}
                        onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                        placeholder="(555) 123-4567"
                        style={{
                          width: "100%",
                          padding: fluidUnit(16),
                          borderRadius: fluidUnit(12),
                          border: `2px solid ${errors.businessPhone ? '#c62828' : vars.color.vaultBlack}`,
                          fontSize: fluidUnit(16),
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: fluidUnit(24) }}>
                    <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>Business Address *</label>
                    <input
                      type="text"
                      value={formData.businessAddress}
                      onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                      placeholder="123 Business St, City, State, ZIP"
                      style={{
                        width: "100%",
                        padding: fluidUnit(16),
                        borderRadius: fluidUnit(12),
                        border: `2px solid ${errors.businessAddress ? '#c62828' : vars.color.vaultBlack}`,
                        fontSize: fluidUnit(16),
                        backgroundColor: 'rgba(255,255,255,0.9)',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: fluidUnit(24) }}>
                    <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>Industry *</label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      style={{
                        width: "100%",
                        padding: fluidUnit(16),
                        borderRadius: fluidUnit(12),
                        border: `2px solid ${errors.industry ? '#c62828' : vars.color.vaultBlack}`,
                        fontSize: fluidUnit(16),
                        backgroundColor: 'rgba(255,255,255,0.9)',
                      }}
                    >
                      <option value="">Select industry</option>
                      <option value="retail">Retail</option>
                      <option value="ecommerce">E-commerce</option>
                      <option value="food">Food & Beverage</option>
                      <option value="technology">Technology</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="professional">Professional Services</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: fluidUnit(24) }}>
                    <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>Website (Optional)</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://yourcompany.com"
                      style={{
                        width: "100%",
                        padding: fluidUnit(16),
                        borderRadius: fluidUnit(12),
                        border: `2px solid ${vars.color.vaultBlack}`,
                        fontSize: fluidUnit(16),
                        backgroundColor: 'rgba(255,255,255,0.9)',
                      }}
                    />
                  </div>
                </>
              )}

              {/* OTP Verification - Phone & Email */}
              {currentStep === 2 && showOtpVerification && (
                <>
                  <Typography as="h2" style={{ fontSize: fluidUnit(32), fontWeight: 700, marginBottom: fluidUnit(16), color: vars.color.vaultBlack }}>
                    Verify your identity
                  </Typography>
                  
                  <Typography as="p" style={{ fontSize: fluidUnit(16), marginBottom: fluidUnit(32), color: vars.color.muted }}>
                    We've sent verification codes to your phone and email
                  </Typography>

                  {/* Phone OTP */}
                  <div style={{ marginBottom: fluidUnit(24), padding: fluidUnit(20), background: 'rgba(255,255,255,0.5)', borderRadius: fluidUnit(16), border: phoneVerified ? `2px solid ${vars.color.neonMint}` : '2px solid rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: fluidUnit(12) }}>
                      <label style={{ fontSize: fluidUnit(16), fontWeight: 600, color: vars.color.vaultBlack }}>
                        📱 Phone: {formData.phoneCountryCode} {formData.businessPhone}
                      </label>
                      {phoneVerified && <span style={{ fontSize: fluidUnit(24), color: vars.color.neonMint }}>✓</span>}
                    </div>
                    
                    <input
                      type="text"
                      value={phoneOtp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setPhoneOtp(value);
                        setErrors({});
                      }}
                      placeholder="000000"
                      maxLength={6}
                      disabled={phoneVerified}
                      style={{
                        width: "100%",
                        padding: fluidUnit(16),
                        borderRadius: fluidUnit(12),
                        border: `2px solid ${errors.phoneOtp ? '#c62828' : vars.color.vaultBlack}`,
                        fontSize: fluidUnit(24),
                        fontWeight: 700,
                        textAlign: "center",
                        letterSpacing: fluidUnit(6),
                        backgroundColor: phoneVerified ? 'rgba(184,255,159,0.2)' : 'rgba(255,255,255,0.9)',
                        cursor: phoneVerified ? 'not-allowed' : 'text',
                        marginBottom: fluidUnit(12),
                      }}
                    />

                    {!phoneVerified && (
                      <div style={{ display: 'flex', gap: fluidUnit(12), alignItems: 'center' }}>
                        <button
                          onClick={verifyPhoneOtp}
                          disabled={phoneOtp.length !== 6}
                          style={{
                            flex: 1,
                            padding: fluidUnit(12),
                            background: phoneOtp.length === 6 ? vars.color.vaultBlack : 'rgba(0,0,0,0.2)',
                            color: vars.color.vaultWhite,
                            border: 'none',
                            borderRadius: fluidUnit(8),
                            fontSize: fluidUnit(14),
                            fontWeight: 600,
                            cursor: phoneOtp.length === 6 ? 'pointer' : 'not-allowed',
                          }}
                        >
                          Verify Now
                        </button>
                        <div style={{ fontSize: fluidUnit(12), color: vars.color.muted }}>
                          {phoneCountdown > 0 ? (
                            <span>{phoneCountdown}s</span>
                          ) : (
                            <button onClick={resendPhoneOtp} style={{ background: 'transparent', border: 'none', color: vars.color.vaultBlack, fontSize: fluidUnit(12), fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                              Resend
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Email OTP */}
                  <div style={{ marginBottom: fluidUnit(24), padding: fluidUnit(20), background: 'rgba(255,255,255,0.5)', borderRadius: fluidUnit(16), border: emailVerified ? `2px solid ${vars.color.neonMint}` : '2px solid rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: fluidUnit(12) }}>
                      <label style={{ fontSize: fluidUnit(16), fontWeight: 600, color: vars.color.vaultBlack }}>
                        📧 Email: {formData.businessEmail}
                      </label>
                      {emailVerified && <span style={{ fontSize: fluidUnit(24), color: vars.color.neonMint }}>✓</span>}
                    </div>
                    
                    <input
                      type="text"
                      value={emailOtp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setEmailOtp(value);
                        setErrors({});
                      }}
                      placeholder="000000"
                      maxLength={6}
                      disabled={emailVerified}
                      style={{
                        width: "100%",
                        padding: fluidUnit(16),
                        borderRadius: fluidUnit(12),
                        border: `2px solid ${errors.emailOtp ? '#c62828' : vars.color.vaultBlack}`,
                        fontSize: fluidUnit(24),
                        fontWeight: 700,
                        textAlign: "center",
                        letterSpacing: fluidUnit(6),
                        backgroundColor: emailVerified ? 'rgba(184,255,159,0.2)' : 'rgba(255,255,255,0.9)',
                        cursor: emailVerified ? 'not-allowed' : 'text',
                        marginBottom: fluidUnit(12),
                      }}
                    />

                    {!emailVerified && (
                      <div style={{ display: 'flex', gap: fluidUnit(12), alignItems: 'center' }}>
                        <button
                          onClick={verifyEmailOtp}
                          disabled={emailOtp.length !== 6}
                          style={{
                            flex: 1,
                            padding: fluidUnit(12),
                            background: emailOtp.length === 6 ? vars.color.vaultBlack : 'rgba(0,0,0,0.2)',
                            color: vars.color.vaultWhite,
                            border: 'none',
                            borderRadius: fluidUnit(8),
                            fontSize: fluidUnit(14),
                            fontWeight: 600,
                            cursor: emailOtp.length === 6 ? 'pointer' : 'not-allowed',
                          }}
                        >
                          Verify Now
                        </button>
                        <div style={{ fontSize: fluidUnit(12), color: vars.color.muted }}>
                          {emailCountdown > 0 ? (
                            <span>{emailCountdown}s</span>
                          ) : (
                            <button onClick={resendEmailOtp} style={{ background: 'transparent', border: 'none', color: vars.color.vaultBlack, fontSize: fluidUnit(12), fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                              Resend
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {errors.verification && (
                    <Typography as="p" style={{ color: '#c62828', fontSize: fluidUnit(14), textAlign: 'center', marginBottom: fluidUnit(16) }}>
                      {errors.verification}
                    </Typography>
                  )}

                  {/* Continue Button */}
                  <button
                    onClick={proceedAfterVerification}
                    disabled={!phoneVerified || !emailVerified}
                    style={{
                      width: "100%",
                      padding: fluidUnit(20),
                      background: (phoneVerified && emailVerified) ? vars.color.neonMint : 'rgba(0,0,0,0.3)',
                      color: vars.color.vaultBlack,
                      border: `2px solid ${vars.color.vaultBlack}`,
                      borderRadius: fluidUnit(50),
                      fontSize: fluidUnit(20),
                      fontWeight: 600,
                      cursor: (phoneVerified && emailVerified) ? 'pointer' : 'not-allowed',
                      marginBottom: fluidUnit(16),
                    }}
                  >
                    {(phoneVerified && emailVerified) ? 'Continue to Next Step →' : 'Verify Both to Continue'}
                  </button>

                  <button
                    onClick={() => setShowOtpVerification(false)}
                    style={{
                      width: "100%",
                      padding: fluidUnit(16),
                      background: 'transparent',
                      color: vars.color.vaultBlack,
                      border: `2px solid ${vars.color.vaultBlack}`,
                      borderRadius: fluidUnit(50),
                      fontSize: fluidUnit(16),
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Change information
                  </button>
                </>
              )}

              {/* Step 3: Store Type */}
              {currentStep === 3 && (
                <>
                  <Typography as="h2" style={{ fontSize: fluidUnit(32), fontWeight: 700, marginBottom: fluidUnit(32), color: vars.color.vaultBlack }}>
                    What type of store do you have?
                  </Typography>

                  <div style={{ display: "grid", gap: fluidUnit(24) }}>
                    <button
                      onClick={() => setFormData({ ...formData, storeType: "retail" })}
                      style={{
                        padding: fluidUnit(32),
                        background: formData.storeType === "retail" ? vars.color.neonMint : vars.color.vaultWhite,
                        border: `3px solid ${formData.storeType === "retail" ? vars.color.vaultBlack : 'rgba(0,0,0,0.2)'}`,
                        borderRadius: fluidUnit(16),
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: fluidUnit(16) }}>
                        <span style={{ fontSize: fluidUnit(48) }}>🏪</span>
                        <div>
                          <Typography as="h3" style={{ fontSize: fluidUnit(24), fontWeight: 700, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>
                            Retail Store
                          </Typography>
                          <Typography as="p" style={{ fontSize: fluidUnit(16), color: vars.color.muted }}>
                            Physical location where customers visit
                          </Typography>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setFormData({ ...formData, storeType: "digital" })}
                      style={{
                        padding: fluidUnit(32),
                        background: formData.storeType === "digital" ? vars.color.neonMint : vars.color.vaultWhite,
                        border: `3px solid ${formData.storeType === "digital" ? vars.color.vaultBlack : 'rgba(0,0,0,0.2)'}`,
                        borderRadius: fluidUnit(16),
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: fluidUnit(16) }}>
                        <span style={{ fontSize: fluidUnit(48) }}>💻</span>
                        <div>
                          <Typography as="h3" style={{ fontSize: fluidUnit(24), fontWeight: 700, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>
                            Digital Store
                          </Typography>
                          <Typography as="p" style={{ fontSize: fluidUnit(16), color: vars.color.muted }}>
                            Online-only business
                          </Typography>
                        </div>
                      </div>
                    </button>
                  </div>
                </>
              )}

              {/* Step 4: Business Details (Digital Store) */}
              {currentStep === 4 && formData.storeType === "digital" && (
                <>
                  <Typography as="h2" style={{ fontSize: fluidUnit(32), fontWeight: 700, marginBottom: fluidUnit(32), color: vars.color.vaultBlack }}>
                    Business verification details
                  </Typography>

                  <div style={{ marginBottom: fluidUnit(24) }}>
                    <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>Street Address *</label>
                    <input
                      type="text"
                      value={formData.streetAddress}
                      onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                      placeholder="123 Main St"
                      style={{
                        width: "100%",
                        padding: fluidUnit(16),
                        borderRadius: fluidUnit(12),
                        border: `2px solid ${errors.address ? '#c62828' : vars.color.vaultBlack}`,
                        fontSize: fluidUnit(16),
                        backgroundColor: 'rgba(255,255,255,0.9)',
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: fluidUnit(16), marginBottom: fluidUnit(24) }}>
                    <div>
                      <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>City *</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="New York"
                        style={{
                          width: "100%",
                          padding: fluidUnit(16),
                          borderRadius: fluidUnit(12),
                          border: `2px solid ${errors.address ? '#c62828' : vars.color.vaultBlack}`,
                          fontSize: fluidUnit(16),
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>ZIP Code *</label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        placeholder="10001"
                        style={{
                          width: "100%",
                          padding: fluidUnit(16),
                          borderRadius: fluidUnit(12),
                          border: `2px solid ${errors.address ? '#c62828' : vars.color.vaultBlack}`,
                          fontSize: fluidUnit(16),
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: fluidUnit(16), marginBottom: fluidUnit(24) }}>
                    <div>
                      <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>State *</label>
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        style={{
                          width: "100%",
                          padding: fluidUnit(16),
                          borderRadius: fluidUnit(12),
                          border: `2px solid ${errors.address ? '#c62828' : vars.color.vaultBlack}`,
                          fontSize: fluidUnit(16),
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        }}
                      >
                        <option value="">Select state</option>
                        <option value="AL">Alabama</option>
                        <option value="CA">California</option>
                        <option value="FL">Florida</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>Country</label>
                      <input
                        type="text"
                        value="United States"
                        disabled
                        style={{
                          width: "100%",
                          padding: fluidUnit(16),
                          borderRadius: fluidUnit(12),
                          border: `2px solid ${vars.color.vaultBlack}`,
                          fontSize: fluidUnit(16),
                          backgroundColor: 'rgba(0,0,0,0.05)',
                          cursor: 'not-allowed',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: fluidUnit(24) }}>
                    <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>EIN (Employer Identification Number) *</label>
                    <input
                      type="text"
                      value={formData.ein}
                      onChange={(e) => setFormData({ ...formData, ein: e.target.value.replace(/\D/g, '').slice(0, 9) })}
                      placeholder="123456789"
                      maxLength={9}
                      style={{
                        width: "100%",
                        padding: fluidUnit(16),
                        borderRadius: fluidUnit(12),
                        border: `2px solid ${errors.ein ? '#c62828' : vars.color.vaultBlack}`,
                        fontSize: fluidUnit(16),
                        backgroundColor: 'rgba(255,255,255,0.9)',
                      }}
                    />
                    <Typography as="p" style={{ fontSize: fluidUnit(12), color: '#666', marginTop: fluidUnit(4) }}>
                      Required for tax verification (9 digits)
                    </Typography>
                  </div>
                </>
              )}

              {/* Step 4: Retail Store */}
              {currentStep === 4 && formData.storeType === "retail" && (
                <>
                  <Typography as="h2" style={{ fontSize: fluidUnit(32), fontWeight: 700, marginBottom: fluidUnit(32), color: vars.color.vaultBlack }}>
                    Retail Store Verification
                  </Typography>

                  <div style={{ marginBottom: fluidUnit(24) }}>
                    <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>Street Address *</label>
                    <input
                      type="text"
                      value={formData.streetAddress}
                      onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                      placeholder="123 Main St"
                      style={{
                        width: "100%",
                        padding: fluidUnit(16),
                        borderRadius: fluidUnit(12),
                        border: `2px solid ${errors.address ? '#c62828' : vars.color.vaultBlack}`,
                        fontSize: fluidUnit(16),
                        backgroundColor: 'rgba(255,255,255,0.9)',
                      }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: fluidUnit(16), marginBottom: fluidUnit(24) }}>
                    <div>
                      <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>City *</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="New York"
                        style={{
                          width: "100%",
                          padding: fluidUnit(16),
                          borderRadius: fluidUnit(12),
                          border: `2px solid ${errors.address ? '#c62828' : vars.color.vaultBlack}`,
                          fontSize: fluidUnit(16),
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>ZIP Code *</label>
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        placeholder="10001"
                        style={{
                          width: "100%",
                          padding: fluidUnit(16),
                          borderRadius: fluidUnit(12),
                          border: `2px solid ${errors.address ? '#c62828' : vars.color.vaultBlack}`,
                          fontSize: fluidUnit(16),
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: fluidUnit(16), marginBottom: fluidUnit(24) }}>
                    <div>
                      <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>State *</label>
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        style={{
                          width: "100%",
                          padding: fluidUnit(16),
                          borderRadius: fluidUnit(12),
                          border: `2px solid ${errors.address ? '#c62828' : vars.color.vaultBlack}`,
                          fontSize: fluidUnit(16),
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        }}
                      >
                        <option value="">Select state</option>
                        <option value="AL">Alabama</option>
                        <option value="CA">California</option>
                        <option value="FL">Florida</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>Country</label>
                      <input
                        type="text"
                        value="United States"
                        disabled
                        style={{
                          width: "100%",
                          padding: fluidUnit(16),
                          borderRadius: fluidUnit(12),
                          border: `2px solid ${vars.color.vaultBlack}`,
                          fontSize: fluidUnit(16),
                          backgroundColor: 'rgba(0,0,0,0.05)',
                          cursor: 'not-allowed',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: fluidUnit(24) }}>
                    <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>Website URL *</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://yourstore.com"
                      style={{
                        width: "100%",
                        padding: fluidUnit(16),
                        borderRadius: fluidUnit(12),
                        border: `2px solid ${errors.address ? '#c62828' : vars.color.vaultBlack}`,
                        fontSize: fluidUnit(16),
                        backgroundColor: 'rgba(255,255,255,0.9)',
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: fluidUnit(24) }}>
                    <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>EIN (Employer Identification Number) *</label>
                    <input
                      type="text"
                      value={formData.ein}
                      onChange={(e) => setFormData({ ...formData, ein: e.target.value.replace(/\D/g, '').slice(0, 9) })}
                      placeholder="123456789"
                      maxLength={9}
                      style={{
                        width: "100%",
                        padding: fluidUnit(16),
                        borderRadius: fluidUnit(12),
                        border: `2px solid ${errors.ein ? '#c62828' : vars.color.vaultBlack}`,
                        fontSize: fluidUnit(16),
                        backgroundColor: 'rgba(255,255,255,0.9)',
                      }}
                    />
                    <Typography as="p" style={{ fontSize: fluidUnit(12), color: '#666', marginTop: fluidUnit(4) }}>
                      Required for tax verification (9 digits)
                    </Typography>
                  </div>

                  {/* QR Kit Bundle Section */}
                  <div style={{ marginTop: fluidUnit(40), marginBottom: fluidUnit(32), padding: fluidUnit(24), background: '#FFD700', borderRadius: fluidUnit(16), border: `3px solid ${vars.color.vaultBlack}`, boxShadow: '6px 6px 0px 0px rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: fluidUnit(16) }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: fluidUnit(12) }}>
                        <span style={{ fontSize: fluidUnit(32) }}>📦</span>
                        <div>
                          <Typography as="h3" style={{ fontSize: fluidUnit(24), fontWeight: 700, color: vars.color.vaultBlack }}>
                            QR Kit Bundle
                          </Typography>
                          <Typography as="p" style={{ fontSize: fluidUnit(14), color: '#666' }}>
                            Complete POS system with QR stands
                          </Typography>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <Typography as="p" style={{ fontSize: fluidUnit(32), fontWeight: 700, color: vars.color.neonMint, textDecoration: 'line-through', opacity: 0.5 }}>
                          $299
                        </Typography>
                        <Typography as="p" style={{ fontSize: fluidUnit(40), fontWeight: 700, color: vars.color.vaultBlack }}>
                          FREE
                        </Typography>
                      </div>
                    </div>

                    <label style={{ display: 'flex', alignItems: 'center', gap: fluidUnit(12), padding: fluidUnit(16), background: 'rgba(255,255,255,0.8)', borderRadius: fluidUnit(12), cursor: 'pointer', border: formData.qrKitBundle ? `3px solid ${vars.color.vaultBlack}` : '2px solid rgba(0,0,0,0.2)' }}>
                      <input
                        type="checkbox"
                        checked={formData.qrKitBundle}
                        onChange={(e) => setFormData({ ...formData, qrKitBundle: e.target.checked })}
                        style={{ width: fluidUnit(20), height: fluidUnit(20), cursor: 'pointer' }}
                      />
                      <Typography as="span" style={{ fontSize: fluidUnit(16), fontWeight: 600, color: vars.color.vaultBlack }}>
                        Yes, I want to order the FREE QR Kit Bundle
                      </Typography>
                    </label>
                  </div>

                  {/* Billing & Delivery Address - Show if QR Kit selected */}
                  {formData.qrKitBundle && (
                    <>
                      <Typography as="h3" style={{ fontSize: fluidUnit(24), fontWeight: 700, marginBottom: fluidUnit(24), marginTop: fluidUnit(32), color: vars.color.vaultBlack }}>
                        Billing Address
                      </Typography>

                      <div style={{ marginBottom: fluidUnit(24) }}>
                        <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>Billing Street Address *</label>
                        <input
                          type="text"
                          value={formData.billingAddress}
                          onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                          placeholder="123 Billing St"
                          style={{
                            width: "100%",
                            padding: fluidUnit(16),
                            borderRadius: fluidUnit(12),
                            border: `2px solid ${errors.billing ? '#c62828' : vars.color.vaultBlack}`,
                            fontSize: fluidUnit(16),
                            backgroundColor: 'rgba(255,255,255,0.9)',
                          }}
                        />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: fluidUnit(16), marginBottom: fluidUnit(24) }}>
                        <div>
                          <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>City *</label>
                          <input
                            type="text"
                            value={formData.billingCity}
                            onChange={(e) => setFormData({ ...formData, billingCity: e.target.value })}
                            placeholder="City"
                            style={{
                              width: "100%",
                              padding: fluidUnit(16),
                              borderRadius: fluidUnit(12),
                              border: `2px solid ${errors.billing ? '#c62828' : vars.color.vaultBlack}`,
                              fontSize: fluidUnit(16),
                              backgroundColor: 'rgba(255,255,255,0.9)',
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>ZIP Code *</label>
                          <input
                            type="text"
                            value={formData.billingZipCode}
                            onChange={(e) => setFormData({ ...formData, billingZipCode: e.target.value })}
                            placeholder="10001"
                            style={{
                              width: "100%",
                              padding: fluidUnit(16),
                              borderRadius: fluidUnit(12),
                              border: `2px solid ${errors.billing ? '#c62828' : vars.color.vaultBlack}`,
                              fontSize: fluidUnit(16),
                              backgroundColor: 'rgba(255,255,255,0.9)',
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: fluidUnit(32) }}>
                        <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>State *</label>
                        <select
                          value={formData.billingState}
                          onChange={(e) => setFormData({ ...formData, billingState: e.target.value })}
                          style={{
                            width: "100%",
                            padding: fluidUnit(16),
                            borderRadius: fluidUnit(12),
                            border: `2px solid ${errors.billing ? '#c62828' : vars.color.vaultBlack}`,
                            fontSize: fluidUnit(16),
                            backgroundColor: 'rgba(255,255,255,0.9)',
                          }}
                        >
                          <option value="">Select state</option>
                          <option value="AL">Alabama</option>
                          <option value="CA">California</option>
                          <option value="FL">Florida</option>
                          <option value="NY">New York</option>
                          <option value="TX">Texas</option>
                        </select>
                      </div>

                      <label style={{ display: 'flex', alignItems: 'center', gap: fluidUnit(12), marginBottom: fluidUnit(24), padding: fluidUnit(12), background: 'rgba(255,255,255,0.5)', borderRadius: fluidUnit(8), cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.sameAsBusinessAddress}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            if (checked) {
                              setFormData({
                                ...formData,
                                sameAsBusinessAddress: true,
                                deliveryAddress: formData.streetAddress,
                                deliveryCity: formData.city,
                                deliveryZipCode: formData.zipCode,
                                deliveryState: formData.state,
                              });
                            } else {
                              setFormData({ ...formData, sameAsBusinessAddress: false });
                            }
                          }}
                          style={{ width: fluidUnit(16), height: fluidUnit(16), cursor: 'pointer' }}
                        />
                        <Typography as="span" style={{ fontSize: fluidUnit(14), color: vars.color.vaultBlack }}>
                          Delivery address same as business address
                        </Typography>
                      </label>

                      <Typography as="h3" style={{ fontSize: fluidUnit(24), fontWeight: 700, marginBottom: fluidUnit(24), color: vars.color.vaultBlack }}>
                        Delivery Address
                      </Typography>

                      <div style={{ marginBottom: fluidUnit(24) }}>
                        <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>Delivery Street Address *</label>
                        <input
                          type="text"
                          value={formData.deliveryAddress}
                          onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                          placeholder="123 Delivery St"
                          disabled={formData.sameAsBusinessAddress}
                          style={{
                            width: "100%",
                            padding: fluidUnit(16),
                            borderRadius: fluidUnit(12),
                            border: `2px solid ${errors.delivery ? '#c62828' : vars.color.vaultBlack}`,
                            fontSize: fluidUnit(16),
                            backgroundColor: formData.sameAsBusinessAddress ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.9)',
                            cursor: formData.sameAsBusinessAddress ? 'not-allowed' : 'text',
                          }}
                        />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: fluidUnit(16), marginBottom: fluidUnit(24) }}>
                        <div>
                          <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>City *</label>
                          <input
                            type="text"
                            value={formData.deliveryCity}
                            onChange={(e) => setFormData({ ...formData, deliveryCity: e.target.value })}
                            placeholder="City"
                            disabled={formData.sameAsBusinessAddress}
                            style={{
                              width: "100%",
                              padding: fluidUnit(16),
                              borderRadius: fluidUnit(12),
                              border: `2px solid ${errors.delivery ? '#c62828' : vars.color.vaultBlack}`,
                              fontSize: fluidUnit(16),
                              backgroundColor: formData.sameAsBusinessAddress ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.9)',
                              cursor: formData.sameAsBusinessAddress ? 'not-allowed' : 'text',
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>ZIP Code *</label>
                          <input
                            type="text"
                            value={formData.deliveryZipCode}
                            onChange={(e) => setFormData({ ...formData, deliveryZipCode: e.target.value })}
                            placeholder="10001"
                            disabled={formData.sameAsBusinessAddress}
                            style={{
                              width: "100%",
                              padding: fluidUnit(16),
                              borderRadius: fluidUnit(12),
                              border: `2px solid ${errors.delivery ? '#c62828' : vars.color.vaultBlack}`,
                              fontSize: fluidUnit(16),
                              backgroundColor: formData.sameAsBusinessAddress ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.9)',
                              cursor: formData.sameAsBusinessAddress ? 'not-allowed' : 'text',
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: fluidUnit(24) }}>
                        <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8), color: vars.color.vaultBlack }}>State *</label>
                        <select
                          value={formData.deliveryState}
                          onChange={(e) => setFormData({ ...formData, deliveryState: e.target.value })}
                          disabled={formData.sameAsBusinessAddress}
                          style={{
                            width: "100%",
                            padding: fluidUnit(16),
                            borderRadius: fluidUnit(12),
                            border: `2px solid ${errors.delivery ? '#c62828' : vars.color.vaultBlack}`,
                            fontSize: fluidUnit(16),
                            backgroundColor: formData.sameAsBusinessAddress ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.9)',
                            cursor: formData.sameAsBusinessAddress ? 'not-allowed' : 'pointer',
                          }}
                        >
                          <option value="">Select state</option>
                          <option value="AL">Alabama</option>
                          <option value="CA">California</option>
                          <option value="FL">Florida</option>
                          <option value="NY">New York</option>
                          <option value="TX">Texas</option>
                        </select>
                      </div>
                    </>
                  )}
                </>
              )}

              {/* Step 5: Terms & Fees */}
              {currentStep === 5 && (
                <>
                  <Typography as="h2" style={{ fontSize: fluidUnit(32), fontWeight: 700, marginBottom: fluidUnit(32), color: vars.color.vaultBlack }}>
                    Terms and business fees
                  </Typography>

                  {/* Business Fees - Different for Retail vs Digital */}
                  {formData.storeType === "retail" && (
                    <>
                      <div style={{ marginBottom: fluidUnit(24), padding: fluidUnit(24), background: 'rgba(255,255,255,0.7)', borderRadius: fluidUnit(16), border: `2px solid ${vars.color.vaultBlack}` }}>
                        <Typography as="h3" style={{ fontSize: fluidUnit(20), fontWeight: 700, marginBottom: fluidUnit(16), color: vars.color.vaultBlack }}>
                          💳 Retail Store Transaction Fees
                        </Typography>
                        <div style={{ fontSize: fluidUnit(14), lineHeight: 1.8, color: vars.color.vaultBlack }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: fluidUnit(8) }}>
                            <span>In-person payments (QR/POS):</span>
                            <strong>2.5% + $0.00</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: fluidUnit(8) }}>
                            <span>Online payments:</span>
                            <strong>2.9% + $0.30</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: fluidUnit(8) }}>
                            <span>Business card:</span>
                            <strong>+1.5%</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: fluidUnit(16), paddingTop: fluidUnit(16), borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                            <span>Monthly account fee:</span>
                            <strong style={{ color: vars.color.neonMint }}>$0 - No monthly fees!</strong>
                          </div>
                        </div>
                      </div>

                      {/* QR Kit Bundle Confirmation */}
                      {formData.qrKitBundle && (
                        <div style={{ marginBottom: fluidUnit(24), padding: fluidUnit(24), background: '#FFD700', borderRadius: fluidUnit(16), border: `3px solid ${vars.color.vaultBlack}`, boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.2)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: fluidUnit(12), marginBottom: fluidUnit(8) }}>
                            <span style={{ fontSize: fluidUnit(32) }}>📦</span>
                            <Typography as="h3" style={{ fontSize: fluidUnit(20), fontWeight: 700, color: vars.color.vaultBlack }}>
                              QR Kit Bundle - FREE of Charge
                            </Typography>
                          </div>
                          <Typography as="p" style={{ fontSize: fluidUnit(14), color: '#666' }}>
                            Your QR Kit Bundle (Value $299) will be shipped to your delivery address at no cost. Estimated delivery: 5-7 business days.
                          </Typography>
                        </div>
                      )}
                    </>
                  )}

                  {formData.storeType === "digital" && (
                    <div style={{ marginBottom: fluidUnit(24), padding: fluidUnit(24), background: 'rgba(255,255,255,0.7)', borderRadius: fluidUnit(16), border: `2px solid ${vars.color.vaultBlack}` }}>
                      <Typography as="h3" style={{ fontSize: fluidUnit(20), fontWeight: 700, marginBottom: fluidUnit(16), color: vars.color.vaultBlack }}>
                        💳 Digital Store Business Fees
                      </Typography>
                      <div style={{ fontSize: fluidUnit(14), lineHeight: 1.8, color: vars.color.vaultBlack }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: fluidUnit(8) }}>
                          <span>Online payments:</span>
                          <strong>2.9% + $0.30</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: fluidUnit(8) }}>
                          <span>Business card:</span>
                          <strong>+1.5%</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: fluidUnit(8) }}>
                          <span>Currency conversion:</span>
                          <strong>+1%</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: fluidUnit(16), paddingTop: fluidUnit(16), borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                          <span>Monthly account fee:</span>
                          <strong>$0</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Terms & Conditions Checkbox */}
                  <label style={{ 
                    display: 'flex', 
                    gap: fluidUnit(12), 
                    padding: fluidUnit(16), 
                    background: 'rgba(255,255,255,0.5)', 
                    borderRadius: fluidUnit(12), 
                    marginBottom: fluidUnit(16), 
                    cursor: 'pointer',
                    border: errors.terms ? '2px solid #c62828' : 'none'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={formData.acceptTerms} 
                      onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })} 
                      style={{ width: fluidUnit(20), height: fluidUnit(20), cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: fluidUnit(14), color: vars.color.vaultBlack }}>
                      I accept the <a href="/terms" target="_blank" style={{ fontWeight: 600, textDecoration: 'underline' }}>Terms & Conditions</a> and <a href="/privacy" target="_blank" style={{ fontWeight: 600, textDecoration: 'underline' }}>Privacy Policy</a> *
                    </span>
                  </label>

                  {/* Business Fees Checkbox */}
                  <label style={{ 
                    display: 'flex', 
                    gap: fluidUnit(12), 
                    padding: fluidUnit(16), 
                    background: 'rgba(255,255,255,0.5)', 
                    borderRadius: fluidUnit(12), 
                    marginBottom: fluidUnit(16), 
                    cursor: 'pointer',
                    border: errors.fees ? '2px solid #c62828' : 'none'
                  }}>
                    <input 
                      type="checkbox" 
                      checked={formData.acceptBusinessFees} 
                      onChange={(e) => setFormData({ ...formData, acceptBusinessFees: e.target.checked })} 
                      style={{ width: fluidUnit(20), height: fluidUnit(20), cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: fluidUnit(14), color: vars.color.vaultBlack }}>
                      I understand and accept the business fees outlined above *
                    </span>
                  </label>

                  <div style={{ padding: fluidUnit(16), background: 'rgba(255,255,255,0.5)', borderRadius: fluidUnit(12), border: '2px solid rgba(0,0,0,0.1)', marginBottom: fluidUnit(24) }}>
                    <Typography as="p" style={{ fontSize: fluidUnit(12), color: '#666', lineHeight: 1.6 }}>
                      By submitting this application, you agree that VaultPay may verify your business information, including your EIN with the IRS. All fees are subject to change with 30 days notice.
                    </Typography>
                  </div>

                  {/* Cloudflare Turnstile Captcha */}
                  <div style={{ marginBottom: fluidUnit(24) }}>
                    <div 
                      className="cf-turnstile" 
                      data-sitekey="0x4AAAAAAAzEcTrC_xYH5EXb"
                      data-callback="onTurnstileCallback"
                      data-theme="light"
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: fluidUnit(16),
                        background: 'rgba(255,255,255,0.7)',
                        borderRadius: fluidUnit(12),
                        border: `2px solid ${errors.captcha ? '#c62828' : 'rgba(0,0,0,0.1)'}`,
                      }}
                    ></div>
                    {errors.captcha && (
                      <Typography as="p" style={{ color: '#c62828', fontSize: fluidUnit(12), marginTop: fluidUnit(8), textAlign: 'center' }}>
                        {errors.captcha}
                      </Typography>
                    )}
                  </div>
                </>
              )}
              
              {/* Continue Button */}
              {!showOtpVerification && (
                <button
                  onClick={handleNext}
                  style={{
                    width: "100%",
                    padding: fluidUnit(20),
                    background: vars.color.vaultBlack,
                    color: vars.color.vaultWhite,
                    border: 'none',
                    borderRadius: fluidUnit(50),
                    fontSize: fluidUnit(20),
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginTop: fluidUnit(32),
                  }}
                >
                  {currentStep === 5 ? 'Submit Application ✓' : 'Continue →'}
                </button>
              )}

              {Object.values(errors)[0] && (
                <Typography as="p" style={{ color: '#c62828', fontSize: fluidUnit(14), textAlign: 'center', marginTop: fluidUnit(16) }}>
                  {Object.values(errors)[0]}
                </Typography>
              )}
            </>
          )}
        </div>
      </main>
    </div>
    </>
  );
}
