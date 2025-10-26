import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import SplitHero from "@/components/sections/SplitHero";
import { vars } from "@/styles/theme.css";
import Container from "@/components/Layout/Container";
import Typography from "@/components/Typography/Typography";
import { fluidUnit } from "@/styles/fluid-unit";
import Button from "@/components/Button/Button";

const jobOpenings = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote / San Francisco",
    type: "Full-time",
    description: "Build scalable payment infrastructure and customer-facing features.",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote / New York",
    type: "Full-time",
    description: "Design beautiful, intuitive experiences for millions of users.",
  },
  {
    title: "Security Engineer",
    department: "Security",
    location: "Remote / Los Angeles",
    type: "Full-time",
    description: "Protect user data and build secure payment systems.",
  },
  {
    title: "Customer Success Manager",
    department: "Support",
    location: "Remote",
    type: "Full-time",
    description: "Help our merchant partners succeed and grow their businesses.",
  },
  {
    title: "Data Scientist",
    department: "Data",
    location: "Remote / Sherman Oaks",
    type: "Full-time",
    description: "Build ML models for fraud detection and personalization.",
  },
  {
    title: "Marketing Manager",
    department: "Marketing",
    location: "Remote / San Francisco",
    type: "Full-time",
    description: "Drive growth and build the VaultPay brand globally.",
  },
];

export default function JobsPage() {
  return (
    <>
      <Navbar />
      <SplitHero
        eyebrow="CAREERS"
        title="Join the VaultPay team"
        description="We're building the future of digital payments. Join a team of passionate innovators creating products that millions of people use every day. Work remotely or from our offices in San Francisco, New York, and Los Angeles."
        buttonLabel="View Open Positions"
        buttonVariant="secondary"
        buttonHref="#openings"
        imageSrc="/image 91.png"
        imageAlt="VaultPay Careers"
        containerSize="2xl"
        gridTemplateColumns="1fr 1fr"
        containerStyle={{ padding: `${vars.space.xl} ${vars.space["4xl"]}` }}
        imageWidth={503}
        imageHeight={545}
        minColWidth={360}
      />

      <section style={{ padding: `${fluidUnit(80)} 0`, background: vars.color.cloudSilver }}>
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
            Why Work at VaultPay?
          </Typography>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: fluidUnit(32),
            }}
          >
            {[
              {
                icon: "💰",
                title: "Competitive Salary",
                description: "Top-of-market compensation plus equity in a fast-growing fintech company.",
              },
              {
                icon: "🏥",
                title: "Health & Wellness",
                description: "Comprehensive health, dental, and vision insurance. Mental health support included.",
              },
              {
                icon: "🌴",
                title: "Unlimited PTO",
                description: "Take the time you need to recharge. We trust you to manage your time.",
              },
              {
                icon: "🏠",
                title: "Remote-First",
                description: "Work from anywhere. Flexible hours that fit your lifestyle.",
              },
              {
                icon: "📚",
                title: "Learning Budget",
                description: "$2,000 annual budget for courses, conferences, and books.",
              },
              {
                icon: "⚡",
                title: "Fast Growth",
                description: "Join a rapidly scaling company with real impact on millions of users.",
              },
            ].map((benefit, index) => (
              <div
                key={index}
                style={{
                  background: vars.color.vaultWhite,
                  borderRadius: fluidUnit(16),
                  padding: fluidUnit(32),
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: fluidUnit(56), marginBottom: fluidUnit(16) }}>
                  {benefit.icon}
                </div>
                <Typography
                  as="h3"
                  style={{
                    fontSize: fluidUnit(24),
                    fontWeight: 700,
                    marginBottom: fluidUnit(12),
                    color: vars.color.vaultBlack,
                  }}
                >
                  {benefit.title}
                </Typography>
                <Typography
                  as="p"
                  style={{
                    fontSize: fluidUnit(16),
                    color: vars.color.muted,
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {benefit.description}
                </Typography>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="openings" style={{ padding: `${fluidUnit(80)} 0` }}>
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
            Open Positions
          </Typography>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: fluidUnit(24),
            }}
          >
            {jobOpenings.map((job, index) => (
              <div
                key={index}
                style={{
                  background: vars.color.vaultWhite,
                  border: `2px solid ${vars.color.vaultBlack}`,
                  borderRadius: fluidUnit(12),
                  padding: fluidUnit(32),
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: fluidUnit(24),
                }}
              >
                <div style={{ flex: 1, minWidth: 300 }}>
                  <Typography
                    as="h3"
                    style={{
                      fontSize: fluidUnit(24),
                      fontWeight: 700,
                      marginBottom: fluidUnit(8),
                      color: vars.color.vaultBlack,
                    }}
                  >
                    {job.title}
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      gap: fluidUnit(16),
                      marginBottom: fluidUnit(12),
                      flexWrap: "wrap",
                    }}
                  >
                    <Typography
                      as="span"
                      style={{
                        fontSize: fluidUnit(14),
                        color: vars.color.neonMint,
                        fontWeight: 600,
                      }}
                    >
                      {job.department}
                    </Typography>
                    <Typography
                      as="span"
                      style={{
                        fontSize: fluidUnit(14),
                        color: vars.color.muted,
                      }}
                    >
                      📍 {job.location}
                    </Typography>
                    <Typography
                      as="span"
                      style={{
                        fontSize: fluidUnit(14),
                        color: vars.color.muted,
                      }}
                    >
                      🕐 {job.type}
                    </Typography>
                  </div>
                  <Typography
                    as="p"
                    style={{
                      fontSize: fluidUnit(16),
                      color: vars.color.muted,
                      margin: 0,
                    }}
                  >
                    {job.description}
                  </Typography>
                </div>
                <Button
                  variant="primary"
                  size="medium"
                  label="Apply Now"
                  style={{ minWidth: 140 }}
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section style={{ padding: `${fluidUnit(80)} 0`, background: vars.color.neonMint }}>
        <Container size="md">
          <Typography
            as="h2"
            style={{
              fontSize: fluidUnit(40),
              fontWeight: 700,
              textAlign: "center",
              marginBottom: fluidUnit(24),
              color: vars.color.vaultBlack,
            }}
          >
            Don't see a perfect fit?
          </Typography>
          <Typography
            as="p"
            style={{
              fontSize: fluidUnit(18),
              textAlign: "center",
              color: vars.color.vaultBlack,
              marginBottom: fluidUnit(32),
              lineHeight: 1.6,
            }}
          >
            We're always looking for talented people. Send us your resume and tell us why you'd be a great addition to the VaultPay team.
          </Typography>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="ghost"
              size="large"
              label="Send General Application"
              style={{
                backgroundColor: vars.color.vaultBlack,
                color: vars.color.vaultWhite,
              }}
            />
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
