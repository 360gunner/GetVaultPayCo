import React from "react";
import Container from "@/components/Layout/Container";
import Grid from "@/components/Layout/Grid";
import Stack from "@/components/Layout/Stack";
import Typography from "@/components/Typography/Typography";
import Button from "@/components/Button/Button";
import Image from "next/image";
import { vars } from "@/styles/theme.css";

export interface SecurityTrustProps {
  eyebrow?: string;
  title?: string;
  body?: React.ReactNode; // Use \n\n to insert paragraph breaks like homepage
  buttonLabel?: string;
  imageSrc: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
}

const GrayShapeBackgroundGridSection: React.FC<SecurityTrustProps> = ({
  eyebrow = "SECURITY & TRUST",
  title = "The safe, speedy & secure borderless payment app.",
  body = "End-to-End Encryption – Your data is encrypted at every step.\n\nPCI-DSS Compliant – We never store sensitive info directly.\n\nFraud Monitoring – AI-powered systems flag and prevent risk.",
  buttonLabel = "Learn more",
  imageSrc,
  imageAlt = "Security illustration",
  imageWidth = 609,
  imageHeight = 649,
}) => {
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
                {eyebrow}
              </Typography>
              <Typography
                as="h1"
                font="Instrument Sans"
                weight={400}
                style={{ marginBottom: vars.space.xl }}
              >
                {title}
              </Typography>
              {typeof body === "string" ? (
                <Typography
                  as="p"
                  style={{ marginTop: vars.space.xl, maxWidth: "70%" }}
                >
                  {body}
                </Typography>
              ) : (
                body
              )}
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
                    {buttonLabel}
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
                src={imageSrc}
                alt={imageAlt}
                width={imageWidth}
                height={imageHeight}
              />
            </div>
          </div>
        </Grid>
      </Container>
    </section>
  );
};

export default GrayShapeBackgroundGridSection;
