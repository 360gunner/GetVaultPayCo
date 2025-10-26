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
export default function BusinessOnlinePage() {
  return (
    <div style={{ backgroundColor: vars.color.vaultNavie }}>
      <Navbar />
      <SplitHero
        buttonHref="/signup"
        eyebrow="ONLINE & IN-APP"
        title="Seamless sales anywhere your customers shop"
        dark
        description="Give your customers a seamless way to pay—whether they’re shopping your website, using your mobile app, or making in-game purchases. VaultPay helps your business accept secure, instant payments backed by Visa® and Mastercard®, so you can capture more sales and grow without borders."
        buttonLabel="Start your Business Account"
        buttonVariant="secondary"
        imageSrc="/image 102_9.png"
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
          src: "/Group 1031.png",
          alt: "VaultPay card",
          width: 569,
          height: 458,
        }}
        dark
        eyebrow="GROW YOUR REACH"
        title="Tap Into a Global Community"
        text={
          "With VaultPay, you don’t just process payments—you gain access to a growing community of buyers. Sell directly to VaultPay users who are already spending, sharing, and discovering new businesses. By joining the platform, your brand becomes part of a borderless marketplace built for growth."
        }
      />
      <ImageLeftEyebrowRightSection
        variant="rtl"
        dark
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/image 103_7.png",
          alt: "VaultPay card",
          width: 569,
          height: 458,
        }}
        eyebrow="OFFER DEALS"
        title="Drive Loyalty to your fans"
        text={
          "Boost sales with custom promotions. VaultPay makes it simple to create discounts, rewards, and loyalty offers that keep customers coming back. Flexible tools help you design campaigns that fit your business and deliver measurable results."
        }
      />
      <ImageLeftEyebrowRightSection
        variant="ltr"
        containerSize="lg"
        dark
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/image 125.png",
          alt: "VaultPay card",
          width: 569,
          height: 458,
        }}
        eyebrow="SECURITY"
        title="Protect Every Transaction"
        text={
          "Stay safe on the VaultPay platform. Every payment is encrypted, tokenized, and monitored in real time by our fraud detection engine. With global compliance standards and mandatory two-factor authentication, your business and your customers are always protected."
        }
      />

      <BottomCallToActionBanner dark />
      <Footer dark />
    </div>
  );
}
