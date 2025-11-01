import React from "react";
import Container from "@/components/Layout/Container";
import Grid from "@/components/Layout/Grid";
import Stack from "@/components/Layout/Stack";
import Typography from "@/components/Typography/Typography";
import Button from "@/components/Button/Button";
import Image from "next/image";
import { vars } from "@/styles/theme.css";
import { fluidUnit } from "@/styles/fluid-unit";
import Link from "next/link";

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
  buttonHref?: string;
}

const GrayShapeBackgroundGridSection: React.FC<SecurityTrustProps> = ({
  eyebrow = "SECURITY & TRUST",
  title = "The safe, speedy & secure borderless payment app.",
  body = "End-to-End Encryption – Your data is encrypted at every step.\n\nPCI-DSS Compliant – We never store sensitive info directly.\n\nFraud Monitoring – AI-powered systems flag and prevent risk.",
  buttonLabel = "Learn more",
  buttonHref = "#",
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
        maxHeight: "calc(120 * var(--vh))",
        maxWidth: "calc(100 * var(--vw))",
        overflow: "visible",
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, zIndex: -1 }}>
        <Image
          unoptimized
          src="/bg_shape_cropped.svg"
          alt="Background Shape"
          width={1400}
          height={865}
          style={{
            maxWidth: `calc(95  * var(--vw))`,

            aspectRatio: "1400/865",
            width: `calc(99 * var(--vw))`,
            maxHeight: "calc(120* var(--vh))",
          }}
        />
      </div>

      <Container
        size="2xl"
        style={{
          zIndex: 1,
          padding: `${vars.space.xxl} ${vars.space["xxl"]}`,
          paddingTop: `min(calc(90 * var(--vw) * 865 / 1400 * 0.12), calc(100 * var(--vh) * 0.12))`,
          paddingRight: `calc(90 * var(--vw) * 0.05)`,
          paddingLeft: `calc(90 * var(--vw) * 0.05)`,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          height: `calc(90 * var(--vw) * 865 / 1400 * 0.85)`,
          maxHeight: "95 * var(--vh)",
          overflow: "visible",
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
            maxHeight: "95 * var(--vh)",
            gap: fluidUnit(24),
            gridTemplateColumns: gridTemplateColumns || "1fr 1fr",
            overflow: "visible",
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
                lineHeight: "91%",
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
              <Link href={buttonHref}>
                <Button
                  variant="secondary"
                  size="medium"
                  style={{
                    backgroundColor: "#fff",
                    border: "2px solid black",
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
              </Link>
            </div>
          </div>
          {/* Right column */}
          <div style={{ transform: 'translateX(149px)' }}>
            <div
              style={{
                position: "relative",
                aspectRatio: `${imageWidth}/${imageHeight}`,
                width: "100%",
                borderRadius: 12,
              }}
            >
              <Image
                unoptimized
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
