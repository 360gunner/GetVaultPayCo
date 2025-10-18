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
import { fluidUnit } from "@/styles/fluid-unit";
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
export default function WaysToPayPage() {
  return (
    <>
      <Navbar />
      <BigImageOverlaySection
        image={{
          src: "/Group 1015.png",
          alt: "Vault Pay Ways To Pay Hero Image",
        }}
        containerSize="2xl"
        sectionPadding={`${vars.space.xl}${fluidUnit(24)} `}
        eyebrow="WAYS TO PAY"
        title="Use Vault Pay for every way you pay."
        text="Use Vault Pay app for transferring money with just a few taps, and your money will be received in less than a minute."
        buttonLabel="Get Started"
        buttonHref="/signup"
        aspectRatio="1360 / 784"
        fullBleed={false}
      />
      <Container
        size="full"
        style={{ paddingTop: vars.space["4xl"], paddingLeft: fluidUnit(24) }}
      >
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
          Payment made simple.
        </Typography>
      </Container>
      <FeatureGridSection
        containerSize="full"
        sectionPadding={`${fluidUnit(24)}`}
        minColWidth={280}
        gap="xl"
        columnGap={0}
        items={[
          {
            src: "/Mask group.png",
            alt: "Fast transfers",
            title: "Pay online & in-app",
            buttonLabel: "Learn more",
            description:
              "Checkout instantly with VaultPay anywhere digital payments are accepted.",
          },
          {
            src: "/Mask group1.png",
            alt: "Multi-currency wallet",
            title: "Pay in-store",
            buttonLabel: "Learn more",
            description:
              "Tap, swipe, or scan—VaultPay works seamlessly at the register.",
          },
          {
            src: "/Group 1016.png",
            alt: "Social by design",
            title: "Vault Pay Cards",
            buttonLabel: "Learn more",
            description:
              "Get physical and virtual cards backed by Visa® and Mastercard® for everyday use.",
          },
        ]}
      />
      <SplitHero
        title="Get the most with the Vault Pay Card"
        description="If you’re approved for a Vault Pay Prepaid Card, you can add money with Prepaid card or  from a verified bank account right into Vault."
        buttonLabel="Learn more"
        buttonVariant="secondary"
        imageSrc="/Group 1009.png"
        imageAlt="Vault Pay card"
        buttonHref="/cards"
        containerSize="xl"
        titleFontSize={60}
        gridTemplateColumns="1.3fr 1fr"
        containerStyle={{
          padding: `${vars.space.xl} ${vars.space["4xl"]}`,
          marginTop: vars.space["4xl"],
          marginBottom: "calc(319px * 0.5 + 48px)",
        }}
        underDescription={
          <Image
            src="/visa_mastercard.png"
            alt="Vault Pay card"
            width={124}
            unoptimized
            height={47}
            style={{
              width: "100px",
              height: "auto",
              display: "block",
              marginBottom: vars.space.md,
            }}
          />
        }
        imageWidth={685}
        imageHeight={649}
        minColWidth={360}
        underImage={
          <Image
            unoptimized
            src="/Image1122.png"
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
      <BottomCallToActionBanner />
      <Footer />
    </>
  );
}
