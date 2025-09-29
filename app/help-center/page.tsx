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

export const metadata = {
  title: "Help Center | VaultPay",
  description: "Find answers, featured articles, and FAQs about VaultPay.",
};

const cardItems: Array<{ label: string; href?: string; description?: string }> =
  [
    { label: "Payments & Requests", href: "#" },
    { label: "Signing Up & Signing In", href: "#" },
    { label: "Bank Transfers & Direct Deposit", href: "#" },
    { label: "Banks, Cards & Payments", href: "#" },
    { label: "About Vault Pay", href: "#" },
    { label: "Account Setting & Security", href: "#" },

    { label: "Payments & Requests 2", href: "#" },
    { label: "Signing Up & Signing In 2", href: "#" },
    { label: "Bank Transfers & Direct Deposit 2", href: "#" },
    { label: "Banks, Cards & Payments 2", href: "#" },
    { label: "About Vault Pay 2", href: "#" },
    { label: "Account Setting & Security 2", href: "#" },
    { label: "Banks, Cards & Payments 3", href: "#" },
    { label: "About Vault Pay 3", href: "#" },
    { label: "Account Setting & Security 3", href: "#" },
  ];

const featuredItems: WaysToUseItem[] = [
  {
    src: "/MaskGroup101.png",
    alt: "Pay Bills",
    label: "Pay bills",
  },
  {
    src: "/MaskGroup102.png",
    alt: "Food Delivery",
    label: "Food delivery",
  },
  {
    src: "/MaskGroup103.png",
    alt: "Tips & Gifts Friends",
    label: "Tips & gifts friends",
  },
  { src: "/MaskGroup104.png", alt: "Send to Family", label: "Send to Family" },
  {
    src: "/MaskGroup105.png",
    alt: "In-store purchases",
    label: "In-store purchases",
  },
  {
    src: "/MaskGroup105.png",
    alt: "Online purchases",
    label: "Online purchases",
  },
  {
    src: "/MaskGroup105.png",
    alt: "Ride Hailing",
    label: "Ride Hailing",
  },
  {
    src: "/MaskGroup105.png",
    alt: "Secure Accounts",
    label: "Secure Accounts",
  },
  {
    src: "/MaskGroup105.png",
    alt: "Bank transfers",
    label: "Bank transfers",
  },
  { src: "/MaskGroup105.png", alt: "Physical cards", label: "Physical cards" },
  { src: "/MaskGroup105.png", alt: "Global Balance", label: "Global Balance" },
  {
    src: "/MaskGroup105.png",
    alt: "Convert currencies",
    label: "Convert currencies",
  },
];

const faqItems: AccordionItem[] = [
  {
    id: "faq-1",
    header: "How do I create a VaultPay account?",
    content:
      "Download the app, sign up with your phone number or email, and follow the prompts to verify your identity.",
    defaultOpen: true,
  },
  {
    id: "faq-2",
    header: "What countries and currencies are supported?",
    content:
      "VaultPay supports a growing list of regions and currencies. Check the app for availability in your country.",
  },
  {
    id: "faq-3",
    header: "Are there fees for international transfers?",
    content:
      "We keep fees transparent and low. You’ll see any applicable fee before confirming a transfer.",
  },
  {
    id: "faq-4",
    header: "How do I contact support?",
    content:
      "Tap Help in the app or visit the Contact Support category above to reach our team.",
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
          <Grid columns={3} gap="lg" style={{ alignItems: "stretch", gap: 32 }}>
            {cardItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 16,
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
                  style={{ margin: 0 }}
                >
                  {item.label}
                </Typography>
              </a>
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
        <WaysToUseGridSection
          title={""}
          items={featuredItems}
          containerSize="xl"
          sectionPadding="8px 0 24px"
          minColWidth={240}
          gap="xl"
          columns={4}
        />
      </section>

      {/* FAQs */}
      <section style={{ padding: "40px 0 80px" }}>
        <Container size="xl">
          <Typography
            as="h1"
            font="Space Grotesk"
            weight={400}
            align="left"
            style={{ fontSize: 48 }}
          >
            FAQs
          </Typography>
          <div style={{ marginTop: vars.space.lg }}>
            <Accordion items={faqItems} multiple />
          </div>
        </Container>
      </section>
    </>
  );
}
