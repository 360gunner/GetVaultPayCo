"use client";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import { vars } from "@/styles/theme.css";
import React, { useState } from "react";
import Typography from "@/components/Typography/Typography";
import Button from "@/components/Button/Button";
import TextInput from "@/components/Form/TextInput";
import Container from "@/components/Layout/Container";
import Grid from "@/components/Layout/Grid";
import Image from "next/image";
import { fluidUnit } from "@/styles/fluid-unit";
import { login as apiLogin } from "@/lib/vaultpay-api";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // 2FA state
  const [requires2FA, setRequires2FA] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!identifier || !password) {
        setError("Please enter your email or username and password");
        setIsLoading(false);
        return;
      }

      // If 2FA is required, include the OTP code
      const loginData = requires2FA 
        ? { email: identifier, password, otp: otpCode }
        : { email: identifier, password };

      const response = await apiLogin(loginData);

      // Check if 2FA is required
      if (response.status && response.requires_2fa && !response.data?.login_code) {
        setRequires2FA(true);
        setMaskedEmail(response.data?.email_masked || "your email");
        setIsLoading(false);
        return;
      }

      if (response.status && response.data && response.data.login_code) {
        login(response.data);
        
        if (response.data.is_kyc_verified === "0" || response.data.is_kyc_verified === "3") {
          router.push("/kyc-verification");
        } else {
          router.push("/dashboard");
        }
      } else {
        setError(response.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBackToLogin = () => {
    setRequires2FA(false);
    setOtpCode("");
    setError("");
  };

  return (
    <div style={{
      background: vars.color.vaultNavie,
      width: "100vw",
      position: "relative",
      left: "50%",
      right: "50%",
      marginLeft: "-50vw",
      marginRight: "-50vw",
    }}>
      <Navbar darkGhost />
      <main
        style={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: `${fluidUnit(48, 24)} ${fluidUnit(16, 8)}`,
          paddingTop: 0,
        }}
      >
        <Container size="lg">
          <Grid
            columns={2}
            gap="lg"
            style={{
              alignItems: "start",
              columnGap: fluidUnit(40, 24),
              paddingTop: fluidUnit(64, 24),
            }}
          >
            {/* Left: Title, subtitle, form */}
            <div style={{ maxWidth: fluidUnit(400) }}>
              <Typography
                as="h1"
                font="Instrument Sans"
                style={{
                  margin: 0,
                  marginBottom: 8,
                  fontWeight: 400,
                  fontSize: fluidUnit(40),
                  lineHeight: 1.1,
                  letterSpacing: "-0.5px",
                  textAlign: "left",
                  color: vars.color.neonMint,
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                as="p"
                font="Instrument Sans"
                style={{
                  margin: 0,
                  marginBottom: 24,
                  fontSize: fluidUnit(20),
                  textAlign: "left",
                  color: "#E6E6E6",
                  fontWeight: 400,
                  lineHeight: 1.6,
                  letterSpacing: "0.2px",
                }}
              >
                Today is a new day. It's your day. You shape it. Sign in to
                start managing your projects.
              </Typography>

              <form
                onSubmit={handleSubmit}
                style={{ display: "grid", gap: fluidUnit(12) }}
              >
                {error && (
                  <div style={{
                    padding: fluidUnit(12),
                    background: "rgba(198, 40, 40, 0.1)",
                    border: "1px solid #c62828",
                    borderRadius: fluidUnit(8),
                    color: "#c62828",
                    fontSize: fluidUnit(14),
                  }}>
                    {error}
                  </div>
                )}
                
                {/* Show 2FA OTP input when required */}
                {requires2FA ? (
                  <>
                    <div style={{
                      padding: fluidUnit(16),
                      background: "rgba(6, 255, 137, 0.1)",
                      border: "1px solid " + vars.color.neonMint,
                      borderRadius: fluidUnit(8),
                      marginBottom: fluidUnit(8),
                    }}>
                      <Typography
                        as="p"
                        font="Instrument Sans"
                        style={{
                          margin: 0,
                          fontSize: fluidUnit(14),
                          color: vars.color.neonMint,
                          textAlign: "center",
                        }}
                      >
                        A verification code has been sent to {maskedEmail}
                      </Typography>
                    </div>
                    <TextInput
                      label="Verification Code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      required
                      labelColor={vars.color.neonMint}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                    />
                    <button
                      type="button"
                      onClick={handleBackToLogin}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: vars.color.cloudSilver,
                        cursor: "pointer",
                        fontSize: fluidUnit(14),
                        textDecoration: "underline",
                        padding: 0,
                        marginTop: fluidUnit(-8),
                      }}
                    >
                      ← Back to login
                    </button>
                  </>
                ) : (
                  <>
                    <TextInput
                      label="Email or Username"
                      type="text"
                      placeholder="Email or @username"
                      required
                      labelColor={vars.color.neonMint}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                    <div style={{ position: "relative" }}>
                      <TextInput
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 8 characters"
                        minLength={8}
                        required
                        labelColor={vars.color.neonMint}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: 12,
                          top: "50%",
                          transform: "translateY(-50%)",
                          marginTop: 12,
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          padding: 4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
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
                    <Typography
                      as="p"
                      font="Instrument Sans"
                      style={{
                        marginTop: 0,
                        marginBottom: 0,
                        fontSize: fluidUnit(16),
                        color: vars.color.cloudSilver,
                        fontWeight: 400,
                        lineHeight: 1.6,
                        textAlign: "right",
                        letterSpacing: "0.2px",
                      }}
                    >
                      <Link
                        href="/forgot-password"
                        style={{
                          textDecoration: "none",
                          color: vars.color.cloudSilver,
                        }}
                      >
                        Forgot Password?
                      </Link>
                    </Typography>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    background: vars.color.neonMint,
                    padding: `${fluidUnit(12)} ${fluidUnit(16)}`,
                    borderRadius: 12,
                    color: vars.color.vaultBlack,
                    fontWeight: 600,
                    border: "none",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    opacity: isLoading ? 0.6 : 1,
                    fontSize: fluidUnit(20),
                    fontFamily: "Instrument Sans, system-ui, sans-serif",
                  }}
                >
                  {isLoading ? (requires2FA ? "Verifying..." : "Signing In...") : (requires2FA ? "Verify Code" : "Sign In")}
                </button>
              </form>

              <div
                style={{
                  marginTop: fluidUnit(32),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: fluidUnit(6),
                  fontFamily: "Instrument Sans, system-ui, sans-serif",
                  fontSize: fluidUnit(14),
                }}
              >
                <Typography
                  as="span"
                  font="Instrument Sans"
                  style={{
                    fontSize: fluidUnit(16),
                    color: vars.color.cloudSilver,
                  }}
                  weight={400}
                >
                  Don't you have an account?{" "}
                  <Link
                    href="/signup-choice"
                    style={{
                      color: vars.color.neonMint,
                      textDecoration: "none",
                    }}
                  >
                    Sign up
                  </Link>
                </Typography>
              </div>

              <div
                style={{
                  marginTop: fluidUnit(32),
                  textAlign: "center",
                  color: "#6b7280",
                  fontFamily: "Instrument Sans, system-ui, sans-serif",
                  fontSize: fluidUnit(12),
                }}
              >
                <Typography
                  as="span"
                  font="Instrument Sans"
                  style={{ fontSize: fluidUnit(16) }}
                  weight={400}
                >
                  © 2025 ALL RIGHTS RESERVED
                </Typography>
              </div>
            </div>

            {/* Right: Image */}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: fluidUnit(640),
                margin: "0 auto",
                borderRadius: fluidUnit(16),
                overflow: "hidden",
              }}
            >
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
