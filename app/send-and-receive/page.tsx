import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import SplitHero from "@/components/sections/SplitHero";
import FeatureGridSection from "@/components/sections/FeatureGridSection";
import { vars } from "@/styles/theme.css";
import StepsWithImageSection from "@/components/sections/StepsWithImageSection";
import GrayShapeBackgroundGridSection from "@/components/sections/GrayShapeBackgroundGridSection";
import Typography from "@/components/Typography/Typography";

export default function SendAndReceivePage() {
  return (
    <>
      <Navbar />
      <SplitHero
        eyebrow="SEND & RECEIVE"
        title="Your powerful personal payments wallet."
        description="Opt for the ease of Vault Pay payment services. Sending money and making online payments has never been simpler, quicker, or more secure. No need to share your bank account or credit card codes during transactions. Just use your email address or scan the QR code – that's all it takes for seamless transfers and online purchases."
        buttonLabel="Learn more"
        buttonVariant="secondary"
        imageSrc="/Group 979.png"
        imageAlt="Send and receive"
        containerSize="xl"
        gridTemplateColumns="1fr 1fr"
        containerStyle={{ padding: `${vars.space.xl} ${vars.space["4xl"]}` }}
        imageWidth={600}
        imageStyle={{
          width: "100%",
          height: "auto",
        }}
        imageHeight={649}
        minColWidth={360}
      />
      <FeatureGridSection
        containerSize="full"
        sectionPadding="24px"
        minColWidth={220}
        gap="xl"
        items={[
          {
            src: "/image 104.png",
            alt: "Fast transfers",
            title: "Multi-Currency Wallet",
            description:
              "Hold and convert money across currencies with real-time FX rates and no hidden fees.",
          },
          {
            src: "/image 123.png",
            alt: "Multi-currency wallet",
            title: "Cross-Border Transfers",
            description:
              "Send money instantly to friends and family in other countries—no middlemen, no delays.",
          },
          {
            src: "/image 124.png",
            alt: "Social by design",
            title: "Global Bill Pay",
            description:
              "Pay for utilities, phone service, or subscriptions across borders using one simple interface.",
          },
          {
            src: "/image 104.png",
            alt: "Secure savings",
            title: "Secure Savings",
            description:
              "Grow your savings with transparent yields and full control over your funds.",
          },
        ]}
      />
      <StepsWithImageSection
        title="How it Works"
        items={[
          {
            title: "Sign up",
            text: "Create your free account in minutes.",
            iconSrc: "/signup_icon.png",
          },
          {
            title: "Secure Wallet",
            text: "Safeguard your funds and financial data.",
            iconSrc: "/shield_icon.png",
          },
          {
            title: "Pay & Save",
            text: "Send, spend, and pay bills all in one place.",
            iconSrc: "/dollar_icon.png",
          },
        ]}
        imageSrc="/image 100.png"
        imageAlt="VaultPay preview"
        containerSize="lg"
        minColWidth={360}
        columnGap={60}
        titleFontSize={64}
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
                fontSize: 20,
                lineHeight: "91%",
                letterSpacing: "-0.58px",
              }}
            >
              Enjoy minimal fees when sending or receiving money using your
              Vault Pay account or linked bank account.
            </Typography>
            <Typography
              as="p"
              font="Instrument Sans"
              weight={400}
              style={{
                marginTop: "1rem",
                fontSize: "24px",
                letterSpacing: "-0.58px",
              }}
            >
              $0 Signup fees <br />
              $0 Monthly fees
              <br />
              $0 Annual fees
            </Typography>
          </div>
        }
        buttonLabel="Learn more"
        imageSrc="/Group 980.png"
        imageAlt="Security illustration"
        imageWidth={609 / 1.3}
        imageHeight={649 / 1.3}
      />
      <Footer />
    </>
  );
}
