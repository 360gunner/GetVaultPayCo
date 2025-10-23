import Typography from "@/components/Typography/Typography";
import Button from "@/components/Button/Button";
import Icon from "@/components/Icon/Icon";
import AppImage from "@/components/Image/AppImage";
import ImageButton from "@/components/ImageButton/ImageButton";
import { AppLink } from "@/components/Link/AppLink";
import Card from "@/components/Card/Card";
import Accordion from "@/components/Accordion/Accordion";
import Container from "@/components/Layout/Container";
import Stack from "@/components/Layout/Stack";
import Grid from "@/components/Layout/Grid";
import Carousel from "@/components/Carousel/Carousel";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { vars } from "@/styles/theme.css";
import Image from "next/image";
import GrayShapeBackgroundGridSection from "@/components/sections/GrayShapeBackgroundGridSection";
import { fluidUnit } from "@/styles/fluid-unit";
import BottomCallToActionBanner from "@/components/sections/BottomCallToActionBanner";
import Link from "next/link";

const BenefitsSection: React.FC = () => {
  const items: Array<{
    title: string;
    text: string;
    iconSrc?: string;
  }> = [
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
      text: "Send, spend, and organize bills all in one place.",
      iconSrc: "/dollar_icon.svg",
    },
  ];
  return (
    <section
      style={{
        padding: "24px 0",
        marginTop: vars.space["4xl"],
        maxHeight: "100vh",
        marginBottom: vars.space["4xl"],
      }}
    >
      <Container
        size="xl"
        style={{
          maxHeight: "100vh",
          paddingLeft: "48px",
          paddingRight: "48px",
          // overflowX: "hidden",
        }}
      >
        <Grid
          minColWidth={360}
          style={{
            alignItems: "center",
            columnGap: fluidUnit(40),
            gridTemplateColumns: "1fr 1fr",
            maxHeight: "100vh",
          }}
        >
          {/* Left: Title + rows */}
          <div
            style={{
              height: "100%",
              flex: 1,
              display: "flex",
              maxHeight: "100vh",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography
              as="h1"
              font="Space Grotesk"
              weight={400}
              style={{ fontSize: fluidUnit(80), marginBottom: fluidUnit(90) }}
            >
              How it Works{" "}
            </Typography>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {items.map(({ title, text, iconSrc }) => (
                <div
                  key={title}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    rowGap: fluidUnit(10),
                    // maxWidth: "75%",
                  }}
                >
                  <div
                    style={{
                      width: fluidUnit(118),
                      height: fluidUnit(118),
                      borderRadius: fluidUnit(20),
                      background: "#000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: "0 0 auto",
                    }}
                  >
                    {iconSrc ? (
                      <Image
                        src={iconSrc}
                        alt={title}
                        width={72}
                        height={72}
                        style={{ width: fluidUnit(72), height: fluidUnit(72) }}
                      />
                    ) : (
                      <svg
                        width="72"
                        height="72"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ width: fluidUnit(72), height: fluidUnit(72) }}
                      >
                        <path
                          d="M20.285 6.709a1 1 0 010 1.414l-9 9a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10.5 14.5l8.293-8.293a1 1 0 011.492.502z"
                          fill="#FFFFFF"
                        />
                      </svg>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: fluidUnit(60),
                      gap: fluidUnit(12),
                      padding: "8px 0 ",
                    }}
                  >
                    <Typography
                      font="Instrument Sans"
                      as="h5"
                      style={{
                        margin: 0,
                        fontWeight: 400,
                        fontSize: fluidUnit(40),
                      }}
                    >
                      {title}
                    </Typography>
                    <Typography
                      font="Instrument Sans"
                      as="p"
                      weight={400}
                      style={{
                        margin: 0,
                        lineHeight: "91%",
                        fontSize: fluidUnit(26),
                        maxWidth: "20ch",
                        letterSpacing: "-0.58px",
                      }}
                    >
                      {text}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right: Image with decorative shape */}
          <div style={{ position: "relative", maxHeight: "100vh" }}>
            {/* Decorative shape (behind), bottom-right */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                right: "0",
                bottom: "0%",
                width: fluidUnit(463),
                height: fluidUnit(238),
                transform: `translate(${fluidUnit(90, 40)}, -60%)`,
                zIndex: 0,
                pointerEvents: "none",
              }}
            >
              <Image
                src="/decorative_vector_shape_1.png"
                alt="decorative shape"
                width={463}
                height={238}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <div
              style={{
                position: "relative",
                width: "100%",
                maxHeight: "100vh",
                aspectRatio: "458 / 653",
                // height: "min(60vw, 653px)",
              }}
            >
              {/* Image box (on top) */}
              <div
                style={{
                  position: "relative",
                  alignSelf: "center",
                  maxHeight: "100vh",
                  marginLeft: "auto",
                  marginRight: "0",
                  textAlign: "center",
                  // width: "100%",
                  borderRadius: 12,
                  overflow: "hidden",
                  zIndex: 1,
                  aspectRatio: "458 / 653",
                }}
              >
                <Image
                  unoptimized
                  src="/image 100.png"
                  alt="VaultPay preview"
                  fill
                />
              </div>
            </div>
          </div>
        </Grid>
      </Container>
    </section>
  );
};

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      text: `“VaultPay makes it so easy to split bills with my friends while traveling.”`,
      name: "AMINA, LAGOS",
      avatar: "/image 97.png",
    },
    {
      text: `“Finally, a wallet I actually want to use.”`,
      name: "EYEBROW HERE",
      avatar: "/image 98.png",
    },
    {
      text: `“I can pay my family’s phone bill in another country without the fees.”`,
      name: "EYEBROW HERE",
      avatar: "/image 99.png",
    },
  ];

  return (
    <Container
      size="full"
      style={{
        paddingRight: fluidUnit(24),
        paddingLeft: fluidUnit(24),
        paddingTop: vars.space.xl,
        paddingBottom: vars.space.xl,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <section
        style={{
          padding: "80px 0",
          paddingTop: "90px",
          background: vars.gradients.vpGradient,
          borderRadius: 16,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container size="full">
          <Stack gap="md">
            <Grid
              minColWidth={100}
              gap="lg"
              style={{ alignItems: "stretch", gap: 0 }}
            >
              {testimonials.map(({ text, name, avatar }) => (
                <div
                  key={name}
                  style={{
                    borderRadius: 16,
                    padding: fluidUnit(18),
                    display: "flex",
                    flexDirection: "column",
                    gap: fluidUnit(16),
                    height: "100%",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    as="h4"
                    style={{ fontWeight: 400, fontSize: fluidUnit(36) }}
                  >
                    {text}
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: fluidUnit(8),
                      marginTop: "auto",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <div
                        style={{
                          width: fluidUnit(112),
                          height: fluidUnit(112),
                          borderRadius: "50%",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <Image
                          src={avatar}
                          alt={name}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    </div>
                    <Typography
                      as="p"
                      style={{
                        fontWeight: 400,
                        fontSize: fluidUnit(20),
                        marginTop: "1rem",
                      }}
                    >
                      {name}
                    </Typography>
                  </div>
                </div>
              ))}
            </Grid>
          </Stack>
        </Container>
      </section>
    </Container>
  );
};

const HeroSection: React.FC = () => {
  return (
    <section>
      <Container
        size="full"
        style={{
          paddingRight: fluidUnit(24),
          paddingLeft: fluidUnit(24),
        }}
      >
        <Grid
          minColWidth={300}
          gap="lg"
          style={{
            padding: 0,
            alignItems: "stretch",
            gridTemplateColumns: "2fr 1fr",
            gap: vars.space.lg,
            paddingTop: vars.space.lg,
            gridAutoFlow: "dense",
            maxWidth: "calc(100* var(--vw))",
          }}
        >
          <div>
            <Typography
              as="h1"
              font="Space Grotesk"
              style={{
                fontSize: fluidUnit(130),
                fontWeight: 400,
                lineHeight: "91%",
                letterSpacing: "-2%",
                marginBottom: fluidUnit(18, 12),
              }}
            >
              The human <br /> way to money
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography
              as="p"
              style={{ fontSize: fluidUnit(20), minWidth: "25ch" }}
            >
              VaultPay is your borderless social wallet—pay, transfer, and save
              across currencies with ease, community, and control
            </Typography>
            <div>
              <Link href={"/signup"}>
                <Button
                  variant="colored"
                  size="medium"
                  backgroundColor={vars.color.neonMint}
                >
                  <Typography
                    as="span"
                    margin={0}
                    style={{ fontSize: fluidUnit(26, 14) }}
                  >
                    Start for Free
                  </Typography>
                </Button>
              </Link>
            </div>
          </div>
        </Grid>

        {/* Full-width rounded image (responsive height) */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1360/906",
            marginTop: 16,
            borderRadius: 16,
            maxHeight: "100vh",
            overflow: "hidden",
          }}
        >
          <Image
            unoptimized
            src="/image 94.png"
            alt="Vault app preview"
            fill
            style={{ objectFit: "cover" }}
          />
          {/* Store badges overlay */}
          <div
            style={{
              position: "absolute",
              left: 16,
              bottom: 16,
              display: "flex",
              gap: 12,
              zIndex: 1,
            }}
          >
            <a
              href="https://play.google.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Get it on Google Play"
            >
              <Image
                src="/google_play_badge.svg"
                alt="Get it on Google Play"
                width={160}
                height={48}
              />
            </a>
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noreferrer"
              aria-label="Download on the App Store"
            >
              <Image
                src="/app_store_badge.svg"
                alt="Download on the App Store"
                width={160}
                height={48}
              />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
};
const SecurityTrustSection: React.FC = () => {
  return (
    <GrayShapeBackgroundGridSection
      imageSrc="/image1044.png"
      buttonHref="/security-and-protection"
      imageWidth={690}
      imageHeight={649}
      eyebrow="SECURITY & TRUST"
      title="The safe, speedy & secure borderless payment app."
      body={
        <Typography
          as="p"
          style={{
            marginTop: fluidUnit(16),
            maxWidth: "30ch",

            fontSize: fluidUnit(20),
          }}
        >
          End-to-End Encryption – Your data is encrypted at every step.
          <br />
          <br />
          PCI-DSS Compliant – We never store sensitive info directly.
          <br />
          <br />
          Fraud Monitoring – AI-powered systems flag and prevent risk.
        </Typography>
      }
      buttonLabel="Learn more"
    />
  );
};

const SimpleSecureSocial: React.FC = () => {
  type SSSItem = {
    title: string;
    text: string;
    iconSrc?: string;
    index: number;
  };
  const leftItems: SSSItem[] = [
    {
      title: "Wallet",
      text: "Store, send, convert, and protect your money in seconds.",
      iconSrc: "/signup_icon.svg",
      index: 1,
    },
    {
      title: "Bills",
      text: "Organize recurring payments and never miss a due date.",
      iconSrc: "/drop_icon.svg",
      index: 2,
    },
  ];
  const rightItems: SSSItem[] = [
    {
      title: "Send international",
      text: "Organize recurring payments and never miss a due date.",
      iconSrc: "/globe_icon.svg",
      index: 3,
    },
    {
      title: "Social Payments",
      text: "Share, split, and interact with money like never before.",
      iconSrc: "/friend_icon.svg",
      index: 4,
    },
  ];

  const Card = ({
    title,
    text,
    iconSrc,
    index,
  }: {
    title: string;
    text: string;
    iconSrc?: string;
    index: number;
  }) => {
    const getGradient = (index: number) => {
      switch (index) {
        case 1:
          return vars.gradients.vpGradient;
        case 2:
          return vars.gradients.vpGradient2;
        case 3:
          return vars.gradients.vpGradient3;
        case 4:
          return vars.gradients.vpGradient4;
        default:
          return vars.gradients.vpGradient;
      }
    };
    return (
      <div
        style={{
          background: getGradient(index),
          borderRadius: fluidUnit(30),
          padding: fluidUnit(24),
          flex: 1,
          display: "flex",
          flexDirection: "column",
          aspectRatio: "1/1",
          gap: fluidUnit(8),
          maxWidth: "30 * var(--vw)",
        }}
      >
        <div
          style={{
            width: fluidUnit(80),
            height: fluidUnit(80),
            borderRadius: fluidUnit(11),
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {iconSrc ? (
            <Image
              src={iconSrc}
              alt={title}
              width={48}
              height={48}
              style={{
                height: fluidUnit(48),
                width: fluidUnit(48),
              }}
            />
          ) : (
            <svg
              width={fluidUnit(48)}
              height={fluidUnit(48)}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.285 6.709a1 1 0 010 1.414l-9 9a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10.5 14.5l8.293-8.293a1 1 0 011.492.502z"
                fill="#FFFFFF"
              />
            </svg>
          )}
        </div>
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: fluidUnit(4),
          }}
        >
          <Typography
            as="h4"
            font="Instrument Sans"
            weight={400}
            style={{ fontSize: fluidUnit(30) }}
          >
            {title}
          </Typography>
          <Typography
            font="Instrument Sans"
            as="p"
            style={{ fontSize: fluidUnit(20) }}
          >
            {text}
          </Typography>
        </div>
      </div>
    );
  };
  const gridGap = vars.space["xxxl"];
  return (
    <section
      style={{
        padding: "24px 0",
        marginTop: vars.space["4xl"],
        marginBottom: vars.space["4xl"],
      }}
    >
      <Container size="2xl" style={{ padding: fluidUnit(48) }}>
        <Stack gap="sm">
          <Typography
            as="h2"
            font="Space Grotesk"
            weight={400}
            style={{ fontSize: fluidUnit(60) }}
          >
            Simple, Secure, Social
          </Typography>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.5fr 1fr",
              gap: fluidUnit(48),
              alignItems: "stretch",
            }}
          >
            {/* Left column: two cards */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "end",
                gap: gridGap,
              }}
            >
              {leftItems.map((it) => (
                <Card
                  key={it.title}
                  title={it.title}
                  text={it.text}
                  iconSrc={it.iconSrc}
                  index={it.index}
                />
              ))}
            </div>

            {/* Middle column: tall image */}
            <div
              style={{
                aspectRatio: "56/78",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                unoptimized
                src="/image 105.png"
                alt="VaultPay app preview"
                width={560}
                style={{
                  margin: "0 auto",
                  objectFit: "cover",
                  flex: 1,
                }}
                height={781}
              />
            </div>

            {/* Right column: two cards */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "start",
                gap: gridGap,
              }}
            >
              {rightItems.map((it) => (
                <Card
                  key={it.title}
                  title={it.title}
                  text={it.text}
                  iconSrc={it.iconSrc}
                  index={it.index}
                />
              ))}
            </div>
          </div>
        </Stack>
      </Container>
    </section>
  );
};

export default function Home() {
  return (
    <>
      <Navbar />
      <Container
        size="full"
        style={{ padding: 0, paddingTop: vars.space.xl, paddingBottom: 48 }}
      >
        <Stack gap="xl">
          <HeroSection />
          {/* Feature Section: Borderless payments for all */}
          <section style={{ padding: "24px 0" }}>
            <Container
              size="xl"
              style={{ padding: `${vars.space.xl}  ${vars.space["4xl"]}` }}
            >
              <Stack gap="sm">
                <Typography
                  as="h1"
                  font="Space Grotesk"
                  weight={400}
                  style={{ fontSize: fluidUnit(80), lineHeight: "91%" }}
                >
                  Borderless <br /> payments for all
                </Typography>
                <Grid
                  minColWidth={320}
                  gap="xl"
                  style={{
                    alignItems: "center",
                    gridTemplateColumns: "1fr auto",
                  }}
                >
                  <div
                    style={{
                      padding: vars.space.xl,
                      paddingLeft: 0,
                      minWidth: fluidUnit(569),
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "569/458",
                        borderRadius: 12,
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        unoptimized
                        src="/image 95.png"
                        alt="Cross-border payments"
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      paddingTop: vars.space.xl,
                      paddingBottom: vars.space.xl,
                      minWidth: fluidUnit(300),
                    }}
                  >
                    <Typography
                      as="h2"
                      font="Instrument Sans"
                      weight={400}
                      style={{ fontSize: fluidUnit(40) }}
                    >
                      Built for a World <br /> Without Limits
                    </Typography>
                    <Typography
                      as="p"
                      style={{ fontSize: fluidUnit(20), maxWidth: "30ch" }}
                    >
                      VaultPay lets you send, receive, and manage money across
                      countries, currencies, and communities—without the usual
                      friction. Whether you're supporting family, traveling, or
                      building your business, we make it feel effortless.
                    </Typography>
                    <Link href={"/borderless-transfers"}>
                      <Button
                        style={{
                          marginTop: fluidUnit(24),
                          padding: `${fluidUnit(16, 10)} ${fluidUnit(16, 10)}`,
                        }}
                        variant="secondary"
                        size="large"
                        textStyle={{ fontSize: fluidUnit(20, 12) }}
                        label="Learn more"
                      />
                    </Link>
                  </div>
                </Grid>
              </Stack>
            </Container>
          </section>

          {/* Feature Grid: image on top, title and subtitle */}
          {/* Feature Grid: image on top, title and subtitle */}
          <section style={{ padding: "24px" }}>
            <Container size="2xl">
              <div
                style={{
                  display: "flex",
                  gap: "-48px",
                  alignItems: "flex-start",
                  paddingLeft: "5%",
                }}
              >
                <Link href={"/send-and-receive"} style={{ flex: 1 }}>
                  <div style={{ marginLeft: "-15%" }}>
                    <Image
                      src="/Image 104.png"
                      alt="Fast transfers"
                      width={476}
                      height={386}
                      unoptimized={true}
                      style={{ width: "100%", height: "auto" }}
                    />
                    <Typography
                      as="h4"
                      font="Instrument Sans"
                      weight={400}
                      style={{
                        marginTop: vars.space.lg,
                        fontSize: fluidUnit(30, 18),
                        width: "100%",
                        paddingRight: "10%",
                      }}
                    >
                      Multi-Currency Wallet
                    </Typography>
                    <Typography
                      as="p"
                      style={{ maxWidth: "75%", fontSize: fluidUnit(20, 12) }}
                    >
                      Hold and convert money across currencies with real-time FX
                      rates and no hidden fees.
                    </Typography>
                  </div>
                </Link>
                <Link href={"/borderless-transfers"} style={{ flex: 1 }}>
                  <div style={{ marginLeft: "-15%" }}>
                    <Image
                      src="/Image 123.png"
                      alt="Multi-currency wallet"
                      width={476}
                      height={386}
                      unoptimized={true}
                      style={{ width: "100%", height: "auto" }}
                    />
                    <Typography
                      as="h4"
                      font="Instrument Sans"
                      weight={400}
                      style={{
                        marginTop: vars.space.lg,
                        fontSize: fluidUnit(30, 18),
                        paddingRight: "10%",
                      }}
                    >
                      Cross-Border Transfers{" "}
                    </Typography>
                    <Typography
                      as="p"
                      style={{ maxWidth: "75%", fontSize: fluidUnit(20, 12) }}
                    >
                      Send money instantly to friends and family in other
                      countries—no middlemen, no delays.
                    </Typography>
                  </div>
                </Link>
                <Link href={"/manage-your-wallet"} style={{ flex: 1 }}>
                  <div style={{ marginLeft: "-15%" }}>
                    <Image
                      src="/Image 124.png"
                      alt="Social by design"
                      width={476}
                      height={386}
                      unoptimized={true}
                      style={{ width: "100%", height: "auto" }}
                    />
                    <Typography
                      as="h4"
                      font="Instrument Sans"
                      weight={400}
                      style={{
                        marginTop: vars.space.lg,
                        fontSize: fluidUnit(30, 18),
                        paddingRight: "10%",
                      }}
                    >
                      Global Bill Pay
                    </Typography>
                    <Typography
                      as="p"
                      style={{ maxWidth: "75%", fontSize: fluidUnit(20, 12) }}
                    >
                      Pay for utilities, phone service, or subscriptions across
                      borders using one simple interface.
                    </Typography>
                  </div>
                </Link>
              </div>
            </Container>
          </section>

          {/* Feature Section: Borderless payments for all */}
          <section
            style={{
              padding: "24px 0",
              marginTop: vars.space["4xl"],
              marginBottom: vars.space["4xl"],
            }}
          >
            <Container
              size="xl"
              style={{ paddingRight: "48px", paddingLeft: "48px" }}
            >
              <Stack gap="sm">
                <Typography
                  as="h1"
                  font="Space Grotesk"
                  weight={400}
                  style={{ fontSize: fluidUnit(80), lineHeight: "91%" }}
                >
                  Use everywhere you use <br /> Visa & Mastercard.
                </Typography>
                <Grid
                  minColWidth={320}
                  gap="xl"
                  style={{
                    alignItems: "center",
                    gridTemplateColumns: "1fr 1fr",
                  }}
                >
                  <div
                    style={{
                      minWidth: fluidUnit(569),
                      aspectRatio: "569/458",
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    <Image
                      unoptimized
                      src="/visa.PNG"
                      alt="Cross-border payments"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ maxWidth: "80%" }}>
                    <Typography
                      as="h2"
                      font="Instrument Sans"
                      weight={400}
                      style={{ fontSize: fluidUnit(40) }}
                    >
                      Accepted wherever life takes you
                    </Typography>
                    <Typography as="p" style={{ fontSize: fluidUnit(20) }}>
                      VaultPay is partnered with Mastercard® and Visa®, so your
                      card works almost everywhere. From local shops to global
                      retailers, restaurants to ride-shares, you can pay with
                      confidence knowing VaultPay is accepted anywhere Visa and
                      Mastercard are. One card, borderless access.{" "}
                    </Typography>
                    <Link href={"/borderless-transfers"}>
                      <Button
                        style={{
                          marginTop: fluidUnit(16),
                          padding: `${fluidUnit(16, 8)} ${fluidUnit(16, 8)}`,
                        }}
                        variant="secondary"
                        size="large"
                        textStyle={{ fontSize: fluidUnit(20, 12) }}
                        label="Learn more"
                      />
                    </Link>
                  </div>
                </Grid>
              </Stack>
            </Container>
          </section>

          <BenefitsSection />
          <SimpleSecureSocial />
          <SecurityTrustSection />
          <TestimonialsSection />
          <BottomCallToActionBanner />
        </Stack>
      </Container>
      <Footer />
    </>
  );
}
