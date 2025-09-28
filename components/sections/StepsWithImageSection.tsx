import React from "react";
import Container from "@/components/Layout/Container";
import Grid from "@/components/Layout/Grid";
import Typography from "@/components/Typography/Typography";
import { vars } from "@/styles/theme.css";
import Image from "next/image";

export type StepItem = {
  title: string;
  text: string;
  iconSrc?: string;
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
}

const StepsWithImageSection: React.FC<StepsWithImageSectionProps> = ({
  title,
  items,
  imageSrc,
  imageAlt = "",
  decorativeSrc,
  decorativeWidth = 463,
  decorativeHeight = 238,
  containerSize = "lg",
  minColWidth = 360,
  columnGap = 60,
  titleFontSize = 64,
}) => {
  return (
    <section style={{ padding: "24px 0", minHeight: "100vh" }}>
      <Container size={containerSize} style={{ paddingLeft: "64px", paddingRight: "64px" }}>
        <Grid minColWidth={minColWidth} style={{ alignItems: "center", columnGap }}>
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
            <Typography as="h1" font="Space Grotesk" weight={400} style={{ fontSize: titleFontSize }}>
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
              {items.map(({ title: itemTitle, text, iconSrc }) => (
                <div
                  key={itemTitle}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    rowGap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: 18,
                      background: "#000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flex: "0 0 auto",
                    }}
                  >
                    {iconSrc ? (
                      <Image src={iconSrc} alt={itemTitle} width={48} height={48} />
                    ) : (
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.285 6.709a1 1 0 010 1.414l-9 9a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10.5 14.5l8.293-8.293a1 1 0 011.492.502z" fill="#FFFFFF" />
                      </svg>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "36px",
                      gap: 12,
                      padding: "8px 0 ",
                    }}
                  >
                    <Typography font="Instrument Sans" as="h5" style={{ margin: 0, fontWeight: 400, fontSize: 32 }}>
                      {itemTitle}
                    </Typography>
                    <Typography
                      font="Instrument Sans"
                      as="p"
                      weight={400}
                      style={{ margin: 0, lineHeight: "91%", fontSize: "24px", letterSpacing: "-0.58px" }}
                    >
                      {text}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Right: Image with optional decorative shape */}
          <div>
            <div style={{ position: "relative", width: "100%" }}>
              {decorativeSrc ? (
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    right: -16,
                    bottom: 16,
                    width: 300,
                    height: 200,
                    zIndex: 0,
                    pointerEvents: "none",
                  }}
                >
                  <Image src={decorativeSrc} alt="decorative shape" width={decorativeWidth} height={decorativeHeight} />
                </div>
              ) : null}
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
                }}
              >
                <Image src={imageSrc} alt={imageAlt} width={458 / 1.2} height={653 / 1.2} />
              </div>
            </div>
          </div>
        </Grid>
      </Container>
    </section>
  );
};

export default StepsWithImageSection;
