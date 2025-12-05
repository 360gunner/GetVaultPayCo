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
import WaysToUseGridSection from "@/components/sections/WaysToUseGridSection";
import { TestimonialsSection } from "../page";
import { fluidUnit } from "@/styles/fluid-unit";
import WaysToUseFlexSection from "@/components/sections/WaysToUseFlexSection";
const faqItems: AccordionItem[] = [
  {
    id: "faq-1",
    header: "Why should my business accept VaultPay?",
    content:
      "VaultPay gives you instant access to a global community of over 2 million active users who prefer social, secure payments. Merchants see higher conversion rates because customers trust VaultPay's protection policies. Plus, you'll benefit from lower transaction fees (1.5% + fee), no setup costs, and seamless integration with your existing systems.",
    defaultOpen: true,
  },
  {
    id: "faq-2",
    header: "How quickly do I receive payments from VaultPay transactions?",
    content:
      "Funds from VaultPay transactions are typically available in your business account within 1-2 business days. For verified merchants with established transaction history, we offer instant settlement options where funds are available immediately. You can track all incoming payments in real-time through your merchant dashboard.",
  },
  {
    id: "faq-3",
    header: "What are VaultPay's merchant fees?",
    content:
      "VaultPay charges a competitive 1.5% + fixed fee per transaction with no monthly fees, setup costs, or hidden charges. There are no fees for refunds or chargebacks when you follow our seller guidelines. Volume discounts are available for high-transaction merchants. Compare this to traditional payment processors that typically charge 2.9% + fees.",
  },
  {
    id: "faq-4",
    header: "Can I use VaultPay for both online and in-store sales?",
    content:
      "Yes! VaultPay works seamlessly for both online and physical stores. For online sales, integrate our checkout API or use our hosted payment page. For in-store sales, customers can scan your QR code or tap their VaultPay Card at any compatible terminal. All transactions sync to one dashboard for easy management.",
  },
];
export default function BusinessInStorePage() {
  return (
    <div style={{ backgroundColor: vars.color.vaultNavie }}>
      <Navbar />
      <SplitHero
        buttonHref="/signup-business"
        eyebrow="ADVANTAGES"
        title="Sell more with VaultPay"
        dark
        description="VaultPay is already accepted by more than 1 million merchants, with more joining all the time. Meet a few of our partners and hear how we help them succeed."
        buttonLabel="Start your Business Account"
        buttonVariant="secondary"
        imageSrc="/image 102_99.png"
        imageAlt="VaultPay advantages"
        containerSize="2xl"
        gridTemplateColumns="1fr 1fr"
        containerStyle={{ padding: `${vars.space.xl} ${vars.space["4xl"]}` }}
        imageWidth={609}
        imageHeight={649}
        minColWidth={360}
      />

      <WaysToUseFlexSection
        dark
        title={"Join a growing community of global merchants"}
        containerSize="2xl"
        sectionPadding={`48px ${fluidUnit(24)}`}
        columnGap={0}
        titleStyle={{
          marginBottom: vars.space["4xl"],
          maxWidth: "23ch",
        }}
        minColWidth={220}
        sectionStyle={{
          marginTop: vars.space["4xl"],
          marginBottom: vars.space["4xl"],
        }}
        gap="xl"
        items={[
          {
            src: "/green_how_to_use_shape.png",
            alt: "Shopify",
            label: "Shopify",
            brandLogo: "https://logo.clearbit.com/shopify.com?size=256",
            width: 360,
            height: 278,
          },
          {
            src: "/green_how_to_use_shape.png",
            alt: "ASOS",
            label: "ASOS",
            brandLogo: "https://logo.clearbit.com/asos.com?size=256",
            width: 360,
            height: 278,
          },
          {
            src: "/green_how_to_use_shape.png",
            alt: "Spotify",
            label: "Spotify",
            brandLogo: "https://logo.clearbit.com/spotify.com?size=256",
            width: 360,
            height: 278,
          },
          {
            src: "/green_how_to_use_shape.png",
            alt: "Booking.com",
            label: "Booking.com",
            brandLogo: "https://logo.clearbit.com/booking.com?size=256",
            width: 360,
            height: 278,
          },
          {
            src: "/green_how_to_use_shape.png",
            alt: "Deliveroo",
            label: "Deliveroo",
            brandLogo: "https://logo.clearbit.com/deliveroo.com?size=256",
            width: 360,
            height: 278,
          },
          {
            src: "/green_how_to_use_shape.png",
            alt: "Zara",
            label: "Zara",
            brandLogo: "https://logo.clearbit.com/zara.com?size=256",
            width: 360,
            height: 278,
          },
          {
            src: "/green_how_to_use_shape.png",
            alt: "H&M",
            label: "H&M",
            brandLogo: "https://logo.clearbit.com/hm.com?size=256",
            width: 360,
            height: 278,
          },
          {
            src: "/green_how_to_use_shape.png",
            alt: "Airbnb",
            label: "Airbnb",
            brandLogo: "https://logo.clearbit.com/airbnb.com?size=256",
            width: 360,
            height: 278,
          },
          {
            src: "/green_how_to_use_shape.png",
            alt: "Uber",
            label: "Uber",
            brandLogo: "https://logo.clearbit.com/uber.com?size=256",
            width: 360,
            height: 278,
          },
          {
            src: "/green_how_to_use_shape.png",
            alt: "Zalando",
            label: "Zalando",
            brandLogo: "https://logo.clearbit.com/zalando.com?size=256",
            width: 360,
            height: 278,
          },
          {
            src: "/green_how_to_use_shape.png",
            alt: "Etsy",
            label: "Etsy",
            brandLogo: "https://logo.clearbit.com/etsy.com?size=256",
            width: 360,
            height: 278,
          },
          {
            src: "/green_how_to_use_shape.png",
            alt: "Bolt",
            label: "Bolt",
            brandLogo: "https://logo.clearbit.com/bolt.eu?size=256",
            width: 360,
            height: 278,
          },
        ]}
      />
      <Container size="lg">
        <Typography
          as="h1"
          font="Instrument Sans"
          weight={400}
          style={{
            fontSize: 60,
            marginBottom: vars.space.lg,
            color: vars.color.vaultWhite,
          }}
        >
          VaultPay Business in action.
        </Typography>
        <Typography
          as="h2"
          font="Instrument Sans"
          weight={400}
          style={{
            fontSize: 20,
            marginBottom: vars.space.xxl,
            color: vars.color.vaultWhite,
            maxWidth: "40ch",
          }}
        >
          VaultPay is already accepted by more than 1 million merchants, with
          more joining all the time. Meet a few of our partners and hear how we
          help them succeed.
        </Typography>
      </Container>
      <ImageLeftEyebrowRightSection
        variant="ltr"
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/image 95_5.png",
          alt: "VaultPay card",
          width: 569,
          height: 458,
        }}
        dark
        eyebrow="SHOPIFY"
        title={<div style={{ height: "2rem" }}></div>}
        text={
          "We love the social aspect of VaultPay and the organic visibility it offers."
        }
      />
      <ImageLeftEyebrowRightSection
        variant="rtl"
        dark
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/image 103_87.png",
          alt: "VaultPay card",
          width: 569,
          height: 458,
        }}
        title={<div style={{ height: "2rem" }}></div>}
        eyebrow="ABERCROMBIE & FITCH"
        text={
          "Ease and speed are paramount for our customer experience and integrating VaultPay as a payment option helps to make that experience seamless for both A&F and Hollister Co. The ability to use their available VaultPay balance in our mobile apps allows customers to quickly and easily complete their purchase."
        }
      />
      <ImageLeftEyebrowRightSection
        variant="ltr"
        containerSize="lg"
        dark
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/image 125_88.png",
          alt: "VaultPay card",
          width: 569,
          height: 458,
        }}
        eyebrow="DELIVEROO"
        title={<div style={{ height: "2rem" }}></div>}
        text={
          "We are incredibly happy with how many customers are using Vault to pay, split and share purchases with friends. Vault is a unique way for us to acquire and connect with new customers."
        }
      />

      <TestimonialsSection />
      <BottomCallToActionBanner dark />
      <Footer dark />
    </div>
  );
}
