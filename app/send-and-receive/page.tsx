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
        imageStyle={{ transform: "translateX(-24px)" }}
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
      <WaysToUseGridSection
        title={<>Ways to use Vault Pay</>}
        containerSize="xl"
        sectionPadding="48px 24px"
        minColWidth={220}
        gap="xl"
        items={[
          {
            src: "/Group 985.png",
            alt: "Pay friends",
            label: "Pay friends",
            width: 360,
            height: 278,
          },
          {
            src: "/Group 986.png",
            alt: "Split bills",
            label: "Split bills",
            width: 360,
            height: 278,
          },
          {
            src: "/Group 987.png",
            alt: "Budgeting",
            label: "Budgeting",
            width: 360,
            height: 278,
          },
          {
            src: "/Group 988.png",
            alt: "Top up",
            label: "Top up",
            width: 360,
            height: 278,
          },
          {
            src: "/Group 989.png",
            alt: "Phone airtime",
            label: "Phone airtime",
            width: 360,
            height: 278,
          },
          {
            src: "/Group 990.png",
            alt: "Transport",
            label: "Transport",
            width: 360,
            height: 278,
          },
          {
            src: "/Group 991.png",
            alt: "Groceries",
            label: "Groceries",
            width: 360,
            height: 278,
          },
          {
            src: "/Group 992.png",
            alt: "Subscriptions",
            label: "Subscriptions",
            width: 360,
            height: 278,
          },
          {
            src: "/Group 993.png",
            alt: "Travel",
            label: "Travel",
            width: 360,
            height: 278,
          },
          {
            src: "/Group 994.png",
            alt: "Dining",
            label: "Dining",
            width: 360,
            height: 278,
          },
          {
            src: "/Group 995.png",
            alt: "Shopping",
            label: "Shopping",
            width: 360,
            height: 278,
          },
          {
            src: "/Group 996.png",
            alt: "Donations",
            label: "Donations",
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
