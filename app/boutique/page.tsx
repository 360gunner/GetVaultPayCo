"use client";
import Container from "@/components/Layout/Container";
import Typography from "@/components/Typography/Typography";
import { vars } from "@/styles/theme.css";
import { fluidUnit } from "@/styles/fluid-unit";

export default function BoutiquePage() {
  return (
    <>
      <div style={{ minHeight: '100vh', background: vars.color.vaultBlack }}>
        <Container>
          <div style={{
            padding: `${fluidUnit(40)} 0`,
            textAlign: 'center'
          }}>
            <Typography
              variant="h1"
              style={{
                color: vars.color.neonMint,
                marginBottom: fluidUnit(20),
                fontSize: fluidUnit(48)
              }}
            >
              🏪 Digital Boutique Dashboard
            </Typography>
            <Typography
              variant="h3"
              style={{
                color: vars.color.vaultWhite,
                marginBottom: fluidUnit(40),
                fontSize: fluidUnit(24)
              }}
            >
              Manage your digital store products and orders
            </Typography>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: fluidUnit(16),
            padding: fluidUnit(32),
            border: `2px solid ${vars.color.neonMint}`,
            minHeight: '800px'
          }}>
            <iframe
              src="https://vaultpay.shop/dashboard/"
              style={{
                width: '100%',
                height: '100%',
                minHeight: '700px',
                border: 'none',
                borderRadius: fluidUnit(12)
              }}
              title="Dokan Dashboard"
              allow="fullscreen"
            />
          </div>
        </Container>
      </div>
    </>
  );
}
