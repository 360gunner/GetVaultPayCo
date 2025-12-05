"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { vars } from "@/styles/theme.css";
import Typography from "@/components/Typography/Typography";
import { fluidUnit } from "@/styles/fluid-unit";
import Image from "next/image";

export default function KYCVerificationPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const isUSA = selectedCountry === "US";

  // Get country from localStorage (saved during signup)
  useEffect(() => {
    const country = localStorage.getItem("signupCountry") || "";
    setSelectedCountry(country);
  }, []);

  const handleSendLink = () => {
    if (phoneNumber) {
      console.log("Sending verification link to:", phoneNumber);
      setLinkSent(true);
      setTimeout(() => setLinkSent(false), 3000);
    }
  };

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
    }}>
      <Navbar />
      
      <main style={{ 
        minHeight: "calc(100vh - 80px)", 
        display: "flex", 
        alignItems: "center", 
        padding: `${fluidUnit(100)} ${fluidUnit(40)} ${fluidUnit(40)}` 
      }}>
        <div style={{ 
          width: "100%", 
          maxWidth: 1200, 
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: fluidUnit(60),
          alignItems: "center",
        }}>
          
          {/* Left Side - Phone Mockup */}
          <div style={{ 
            display: "flex", 
            justifyContent: "center",
            alignItems: "center",
          }}>
            <div style={{
              position: "relative",
              width: "100%",
              maxWidth: 350,
            }}>
              {/* Phone Frame */}
              <div style={{
                background: vars.color.vaultBlack,
                borderRadius: fluidUnit(32),
                padding: fluidUnit(12),
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              }}>
                {/* Phone Screen */}
                <div style={{
                  background: vars.color.vpGreen,
                  borderRadius: fluidUnit(24),
                  aspectRatio: "9/19.5",
                  overflow: "hidden",
                  position: "relative",
                }}>
                  {/* Notch */}
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "40%",
                    height: fluidUnit(24),
                    background: vars.color.vaultBlack,
                    borderBottomLeftRadius: fluidUnit(16),
                    borderBottomRightRadius: fluidUnit(16),
                    zIndex: 10,
                  }} />
                  
                  {/* KYC Screen Content */}
                  <div style={{
                    padding: `${fluidUnit(48)} ${fluidUnit(20)} ${fluidUnit(20)}`,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}>
                    {/* Header */}
                    <div>
                      <div style={{ marginBottom: fluidUnit(32), textAlign: "center" }}>
                        <Typography as="p" style={{ fontSize: fluidUnit(10), fontWeight: 600, marginBottom: fluidUnit(8) }}>
                          Step 1 of 4
                        </Typography>
                      </div>

                      {/* Shield Icon */}
                      <div style={{
                        width: fluidUnit(60),
                        height: fluidUnit(60),
                        margin: "0 auto",
                        marginBottom: fluidUnit(24),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}>
                        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2L4 6v5c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z" 
                            stroke={vars.color.vaultBlack} 
                            strokeWidth="2" 
                            fill="none"
                          />
                        </svg>
                      </div>

                      <Typography as="h2" style={{ 
                        fontSize: fluidUnit(18), 
                        fontWeight: 700, 
                        textAlign: "center",
                        marginBottom: fluidUnit(16),
                        color: vars.color.vaultBlack 
                      }}>
                        Verify Your Identity
                      </Typography>
                      
                      <Typography as="p" style={{ 
                        fontSize: fluidUnit(10), 
                        color: "#666",
                        textAlign: "center",
                        lineHeight: 1.4,
                        marginBottom: fluidUnit(24),
                        padding: `0 ${fluidUnit(8)}`,
                      }}>
                        To keep your account secure and comply with regulations, we need to verify your identity. This process is quick and secure.
                      </Typography>
                      
                      {/* Verification Steps */}
                      <div style={{ marginBottom: fluidUnit(24) }}>
                        {[
                          { icon: "📄", text: "Identification number from your government-issued ID" },
                          { icon: "🪪", text: "Government-issued ID (Passport, Driver's License, or National ID)" },
                          { icon: "📸", text: "Take a selfie for identity confirmation" }
                        ].map((step, idx) => (
                          <div key={idx} style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: fluidUnit(8),
                            marginBottom: fluidUnit(12),
                            padding: `${fluidUnit(8)} 0`,
                          }}>
                            <span style={{ fontSize: fluidUnit(14) }}>{step.icon}</span>
                            <Typography as="span" style={{ fontSize: fluidUnit(9), fontWeight: 600, lineHeight: 1.3 }}>
                              {step.text}
                            </Typography>
                          </div>
                        ))}
                      </div>

                      {/* Time indicator */}
                      <div style={{ 
                        textAlign: "center",
                        padding: `${fluidUnit(8)} 0`,
                      }}>
                        <Typography as="p" style={{ 
                          fontSize: fluidUnit(8), 
                          color: "#999",
                          fontStyle: "italic"
                        }}>
                          ⏱️ This process takes about 3-4 minutes
                        </Typography>
                      </div>
                    </div>

                    {/* Start Button */}
                    <div style={{ padding: `${fluidUnit(12)} 0` }}>
                      <div style={{
                        background: vars.color.vaultBlack,
                        color: vars.color.vaultWhite,
                        padding: fluidUnit(12),
                        borderRadius: fluidUnit(24),
                        textAlign: "center",
                      }}>
                        <Typography as="span" style={{ fontSize: fluidUnit(12), fontWeight: 700 }}>
                          Start Verification
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - QR Code & Phone Input */}
          <div>
            <Typography as="h1" style={{ 
              fontSize: fluidUnit(48), 
              fontWeight: 700, 
              marginBottom: fluidUnit(16),
              color: vars.color.vaultBlack,
              lineHeight: 1.2
            }}>
              Verify Your Identity
            </Typography>
            
            <Typography as="p" style={{ 
              fontSize: fluidUnit(18), 
              marginBottom: fluidUnit(24),
              color: "#333",
              lineHeight: 1.6
            }}>
              Please scan the QR code to verify your identity using your phone, or enter your phone number to receive the link.
            </Typography>

            {/* Plaid Message for USA */}
            {isUSA && (
              <div style={{
                background: vars.color.neonMint,
                border: `3px solid ${vars.color.vaultBlack}`,
                borderRadius: fluidUnit(16),
                padding: fluidUnit(24),
                marginBottom: fluidUnit(32),
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: fluidUnit(16) }}>
                  <div style={{
                    width: fluidUnit(48),
                    height: fluidUnit(48),
                    background: vars.color.vaultWhite,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `2px solid ${vars.color.vaultBlack}`,
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: fluidUnit(24) }}>🔒</span>
                  </div>
                  <div>
                    <Typography as="h3" style={{ 
                      fontSize: fluidUnit(20), 
                      fontWeight: 700, 
                      marginBottom: fluidUnit(8),
                      color: vars.color.vaultBlack 
                    }}>
                      Secure Verification with Plaid
                    </Typography>
                    <Typography as="p" style={{ 
                      fontSize: fluidUnit(15), 
                      color: vars.color.vaultBlack,
                      lineHeight: 1.6,
                      fontWeight: 600
                    }}>
                      <strong>For U.S. residents:</strong> Your KYC verification will be securely processed through Plaid, a trusted leader in financial data security. Plaid uses bank-level encryption and is trusted by over 8,000 financial institutions to protect your personal information.
                    </Typography>
                  </div>
                </div>
              </div>
            )}

            {/* Non-USA Message */}
            {!isUSA && selectedCountry && (
              <div style={{
                background: 'rgba(255,255,255,0.6)',
                border: `2px solid ${vars.color.vaultBlack}`,
                borderRadius: fluidUnit(16),
                padding: fluidUnit(20),
                marginBottom: fluidUnit(32),
              }}>
                <Typography as="p" style={{ 
                  fontSize: fluidUnit(14), 
                  color: vars.color.vaultBlack,
                  lineHeight: 1.6,
                }}>
                  ℹ️ Your identity verification will be processed securely through our international verification partner using industry-standard encryption and security protocols.
                </Typography>
              </div>
            )}

            {/* QR Code Section */}
            <div style={{
              background: vars.color.vaultWhite,
              border: `3px solid ${vars.color.vaultBlack}`,
              borderRadius: fluidUnit(24),
              padding: fluidUnit(32),
              marginBottom: fluidUnit(32),
              textAlign: "center",
            }}>
              <Typography as="h3" style={{ 
                fontSize: fluidUnit(20), 
                fontWeight: 700, 
                marginBottom: fluidUnit(24),
                color: vars.color.vaultBlack 
              }}>
                Scan QR Code
              </Typography>
              
              {/* Mock QR Code */}
              <div style={{
                width: fluidUnit(200),
                height: fluidUnit(200),
                background: vars.color.vaultBlack,
                margin: "0 auto",
                marginBottom: fluidUnit(16),
                borderRadius: fluidUnit(12),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}>
                {/* QR Code Pattern (simplified) */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(8, 1fr)",
                  gap: 2,
                  width: "80%",
                  height: "80%",
                }}>
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div 
                      key={i} 
                      style={{
                        background: Math.random() > 0.5 ? vars.color.vaultWhite : vars.color.vaultBlack,
                        borderRadius: 2,
                      }}
                    />
                  ))}
                </div>
              </div>
              
              <Typography as="p" style={{ 
                fontSize: fluidUnit(14), 
                color: "#666" 
              }}>
                Use your phone camera to scan
              </Typography>
            </div>

            {/* Divider */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: fluidUnit(16),
              marginBottom: fluidUnit(32),
            }}>
              <div style={{ flex: 1, height: 2, background: "rgba(0,0,0,0.2)" }} />
              <Typography as="span" style={{ fontSize: fluidUnit(14), fontWeight: 600, color: "#666" }}>
                OR
              </Typography>
              <div style={{ flex: 1, height: 2, background: "rgba(0,0,0,0.2)" }} />
            </div>

            {/* Phone Number Input */}
            <div style={{
              background: vars.color.vaultWhite,
              border: `3px solid ${vars.color.vaultBlack}`,
              borderRadius: fluidUnit(24),
              padding: fluidUnit(32),
            }}>
              <Typography as="h3" style={{ 
                fontSize: fluidUnit(20), 
                fontWeight: 700, 
                marginBottom: fluidUnit(16),
                color: vars.color.vaultBlack 
              }}>
                Send Link to Phone
              </Typography>
              
              <Typography as="p" style={{ 
                fontSize: fluidUnit(14), 
                marginBottom: fluidUnit(24),
                color: "#666" 
              }}>
                We'll send you a verification link via SMS
              </Typography>

              <div style={{ marginBottom: fluidUnit(16) }}>
                <label style={{ 
                  display: "block", 
                  fontSize: fluidUnit(14), 
                  fontWeight: 600, 
                  marginBottom: fluidUnit(8),
                  color: vars.color.vaultBlack
                }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={{
                    width: "100%",
                    padding: fluidUnit(16),
                    borderRadius: fluidUnit(12),
                    border: `2px solid ${vars.color.vaultBlack}`,
                    fontSize: fluidUnit(16),
                    backgroundColor: vars.color.cloudSilver,
                  }}
                />
              </div>

              <button
                onClick={handleSendLink}
                disabled={!phoneNumber || linkSent}
                style={{
                  width: "100%",
                  padding: fluidUnit(16),
                  background: linkSent ? vars.color.neonMint : vars.color.vaultBlack,
                  color: vars.color.vaultWhite,
                  border: 'none',
                  borderRadius: fluidUnit(50),
                  fontSize: fluidUnit(16),
                  fontWeight: 600,
                  cursor: phoneNumber && !linkSent ? 'pointer' : 'not-allowed',
                  opacity: phoneNumber && !linkSent ? 1 : 0.6,
                  transition: 'all 0.3s ease',
                }}
              >
                {linkSent ? '✓ Link Sent!' : 'Send Verification Link'}
              </button>
            </div>

            {/* Help Text */}
            <div style={{
              marginTop: fluidUnit(24),
              padding: fluidUnit(16),
              background: 'rgba(255,255,255,0.5)',
              borderRadius: fluidUnit(12),
            }}>
              <Typography as="p" style={{ fontSize: fluidUnit(12), color: "#666", lineHeight: 1.5 }}>
                💡 <strong>Why verify?</strong> Identity verification helps us keep your account secure and comply with financial regulations.
              </Typography>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
