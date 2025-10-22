import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import SplitHero from "@/components/sections/SplitHero";
import { vars } from "@/styles/theme.css";
import Container from "@/components/Layout/Container";
import Image from "next/image";
import FeatureGridSection from "@/components/sections/FeatureGridSection";
import Typography from "@/components/Typography/Typography";
import BottomCallToActionBanner from "@/components/sections/BottomCallToActionBanner";
import Accordion, { AccordionItem } from "@/components/Accordion/Accordion";
import { fluidUnit } from "@/styles/fluid-unit";
import FeatureFlexSection from "@/components/sections/FeatureFlexSection";

export default function PayOnlinePage() {
  return (
    <>
      <Navbar />
      <SplitHero
        eyebrow="PAY ONLINE"
        title={"Pay online with confidence."}
        description={`Use VaultPay to pay on websites, in mobile apps, and across streaming, travel, and e-commerce platforms with just a click. With built-in security and instant authorization, your purchases stay protected while your checkout stays seamless. Wherever Visa® and Mastercard® are accepted online, VaultPay is too.`}
        buttonLabel="Get Started"
        buttonVariant="secondary"
        buttonHref="/signup"
        imageSrc="/image 1022.png"
        containerSize="2xl"
        imageAlt="Send and receive"
        gridTemplateColumns="1fr 1fr"
        containerStyle={{
          padding: `${vars.space.xl} ${vars.space["4xl"]}`,
          marginTop: vars.space["4xl"],
          marginBottom: vars.space["4xl"],
        }}
        imageWidth={600}
        imageStyle={{
          width: "100%",
          // height: "auto",
        }}
        imageHeight={649}
        minColWidth={360}
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
      />
      <Container
        size="2xl"
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
          Use Vault Pay online with ease.{" "}
        </Typography>
      </Container>
      <FeatureFlexSection
        containerSize="2xl"
        sectionPadding={fluidUnit(24)}
        columnGap={0}
        minColWidth={300}
        gap="xl"
        items={[
          {
            src: "/Mask group22.png",
            alt: "Online stores",
            title: "Online stores",
            description:
              "Checkout securely at your favorite shops worldwide with VaultPay.",
          },
          {
            src: "/Mask group_fortnite.png",
            alt: "In-app & gaming",
            title: "In-app & gaming",
            description:
              "Level up with seamless in-app and gaming purchases powered by VaultPay.",
          },
          {
            src: "/Mask group24.png",
            alt: "Subscriptions & Bills",
            title: "Subscriptions & Bills",
            description:
              "Keep your memberships running smoothly with automatic VaultPay billing.",
          },
        ]}
      />
      <SplitHero
        title="Get the most with the Vault Pay Card"
        description="If you’re approved for a Vault Pay Prepaid Card, you can add money with Prepaid card or  from a verified bank account right into Vault."
        buttonLabel="Learn more"
        buttonHref="/cards"
        buttonVariant="secondary"
        imageSrc="/Group 1009.png"
        imageAlt="Vault Pay card"
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
