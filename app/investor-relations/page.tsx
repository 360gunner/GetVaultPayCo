"use client";

import React, { useState } from "react";
import Container from "@/components/Layout/Container";
import Typography from "@/components/Typography/Typography";
import { vars } from "@/styles/theme.css";
import { fluidUnit } from "@/styles/fluid-unit";

export default function InvestorRelationsPage() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText("investors@getvaultpay.co");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${vars.color.vaultWhite} 0%, ${vars.color.vaultNavie} 100%)`,
      paddingTop: fluidUnit(120),
      paddingBottom: fluidUnit(80),
    }}>
      <Container size="xl">
        {/* Logo and Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: fluidUnit(80),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Logo */}
          <img 
            src="/logo_horizontal.svg"
            alt="VaultPay"
            style={{
              height: fluidUnit(60),
              width: 'auto',
              marginBottom: fluidUnit(48),
            }}
          />

          {/* Header */}
          <Typography 
            as="h1" 
            style={{ 
              fontSize: fluidUnit(64),
              fontWeight: 700,
              marginBottom: fluidUnit(24),
              color: vars.color.vaultBlack,
            }}
          >
            Investor Relations
          </Typography>
          <Typography 
            as="p" 
            style={{ 
              fontSize: fluidUnit(24),
              color: vars.color.vaultBlack,
              opacity: 0.7,
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Building the future of digital payments with transparency and trust
          </Typography>
        </div>

        {/* Main Content */}
        <div style={{
          background: vars.color.vaultWhite,
          borderRadius: fluidUnit(24),
          padding: fluidUnit(64),
          border: `3px solid ${vars.color.vaultBlack}`,
          boxShadow: '8px 8px 0px 0px rgba(0,0,0,0.1)',
          marginBottom: fluidUnit(48),
        }}>
          {/* About VaultPay Section */}
          <section style={{ marginBottom: fluidUnit(64) }}>
            <Typography 
              as="h2" 
              style={{ 
                fontSize: fluidUnit(40),
                fontWeight: 700,
                marginBottom: fluidUnit(24),
                color: vars.color.vaultBlack,
              }}
            >
              About VaultPay
            </Typography>
            <Typography 
              as="p" 
              style={{ 
                fontSize: fluidUnit(18),
                lineHeight: 1.8,
                color: vars.color.vaultBlack,
                opacity: 0.8,
                marginBottom: fluidUnit(16),
              }}
            >
              VaultPay Global Inc. is a leading fintech company revolutionizing digital payments and financial services. 
              Headquartered in Sherman Oaks, California, we provide innovative payment solutions for individuals, 
              businesses, and merchants worldwide.
            </Typography>
            <Typography 
              as="p" 
              style={{ 
                fontSize: fluidUnit(18),
                lineHeight: 1.8,
                color: vars.color.vaultBlack,
                opacity: 0.8,
              }}
            >
              Our mission is to make financial transactions seamless, secure, and accessible to everyone. 
              Through cutting-edge technology and strategic partnerships, we're building the payment infrastructure of tomorrow.
            </Typography>
          </section>

          {/* Investment Opportunity Section */}
          <section style={{ marginBottom: fluidUnit(64) }}>
            <Typography 
              as="h2" 
              style={{ 
                fontSize: fluidUnit(40),
                fontWeight: 700,
                marginBottom: fluidUnit(24),
                color: vars.color.vaultBlack,
              }}
            >
              Investment Opportunities
            </Typography>
            <Typography 
              as="p" 
              style={{ 
                fontSize: fluidUnit(18),
                lineHeight: 1.8,
                color: vars.color.vaultBlack,
                opacity: 0.8,
                marginBottom: fluidUnit(24),
              }}
            >
              VaultPay is committed to delivering value to our investors through sustainable growth, 
              innovation, and operational excellence. We welcome inquiries from qualified investors interested 
              in joining us on our journey to transform global payments.
            </Typography>

            {/* Key Highlights */}
            <div style={{ 
              background: vars.color.neonMint,
              padding: fluidUnit(32),
              borderRadius: fluidUnit(16),
              border: `2px solid ${vars.color.vaultBlack}`,
              marginBottom: fluidUnit(24),
            }}>
              <Typography 
                as="h3" 
                style={{ 
                  fontSize: fluidUnit(24),
                  fontWeight: 700,
                  marginBottom: fluidUnit(16),
                  color: vars.color.vaultBlack,
                }}
              >
                Key Highlights
              </Typography>
              <ul style={{ 
                listStyle: 'none', 
                padding: 0,
                margin: 0,
              }}>
                {[
                  'Rapidly growing user base across multiple markets',
                  'Strategic partnerships with major payment networks',
                  'Innovative technology stack with proprietary solutions',
                  'Experienced leadership team with proven track record',
                  'Strong focus on compliance and security',
                  'Scalable business model with multiple revenue streams'
                ].map((item, index) => (
                  <li 
                    key={index}
                    style={{ 
                      fontSize: fluidUnit(16),
                      marginBottom: fluidUnit(12),
                      paddingLeft: fluidUnit(24),
                      position: 'relative',
                      color: vars.color.vaultBlack,
                    }}
                  >
                    <span style={{ 
                      position: 'absolute',
                      left: 0,
                      fontWeight: 700,
                    }}>
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Contact Section */}
          <section style={{
            background: vars.color.vaultBlack,
            padding: fluidUnit(48),
            borderRadius: fluidUnit(16),
            textAlign: 'center',
          }}>
            <Typography 
              as="h2" 
              style={{ 
                fontSize: fluidUnit(32),
                fontWeight: 700,
                marginBottom: fluidUnit(24),
                color: vars.color.vaultWhite,
              }}
            >
              Investor Inquiries
            </Typography>
            <Typography 
              as="p" 
              style={{ 
                fontSize: fluidUnit(18),
                lineHeight: 1.8,
                color: vars.color.vaultWhite,
                maxWidth: '600px',
                margin: '0 auto',
                marginBottom: fluidUnit(32),
              }}
            >
              For investment opportunities, financial reports, or general investor relations inquiries, 
              please contact our investor relations team:
            </Typography>

            <div style={{ display: 'flex', alignItems: 'center', gap: fluidUnit(16), justifyContent: 'center', flexWrap: 'wrap' }}>
              <a 
                href="mailto:investors@getvaultpay.co"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: fluidUnit(12),
                  padding: `${fluidUnit(20)} ${fluidUnit(40)}`,
                  background: vars.color.neonMint,
                  color: vars.color.vaultBlack,
                  fontSize: fluidUnit(20),
                  fontWeight: 700,
                  borderRadius: fluidUnit(50),
                  textDecoration: 'none',
                  border: `3px solid ${vars.color.vaultBlack}`,
                  boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s',
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <span>📧</span>
                investors@getvaultpay.co
              </a>

              <button
                onClick={copyToClipboard}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: fluidUnit(8),
                  padding: `${fluidUnit(20)} ${fluidUnit(24)}`,
                  background: copied ? vars.color.vaultBlack : 'transparent',
                  color: copied ? vars.color.neonMint : vars.color.vaultWhite,
                  fontSize: fluidUnit(16),
                  fontWeight: 600,
                  borderRadius: fluidUnit(50),
                  border: `3px solid ${vars.color.vaultWhite}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  if (!copied) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!copied) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {copied ? (
                  <>
                    <span>✓</span>
                    Copied!
                  </>
                ) : (
                  <>
                    <span>📋</span>
                    Copy
                  </>
                )}
              </button>
            </div>

            <Typography 
              as="p" 
              style={{ 
                fontSize: fluidUnit(14),
                color: 'rgba(255,255,255,0.6)',
                marginTop: fluidUnit(32),
              }}
            >
              We aim to respond to all inquiries within 2-3 business days.
            </Typography>
          </section>
        </div>

        {/* Social Follow Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: fluidUnit(16), 
          marginBottom: fluidUnit(48),
          flexWrap: 'wrap',
        }}>
          {/* Crunchbase Button */}
          <a
            href="https://www.crunchbase.com/organization/venmob-6575"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: fluidUnit(12),
              padding: `${fluidUnit(16)} ${fluidUnit(32)}`,
              background: '#0288D1',
              color: vars.color.vaultWhite,
              fontSize: fluidUnit(18),
              fontWeight: 700,
              borderRadius: fluidUnit(50),
              textDecoration: 'none',
              border: `3px solid ${vars.color.vaultBlack}`,
              boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <img 
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAMAAABC4vDmAAAAY1BMVEUCh9H///8Agc98suAAhNAAf87j7vgpitIAfM3t9PoAes3n8PnI3PFgpNsskNSpyumKt+JOndhDlNVtqt2VvuViodr3+/3Y6PUAdcvQ4vO/2O9/r9+yz+uew+elxuhCkNRWmtggeRPmAAAE0klEQVR4nO2c3XqjIBCGlQxR/I8SrCYm3v9Vrk2qgGJCMV054DvZfRqRVxgZZkA8fxRJaJp5OylLaUImFG/8Dy0xhr2YPA8wLukMKkdoP6BRCOUiVIH3BnoKFxzqHO5NMyo8j1CFNUwDVfGEyi3pu6dw/oCywMRFoW8oahsU9T1S7k0xV0m8xCqL+hZOPGofFPXSHX2LWpB6u/ngdVmI5OTk5OTk5OTk5PReMGpvEC5UkfipJtibZRI6jFmv2Eaoo4N6KQelKwelKwelKwelKwelKwelKwelKwc1aYgI0KC1wEAB9SyA/iySgDAs00sx6JKWYaioZg6FQjhVxaPEOYs+v2w+PHB5rWP2rJOR+toPz/8KaiiRJsdxWZ/FDQ0+vHgelh3fNfAjQrPZMq8IFfU3Ni/RXD7YWijIF0hPLNlWRKh8gfStuv9UY4UXJdKjkpO4MMehyGqJ/CM2D+i6VsEgdhCoONQL1fftjQVQv66k44alBeWz01YqCN4wDVRTW+lB+azcSIXfMvn+1IOaUD65b7IrnOtUUsLvoPxmS1NBNb/bjRZFd43VdSih4qZtk+Psj3TDRhYkvdnkFjw8GQYoE2kYKtAK1LG4fw/tAMGhFkuwk3EHYipW0Gbc30F4Fh+eYSUUufB9Ylgu0RpvPAjE2xSyCwbUij9iBVQLkumAZKCZYVNJdSy3feGE/1rDEqpd2E14e/WrnsKG36NT3APx39ljy4UElUTLEhF3DnFp1lThvCVmgl6ARjMopu4f/t5ejKBQyms4KwcWRMdsMGnwDEq9hQZdeP8ZjVW4m25wXDGAoJw0676VhhIGGWJkVCE35IPeCyxANQqLetyUv4FGUIIdaxqlALW2AUqwCSNL5/MDohkwCVCrI/Z9uqQyMapsGjrr30Pd1665T97mYA9UMFl6YQLFnYxuvPsfWsqbbIqtVrEKpWFTRvvucPO+ilWotR3SwN8+I5csjFP52pgC0qqjzjjFvd/KFa8lzKZidfdDdpqkOaLDZOdrXuK1oJyqWHlTEG/L49z33dS+r+AXmM3TI14FCVRJFmEGTxezBFXEAnxAYIb7S7EQGis28wJ/u33WL+ZTjaKpQj5bPRrOPKVY5jpP/CBxstwopsOLEh4WZp7Gu4ORGIm2nmQE4UmMs1K0hJpTSXN0Zhw4ICnsIxWMsQngQAp0anU0c+w5FqBSmF2b+ZinxFn6dyfR7CsKwyg63+RUTwVKqKF50yjEQ6QYRqerGPdtCZGhnOWZGKmTtp4nn64/Q44qQmZtdzjQVi7CVC+ztrBOdiAer9bOJRhNpQSq7m0NpB8fWxdq86dD7/Mu1W/zUx/4VkBOKCzb6cyr0IJi1Sc+HXppV3H/y5wnOX3mmwocJCs1sFxKjAu7gi7zjJSywBYBTpVZxuYsPzWfA7DAo4pE+rX/5FdfEJXt7NmPbRbNnhqy6kfp0L5fVSJ6ItJQpFrQ2YSFs6obs3Gs7qpM0RHPJSv0s2qDcHmmbR2TYcTtLj38yQc6gKOvCLIMhn80TQMGBxN9Db4J/+02PZs2ATo5OTk5OTk5OTk5OTk5OTk5Of2JLDzZJbPzWB4rDzCy8qgnKw/FsvL4MDsPWrPzSDorD++z85hDOw+EtPPoTN/KQ0Z9q45j/QeOYzeF9xUn9gAAAABJRU5ErkJggg=="
              alt="Crunchbase"
              style={{
                width: '24px',
                height: '24px',
              }}
            />
            Follow on Crunchbase
          </a>

          {/* LinkedIn Button */}
          <a
            href="https://www.linkedin.com/company/80434331"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: fluidUnit(12),
              padding: `${fluidUnit(16)} ${fluidUnit(32)}`,
              background: '#0A66C2',
              color: vars.color.vaultWhite,
              fontSize: fluidUnit(18),
              fontWeight: 700,
              borderRadius: fluidUnit(50),
              textDecoration: 'none',
              border: `3px solid ${vars.color.vaultBlack}`,
              boxShadow: '4px 4px 0px 0px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
            </svg>
            Follow on LinkedIn
          </a>
        </div>

        {/* Company Information */}
        <div style={{
          background: 'rgba(255,255,255,0.7)',
          borderRadius: fluidUnit(16),
          padding: fluidUnit(32),
          border: `2px solid ${vars.color.vaultBlack}`,
        }}>
          <Typography 
            as="h3" 
            style={{ 
              fontSize: fluidUnit(24),
              fontWeight: 700,
              marginBottom: fluidUnit(16),
              color: vars.color.vaultBlack,
            }}
          >
            Corporate Information
          </Typography>
          <div style={{ 
            fontSize: fluidUnit(16),
            lineHeight: 1.8,
            color: vars.color.vaultBlack,
            opacity: 0.8,
          }}>
            <p style={{ margin: 0, marginBottom: fluidUnit(8) }}>
              <strong style={{ color: vars.color.vaultBlack }}>Company:</strong> VaultPay Global Inc.
            </p>
            <p style={{ margin: 0, marginBottom: fluidUnit(8) }}>
              <strong style={{ color: vars.color.vaultBlack }}>Address:</strong> 15442 Ventura Blvd., Ste 201-1952, Sherman Oaks, CA 91403
            </p>
            <p style={{ margin: 0, marginBottom: fluidUnit(8) }}>
              <strong style={{ color: vars.color.vaultBlack }}>Country:</strong> United States of America
            </p>
            <p style={{ margin: 0 }}>
              <strong style={{ color: vars.color.vaultBlack }}>Investor Relations:</strong>{' '}
              <a 
                href="mailto:investors@getvaultpay.co"
                style={{ 
                  color: '#00A896',
                  textDecoration: 'underline',
                  fontWeight: 600,
                }}
              >
                investors@getvaultpay.co
              </a>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
