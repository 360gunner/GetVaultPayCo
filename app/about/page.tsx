import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import SplitHero from "@/components/sections/SplitHero";
import { vars } from "@/styles/theme.css";
import Container from "@/components/Layout/Container";
import Typography from "@/components/Typography/Typography";
import { fluidUnit } from "@/styles/fluid-unit";
import ImageLeftEyebrowRightSection from "@/components/sections/ImageLeftEyebrowRightSection";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <SplitHero
        eyebrow="ABOUT VAULTPAY"
        title="Reimagining money for the digital age"
        description="VaultPay was founded in 2023 with a simple mission: make money move as freely as information. Today, over 2 million people and businesses worldwide trust VaultPay to send, receive, and manage their money."
        buttonLabel="Join VaultPay"
        buttonVariant="secondary"
        buttonHref="/signup"
        imageSrc="/image 102.png"
        imageAlt="VaultPay Team"
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
            Our Story
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
              VaultPay started in a small apartment in Sherman Oaks, California. Our founders, frustrated with slow, expensive, and complicated payment systems, asked a simple question: Why can't sending money be as easy as sending a message?
            </Typography>
            <Typography as="p" style={{ marginBottom: fluidUnit(24) }}>
              From that question, VaultPay was born. We built a platform that combines the security of traditional banking with the speed and simplicity of modern technology. No hidden fees, no confusing terms, just honest, transparent financial services.
            </Typography>
            <Typography as="p" style={{ marginBottom: fluidUnit(24) }}>
              Today, VaultPay processes billions of dollars in transactions every year. But we're still driven by the same principle that started it all: technology should make life easier, not harder. We're building the financial tools that help people live better lives.
            </Typography>
          </div>
        </Container>
      </section>

      <ImageLeftEyebrowRightSection
        variant="ltr"
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/image 1022.png",
          alt: "VaultPay Mission",
          width: 503,
          height: 545,
        }}
        eyebrow="OUR MISSION"
        title="Financial freedom for everyone"
        text="We believe everyone deserves access to simple, affordable financial services. Whether you're sending money to family across the world, paying for your morning coffee, or running a global business, VaultPay makes it possible."
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
            Our Values
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
                icon: "🔒",
                title: "Security First",
                description: "Your trust is our foundation. We use bank-level encryption and never compromise on security.",
              },
              {
                icon: "💎",
                title: "Transparency",
                description: "No hidden fees, no fine print. We believe in honest, straightforward pricing.",
              },
              {
                icon: "🚀",
                title: "Innovation",
                description: "We constantly push boundaries to build better financial tools for modern life.",
              },
              {
                icon: "🌍",
                title: "Global Access",
                description: "Money should flow freely across borders. We're building a truly global payment network.",
              },
              {
                icon: "👥",
                title: "Customer-Centric",
                description: "Every decision we make starts with one question: Is this good for our users?",
              },
              {
                icon: "♻️",
                title: "Sustainability",
                description: "We're committed to building a sustainable business that's good for people and the planet.",
              },
            ].map((value, index) => (
              <div
                key={index}
                style={{
                  background: vars.color.vaultWhite,
                  borderRadius: fluidUnit(16),
                  padding: fluidUnit(32),
                  textAlign: "center",
                  border: `2px solid ${vars.color.vaultBlack}`,
                }}
              >
                <div style={{ fontSize: fluidUnit(56), marginBottom: fluidUnit(16) }}>
                  {value.icon}
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
                  {value.title}
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
                  {value.description}
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
          alt: "VaultPay Growth",
          width: 569,
          height: 458,
        }}
        eyebrow="BY THE NUMBERS"
        title="Growing together"
        text="Since 2023, we've grown from 3 people in an apartment to a global team of over 200. We process billions in transactions, serve millions of users, and operate in 200+ countries. But what matters most is the trust our users place in us every day."
      />

      <section style={{ padding: `${fluidUnit(80)} 0`, background: vars.color.vaultBlack }}>
        <Container size="lg">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: fluidUnit(48),
              textAlign: "center",
            }}
          >
            {[
              { value: "2M+", label: "Active Users" },
              { value: "200+", label: "Countries" },
              { value: "$5B+", label: "Processed" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat, index) => (
              <div key={index}>
                <div
                  style={{
                    fontSize: fluidUnit(56),
                    fontWeight: 700,
                    color: vars.color.neonMint,
                    marginBottom: fluidUnit(8),
                  }}
                >
                  {stat.value}
                </div>
                <Typography
                  as="p"
                  style={{
                    fontSize: fluidUnit(18),
                    color: vars.color.vaultWhite,
                    margin: 0,
                  }}
                >
                  {stat.label}
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
