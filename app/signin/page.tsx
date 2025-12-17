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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError("Please enter both email and password");
        setIsLoading(false);
        return;
      }

      const response = await apiLogin({ email, password });

      if (response.status && response.data) {
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
                <TextInput
                  label="Email"
                  type="email"
                  placeholder="Example@email.com"
                  required
                  labelColor={vars.color.neonMint}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextInput
                  label="Password"
                  type="password"
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                  labelColor={vars.color.neonMint}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
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
                  {isLoading ? "Signing In..." : "Sign In"}
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
