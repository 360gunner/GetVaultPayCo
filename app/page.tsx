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
import { vars } from "@/styles/theme.css";

export default function Home() {
  return (
    <>
      <Navbar />
      <Container size="lg" style={{ paddingTop: 24, paddingBottom: 48 }}>
        <Stack gap="xl">
          {/* Header */}
          <Stack gap="xs">
            <Typography as="h1" font="Space Grotesk" weight={800}>
              Component Showcase
            </Typography>
            <Typography as="p" color="#666">
              A quick tour of reusable UI building blocks styled with Vanilla
              Extract. Images
            </Typography>
            <Grid columns={3} gap="md">
              <AppImage
                src="/logo_horizontal.png"
                alt="Vault Pay Logo"
                width={203}
                height={41}
                shape="square"
              />
              <AppImage
                src="/image 103.png"
                alt="Person Holding Phone And using Vault App"
                width={229}
                height={326}
                shape="square"
              />
            </Grid>
          </Stack>
        </Stack>

        {/* Cards */}
        <section>
          <Stack gap="sm">
            <Typography as="h2" font="Space Grotesk" weight={700}>
              Cards
            </Typography>
            <Grid minColWidth={260} gap="md">
              <Card
                variant="plain"
                header={
                  <Typography as="h4" font="Space Grotesk">
                    Plain Card
                  </Typography>
                }
              >
                <Typography as="p">Simple container with border.</Typography>
                <AppLink href="/" variant="primary">
                  Learn more
                </AppLink>
              </Card>
              <Card
                variant="elevated"
                header={
                  <Typography as="h4" font="Space Grotesk">
                    Elevated
                  </Typography>
                }
                interactive
              >
                <Typography as="p">Shadow and hover interaction.</Typography>
                <div style={{ marginTop: 8 }}>
                  <Button variant="primary" size="small" label="Action" />
                </div>
              </Card>
              <Card
                variant="outline"
                header={
                  <Typography as="h4" font="Space Grotesk">
                    Outline
                  </Typography>
                }
              >
                <Typography as="p">
                  Outlined style with neutral look.
                </Typography>
              </Card>
            </Grid>
          </Stack>
        </section>

        {/* Accordion */}
        <section>
          <Stack gap="sm">
            <Typography as="h2" font="Space Grotesk" weight={700}>
              Accordion
            </Typography>
            <Accordion
              items={[
                {
                  id: "a",
                  header: <Typography as="h5">What is Vaultpay?</Typography>,
                  content: <Typography as="p">A demo UI kit.</Typography>,
                  defaultOpen: true,
                },
                {
                  id: "b",
                  header: <Typography as="h5">What stack?</Typography>,
                  content: (
                    <Typography as="p">
                      Next.js 15 + Vanilla Extract.
                    </Typography>
                  ),
                },
                {
                  id: "c",
                  header: <Typography as="h5">Is it accessible?</Typography>,
                  content: (
                    <Typography as="p">
                      Built with semantics, can extend ARIA patterns.
                    </Typography>
                  ),
                },
              ]}
            />
          </Stack>
        </section>

        {/* Carousel */}
        <section>
          <Stack gap="sm">
            <Typography as="h2" font="Space Grotesk" weight={700}>
              Carousel
            </Typography>
            <Carousel
              images={[
                { src: "/next.svg", alt: "Next", width: 1200, height: 400 },
                { src: "/vercel.svg", alt: "Vercel", width: 1200, height: 400 },
                { src: "/globe.svg", alt: "Globe", width: 1200, height: 400 },
              ]}
              intervalMs={2500}
              autoPlay
              loop
              showDots
              showArrows
              style={{ borderRadius: 12, overflow: "hidden" }}
            />
          </Stack>
        </section>

        {/* Links */}
        <section>
          <Stack gap="sm">
            <Typography as="h2" font="Space Grotesk" weight={700}>
              Links
            </Typography>
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <AppLink href="/" variant="default">
                Default link
              </AppLink>
              <AppLink href="/" variant="subtle">
                Subtle link
              </AppLink>
              <AppLink href="/" variant="primary">
                Primary link
              </AppLink>
              <AppLink href="/" variant="button">
                Button-style link
              </AppLink>
            </div>
          </Stack>
        </section>
      </Container>
    </>
  );
}
