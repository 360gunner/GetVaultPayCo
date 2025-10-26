import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import SplitHero from "@/components/sections/SplitHero";
import { vars } from "@/styles/theme.css";
import Container from "@/components/Layout/Container";
import Typography from "@/components/Typography/Typography";
import { fluidUnit } from "@/styles/fluid-unit";
import BottomCallToActionBanner from "@/components/sections/BottomCallToActionBanner";

export default function DevelopersPage() {
  return (
    <>
      <Navbar />
      <SplitHero
        eyebrow="DEVELOPERS"
        title="Build the future of payments"
        description="Powerful APIs, comprehensive documentation, and developer-friendly tools to integrate VaultPay into your application. Start accepting payments in minutes with our modern REST API and SDKs."
        buttonLabel="View Documentation"
        buttonVariant="secondary"
        buttonHref="/signup"
        imageSrc="/image 102.png"
        imageAlt="VaultPay API"
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
            Developer Tools
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
                icon: "⚡",
                title: "REST API",
                description: "Simple, predictable RESTful API with JSON responses. Integrate payments, transfers, and account management with ease.",
              },
              {
                icon: "📚",
                title: "SDKs & Libraries",
                description: "Official SDKs for JavaScript, Python, Ruby, PHP, Java, and more. Get started quickly with your favorite language.",
              },
              {
                icon: "🔐",
                title: "Secure Webhooks",
                description: "Real-time event notifications for payments, transfers, and account updates. HMAC signature verification included.",
              },
              {
                icon: "🧪",
                title: "Sandbox Environment",
                description: "Test your integration with realistic test data. No credit card required. Instant API keys for development.",
              },
              {
                icon: "📖",
                title: "Documentation",
                description: "Comprehensive guides, API references, and code examples. Interactive API explorer to test endpoints.",
              },
              {
                icon: "💬",
                title: "Developer Support",
                description: "Dedicated developer support team. Join our Discord community and get help from VaultPay engineers.",
              },
            ].map((tool, index) => (
              <div
                key={index}
                style={{
                  background: vars.color.vaultWhite,
                  border: `2px solid ${vars.color.vaultBlack}`,
                  borderRadius: fluidUnit(16),
                  padding: fluidUnit(32),
                }}
              >
                <div style={{ fontSize: fluidUnit(56), marginBottom: fluidUnit(16) }}>
                  {tool.icon}
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
                  {tool.title}
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
                  {tool.description}
                </Typography>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section style={{ padding: `${fluidUnit(80)} 0`, background: vars.color.vaultBlack }}>
        <Container size="lg">
          <Typography
            as="h2"
            style={{
              fontSize: fluidUnit(40),
              fontWeight: 700,
              textAlign: "center",
              marginBottom: fluidUnit(48),
              color: vars.color.neonMint,
            }}
          >
            Quick Start Example
          </Typography>
          <div
            style={{
              background: "#1a1a1a",
              borderRadius: fluidUnit(12),
              padding: fluidUnit(32),
              border: `1px solid ${vars.color.neonMint}`,
              fontFamily: "monospace",
              fontSize: fluidUnit(14),
              color: "#e6e6e6",
              overflowX: "auto",
            }}
          >
            <pre style={{ margin: 0 }}>
              <code>{`// Install VaultPay SDK
npm install @vaultpay/node

// Initialize the client
const VaultPay = require('@vaultpay/node');
const vaultpay = new VaultPay('your_api_key');

// Create a payment
const payment = await vaultpay.payments.create({
  amount: 1000, // $10.00
  currency: 'USD',
  description: 'Order #1234',
  customer: 'cus_abc123'
});

// Payment successful!
console.log(payment.status); // 'succeeded'`}</code>
            </pre>
          </div>
        </Container>
      </section>

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
            API Features
          </Typography>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: fluidUnit(24),
            }}
          >
            {[
              "RESTful architecture",
              "OAuth 2.0 authentication",
              "Rate limiting: 1000 req/min",
              "99.99% uptime SLA",
              "Idempotent requests",
              "Pagination support",
              "Filtering & sorting",
              "Webhook events",
              "Test mode included",
              "Versioned API",
              "CORS enabled",
              "TLS 1.3 encryption",
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  background: vars.color.vaultWhite,
                  borderRadius: fluidUnit(8),
                  padding: fluidUnit(20),
                  display: "flex",
                  alignItems: "center",
                  gap: fluidUnit(12),
                }}
              >
                <span style={{ fontSize: fluidUnit(20) }}>✓</span>
                <Typography
                  as="p"
                  style={{
                    fontSize: fluidUnit(16),
                    color: vars.color.vaultBlack,
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  {feature}
                </Typography>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <BottomCallToActionBanner />
      <Footer />
    </>
  );
}
