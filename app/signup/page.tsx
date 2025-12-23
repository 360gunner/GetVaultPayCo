"use client";
import { useState, useEffect, useRef } from "react";
import { vars } from "@/styles/theme.css";
import Typography from "@/components/Typography/Typography";
import TextInput from "@/components/Form/TextInput";
import Navbar from "@/components/Navbar/Navbar";
import Container from "@/components/Layout/Container";
import Grid from "@/components/Layout/Grid";
import { fluidUnit } from "@/styles/fluid-unit";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  register, 
  checkUsername, 
  checkEmail, 
  getCountries, 
  getStates, 
  getCities, 
  sendEmailVerificationOTP,
  confirmEmailVerificationOTP,
  Country, 
  State, 
  City 
} from "@/lib/vaultpay-api";
import { useAuth } from "@/lib/auth-context";

// Step order matching mobile app exactly
type SignupStep = 'name' | 'birthdate' | 'location' | 'address' | 'username' | 'email' | 'otp' | 'gender' | 'password' | 'referral' | 'terms';

interface SignupData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  username: string;
  email: string;
  otp: string;
  gender: 'male' | 'female' | '';
  password: string;
  passwordConfirm: string;
  referralCode: string;
  acceptTos: boolean;
  acceptMarketing: boolean;
  ssn: string;
  homeAddress: string;
  postalCode: string;
}

// Step titles matching mobile app
const stepTitles: Record<SignupStep, string> = {
  name: "What's your name?",
  birthdate: "When were you born?",
  location: "Where are you located?",
  address: "What's your address?",
  username: "Choose a username",
  email: "What's your email?",
  otp: "Verify your email",
  gender: "What's your gender?",
  password: "Create a password",
  referral: "Have a referral code?",
  terms: "Almost done!"
};

// Step subtitles
const stepSubtitles: Record<SignupStep, string> = {
  name: "Enter your legal name as it appears on your ID",
  birthdate: "You must be at least 18 years old to use VaultPay",
  location: "Select your country and state of residence",
  address: "Your residential address for verification",
  username: "This will be your unique identifier on VaultPay",
  email: "We'll send a verification code to this email",
  otp: "Enter the 6-digit code we sent to your email",
  gender: "Select your gender for your profile",
  password: "Create a strong password with at least 8 characters",
  referral: "If you have a referral code, enter it here",
  terms: "Review and accept our terms to complete signup"
};

export default function SignUpPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  // Step management - matching mobile app flow exactly
  const steps: SignupStep[] = ['name', 'birthdate', 'location', 'address', 'username', 'email', 'otp', 'gender', 'password', 'referral', 'terms'];
  const [currentStep, setCurrentStep] = useState<SignupStep>('name');
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  
  const [formData, setFormData] = useState<SignupData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    username: "",
    email: "",
    otp: "",
    gender: "",
    password: "",
    passwordConfirm: "",
    referralCode: "",
    acceptTos: false,
    acceptMarketing: false,
    ssn: "",
    homeAddress: "",
    postalCode: "",
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUSSelected, setIsUSSelected] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Username/Email availability
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const usernameTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const emailTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // OTP Management
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(true);
  const [otpLoading, setOtpLoading] = useState(false);

  // Location data
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);

  // Load countries on mount
  useEffect(() => {
    loadCountries();
  }, []);

  // OTP countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [countdown]);

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

  // Success screen countdown
  useEffect(() => {
    if (showSuccess && redirectCountdown > 0) {
      const timer = setTimeout(() => setRedirectCountdown(redirectCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showSuccess && redirectCountdown === 0) {
      router.push("/kyc-verification");
    }
  }, [showSuccess, redirectCountdown, router]);

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

  // Check username availability with debounce
  const checkUsernameAvailability = (username: string) => {
    if (usernameTimeoutRef.current) {
      clearTimeout(usernameTimeoutRef.current);
    }
    
    if (username.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    
    setCheckingUsername(true);
    setUsernameAvailable(null);
    
    usernameTimeoutRef.current = setTimeout(async () => {
      try {
        const result = await checkUsername(username);
        setUsernameAvailable(result.is_available);
      } catch (error) {
        console.error('Error checking username:', error);
        setUsernameAvailable(null);
      } finally {
        setCheckingUsername(false);
      }
    }, 400);
  };

  // Check email availability with debounce
  const checkEmailAvailability = (email: string) => {
    if (emailTimeoutRef.current) {
      clearTimeout(emailTimeoutRef.current);
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailAvailable(null);
      return;
    }
    
    setCheckingEmail(true);
    setEmailAvailable(null);
    
    emailTimeoutRef.current = setTimeout(async () => {
      try {
        const result = await checkEmail(email);
        setEmailAvailable(result.is_available);
      } catch (error) {
        console.error('Error checking email:', error);
        setEmailAvailable(null);
      } finally {
        setCheckingEmail(false);
      }
    }, 400);
  };

  // Send OTP
  const sendOtp = async (email: string) => {
    try {
      setOtpLoading(true);
      const response = await sendEmailVerificationOTP(email);
      
      if (response.status) {
        setOtpSent(true);
        setCountdown(60);
        setCanResendOtp(false);
      } else {
        setErrors({ otp: response.message || 'Failed to send OTP' });
      }
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      setErrors({ otp: 'Failed to send verification code. Please try again.' });
    } finally {
      setOtpLoading(false);
    }
  };

  // Verify OTP
  const verifyOtp = async (email: string, otp: string): Promise<boolean> => {
    try {
      setOtpLoading(true);
      const response = await confirmEmailVerificationOTP(email, otp);
      return response.status;
    } catch (error: any) {
      setErrors({ otp: 'Failed to verify code. Please try again.' });
      return false;
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    if (!canResendOtp) return;
    await sendOtp(formData.email);
  };

  // Calculate age from birth date
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const parts = birthDate.split('/');
    if (parts.length !== 3) return 0;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    
    const birth = new Date(year, month, day);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Format SSN as XXX-XX-XXXX
  const formatSSN = (text: string): string => {
    const digits = text.replace(/\D/g, '');
    if (digits.length >= 5) {
      return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
    } else if (digits.length >= 3) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    }
    return digits;
  };

  // Get step progress
  const getStepProgress = (): number => {
    return (steps.indexOf(currentStep) + 1) / steps.length;
  };

  // Handle back navigation
  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
      setErrors({});
    } else {
      router.back();
    }
  };

  // Handle next/continue
  const handleNext = async () => {
    setErrors({});
    setIsLoading(true);

    try {
      switch (currentStep) {
        case 'name':
          if (!formData.firstName.trim() || !formData.lastName.trim()) {
            setErrors({ name: 'Please enter your first and last name.' });
            return;
          }
          setCurrentStep('birthdate');
          break;

        case 'birthdate':
          if (!formData.dateOfBirth || formData.dateOfBirth.length !== 10) {
            setErrors({ birthdate: 'Please enter a valid date of birth (DD/MM/YYYY).' });
            return;
          }
          const age = calculateAge(formData.dateOfBirth);
          if (age < 18) {
            setErrors({ birthdate: 'You must be at least 18 years old to open an account.' });
            return;
          }
          setCurrentStep('location');
          break;

        case 'location':
          if (!selectedCountryId || !selectedStateId) {
            setErrors({ location: 'Please select your country and state.' });
            return;
          }
          if (isUSSelected && (!formData.ssn || formData.ssn.replace(/\D/g, '').length !== 9)) {
            setErrors({ ssn: 'Please enter a valid 9-digit SSN.' });
            return;
          }
          setCurrentStep('address');
          break;

        case 'address':
          if (!formData.homeAddress.trim()) {
            setErrors({ address: 'Please enter your home address.' });
            return;
          }
          if (!formData.postalCode.trim()) {
            setErrors({ postalCode: 'Please enter your postal code.' });
            return;
          }
          setCurrentStep('username');
          break;

        case 'username':
          if (!formData.username || formData.username.length < 3) {
            setErrors({ username: 'Username must be at least 3 characters.' });
            return;
          }
          if (!usernameAvailable) {
            setErrors({ username: 'Please choose an available username.' });
            return;
          }
          setCurrentStep('email');
          break;

        case 'email':
          if (!formData.email) {
            setErrors({ email: 'Please enter your email address.' });
            return;
          }
          if (!emailAvailable) {
            setErrors({ email: 'Please enter a valid and available email.' });
            return;
          }
          await sendOtp(formData.email);
          setCurrentStep('otp');
          break;

        case 'otp':
          if (!formData.otp || formData.otp.length !== 6) {
            setErrors({ otp: 'Please enter the 6-digit verification code.' });
            return;
          }
          const isValid = await verifyOtp(formData.email, formData.otp);
          if (isValid) {
            setCurrentStep('gender');
          } else {
            setErrors({ otp: 'Invalid or expired verification code. Please try again.' });
          }
          break;

        case 'gender':
          if (!formData.gender) {
            setErrors({ gender: 'Please select your gender.' });
            return;
          }
          setCurrentStep('password');
          break;

        case 'password':
          if (formData.password.length < 8) {
            setErrors({ password: 'Password must be at least 8 characters long.' });
            return;
          }
          if (formData.password !== formData.passwordConfirm) {
            setErrors({ password: 'Passwords do not match.' });
            return;
          }
          setCurrentStep('referral');
          break;

        case 'referral':
          setCurrentStep('terms');
          break;

        case 'terms':
          if (!formData.acceptTos) {
            setErrors({ terms: 'You must accept the terms and conditions.' });
            return;
          }
          await handleRegistration();
          break;
      }
    } catch (error) {
      console.error('Error in handleNext:', error);
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle registration submission
  const handleRegistration = async () => {
    const parts = formData.dateOfBirth.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    const registerData = {
      email: formData.email,
      password: formData.password,
      gender: formData.gender,
      first_name: formData.firstName,
      last_name: formData.lastName,
      user_name: formData.username,
      account_type: 0, // Personal account
      country_id: selectedCountryId!,
      state_id: selectedStateId!,
      city_id: selectedCityId || undefined,
      day,
      month,
      year,
      address: formData.homeAddress,
      postal_code: formData.postalCode,
      ssn: isUSSelected ? formData.ssn.replace(/\D/g, '') : undefined,
      referral_code: formData.referralCode || undefined,
    };

    const response = await register(registerData);
    
    if (response.status && response.data) {
      login(response.data);
      setShowSuccess(true);
    } else {
      setErrors({ submit: response.message || 'Registration failed' });
    }
  };

  // Input styles matching website
  const inputStyle: React.CSSProperties = {
    padding: `${fluidUnit(12)} ${fluidUnit(14)}`,
    borderRadius: fluidUnit(12),
    border: "1px solid #e5e7eb",
    outline: "none",
    fontSize: fluidUnit(16),
    fontFamily: "Instrument Sans, system-ui, sans-serif",
    background: "#fff",
    width: "100%",
    boxSizing: "border-box",
  };

  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    cursor: "pointer",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    paddingRight: fluidUnit(36),
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'name':
        return (
          <div style={{ display: "grid", gap: fluidUnit(16) }}>
            <TextInput
              label="First Name"
              type="text"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              labelColor={vars.color.neonMint}
            />
            <TextInput
              label="Last Name"
              type="text"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              labelColor={vars.color.neonMint}
            />
          </div>
        );

      case 'birthdate':
        return (
          <div style={{ display: "grid", gap: fluidUnit(16) }}>
            <TextInput
              label="Date of Birth"
              type="text"
              placeholder="DD/MM/YYYY"
              value={formData.dateOfBirth}
              onChange={(e) => {
                let formatted = e.target.value.replace(/\D/g, '');
                if (formatted.length >= 2) {
                  formatted = formatted.substring(0, 2) + '/' + formatted.substring(2);
                }
                if (formatted.length >= 5) {
                  formatted = formatted.substring(0, 5) + '/' + formatted.substring(5, 9);
                }
                setFormData({ ...formData, dateOfBirth: formatted });
              }}
              maxLength={10}
              labelColor={vars.color.neonMint}
            />
          </div>
        );

      case 'location':
        return (
          <div style={{ display: "grid", gap: fluidUnit(16) }}>
            <label style={{ display: "grid", gap: fluidUnit(8) }}>
              <Typography as="span" font="Instrument Sans" style={{ fontSize: fluidUnit(14), color: vars.color.neonMint }}>
                Country
              </Typography>
              <select
                value={selectedCountryId || ''}
                onChange={(e) => {
                  const countryId = parseInt(e.target.value);
                  const selectedCountry = countries.find(c => c.id === countryId);
                  setSelectedCountryId(countryId);
                  setSelectedStateId(null);
                  setSelectedCityId(null);
                  setStates([]);
                  setCities([]);
                  setIsUSSelected(selectedCountry?.symbol === 'US' || selectedCountry?.name?.toLowerCase().includes('united states') || false);
                }}
                style={selectStyle}
              >
                <option value="">Select country</option>
                {countries.map(country => (
                  <option key={country.id} value={country.id}>{country.name}</option>
                ))}
              </select>
            </label>

            {selectedCountryId && (
              <label style={{ display: "grid", gap: fluidUnit(8) }}>
                <Typography as="span" font="Instrument Sans" style={{ fontSize: fluidUnit(14), color: vars.color.neonMint }}>
                  State/Province
                </Typography>
                <select
                  value={selectedStateId || ''}
                  onChange={(e) => {
                    const stateId = parseInt(e.target.value);
                    setSelectedStateId(stateId);
                    setSelectedCityId(null);
                    setCities([]);
                  }}
                  disabled={states.length === 0}
                  style={{ ...selectStyle, opacity: states.length === 0 ? 0.5 : 1 }}
                >
                  <option value="">{states.length === 0 ? 'Loading states...' : 'Select state'}</option>
                  {states.map(state => (
                    <option key={state.id} value={state.id}>{state.name}</option>
                  ))}
                </select>
              </label>
            )}

            {cities.length > 0 && (
              <label style={{ display: "grid", gap: fluidUnit(8) }}>
                <Typography as="span" font="Instrument Sans" style={{ fontSize: fluidUnit(14), color: vars.color.neonMint }}>
                  City (Optional)
                </Typography>
                <select
                  value={selectedCityId || ''}
                  onChange={(e) => setSelectedCityId(parseInt(e.target.value) || null)}
                  style={selectStyle}
                >
                  <option value="">Select city</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
              </label>
            )}

            {isUSSelected && (
              <TextInput
                label="Social Security Number (SSN)"
                type="text"
                placeholder="XXX-XX-XXXX"
                value={formData.ssn}
                onChange={(e) => setFormData({ ...formData, ssn: formatSSN(e.target.value) })}
                maxLength={11}
                labelColor={vars.color.neonMint}
              />
            )}
          </div>
        );

      case 'address':
        return (
          <div style={{ display: "grid", gap: fluidUnit(16) }}>
            <TextInput
              label="Home Address"
              type="text"
              placeholder="Enter your full address"
              value={formData.homeAddress}
              onChange={(e) => setFormData({ ...formData, homeAddress: e.target.value })}
              labelColor={vars.color.neonMint}
            />
            <TextInput
              label="Postal Code"
              type="text"
              placeholder="Enter postal/ZIP code"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              maxLength={10}
              labelColor={vars.color.neonMint}
            />
          </div>
        );

      case 'username':
        return (
          <div style={{ display: "grid", gap: fluidUnit(16) }}>
            <div style={{ position: "relative" }}>
              <TextInput
                label="Username"
                type="text"
                placeholder="Choose a unique username"
                value={formData.username}
                onChange={(e) => {
                  const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                  setFormData({ ...formData, username: value });
                  checkUsernameAvailability(value);
                }}
                labelColor={vars.color.neonMint}
                style={{ paddingRight: fluidUnit(40) }}
              />
              {formData.username.length >= 3 && (
                <span style={{
                  position: 'absolute',
                  right: fluidUnit(12),
                  bottom: fluidUnit(12),
                  fontSize: fluidUnit(18),
                }}>
                  {checkingUsername ? '⏳' : usernameAvailable === true ? '✓' : usernameAvailable === false ? '✗' : ''}
                </span>
              )}
            </div>
            {usernameAvailable === false && (
              <Typography as="p" font="Instrument Sans" style={{ fontSize: fluidUnit(13), color: '#ef4444', marginTop: fluidUnit(-8), marginBottom: 0 }}>
                Username not available
              </Typography>
            )}
            {usernameAvailable === true && (
              <Typography as="p" font="Instrument Sans" style={{ fontSize: fluidUnit(13), color: vars.color.neonMint, marginTop: fluidUnit(-8), marginBottom: 0 }}>
                Username available!
              </Typography>
            )}
          </div>
        );

      case 'email':
        return (
          <div style={{ display: "grid", gap: fluidUnit(16) }}>
            <div style={{ position: "relative" }}>
              <TextInput
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  checkEmailAvailability(e.target.value);
                }}
                labelColor={vars.color.neonMint}
                style={{ paddingRight: fluidUnit(40) }}
              />
              {formData.email.includes('@') && (
                <span style={{
                  position: 'absolute',
                  right: fluidUnit(12),
                  bottom: fluidUnit(12),
                  fontSize: fluidUnit(18),
                }}>
                  {checkingEmail ? '⏳' : emailAvailable === true ? '✓' : emailAvailable === false ? '✗' : ''}
                </span>
              )}
            </div>
            {emailAvailable === false && (
              <Typography as="p" font="Instrument Sans" style={{ fontSize: fluidUnit(13), color: '#ef4444', marginTop: fluidUnit(-8), marginBottom: 0 }}>
                Email already registered
              </Typography>
            )}
            {emailAvailable === true && (
              <Typography as="p" font="Instrument Sans" style={{ fontSize: fluidUnit(13), color: vars.color.neonMint, marginTop: fluidUnit(-8), marginBottom: 0 }}>
                Email available!
              </Typography>
            )}
          </div>
        );

      case 'otp':
        return (
          <div style={{ display: "grid", gap: fluidUnit(16) }}>
            <div style={{
              padding: fluidUnit(16),
              background: "rgba(6, 255, 137, 0.1)",
              border: "1px solid " + vars.color.neonMint,
              borderRadius: fluidUnit(8),
            }}>
              <Typography as="p" font="Instrument Sans" style={{ margin: 0, fontSize: fluidUnit(14), color: vars.color.neonMint, textAlign: "center" }}>
                A verification code has been sent to {formData.email}
              </Typography>
            </div>
            <TextInput
              label="Verification Code"
              type="text"
              placeholder="000000"
              value={formData.otp}
              onChange={(e) => {
                const numericText = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                setFormData({ ...formData, otp: numericText });
              }}
              maxLength={6}
              labelColor={vars.color.neonMint}
              style={{ textAlign: 'center', fontSize: fluidUnit(24), letterSpacing: fluidUnit(8) }}
            />
            
            {countdown > 0 ? (
              <Typography as="p" font="Instrument Sans" style={{ fontSize: fluidUnit(14), color: vars.color.cloudSilver, textAlign: 'center', margin: 0 }}>
                Resend code in {countdown}s
              </Typography>
            ) : (
              <button
                type="button"
                onClick={resendOtp}
                disabled={!canResendOtp || otpLoading}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: vars.color.neonMint,
                  textDecoration: 'underline',
                  cursor: canResendOtp && !otpLoading ? 'pointer' : 'not-allowed',
                  fontSize: fluidUnit(14),
                  opacity: canResendOtp && !otpLoading ? 1 : 0.5,
                  fontFamily: "Instrument Sans, system-ui, sans-serif",
                }}
              >
                Resend verification code
              </button>
            )}
          </div>
        );

      case 'gender':
        return (
          <div style={{ display: "grid", gap: fluidUnit(16) }}>
            <Typography as="span" font="Instrument Sans" style={{ fontSize: fluidUnit(14), color: vars.color.neonMint }}>
              Gender
            </Typography>
            <div style={{ display: 'flex', gap: fluidUnit(12) }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: 'male' })}
                style={{
                  flex: 1,
                  padding: `${fluidUnit(14)} ${fluidUnit(24)}`,
                  borderRadius: fluidUnit(12),
                  border: `2px solid ${formData.gender === 'male' ? vars.color.neonMint : '#e5e7eb'}`,
                  backgroundColor: formData.gender === 'male' ? vars.color.neonMint : '#fff',
                  color: formData.gender === 'male' ? vars.color.vaultBlack : '#333',
                  fontSize: fluidUnit(16),
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: "Instrument Sans, system-ui, sans-serif",
                }}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: 'female' })}
                style={{
                  flex: 1,
                  padding: `${fluidUnit(14)} ${fluidUnit(24)}`,
                  borderRadius: fluidUnit(12),
                  border: `2px solid ${formData.gender === 'female' ? vars.color.neonMint : '#e5e7eb'}`,
                  backgroundColor: formData.gender === 'female' ? vars.color.neonMint : '#fff',
                  color: formData.gender === 'female' ? vars.color.vaultBlack : '#333',
                  fontSize: fluidUnit(16),
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: "Instrument Sans, system-ui, sans-serif",
                }}
              >
                Female
              </button>
            </div>
          </div>
        );

      case 'password':
        return (
          <div style={{ display: "grid", gap: fluidUnit(16) }}>
            <div style={{ position: "relative" }}>
              <TextInput
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                labelColor={vars.color.neonMint}
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  bottom: 12,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                }}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            
            <div style={{ position: "relative" }}>
              <TextInput
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={formData.passwordConfirm}
                onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                labelColor={vars.color.neonMint}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: 12,
                  bottom: 12,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                }}
              >
                {showConfirmPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        );

      case 'referral':
        return (
          <div style={{ display: "grid", gap: fluidUnit(16) }}>
            <TextInput
              label="Referral Code (Optional)"
              type="text"
              placeholder="Enter referral code"
              value={formData.referralCode}
              onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
              maxLength={8}
              labelColor={vars.color.neonMint}
            />
            <Typography as="p" font="Instrument Sans" style={{ fontSize: fluidUnit(13), color: vars.color.cloudSilver, margin: 0 }}>
              Get bonus rewards when you sign up with a valid referral code
            </Typography>
          </div>
        );

      case 'terms':
        return (
          <div style={{ display: "grid", gap: fluidUnit(16) }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: fluidUnit(12), cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.acceptTos}
                onChange={(e) => setFormData({ ...formData, acceptTos: e.target.checked })}
                style={{ width: 20, height: 20, marginTop: 2, cursor: 'pointer', accentColor: vars.color.neonMint }}
              />
              <Typography as="span" font="Instrument Sans" style={{ fontSize: fluidUnit(14), color: '#E6E6E6', lineHeight: 1.5 }}>
                I accept the{' '}
                <Link href="/terms" target="_blank" style={{ color: vars.color.neonMint, textDecoration: 'underline' }}>Terms and Conditions</Link>
                {' '}and{' '}
                <Link href="/privacy" target="_blank" style={{ color: vars.color.neonMint, textDecoration: 'underline' }}>Privacy Policy</Link>
              </Typography>
            </label>
            
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: fluidUnit(12), cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.acceptMarketing}
                onChange={(e) => setFormData({ ...formData, acceptMarketing: e.target.checked })}
                style={{ width: 20, height: 20, marginTop: 2, cursor: 'pointer', accentColor: vars.color.neonMint }}
              />
              <Typography as="span" font="Instrument Sans" style={{ fontSize: fluidUnit(14), color: '#E6E6E6', lineHeight: 1.5 }}>
                I want to receive marketing communications and updates (optional)
              </Typography>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  // Success screen
  if (showSuccess) {
    return (
      <div style={{ background: vars.color.vaultNavie, width: "100vw", position: "relative", left: "50%", right: "50%", marginLeft: "-50vw", marginRight: "-50vw" }}>
        <Navbar darkGhost />
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: fluidUnit(24) }}>
          <div style={{ textAlign: 'center', maxWidth: 500 }}>
            <div style={{
              width: fluidUnit(100),
              height: fluidUnit(100),
              background: vars.color.neonMint,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              marginBottom: fluidUnit(32),
            }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={vars.color.vaultBlack} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>

            <Typography as="h1" font="Instrument Sans" style={{ fontSize: fluidUnit(40), fontWeight: 400, marginBottom: fluidUnit(16), color: vars.color.neonMint }}>
              Congratulations!
            </Typography>
            
            <Typography as="p" font="Instrument Sans" style={{ fontSize: fluidUnit(18), marginBottom: fluidUnit(32), color: '#E6E6E6', lineHeight: 1.6 }}>
              Your account has been created successfully!
            </Typography>

            <div style={{
              padding: fluidUnit(24),
              background: 'rgba(6, 255, 137, 0.1)',
              borderRadius: fluidUnit(16),
              border: '1px solid ' + vars.color.neonMint,
            }}>
              <Typography as="p" font="Instrument Sans" style={{ fontSize: fluidUnit(14), marginBottom: fluidUnit(8), color: '#E6E6E6' }}>
                Redirecting to identity verification in
              </Typography>
              <Typography as="p" font="Instrument Sans" style={{ fontSize: fluidUnit(48), fontWeight: 700, color: vars.color.neonMint, margin: 0 }}>
                {redirectCountdown}
              </Typography>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{ background: vars.color.vaultNavie, width: "100vw", position: "relative", left: "50%", right: "50%", marginLeft: "-50vw", marginRight: "-50vw" }}>
      <Navbar darkGhost />
      <main style={{ minHeight: "100vh", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: `${fluidUnit(48, 24)} ${fluidUnit(16, 8)}`, paddingTop: 0 }}>
        <Container size="lg">
          <Grid columns={2} gap="lg" style={{ alignItems: "start", columnGap: fluidUnit(40, 24), paddingTop: fluidUnit(64, 24) }}>
            
            {/* Left: Form */}
            <div style={{ maxWidth: fluidUnit(450) }}>
              {/* Progress bar */}
              <div style={{ marginBottom: fluidUnit(24) }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: fluidUnit(8) }}>
                  <Typography as="span" font="Instrument Sans" style={{ fontSize: fluidUnit(12), color: vars.color.cloudSilver }}>
                    Step {steps.indexOf(currentStep) + 1} of {steps.length}
                  </Typography>
                  <Typography as="span" font="Instrument Sans" style={{ fontSize: fluidUnit(12), color: vars.color.cloudSilver }}>
                    {Math.round(getStepProgress() * 100)}%
                  </Typography>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                  <div style={{ height: '100%', background: vars.color.neonMint, borderRadius: 2, width: `${getStepProgress() * 100}%`, transition: 'width 0.3s ease' }} />
                </div>
              </div>

              <Typography
                as="h1"
                font="Instrument Sans"
                style={{ margin: 0, marginBottom: 8, fontWeight: 400, fontSize: fluidUnit(36), lineHeight: 1.1, letterSpacing: "-0.5px", color: vars.color.neonMint }}
              >
                {stepTitles[currentStep]}
              </Typography>
              <Typography
                as="p"
                font="Instrument Sans"
                style={{ margin: 0, marginBottom: 24, fontSize: fluidUnit(16), color: "#E6E6E6", fontWeight: 400, lineHeight: 1.6 }}
              >
                {stepSubtitles[currentStep]}
              </Typography>

              <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} style={{ display: "grid", gap: fluidUnit(16) }}>
                {/* Error display */}
                {Object.values(errors)[0] && (
                  <div style={{
                    padding: fluidUnit(12),
                    background: "rgba(198, 40, 40, 0.1)",
                    border: "1px solid #c62828",
                    borderRadius: fluidUnit(8),
                    color: "#c62828",
                    fontSize: fluidUnit(14),
                  }}>
                    {Object.values(errors)[0]}
                  </div>
                )}

                {renderStepContent()}

                {/* Navigation buttons */}
                <div style={{ display: 'flex', gap: fluidUnit(12), marginTop: fluidUnit(8) }}>
                  {steps.indexOf(currentStep) > 0 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      style={{
                        flex: 1,
                        padding: `${fluidUnit(12)} ${fluidUnit(16)}`,
                        borderRadius: 12,
                        background: 'transparent',
                        color: vars.color.neonMint,
                        fontWeight: 600,
                        border: `2px solid ${vars.color.neonMint}`,
                        cursor: 'pointer',
                        fontSize: fluidUnit(16),
                        fontFamily: "Instrument Sans, system-ui, sans-serif",
                      }}
                    >
                      Back
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isLoading || otpLoading}
                    style={{
                      flex: 2,
                      background: vars.color.neonMint,
                      padding: `${fluidUnit(12)} ${fluidUnit(16)}`,
                      borderRadius: 12,
                      color: vars.color.vaultBlack,
                      fontWeight: 600,
                      border: "none",
                      cursor: isLoading || otpLoading ? "not-allowed" : "pointer",
                      opacity: isLoading || otpLoading ? 0.6 : 1,
                      fontSize: fluidUnit(18),
                      fontFamily: "Instrument Sans, system-ui, sans-serif",
                    }}
                  >
                    {isLoading || otpLoading ? 'Please wait...' : currentStep === 'terms' ? 'Create Account' : 'Continue'}
                  </button>
                </div>
              </form>

              <div style={{ marginTop: fluidUnit(24), display: "flex", alignItems: "center", justifyContent: "center", gap: fluidUnit(6) }}>
                <Typography as="span" font="Instrument Sans" style={{ fontSize: fluidUnit(14), color: vars.color.cloudSilver }} weight={400}>
                  Already have an account?{" "}
                  <Link href="/signin" style={{ color: vars.color.neonMint, textDecoration: "none" }}>
                    Sign in
                  </Link>
                </Typography>
              </div>
            </div>

            {/* Right: Image */}
            <div style={{ position: "relative", width: "100%", maxWidth: fluidUnit(640), margin: "0 auto", borderRadius: fluidUnit(16), overflow: "hidden" }}>
              <Image
                unoptimized
                src="/Login Art.png"
                alt="VaultPay devices"
                width={623}
                height={821}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>
          </Grid>
        </Container>
      </main>
    </div>
  );
}
