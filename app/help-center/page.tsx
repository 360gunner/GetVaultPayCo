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
    { label: "About Vault Pay", href: "/signup" },
    { label: "Account Setting & Security", href: "/signup" },

    { label: "Payments & Requests 2", href: "/signup" },
    { label: "Signing Up & Signing In 2", href: "/signup" },
    { label: "Bank Transfers & Direct Deposit 2", href: "/signup" },
    { label: "Banks, Cards & Payments 2", href: "/signup" },
    { label: "About Vault Pay 2", href: "/signup" },
    { label: "Account Setting & Security 2", href: "/signup" },
    { label: "Banks, Cards & Payments 3", href: "/signup" },
    { label: "About Vault Pay 3", href: "/signup" },
    { label: "Account Setting & Security 3", href: "/signup" },
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
    header: "Main headline statement goals here.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    defaultOpen: true,
  },
  {
    id: "faq-2",
    header: "Main headline statement goals here.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "faq-3",
    header: "Main headline statement goals here.",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "faq-4",
    header: "How do I contact support?",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
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
        <Container size="2xl">
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
