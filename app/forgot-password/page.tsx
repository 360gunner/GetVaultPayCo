"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { vars } from "@/styles/theme.css";
import Container from "@/components/Layout/Container";
import Typography from "@/components/Typography/Typography";
import { fluidUnit } from "@/styles/fluid-unit";
import TextInput from "@/components/Form/TextInput";
import { AppLink } from "@/components/Link/AppLink";
import { isValidEmail, ClientRateLimiter } from "@/lib/security";

const rateLimiter = new ClientRateLimiter(3, 300000); // 3 attempts per 5 minutes

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    
    // Rate limiting check
    if (!rateLimiter.canAttempt('forgot-password')) {
      setErrors({ general: 'Too many attempts. Please wait 5 minutes before trying again.' });
      return;
    }
    
    // Validate email
    if (!email || !isValidEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call (replace with actual API endpoint)
    setTimeout(() => {
      setStatus('success');
      setIsSubmitting(false);
      setEmail('');
    }, 1500);
  };

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
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: fluidUnit(32) }}>
              <div
                style={{
                  width: fluidUnit(80),
                  height: fluidUnit(80),
                  background: vars.gradients.vpGradient,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  marginBottom: fluidUnit(24),
                }}
              >
                <span style={{ fontSize: fluidUnit(40) }}>🔒</span>
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
                Forgot Password?
              </Typography>
              <Typography
                as="p"
                style={{
                  fontSize: fluidUnit(16),
                  color: vars.color.muted,
                  lineHeight: 1.5,
                }}
              >
                No worries! Enter your email address and we'll send you a link to reset your password.
              </Typography>
            </div>

            {/* Success Message */}
            {status === 'success' && (
              <div
                style={{
                  background: vars.color.neonMint,
                  padding: fluidUnit(20),
                  borderRadius: fluidUnit(12),
                  marginBottom: fluidUnit(24),
                  textAlign: 'center',
                  border: `2px solid ${vars.color.vaultBlack}`,
                }}
              >
                <Typography as="p" style={{ margin: 0, color: vars.color.vaultBlack, fontWeight: 600 }}>
                  ✓ Check your email! If an account exists with that email, you'll receive a password reset link shortly.
                </Typography>
              </div>
            )}

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

            {/* Form */}
            <form onSubmit={handleSubmit}>
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
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  backgroundColor: vars.color.vaultBlack,
                  color: vars.color.vaultWhite,
                  padding: `${fluidUnit(14)} ${fluidUnit(24)}`,
                  borderRadius: fluidUnit(12),
                  border: `2px solid ${vars.color.vaultBlack}`,
                  fontSize: fluidUnit(18),
                  fontWeight: 600,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  opacity: isSubmitting ? 0.6 : 1,
                  marginBottom: fluidUnit(24),
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            {/* Back to Sign In */}
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
          </div>

          {/* Additional Help */}
          <div
            style={{
              marginTop: fluidUnit(32),
              textAlign: 'center',
              padding: fluidUnit(24),
            }}
          >
            <Typography
              as="p"
              style={{
                fontSize: fluidUnit(14),
                color: vars.color.muted,
                marginBottom: fluidUnit(8),
              }}
            >
              Still having trouble accessing your account?
            </Typography>
            <AppLink
              href="/contact"
              style={{
                fontSize: fluidUnit(16),
                color: vars.color.vaultBlack,
                fontWeight: 600,
              }}
            >
              Contact Support
            </AppLink>
          </div>
        </Container>
      </section>

      {/* Security Features Section */}
      <section style={{ padding: `${fluidUnit(80)} 0`, background: vars.color.vaultWhite }}>
        <Container size="lg">
          <Typography
            as="h2"
            style={{
              fontSize: fluidUnit(32),
              fontWeight: 700,
              textAlign: "center",
              marginBottom: fluidUnit(48),
              color: vars.color.vaultBlack,
            }}
          >
            Your security is our priority
          </Typography>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: fluidUnit(32),
            }}
          >
            {[
              {
                icon: "🔐",
                title: "Secure Links",
                description: "Password reset links are valid for only 1 hour and can only be used once.",
              },
              {
                icon: "🛡️",
                title: "Email Verification",
                description: "We verify your identity before sending any reset instructions.",
              },
              {
                icon: "🔒",
                title: "Encrypted",
                description: "All data is encrypted and transmitted securely over HTTPS.",
              },
              {
                icon: "⚡",
                title: "Instant Notifications",
                description: "Get notified immediately of any password change attempts.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  textAlign: "center",
                  padding: fluidUnit(24),
                }}
              >
                <div style={{ fontSize: fluidUnit(48), marginBottom: fluidUnit(16) }}>
                  {feature.icon}
                </div>
                <Typography
                  as="h3"
                  style={{
                    fontSize: fluidUnit(20),
                    fontWeight: 600,
                    marginBottom: fluidUnit(8),
                    color: vars.color.vaultBlack,
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  as="p"
                  style={{
                    fontSize: fluidUnit(14),
                    color: vars.color.muted,
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {feature.description}
                </Typography>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
