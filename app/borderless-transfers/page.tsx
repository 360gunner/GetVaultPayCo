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
        eyebrow="BORDERLESS"
        title="A global wallet for your money"
        description="Use Vault Pay app for transferring money with just a few taps, and your money will be received in less than a minute.*Transfer speed depends on your bank and could take up to 30 minutes. Transfers are reviewed which may result in delays or funds being frozen or removed from your Vault Pay account."
        buttonLabel="Get Started"
        buttonVariant="secondary"
        imageSrc="/Group 1010.png"
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
        underImage={
          <Image
            src="/Group 1011.png"
            alt="Finally A Wallet I can manage at all times"
            width={522}
            height={231}
            style={{
              alignSelf: "end",
              width: "70%",
              height: "auto",
              transform: "translateY(-40%) translateX(-10%)",
            }}
          />
        }
      />
      <Container size="full">
        <Typography
          as="h1"
          font="Instrument Sans"
          weight={400}
          style={{
            fontSize: "60px",
            lineHeight: "91%",
            letterSpacing: "-0.58px",
          }}
        >
          Start Your Vault Pay Wallet
        </Typography>
      </Container>
      <FeatureGridSection
        containerSize="full"
        sectionPadding="24px"
        minColWidth={280}
        gap="xl"
        items={[
          {
            src: "/Group 1000.png",
            alt: "Fast transfers",
            title: "Add a bank account",
            description:
              "Link an existing bank account to your Vault Pay account.",
          },
          {
            src: "/Group 1001.png",
            alt: "Multi-currency wallet",
            title: "Verify account",
            description:
              "Verify your bank account to be sure your money gets there.",
          },
          {
            src: "/Group 1002.png",
            alt: "Social by design",
            title: "Use & Transfer funds",
            description:
              "You’re good to go. Move money from Vault Pay to your bank account anytime.",
          },
        ]}
      />
      <ImageLeftEyebrowRightSection
        variant="ltr"
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/image 955.png",
          alt: "Vault Pay card",
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
          alt: "Vault Pay card",
          width: 569,
          height: 458,
        }}
        underImage={
          <Image
            src="/Group 97.png"
            alt="Vault Pay card"
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
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        rounded={16}
        shadow
        aspectRatio="1360 / 906"
        fit="cover"
      />
      <Container
        size="full"
        style={{ padding: `${vars.space.xl} ${vars.space["4xl"]}` }}
      >
        <Accordion items={faqItems} multiple />
      </Container>
      <BottomCallToActionBanner />
      <Footer />
    </>
  );
}
