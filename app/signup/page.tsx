"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { vars } from "@/styles/theme.css";
import Typography from "@/components/Typography/Typography";
import { fluidUnit } from "@/styles/fluid-unit";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Script from "next/script";

interface SignupData {
  email: string;
  otp: string;
  password: string;
  passwordConfirm: string;
  firstName: string;
  lastName: string;
  username: string;
  dateOfBirth: string;
  country: string;
  homeAddress: string;
  postalCode: string;
  acceptTos: boolean;
  acceptMarketing: boolean;
}

export default function SignUpPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 9;
  const [showSuccess, setShowSuccess] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  
  const [formData, setFormData] = useState<SignupData>({
    email: "",
    otp: "",
    password: "",
    passwordConfirm: "",
    firstName: "",
    lastName: "",
    username: "",
    dateOfBirth: "",
    country: "",
    homeAddress: "",
    postalCode: "",
    acceptTos: false,
    acceptMarketing: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState({
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
    minLength: false,
  });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // OTP Management
  const mockOtp = "123456";
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const maxOtpAttempts = 3;

  // Reset OTP timer when entering step 2
  useEffect(() => {
    if (currentStep === 2) {
      setOtpTimer(60);
      setCanResendOtp(false);
    }
  }, [currentStep]);

  // OTP Timer
  useEffect(() => {
    if (currentStep === 2 && otpTimer > 0) {
      const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (otpTimer === 0) {
      setCanResendOtp(true);
    }
  }, [currentStep, otpTimer]);

  // Success screen countdown
  useEffect(() => {
    if (showSuccess && redirectCountdown > 0) {
      const timer = setTimeout(() => setRedirectCountdown(redirectCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showSuccess && redirectCountdown === 0) {
      router.push("/kyc-verification");
    }
  }, [showSuccess, redirectCountdown, router]);

  // Setup Cloudflare Turnstile callback globally
  useEffect(() => {
    // Define callback function globally for implicit rendering
    (window as any).onTurnstileSuccess = (token: string) => {
      console.log("Captcha verified successfully:", token);
      setCaptchaToken(token);
      setErrors((prev) => {
        const { captcha, ...rest } = prev;
        return rest;
      });
    };

    (window as any).onTurnstileError = (error: string) => {
      console.error('Turnstile error:', error);
      setErrors({ captcha: 'Verification failed. Please try again.' });
    };

    (window as any).onTurnstileExpired = () => {
      console.warn('Turnstile token expired');
      setCaptchaToken(null);
      setErrors({ captcha: 'Verification expired. Please verify again.' });
    };

    return () => {
      delete (window as any).onTurnstileSuccess;
      delete (window as any).onTurnstileError;
      delete (window as any).onTurnstileExpired;
    };
  }, []);

  const handleResendOtp = () => {
    if (otpAttempts >= maxOtpAttempts) {
      setErrors({ otp: "Maximum attempts reached. Try again tomorrow." });
      return;
    }
    setOtpAttempts(otpAttempts + 1);
    setOtpTimer(60);
    setCanResendOtp(false);
    console.log("OTP resent to:", formData.email);
  };

  const validatePassword = (password: string) => {
    const strength = {
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      minLength: password.length >= 8,
    };
    setPasswordStrength(strength);
    return Object.values(strength).every(Boolean);
  };

  const handleNext = () => {
    setErrors({});
    
    switch (currentStep) {
      case 1:
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          setErrors({ email: "Valid email required" });
          return;
        }
        break;
      case 2:
        if (formData.otp !== mockOtp) {
          setErrors({ otp: "Invalid OTP. Try: 123456" });
          return;
        }
        break;
      case 3:
        if (!validatePassword(formData.password) || formData.password !== formData.passwordConfirm) {
          setErrors({ password: "Check password requirements" });
          return;
        }
        break;
      case 4:
        if (!formData.firstName || !formData.lastName) {
          setErrors({ name: "Both names required" });
          return;
        }
        break;
      case 5:
        if (!formData.username || formData.username.length < 3) {
          setErrors({ username: "Username must be 3+ characters" });
          return;
        }
        break;
      case 6:
        const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear();
        if (age < 18) {
          setErrors({ dateOfBirth: "Must be 18+" });
          return;
        }
        break;
      case 7:
        if (!formData.country) {
          setErrors({ country: "Select country" });
          return;
        }
        break;
      case 8:
        if (!formData.homeAddress || !formData.postalCode) {
          setErrors({ address: "Address required" });
          return;
        }
        break;
      case 9:
        if (!formData.acceptTos) {
          setErrors({ tos: "You must accept the terms of service" });
          return;
        }
        if (!captchaToken) {
          setErrors({ captcha: "Please complete the security verification" });
          return;
        }
        console.log("Signup:", formData, "Captcha token:", captchaToken);
        // Save country to localStorage for KYC page
        localStorage.setItem("signupCountry", formData.country);
        setShowSuccess(true);
        return;
    }
    
    setCurrentStep(currentStep + 1);
  };

  const renderInput = (label: string, placeholder: string, field: keyof SignupData, type = "text") => (
    <div style={{ marginBottom: fluidUnit(24) }}>
      <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8) }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={formData[field] as string}
        onChange={(e) => {
          const value = field === 'username' ? e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') : e.target.value;
          setFormData({ ...formData, [field]: type === 'date' ? e.target.value : value });
          if (field === 'password') validatePassword(e.target.value);
        }}
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
  );

  const renderStep = () => {
    const steps = [
      { title: "What's your email?", content: renderInput("Email Address", "Enter your email", "email", "email") },
      { title: "Verify your email", content: (
        <>
          <Typography as="p" style={{ fontSize: fluidUnit(14), marginBottom: fluidUnit(24), color: '#666' }}>
            Code sent to {formData.email}
          </Typography>
          {renderInput("6-digit code", "Enter code", "otp", "text")}
          <div style={{ textAlign: 'center', marginTop: fluidUnit(16) }}>
            {canResendOtp ? (
              <button 
                onClick={handleResendOtp}
                disabled={otpAttempts >= maxOtpAttempts}
                style={{ 
                  background: 'transparent', 
                  border: 'none', 
                  color: vars.color.vaultBlack, 
                  textDecoration: 'underline', 
                  cursor: otpAttempts >= maxOtpAttempts ? 'not-allowed' : 'pointer',
                  fontSize: fluidUnit(14),
                  fontWeight: 600,
                  opacity: otpAttempts >= maxOtpAttempts ? 0.5 : 1
                }}
              >
                Resend Code
              </button>
            ) : (
              <Typography as="p" style={{ fontSize: fluidUnit(14), color: '#666' }}>
                Resend code in {otpTimer}s
              </Typography>
            )}
            <Typography as="p" style={{ fontSize: fluidUnit(12), color: '#999', marginTop: fluidUnit(8) }}>
              Attempts: {otpAttempts}/{maxOtpAttempts} • Mock OTP: 123456
            </Typography>
          </div>
        </>
      )},
      { title: "Create a password", content: (
        <>
          {renderInput("Password", "Enter password", "password", "password")}
          <div style={{ padding: fluidUnit(12), background: 'rgba(255,255,255,0.5)', borderRadius: fluidUnit(8), marginBottom: fluidUnit(16) }}>
            {['8+ chars', 'Uppercase', 'Lowercase', 'Number', 'Special char'].map((req, i) => {
              const checks = [passwordStrength.minLength, passwordStrength.hasUpper, passwordStrength.hasLower, passwordStrength.hasNumber, passwordStrength.hasSpecial];
              return (
                <div key={i} style={{ display: 'flex', gap: fluidUnit(8), fontSize: fluidUnit(12) }}>
                  <span>{checks[i] ? '✓' : '○'}</span> {req}
                </div>
              );
            })}
          </div>
          {renderInput("Confirm Password", "Re-enter", "passwordConfirm", "password")}
        </>
      )},
      { title: "What's your name?", content: (
        <>
          {renderInput("First Name", "Enter first name", "firstName")}
          {renderInput("Last Name", "Enter last name", "lastName")}
        </>
      )},
      { title: "Choose a username", content: renderInput("Username", "unique_username", "username") },
      { title: "When were you born?", content: (
        <>
          {renderInput("Date of Birth", "DD/MM/YYYY", "dateOfBirth", "date")}
          <Typography as="p" style={{ fontSize: fluidUnit(12), color: '#666' }}>
            Must be 18+ years old
          </Typography>
        </>
      )},
      { title: "Where are you located?", content: (
        <div>
          <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8) }}>Country</label>
          <select
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            style={{
              width: "100%",
              padding: fluidUnit(16),
              borderRadius: fluidUnit(12),
              border: `2px solid ${vars.color.vaultBlack}`,
              fontSize: fluidUnit(16),
              backgroundColor: 'rgba(255,255,255,0.9)',
            }}
          >
            <option value="">Select country</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="FR">France</option>
          </select>
        </div>
      )},
      { title: "Enter your home address", content: (
        <>
          {renderInput("Home Address", "Full address", "homeAddress")}
          {renderInput("Postal Code", "ZIP/Postal", "postalCode")}
        </>
      )},
      { title: "Almost done!", content: (
        <>
          <label style={{ display: 'flex', gap: fluidUnit(12), padding: fluidUnit(16), background: 'rgba(255,255,255,0.5)', borderRadius: fluidUnit(12), marginBottom: fluidUnit(16), cursor: 'pointer', border: errors.tos ? '2px solid #c62828' : 'none' }}>
            <input type="checkbox" checked={formData.acceptTos} onChange={(e) => setFormData({ ...formData, acceptTos: e.target.checked })} />
            <span style={{ fontSize: fluidUnit(14) }}>I accept Terms & Privacy Policy</span>
          </label>
          <label style={{ display: 'flex', gap: fluidUnit(12), padding: fluidUnit(16), background: 'rgba(255,255,255,0.5)', borderRadius: fluidUnit(12), marginBottom: fluidUnit(24), cursor: 'pointer' }}>
            <input type="checkbox" checked={formData.acceptMarketing} onChange={(e) => setFormData({ ...formData, acceptMarketing: e.target.checked })} />
            <span style={{ fontSize: fluidUnit(14) }}>Send marketing emails (Optional)</span>
          </label>
          
          {/* Cloudflare Turnstile Captcha */}
          <div style={{
            padding: fluidUnit(16),
            background: 'rgba(255,255,255,0.7)',
            borderRadius: fluidUnit(12),
            border: errors.captcha ? '2px solid #c62828' : '2px solid rgba(0,0,0,0.1)',
            marginBottom: fluidUnit(16),
          }}>
            <Typography as="p" style={{ fontSize: fluidUnit(14), fontWeight: 600, marginBottom: fluidUnit(12), color: vars.color.vaultBlack }}>
              Security Verification
            </Typography>
            {/* Implicit rendering with cf-turnstile class */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: fluidUnit(8) }}>
              <div 
                className="cf-turnstile"
                data-sitekey="0x4AAAAAAB8pu5AbnI8uAM9O"
                data-callback="onTurnstileSuccess"
                data-error-callback="onTurnstileError"
                data-expired-callback="onTurnstileExpired"
                data-theme="light"
                data-size="normal"
              />
            </div>
            {errors.captcha && (
              <Typography as="p" style={{ color: '#c62828', fontSize: fluidUnit(12), marginTop: fluidUnit(8) }}>
                {errors.captcha}
              </Typography>
            )}
            <Typography as="p" style={{ fontSize: fluidUnit(11), color: '#666', marginTop: fluidUnit(8), textAlign: 'center' }}>
              Protected by Cloudflare Turnstile
            </Typography>
          </div>
        </>
      )},
    ];

    return (
      <>
        <Typography as="h2" style={{ fontSize: fluidUnit(32), fontWeight: 700, marginBottom: fluidUnit(32) }}>
          {steps[currentStep - 1].title}
        </Typography>
        {steps[currentStep - 1].content}
        {Object.values(errors)[0] && (
          <Typography as="p" style={{ color: '#c62828', fontSize: fluidUnit(12) }}>
            {Object.values(errors)[0]}
          </Typography>
        )}
      </>
    );
  };

  // Success Screen
  if (showSuccess) {
    return (
      <>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          async
          defer
          strategy="afterInteractive"
        />
        <div style={{ 
          background: vars.color.vpGreen, 
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: fluidUnit(20),
        }}>
        <div style={{ textAlign: 'center', maxWidth: 600 }}>
          {/* Animated Checkmark */}
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
            animation: 'scaleIn 0.5s ease-out',
          }}>
            <span style={{ fontSize: fluidUnit(60), color: vars.color.neonMint }}>✓</span>
          </div>

          <Typography as="h1" style={{ fontSize: fluidUnit(48), fontWeight: 700, marginBottom: fluidUnit(16), color: vars.color.vaultBlack }}>
            Congratulations!
          </Typography>
          
          <Typography as="p" style={{ fontSize: fluidUnit(20), marginBottom: fluidUnit(32), color: vars.color.vaultBlack, lineHeight: 1.6 }}>
            Your account has been created successfully!
          </Typography>

          <div style={{
            padding: fluidUnit(24),
            background: 'rgba(255,255,255,0.6)',
            borderRadius: fluidUnit(16),
            border: `2px solid ${vars.color.vaultBlack}`,
          }}>
            <Typography as="p" style={{ fontSize: fluidUnit(16), marginBottom: fluidUnit(12), color: vars.color.vaultBlack }}>
              You will be redirected to the KYC verification screen to verify your identity in
            </Typography>
            <Typography as="p" style={{ fontSize: fluidUnit(64), fontWeight: 700, color: vars.color.vaultBlack }}>
              {redirectCountdown}
            </Typography>
            <Typography as="p" style={{ fontSize: fluidUnit(14), color: '#666' }}>
              seconds
            </Typography>
          </div>
        </div>
      </div>
      </>
    );
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        strategy="afterInteractive"
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
        <div style={{ width: "100%", maxWidth: 480, margin: "0 auto" }}>
          <div style={{ marginBottom: fluidUnit(40) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: fluidUnit(16), marginBottom: fluidUnit(12) }}>
              {currentStep > 1 && (
                <button onClick={() => setCurrentStep(currentStep - 1)} style={{ background: 'transparent', border: 'none', fontSize: fluidUnit(32), cursor: 'pointer' }}>←</button>
              )}
              <div style={{ flex: 1, height: 4, background: 'rgba(0,0,0,0.1)', borderRadius: 2 }}>
                <div style={{ width: `${(currentStep / totalSteps) * 100}%`, height: '100%', background: vars.color.vaultBlack, borderRadius: 2, transition: 'width 0.3s' }} />
              </div>
              <Typography as="span" style={{ fontSize: fluidUnit(14), fontWeight: 600 }}>{currentStep}/{totalSteps}</Typography>
            </div>
          </div>

          {renderStep()}

          <button
            onClick={handleNext}
            style={{
              width: "100%",
              padding: fluidUnit(18),
              background: vars.color.vaultBlack,
              color: vars.color.vaultWhite,
              border: 'none',
              borderRadius: fluidUnit(50),
              fontSize: fluidUnit(18),
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: fluidUnit(32),
            }}
          >
            {currentStep === totalSteps ? 'Create Account' : 'Continue'}
          </button>
          
          <div style={{ textAlign: 'center', marginTop: fluidUnit(24) }}>
            <Typography as="p" style={{ fontSize: fluidUnit(14) }}>
              Already have an account? <a href="/signin" style={{ fontWeight: 600, textDecoration: 'underline' }}>Sign in</a>
            </Typography>
          </div>
        </div>
      </main>
    </div>
    </>
  );
}
