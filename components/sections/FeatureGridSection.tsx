import React from "react";
import Container, { ContainerSize } from "@/components/Layout/Container";
import Grid from "@/components/Layout/Grid";
import Typography from "@/components/Typography/Typography";
import { vars } from "@/styles/theme.css";
import Image from "next/image";
import Button from "@/components/Button/Button";

export interface FeatureItem {
  src: string;
  alt: string;
  title: string;
  description: string;
  width?: number;
  height?: number;
  buttonLabel?: string;
  buttonHref?: string;
}

export interface FeatureGridSectionProps {
  items: FeatureItem[];
  containerSize?: ContainerSize;
  sectionPadding?: string | number;
  sectionStyle?: React.CSSProperties;
  dark?: boolean;
  center?: boolean;
  minColWidth?: number; // controls how many columns fit; use 220 for up to 4 cols
  gap?: "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl" | "4xl" | "5xl";
}

const FeatureGridSection: React.FC<FeatureGridSectionProps> = ({
  items,
  containerSize = "full",
  sectionPadding = "24px",
  sectionStyle = {},
  dark = false,
  center = false,
  minColWidth = 220,
  gap = "xl",
}) => {
  return (
    <section style={{ padding: sectionPadding, ...sectionStyle }}>
      <Container size={containerSize}>
        <Grid
          minColWidth={minColWidth}
          gap={gap}
          style={{
            alignItems: center ? "center" : "start",
            justifyContent: center ? "center" : "start",
          }}
        >
          {items.map(
            ({
              src,
              alt,
              title,
              description,
              width = 476,
              height = 386,
              buttonLabel,
              buttonHref,
            }) => (
              <div key={title}>
                <Image
                  src={src}
                  alt={alt}
                  width={width}
                  height={height}
                  unoptimized={true}
                />
                <Typography
                  as="h4"
                  font="Instrument Sans"
                  weight={400}
                  style={{
                    marginTop: vars.space.lg,
                    fontSize: "30px",
                    color: dark ? vars.color.vaultWhite : vars.color.vaultBlack,
                  }}
                >
                  {title}
                </Typography>
                <Typography
                  as="p"
                  style={{
                    maxWidth: "30ch",
                    fontSize: "20px",
                    lineHeight: "120%",
                    letterSpacing: "-0.4px",
                    color: dark ? vars.color.vaultWhite : vars.color.vaultBlack,
                  }}
                >
                  {description}
                </Typography>
                {buttonLabel && (
                  <Button
                    style={{
                      borderColor: vars.color.vaultBlack,
                      borderWidth: "1px",
                      borderStyle: "solid",
                      boxShadow: "none",
                      backgroundColor: dark ? vars.color.vaultWhite : undefined,
                    }}
                    variant="secondary"
                    label={buttonLabel}
                  />
                )}
              </div>
            )
          )}
        </Grid>
      </Container>
    </section>
  );
};

export default FeatureGridSection;
