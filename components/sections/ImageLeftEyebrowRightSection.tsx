import React from "react";
import Container from "@/components/Layout/Container";
import Grid from "@/components/Layout/Grid";
import Typography from "@/components/Typography/Typography";
import Image from "next/image";
import { vars } from "@/styles/theme.css";

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
  eyebrow?: React.ReactNode; // optional small label above the title
  title: React.ReactNode; // main heading on the right
  text?: React.ReactNode; // supporting paragraph on the right
  variant?: "ltr" | "rtl"; // controls whether image is on left or right
  containerSize?: "sm" | "md" | "lg" | "xl" | "full";
  sectionPadding?: string | number;
  gap?: "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl" | "4xl" | "5xl";
  columns?: number;
  sectionVerticalMargin?: string | number;
  underImage?: React.ReactNode;
}

const ImageLeftEyebrowRightSection: React.FC<
  ImageLeftEyebrowRightSectionProps
> = ({
  image,
  eyebrow,
  title,
  text,
  variant = "ltr",
  containerSize = "lg",
  sectionPadding = "24px 0",
  gap = "xxl",
  columns = 2,
  sectionVerticalMargin = vars.space["4xl"],
  underImage,
}) => {
  const { src, alt, width = 560, height = 420, priority, style } = image;

  const ImageBlock = (
    <div
      style={{
        position: "relative",
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        style={{ width: "100%", height: "auto", ...style }}
      />
      {underImage}
    </div>
  );

  const ContentBlock = (
    <div>
      {eyebrow ? (
        typeof eyebrow === "string" ? (
          <Typography
            as="h6"
            font="Space Grotesk"
            weight={400}
            style={{ margin: 0 }}
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
          font="Instrument Sans"
          weight={400}
          style={{ marginTop: eyebrow ? vars.space.sm : 0, fontSize: 40 }}
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
            weight={400}
            style={{ marginTop: vars.space.md, fontSize: 20 }}
          >
            {text}
          </Typography>
        ) : (
          text
        )
      ) : null}
    </div>
  );

  return (
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
  );
};

export default ImageLeftEyebrowRightSection;
