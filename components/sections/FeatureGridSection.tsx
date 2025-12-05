"use client";

import React from "react";
import Container, { ContainerSize } from "@/components/Layout/Container";
import Grid from "@/components/Layout/Grid";
import Typography from "@/components/Typography/Typography";
import { vars } from "@/styles/theme.css";
import Image from "next/image";
import Button from "@/components/Button/Button";
import FadeIn from "@/components/FadeIn";

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
  columnGap?: number | string;
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
  columnGap,
  gap = "xl",
}) => {
  return (
    <FadeIn variant="up">
    <section style={{ padding: sectionPadding, ...sectionStyle }}>
      <Container size={containerSize}>
        <Grid
          minColWidth={minColWidth}
          gap={gap}
          style={{
            alignItems: center ? "center" : "start",
            justifyContent: center ? "center" : "start",
            columnGap,
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
            }, index) => (
              <FadeIn key={title} variant="up" delay={index * 100}>
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
              </FadeIn>
            )
          )}
        </Grid>
      </Container>
    </section>
    </FadeIn>
  );
};

export default FeatureGridSection;
