import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { vars } from "@/styles/theme.css";
import Container from "@/components/Layout/Container";
import Typography from "@/components/Typography/Typography";
import BottomCallToActionBanner from "@/components/sections/BottomCallToActionBanner";
import ImageLeftEyebrowRightSection from "@/components/sections/ImageLeftEyebrowRightSection";
import BigImageOverlaySection from "@/components/sections/BigImageOverlaySection";
import { fluidUnit } from "@/styles/fluid-unit";
import FeatureFlexSection from "@/components/sections/FeatureFlexSection";
import Button from "@/components/Button/Button";
import Link from "next/link";
import Image from "next/image";

export default function SocialCommercePage() {
  return (
    <>
      <Navbar />
      <BigImageOverlaySection
        image={{
          src: "/social_page_hero_image.png",
          alt: "Social Commerce Hero Image",
        }}
        containerSize="2xl"
        sectionPadding={`${vars.space.xl} ${fluidUnit(24)}`}
        eyebrow="SOCIAL COMMERCE"
        title="Go Live. Sell Live. Get Paid Live."
        text="Transform your passion into profit with VaultPay's revolutionary social commerce platform. Go live, showcase your products, and let your supporters vault coins directly to you — converted to real money instantly."
        buttonLabel="Start Selling"
        buttonHref="/signup"
        aspectRatio="1360 / 784"
        fullBleed={false}
      />

      {/* Main Feature Section */}
      <Container
        size="full"
        style={{
          paddingTop: vars.space["4xl"],
          paddingLeft: fluidUnit(24),
          paddingRight: fluidUnit(24),
        }}
      >
        <Typography
          as="h1"
          font="Space Grotesk"
          weight={400}
          style={{
            fontSize: fluidUnit(60, 36),
            lineHeight: "100%",
            letterSpacing: "-0.58px",
            maxWidth: "800px",
          }}
        >
          The Future of Live Commerce is Here
        </Typography>
        <Typography
          as="p"
          style={{
            fontSize: fluidUnit(20, 16),
            marginTop: vars.space.lg,
            maxWidth: "700px",
            color: vars.color.slateGray,
          }}
        >
          Whether you&apos;re a creator, entrepreneur, or collector — VaultPay Social Commerce 
          lets you buy and sell products through immersive live streams. Your audience 
          becomes your marketplace.
        </Typography>
      </Container>

      {/* Buy or Sell Section */}
      <Container
        size="full"
        style={{
          padding: `${vars.space["xxl"]} ${fluidUnit(24)}`,
          display: "flex",
          gap: vars.space.xl,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* Buyer Card */}
        <div
          style={{
            flex: "1 1 400px",
            maxWidth: "560px",
            background: vars.color.vaultBlack,
            borderRadius: "24px",
            padding: fluidUnit(40, 24),
            color: vars.color.vaultWhite,
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "8px 16px",
              background: vars.color.vpGreen,
              borderRadius: "100px",
              marginBottom: vars.space.lg,
            }}
          >
            <Typography as="span" weight={600} style={{ fontSize: 14, color: vars.color.vaultBlack }}>
              I&apos;M A BUYER
            </Typography>
          </div>
          <Typography
            as="h2"
            font="Space Grotesk"
            weight={400}
            style={{ fontSize: fluidUnit(40, 28), marginBottom: vars.space.md, color: vars.color.vaultWhite }}
          >
            Discover & Support Live
          </Typography>
          <Typography as="p" style={{ fontSize: 16, color: vars.color.slateGray, marginBottom: vars.space.lg }}>
            Watch creators showcase products in real-time. Send coins to support your favorites 
            and help them reach their goals. Every coin you send converts to real money instantly.
          </Typography>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Watch live product showcases",
              "Send Vault Coins to support creators",
              "Get exclusive deals during live streams",
              "Chat and interact in real-time",
              "First access to limited drops",
            ].map((item, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                  fontSize: 15,
                }}
              >
                <span style={{ color: vars.color.vpGreen }}>✓</span>
                {item}
              </li>
            ))}
          </ul>
          <Link href="/signup">
            <Button
              variant="colored"
              size="large"
              backgroundColor={vars.color.vpGreen}
              style={{ marginTop: vars.space.lg, width: "100%" }}
            >
              <Typography as="span" style={{ color: vars.color.vaultBlack, fontWeight: 500 }}>
                Start Watching
              </Typography>
            </Button>
          </Link>
        </div>

        {/* Seller Card */}
        <div
          style={{
            flex: "1 1 400px",
            maxWidth: "560px",
            background: `linear-gradient(135deg, ${vars.color.vpGreen} 0%, ${vars.color.neonMint} 100%)`,
            borderRadius: "24px",
            padding: fluidUnit(40, 24),
            color: vars.color.vaultBlack,
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "8px 16px",
              background: vars.color.vaultBlack,
              borderRadius: "100px",
              marginBottom: vars.space.lg,
            }}
          >
            <Typography as="span" weight={600} style={{ fontSize: 14, color: vars.color.vaultWhite }}>
              I&apos;M A SELLER
            </Typography>
          </div>
          <Typography
            as="h2"
            font="Space Grotesk"
            weight={400}
            style={{ fontSize: fluidUnit(40, 28), marginBottom: vars.space.md }}
          >
            Go Live & Get Paid
          </Typography>
          <Typography as="p" style={{ fontSize: 16, color: vars.color.vaultBlack, opacity: 0.8, marginBottom: vars.space.lg }}>
            Launch your live stream, showcase your products, and receive Vault Coins from 
            your supporters. Coins convert to cash instantly — no waiting, no hassle.
          </Typography>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Go live with one tap",
              "Showcase unlimited products",
              "Receive Vault Coins instantly",
              "Coins convert to real money",
              "Build your loyal community",
            ].map((item, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                  fontSize: 15,
                }}
              >
                <span>✓</span>
                {item}
              </li>
            ))}
          </ul>
          <Link href="/signup-business">
            <Button
              variant="colored"
              size="large"
              backgroundColor={vars.color.vaultBlack}
              style={{ marginTop: vars.space.lg, width: "100%" }}
            >
              <Typography as="span" style={{ color: vars.color.vaultWhite, fontWeight: 500 }}>
                Start Selling
              </Typography>
            </Button>
          </Link>
        </div>
      </Container>

      {/* Vaulting Feature Section */}
      <Container
        size="full"
        style={{
          background: vars.color.vaultNavie,
          padding: `${vars.space["4xl"]} ${fluidUnit(24)}`,
          marginTop: vars.space["xxl"],
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
          <div
            style={{
              display: "inline-block",
              padding: "8px 20px",
              background: vars.color.vpGreen,
              borderRadius: "100px",
              marginBottom: vars.space.lg,
            }}
          >
            <Typography as="span" weight={600} style={{ fontSize: 14, color: vars.color.vaultBlack }}>
              VAULTING™
            </Typography>
          </div>
          <Typography
            as="h2"
            font="Space Grotesk"
            weight={400}
            style={{
              fontSize: fluidUnit(56, 32),
              color: vars.color.vaultWhite,
              marginBottom: vars.space.lg,
            }}
          >
            Turn Support Into Sales
          </Typography>
          <Typography
            as="p"
            style={{
              fontSize: fluidUnit(20, 16),
              color: vars.color.slateGray,
              marginBottom: vars.space["xxl"],
            }}
          >
            Vaulting is our revolutionary feature that lets your followers send Vault Coins 
            during your live stream. Every coin is instantly converted to real money — 
            helping you raise funds for your products while building a passionate community.
          </Typography>
        </div>

        {/* Vaulting Features Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: vars.space.xl,
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {[
            {
              icon: "🎬",
              title: "Go Live Instantly",
              description: "Start streaming with one tap. Show your products, tell your story, connect with buyers in real-time.",
            },
            {
              icon: "💰",
              title: "Receive Vault Coins",
              description: "Followers send coins to support you. Watch your earnings grow live on screen as your community rallies behind you.",
            },
            {
              icon: "⚡",
              title: "Instant Conversion",
              description: "Coins convert to real money instantly. No waiting periods, no minimum thresholds — your money, your way.",
            },
            {
              icon: "🎯",
              title: "Set Funding Goals",
              description: "Create goals for new products or restocks. Your community can help you hit targets and unlock exclusive items.",
            },
            {
              icon: "🏆",
              title: "Leaderboards & Recognition",
              description: "Top supporters get recognized. Build loyalty with shoutouts, badges, and exclusive perks for your biggest fans.",
            },
            {
              icon: "📊",
              title: "Real-Time Analytics",
              description: "Track viewers, engagement, and earnings live. Understand your audience and optimize your streams.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.05)",
                borderRadius: "16px",
                padding: vars.space.xl,
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: vars.space.md }}>{feature.icon}</div>
              <Typography
                as="h3"
                font="Space Grotesk"
                weight={500}
                style={{ fontSize: 22, color: vars.color.vaultWhite, marginBottom: vars.space.sm }}
              >
                {feature.title}
              </Typography>
              <Typography as="p" style={{ fontSize: 15, color: vars.color.slateGray, lineHeight: 1.6 }}>
                {feature.description}
              </Typography>
            </div>
          ))}
        </div>
      </Container>

      {/* How It Works */}
      <Container
        size="full"
        style={{
          paddingTop: vars.space["4xl"],
          paddingLeft: fluidUnit(24),
          paddingRight: fluidUnit(24),
        }}
      >
        <Typography
          as="h2"
          font="Space Grotesk"
          weight={400}
          style={{
            fontSize: fluidUnit(48, 32),
            textAlign: "center",
            marginBottom: vars.space["xxl"],
          }}
        >
          How Live Commerce Works
        </Typography>
      </Container>

      <FeatureFlexSection
        containerSize="full"
        sectionPadding={fluidUnit(24)}
        columnGap={0}
        minColWidth={280}
        gap="xl"
        items={[
          {
            src: "/Group 1021.svg",
            alt: "Go Live",
            title: "1. Go Live",
            description: "Open the app, tap 'Go Live', and start showcasing your products to your followers instantly.",
          },
          {
            src: "/Group 1022.svg",
            alt: "Engage & Sell",
            title: "2. Engage & Sell",
            description: "Interact with viewers, answer questions, and demonstrate your products in real-time.",
          },
          {
            src: "/Group 1023.svg",
            alt: "Get Vaulted",
            title: "3. Get Vaulted",
            description: "Supporters send Vault Coins to boost your stream. Coins convert to cash instantly in your wallet.",
          },
        ]}
      />

      <ImageLeftEyebrowRightSection
        variant="ltr"
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/Group 1026.svg",
          alt: "Live Stream Feed",
          width: 569,
          height: 458,
        }}
        eyebrow="LIVE FEED"
        title="Your marketplace, always live."
        text="Discover trending live streams, follow your favorite sellers, and never miss a drop. The VaultPay live feed brings you the hottest products from creators and businesses around the world — all in one scrollable, shoppable experience."
      />

      <ImageLeftEyebrowRightSection
        variant="rtl"
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/Group 1028.png",
          alt: "Vault Coins",
          width: 569,
          height: 458,
        }}
        eyebrow="VAULT COINS"
        title="Support that converts."
        text="Vault Coins aren't just virtual currency — they're real support. When followers send coins during your live stream, that money hits your VaultPay wallet instantly. Cash out anytime, or use it to grow your business."
      />

      <ImageLeftEyebrowRightSection
        variant="ltr"
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/image 104_3.png",
          alt: "Community Building",
          width: 569,
          height: 458,
        }}
        eyebrow="COMMUNITY"
        title="Build your tribe."
        text="Social commerce isn't just about transactions — it's about relationships. Build a loyal following, reward your top supporters, and create a community that grows with your brand. Your fans become your partners in success."
      />

      <BottomCallToActionBanner />
      <Footer />
    </>
  );
}
