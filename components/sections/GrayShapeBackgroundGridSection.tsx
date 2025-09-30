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
        minHeight: "100vh",
        maxWidth: "100vw",
      }}
    >
      <Image
        src="/bg_shape_cropped.svg"
        alt="Background Shape"
        width={1400}
        height={865}
        style={{
          maxWidth: `95vw`,
          position: "absolute",
          left: 0,
          top: 0,
          width: `95vw`,
          objectFit: "contain",
          zIndex: -1,
        }}
      />
      <Container
        size="2xl"
        style={{
          zIndex: 1,
          padding: `${vars.space.xxl} ${vars.space["xxl"]}`,
          paddingTop: `calc(90vw * 865 / 1400 * 0.15)`,
          paddingRight: `calc(90vw * 0.05)`,
          paddingLeft: `calc(90vw * 0.05)`,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          height: `calc(90vw * 865 / 1400 * 0.85)`,
        }}
      >
        <Grid
          minColWidth={360}
          gap="lg"
          style={{
            alignItems: "center",
            flex: 1,
            justifyContent: "center",
            height: "100%",
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
              style={{ fontSize: 20 }}
            >
              {eyebrow}
            </Typography>
            <Typography
              as="h1"
              font="Instrument Sans"
              weight={400}
              style={{
                marginBottom: vars.space.xl,
                fontSize: 60,
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
                  fontSize: 20,
                }}
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
                <Typography as="span" style={{ fontSize: "12px" }} weight={400}>
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
