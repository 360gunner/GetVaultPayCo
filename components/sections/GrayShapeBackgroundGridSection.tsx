import React from "react";
import Container from "@/components/Layout/Container";
import Grid from "@/components/Layout/Grid";
import Stack from "@/components/Layout/Stack";
import Typography from "@/components/Typography/Typography";
import Button from "@/components/Button/Button";
import Image from "next/image";
import { vars } from "@/styles/theme.css";
import { fluidUnit } from "@/styles/fluid-unit";

export interface SecurityTrustProps {
  eyebrow?: string;
  title?: string;
  body?: React.ReactNode; // Use \n\n to insert paragraph breaks like homepage
  buttonLabel?: string;
  imageSrc: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  gridTemplateColumns?: string;
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
  gridTemplateColumns,
}) => {
  return (
    <section
      style={{
        margin: `${vars.space.xl} 0`,
        padding: 0,
        position: "relative",
        aspectRatio: "1400/865",
        maxHeight: "120vh",
        maxWidth: "100vw",
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, zIndex: -1 }}>
        <Image
          src="/bg_shape_cropped.svg"
          alt="Background Shape"
          width={1400}
          height={865}
          style={{
            maxWidth: `95vw`,

            aspectRatio: "1400/865",
            width: `99vw`,
            maxHeight: "120vh",
          }}
        />
      </div>

      <Container
        size="2xl"
        style={{
          zIndex: 1,
          padding: `${vars.space.xxl} ${vars.space["xxl"]}`,
          paddingTop: `min(calc(90vw * 865 / 1400 * 0.12), calc(100vh * 0.12))`,
          paddingRight: `calc(90vw * 0.05)`,
          paddingLeft: `calc(90vw * 0.05)`,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          height: `calc(90vw * 865 / 1400 * 0.85)`,
          maxHeight: "95vh",
        }}
      >
        <Grid
          minColWidth={fluidUnit(360)}
          gap="lg"
          style={{
            alignItems: "center",
            flex: 1,
            justifyContent: "center",
            height: "100%",
            width: "100%",
            maxHeight: "95vh",
            gap: fluidUnit(24),
            gridTemplateColumns: gridTemplateColumns || "1fr 1fr",
          }}
        >
          {/* Left column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <Typography
              as="h6"
              font="Space Grotesk"
              weight={400}
              style={{
                fontSize: fluidUnit(20),
                marginBottom: fluidUnit(12),
              }}
            >
              {eyebrow}
            </Typography>
            <Typography
              as="h1"
              font="Instrument Sans"
              weight={400}
              style={{
                marginBottom: fluidUnit(16),
                fontSize: fluidUnit(60),
                maxWidth: "12ch",
              }}
            >
              {title}
            </Typography>
            {typeof body === "string" ? (
              <Typography
                as="p"
                style={{
                  marginTop: vars.space.xl,
                  maxWidth: "70%",
                  fontSize: fluidUnit(20),
                }}
              >
                {body}
              </Typography>
            ) : (
              body
            )}
            <div style={{ marginTop: fluidUnit(8) }}>
              <Button
                variant="secondary"
                size="medium"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid black",
                  boxShadow: "none",
                  minWidth: fluidUnit(100),
                  padding: `${fluidUnit(16, 8)} ${fluidUnit(24, 10)}`,
                }}
              >
                <Typography
                  as="span"
                  style={{ fontSize: fluidUnit(14, 8) }}
                  weight={400}
                >
                  {buttonLabel}
                </Typography>
              </Button>
            </div>
          </div>
          {/* Right column */}
          <div>
            <div
              style={{
                position: "relative",
                aspectRatio: `${imageWidth}/${imageHeight}`,
                width: "100%",
                borderRadius: 12,
              }}
            >
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                // width={609}
                // height={649}
              />
            </div>
          </div>
        </Grid>
      </Container>
    </section>
  );
};

export default GrayShapeBackgroundGridSection;
