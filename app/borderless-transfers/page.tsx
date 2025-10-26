import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import SplitHero from "@/components/sections/SplitHero";
import { vars } from "@/styles/theme.css";
import Container from "@/components/Layout/Container";
import Image from "next/image";
import FeatureGridSection from "@/components/sections/FeatureGridSection";
import Typography from "@/components/Typography/Typography";
import CardGridWithCentralImageSection from "@/components/sections/CardGridWithCentralImageSection";
import GrayShapeBackgroundGridSection from "@/components/sections/GrayShapeBackgroundGridSection";
import BottomCallToActionBanner from "@/components/sections/BottomCallToActionBanner";
import ImageLeftEyebrowRightSection from "@/components/sections/ImageLeftEyebrowRightSection";
import BigImageBanner from "@/components/sections/BigImageBanner";
import Accordion, { AccordionItem } from "@/components/Accordion/Accordion";
import { fluidUnit } from "@/styles/fluid-unit";
const faqItems: AccordionItem[] = [
  {
    id: "faq-1",
    header: "How long do cross-border transfers take with VaultPay?",
    content:
      "Most cross-border transfers with VaultPay arrive within seconds to minutes. However, transfer times may vary depending on the destination country, receiving bank, and local banking hours. In some cases, transfers can take up to 1-3 business days. You'll receive real-time notifications tracking your transfer every step of the way.",
    defaultOpen: true,
  },
  {
    id: "faq-2",
    header: "What countries can I send money to?",
    content:
      "VaultPay supports transfers to over 180 countries worldwide. You can send money to family, friends, or businesses across North America, Europe, Asia, Africa, South America, and Oceania. Check our country directory in the app to see if your destination is supported and view available currencies.",
  },
  {
    id: "faq-3",
    header: "Are there any hidden fees for international transfers?",
    content:
      "No hidden fees ever. VaultPay believes in transparent pricing. You'll always see the exact exchange rate and any applicable transfer fees upfront before confirming your transaction. Our fees are typically much lower than traditional banks, and many transfers between VaultPay users are completely free.",
  },
  {
    id: "faq-4",
    header: "What currencies does VaultPay support?",
    content:
      "VaultPay supports over 50 major currencies including USD, EUR, GBP, CAD, AUD, JPY, CNY, INR, and many more. You can hold multiple currencies in your VaultPay wallet simultaneously and switch between them instantly. We offer competitive exchange rates with real-time currency conversion.",
  },
  {
    id: "faq-5",
    header: "How secure are cross-border transfers?",
    content:
      "VaultPay uses bank-level encryption and multi-factor authentication to protect every transfer. All cross-border transactions are monitored by our AI-powered fraud detection system and comply with international financial regulations including AML (Anti-Money Laundering) and KYC (Know Your Customer) requirements. Your money is protected by VaultPay Purchase Protection and FDIC insurance where applicable.",
  },
  {
    id: "faq-6",
    header: "Do I need to convert currency before sending money abroad?",
    content:
      "No, you don't need to convert currency manually. VaultPay automatically handles currency conversion at competitive exchange rates when you send money internationally. You can send in your local currency, and the recipient will receive funds in their local currency. The exact exchange rate and fees are shown before you confirm the transfer.",
  },
  {
    id: "faq-7",
    header: "Are there any limits on international transfers?",
    content:
      "Transfer limits vary based on your account verification level and destination country. Standard accounts can typically send up to $10,000 per transaction and $50,000 per month. Verified business accounts have higher limits. You can view your specific limits in the app settings or contact support to request a limit increase.",
  },
  {
    id: "faq-8",
    header: "What information do I need to send money internationally?",
    content:
      "To send money abroad, you'll need the recipient's full name, email address or phone number (if they have VaultPay), or their bank account details including IBAN/SWIFT code for bank transfers. Some countries may require additional information like recipient address or purpose of transfer for compliance reasons.",
  },
];
export default function BorderlessTransfersPage() {
  return (
    <>
      <Navbar />
      <SplitHero
        eyebrow="BORDERLESS"
        title="A global wallet for your money"
        description="Use VaultPay app for transferring money with just a few taps, and your money will be received in less than a minute."
        buttonLabel="Get Started"
        textNote="*Transfer speed depends on your bank and could take up to 30 minutes. Transfers are reviewed which may result in delays or funds being frozen or removed from your VaultPay account."
        buttonVariant="secondary"
        imageSrc="/Group 1010.png"
        imageAlt="Send and receive"
        buttonHref="/signup"
        containerSize="xl"
        gridTemplateColumns="1fr 1fr"
        containerStyle={{
          padding: `${vars.space.xl} ${vars.space["4xl"]}`,
          marginBottom: "calc(231px * 0.4 + 48px)",
        }}
        imageWidth={685}
        imageHeight={649}
        minColWidth={360}
        underImage={
          <Image
            unoptimized
            src="/Group 1011.png"
            alt="Finally A Wallet I can manage at all times"
            width={522}
            height={231}
            style={{
              position: "absolute",
              bottom: 0,
              width: "70%",
              height: "auto",
              transform: "translateY(60%) translateX(20%)",
            }}
          />
        }
      />

      <ImageLeftEyebrowRightSection
        variant="ltr"
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/image 955.png",
          alt: "VaultPay card",
          width: 569,
          height: 458,
        }}
        eyebrow="GLOBAL PURCHASE"
        title="Shop around the world."
        text={`Shop anywhere in the world without borders. VaultPay lets you pay online or in-store across currencies with the same ease as buying at home. Backed by Visa® and Mastercard®, your purchases are accepted worldwide, secured by VaultPay’s always-on protection.`}
      />
      <ImageLeftEyebrowRightSection
        variant="rtl"
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/image 1033.png",
          alt: "VaultPay card",
          width: 569,
          height: 458,
        }}
        underImage={
          <Image
            unoptimized
            src="/Group 97.png"
            alt="VaultPay card"
            width={281}
            height={69}
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,

              transform: "translateY(-90%) translateX(30%)",
            }}
          />
        }
        eyebrow="GLOBAL TRANSFER"
        title="Send money home with ease."
        text={`Move money across borders in seconds. With VaultPay, you can send and receive funds internationally without hidden fees or delays. Whether paying suppliers, supporting family, or splitting costs abroad, VaultPay makes global transfers simple, fast, and reliable.`}
      />
      <BigImageBanner
        image={{ src: "/Group 1014.png", alt: "Borderless payments" }}
        containerSize="full"
        sectionPadding={`${vars.space.xl} ${fluidUnit(12)}`}
        rounded={36}
        shadow
        aspectRatio="1360 / 906"
        fit="cover"
      />
      <Container
        size="2xl"
        style={{ padding: `${vars.space.xl} ${fluidUnit(24)}` }}
      >
        <Typography
          as="h1"
          font="Space Grotesk"
          weight={400}
          align="left"
          style={{
            fontSize: 64,
          }}
        >
          Cross-Border Transfer FAQs
        </Typography>
        <Typography
          as="p"
          style={{
            fontSize: fluidUnit(18),
            color: vars.color.muted,
            marginTop: fluidUnit(16),
            maxWidth: 800,
          }}
        >
          Everything you need to know about sending money internationally with VaultPay
        </Typography>
        <div style={{ marginTop: vars.space.lg }}>
          <Accordion items={faqItems} />
        </div>
      </Container>
      <BottomCallToActionBanner />
      <Footer />
    </>
  );
}
