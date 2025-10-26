import Navbar from "@/components/Navbar/Navbar";
import Container from "@/components/Layout/Container";
import Grid from "@/components/Layout/Grid";
import Typography from "@/components/Typography/Typography";
import WaysToUseGridSection, {
  type WaysToUseItem,
} from "@/components/sections/WaysToUseGridSection";
import Accordion, {
  type AccordionItem,
} from "@/components/Accordion/Accordion";
import { vars } from "@/styles/theme.css";
import Footer from "@/components/Footer/Footer";
import { fluidUnit } from "@/styles/fluid-unit";
import Link from "next/link";
import WaysToUseFlexSection from "@/components/sections/WaysToUseFlexSection";

export const metadata = {
  title: "Help Center | VaultPay",
  description: "Find answers, featured articles, and FAQs about VaultPay.",
};

const cardItems: Array<{ label: string; href?: string; description?: string }> =
  [
    { label: "Payments & Requests", href: "/signup" },
    { label: "Signing Up & Signing In", href: "/signup" },
    { label: "Bank Transfers & Direct Deposit", href: "/signup" },
    { label: "Banks, Cards & Payments", href: "/signup" },
    { label: "About VaultPay", href: "/signup" },
    { label: "Account Setting & Security", href: "/signup" },

    { label: "Payments & Requests 2", href: "/signup" },
    { label: "Signing Up & Signing In 2", href: "/signup" },
    { label: "Bank Transfers & Direct Deposit 2", href: "/signup" },
    { label: "Banks, Cards & Payments 2", href: "/signup" },
    { label: "About VaultPay 2", href: "/signup" },
    { label: "Account Setting & Security 2", href: "/signup" },
    { label: "Banks, Cards & Payments 3", href: "/signup" },
    { label: "About VaultPay 3", href: "/signup" },
    { label: "Account Setting & Security 3", href: "/signup" },
  ];

const featuredItems: WaysToUseItem[] = [
  {
    src: "/MaskGroup101.png",
    alt: "Pay Bills",
    label: "Pay bills",
    width: 359,
  },
  {
    src: "/MaskGroup102.png",
    alt: "Food Delivery",
    label: "Food delivery",
    width: 359,
  },
  {
    src: "/MaskGroup103.png",
    alt: "Tips & Gifts Friends",
    label: "Tips & gifts friends",
    width: 359,
  },
  {
    src: "/MaskGroup104.png",
    alt: "Send to Family",
    label: "Send to Family",
    width: 359,
  },
  {
    src: "/MaskGroup105.png",
    width: 359,

    alt: "In-store purchases",
    label: "In-store purchases",
  },
  {
    src: "/MaskGroup105.png",
    width: 359,

    alt: "Online purchases",
    label: "Online purchases",
  },
  {
    src: "/MaskGroup105.png",
    alt: "Ride Hailing",
    width: 359,

    label: "Ride Hailing",
  },
  {
    src: "/MaskGroup105.png",
    alt: "Secure Accounts",
    label: "Secure Accounts",
    width: 359,
  },
  {
    src: "/MaskGroup105.png",
    alt: "Bank transfers",
    label: "Bank transfers",
    width: 359,
  },
  {
    src: "/MaskGroup105.png",
    alt: "Physical cards",
    label: "Physical cards",
    width: 359,
  },
  {
    src: "/MaskGroup105.png",
    alt: "Global Balance",
    label: "Global Balance",
    width: 359,
  },
  {
    src: "/MaskGroup105.png",
    alt: "Convert currencies",
    label: "Convert currencies",
    width: 359,
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
      <section style={{ padding: "48px 0" }}>
        <Container size="lg">
          <Typography
            as="h1"
            font="Space Grotesk"
            weight={400}
            align="center"
            style={{ fontSize: 64 }}
          >
            Help Center
          </Typography>
        </Container>
      </section>

      {/* Categories grid: 3 columns, rounded, bordered, wide buttons/cards */}
      <section style={{ padding: "8px 0 48px" }}>
        <Container size="lg">
          <Grid
            columns={3}
            gap="lg"
            style={{ alignItems: "stretch", gap: fluidUnit(32) }}
          >
            {cardItems.map((item) => (
              <Link
                key={item.label}
                href={item.href || "/signup"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: fluidUnit(16),
                  padding: "18px 20px",
                  border: "1px solid #000",
                  borderRadius: 999,
                  textDecoration: "none",
                  color: "inherit",
                  width: "100%",
                }}
              >
                <Typography
                  as="h6"
                  font="Instrument Sans"
                  weight={400}
                  style={{ margin: 0, fontSize: fluidUnit(16, 8) }}
                >
                  {item.label}
                </Typography>
              </Link>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Featured Articles */}
      <section style={{ padding: "32px 0" }}>
        <Container size="xl">
          <Typography
            as="h1"
            font="Space Grotesk"
            weight={400}
            align="center"
            style={{ fontSize: 48 }}
          >
            Featured Articles
          </Typography>
        </Container>
        <WaysToUseFlexSection
          title={""}
          columnGap={0}
          items={featuredItems}
          sectionStyle={{
            paddingLeft: fluidUnit(12),
            paddingRight: fluidUnit(12),
          }}
          containerSize="2xl"
          sectionPadding="8px 0 24px"
          minColWidth={240}
          gap="xl"
          columns={4}
        />
      </section>

      {/* FAQs */}
      <section style={{ padding: `40px 0 80px` }}>
        <Container
          size="2xl"
          style={{ paddingLeft: fluidUnit(24), paddingRight: fluidUnit(24) }}
        >
          <Typography
            as="h1"
            font="Space Grotesk"
            weight={400}
            align="left"
            style={{ fontSize: 64 }}
          >
            FAQs
          </Typography>
          <div style={{ marginTop: vars.space.lg }}>
            <Accordion items={faqItems} />
          </div>
        </Container>
      </section>
      <Footer />
    </>
  );
}
