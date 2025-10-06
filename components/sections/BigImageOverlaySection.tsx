import React from "react";
import Container from "@/components/Layout/Container";
import Image from "next/image";
import Grid from "@/components/Layout/Grid";
import Typography from "@/components/Typography/Typography";
import Button from "@/components/Button/Button";
import { vars } from "@/styles/theme.css";
import Link from "next/link";
import { ContainerSize } from "@/components/Layout/Container";
import { responsiveFont } from "@/styles/responsive-font";

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
  sectionPadding = `${vars.space.xl} 0`,
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
          src={image.src}
          alt={image.alt}
          fill
          priority={image.priority}
          sizes={image.sizes || "100vw"}
          style={{ objectFit: "cover", inset: 0, ...image.style }}
        />
      )}

      <div
        style={{ position: "absolute", inset: 0, padding: vars.space["xxl"] }}
      >
        <Grid
          columns={2}
          gap="xl"
          style={{
            height: "100%",
            alignItems: "center",
            paddingLeft: vars.space["xl"],
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
                    fontSize: responsiveFont(20),
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
                  marginTop: eyebrow ? vars.space.sm : 0,
                  color: "#fff",
                  fontSize: responsiveFont(76),
                  lineHeight: 1.05,
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
                    marginTop: vars.space.md,
                    color: "#fff",
                    fontSize: responsiveFont(18),
                  }}
                >
                  {text}
                </Typography>
              ) : (
                text
              )
            ) : null}

            {buttonLabel && (
              <div style={{ marginTop: vars.space.lg }}>
                <Link href={buttonHref} style={{ textDecoration: "none" }}>
                  <Button
                    variant="secondary"
                    size="large"
                    style={{
                      background: "#fff",
                      color: vars.color.vaultBlack,
                      border: "none",
                      borderRadius: vars.radius.pill,
                      padding: `${responsiveFont(8)} ${responsiveFont(12)}`,
                      boxShadow: "none",
                      verticalAlign: "center",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      as="span"
                      font="Instrument Sans"
                      style={{
                        fontSize: responsiveFont(18),
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
    <section style={{ padding: sectionPadding }}>
      {fullBleed ? (
        banner
      ) : (
        <Container size={containerSize}>{banner}</Container>
      )}
    </section>
  );
};

export default BigImageOverlaySection;
