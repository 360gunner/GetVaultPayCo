import Container from "@/components/Layout/Container";
import Grid from "@/components/Layout/Grid";
import Stack from "@/components/Layout/Stack";
import Typography from "@/components/Typography/Typography";
import Button from "@/components/Button/Button";
import { vars } from "@/styles/theme.css";
import Image from "next/image";
import React from "react";

export interface SplitHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  buttonLabel?: string;
  buttonVariant?: "primary" | "secondary" | "colored" | "ghost";
  onButtonClick?: () => void;
  imageSrc: string;
  imageAlt?: string;
  containerSize?: "sm" | "md" | "lg" | "xl" | "full";
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
  containerSize = "lg",
  minColWidth = 360,
  imageWidth = 520,
  imageHeight = 520,
  imageStyle,
  gridTemplateColumns = "1fr 1fr",
  containerStyle,
  underImage,
  underDescription,
  titleFontSize,
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
          columnGap: vars.space["4xl"],
          gridTemplateColumns,
        }}
      >
        {/* Left column: text */}
        <div
          style={{
            height: "100%",
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Stack gap="sm">
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
                fontSize: titleFontSize || 72,
                marginBottom: vars.space.md,
                lineHeight: "91%",
              }}
            >
              {title}
            </Typography>
            {description ? (
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
        </div>
        {/* Right column: image */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            justifyContent: "start",
            justifyItems: "start",
            alignContent: "start",
          }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
            style={imageStyle}
          />
          {underImage}
        </div>
      </Grid>
    </Container>
  );
};

export default SplitHero;
