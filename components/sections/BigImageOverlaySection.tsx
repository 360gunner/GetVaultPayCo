"use client";

import React from "react";
import Container from "@/components/Layout/Container";
import Image from "next/image";
import Grid from "@/components/Layout/Grid";
import Typography from "@/components/Typography/Typography";
import Button from "@/components/Button/Button";
import { vars } from "@/styles/theme.css";
import Link from "next/link";
import { ContainerSize } from "@/components/Layout/Container";
import { fluidUnit } from "@/styles/fluid-unit";
import FadeIn from "@/components/FadeIn";

export interface BigImageOverlayImageSpec {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
}

export interface BigImageOverlaySectionProps {
  image: BigImageOverlayImageSpec;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  text?: React.ReactNode;
  buttonLabel?: string;
  buttonHref?: string;
  containerSize?: ContainerSize;
  sectionPadding?: string | number;
  rounded?: number;
  shadow?: boolean;
  aspectRatio?: number | string; // used if width/height not provided
  fullBleed?: boolean; // if true, skip container
  overlayShade?: boolean; // adds a subtle dark overlay for contrast
}

const BigImageOverlaySection: React.FC<BigImageOverlaySectionProps> = ({
  image,
  eyebrow,
  title,
  text,
  buttonLabel,
  buttonHref = "#",
  containerSize = "full",
  sectionPadding = `${fluidUnit(28, 12)} 0`,
  rounded = 16,
  shadow = false,
  aspectRatio = "16 / 9",
  fullBleed = false,
  overlayShade = true,
}) => {
  const banner = (
    <div
      style={{
        position: "relative",
        width: "100%",
        borderRadius: rounded,
        overflow: "hidden",
        aspectRatio:
          image.width && image.height ? undefined : (aspectRatio as any),
      }}
    >
      {image.width && image.height ? (
        <Image
          unoptimized
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          priority={image.priority}
          sizes={image.sizes}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            ...image.style,
          }}
        />
      ) : (
        <Image
          unoptimized
          src={image.src}
          alt={image.alt}
          fill
          priority={image.priority}
          sizes={image.sizes || "100vw"}
          style={{ objectFit: "cover", inset: 0, ...image.style }}
        />
      )}

      <div
        style={{ position: "absolute", inset: 0, padding: fluidUnit(48, 12) }}
      >
        <Grid
          columns={2}
          gap="xl"
          style={{
            height: "100%",
            alignItems: "center",
            paddingLeft: fluidUnit(28, 12),
          }}
        >
          {/* Left column content */}
          <div style={{ maxWidth: 560 }}>
            {eyebrow ? (
              typeof eyebrow === "string" ? (
                <Typography
                  as="h6"
                  font="Space Grotesk"
                  weight={400}
                  style={{
                    margin: 0,
                    color: "#fff",
                    fontSize: fluidUnit(20, 10),
                  }}
                >
                  {eyebrow}
                </Typography>
              ) : (
                eyebrow
              )
            ) : null}

            {typeof title === "string" ? (
              <Typography
                as="h2"
                font="Space Grotesk"
                weight={400}
                style={{
                  marginTop: eyebrow ? fluidUnit(8) : 0,
                  color: "#fff",
                  fontSize: fluidUnit(76, 20),
                  lineHeight: "91%",
                }}
              >
                {title}
              </Typography>
            ) : (
              title
            )}

            {text ? (
              typeof text === "string" ? (
                <Typography
                  as="p"
                  font="Instrument Sans"
                  style={{
                    marginTop: fluidUnit(8),
                    color: "#fff",
                    fontSize: fluidUnit(18, 10),
                  }}
                >
                  {text}
                </Typography>
              ) : (
                text
              )
            ) : null}

            {buttonLabel && (
              <div style={{ marginTop: fluidUnit(24, 8) }}>
                <Link href={buttonHref} style={{ textDecoration: "none" }}>
                  <Button
                    variant="secondary"
                    size="large"
                    style={{
                      background: "#fff",
                      color: vars.color.vaultBlack,
                      border: "none",
                      borderRadius: vars.radius.pill,
                      padding: `${fluidUnit(20, 10)} ${fluidUnit(24, 10)}`,
                      boxShadow: "none",
                      verticalAlign: "center",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      as="span"
                      font="Instrument Sans"
                      style={{
                        fontSize: fluidUnit(18, 12),
                        alignSelf: "center",
                      }}
                    >
                      {buttonLabel}
                    </Typography>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Right column empty by design */}
          <div />
        </Grid>
      </div>
    </div>
  );

  return (
    <FadeIn variant="default">
    <section style={{ padding: sectionPadding }}>
      {fullBleed ? (
        banner
      ) : (
        <Container
          size={containerSize}
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          {banner}
        </Container>
      )}
    </section>
    </FadeIn>
  );
};

export default BigImageOverlaySection;
