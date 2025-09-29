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
export default function BorderlessTransfersPage() {
  return (
    <>
      <Navbar />
      <SplitHero
        eyebrow="SECURITY & PROTECTION"
        title="Shop with confidence everywhere."
        description="Whether you’re buying a couch or paying movers you found online, Vault Pay Purchase Protection offers coverage for eligible payments without extra costs for you. So go ahead and buy. Vault Pay has your back."
        buttonLabel="Get Started"
        buttonVariant="secondary"
        imageSrc="/image 102.png"
        imageAlt="Send and receive"
        containerSize="xl"
        gridTemplateColumns="1fr 1fr"
        containerStyle={{ padding: `${vars.space.xl} ${vars.space["4xl"]}` }}
        imageWidth={685}
        imageStyle={{
          width: "100%",
          height: "auto",
        }}
        imageHeight={649}
        minColWidth={360}
      />

      <ImageLeftEyebrowRightSection
        variant="ltr"
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/image 95_1.png",
          alt: "Vault Pay card",
          width: 569,
          height: 458,
        }}
        title="Get what you paid for"
        text={`If what you bought isn't delivered, arrives broken, or is just plain wrong, let us know. Vault Pay Purchase Protection can help make it right. We'll reimburse you for qualifying purchases plus original shipping costs.`}
      />
      <ImageLeftEyebrowRightSection
        variant="rtl"
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/Group 972.png",
          alt: "Vault Pay card",
          width: 569,
          height: 458,
        }}
        eyebrow="GLOBAL TRANSFER"
        title="In-app purchase protection"
        text={`Before you send your payment, tap the toggle in the app to tell Vault Pay that you're paying for a good or service. Purchase Protection can be applied for eligible items, and the seller pays a small transaction fee.`}
      />

      <ImageLeftEyebrowRightSection
        variant="ltr"
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/image 104_1.png",
          alt: "Vault Pay card",
          width: 569,
          height: 458,
        }}
        title="Don't worry. Shop happy."
        text={`When you shop in stores with your Vault Pay Debit Card, pay a Vault business profile, or use your Vault Pay account when making an in-app purchase or scanning a QR-code at checkout, your eligible purchases can be covered by Purchase Protection — no toggle needed. All so you can shop and pay with confidence.`}
      />
      <Container
        size="full"
        style={{ padding: `${vars.space.xl} ${vars.space["4xl"]}` }}
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
          <Accordion items={faqItems} multiple />
        </div>
      </Container>
      <BottomCallToActionBanner />
      <Footer />
    </>
  );
}
