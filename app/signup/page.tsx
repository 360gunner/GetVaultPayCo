"use client";
import Navbar from "@/components/Navbar/Navbar";
import Link from "next/link";
import { vars } from "@/styles/theme.css";
import React from "react";
import Typography from "@/components/Typography/Typography";
import Button from "@/components/Button/Button";
import TextInput from "@/components/Form/TextInput";
import SocialButton from "@/components/Button/SocialButton";

export default function SignUpPage() {
  return (
    <div style={{ background: vars.gradients.vpGradient }}>
      <Navbar noBg />
      <main
        style={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 16px",
          paddingTop: 0,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 430,
            borderRadius: 16,
            paddingTop: 0,
          }}
        >
          {/* Title */}
          <Typography
            as="h1"
            font="Instrument Sans"
            style={{
              margin: 0,
              marginBottom: 8,
              fontWeight: 400,
              fontSize: 60,
              lineHeight: 1.1,
              letterSpacing: "-0.5px",
              textAlign: "center",
            }}
          >
            Sign up for free
          </Typography>
          <Typography
            as="p"
            font="Instrument Sans"
            style={{
              margin: 0,
              marginBottom: 18,
              fontSize: 20,
              textAlign: "center",
              color: vars.color.vaultNavie,
              fontWeight: 400,
              lineHeight: 1.6,
              letterSpacing: "0.2px",
            }}
          >
            Get your Vault Pay set up for free in minutes.
          </Typography>

          {/* Form */}
          <form
            onSubmit={(e) => e.preventDefault()}
            style={{ display: "grid", gap: 12 }}
          >
            <TextInput
              label="Email"
              type="email"
              placeholder="Example@email.com"
              required
            />
            <TextInput
              label="Password"
              type="password"
              placeholder="At least 8 characters"
              minLength={8}
              required
            />

            <Button
              variant="secondary"
              size="large"
              style={{
                marginTop: 16,
                width: "100%",
                padding: "12px 16px",
                borderRadius: 12,
                background: vars.color.vaultNavie,
                color: "#fff",
                fontWeight: 600,
                border: "none",
              }}
            >
              <Typography
                as="span"
                font="Instrument Sans"
                style={{ fontSize: 20 }}
              >
                Sign Up
              </Typography>
            </Button>
          </form>

          {/* Separator */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto 1fr",
              alignItems: "center",
              padding: "0 16px",
              gap: 12,
              margin: "32px 0",
            }}
          >
            <div style={{ height: 1, background: vars.color.vaultNavie }} />
            <Typography
              as="span"
              font="Instrument Sans"
              style={{
                margin: 0,
                fontSize: 16,
                textAlign: "center",
                color: vars.color.vaultNavie,
              }}
            >
              Or
            </Typography>
            <div style={{ height: 1, background: vars.color.vaultNavie }} />
          </div>

          {/* Social buttons */}
          <div style={{ display: "grid", gap: 18 }}>
            <SocialButton
              label="Sign in with Google"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611 20.083H42V20H24v8h11.303C33.882 32.328 29.323 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.152 7.938 3.041l5.657-5.657C34.754 6.053 29.652 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 13 24 13c3.059 0 5.842 1.152 7.938 3.041l5.657-5.657C34.754 6.053 29.652 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.263 0 10.082-2.015 13.73-5.303l-6.337-5.377C29.165 35.324 26.715 36 24 36c-5.303 0-9.846-3.654-11.298-8.584l-6.541 5.036C9.474 38.778 16.227 44 24 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611 20.083H42V20H24v8h11.303a12.02 12.02 0 01-4.083 5.32l.003-.002 6.337 5.377C36.985 39.409 44 34 44 24c0-1.341-.138-2.651-.389-3.917z"
                  />
                </svg>
              }
            />

            <SocialButton
              label="Sign in with Facebook"
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="#1877F2"
                >
                  <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5 3.66 9.14 8.44 9.93v-7.02H7.9v-2.91h2.4V9.41c0-2.37 1.41-3.68 3.56-3.68 1.03 0 2.11.18 2.11.18v2.32h-1.19c-1.17 0-1.54.73-1.54 1.48v1.78h2.63l-.42 2.91h-2.21v7.02c4.78-.79 8.44-4.93 8.44-9.93z" />
                </svg>
              }
            />
          </div>

          {/* Footer text */}
          <div
            style={{
              marginTop: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              fontFamily: "Instrument Sans, system-ui, sans-serif",
              fontSize: 14,
            }}
          >
            <span>Already have an account?</span>
            <Link
              href="/signin"
              style={{ color: "#2563eb", textDecoration: "none" }}
            >
              Sign in
            </Link>
          </div>

          {/* Bottom copyright */}
          <div
            style={{
              marginTop: 16,
              textAlign: "center",
              color: "#6b7280",
              fontFamily: "Instrument Sans, system-ui, sans-serif",
              fontSize: 12,
            }}
          >
            © 2025 ALL RIGHTS RESERVED
          </div>
        </div>
      </main>
    </div>
  );
}
