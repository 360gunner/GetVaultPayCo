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

export default function PayInStorePage() {
  return (
    <>
      <Navbar />
      <SplitHero
        eyebrow="PAY IN STORE"
        title={"Simple, safe in-store payment."}
        description={`Tap, swipe, or scan to pay at millions of stores worldwide—from your neighborhood café to international retailers. With support for contactless payments and QR codes, VaultPay makes in-person purchases fast, secure, and effortless. Accepted anywhere Visa® and Mastercard® are, VaultPay turns your phone or card into a borderless wallet.`}
        buttonLabel="Get Started"
        buttonHref="/signup"
        buttonVariant="secondary"
        imageSrc="/image 102_2.png"
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
            alt="VaultPay card"
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
      <Container size="2xl" style={{ paddingTop: vars.space["4xl"] }}>
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
          Leave your cash in the bank{" "}
        </Typography>
      </Container>
      <FeatureFlexSection
        containerSize="2xl"
        sectionPadding={fluidUnit(24)}
        columnGap={0}
        minColWidth={280}
        gap="xl"
        items={[
          {
            src: "/Group 1017.png",
            alt: "Contactless",
            title: "Contactless",
            description:
              "Tap and go with instant, secure contactless payments.",
          },
          {
            src: "/Group 1018.png",
            alt: "Send in-store",
            title: "Send in-store",
            description:
              "Split the bill, tip, or send money instantly while you shop.",
          },
          {
            src: "/Group 1019.png",
            alt: "Cards",
            title: "Cards",
            description:
              "Use VaultPay virtual or physical cards anywhere Visa® and Mastercard® are accepted.",
          },
        ]}
      />
      <SplitHero
        title="Get the most with the VaultPay Card"
        description="If you’re approved for a VaultPay Prepaid Card, you can add money with Prepaid card or  from a verified bank account right into Vault."
        buttonLabel="Learn more"
        buttonVariant="secondary"
        buttonHref="/cards"
        imageSrc="/Group 1009.png"
        imageAlt="VaultPay card"
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
            alt="VaultPay card"
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
