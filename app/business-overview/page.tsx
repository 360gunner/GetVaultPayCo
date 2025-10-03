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
import BigImageOverlaySection from "@/components/sections/BigImageOverlaySection";
import Accordion, { AccordionItem } from "@/components/Accordion/Accordion";
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
export default function BusinessOverviewPage() {
  return (
    <main style={{ backgroundColor: vars.color.vaultNavie }}>
      <Navbar />
      <BigImageOverlaySection
        image={{
          src: "/image 101_5.png",
          alt: "Vault Pay Ways To Pay Hero Image",
        }}
        containerSize="2xl"
        sectionPadding={`${vars.space.xl} ${vars.space["lg"]}`}
        eyebrow="BUSINESS"
        title="Take your business to the next level with Vault Pay"
        text="Use Vault Pay app for transferring money with just a few taps, and your money will be received in less than a minute."
        buttonLabel="Start your Business Account"
        buttonHref="/signup"
        aspectRatio="1360 / 784"
        fullBleed={false}
      />
      <Container size="full" style={{ paddingTop: vars.space["4xl"] }}>
        <Typography
          as="h1"
          font="Instrument Sans"
          weight={400}
          style={{
            fontSize: "60px",
            lineHeight: "91%",
            letterSpacing: "-0.58px",
            color: vars.color.vaultWhite,
          }}
        >
          Accept payments with confidence
        </Typography>
      </Container>
      <FeatureGridSection
        containerSize="full"
        sectionPadding="24px"
        minColWidth={280}
        center
        gap="xl"
        dark
        items={[
          {
            src: "/Mask group_601.png",
            alt: "Fast transfers",
            title: "Pay online & in-app",
            buttonLabel: "Learn more",
            description:
              "Checkout instantly with VaultPay anywhere digital payments are accepted.",
          },
          {
            src: "/Mask group_602.png",
            alt: "Multi-currency wallet",
            title: "Pay in-store",
            buttonLabel: "Learn more",
            description:
              "Tap, swipe, or scan—VaultPay works seamlessly at the register.",
          },
        ]}
      />
      <SplitHero
        dark
        title="Connect with millions of savvy customers instantly"
        description="Accept Vault Pay at checkout in your app or mobile site, and tap into our social community of over 2million users. The Vault community is a social, tech-savvy bunch. They love to shop on their phones, and 89% of them want to pay with Vault Pay because they trust the brand and think it’s easy to use. *It makes sense to accept Vault Pay"
        imageSrc="/Group 1029.png"
        imageAlt="Vault Pay card"
        containerSize="xl"
        titleFontSize={60}
        gridTemplateColumns="1.3fr 1fr"
        containerStyle={{
          padding: `${vars.space.xl} ${vars.space["4xl"]}`,
          marginTop: vars.space["4xl"],
          marginBottom: "calc(319px * 0.5 + 48px)",
        }}
        imageWidth={560}
        imageHeight={653}
        minColWidth={360}
        underDescription={<div style={{ height: vars.space["5xl"] }}></div>}
        underImage={
          <Image
            src="/Mask group_1023.png"
            alt="Finally A Wallet I can manage at all times"
            width={621}
            height={319}
            style={{
              position: "absolute",
              bottom: 0,
              // alignSelf: "center",
              height: "auto",
              display: "block",
              transform: "translateY(50%) translateX(-70%)",
            }}
          />
        }
      />
      <ImageLeftEyebrowRightSection
        dark
        variant="ltr"
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/Group 1030.png",
          alt: "Vault Pay card",
          width: 569,
          height: 458,
        }}
        eyebrow="GETTING STARTED"
        title="Create your business profile."
        text={
          "Opening a business account with VaultPay takes just minutes. Set up your profile, verify your details, and you’re ready to accept payments, issue cards, and send funds globally. No paperwork, no waiting—just a streamlined path to getting your business moving."
        }
      />
      <ImageLeftEyebrowRightSection
        dark
        variant="rtl"
        containerSize="lg"
        eyebrow="SIMPLE FEES"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/Group 1033.png",
          alt: "Vault Pay card",
          width: 569,
          height: 458,
        }}
        title="Simple, transparent pricing"
        text={
          "Accept Vault Pay at checkout for no setup or monthly fees. And only pay when you get paid: we charge a low 1.5% + per  transaction.* Learn more about merchant fees here.*Fees are subject to change."
        }
      />

      <ImageLeftEyebrowRightSection
        variant="ltr"
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        dark
        image={{
          src: "/Group 1032.png",
          alt: "Vault Pay card",
          width: 569,
          height: 458,
        }}
        eyebrow="BUSINESS PLATFORM"
        title="Full control from anywhere"
        text={
          "Manage your company’s finances in one secure hub. From tracking incoming payments to sending transfers and monitoring expenses, VaultPay gives you full visibility and control from any device. Real-time insights, instant notifications, and borderless capabilities mean your business is always connected."
        }
      />
      <ImageLeftEyebrowRightSection
        dark
        variant="rtl"
        containerSize="lg"
        eyebrow="ADVANTAGES"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/image 127.png",
          alt: "Vault Pay card",
          width: 569,
          height: 458,
        }}
        buttonLabel="Learn more"
        title="Get more with Vault Pay"
        text={
          "Beyond payments, VaultPay empowers your business with global reach, multi-currency flexibility, and trusted partnerships with Visa® and Mastercard®. Enjoy lower costs, faster transactions, and advanced security built for modern commerce. With VaultPay, you don’t just keep up—you get ahead."
        }
      />
      <TestimonialsSection />
      <section style={{ padding: "40px 0 80px" }}>
        <Container size="2xl">
          <Typography
            as="h1"
            font="Space Grotesk"
            weight={400}
            align="left"
            style={{ fontSize: 64, color: vars.color.vaultWhite }}
          >
            FAQs
          </Typography>
          <div style={{ marginTop: vars.space.lg }}>
            <Accordion items={faqItems} dark />
          </div>
        </Container>
      </section>
      <BottomCallToActionBanner dark />
      <Footer dark />
    </main>
  );
}
