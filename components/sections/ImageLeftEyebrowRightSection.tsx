"use client";

import React from "react";
import Container from "@/components/Layout/Container";
import Grid from "@/components/Layout/Grid";
import Typography from "@/components/Typography/Typography";
import Image from "next/image";
import { vars } from "@/styles/theme.css";
import Button from "../Button/Button";
import { fluidUnit } from "@/styles/fluid-unit";
import FadeIn from "@/components/FadeIn";

export interface ImageSpec {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  style?: React.CSSProperties;
}

export interface ImageLeftEyebrowRightSectionProps {
  image: ImageSpec;
  dark?: boolean;
  eyebrow?: React.ReactNode; // optional small label above the title
  title?: React.ReactNode; // main heading on the right
  text?: React.ReactNode; // supporting paragraph on the right
  variant?: "ltr" | "rtl"; // controls whether image is on left or right
  containerSize?: "sm" | "md" | "lg" | "xl" | "full";
  sectionPadding?: string | number;
  gap?: "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl" | "4xl" | "5xl";
  columns?: number;
  sectionVerticalMargin?: string | number;
  underImage?: React.ReactNode;
  buttonLabel?: string;
  buttonHref?: string;
}

const ImageLeftEyebrowRightSection: React.FC<
  ImageLeftEyebrowRightSectionProps
> = ({
  image,
  eyebrow,
  dark,
  title,
  text,
  variant = "ltr",
  containerSize = "lg",
  sectionPadding = "24px 0",
  gap = "xxl",
  columns = 2,
  sectionVerticalMargin = vars.space["4xl"],
  underImage,
  buttonLabel,
  buttonHref,
}) => {
  const { src, alt, width = 560, height = 420, priority, style } = image;

  const ImageBlock = (
    <FadeIn variant="scale" delay={100}>
    <div
      style={{
        position: "relative",
      }}
    >
      <Image
        unoptimized
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        style={{ width: "100%", height: "auto", ...style }}
      />
      {underImage}
    </div>
    </FadeIn>
  );

  const ContentBlock = (
    <div>
      {eyebrow ? (
        typeof eyebrow === "string" ? (
          <Typography
            as="h6"
            font="Space Grotesk"
            weight={400}
            style={{
              margin: 0,
              fontSize: fluidUnit(16),
              color: dark ? vars.color.vaultWhite : vars.color.vaultBlack,
            }}
          >
            {eyebrow}
          </Typography>
        ) : (
          eyebrow
        )
      ) : null}

      {title && (
        <>
          {typeof title === "string" ? (
            <Typography
              as="h2"
              font="Instrument Sans"
              weight={400}
              style={{
                marginTop: eyebrow ? vars.space.sm : 0,
                fontSize: fluidUnit(40),
                color: dark ? vars.color.vaultWhite : vars.color.vaultBlack,
              }}
            >
              {title}
            </Typography>
          ) : (
            title
          )}
        </>
      )}

      {text ? (
        typeof text === "string" ? (
          <Typography
            as="p"
            font="Instrument Sans"
            weight={400}
            style={{
              marginTop: vars.space.md,
              fontSize: fluidUnit(20),
              color: dark ? vars.color.vaultWhite : vars.color.vaultBlack,
            }}
          >
            {text}
          </Typography>
        ) : (
          text
        )
      ) : null}
      {buttonLabel && (
        <Button
          variant="secondary"
          style={{
            backgroundColor: dark
              ? vars.color.vaultWhite
              : vars.color.vaultBlack,
          }}
          label={buttonLabel}
        />
      )}
    </div>
  );

  return (
    <FadeIn variant="up">
    <section
      style={{
        padding: sectionPadding,
        marginTop: sectionVerticalMargin,
        marginBottom: sectionVerticalMargin,
      }}
    >
      <Container size={containerSize}>
        <Grid
          columns={columns}
          gap={gap}
          style={{
            alignItems: "center",
            columnGap: vars.space.xxl,
            gridTemplateColumns: variant === "ltr" ? "1.3fr 1fr" : "1fr 1.3fr",
          }}
        >
          {variant === "rtl" ? (
            <>
              {ContentBlock}
              {ImageBlock}
            </>
          ) : (
            <>
              {ImageBlock}
              {ContentBlock}
            </>
          )}
        </Grid>
      </Container>
    </section>
    </FadeIn>
  );
};

export default ImageLeftEyebrowRightSection;
