import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import SplitHero from "@/components/sections/SplitHero";
import { vars } from "@/styles/theme.css";
import Container from "@/components/Layout/Container";
import Typography from "@/components/Typography/Typography";
import { fluidUnit } from "@/styles/fluid-unit";
import ImageLeftEyebrowRightSection from "@/components/sections/ImageLeftEyebrowRightSection";

export default function AccessibilityPage() {
  return (
    <>
      <Navbar />
      <SplitHero
        eyebrow="ACCESSIBILITY"
        title="Financial services for everyone"
        description="At VaultPay, we believe financial services should be accessible to all. We're committed to ensuring our platform is usable by everyone, regardless of ability or technology."
        buttonLabel="Get Started"
        buttonVariant="secondary"
        buttonHref="/signup"
        imageSrc="/image 102.png"
        imageAlt="Accessibility"
        containerSize="2xl"
        gridTemplateColumns="1fr 1fr"
        containerStyle={{ padding: `${vars.space.xl} ${vars.space["4xl"]}` }}
        imageWidth={685}
        imageHeight={649}
        minColWidth={360}
      />

      <section style={{ padding: `${fluidUnit(80)} 0` }}>
        <Container size="lg">
          <Typography
            as="h2"
            style={{
              fontSize: fluidUnit(48),
              fontWeight: 700,
              textAlign: "center",
              marginBottom: fluidUnit(64),
              color: vars.color.vaultBlack,
            }}
          >
            Our Commitment
          </Typography>
          <div
            style={{
              maxWidth: 800,
              margin: "0 auto",
              fontSize: fluidUnit(18),
              lineHeight: 1.8,
              color: vars.color.muted,
            }}
          >
            <Typography as="p" style={{ marginBottom: fluidUnit(24) }}>
              VaultPay is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
            </Typography>
            <Typography as="p" style={{ marginBottom: fluidUnit(24) }}>
              We strive to conform to Level AA of the Web Content Accessibility Guidelines (WCAG) 2.1. These guidelines explain how to make web content more accessible for people with disabilities and more user-friendly for everyone.
            </Typography>
          </div>
        </Container>
      </section>

      <ImageLeftEyebrowRightSection
        variant="ltr"
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/image 91.png",
          alt: "Accessibility Features",
          width: 503,
          height: 545,
        }}
        eyebrow="FEATURES"
        title="Built for accessibility"
        text="Our app and website include features like screen reader support, keyboard navigation, high contrast modes, adjustable text sizes, and clear focus indicators. We test regularly with assistive technologies to ensure a great experience for all users."
      />

      <section style={{ padding: `${fluidUnit(80)} 0`, background: vars.color.cloudSilver }}>
        <Container size="lg">
          <Typography
            as="h2"
            style={{
              fontSize: fluidUnit(48),
              fontWeight: 700,
              textAlign: "center",
              marginBottom: fluidUnit(64),
              color: vars.color.vaultBlack,
            }}
          >
            Accessibility Features
          </Typography>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: fluidUnit(32),
            }}
          >
            {[
              {
                icon: "🎤",
                title: "Screen Reader Support",
                description: "Full compatibility with JAWS, NVDA, VoiceOver, and TalkBack screen readers.",
              },
              {
                icon: "⌨️",
                title: "Keyboard Navigation",
                description: "Complete keyboard accessibility with clear focus indicators and logical tab order.",
              },
              {
                icon: "🎨",
                title: "High Contrast Mode",
                description: "Enhanced contrast ratios and color options for users with visual impairments.",
              },
              {
                icon: "📏",
                title: "Adjustable Text Size",
                description: "Resize text up to 200% without loss of functionality or readability.",
              },
              {
                icon: "🔊",
                title: "Audio Descriptions",
                description: "Alternative text for images and audio descriptions for video content.",
              },
              {
                icon: "⏱️",
                title: "Flexible Timing",
                description: "Adjustable timeout settings and the ability to pause, stop, or hide moving content.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  background: vars.color.vaultWhite,
                  borderRadius: fluidUnit(16),
                  padding: fluidUnit(32),
                  border: `2px solid ${vars.color.vaultBlack}`,
                }}
              >
                <div style={{ fontSize: fluidUnit(56), marginBottom: fluidUnit(16) }}>
                  {feature.icon}
                </div>
                <Typography
                  as="h3"
                  style={{
                    fontSize: fluidUnit(24),
                    fontWeight: 700,
                    marginBottom: fluidUnit(12),
                    color: vars.color.vaultBlack,
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  as="p"
                  style={{
                    fontSize: fluidUnit(16),
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

      <ImageLeftEyebrowRightSection
        variant="rtl"
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/image 95_1.png",
          alt: "Customer Support",
          width: 569,
          height: 458,
        }}
        eyebrow="SUPPORT"
        title="We're here to help"
        text="If you encounter any accessibility barriers while using VaultPay, please let us know. Contact our accessibility team at accessibility@getvaultpay.co or call our support line. We take all feedback seriously and use it to improve our services."
      />

      <section style={{ padding: `${fluidUnit(80)} 0` }}>
        <Container size="lg">
          <Typography
            as="h2"
            style={{
              fontSize: fluidUnit(48),
              fontWeight: 700,
              textAlign: "center",
              marginBottom: fluidUnit(64),
              color: vars.color.vaultBlack,
            }}
          >
            Standards & Compliance
          </Typography>
          <div
            style={{
              maxWidth: 800,
              margin: "0 auto",
            }}
          >
            <div
              style={{
                background: vars.color.vaultWhite,
                border: `2px solid ${vars.color.vaultBlack}`,
                borderRadius: fluidUnit(16),
                padding: fluidUnit(40),
              }}
            >
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: fluidUnit(16),
                }}
              >
                {[
                  "WCAG 2.1 Level AA compliance",
                  "Section 508 standards adherence",
                  "ADA (Americans with Disabilities Act) compliance",
                  "Regular accessibility audits and testing",
                  "Continuous improvement based on user feedback",
                  "Training for all team members on accessibility best practices",
                ].map((item, index) => (
                  <li
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: fluidUnit(12),
                      fontSize: fluidUnit(16),
                      color: vars.color.vaultBlack,
                    }}
                  >
                    <span
                      style={{
                        fontSize: fluidUnit(20),
                        color: vars.color.neonMint,
                        fontWeight: 700,
                      }}
                    >
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section style={{ padding: `${fluidUnit(80)} 0`, background: vars.color.neonMint }}>
        <Container size="md">
          <div style={{ textAlign: "center" }}>
            <Typography
              as="h2"
              style={{
                fontSize: fluidUnit(40),
                fontWeight: 700,
                marginBottom: fluidUnit(16),
                color: vars.color.vaultBlack,
              }}
            >
              Have feedback or need assistance?
            </Typography>
            <Typography
              as="p"
              style={{
                fontSize: fluidUnit(18),
                color: vars.color.vaultBlack,
                marginBottom: fluidUnit(32),
                lineHeight: 1.6,
              }}
            >
              We're committed to continuous improvement. Your feedback helps us make VaultPay better for everyone.
            </Typography>
            <Typography
              as="p"
              style={{
                fontSize: fluidUnit(16),
                color: vars.color.vaultBlack,
                fontWeight: 600,
              }}
            >
              📧 accessibility@getvaultpay.co<br />
              📞 +1 (800) VAULTPAY
            </Typography>
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
