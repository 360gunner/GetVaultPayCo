import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { vars } from "@/styles/theme.css";
import Container from "@/components/Layout/Container";
import Typography from "@/components/Typography/Typography";
import { fluidUnit } from "@/styles/fluid-unit";
import { AppLink } from "@/components/Link/AppLink";

const sitemapSections = [
  {
    title: "Personal",
    links: [
      { label: "Send & Receive", href: "/send-and-receive" },
      { label: "Pay Online", href: "/pay-online" },
      { label: "Pay In Store", href: "/pay-in-store" },
      { label: "VaultPay Cards", href: "/cards" },
      { label: "Ways to Pay", href: "/ways-to-pay" },
      { label: "Manage Your Wallet", href: "/manage-your-wallet" },
      { label: "Borderless Transfers", href: "/borderless-transfers" },
      { label: "Social", href: "/social" },
    ],
  },
  {
    title: "Business",
    links: [
      { label: "Business Overview", href: "/business-overview" },
      { label: "Business Online", href: "/business-online" },
      { label: "Business In Store", href: "/business-in-store" },
      { label: "Advantages", href: "/advantages" },
    ],
  },
  {
    title: "Features & Security",
    links: [
      { label: "Features", href: "/features" },
      { label: "Security & Protection", href: "/security-and-protection" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Jobs", href: "/jobs" },
      { label: "Partners", href: "/partners" },
      { label: "Developers", href: "/developers" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Fees & Pricing", href: "/fees-pricing" },
      { label: "Help Center", href: "/help-center" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
  {
    title: "Get Started",
    links: [
      { label: "Sign Up", href: "/signup" },
      { label: "Sign In", href: "/signin" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <>
      <Navbar />
      <section style={{ padding: `${fluidUnit(80)} ${fluidUnit(24)}`, background: vars.color.vaultNavie }}>
        <Container size="lg">
          <Typography
            as="h1"
            style={{
              fontSize: fluidUnit(56),
              fontWeight: 700,
              textAlign: "center",
              marginBottom: fluidUnit(24),
              color: vars.color.neonMint,
            }}
          >
            Site Map
          </Typography>
          <Typography
            as="p"
            style={{
              fontSize: fluidUnit(18),
              textAlign: "center",
              color: vars.color.vaultWhite,
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            Everything VaultPay has to offer, organized and easy to find.
          </Typography>
        </Container>
      </section>

      <section style={{ padding: `${fluidUnit(80)} 0` }}>
        <Container size="lg">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: fluidUnit(48),
            }}
          >
            {sitemapSections.map((section, index) => (
              <div key={index}>
                <Typography
                  as="h2"
                  style={{
                    fontSize: fluidUnit(24),
                    fontWeight: 700,
                    marginBottom: fluidUnit(24),
                    color: vars.color.vaultBlack,
                    borderBottom: `2px solid ${vars.color.neonMint}`,
                    paddingBottom: fluidUnit(12),
                  }}
                >
                  {section.title}
                </Typography>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: fluidUnit(12),
                  }}
                >
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <AppLink
                        href={link.href}
                        style={{
                          fontSize: fluidUnit(16),
                          color: vars.color.muted,
                          textDecoration: "none",
                          transition: "color 0.2s ease",
                        }}
                      >
                        → {link.label}
                      </AppLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section style={{ padding: `${fluidUnit(80)} 0`, background: vars.color.cloudSilver }}>
        <Container size="md">
          <div style={{ textAlign: "center" }}>
            <Typography
              as="h2"
              style={{
                fontSize: fluidUnit(32),
                fontWeight: 700,
                marginBottom: fluidUnit(16),
                color: vars.color.vaultBlack,
              }}
            >
              Can't find what you're looking for?
            </Typography>
            <Typography
              as="p"
              style={{
                fontSize: fluidUnit(18),
                color: vars.color.muted,
                marginBottom: fluidUnit(32),
              }}
            >
              Visit our Help Center or contact our support team for assistance.
            </Typography>
            <div style={{ display: "flex", gap: fluidUnit(16), justifyContent: "center", flexWrap: "wrap" }}>
              <AppLink
                href="/help-center"
                variant="button"
                style={{
                  padding: `${fluidUnit(14)} ${fluidUnit(28)}`,
                }}
              >
                Help Center
              </AppLink>
              <AppLink
                href="/contact"
                variant="button"
                style={{
                  padding: `${fluidUnit(14)} ${fluidUnit(28)}`,
                }}
              >
                Contact Us
              </AppLink>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
