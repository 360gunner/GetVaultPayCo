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
    <main style={{ backgroundColor: vars.color.vaultNavie }}>
      <Navbar />
      <SplitHero
        eyebrow="IN-STORE"
        title="Take your shop to the next level."
        dark
        description="From neighborhood shops to global retailers, VaultPay makes it easy to accept secure, contactless payments in person. With support for tap, swipe, QR, and card transactions backed by Visa® and Mastercard®, your customers can pay their way—while you grow sales with speed and confidence."
        buttonLabel="Start your Business Account"
        buttonVariant="secondary"
        imageSrc="/image 102_6.png"
        imageAlt="Send and receive"
        containerSize="2xl"
        gridTemplateColumns="1fr 1fr"
        containerStyle={{ padding: `${vars.space.xl} ${vars.space["4xl"]}` }}
        imageWidth={609}
        imageHeight={649}
        minColWidth={360}
      />

      <ImageLeftEyebrowRightSection
        variant="ltr"
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/image 95_9.png",
          alt: "Vault Pay card",
          width: 569,
          height: 458,
        }}
        dark
        eyebrow="GROW YOUR POS INTEGRATION"
        title="Connect with ease"
        text={
          "VaultPay integrates seamlessly with your existing point-of-sale systems, so you can start accepting payments without disruption. From contactless to card, in-store transactions work smoothly alongside your current setup—no extra hardware required."
        }
      />
      <ImageLeftEyebrowRightSection
        variant="rtl"
        dark
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/Group 1034.png",
          alt: "Vault Pay card",
          width: 569,
          height: 458,
        }}
        eyebrow="FOREIGN BUYERS"
        title="Sell without borders"
        text={
          "Open your business to global customers. VaultPay supports multiple currencies and international payment methods, making it simple for foreign buyers to shop with confidence. Expand your reach and capture sales from anywhere in the world."
        }
      />
      <ImageLeftEyebrowRightSection
        variant="ltr"
        containerSize="lg"
        dark
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/image 125_9.png",
          alt: "Vault Pay card",
          width: 569,
          height: 458,
        }}
        eyebrow="QR CODES"
        title="Set up your shop."
        text={
          "Generate a unique VaultPay QR code and start selling in minutes. Place it at your counter, on packaging, or in your storefront—customers scan, pay, and go. No complicated setup, just fast, secure payments made simple."
        }
      />

      <BottomCallToActionBanner dark />
      <Footer />
    </main>
  );
}
