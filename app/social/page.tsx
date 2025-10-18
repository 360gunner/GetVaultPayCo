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
export default function SocialPage() {
  return (
    <>
      <Navbar />
      <BigImageOverlaySection
        image={{
          src: "/social_page_hero_image.png",
          alt: "Social Vaultpay Hero Image",
        }}
        containerSize="2xl"
        sectionPadding={`${vars.space.xl} ${fluidUnit(24)}`}
        eyebrow="SOCIAL"
        title="The social side of money"
        text="VaultPay isn’t just about sending and spending — it’s about connection. Our social features make money feel more human, more visible, and more fun. Whether you’re splitting dinner, tipping your favorite DJ, or showing love for a small business, your feed reflects your world."
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
          Making your finances friendly
        </Typography>
      </Container>
      <FeatureGridSection
        containerSize="full"
        sectionPadding={fluidUnit(24)}
        columnGap={0}
        minColWidth={280}
        gap="xl"
        items={[
          {
            src: "/Group 1021.svg",
            alt: "Send money home",
            title: "Send money home",
            description:
              "Support family abroad with just a tap — fast, secure, and borderless.",
          },
          {
            src: "/Group 1022.svg",
            alt: "Tip your friends",
            title: "Tip your friends",
            description:
              "Celebrate moments big and small — from lunch to life events.",
          },
          {
            src: "/Group 1023.svg",
            alt: "Share your purchases",
            title: "Share your purchases",
            description:
              "Make your money social — tag, react, and show love with every spend.",
          },
        ]}
      />
      <ImageLeftEyebrowRightSection
        variant="ltr"
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/Group 1026.svg",
          alt: "Vault Pay card",
          width: 569,
          height: 458,
        }}
        eyebrow="YOUR FEED"
        title="A live reflection of your world."
        text={
          "Your VaultPay feed is where meaningful moments meet financial flows. See what your friends are supporting, discover trending merchants, or revisit your own activity — all in one place. It’s personal, expressive, and designed to spark connection."
        }
      />
      <ImageLeftEyebrowRightSection
        variant="rtl"
        containerSize="lg"
        eyebrow="PRIVACY"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/Group 1028.png",
          alt: "Vault Pay card",
          width: 569,
          height: 458,
        }}
        title="You control the story."
        text={
          "Choose what you share and with whom. Every payment, tip, or transfer is yours to keep private, share with friends, or post publicly. VaultPay gives you granular control over your visibility — and we’ll never sell your data. Ever."
        }
      />

      <ImageLeftEyebrowRightSection
        variant="ltr"
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/image 104_3.png",
          alt: "Vault Pay card",
          width: 569,
          height: 458,
        }}
        eyebrow="BENEFITS"
        title="More than payments."
        text={
          "Get exclusive access to cashback offers, merchant rewards, and social boosts when you share your spend. VaultPay partners with creators, communities, and global brands to turn everyday transactions into rewarding moments."
        }
      />

      <BottomCallToActionBanner />
      <Footer />
    </>
  );
}
