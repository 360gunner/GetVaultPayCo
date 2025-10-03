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
export default function BusinessInStorePage() {
  return (
    <div style={{ backgroundColor: vars.color.vaultNavie }}>
      <Navbar />
      <SplitHero
        eyebrow="ADVANTAGES"
        title="Sell more with Vault Pay"
        dark
        description="Vault Pay is already accepted by more than 1 million merchants, with more joining all the time. Meet a few of our partners and hear how we help them succeed."
        buttonLabel="Start your Business Account"
        buttonVariant="secondary"
        imageSrc="/image 102_99.png"
        imageAlt="Vault Pay advantages"
        containerSize="2xl"
        gridTemplateColumns="1fr 1fr"
        containerStyle={{ padding: `${vars.space.xl} ${vars.space["4xl"]}` }}
        imageWidth={609}
        imageHeight={649}
        minColWidth={360}
      />

      <WaysToUseGridSection
        dark
        title={"Join a growing community of global merchants"}
        containerSize="2xl"
        sectionPadding="48px 24px"
        titleStyle={{
          marginBottom: vars.space.xxxl,
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
            alt: "Urban Outfitters",
            label: "Urban Outfitters",
            width: 360,
            height: 278,
          },
          {
            src: "/green_how_to_use_shape.png",
            alt: "Hulu",
            label: "Hulu",
            width: 360,
            height: 278,
          },
          {
            src: "/green_how_to_use_shape.png",
            alt: "Poshmark",
            label: "Poshmark",
            width: 360,
            height: 278,
          },
          {
            src: "/green_how_to_use_shape.png",
            alt: "Delivery.com",
            label: "Delivery.com",
            width: 360,
            height: 278,
          },
          {
            src: "/green_how_to_use_shape.png",
            alt: "Breakout",
            label: "Breakout",
            width: 360,
            height: 278,
          },
          {
            src: "/green_how_to_use_shape.png",
            alt: "Cougar",
            label: "Cougar",
            width: 360,
            height: 278,
          },
          {
            src: "/green_how_to_use_shape.png",
            alt: "Engine",
            label: "Engine",
            width: 360,
            height: 278,
          },
          {
            src: "/green_how_to_use_shape.png",
            alt: "Engine",
            label: "Engine",
            width: 360,
            height: 278,
          },
          {
            src: "/green_how_to_use_shape.png",
            alt: "Engine",
            label: "Engine",
            width: 360,
            height: 278,
          },
          {
            src: "/green_how_to_use_shape.png",
            alt: "Engine",
            label: "Engine",
            width: 360,
            height: 278,
          },
          {
            src: "/green_how_to_use_shape.png",
            alt: "Engine",
            label: "Engine",
            width: 360,
            height: 278,
          },
          {
            src: "/green_how_to_use_shape.png",
            alt: "Engine",
            label: "Engine",
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
          Vault Pay Business in action.
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
          Vault Pay is already accepted by more than 1 million merchants, with
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
          alt: "Vault Pay card",
          width: 569,
          height: 458,
        }}
        dark
        eyebrow="LOREM IPSUM"
        title={<div style={{ height: "2rem" }}></div>}
        text={
          "“We love the social aspect of Vault Pay and the organic visibility it offers. ”"
        }
      />
      <ImageLeftEyebrowRightSection
        variant="rtl"
        dark
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/image 103_87.png",
          alt: "Vault Pay card",
          width: 569,
          height: 458,
        }}
        title={<div style={{ height: "2rem" }}></div>}
        eyebrow="ABERCROMBIE & FITCH"
        text={
          "Ease and speed are paramount for our customer experience and integrating Vault Pay as a payment option helps to make that experience seamless for both A&F and Hollister Co. The ability to use their available Vault Pay balance in our mobile apps allows customers to quickly and easily complete their purchase."
        }
      />
      <ImageLeftEyebrowRightSection
        variant="ltr"
        containerSize="lg"
        dark
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/image 125_88.png",
          alt: "Vault Pay card",
          width: 569,
          height: 458,
        }}
        eyebrow="XXXXX"
        title={<div style={{ height: "2rem" }}></div>}
        text={
          "We are incredibly happy with how many delivery.com customers are using Vault to pay, split and share purchases with friends. Vault is a unique way for us to acquire and connect with new customers."
        }
      />

      <TestimonialsSection />
      <BottomCallToActionBanner dark />
      <Footer dark />
    </div>
  );
}
