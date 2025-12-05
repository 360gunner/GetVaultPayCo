import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import SplitHero from "@/components/sections/SplitHero";
import { vars } from "@/styles/theme.css";
import Container from "@/components/Layout/Container";
import Typography from "@/components/Typography/Typography";
import { fluidUnit } from "@/styles/fluid-unit";
import BottomCallToActionBanner from "@/components/sections/BottomCallToActionBanner";
import ImageLeftEyebrowRightSection from "@/components/sections/ImageLeftEyebrowRightSection";

export default function PartnersPage() {
  return (
    <>
      <Navbar />
      <SplitHero
        eyebrow="PARTNERS"
        title="Grow your business with VaultPay"
        description="Join thousands of merchants, platforms, and financial institutions partnering with VaultPay to offer seamless payment experiences. From e-commerce integrations to banking partnerships, we're building the future of payments together."
        buttonLabel="Become a Partner"
        buttonVariant="secondary"
        buttonHref="/signup"
        imageSrc="/retail-store-partner.jpg"
        imageAlt="VaultPay Partners"
        containerSize="2xl"
        gridTemplateColumns="1fr 1fr"
        containerStyle={{ padding: `${vars.space.xl} ${vars.space["4xl"]}` }}
        imageWidth={850}
        imageHeight={650}
        minColWidth={360}
      />

      <section style={{ padding: `${fluidUnit(80)} 0` }}>
        <Container size="lg">
          <Typography
            as="h2"
            style={{
              fontSize: fluidUnit(48),
              fontWeight: 700,
              textAlign: "center",
              marginBottom: fluidUnit(64),
              color: vars.color.vaultBlack,
            }}
          >
            Partnership Programs
          </Typography>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: fluidUnit(32),
            }}
          >
            {[
              {
                icon: "🛒",
                title: "E-commerce Platforms",
                description: "Integrate VaultPay into your platform and offer your merchants low fees, instant settlements, and access to millions of customers. Perfect for Shopify, WooCommerce, and custom platforms.",
                benefits: ["Easy API integration", "Dedicated support", "Revenue sharing"],
              },
              {
                icon: "🏦",
                title: "Financial Institutions",
                description: "Join the MIPS network for instant settlement worldwide in local currency. Partner with VaultPay to offer cutting-edge digital payment solutions to your customers. White-label options available for banks and credit unions looking to modernize their services with global payment infrastructure.",
                benefits: ["MIPS network access", "Instant global settlement", "Local currency support", "White-label solutions"],
              },
              {
                icon: "🤝",
                title: "Strategic Partners",
                description: "Build innovative payment experiences with VaultPay's technology. From fintech startups to enterprise solutions, we provide the infrastructure you need to succeed.",
                benefits: ["API access", "Co-marketing", "Technical support"],
              },
            ].map((program, index) => (
              <div
                key={index}
                style={{
                  background: index === 1 ? vars.color.neonMint : vars.color.vaultWhite,
                  border: `2px solid ${vars.color.vaultBlack}`,
                  borderRadius: fluidUnit(16),
                  padding: fluidUnit(40),
                }}
              >
                <div style={{ fontSize: fluidUnit(56), marginBottom: fluidUnit(20) }}>
                  {program.icon}
                </div>
                <Typography
                  as="h3"
                  style={{
                    fontSize: fluidUnit(28),
                    fontWeight: 700,
                    marginBottom: fluidUnit(16),
                    color: vars.color.vaultBlack,
                  }}
                >
                  {program.title}
                </Typography>
                <Typography
                  as="p"
                  style={{
                    fontSize: fluidUnit(16),
                    color: vars.color.muted,
                    marginBottom: fluidUnit(24),
                    lineHeight: 1.6,
                  }}
                >
                  {program.description}
                </Typography>
                <div style={{ marginTop: fluidUnit(20) }}>
                  <Typography
                    as="p"
                    style={{
                      fontSize: fluidUnit(14),
                      fontWeight: 700,
                      marginBottom: fluidUnit(12),
                      color: vars.color.vaultBlack,
                    }}
                  >
                    Key Benefits:
                  </Typography>
                  <ul style={{ margin: 0, paddingLeft: fluidUnit(20) }}>
                    {program.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        style={{
                          fontSize: fluidUnit(14),
                          color: vars.color.muted,
                          marginBottom: fluidUnit(8),
                        }}
                      >
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <ImageLeftEyebrowRightSection
        variant="ltr"
        containerSize="lg"
        sectionPadding={`${vars.space.xl} ${vars.space["4xl"]}`}
        image={{
          src: "/image 95_1.png",
          alt: "Partner Success",
          width: 569,
          height: 458,
        }}
        eyebrow="SUCCESS STORIES"
        title="Trusted by industry leaders"
        text="Our partners see an average 35% increase in conversion rates and 50% reduction in payment processing costs. Join successful businesses already leveraging VaultPay's technology to grow their revenue and improve customer experience."
      />

      <section style={{ padding: `${fluidUnit(80)} 0`, background: vars.color.cloudSilver }}>
        <Container size="lg">
          <Typography
            as="h2"
            style={{
              fontSize: fluidUnit(48),
              fontWeight: 700,
              textAlign: "center",
              marginBottom: fluidUnit(32),
              color: vars.color.vaultBlack,
            }}
          >
            Why Partner with VaultPay?
          </Typography>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: fluidUnit(32),
              marginTop: fluidUnit(48),
            }}
          >
            {[
              {
                title: "Low Transaction Fees",
                value: "1.5%",
                description: "Industry-leading rates",
              },
              {
                title: "Global Reach",
                value: "200+",
                description: "Countries supported",
              },
              {
                title: "Active Users",
                value: "2M+",
                description: "And growing daily",
              },
              {
                title: "API Uptime",
                value: "99.9%",
                description: "Reliable infrastructure",
              },
            ].map((stat, index) => (
              <div
                key={index}
                style={{
                  background: vars.color.vaultWhite,
                  borderRadius: fluidUnit(12),
                  padding: fluidUnit(32),
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: fluidUnit(56),
                    fontWeight: 700,
                    color: vars.color.neonMint,
                    marginBottom: fluidUnit(8),
                  }}
                >
                  {stat.value}
                </div>
                <Typography
                  as="h3"
                  style={{
                    fontSize: fluidUnit(20),
                    fontWeight: 700,
                    marginBottom: fluidUnit(8),
                    color: vars.color.vaultBlack,
                  }}
                >
                  {stat.title}
                </Typography>
                <Typography
                  as="p"
                  style={{
                    fontSize: fluidUnit(14),
                    color: vars.color.muted,
                    margin: 0,
                  }}
                >
                  {stat.description}
                </Typography>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <BottomCallToActionBanner />
      <Footer />
    </>
  );
}
