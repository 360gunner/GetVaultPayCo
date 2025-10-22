import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import SplitHero from "@/components/sections/SplitHero";
import FeatureGridSection from "@/components/sections/FeatureGridSection";
import { vars } from "@/styles/theme.css";
import StepsWithImageSection from "@/components/sections/StepsWithImageSection";
import GrayShapeBackgroundGridSection from "@/components/sections/GrayShapeBackgroundGridSection";
import Typography from "@/components/Typography/Typography";
import BorderlessFeatureSection from "@/components/sections/BorderlessFeatureSection";
import WaysToUseGridSection from "@/components/sections/WaysToUseGridSection";
import BottomCallToActionBanner from "@/components/sections/BottomCallToActionBanner";
import Image from "next/image";
import { fluidUnit } from "@/styles/fluid-unit";
import FeatureFlexSection from "@/components/sections/FeatureFlexSection";
import WaysToUseFlexSection from "@/components/sections/WaysToUseFlexSection";

export default function SendAndReceivePage() {
  return (
    <>
      <Navbar />
      <SplitHero
        eyebrow="SEND & RECEIVE"
        title={"Your powerful personal payments wallet."}
        description="Opt for the ease of Vault Pay payment services. Sending money and making online payments has never been simpler, quicker, or more secure. No need to share your bank account or credit card codes during transactions. Just use your email address or scan the QR code – that's all it takes for seamless transfers and online purchases."
        buttonLabel="Learn more"
        buttonVariant="secondary"
        imageSrc="/Group 979.png"
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
      />

      <FeatureFlexSection
        containerSize="full"
        columnGap={0}
        sectionPadding={vars.space.md}
        sectionStyle={{
          marginTop: vars.space["4xl"],
          marginBottom: vars.space["4xl"],
        }}
        minColWidth={220}
        gap="lg"
        items={[
          {
            src: "/Mask group102.png",
            alt: "Manage your money, anywhere",
            title: "Manage your money, anywhere",
            description:
              "Hold and convert money across currencies with real-time FX rates and no hidden fees.",
          },
          {
            src: "/Mask group101.png",
            alt: "Pay in-app & online",
            title: "Pay in-app & online",
            description:
              "Enjoy 24/7 access to free statements every day, aiding you in better financial accessibility, budgeting, and money management.",
          },
          {
            src: "/Mask group103.png",
            alt: "Pay in-store",
            title: "Pay in-store",
            description:
              "Share or send payments, follow, and keep track of your friends' purchases on your timeline.",
          },
          {
            src: "/Mask group104.png",
            alt: "Pay with Vault Pay card",
            title: "Pay with Vault Pay card",
            description:
              "Pay with your Vault Pay card at any merchant accepting Mastercard, Visa, or UnionPay.",
          },
        ]}
      />
      <StepsWithImageSection
        sectionStyle={{}}
        title="How it Works"
        items={[
          {
            title: "Sign up",
            text: "Create your free account in minutes.",
            iconSrc: "/signup_icon.svg",
          },
          {
            title: "Secure Wallet",
            text: "Safeguard your funds and financial data.",
            iconSrc: "/shield_icon.svg",
          },
          {
            title: "Pay & Save",
            text: "Send, spend, and pay bills all in one place.",
            iconSrc: "/dollar_icon.svg",
            underDescriptionImage: (
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
                  transform: "translateY(30%) translateX(0%)",
                  marginBottom: vars.space.md,
                }}
              />
            ),
          },
        ]}
        imageSrc="/image 103.png"
        imageAlt="VaultPay preview"
      />
      <GrayShapeBackgroundGridSection
        eyebrow="PRICING"
        title="No hidden fees, no surprises."
        body={
          <div>
            <Typography
              as="p"
              font="Instrument Sans"
              weight={400}
              style={{
                margin: 0,
                fontSize: fluidUnit(20),
                lineHeight: "91%",
                maxWidth: "25ch",
                letterSpacing: "-0.58px",
              }}
            >
              Enjoy minimal fees when sending or receiving money using your
              Vault Pay account or linked bank account.
              <br />
            </Typography>

            <Typography
              as="p"
              font="Instrument Sans"
              weight={400}
              style={{
                marginTop: "1rem",
                fontSize: fluidUnit(24),
                letterSpacing: "-0.58px",
              }}
            >
              $0 Signup fees <br />
              <br />
              $0 Monthly fees
              <br />
              <br />
              $0 Annual fees
            </Typography>
          </div>
        }
        buttonLabel="Learn more"
        imageSrc="/Group 980.png"
        imageAlt="Security illustration"
        imageWidth={609}
        imageHeight={649}
      />
      <BorderlessFeatureSection
        heading={
          <>
            Give your money <br /> a voice
          </>
        }
        imageSrc="/Group 984.png"
        imageAlt="Cross-border payments"
        rightTitle={<></>}
        imageWidth={623}
        imageHeight={458}
        buttonHref="/social"
        imageStyle={{ transform: "translateX(0%)" }}
        rightBody={
          <>
            Express yourself with every payment: Share your transactions with
            friends  Easily tip your followers with just a click! Share or send
            payments, follow, and keep track of your friends' purchases on your
            timeline.
          </>
        }
        buttonLabel="Learn more"
      />
      <WaysToUseFlexSection
        title={<>Ways to use Vault Pay</>}
        titleStyle={{
          marginBottom: "1em",
        }}
        columnGap={0}
        containerSize="2xl"
        sectionPadding="48px 24px"
        minColWidth={220}
        sectionStyle={{
          marginTop: vars.space["4xl"],
          marginBottom: vars.space["4xl"],
        }}
        gap="xl"
        items={[
          {
            src: "/Group 985.png",
            alt: "Pay Bills",
            label: "Pay Bills",
            width: 360,
            height: 278,
          },
          {
            src: "/Group 986.png",
            alt: "Food Delivery",
            label: "Food Delivery",
            width: 360,
            height: 278,
          },
          {
            src: "/Group 987.png",
            alt: "Tips & Gifts Friends",
            label: "Tips & Gifts Friends",
            width: 360,
            height: 278,
          },
          {
            src: "/Group 988.png",
            alt: "Send to Family",
            label: "Send to Family",
            width: 360,
            height: 278,
          },
          {
            src: "/Group 989.png",
            alt: "In-store purchases",
            label: "In-store purchases",
            width: 360,
            height: 278,
          },
          {
            src: "/Group 990.png",
            alt: "Online purchases",
            label: "Online purchases",
            width: 360,
            height: 278,
          },
          {
            src: "/Group 991.png",
            alt: "Ride Hailing",
            label: "Ride Hailing",
            width: 360,
            height: 278,
          },
          {
            src: "/Group 992.png",
            alt: "Secure Accounts",
            label: "Secure Accounts",
            width: 360,
            height: 278,
          },
          {
            src: "/Group 993.png",
            alt: "Bank transfers",
            label: "Bank transfers",
            width: 360,
            height: 278,
          },
          {
            src: "/Group 994.png",
            alt: "Physical cards",
            label: "Physical cards",
            width: 360,
            height: 278,
          },
          {
            src: "/Group 995.png",
            alt: "Global Balance",
            label: "Global Balance",
            width: 360,
            height: 278,
          },
          {
            src: "/Group 996.png",
            alt: "Convert currencies",
            label: "Convert currencies",
            width: 360,
            height: 278,
          },
        ]}
      />
      <BottomCallToActionBanner />
      <Footer />
    </>
  );
}
