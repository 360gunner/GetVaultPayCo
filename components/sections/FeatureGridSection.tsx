import React from "react";
import Container from "@/components/Layout/Container";
import Grid from "@/components/Layout/Grid";
import Typography from "@/components/Typography/Typography";
import { vars } from "@/styles/theme.css";
import Image from "next/image";

export interface FeatureItem {
  src: string;
  alt: string;
  title: string;
  description: string;
  width?: number;
  height?: number;
}

export interface FeatureGridSectionProps {
  items: FeatureItem[];
  containerSize?: "sm" | "md" | "lg" | "xl" | "full";
  sectionPadding?: string | number;
  minColWidth?: number; // controls how many columns fit; use 220 for up to 4 cols
  gap?: "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl" | "4xl" | "5xl";
}

const FeatureGridSection: React.FC<FeatureGridSectionProps> = ({
  items,
  containerSize = "full",
  sectionPadding = "24px",
  minColWidth = 220,
  gap = "xl",
}) => {
  return (
    <section style={{ padding: sectionPadding }}>
      <Container size={containerSize}>
        <Grid
          minColWidth={minColWidth}
          gap={gap}
          style={{ alignItems: "start" }}
        >
          {items.map(
            ({ src, alt, title, description, width = 476, height = 386 }) => (
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
                  style={{ marginTop: vars.space.lg }}
                >
                  {title}
                </Typography>
                <Typography
                  as="p"
                  style={{ maxWidth: "75%", fontSize: "16px" }}
                >
                  {description}
                </Typography>
              </div>
            )
          )}
        </Grid>
      </Container>
    </section>
  );
};

export default FeatureGridSection;
