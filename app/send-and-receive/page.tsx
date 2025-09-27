import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import Container from "@/components/Layout/Container";
import Stack from "@/components/Layout/Stack";
import Typography from "@/components/Typography/Typography";
import Button from "@/components/Button/Button";
import { vars } from "@/styles/theme.css";

export default function SendAndReceivePage() {
  return (
    <>
      <Navbar />
      <Container size="lg" style={{ paddingTop: vars.space.xl, paddingBottom: vars.space.xl }}>
        <Stack gap="md">
          <Typography as="h1" font="Space Grotesk" weight={400}>
            Send & Receive
          </Typography>
          <Typography as="p" style={{ maxWidth: "72ch" }}>
            Move money freely. Globally. Securely. Build better financial lives with borderless
            transfers, real-time FX, and social payments. This page is a placeholder — let me know
            what sections you’d like here and I’ll flesh them out (hero, feature grid, FAQs, CTA, etc.).
          </Typography>
          <div>
            <Button variant="primary" size="medium" label="Get Started" />
          </div>
        </Stack>
      </Container>
      <Footer />
    </>
  );
}
