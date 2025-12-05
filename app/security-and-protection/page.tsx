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
    header: "What purchases are covered by VaultPay Purchase Protection?",
    content:
      "VaultPay Purchase Protection covers eligible physical goods purchased through VaultPay when the seller doesn't deliver, the item arrives damaged or broken, or the item doesn't match the seller's description. Coverage applies to purchases made with your VaultPay balance, VaultPay Card, or linked payment method. Digital goods, services, and in-person cash pickups are not eligible.",
    defaultOpen: true,
  },
  {
    id: "faq-2",
    header: "How long do I have to file a Purchase Protection claim?",
    content:
      "You have 180 days from the date of purchase to file a Purchase Protection claim. We recommend filing as soon as you realize there's an issue with your order. The sooner you report a problem, the faster we can help resolve it and process your reimbursement.",
  },
  {
    id: "faq-3",
    header: "Is my personal and financial information secure with VaultPay?",
    content:
      "Yes. VaultPay uses bank-level encryption and security protocols to protect your data. We're PCI compliant and use multi-factor authentication, tokenization, and real-time fraud monitoring. Your payment information is never shared with merchants—only a secure token is transmitted. We also never sell your personal data to third parties.",
  },
  {
    id: "faq-4",
    header: "What should I do if I notice unauthorized activity on my account?",
    content:
      "Immediately freeze your account through the VaultPay app or website, then contact our support team at support@getvaultpay.co. Change your password and enable two-factor authentication if you haven't already. VaultPay monitors transactions 24/7 for suspicious activity, and you're protected from unauthorized charges when reported promptly.",
  },
  {
    id: "faq-5",
    header: "How does VaultPay protect me from fraud?",
    content:
      "VaultPay employs advanced fraud detection systems that monitor every transaction in real-time. We use machine learning algorithms to detect unusual patterns, require verification for high-risk transactions, and offer instant notifications for all account activity. Plus, you're covered by our Purchase Protection policy for eligible transactions.",
  },
];
export default function BorderlessTransfersPage() {
  return (
    <>
      <Navbar />
      <SplitHero
        eyebrow="SECURITY & PROTECTION"
        title="Shop with confidence everywhere."
        description="Whether you’re buying a couch or paying movers you found online, VaultPay Purchase Protection offers coverage for eligible payments without extra costs for you. So go ahead and buy. VaultPay has your back."
        buttonLabel="Get Started"
        buttonVariant="secondary"
        buttonHref="/signup"
        imageSrc="/image 102.png"
        imageAlt="Send and receive"
        containerSize="2xl"
        gridTemplateColumns="1fr 1fr"
        containerStyle={{ padding: `${vars.space.xl} ${vars.space["4xl"]}` }}
        imageWidth={685}
        imageHeight={649}
        minColWidth={360}
      />

      <ImageLeftEyebrowRightSection
        variant="ltr"
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/image 95_1.png",
          alt: "VaultPay card",
          width: 569,
          height: 458,
        }}
        title="Get what you paid for"
        text={`If what you bought isn't delivered, arrives broken, or is just plain wrong, let us know. VaultPay Purchase Protection can help make it right. We'll reimburse you for qualifying purchases plus original shipping costs.`}
      />
      <ImageLeftEyebrowRightSection
        variant="rtl"
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/Group 972.png",
          alt: "VaultPay card",
          width: 569,
          height: 458,
        }}
        title="In-app purchase protection"
        text={`Before you send your payment, tap the toggle in the app to tell VaultPay that you're paying for a good or service. Purchase Protection can be applied for eligible items, and the seller pays a small transaction fee.`}
      />

      <ImageLeftEyebrowRightSection
        variant="ltr"
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/image 104_1.png",
          alt: "VaultPay card",
          width: 569,
          height: 458,
        }}
        title="Don't worry. Shop happy."
        text={`When you shop in stores with your VaultPay Debit Card, pay a Vault business profile, or use your VaultPay account when making an in-app purchase or scanning a QR-code at checkout, your eligible purchases can be covered by Purchase Protection — no toggle needed. All so you can shop and pay with confidence.`}
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
          What is Purchase Protection?
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
