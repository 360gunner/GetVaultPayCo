import Navbar from "@/components/Navbar/Navbar";
import Container from "@/components/Layout/Container";
import Grid from "@/components/Layout/Grid";
import Typography from "@/components/Typography/Typography";
import Accordion, {
  type AccordionItem,
} from "@/components/Accordion/Accordion";
import { vars } from "@/styles/theme.css";
import Footer from "@/components/Footer/Footer";
import { fluidUnit } from "@/styles/fluid-unit";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Help Center | VaultPay",
  description: "Find answers, featured articles, and FAQs about VaultPay.",
};

// Help categories with icons
const helpCategories = [
  {
    label: "Getting Started",
    description: "Create your account and set up your profile",
    icon: "/help-icons/account.svg",
    href: "/help-center",
  },
  {
    label: "Send & Receive Money",
    description: "Learn how to send and request payments",
    icon: "/help-icons/payments.svg",
    href: "/help-center",
  },
  {
    label: "Bank Transfers",
    description: "ACH, SEPA, SWIFT and direct deposits",
    icon: "/help-icons/bank.svg",
    href: "/help-center",
  },
  {
    label: "Cards & Wallets",
    description: "Physical and virtual card management",
    icon: "/help-icons/cards.svg",
    href: "/help-center",
  },
  {
    label: "Security & Privacy",
    description: "Protect your account and data",
    icon: "/help-icons/security.svg",
    href: "/help-center",
  },
  {
    label: "International Transfers",
    description: "Send money abroad and currency exchange",
    icon: "/help-icons/international.svg",
    href: "/help-center",
  },
  {
    label: "Crypto Payments",
    description: "Buy, sell, and transfer cryptocurrency",
    icon: "/help-icons/crypto.svg",
    href: "/help-center",
  },
  {
    label: "Business Accounts",
    description: "Tools and features for businesses",
    icon: "/help-icons/business.svg",
    href: "/help-center",
  },
  {
    label: "Fees & Limits",
    description: "Understand our pricing and transaction limits",
    icon: "/help-icons/transfers.svg",
    href: "/fees",
  },
];

// Featured articles with real content
const featuredArticles = [
  {
    title: "How to Verify Your Identity",
    description: "Complete KYC verification to unlock all VaultPay features and higher limits.",
    category: "Getting Started",
    readTime: "3 min read",
    href: "/help-center",
  },
  {
    title: "Setting Up Two-Factor Authentication",
    description: "Add an extra layer of security to your VaultPay account with 2FA.",
    category: "Security",
    readTime: "2 min read",
    href: "/help-center",
  },
  {
    title: "How to Add Money to Your Account",
    description: "Learn the different ways to fund your VaultPay balance.",
    category: "Payments",
    readTime: "4 min read",
    href: "/help-center",
  },
  {
    title: "Sending Your First Payment",
    description: "Step-by-step guide to sending money to friends and family.",
    category: "Payments",
    readTime: "3 min read",
    href: "/help-center",
  },
  {
    title: "Understanding Transfer Fees",
    description: "A complete breakdown of fees for different transfer types.",
    category: "Fees",
    readTime: "5 min read",
    href: "/fees",
  },
  {
    title: "Ordering Your Physical Card",
    description: "Get your VaultPay Visa card delivered to your doorstep.",
    category: "Cards",
    readTime: "2 min read",
    href: "/help-center",
  },
  {
    title: "International Transfers Guide",
    description: "Everything you need to know about sending money abroad.",
    category: "International",
    readTime: "6 min read",
    href: "/help-center",
  },
  {
    title: "Linking Your Bank Account",
    description: "Connect your bank for seamless transfers and withdrawals.",
    category: "Bank",
    readTime: "3 min read",
    href: "/help-center",
  },
];

const faqItems: AccordionItem[] = [
  {
    id: "faq-1",
    header: "How do I create a VaultPay account?",
    content:
      "Creating a VaultPay account is quick and free. Download the VaultPay app or visit our website, click 'Sign Up', and provide your email, phone number, and basic information. Verify your email and phone, set up a secure password with two-factor authentication, and you're ready to start sending and receiving money. The entire process takes less than 5 minutes.",
    defaultOpen: true,
  },
  {
    id: "faq-2",
    header: "How do I add money to my VaultPay account?",
    content:
      "You can add money to your VaultPay account through several methods: link your bank account for instant or standard transfers, use a debit or credit card for immediate funding, receive payments from other VaultPay users, or set up direct deposit from your employer. All methods are secure and most are fee-free.",
  },
  {
    id: "faq-3",
    header: "Are there any fees for using VaultPay?",
    content:
      "VaultPay is free for most personal transactions. Sending money to friends and family is free when funded by your VaultPay balance or linked bank account. Small fees apply for instant transfers, credit card funding, and currency conversion. Business accounts have transparent transaction fees with no monthly charges. Check our fee schedule for complete details.",
  },
  {
    id: "faq-4",
    header: "How do I contact support?",
    content:
      "You can reach VaultPay support 24/7 through multiple channels: email us at support@getvaultpay.co, use the in-app chat feature for instant assistance, call our support hotline, or visit our comprehensive Help Center for articles and guides. For urgent security issues, use the 'Report a Problem' feature in your app for immediate priority assistance.",
  },
  {
    id: "faq-5",
    header: "Can I use VaultPay internationally?",
    content:
      "Yes! VaultPay works in over 200 countries and supports multiple currencies. You can send and receive international payments, use your VaultPay Card abroad wherever Visa® and Mastercard® are accepted, and convert currencies at competitive rates. Cross-border transfers are typically completed within minutes.",
  },
];

export default function HelpCenterPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          padding: `${fluidUnit(80)} 0 ${fluidUnit(48)} 0`,
          background: vars.color.vaultNavie,
        }}
      >
        <Container size="lg">
          <Typography
            as="h1"
            font="Space Grotesk"
            weight={700}
            align="center"
            style={{ fontSize: fluidUnit(64), color: vars.color.vaultWhite }}
          >
            Help Center
          </Typography>
          <Typography
            as="p"
            align="center"
            style={{
              fontSize: fluidUnit(18),
              color: vars.color.slateGray,
              marginTop: fluidUnit(16),
              maxWidth: 600,
              margin: `${fluidUnit(16)} auto 0`,
            }}
          >
            Find answers to your questions, browse helpful articles, and get the support you need.
          </Typography>
        </Container>
      </section>

      {/* Help Categories */}
      <section style={{ padding: `${fluidUnit(64)} 0` }}>
        <Container size="lg">
          <Typography
            as="h2"
            font="Space Grotesk"
            weight={600}
            align="center"
            style={{
              fontSize: fluidUnit(36),
              marginBottom: fluidUnit(48),
              color: vars.color.vaultBlack,
            }}
          >
            Browse by Topic
          </Typography>
          <Grid
            columns={3}
            gap="lg"
            style={{ alignItems: "stretch", gap: fluidUnit(24) }}
          >
            {helpCategories.map((category) => (
              <Link
                key={category.label}
                href={category.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: fluidUnit(16),
                  padding: fluidUnit(32),
                  border: `1px solid ${vars.color.cloudSilver}`,
                  borderRadius: fluidUnit(16),
                  textDecoration: "none",
                  color: "inherit",
                  background: vars.color.vaultWhite,
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
              >
                <Image
                  src={category.icon}
                  alt={category.label}
                  width={56}
                  height={56}
                  unoptimized
                />
                <div>
                  <Typography
                    as="h3"
                    font="Instrument Sans"
                    weight={600}
                    style={{
                      margin: 0,
                      fontSize: fluidUnit(18),
                      color: vars.color.vaultBlack,
                    }}
                  >
                    {category.label}
                  </Typography>
                  <Typography
                    as="p"
                    style={{
                      margin: `${fluidUnit(8)} 0 0`,
                      fontSize: fluidUnit(14),
                      color: vars.color.muted,
                    }}
                  >
                    {category.description}
                  </Typography>
                </div>
              </Link>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Featured Articles */}
      <section
        style={{
          padding: `${fluidUnit(64)} 0`,
          background: vars.color.cloudSilver,
        }}
      >
        <Container size="xl">
          <Typography
            as="h2"
            font="Space Grotesk"
            weight={600}
            align="center"
            style={{
              fontSize: fluidUnit(36),
              marginBottom: fluidUnit(48),
              color: vars.color.vaultBlack,
            }}
          >
            Featured Articles
          </Typography>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: fluidUnit(24),
            }}
          >
            {featuredArticles.map((article, index) => (
              <Link
                key={index}
                href={article.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: fluidUnit(28),
                  background: vars.color.vaultWhite,
                  borderRadius: fluidUnit(16),
                  textDecoration: "none",
                  color: "inherit",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <span
                  style={{
                    fontSize: fluidUnit(12),
                    fontWeight: 600,
                    color: vars.color.neonMint,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    background: vars.color.vaultNavie,
                    padding: `${fluidUnit(4)} ${fluidUnit(10)}`,
                    borderRadius: fluidUnit(4),
                    alignSelf: "flex-start",
                    marginBottom: fluidUnit(16),
                  }}
                >
                  {article.category}
                </span>
                <Typography
                  as="h3"
                  style={{
                    fontSize: fluidUnit(18),
                    fontWeight: 600,
                    color: vars.color.vaultBlack,
                    margin: 0,
                    marginBottom: fluidUnit(8),
                  }}
                >
                  {article.title}
                </Typography>
                <Typography
                  as="p"
                  style={{
                    fontSize: fluidUnit(14),
                    color: vars.color.muted,
                    margin: 0,
                    flex: 1,
                    lineHeight: 1.5,
                  }}
                >
                  {article.description}
                </Typography>
                <span
                  style={{
                    fontSize: fluidUnit(12),
                    color: vars.color.slateGray,
                    marginTop: fluidUnit(16),
                  }}
                >
                  {article.readTime}
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQs */}
      <section style={{ padding: `${fluidUnit(80)} 0` }}>
        <Container
          size="lg"
          style={{ paddingLeft: fluidUnit(24), paddingRight: fluidUnit(24) }}
        >
          <Typography
            as="h2"
            font="Space Grotesk"
            weight={600}
            align="center"
            style={{
              fontSize: fluidUnit(36),
              marginBottom: fluidUnit(48),
              color: vars.color.vaultBlack,
            }}
          >
            Frequently Asked Questions
          </Typography>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <Accordion items={faqItems} />
          </div>
        </Container>
      </section>

      {/* Contact Support */}
      <section
        style={{
          padding: `${fluidUnit(64)} 0`,
          background: vars.color.vaultNavie,
        }}
      >
        <Container size="lg">
          <div style={{ textAlign: "center" }}>
            <Typography
              as="h2"
              style={{
                fontSize: fluidUnit(32),
                fontWeight: 700,
                color: vars.color.vaultWhite,
                marginBottom: fluidUnit(16),
              }}
            >
              Still need help?
            </Typography>
            <Typography
              as="p"
              style={{
                fontSize: fluidUnit(16),
                color: vars.color.slateGray,
                marginBottom: fluidUnit(32),
                maxWidth: 500,
                margin: `0 auto ${fluidUnit(32)}`,
              }}
            >
              Our support team is available 24/7 to assist you with any questions or issues.
            </Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: fluidUnit(16),
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/contact"
                style={{
                  padding: `${fluidUnit(16)} ${fluidUnit(32)}`,
                  background: vars.color.neonMint,
                  borderRadius: fluidUnit(8),
                  textDecoration: "none",
                  color: vars.color.vaultBlack,
                  fontWeight: 600,
                  fontSize: fluidUnit(16),
                }}
              >
                Contact Support
              </Link>
              <Link
                href="mailto:support@getvaultpay.co"
                style={{
                  padding: `${fluidUnit(16)} ${fluidUnit(32)}`,
                  background: "transparent",
                  border: `2px solid ${vars.color.vaultWhite}`,
                  borderRadius: fluidUnit(8),
                  textDecoration: "none",
                  color: vars.color.vaultWhite,
                  fontWeight: 600,
                  fontSize: fluidUnit(16),
                }}
              >
                Email Us
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
