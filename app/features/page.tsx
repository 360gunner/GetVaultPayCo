import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import SplitHero from "@/components/sections/SplitHero";
import { vars } from "@/styles/theme.css";
import Container from "@/components/Layout/Container";
import Typography from "@/components/Typography/Typography";
import { fluidUnit } from "@/styles/fluid-unit";
import ImageLeftEyebrowRightSection from "@/components/sections/ImageLeftEyebrowRightSection";
import BottomCallToActionBanner from "@/components/sections/BottomCallToActionBanner";

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <SplitHero
        eyebrow="FEATURES"
        title="Everything you need to manage your money."
        description="VaultPay combines powerful features with elegant simplicity. Send money instantly, shop securely, track spending, and connect with friends—all in one app designed for modern financial life."
        buttonLabel="Get Started"
        buttonVariant="secondary"
        buttonHref="/signup"
        imageSrc="/image 102.png"
        imageAlt="VaultPay Features"
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
            as="p"
            style={{
              fontSize: fluidUnit(14),
              fontWeight: 700,
              textAlign: "center",
              color: vars.color.neonMint,
              marginBottom: fluidUnit(12),
              letterSpacing: "0.1em",
            }}
          >
            PAYMENT FEATURES
          </Typography>
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
            Send, receive, and spend with ease
          </Typography>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: fluidUnit(32),
            }}
          >
            {[
              {
                icon: "💸",
                title: "Instant Transfers",
                description: "Send money to anyone in seconds. No delays, no hassle.",
              },
              {
                icon: "🌍",
                title: "Global Payments",
                description: "Send and receive money in 200+ countries and multiple currencies.",
              },
              {
                icon: "💳",
                title: "VaultPay Card",
                description: "Physical and virtual cards accepted anywhere Visa® and Mastercard® work.",
              },
              {
                icon: "🔔",
                title: "Real-time Notifications",
                description: "Get instant alerts for every transaction and account activity.",
              },
              {
                icon: "📊",
                title: "Spending Insights",
                description: "Track your spending with smart categorization and analytics.",
              },
              {
                icon: "🔄",
                title: "Split Payments",
                description: "Easily split bills and expenses with friends and family.",
              },
            ].map((feature, index) => (
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
          alt: "Security Features",
          width: 569,
          height: 458,
        }}
        eyebrow="SECURITY"
        title="Bank-level security you can trust"
        text="Your security is our top priority. VaultPay uses advanced encryption, fraud monitoring, and multi-factor authentication to keep your money and data safe. Plus, Purchase Protection covers eligible transactions at no extra cost."
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
            Social & Smart Features
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
                icon: "👥",
                title: "Social Feed",
                description: "Connect with friends, see transactions, and discover new places to spend.",
              },
              {
                icon: "🎁",
                title: "Request Money",
                description: "Send payment requests with custom amounts and notes.",
              },
              {
                icon: "💰",
                title: "Savings Goals",
                description: "Set and track financial goals with automatic savings features.",
              },
              {
                icon: "🔒",
                title: "Privacy Controls",
                description: "Choose what to share and who can see your activity.",
              },
              {
                icon: "📱",
                title: "QR Payments",
                description: "Pay instantly by scanning QR codes at stores and restaurants.",
              },
              {
                icon: "⚡",
                title: "Auto-Pay",
                description: "Set up recurring payments and never miss a bill.",
              },
            ].map((feature, index) => (
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
        variant="ltr"
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/image 91.png",
          alt: "Business Features",
          width: 503,
          height: 545,
        }}
        eyebrow="FOR BUSINESS"
        title="Powerful tools for merchants"
        text="Accept payments online and in-store, manage inventory, track sales, and grow your business with VaultPay's merchant tools. Low fees, instant settlements, and access to millions of customers."
      />

      <BottomCallToActionBanner />
      <Footer />
    </>
  );
}
