"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { vars } from "@/styles/theme.css";
import Container from "@/components/Layout/Container";
import Typography from "@/components/Typography/Typography";
import { fluidUnit } from "@/styles/fluid-unit";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignupChoicePage() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handlePersonalClick = () => {
    router.push("/signup");
  };

  const handleBusinessClick = () => {
    router.push("/signup-business");
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
      
      <section 
        style={{ 
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          alignItems: 'center',
          padding: `${fluidUnit(100)} ${fluidUnit(20)} ${fluidUnit(80)}`,
        }}
      >
        <Container size="lg">
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: fluidUnit(64) }}>
            <Typography
              as="h1"
              style={{
                fontSize: fluidUnit(56),
                fontWeight: 700,
                color: vars.color.vaultBlack,
                marginBottom: fluidUnit(16),
                lineHeight: 1.1,
              }}
            >
              Choose your account type
            </Typography>
            <Typography
              as="p"
              style={{
                fontSize: fluidUnit(20),
                color: vars.color.muted,
                maxWidth: 600,
                margin: '0 auto',
                lineHeight: 1.6,
              }}
            >
              Select the account that best fits your needs. You can always upgrade later.
            </Typography>
          </div>

          {/* Cards Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: fluidUnit(40),
              maxWidth: 1000,
              margin: '0 auto',
            }}
          >
            {/* Personal Account Card */}
            <button
              onClick={handlePersonalClick}
              onMouseEnter={() => setHoveredCard('personal')}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: vars.color.vaultWhite,
                border: `3px solid ${hoveredCard === 'personal' ? vars.color.neonMint : vars.color.vaultBlack}`,
                borderRadius: fluidUnit(24),
                padding: fluidUnit(48),
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: hoveredCard === 'personal' ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: hoveredCard === 'personal' 
                  ? `8px 8px 0px 0px ${vars.color.neonMint}` 
                  : '4px 4px 0px 0px rgba(0,0,0,0.1)',
                textAlign: 'center',
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: fluidUnit(100),
                  height: fluidUnit(100),
                  background: vars.gradients.vpGradient,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  marginBottom: fluidUnit(32),
                  border: `2px solid ${vars.color.vaultBlack}`,
                }}
              >
                <span style={{ fontSize: fluidUnit(50) }}>👤</span>
              </div>

              <Typography
                as="h2"
                style={{
                  fontSize: fluidUnit(32),
                  fontWeight: 700,
                  color: vars.color.vaultBlack,
                  marginBottom: fluidUnit(16),
                }}
              >
                I'm Personal
              </Typography>

              <Typography
                as="p"
                style={{
                  fontSize: fluidUnit(16),
                  color: vars.color.muted,
                  marginBottom: fluidUnit(24),
                  lineHeight: 1.6,
                }}
              >
                Perfect for individuals managing personal finances, sending money to friends and family, and making everyday purchases.
              </Typography>

              {/* Features List */}
              <div style={{ textAlign: 'left', marginBottom: fluidUnit(24) }}>
                {[
                  'Send & receive money instantly',
                  'Virtual & physical cards',
                  'Multi-currency wallet',
                  'Social payments & feed',
                  'Purchase protection',
                ].map((feature, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: fluidUnit(12),
                      marginBottom: fluidUnit(12),
                    }}
                  >
                    <span style={{ color: vars.color.neonMint, fontSize: fluidUnit(20) }}>✓</span>
                    <Typography
                      as="span"
                      style={{
                        fontSize: fluidUnit(14),
                        color: vars.color.vaultBlack,
                      }}
                    >
                      {feature}
                    </Typography>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div
                style={{
                  marginTop: fluidUnit(32),
                  padding: fluidUnit(16),
                  background: hoveredCard === 'personal' ? vars.color.neonMint : vars.color.cloudSilver,
                  borderRadius: fluidUnit(12),
                  transition: 'all 0.3s ease',
                }}
              >
                <Typography
                  as="span"
                  style={{
                    fontSize: fluidUnit(18),
                    fontWeight: 600,
                    color: vars.color.vaultBlack,
                  }}
                >
                  Get started for free →
                </Typography>
              </div>
            </button>

            {/* Business Account Card */}
            <button
              onClick={handleBusinessClick}
              onMouseEnter={() => setHoveredCard('business')}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: vars.color.vaultWhite,
                border: `3px solid ${hoveredCard === 'business' ? vars.color.vpGreen : vars.color.vaultBlack}`,
                borderRadius: fluidUnit(24),
                padding: fluidUnit(48),
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: hoveredCard === 'business' ? 'translateY(-8px)' : 'translateY(0)',
                boxShadow: hoveredCard === 'business' 
                  ? `8px 8px 0px 0px ${vars.color.vpGreen}` 
                  : '4px 4px 0px 0px rgba(0,0,0,0.1)',
                textAlign: 'center',
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: fluidUnit(100),
                  height: fluidUnit(100),
                  background: 'linear-gradient(135deg, #B8FF9F 0%, #00D4AA 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  marginBottom: fluidUnit(32),
                  border: `2px solid ${vars.color.vaultBlack}`,
                }}
              >
                <span style={{ fontSize: fluidUnit(50) }}>🏢</span>
              </div>

              <Typography
                as="h2"
                style={{
                  fontSize: fluidUnit(32),
                  fontWeight: 700,
                  color: vars.color.vaultBlack,
                  marginBottom: fluidUnit(16),
                }}
              >
                I'm a Business
              </Typography>

              <Typography
                as="p"
                style={{
                  fontSize: fluidUnit(16),
                  color: vars.color.muted,
                  marginBottom: fluidUnit(24),
                  lineHeight: 1.6,
                }}
              >
                Ideal for businesses accepting payments, managing expenses, paying vendors, and scaling globally with powerful tools.
              </Typography>

              {/* Features List */}
              <div style={{ textAlign: 'left', marginBottom: fluidUnit(24) }}>
                {[
                  'Accept payments online & in-store',
                  'Team cards & expense management',
                  'Invoice & billing tools',
                  'Multi-currency accounts',
                  'Advanced analytics & reporting',
                ].map((feature, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: fluidUnit(12),
                      marginBottom: fluidUnit(12),
                    }}
                  >
                    <span style={{ color: vars.color.vpGreen, fontSize: fluidUnit(20) }}>✓</span>
                    <Typography
                      as="span"
                      style={{
                        fontSize: fluidUnit(14),
                        color: vars.color.vaultBlack,
                      }}
                    >
                      {feature}
                    </Typography>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div
                style={{
                  marginTop: fluidUnit(32),
                  padding: fluidUnit(16),
                  background: hoveredCard === 'business' ? vars.color.vpGreen : vars.color.cloudSilver,
                  borderRadius: fluidUnit(12),
                  transition: 'all 0.3s ease',
                }}
              >
                <Typography
                  as="span"
                  style={{
                    fontSize: fluidUnit(18),
                    fontWeight: 600,
                    color: vars.color.vaultBlack,
                  }}
                >
                  Get started for business →
                </Typography>
              </div>
            </button>
          </div>

          {/* Bottom Note */}
          <div style={{ textAlign: 'center', marginTop: fluidUnit(64) }}>
            <Typography
              as="p"
              style={{
                fontSize: fluidUnit(14),
                color: vars.color.muted,
              }}
            >
              Already have an account?{' '}
              <a
                href="/signin"
                style={{
                  color: vars.color.vaultBlack,
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Sign in
              </a>
            </Typography>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
