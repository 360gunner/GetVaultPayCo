"use client";

import Container, { ContainerSize } from "@/components/Layout/Container";
import Grid from "@/components/Layout/Grid";
import Stack from "@/components/Layout/Stack";
import Typography from "@/components/Typography/Typography";
import Button from "@/components/Button/Button";
import { vars } from "@/styles/theme.css";
import Image from "next/image";
import React from "react";
import { fluidUnit } from "@/styles/fluid-unit";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

export interface SplitHeroProps {
  eyebrow?: string;
  dark?: boolean;
  title: string | React.ReactNode;
  description?: string;
  buttonLabel?: string;
  buttonVariant?: "primary" | "secondary" | "colored" | "ghost";
  onButtonClick?: () => void;
  imageSrc: string;
  imageAlt?: string;
  textNote?: string;
  containerSize?: ContainerSize;
  minColWidth?: number;
  imageWidth?: number;
  imageHeight?: number;
  imageStyle?: React.CSSProperties;
  gridTemplateColumns?: string;
  containerStyle?: React.CSSProperties;
  underImage?: React.ReactNode;
  underDescription?: React.ReactNode;
  titleFontSize?: number;
  buttonHref?: string;
}

const SplitHero: React.FC<SplitHeroProps> = ({
  eyebrow,
  dark = false,
  title,
  description,
  buttonLabel,
  buttonVariant = "secondary",
  onButtonClick,
  imageSrc,
  imageAlt = "",
  textNote,
  buttonHref = "#",
  containerSize = "2xl",
  minColWidth = 360,
  imageWidth = 520,
  imageHeight = 520,
  imageStyle,
  gridTemplateColumns = "auto 1fr",
  containerStyle,
  underImage,
  underDescription,
  titleFontSize = 80,
}) => {
  return (
    <FadeIn variant="up">
    <Container
      size={containerSize}
      style={{
        minHeight: "min(100vh, 1200)",
        display: "flex",
        alignItems: "center",
        paddingTop: vars.space.xl,
        paddingBottom: vars.space.xl,
        ...containerStyle,
      }}
    >
      <Grid
        minColWidth={minColWidth}
        style={{
          alignItems: "center",
          justifyContent: "center",
          columnGap: vars.space["xxl"],
          gridTemplateColumns,
          width: "100%",
        }}
      >
        {/* Left column: text */}

        <Stack gap="lg">
          {eyebrow ? (
            <Typography
              as="p"
              font="Space Grotesk"
              style={{
                fontSize: fluidUnit(20),
                marginBottom: vars.space.sm,
                color: dark ? vars.color.vaultWhite : vars.color.vaultBlack,
              }}
            >
              {eyebrow}
            </Typography>
          ) : null}
          <Typography
            as="h1"
            font="Space Grotesk"
            weight={400}
            style={{
              color: dark ? vars.color.vaultWhite : vars.color.vaultBlack,
              fontSize: fluidUnit(titleFontSize),
              marginBottom: vars.space.md,
              maxWidth: "12ch",
              lineHeight: "91%",
            }}
          >
            {title}
          </Typography>
          {description ? (
            typeof description === "string" ? (
              <Typography
                font="Instrument Sans"
                color={dark ? vars.color.vaultWhite : vars.color.vaultBlack}
                as="p"
                style={{
                  maxWidth: "40ch",
                  fontSize: fluidUnit(20),
                  lineHeight: "120%",
                  letterSpacing: "-0.4px",
                }}
              >
                {description}
              </Typography>
            ) : (
              description
            )
          ) : null}
          {textNote && (
            <Typography
              as="p"
              font="Instrument Sans"
              color={dark ? vars.color.vaultWhite : vars.color.vaultBlack}
              style={{
                fontSize: fluidUnit(14),
                marginBottom: vars.space.sm,
                maxWidth: "60ch",
              }}
            >
              {textNote}
            </Typography>
          )}
          {underDescription}
          {buttonLabel ? (
            <Link href={buttonHref}>
              <Button
                variant={buttonVariant}
                size="medium"
                label={buttonLabel}
                textStyle={{ fontSize: fluidUnit(20, 12) }}
                onClick={onButtonClick}
                style={{
                  padding: `${fluidUnit(16, 12)} ${fluidUnit(24, 12)}`,
                  backgroundColor: dark ? vars.color.vaultWhite : undefined,
                }}
              />
            </Link>
          ) : null}
        </Stack>

        {/* Right column: image */}
        <FadeIn variant="scale" delay={200}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            justifyContent: "start",
            justifyItems: "start",
            alignContent: "start",
            position: "relative",
            aspectRatio: `${imageWidth} / ${imageHeight}`,
          }}
        >
          <Image
            unoptimized
            src={imageSrc}
            alt={imageAlt}
            fill
            // width={imageWidth}
            // height={imageHeight}
            style={imageStyle}
          />
          {underImage}
        </div>
        </FadeIn>
      </Grid>
    </Container>
    </FadeIn>
  );
};

export default SplitHero;
