"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { vars } from "@/styles/theme.css";
import Container from "@/components/Layout/Container";
import Typography from "@/components/Typography/Typography";
import { fluidUnit } from "@/styles/fluid-unit";
import TextInput from "@/components/Form/TextInput";
import { AppLink } from "@/components/Link/AppLink";
import { isValidEmail } from "@/lib/security";
import { forgotPassword, verifyForgotPasswordOTP, updatePassword } from "@/lib/vaultpay-api";

type Step = 'email' | 'otp' | 'newPassword' | 'success';

export default function ForgotPasswordPage() {
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const handleSendOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    
    if (!email || !isValidEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await forgotPassword(email);
      if (response.status) {
        setCurrentStep('otp');
        setCountdown(60);
        setCanResend(false);
      } else {
        setErrors({ general: response.message || 'Failed to send OTP. Please try again.' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const response = await forgotPassword(email);
      if (response.status) {
        setCountdown(60);
        setCanResend(false);
        setErrors({});
      } else {
        setErrors({ general: response.message || 'Failed to resend OTP.' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    
    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Please enter the 6-digit verification code' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await verifyForgotPasswordOTP(email, otp);
      if (response.status) {
        setCurrentStep('newPassword');
      } else {
        setErrors({ otp: response.message || 'Invalid verification code' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    
    if (!newPassword || newPassword.length < 8) {
      setErrors({ password: 'Password must be at least 8 characters' });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await updatePassword(email, newPassword);
      if (response.status) {
        setCurrentStep('success');
      } else {
        setErrors({ general: response.message || 'Failed to reset password' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 'email':
        return { icon: '🔒', title: 'Forgot Password?', subtitle: 'Enter your email address and we\'ll send you a verification code.' };
      case 'otp':
        return { icon: '📧', title: 'Verify Your Email', subtitle: `We sent a 6-digit code to ${email}` };
      case 'newPassword':
        return { icon: '🔐', title: 'Create New Password', subtitle: 'Enter a strong password for your account.' };
      case 'success':
        return { icon: '✅', title: 'Password Reset!', subtitle: 'Your password has been successfully reset.' };
    }
  };

  const stepContent = getStepContent();

  return (
    <>
      <Navbar />
      
      <section 
        style={{ 
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          padding: `${fluidUnit(80)} 0`,
          background: vars.color.cloudSilver,
        }}
      >
        <Container size="sm">
          <div
            style={{
              background: vars.color.vaultWhite,
              border: `2px solid ${vars.color.vaultBlack}`,
              borderRadius: fluidUnit(24),
              padding: fluidUnit(48),
              maxWidth: 540,
              margin: '0 auto',
            }}
          >
            {/* Back button for OTP and newPassword steps */}
            {(currentStep === 'otp' || currentStep === 'newPassword') && (
              <button
                onClick={() => setCurrentStep(currentStep === 'newPassword' ? 'otp' : 'email')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: vars.color.muted,
                  marginBottom: fluidUnit(16),
                  padding: 0,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
                Back
              </button>
            )}

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: fluidUnit(32) }}>
              <div
                style={{
                  width: fluidUnit(80),
                  height: fluidUnit(80),
                  background: currentStep === 'success' ? vars.color.neonMint : vars.gradients.vpGradient,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  marginBottom: fluidUnit(24),
                }}
              >
                <span style={{ fontSize: fluidUnit(40) }}>{stepContent.icon}</span>
              </div>
              <Typography
                as="h1"
                style={{
                  fontSize: fluidUnit(36),
                  fontWeight: 700,
                  color: vars.color.vaultBlack,
                  marginBottom: fluidUnit(12),
                }}
              >
                {stepContent.title}
              </Typography>
              <Typography
                as="p"
                style={{
                  fontSize: fluidUnit(16),
                  color: vars.color.muted,
                  lineHeight: 1.5,
                }}
              >
                {stepContent.subtitle}
              </Typography>
            </div>

            {/* Error Message */}
            {errors.general && (
              <div
                style={{
                  background: '#ffebee',
                  border: '2px solid #f44336',
                  padding: fluidUnit(16),
                  borderRadius: fluidUnit(12),
                  marginBottom: fluidUnit(24),
                  textAlign: "center",
                }}
              >
                <Typography as="p" style={{ margin: 0, color: '#c62828', fontWeight: 600 }}>
                  {errors.general}
                </Typography>
              </div>
            )}

            {/* Step 1: Email Form */}
            {currentStep === 'email' && (
              <form onSubmit={handleSendOTP}>
                <div style={{ marginBottom: fluidUnit(24) }}>
                  <TextInput
                    label="Email Address"
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    labelColor={vars.color.vaultBlack}
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <Typography as="p" style={{ color: '#c62828', fontSize: fluidUnit(12), marginTop: fluidUnit(4) }}>
                      {errors.email}
                    </Typography>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !email}
                  style={{
                    width: "100%",
                    backgroundColor: vars.color.vaultBlack,
                    color: vars.color.vaultWhite,
                    padding: `${fluidUnit(14)} ${fluidUnit(24)}`,
                    borderRadius: fluidUnit(12),
                    border: 'none',
                    fontSize: fluidUnit(18),
                    fontWeight: 600,
                    cursor: isSubmitting || !email ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting || !email ? 0.6 : 1,
                    marginBottom: fluidUnit(24),
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Verification Code'}
                </button>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {currentStep === 'otp' && (
              <form onSubmit={handleVerifyOTP}>
                <div style={{ marginBottom: fluidUnit(24) }}>
                  <TextInput
                    label="Verification Code"
                    type="text"
                    name="otp"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    labelColor={vars.color.vaultBlack}
                    disabled={isSubmitting}
                  />
                  {errors.otp && (
                    <Typography as="p" style={{ color: '#c62828', fontSize: fluidUnit(12), marginTop: fluidUnit(4) }}>
                      {errors.otp}
                    </Typography>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || otp.length !== 6}
                  style={{
                    width: "100%",
                    backgroundColor: vars.color.vaultBlack,
                    color: vars.color.vaultWhite,
                    padding: `${fluidUnit(14)} ${fluidUnit(24)}`,
                    borderRadius: fluidUnit(12),
                    border: 'none',
                    fontSize: fluidUnit(18),
                    fontWeight: 600,
                    cursor: isSubmitting || otp.length !== 6 ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting || otp.length !== 6 ? 0.6 : 1,
                    marginBottom: fluidUnit(16),
                  }}
                >
                  {isSubmitting ? 'Verifying...' : 'Verify Code'}
                </button>
                <div style={{ textAlign: 'center' }}>
                  {countdown > 0 ? (
                    <Typography as="p" style={{ color: vars.color.muted, fontSize: fluidUnit(14) }}>
                      Resend code in {countdown}s
                    </Typography>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={!canResend || isSubmitting}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: vars.color.neonMint,
                        cursor: canResend && !isSubmitting ? 'pointer' : 'not-allowed',
                        fontWeight: 600,
                        fontSize: fluidUnit(14),
                      }}
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* Step 3: New Password */}
            {currentStep === 'newPassword' && (
              <form onSubmit={handleResetPassword}>
                <div style={{ marginBottom: fluidUnit(16) }}>
                  <div style={{ position: 'relative' }}>
                    <TextInput
                      label="New Password"
                      type={showPassword ? 'text' : 'password'}
                      name="newPassword"
                      placeholder="At least 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      labelColor={vars.color.vaultBlack}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        marginTop: 12,
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                        {showPassword ? (
                          <>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                          </>
                        ) : (
                          <>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                  {errors.password && (
                    <Typography as="p" style={{ color: '#c62828', fontSize: fluidUnit(12), marginTop: fluidUnit(4) }}>
                      {errors.password}
                    </Typography>
                  )}
                </div>
                <div style={{ marginBottom: fluidUnit(24) }}>
                  <TextInput
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    labelColor={vars.color.vaultBlack}
                    disabled={isSubmitting}
                  />
                  {errors.confirmPassword && (
                    <Typography as="p" style={{ color: '#c62828', fontSize: fluidUnit(12), marginTop: fluidUnit(4) }}>
                      {errors.confirmPassword}
                    </Typography>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !newPassword || !confirmPassword}
                  style={{
                    width: "100%",
                    backgroundColor: vars.color.vaultBlack,
                    color: vars.color.vaultWhite,
                    padding: `${fluidUnit(14)} ${fluidUnit(24)}`,
                    borderRadius: fluidUnit(12),
                    border: 'none',
                    fontSize: fluidUnit(18),
                    fontWeight: 600,
                    cursor: isSubmitting || !newPassword || !confirmPassword ? 'not-allowed' : 'pointer',
                    opacity: isSubmitting || !newPassword || !confirmPassword ? 0.6 : 1,
                  }}
                >
                  {isSubmitting ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            )}

            {/* Step 4: Success */}
            {currentStep === 'success' && (
              <div style={{ textAlign: 'center' }}>
                <AppLink
                  href="/signin"
                  style={{
                    display: 'inline-block',
                    width: "100%",
                    backgroundColor: vars.color.vaultBlack,
                    color: vars.color.vaultWhite,
                    padding: `${fluidUnit(14)} ${fluidUnit(24)}`,
                    borderRadius: fluidUnit(12),
                    fontSize: fluidUnit(18),
                    fontWeight: 600,
                    textDecoration: 'none',
                    textAlign: 'center',
                  }}
                >
                  Back to Sign In
                </AppLink>
              </div>
            )}

            {/* Back to Sign In - only show on email step */}
            {currentStep === 'email' && (
              <div style={{ textAlign: 'center' }}>
                <Typography
                  as="p"
                  style={{
                    fontSize: fluidUnit(14),
                    color: vars.color.muted,
                    marginBottom: fluidUnit(12),
                  }}
                >
                  Remember your password?
                </Typography>
                <AppLink
                  href="/signin"
                  style={{
                    fontSize: fluidUnit(16),
                    color: vars.color.neonMint,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  ← Back to Sign In
                </AppLink>
              </div>
            )}
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
