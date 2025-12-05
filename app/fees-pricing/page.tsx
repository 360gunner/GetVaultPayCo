import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import SplitHero from "@/components/sections/SplitHero";
import { vars } from "@/styles/theme.css";
import Container from "@/components/Layout/Container";
import Typography from "@/components/Typography/Typography";
import Accordion, { AccordionItem } from "@/components/Accordion/Accordion";
import { fluidUnit } from "@/styles/fluid-unit";

const faqItems: AccordionItem[] = [
  {
    id: "faq-1",
    header: "Is VaultPay free to use?",
    content:
      "Yes! Creating a VaultPay account is completely free with no monthly fees. Sending money to friends and family is free when you use your VaultPay balance or linked bank account. Receiving money is always free. We only charge small fees for certain services like instant transfers, currency conversion, and business transactions.",
    defaultOpen: true,
  },
  {
    id: "faq-2",
    header: "What are the fees for sending money?",
    content:
      "Sending money to friends and family within the same country is free when funded by your VaultPay balance or bank account. Using a debit card incurs a 1% fee, and credit cards have a 2.9% + $0.30 fee. International transfers have currency conversion fees that vary by destination.",
  },
  {
    id: "faq-3",
    header: "How much do business accounts cost?",
    content:
      "Business accounts have no setup fees or monthly charges. We charge 1.5% + $0.30 per transaction for domestic payments and 2.5% + $0.30 for international transactions. High-volume merchants can qualify for reduced rates. There are no fees for refunds when you follow our seller protection guidelines.",
  },
  {
    id: "faq-4",
    header: "What are instant transfer fees?",
    content:
      "Instant transfers to your bank account or debit card cost 1% of the transfer amount (minimum $0.25, maximum $15). Standard transfers take 1-3 business days and are completely free. You can choose the option that works best for your needs.",
  },
  {
    id: "faq-5",
    header: "Are there currency conversion fees?",
    content:
      "Yes. When you send or receive money in a different currency, VaultPay applies a currency conversion fee ranging from 2.5% to 4% above the base exchange rate, depending on the currency pair. We always show you the exact exchange rate and fees before you confirm the transaction.",
  },
];

const pricingTiers = [
  {
    title: "Personal",
    price: "Free",
    description: "Perfect for individuals",
    features: [
      "Send & receive money free",
      "VaultPay Card",
      "Purchase Protection",
      "24/7 customer support",
      "Instant notifications",
      "Multi-currency wallet",
    ],
  },
  {
    title: "Business",
    price: "1.5%",
    description: "Per transaction + $0.30",
    features: [
      "Accept all payment methods",
      "No monthly fees",
      "Advanced fraud protection",
      "Analytics dashboard",
      "API access",
      "Priority support",
      "Volume discounts available",
    ],
  },
  {
    title: "Enterprise",
    price: "Custom",
    description: "Tailored solutions",
    features: [
      "Custom pricing",
      "Dedicated account manager",
      "White-label options",
      "Advanced integrations",
      "Custom reporting",
      "SLA guarantees",
      "Premium support",
    ],
  },
];

export default function FeesPricingPage() {
  return (
    <>
      <Navbar />
      <SplitHero
        eyebrow="FEES & PRICING"
        title="Transparent pricing. No hidden fees."
        description="VaultPay offers competitive rates with no setup costs, no monthly fees, and no surprises. Send money for free or pay low fees for premium features. Simple, straightforward pricing you can trust."
        buttonLabel="Get Started Free"
        buttonVariant="secondary"
        buttonHref="/signup"
        imageSrc="/image 95_1.png"
        imageAlt="VaultPay Pricing"
        containerSize="2xl"
        gridTemplateColumns="1fr 1fr"
        containerStyle={{ padding: `${vars.space.xl} ${vars.space["4xl"]}` }}
        imageWidth={569}
        imageHeight={458}
        minColWidth={360}
      />

      {/* Pricing Tiers */}
      <section style={{ padding: `${fluidUnit(80)} 0`, background: vars.color.vaultWhite }}>
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
            Choose Your Plan
          </Typography>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: fluidUnit(32),
              maxWidth: 1200,
              margin: "0 auto",
            }}
          >
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                style={{
                  background: index === 1 ? vars.color.neonMint : vars.color.vaultWhite,
                  border: `2px solid ${vars.color.vaultBlack}`,
                  borderRadius: fluidUnit(16),
                  padding: fluidUnit(40),
                  display: "flex",
                  flexDirection: "column",
                  transform: index === 1 ? "scale(1.05)" : "scale(1)",
                  transition: "transform 0.3s ease",
                }}
              >
                <Typography
                  as="h3"
                  style={{
                    fontSize: fluidUnit(28),
                    fontWeight: 700,
                    marginBottom: fluidUnit(8),
                    color: vars.color.vaultBlack,
                  }}
                >
                  {tier.title}
                </Typography>
                <Typography
                  as="p"
                  style={{
                    fontSize: fluidUnit(16),
                    color: vars.color.muted,
                    marginBottom: fluidUnit(24),
                  }}
                >
                  {tier.description}
                </Typography>
                <div
                  style={{
                    fontSize: fluidUnit(48),
                    fontWeight: 700,
                    marginBottom: fluidUnit(32),
                    color: vars.color.vaultBlack,
                  }}
                >
                  {tier.price}
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, flexGrow: 1 }}>
                  {tier.features.map((feature, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: fluidUnit(16),
                        fontSize: fluidUnit(16),
                        color: vars.color.vaultBlack,
                      }}
                    >
                      <span style={{ marginRight: fluidUnit(12), fontSize: fluidUnit(20) }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Fee Breakdown */}
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
            Fee Breakdown
          </Typography>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: fluidUnit(24),
            }}
          >
            {[
              {
                icon: "💸",
                title: "Sending Money",
                description: "Free to friends & family with bank account or VaultPay balance",
              },
              {
                icon: "💳",
                title: "Card Payments",
                description: "Debit: 1% | Credit: 2.9% + $0.30",
              },
              {
                icon: "⚡",
                title: "Instant Transfer",
                description: "1% (min $0.25, max $15) for instant bank transfers",
              },
              {
                icon: "🌍",
                title: "International",
                description: "2.5% - 4% currency conversion + transfer fees",
              },
              {
                icon: "🏪",
                title: "Business Sales",
                description: "1.5% + $0.30 per transaction (volume discounts available)",
              },
              {
                icon: "🆓",
                title: "Receiving Money",
                description: "Always free for personal accounts",
              },
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  background: vars.color.vaultWhite,
                  borderRadius: fluidUnit(12),
                  padding: fluidUnit(32),
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: fluidUnit(48), marginBottom: fluidUnit(16) }}>
                  {item.icon}
                </div>
                <Typography
                  as="h3"
                  style={{
                    fontSize: fluidUnit(20),
                    fontWeight: 700,
                    marginBottom: fluidUnit(12),
                    color: vars.color.vaultBlack,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  as="p"
                  style={{
                    fontSize: fluidUnit(16),
                    color: vars.color.muted,
                    margin: 0,
                  }}
                >
                  {item.description}
                </Typography>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQs */}
      <Container size="lg" style={{ padding: `${fluidUnit(80)} 0` }}>
        <Typography
          as="h2"
          style={{
            fontSize: fluidUnit(48),
            fontWeight: 700,
            marginBottom: fluidUnit(32),
            textAlign: "center",
            color: vars.color.vaultBlack,
          }}
        >
          Pricing FAQs
        </Typography>
        <div style={{ marginTop: vars.space.lg }}>
          <Accordion items={faqItems} />
        </div>
      </Container>

      <Footer />
    </>
  );
}
