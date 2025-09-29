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

const BenefitsSection: React.FC = () => {
  const items: Array<{
    title: string;
    text: string;
    iconSrc?: string;
  }> = [
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
      text: "Send, spend, and organize bills all in one place.",
      iconSrc: "/dollar_icon.png",
    },
  ];
  return (
    <section style={{ padding: "24px 0", minHeight: "100vh" }}>
      <Container
        size="lg"
        style={{ paddingLeft: "64px", paddingRight: "64px" }}
      >
        <Grid minColWidth={360} style={{ alignItems: "center", columnGap: 60 }}>
          {/* Left: Title + rows */}
          <div
            style={{
              height: "100%",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography
              as="h1"
              font="Space Grotesk"
              weight={400}
              style={{ fontSize: 64 }}
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
                    rowGap: 10,
                    // maxWidth: "75%",
                  }}
                >
                  <div
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: 18,
                      background: "#000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: "0 0 auto",
                    }}
                  >
                    {iconSrc ? (
                      <Image src={iconSrc} alt={title} width={48} height={48} />
                    ) : (
                      <svg
                        width="48"
                        height="48"
                        viewBox="0 0 48 48"
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
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "36px",
                      gap: 12,
                      padding: "8px 0 ",
                    }}
                  >
                    <Typography
                      font="Instrument Sans"
                      as="h5"
                      style={{ margin: 0, fontWeight: 400, fontSize: 32 }}
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
                        fontSize: "24px",
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
          <div>
            <div
              style={{
                position: "relative",
                width: "100%",
                // height: "min(60vw, 653px)",
              }}
            >
              {/* Decorative shape (behind), bottom-right */}
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  right: -16,
                  bottom: 16,
                  width: 300,
                  height: 200,
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              >
                <Image
                  src="/decorative_vector_shape_1.png"
                  alt="decorative shape"
                  width={463}
                  height={238}
                />
              </div>

              {/* Image box (on top) */}
              <div
                style={{
                  position: "relative",
                  alignSelf: "center",
                  textAlign: "center",
                  width: "100%",
                  height: "100%",
                  borderRadius: 12,
                  overflow: "hidden",
                  zIndex: 1,
                }}
              >
                <Image
                  src="/image 100.png"
                  alt="VaultPay preview"
                  width={458 / 1.2}
                  height={653 / 1.2}
                />
              </div>
            </div>
          </div>
        </Grid>
      </Container>
    </section>
  );
};

const CallToActionSection: React.FC = () => {
  return (
    <section style={{ padding: "64px 0" }}>
      <Container
        size="full"
        style={{ paddingRight: vars.space.xl, paddingLeft: vars.space.xl }}
      >
        <Stack gap="md">
          <Typography
            as="h4"
            font="Space Grotesk"
            weight={400}
            style={{ marginLeft: "48px" }}
          >
            Move Money Freely. Globally. Securely.
          </Typography>
          <Typography
            as="h1"
            font="Instrument Sans"
            weight={400}
            style={{ marginLeft: "48px" }}
          >
            Join thousands of users building <br /> better financial lives with{" "}
            <br />
            VaultPay.
          </Typography>

          {/* Image with overlay content */}
          <div
            style={{
              position: "relative",
              width: "100%",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <Image
              src="/image 96.png"
              alt="VaultPay devices"
              width={1200}
              height={560}
              style={{ width: "100%", height: "auto" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  textAlign: "center",
                  color: "#fff",
                }}
              >
                <Image
                  src="/vault_logo_icon_white.png"
                  alt="VaultPay"
                  width={69}
                  height={69}
                />
                <Typography
                  as="h1"
                  font="Space Grotesk"
                  style={{ color: "#fff", fontWeight: 400, fontSize: 96 }}
                >
                  Start your vault
                </Typography>
                <Button
                  variant="colored"
                  size="large"
                  backgroundColor={vars.color.neonMint}
                >
                  <Typography
                    as="span"
                    style={{ margin: 0, fontWeight: 400, fontSize: "26px" }}
                  >
                    Download The App
                  </Typography>
                </Button>
              </div>
            </div>
          </div>
        </Stack>
      </Container>
    </section>
  );
};

const TestimonialsSection: React.FC = () => {
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
      size="xl"
      style={{
        padding: vars.space.xl,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <section
        style={{
          padding: "80px 0",
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
            <Grid minColWidth={220} gap="lg" style={{ alignItems: "stretch" }}>
              {testimonials.map(({ text, name, avatar }) => (
                <div
                  key={name}
                  style={{
                    borderRadius: 16,
                    padding: 24,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    height: "100%",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <Typography as="h4" style={{ fontWeight: 400, fontSize: 32 }}>
                    {text}
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      marginTop: "auto",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <div
                        style={{
                          width: 112,
                          height: 112,
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
                        fontSize: 20,
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
      <Container size="full">
        <Grid
          minColWidth={300}
          gap="lg"
          style={{
            alignItems: "stretch",
            gridTemplateColumns: "2fr 1fr",
            gap: vars.space.lg,
            padding: vars.space.lg,
            paddingBottom: 0,
          }}
        >
          <div>
            <Typography
              as="h1"
              font="Space Grotesk"
              style={{
                fontSize: 96,
                fontWeight: 400,
                lineHeight: "91%",
                letterSpacing: "-2%",
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
            <Typography as="p" style={{ fontSize: 20 }}>
              VaultPay is your borderless social wallet—pay, transfer, and save
              across currencies with ease, community, and control
            </Typography>
            <div>
              <Button
                variant="colored"
                size="medium"
                backgroundColor={vars.color.neonMint}
              >
                <Typography as="span" margin={0} style={{ fontSize: 20 }}>
                  Start for Free
                </Typography>
              </Button>
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
            overflow: "hidden",
          }}
        >
          <Image
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
                src="/google_play_badge.png"
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
                src="/app_store_badge.png"
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
    <section
      style={{
        padding: "4rem 0",
        paddingTop: "5rem",
        backgroundImage: "url('/gray_bg_shape.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "-8rem bottom",
        backgroundSize: "auto 100%",
        minHeight: "100vh",
      }}
    >
      <Container size="lg">
        <Grid minColWidth={360} gap="lg" style={{ alignItems: "center" }}>
          {/* Left column */}
          <div>
            <Stack gap="sm">
              <Typography as="h6" font="Space Grotesk" weight={400}>
                SECURITY & TRUST
              </Typography>
              <Typography
                as="h1"
                font="Instrument Sans"
                weight={400}
                style={{ marginBottom: vars.space.xl }}
              >
                The safe, speedy & secure borderless payment app.{" "}
              </Typography>
              <Typography
                as="p"
                style={{ marginTop: vars.space.xl, maxWidth: "70%" }}
              >
                End-to-End Encryption – Your data is encrypted at every step.
                <br />
                <br />
                PCI-DSS Compliant – We never store sensitive info directly.
                <br />
                <br />
                Fraud Monitoring – AI-powered systems flag and prevent risk.
              </Typography>
              <div style={{ marginTop: vars.space.md }}>
                <Button
                  variant="secondary"
                  size="medium"
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid black",
                    boxShadow: "none",
                    width: "9rem",
                  }}
                >
                  <Typography
                    as="span"
                    style={{ fontSize: "12px" }}
                    weight={400}
                  >
                    {" "}
                    Learn more
                  </Typography>
                </Button>
              </div>
            </Stack>
          </div>
          {/* Right column */}
          <div>
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "min(60vw, 360px)",
                borderRadius: 12,
              }}
            >
              <Image
                src="/image1044.png"
                alt="Security illustration"
                width={609}
                height={649}
              />
            </div>
          </div>
        </Grid>
      </Container>
    </section>
  );
};

const SimpleSecureSocial: React.FC = () => {
  type SSSItem = { title: string; text: string; iconSrc?: string };
  const leftItems: SSSItem[] = [
    {
      title: "Wallet",
      text: "Store, send, convert, and protect your money in seconds.",
      iconSrc: "/signup_icon.png",
    },
    {
      title: "Bills",
      text: "Organize recurring payments and never miss a due date.",
      iconSrc: "/drop_icon.png",
    },
  ];
  const rightItems: SSSItem[] = [
    {
      title: "Send international",
      text: "Organize recurring payments and never miss a due date.",
      iconSrc: "/globe_icon.png",
    },
    {
      title: "Social Payments",
      text: "Share, split, and interact with money like never before.",
      iconSrc: "/friend_icon.png",
    },
  ];

  const Card = ({
    title,
    text,
    iconSrc,
  }: {
    title: string;
    text: string;
    iconSrc?: string;
  }) => (
    <div
      style={{
        background: vars.gradients.vpGradient,
        borderRadius: 16,
        padding: 16,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        aspectRatio: "1/1",
        gap: 8,
        maxWidth: "30vw",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 8,
          background: "#000",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {iconSrc ? (
          <Image src={iconSrc} alt={title} width={22} height={22} />
        ) : (
          <svg
            width="22"
            height="22"
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
          gap: 4,
        }}
      >
        <Typography as="h4" font="Instrument Sans" weight={400}>
          {title}
        </Typography>
        <Typography font="Instrument Sans" as="p">
          {text}
        </Typography>
      </div>
    </div>
  );

  return (
    <section style={{ padding: "24px 0", minHeight: "90vh" }}>
      <Container size="xl">
        <Stack gap="sm">
          <Typography as="h2" font="Space Grotesk" weight={400}>
            Simple, Secure, Social
          </Typography>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.5fr 1fr",
              gap: 16,
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
                gap: 16,
              }}
            >
              {leftItems.map((it) => (
                <Card
                  key={it.title}
                  title={it.title}
                  text={it.text}
                  iconSrc={it.iconSrc}
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
                gap: 16,
              }}
            >
              {rightItems.map((it) => (
                <Card
                  key={it.title}
                  title={it.title}
                  text={it.text}
                  iconSrc={it.iconSrc}
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
            <Container size="lg">
              <Stack gap="sm">
                <Typography
                  as="h1"
                  font="Space Grotesk"
                  weight={400}
                  style={{ fontSize: "80px" }}
                >
                  Borderless <br /> payments for all
                </Typography>
                <Grid
                  minColWidth={320}
                  gap="lg"
                  style={{ alignItems: "center" }}
                >
                  <div>
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
                    }}
                  >
                    <Typography
                      as="h2"
                      font="Instrument Sans"
                      weight={400}
                      style={{ fontSize: "40px" }}
                    >
                      Built for a World <br /> Without Limits
                    </Typography>
                    <Typography as="p" style={{ fontSize: "20px" }}>
                      VaultPay lets you send, receive, and manage money across
                      countries, currencies, and communities—without the usual
                      friction. Whether you're supporting family, traveling, or
                      building your business, we make it feel effortless.
                    </Typography>
                    <Button
                      variant="secondary"
                      size="medium"
                      label="Learn more"
                    />
                  </div>
                </Grid>
              </Stack>
            </Container>
          </section>

          {/* Feature Grid: image on top, title and subtitle */}
          <section style={{ padding: "24px" }}>
            <Container size="full">
              <Grid minColWidth={220} gap="xl" style={{ alignItems: "start" }}>
                <div>
                  <Image
                    src="/Image 104.png"
                    alt="Fast transfers"
                    width={476}
                    unoptimized={true}
                    height={386}
                  />
                  <Typography
                    as="h4"
                    font="Instrument Sans"
                    weight={400}
                    style={{ marginTop: vars.space.lg }}
                  >
                    Multi-Currency Wallet
                  </Typography>
                  <Typography
                    as="p"
                    style={{ maxWidth: "75%", fontSize: "16px" }}
                  >
                    Hold and convert money across currencies with real-time FX
                    rates and no hidden fees.
                  </Typography>
                </div>
                <div>
                  <Image
                    src="/Image 123.png"
                    alt="Multi-currency wallet"
                    width={476}
                    unoptimized={true}
                    height={386}
                  />
                  <Typography
                    as="h4"
                    font="Instrument Sans"
                    weight={400}
                    style={{ marginTop: vars.space.lg }}
                  >
                    Cross-Border Transfers{" "}
                  </Typography>
                  <Typography
                    as="p"
                    style={{ maxWidth: "75%", fontSize: "16px" }}
                  >
                    Send money instantly to friends and family in other
                    countries—no middlemen, no delays.
                  </Typography>
                </div>
                <div>
                  <Image
                    src="/Image 124.png"
                    alt="Social by design"
                    width={476}
                    height={386}
                    unoptimized={true}
                  />
                  <Typography
                    as="h4"
                    font="Instrument Sans"
                    weight={400}
                    style={{ marginTop: vars.space.lg }}
                  >
                    Global Bill Pay
                  </Typography>
                  <Typography
                    as="p"
                    style={{ maxWidth: "75%", fontSize: "16px" }}
                  >
                    Pay for utilities, phone service, or subscriptions across
                    borders using one simple interface.
                  </Typography>
                </div>
              </Grid>
            </Container>
          </section>

          {/* Feature Section: Borderless payments for all */}
          <section style={{ padding: "24px 0" }}>
            <Container
              size="lg"
              style={{ paddingRight: "48px", paddingLeft: "48px" }}
            >
              <Stack gap="sm">
                <Typography as="h1" font="Space Grotesk" weight={400}>
                  Use everywhere you use <br /> Visa & Mastercard.
                </Typography>
                <Grid
                  minColWidth={320}
                  gap="xl"
                  style={{ alignItems: "center" }}
                >
                  <div>
                    <Image
                      src="/visa.PNG"
                      alt="Cross-border payments"
                      width={569}
                      height={458}
                    />
                  </div>
                  <div style={{ maxWidth: "80%" }}>
                    <Typography as="h2" font="Instrument Sans" weight={400}>
                      Accepted wherever life takes you
                    </Typography>
                    <Typography as="p">
                      VaultPay is partnered with Mastercard® and Visa®, so your
                      card works almost everywhere. From local shops to global
                      retailers, restaurants to ride-shares, you can pay with
                      confidence knowing VaultPay is accepted anywhere Visa and
                      Mastercard are. One card, borderless access.{" "}
                    </Typography>
                    <Button
                      variant="secondary"
                      size="medium"
                      label="Learn more"
                    />
                  </div>
                </Grid>
              </Stack>
            </Container>
          </section>

          <BenefitsSection />
          <SimpleSecureSocial />
          <SecurityTrustSection />
          <TestimonialsSection />
          <CallToActionSection />
        </Stack>
      </Container>
      <Footer />
    </>
  );
}
