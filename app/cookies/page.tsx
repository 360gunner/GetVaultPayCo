"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { vars } from "@/styles/theme.css";
import Container from "@/components/Layout/Container";
import Typography from "@/components/Typography/Typography";
import { fluidUnit } from "@/styles/fluid-unit";

interface CookieCategory {
  id: string;
  title: string;
  description: string;
  example: string;
  required?: boolean;
  enabled: boolean;
}

export default function CookiesPage() {
  const [cookieSettings, setCookieSettings] = useState<CookieCategory[]>([
    {
      id: "essential",
      title: "Essential",
      description:
        "We use essential cookies to make our site work for you and to enable the features you request. These cookies are necessary for the basic functionality of our website.",
      example:
        "Essential cookies let you securely sign in, browse our site, and complete transactions. These cookies help us keep your account safe and prevent fraud.",
      required: true,
      enabled: true,
    },
    {
      id: "functional",
      title: "Functional",
      description:
        "We use functional cookies to customize and enhance your experience on our platform. These cookies remember your choices and provide personalized features.",
      example:
        "Functional cookies let us remember your preferences such as language, currency, country or region, display settings, and recently viewed items.",
      enabled: true,
    },
    {
      id: "performance",
      title: "Performance",
      description:
        "We use performance cookies to understand how you interact with our site. This helps us identify areas for improvement and optimize your experience.",
      example:
        "Performance cookies help us learn which pages are the most popular, how you navigate through our site, and which features you use most frequently.",
      enabled: true,
    },
    {
      id: "marketing",
      title: "Marketing",
      description:
        "We use marketing cookies to deliver advertisements that are relevant to you. These cookies track your browsing activity to help us show you personalized content.",
      example:
        "Marketing cookies let us show you personalized offers and promotions based on your interests and browsing history across our partner sites.",
      enabled: false,
    },
  ]);

  const toggleCookie = (id: string) => {
    setCookieSettings((prev) =>
      prev.map((cookie) =>
        cookie.id === id && !cookie.required
          ? { ...cookie, enabled: !cookie.enabled }
          : cookie
      )
    );
  };

  const acceptAll = () => {
    setCookieSettings((prev) =>
      prev.map((cookie) => ({ ...cookie, enabled: true }))
    );
  };

  const rejectOptional = () => {
    setCookieSettings((prev) =>
      prev.map((cookie) =>
        cookie.required ? cookie : { ...cookie, enabled: false }
      )
    );
  };

  const savePreferences = () => {
    // In a real implementation, this would save to localStorage or a cookie
    const preferences = cookieSettings.reduce((acc, cookie) => {
      acc[cookie.id] = cookie.enabled;
      return acc;
    }, {} as Record<string, boolean>);
    
    if (typeof window !== "undefined") {
      localStorage.setItem("vaultpay_cookie_preferences", JSON.stringify(preferences));
    }
    
    alert("Your cookie preferences have been saved.");
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section
        style={{
          padding: `${fluidUnit(120)} 0 ${fluidUnit(60)} 0`,
          background: vars.color.vaultNavie,
        }}
      >
        <Container size="lg">
          <Typography
            as="p"
            style={{
              fontSize: fluidUnit(14),
              fontWeight: 600,
              color: vars.color.neonMint,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: fluidUnit(16),
            }}
          >
            Privacy & Cookies
          </Typography>
          <Typography
            as="h1"
            style={{
              fontSize: fluidUnit(56),
              fontWeight: 700,
              color: vars.color.vaultWhite,
              marginBottom: fluidUnit(24),
              lineHeight: 1.1,
            }}
          >
            Manage Your Cookie Settings
          </Typography>
          <Typography
            as="p"
            style={{
              fontSize: fluidUnit(18),
              color: vars.color.slateGray,
              maxWidth: 700,
              lineHeight: 1.6,
            }}
          >
            You have control over how we use cookies on each device and browser you use. 
            These settings will apply to your current device and browser session.
          </Typography>
        </Container>
      </section>

      {/* What are cookies */}
      <section
        style={{
          padding: `${fluidUnit(60)} 0`,
          background: vars.color.cloudSilver,
        }}
      >
        <Container size="lg">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: fluidUnit(48),
              alignItems: "center",
            }}
          >
            <div>
              <Typography
                as="h2"
                style={{
                  fontSize: fluidUnit(36),
                  fontWeight: 700,
                  color: vars.color.vaultBlack,
                  marginBottom: fluidUnit(20),
                }}
              >
                What are cookies?
              </Typography>
              <Typography
                as="p"
                style={{
                  fontSize: fluidUnit(16),
                  color: vars.color.muted,
                  lineHeight: 1.7,
                }}
              >
                Cookies and tracking technologies are small text files stored on your device 
                when you use a web browser. Some cookies are essential for you to use our site, 
                while other cookies collect data about your browsing habits. We use this data 
                to give you the best possible experience and to improve our services.
              </Typography>
            </div>
            <div
              style={{
                background: vars.color.vaultWhite,
                borderRadius: fluidUnit(16),
                padding: fluidUnit(32),
                boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
              }}
            >
              <div style={{ display: "flex", gap: fluidUnit(16), marginBottom: fluidUnit(20) }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: vars.color.neonMint,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                  }}
                >
                  🍪
                </div>
                <div>
                  <Typography
                    as="p"
                    style={{
                      fontSize: fluidUnit(16),
                      fontWeight: 600,
                      color: vars.color.vaultBlack,
                    }}
                  >
                    Your Privacy Matters
                  </Typography>
                  <Typography
                    as="p"
                    style={{
                      fontSize: fluidUnit(14),
                      color: vars.color.muted,
                    }}
                  >
                    We respect your choices
                  </Typography>
                </div>
              </div>
              <Typography
                as="p"
                style={{
                  fontSize: fluidUnit(14),
                  color: vars.color.muted,
                  lineHeight: 1.6,
                }}
              >
                At VaultPay, we believe you should have full control over your data. 
                That&apos;s why we make it easy to manage your cookie preferences at any time.
              </Typography>
            </div>
          </div>
        </Container>
      </section>

      {/* Cookie Settings */}
      <section
        style={{
          padding: `${fluidUnit(80)} 0`,
          background: vars.color.vaultWhite,
        }}
      >
        <Container size="lg">
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <Typography
              as="h2"
              style={{
                fontSize: fluidUnit(36),
                fontWeight: 700,
                color: vars.color.vaultBlack,
                marginBottom: fluidUnit(16),
                textAlign: "center",
              }}
            >
              Cookie Preferences
            </Typography>
            <Typography
              as="p"
              style={{
                fontSize: fluidUnit(16),
                color: vars.color.muted,
                marginBottom: fluidUnit(48),
                textAlign: "center",
              }}
            >
              Choose which cookies you want to allow. You can change these settings at any time.
            </Typography>

            {/* Quick Actions */}
            <div
              style={{
                display: "flex",
                gap: fluidUnit(16),
                marginBottom: fluidUnit(40),
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={acceptAll}
                style={{
                  padding: `${fluidUnit(14)} ${fluidUnit(32)}`,
                  background: vars.color.neonMint,
                  border: "none",
                  borderRadius: fluidUnit(8),
                  fontSize: fluidUnit(14),
                  fontWeight: 600,
                  color: vars.color.vaultBlack,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Accept All Cookies
              </button>
              <button
                onClick={rejectOptional}
                style={{
                  padding: `${fluidUnit(14)} ${fluidUnit(32)}`,
                  background: "transparent",
                  border: `2px solid ${vars.color.vaultBlack}`,
                  borderRadius: fluidUnit(8),
                  fontSize: fluidUnit(14),
                  fontWeight: 600,
                  color: vars.color.vaultBlack,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Essential Only
              </button>
            </div>

            {/* Cookie Categories */}
            <div style={{ display: "flex", flexDirection: "column", gap: fluidUnit(24) }}>
              {cookieSettings.map((cookie) => (
                <div
                  key={cookie.id}
                  style={{
                    background: cookie.required ? "#f0fdf4" : vars.color.vaultWhite,
                    border: `1px solid ${cookie.required ? vars.color.neonMint : vars.color.cloudSilver}`,
                    borderRadius: fluidUnit(16),
                    padding: fluidUnit(28),
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: fluidUnit(16),
                      flexWrap: "wrap",
                      gap: fluidUnit(16),
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: fluidUnit(12) }}>
                        <Typography
                          as="h3"
                          style={{
                            fontSize: fluidUnit(20),
                            fontWeight: 700,
                            color: vars.color.vaultBlack,
                          }}
                        >
                          {cookie.title}
                        </Typography>
                        {cookie.required && (
                          <span
                            style={{
                              fontSize: fluidUnit(11),
                              fontWeight: 600,
                              color: vars.color.vaultBlack,
                              background: vars.color.neonMint,
                              padding: `${fluidUnit(4)} ${fluidUnit(10)}`,
                              borderRadius: fluidUnit(20),
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            Always Active
                          </span>
                        )}
                      </div>
                    </div>
                    {!cookie.required && (
                      <button
                        onClick={() => toggleCookie(cookie.id)}
                        style={{
                          width: 56,
                          height: 32,
                          borderRadius: 16,
                          border: "none",
                          background: cookie.enabled ? vars.color.neonMint : vars.color.cloudSilver,
                          cursor: "pointer",
                          position: "relative",
                          transition: "all 0.2s ease",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            top: 4,
                            left: cookie.enabled ? 28 : 4,
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: vars.color.vaultWhite,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                            transition: "all 0.2s ease",
                          }}
                        />
                      </button>
                    )}
                  </div>
                  <Typography
                    as="p"
                    style={{
                      fontSize: fluidUnit(15),
                      color: vars.color.muted,
                      lineHeight: 1.6,
                      marginBottom: fluidUnit(12),
                    }}
                  >
                    {cookie.description}
                  </Typography>
                  <div
                    style={{
                      background: cookie.required ? "rgba(6, 255, 137, 0.15)" : "#f9fafb",
                      borderRadius: fluidUnit(8),
                      padding: fluidUnit(16),
                    }}
                  >
                    <Typography
                      as="p"
                      style={{
                        fontSize: fluidUnit(14),
                        color: vars.color.muted,
                        fontStyle: "italic",
                      }}
                    >
                      <strong style={{ fontStyle: "normal", color: vars.color.vaultBlack }}>
                        For example:
                      </strong>{" "}
                      {cookie.example}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>

            {/* Save Button */}
            <div style={{ marginTop: fluidUnit(48), textAlign: "center" }}>
              <button
                onClick={savePreferences}
                style={{
                  padding: `${fluidUnit(18)} ${fluidUnit(48)}`,
                  background: vars.color.vaultBlack,
                  border: "none",
                  borderRadius: fluidUnit(8),
                  fontSize: fluidUnit(16),
                  fontWeight: 600,
                  color: vars.color.vaultWhite,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Save My Preferences
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Cookie Statement Link */}
      <section
        style={{
          padding: `${fluidUnit(60)} 0`,
          background: vars.color.cloudSilver,
        }}
      >
        <Container size="lg">
          <div
            style={{
              maxWidth: 700,
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <Typography
              as="h3"
              style={{
                fontSize: fluidUnit(24),
                fontWeight: 700,
                color: vars.color.vaultBlack,
                marginBottom: fluidUnit(16),
              }}
            >
              Learn More About Our Privacy Practices
            </Typography>
            <Typography
              as="p"
              style={{
                fontSize: fluidUnit(16),
                color: vars.color.muted,
                lineHeight: 1.6,
                marginBottom: fluidUnit(24),
              }}
            >
              You can read more about how we use cookies and protect your data in our{" "}
              <a
                href="/privacy"
                style={{
                  color: vars.color.vaultBlack,
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="/terms"
                style={{
                  color: vars.color.vaultBlack,
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
              >
                Terms of Service
              </a>
              .
            </Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: fluidUnit(16),
                flexWrap: "wrap",
              }}
            >
              <a
                href="/privacy"
                style={{
                  padding: `${fluidUnit(12)} ${fluidUnit(24)}`,
                  background: vars.color.vaultWhite,
                  border: `1px solid ${vars.color.cloudSilver}`,
                  borderRadius: fluidUnit(8),
                  fontSize: fluidUnit(14),
                  fontWeight: 600,
                  color: vars.color.vaultBlack,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                style={{
                  padding: `${fluidUnit(12)} ${fluidUnit(24)}`,
                  background: vars.color.vaultWhite,
                  border: `1px solid ${vars.color.cloudSilver}`,
                  borderRadius: fluidUnit(8),
                  fontSize: fluidUnit(14),
                  fontWeight: 600,
                  color: vars.color.vaultBlack,
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                Terms of Service
              </a>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
