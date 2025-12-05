import React from "react";
import Container from "@/components/Layout/Container";
import Grid from "@/components/Layout/Grid";
import Typography from "@/components/Typography/Typography";
import { vars } from "@/styles/theme.css";
import Image from "next/image";
import { fluidUnit } from "@/styles/fluid-unit";

export type StepItem = {
  title: string;
  text: string;
  iconSrc?: string;
  underDescriptionImage?: React.ReactNode;
};

export interface StepsWithImageSectionProps {
  title: string;
  items: StepItem[];
  imageSrc: string;
  imageAlt?: string;
  // Optional decorative image behind the main image (like homepage)
  decorativeSrc?: string;
  decorativeWidth?: number;
  decorativeHeight?: number;
  containerSize?: "sm" | "md" | "lg" | "xl" | "full";
  minColWidth?: number;
  columnGap?: number;
  titleFontSize?: number;
  sectionStyle?: React.CSSProperties;
}

const StepsWithImageSection: React.FC<StepsWithImageSectionProps> = ({
  title,
  items,
  imageSrc,
  imageAlt = "",
  decorativeSrc,
  decorativeWidth = 463,
  decorativeHeight = 238,
  containerSize = "xl",
  minColWidth = 360,
  columnGap = 60,
  titleFontSize = 80,
  sectionStyle = {},
}) => {
  return (
    <section
      style={{
        padding: "24px 0",
        marginTop: fluidUnit(98),
        marginBottom: fluidUnit(98),
        ...sectionStyle,
      }}
    >
      <Container
        size={containerSize}
        style={{
          paddingLeft: "64px",
          paddingRight: "64px",
          overflowX: "hidden",
        }}
      >
        <Grid
          minColWidth={minColWidth}
          style={{ alignItems: "center", columnGap }}
        >
          {/* Left: Title + rows */}
          <div
            style={{
              height: "100%",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography
              as="h1"
              font="Space Grotesk"
              weight={400}
              style={{ fontSize: titleFontSize }}
            >
              {title}
            </Typography>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {items.map(({ title, text, iconSrc, underDescriptionImage }) => (
                <div
                  key={title}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    rowGap: 10,
                    // maxWidth: "75%",
                  }}
                >
                  <div
                    style={{
                      width: 118,
                      height: 118,
                      borderRadius: 20,
                      background: "#000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: "0 0 auto",
                    }}
                  >
                    {iconSrc ? (
                      <Image src={iconSrc} alt={title} width={72} height={72} />
                    ) : (
                      <svg
                        width="72"
                        height="72"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20.285 6.709a1 1 0 010 1.414l-9 9a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10.5 14.5l8.293-8.293a1 1 0 011.492.502z"
                          fill="#FFFFFF"
                        />
                      </svg>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "36px",
                      position: "relative",
                      gap: 12,
                      padding: "8px 0 ",
                    }}
                  >
                    <Typography
                      font="Instrument Sans"
                      as="h5"
                      style={{ margin: 0, fontWeight: 400, fontSize: 40 }}
                    >
                      {title}
                    </Typography>
                    <Typography
                      font="Instrument Sans"
                      as="p"
                      weight={400}
                      style={{
                        margin: 0,
                        lineHeight: "91%",
                        fontSize: "26px",
                        letterSpacing: "-0.58px",
                      }}
                    >
                      {text}
                    </Typography>
                    {underDescriptionImage}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right: Image with decorative shape */}
          <div>
            <div
              style={{
                position: "relative",
                width: "100%",
                // height: "min(60vw, 653px)",
              }}
            >
              {/* Decorative shape (behind), bottom-right */}
              {decorativeSrc && (
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    width: 463,
                    height: 238,
                    transform: "translate(25%, -60%)",
                    zIndex: 0,
                    pointerEvents: "none",
                  }}
                >
                  <Image
                    unoptimized
                    src={decorativeSrc ?? "/decorative_vector_shape_1.png"}
                    alt="decorative shape"
                    width={decorativeWidth}
                    height={decorativeHeight}
                  />
                </div>
              )}

              {/* Image box (on top) */}
              <div
                style={{
                  position: "relative",
                  alignSelf: "center",
                  textAlign: "center",
                  width: "100%",
                  height: "100%",
                  borderRadius: 12,
                  overflow: "hidden",
                  zIndex: 1,
                  aspectRatio: "458 / 653",
                }}
              >
                <Image unoptimized src={imageSrc} alt={imageAlt} fill />
              </div>
            </div>
          </div>
        </Grid>
      </Container>
    </section>
  );
};

export default StepsWithImageSection;
