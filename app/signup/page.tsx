"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { vars } from "@/styles/theme.css";
import Typography from "@/components/Typography/Typography";
import { fluidUnit } from "@/styles/fluid-unit";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Script from "next/script";
import { register, checkUsername, checkEmail, getCountries, getStates, getCities, Country, State, City } from "@/lib/vaultpay-api";
import { useAuth } from "@/lib/auth-context";

interface SignupData {
  email: string;
  otp: string;
  password: string;
  passwordConfirm: string;
  firstName: string;
  lastName: string;
  username: string;
  dateOfBirth: string;
  gender: string;
  country: string;
  state: string;
  city: string;
  homeAddress: string;
  postalCode: string;
  phoneNumber: string;
  ssn: string;
  referralCode: string;
  acceptTos: boolean;
  acceptMarketing: boolean;
}

export default function SignUpPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 10;
  const [showSuccess, setShowSuccess] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  
  const { login } = useAuth();
  const [formData, setFormData] = useState<SignupData>({
    email: "",
    otp: "",
    password: "",
    passwordConfirm: "",
    firstName: "",
    lastName: "",
    username: "",
    dateOfBirth: "",
    gender: "Male",
    country: "",
    state: "",
    city: "",
    homeAddress: "",
    postalCode: "",
    phoneNumber: "",
    ssn: "",
    referralCode: "",
    acceptTos: false,
    acceptMarketing: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUSSelected, setIsUSSelected] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState({
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false,
    minLength: false,
  });
  // TEMPORARILY DISABLED: Cloudflare Turnstile captcha
  // const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // OTP Management
  const [sentOtp, setSentOtp] = useState("");
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const maxOtpAttempts = 3;

  // Location data
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);

  // Load countries on mount
  useEffect(() => {
    loadCountries();
  }, []);

  // Reset OTP timer when entering step 2
  useEffect(() => {
    if (currentStep === 2) {
      setOtpTimer(60);
      setCanResendOtp(false);
    }
  }, [currentStep]);

  // Load states when country changes
  useEffect(() => {
    if (selectedCountryId) {
      loadStates(selectedCountryId);
    }
  }, [selectedCountryId]);

  // Load cities when state changes
  useEffect(() => {
    if (selectedStateId) {
      loadCities(selectedStateId);
    }
  }, [selectedStateId]);

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

  // TEMPORARILY DISABLED: Setup Cloudflare Turnstile callback globally
  // useEffect(() => {
  //   // Define callback function globally for implicit rendering
  //   (window as any).onTurnstileSuccess = (token: string) => {
  //     console.log("Captcha verified successfully:", token);
  //     setCaptchaToken(token);
  //     setErrors((prev) => {
  //       const { captcha, ...rest } = prev;
  //       return rest;
  //     });
  //   };

  //   (window as any).onTurnstileError = (error: string) => {
  //     console.error('Turnstile error:', error);
  //     setErrors({ captcha: 'Verification failed. Please try again.' });
  //   };

  //   (window as any).onTurnstileExpired = () => {
  //     console.warn('Turnstile token expired');
  //     setCaptchaToken(null);
  //     setErrors({ captcha: 'Verification expired. Please verify again.' });
  //   };

  //   return () => {
  //     delete (window as any).onTurnstileSuccess;
  //     delete (window as any).onTurnstileError;
  //     delete (window as any).onTurnstileExpired;
  //   };
  // }, []);

  const loadCountries = async () => {
    try {
      const response = await getCountries();
      if (response.status && response.data) {
        setCountries(response.data);
      }
    } catch (error) {
      console.error('Error loading countries:', error);
    }
  };

  const loadStates = async (countryId: number) => {
    try {
      const response = await getStates(countryId);
      if (response.status && response.data) {
        setStates(response.data);
      }
    } catch (error) {
      console.error('Error loading states:', error);
    }
  };

  const loadCities = async (stateId: number) => {
    try {
      const response = await getCities(stateId);
      if (response.status && response.data) {
        setCities(response.data);
      }
    } catch (error) {
      console.error('Error loading cities:', error);
    }
  };

  const sendOtp = async () => {
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await response.json();
      if (data.status && data.otp) {
        setSentOtp(data.otp);
        console.log('OTP sent:', data.otp);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const handleResendOtp = () => {
    if (otpAttempts >= maxOtpAttempts) {
      setErrors({ otp: "Maximum attempts reached. Try again tomorrow." });
      return;
    }
    setOtpAttempts(otpAttempts + 1);
    setOtpTimer(60);
    setCanResendOtp(false);
    sendOtp();
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

  const handleNext = async () => {
    setErrors({});
    setIsLoading(true);
    
    try {
      switch (currentStep) {
        case 1:
          if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setErrors({ email: "Valid email required" });
            setIsLoading(false);
            return;
          }
          const emailCheck = await checkEmail(formData.email);
          if (!emailCheck.is_available) {
            setErrors({ email: "Email already registered" });
            setIsLoading(false);
            return;
          }
          await sendOtp();
          break;
        case 2:
          if (!formData.otp || formData.otp !== sentOtp) {
            setErrors({ otp: "Invalid OTP code" });
            setIsLoading(false);
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
          setIsLoading(false);
          return;
        }
        const usernameCheck = await checkUsername(formData.username);
        if (!usernameCheck.is_available) {
          setErrors({ username: "Username already taken" });
          setIsLoading(false);
          return;
        }
        break;
      case 6:
        const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear();
        if (age < 18) {
          setErrors({ dateOfBirth: "Must be 18+" });
          setIsLoading(false);
          return;
        }
        break;
      case 7:
        if (!formData.gender) {
          setErrors({ gender: "Select gender" });
          setIsLoading(false);
          return;
        }
        break;
      case 8:
        if (!formData.country || !formData.state) {
          setErrors({ location: "Select country and state" });
          setIsLoading(false);
          return;
        }
        // Validate SSN for US users
        if (isUSSelected && (!formData.ssn || formData.ssn.replace(/\D/g, '').length !== 9)) {
          setErrors({ ssn: "Valid 9-digit SSN required for US residents" });
          setIsLoading(false);
          return;
        }
        break;
      case 9:
        if (!formData.homeAddress || !formData.postalCode) {
          setErrors({ address: "Address required" });
          setIsLoading(false);
          return;
        }
        break;
      case 10:
        if (!formData.acceptTos) {
          setErrors({ tos: "You must accept the terms of service" });
          setIsLoading(false);
          return;
        }
        // TEMPORARILY DISABLED: Captcha validation
        // if (!captchaToken) {
        //   setErrors({ captcha: "Please complete the security verification" });
        //   setIsLoading(false);
        //   return;
        // }
        
        const birthDate = new Date(formData.dateOfBirth);
        const registerData = {
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
          first_name: formData.firstName,
          last_name: formData.lastName,
          user_name: formData.username,
          account_type: 1,
          country_id: selectedCountryId!,
          state_id: selectedStateId!,
          city_id: cities.length > 0 && formData.city ? parseInt(formData.city) : undefined,
          day: birthDate.getDate(),
          month: birthDate.getMonth() + 1,
          year: birthDate.getFullYear(),
          phone_number: formData.phoneNumber || undefined,
          address: formData.homeAddress,
          postal_code: formData.postalCode,
        };

        const response = await register(registerData);
        
        if (response.status && response.data) {
          login(response.data);
          const selectedCountry = countries.find(c => c.id === selectedCountryId);
          localStorage.setItem("signupCountry", selectedCountry?.symbol || "");
          setShowSuccess(true);
        } else {
          setErrors({ submit: response.message || "Registration failed" });
        }
        setIsLoading(false);
        return;
    }
    
    setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Error in handleNext:', error);
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (label: string, placeholder: string, field: keyof SignupData, type = "text", errorKey?: string) => {
    const fieldError = errorKey ? errors[errorKey] : errors[field];
    return (
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
            if (fieldError) {
              setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[errorKey || field];
                return newErrors;
              });
            }
          }}
          style={{
            width: "100%",
            padding: fluidUnit(16),
            borderRadius: fluidUnit(12),
            border: `2px solid ${fieldError ? '#c62828' : vars.color.vaultBlack}`,
            fontSize: fluidUnit(16),
            backgroundColor: 'rgba(255,255,255,0.9)',
          }}
        />
        {fieldError && (
          <Typography as="p" style={{ color: '#c62828', fontSize: fluidUnit(12), marginTop: fluidUnit(8) }}>
            {fieldError}
          </Typography>
        )}
      </div>
    );
  };

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
              Attempts: {otpAttempts}/{maxOtpAttempts} {sentOtp && `• Dev OTP: ${sentOtp}`}
            </Typography>
          </div>
        </>
      )},
      { title: "Create a password", content: (
        <>
          <div style={{ marginBottom: fluidUnit(24) }}>
            <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8) }}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  validatePassword(e.target.value);
                }}
                style={{
                  width: "100%",
                  padding: fluidUnit(16),
                  paddingRight: fluidUnit(48),
                  borderRadius: fluidUnit(12),
                  border: `2px solid ${vars.color.vaultBlack}`,
                  fontSize: fluidUnit(16),
                  backgroundColor: 'rgba(255,255,255,0.9)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                  {showPassword ? (
                    <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></>
                  ) : (
                    <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                  )}
                </svg>
              </button>
            </div>
          </div>
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
          <div style={{ marginBottom: fluidUnit(24) }}>
            <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8) }}>Confirm Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter password"
                value={formData.passwordConfirm}
                onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                style={{
                  width: "100%",
                  padding: fluidUnit(16),
                  paddingRight: fluidUnit(48),
                  borderRadius: fluidUnit(12),
                  border: `2px solid ${vars.color.vaultBlack}`,
                  fontSize: fluidUnit(16),
                  backgroundColor: 'rgba(255,255,255,0.9)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                  {showConfirmPassword ? (
                    <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><line x1="1" y1="1" x2="23" y2="23"/></>
                  ) : (
                    <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </>
      )},
      { title: "What's your name?", content: (
        <>
          {renderInput("First Name", "Enter first name", "firstName")}
          {renderInput("Last Name", "Enter last name", "lastName")}
        </>
      )},
      { title: "Choose a username", content: (
        <>
          <div style={{ marginBottom: fluidUnit(8) }}>
            {renderInput("Username", "unique_username", "username")}
          </div>
          <Typography as="p" style={{ fontSize: fluidUnit(12), color: '#666' }}>
            3+ characters, alphanumeric and underscore only
          </Typography>
        </>
      )},
      { title: "When were you born?", content: (
        <>
          {renderInput("Date of Birth", "DD/MM/YYYY", "dateOfBirth", "date")}
          <Typography as="p" style={{ fontSize: fluidUnit(12), color: '#666' }}>
            Must be 18+ years old
          </Typography>
        </>
      )},
      { title: "What's your gender?", content: (
        <div>
          <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8) }}>Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            style={{
              width: "100%",
              padding: fluidUnit(16),
              borderRadius: fluidUnit(12),
              border: `2px solid ${vars.color.vaultBlack}`,
              fontSize: fluidUnit(16),
              backgroundColor: 'rgba(255,255,255,0.9)',
            }}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      )},
      { title: "Where are you located?", content: (
        <>
          <div style={{ marginBottom: fluidUnit(16) }}>
            <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8) }}>Country</label>
            <select
              value={formData.country}
              onChange={(e) => {
                const countryId = parseInt(e.target.value);
                const selectedCountry = countries.find(c => c.id === countryId);
                setFormData({ ...formData, country: e.target.value, state: "", city: "", ssn: "" });
                setSelectedCountryId(countryId);
                setIsUSSelected(selectedCountry?.symbol === 'US' || selectedCountry?.name?.toLowerCase().includes('united states') || false);
                setStates([]);
                setCities([]);
              }}
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
              {countries.map(country => (
                <option key={country.id} value={country.id}>{country.name}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: fluidUnit(16) }}>
            <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8) }}>State/Province</label>
            <select
              value={formData.state}
              onChange={(e) => {
                const stateId = parseInt(e.target.value);
                setFormData({ ...formData, state: e.target.value, city: "" });
                setSelectedStateId(stateId);
                setCities([]);
              }}
              disabled={!selectedCountryId || states.length === 0}
              style={{
                width: "100%",
                padding: fluidUnit(16),
                borderRadius: fluidUnit(12),
                border: `2px solid ${vars.color.vaultBlack}`,
                fontSize: fluidUnit(16),
                backgroundColor: 'rgba(255,255,255,0.9)',
                opacity: !selectedCountryId || states.length === 0 ? 0.5 : 1,
              }}
            >
              <option value="">Select state</option>
              {states.map(state => (
                <option key={state.id} value={state.id}>{state.name}</option>
              ))}
            </select>
          </div>
          {cities.length > 0 && (
            <div style={{ marginBottom: fluidUnit(16) }}>
              <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8) }}>City (Optional)</label>
              <select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                style={{
                  width: "100%",
                  padding: fluidUnit(16),
                  borderRadius: fluidUnit(12),
                  border: `2px solid ${vars.color.vaultBlack}`,
                  fontSize: fluidUnit(16),
                  backgroundColor: 'rgba(255,255,255,0.9)',
                }}
              >
                <option value="">Select city</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>
          )}
          {isUSSelected && (
            <div style={{ marginTop: fluidUnit(16) }}>
              <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8) }}>Social Security Number (SSN)</label>
              <input
                type="text"
                placeholder="XXX-XX-XXXX"
                value={formData.ssn}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '');
                  let formatted = digits;
                  if (digits.length >= 5) {
                    formatted = `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
                  } else if (digits.length >= 3) {
                    formatted = `${digits.slice(0, 3)}-${digits.slice(3)}`;
                  }
                  setFormData({ ...formData, ssn: formatted });
                }}
                maxLength={11}
                style={{
                  width: "100%",
                  padding: fluidUnit(16),
                  borderRadius: fluidUnit(12),
                  border: `2px solid ${vars.color.vaultBlack}`,
                  fontSize: fluidUnit(16),
                  backgroundColor: 'rgba(255,255,255,0.9)',
                }}
              />
              <Typography as="p" style={{ fontSize: fluidUnit(12), color: '#666', marginTop: fluidUnit(8) }}>
                Required for US residents for identity verification
              </Typography>
            </div>
          )}
        </>
      )},
      { title: "Enter your contact details", content: (
        <>
          {renderInput("Home Address", "Full address", "homeAddress")}
          {renderInput("Postal Code", "ZIP/Postal", "postalCode")}
        </>
      )},
      { title: "Almost done!", content: (
        <>
          {/* Referral Code */}
          <div style={{ marginBottom: fluidUnit(24) }}>
            <label style={{ display: "block", fontSize: fluidUnit(16), fontWeight: 600, marginBottom: fluidUnit(8) }}>Referral Code (Optional)</label>
            <input
              type="text"
              placeholder="Enter referral code if you have one"
              value={formData.referralCode}
              onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
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
          
          <label style={{ display: 'flex', gap: fluidUnit(12), padding: fluidUnit(16), background: 'rgba(255,255,255,0.5)', borderRadius: fluidUnit(12), marginBottom: fluidUnit(16), cursor: 'pointer', border: errors.tos ? '2px solid #c62828' : 'none' }}>
            <input type="checkbox" checked={formData.acceptTos} onChange={(e) => setFormData({ ...formData, acceptTos: e.target.checked })} />
            <span style={{ fontSize: fluidUnit(14) }}>I accept Terms & Privacy Policy</span>
          </label>
          <label style={{ display: 'flex', gap: fluidUnit(12), padding: fluidUnit(16), background: 'rgba(255,255,255,0.5)', borderRadius: fluidUnit(12), marginBottom: fluidUnit(24), cursor: 'pointer' }}>
            <input type="checkbox" checked={formData.acceptMarketing} onChange={(e) => setFormData({ ...formData, acceptMarketing: e.target.checked })} />
            <span style={{ fontSize: fluidUnit(14) }}>Send marketing emails (Optional)</span>
          </label>
          
          {/* TEMPORARILY DISABLED: Cloudflare Turnstile Captcha
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
          */}
        </>
      )},
    ];

    return (
      <>
        <Typography as="h2" style={{ fontSize: fluidUnit(32), fontWeight: 700, marginBottom: fluidUnit(32) }}>
          {steps[currentStep - 1].title}
        </Typography>
        {steps[currentStep - 1].content}
      </>
    );
  };

  // Success Screen
  if (showSuccess) {
    return (
      <>
        {/* TEMPORARILY DISABLED: Cloudflare Turnstile Script
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          async
          defer
          strategy="afterInteractive"
        />
        */}
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
      {/* TEMPORARILY DISABLED: Cloudflare Turnstile Script
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        strategy="afterInteractive"
      />
      */}
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
            disabled={isLoading}
            style={{
              width: "100%",
              padding: fluidUnit(18),
              background: vars.color.vaultBlack,
              color: vars.color.vaultWhite,
              border: 'none',
              borderRadius: fluidUnit(50),
              fontSize: fluidUnit(18),
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: fluidUnit(32),
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? 'Processing...' : (currentStep === totalSteps ? 'Create Account' : 'Continue')}
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
