import Container, { ContainerSize } from "@/components/Layout/Container";
import Grid from "@/components/Layout/Grid";
import Stack from "@/components/Layout/Stack";
import Typography from "@/components/Typography/Typography";
import Button from "@/components/Button/Button";
import { vars } from "@/styles/theme.css";
import Image from "next/image";
import React from "react";

export interface SplitHeroProps {
  eyebrow?: string;
  title: string | React.ReactNode;
  description?: string;
  buttonLabel?: string;
  buttonVariant?: "primary" | "secondary" | "colored" | "ghost";
  onButtonClick?: () => void;
  imageSrc: string;
  imageAlt?: string;
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
}

const SplitHero: React.FC<SplitHeroProps> = ({
  eyebrow,
  title,
  description,
  buttonLabel,
  buttonVariant = "secondary",
  onButtonClick,
  imageSrc,
  imageAlt = "",
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
    <Container
      size={containerSize}
      style={{
        minHeight: "100vh",
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
              style={{ fontSize: 20, marginBottom: vars.space.sm }}
            >
              {eyebrow}
            </Typography>
          ) : null}
          <Typography
            as="h1"
            font="Space Grotesk"
            weight={400}
            style={{
              fontSize: titleFontSize,
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
                as="p"
                style={{
                  maxWidth: "40ch",
                  fontSize: 20,
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
          {underDescription}
          {buttonLabel ? (
            <div>
              <Button
                variant={buttonVariant}
                size="medium"
                label={buttonLabel}
                onClick={onButtonClick}
              />
            </div>
          ) : null}
        </Stack>

        {/* Right column: image */}
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
            src={imageSrc}
            alt={imageAlt}
            fill
            // width={imageWidth}
            // height={imageHeight}
            style={imageStyle}
          />
          {underImage}
        </div>
      </Grid>
    </Container>
  );
};

export default SplitHero;
