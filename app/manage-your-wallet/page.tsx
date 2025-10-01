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

export default function ManageYourWalletPage() {
  return (
    <>
      <Navbar />
      <SplitHero
        eyebrow="MANAGE & TOP-UP"
        title="Move your money faster"
        description="Use Vault Pay app for transferring money with just a few taps, and your money will be received in less than a minute.*Transfer speed depends on your bank and could take up to 30 minutes. Transfers are reviewed which may result in delays or funds being frozen or removed from your Vault Pay account."
        buttonLabel="Get Started"
        buttonVariant="secondary"
        imageSrc="/Group 998.png"
        imageAlt="Send and receive"
        containerStyle={{
          padding: `${vars.space.xl} ${vars.space["4xl"]}`,
          marginBottom: "calc(226px * 0.3 + 48px)",
        }}
        imageWidth={685}
        imageHeight={649}
        underImage={
          <Image
            src="/Group 999.png"
            alt="Finally A Wallet I can manage at all times"
            width={516}
            height={226}
            style={{
              // alignSelf: "center",
              width: "65%",
              height: "auto",
              position: "absolute",
              bottom: 0,

              transform: "translateY(70%) translateX(10%)",
            }}
          />
        }
      />
      <Container size="2xl" style={{ paddingTop: "calc(226px * 0.3 + 32px)" }}>
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
        sectionStyle={{
          marginTop: vars.space["4xl"],
          marginBottom: vars.space["4xl"],
        }}
        containerSize="2xl"
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
      <CardGridWithCentralImageSection
        containerSize="2xl"
        containerStyle={{ padding: `${vars.space.xl} ${vars.space["5xl"]}` }}
        leftItems={[
          {
            title: "Make payments",
            text: "Store, send, convert, and protect your money in seconds.",
            iconSrc: "/dollar_icon.png",
            floatingTopRightImage: (
              <Image
                src="/visa_mastercard.png"
                alt="Vault Pay card"
                width={124}
                unoptimized
                height={47}
                style={{
                  aspectRatio: "124 / 47",
                  maxWidth: "124px",
                }}
              />
            ),
          },

          {
            title: "Send Money",
            text: "Organize recurring payments and never miss a due date.",
            iconSrc: "/smile_icon.png",
          },
        ]}
        image={{
          src: "/image 1055.png",
          alt: "Vault Pay app preview",
          height: 781,
          aspectRatio: 56 / 78,
          width: 560,
        }}
        rightItems={[
          {
            title: "Transfer",
            text: "Organize recurring payments and never miss a due date.",
            iconSrc: "/send_icon.png",
          },

          {
            title: "Recieve Money",
            text: "Share, split, and interact with money like never before.",
            iconSrc: "/signal_icon.png",
          },
        ]}
      />

      <GrayShapeBackgroundGridSection
        eyebrow="DIRECT DEPOSIT"
        title="Top-up with easy, seamless direct deposit"
        body="Move money into your VaultPay account without friction. Connect your employer or bank once, and your funds arrive automatically—no delays, no hidden fees. Whether you’re topping up for everyday payments, travel, or cross-border transfers, direct deposit keeps your VaultPay balance ready when you need it."
        buttonLabel="Sign Up"
        imageSrc="/Group 1007.png"
        imageAlt="Security illustration"
        imageWidth={609 / 1.3}
        imageHeight={649 / 1.3}
      />
      <SplitHero
        title="Get the most with the Vault Pay Card"
        description="If you’re approved for a Vault Pay Prepaid Card, you can add money with Prepaid card or  from a verified bank account right into Vault."
        buttonLabel="Learn more"
        buttonVariant="secondary"
        imageSrc="/Group 1009.png"
        imageAlt="Vault Pay card"
        containerSize="2xl"
        titleFontSize={60}
        gridTemplateColumns="1.1fr 1fr"
        containerStyle={{
          padding: `${vars.space.xl} ${vars.space["4xl"]}`,
          marginBottom: "calc(319px * 0.5 + 48px)",
        }}
        imageWidth={685}
        imageStyle={
          {
            // width: "100%",
            // height: "auto",
          }
        }
        imageHeight={649}
        minColWidth={360}
        underImage={
          <Image
            src="/Image1122.png"
            alt="Finally A Wallet I can manage at all times"
            width={621}
            height={319}
            style={{
              // alignSelf: "center",
              height: "auto",
              display: "block",
              position: "absolute",
              bottom: 0,
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
