import React from "react";
import Container from "@/components/Layout/Container";
import Grid from "@/components/Layout/Grid";
import Typography from "@/components/Typography/Typography";
import Image from "next/image";
import { vars } from "@/styles/theme.css";

export type WaysToUseItem = {
  src: string;
  alt: string;
  label: string;
  width?: number;
  height?: number;
};

export interface WaysToUseGridSectionProps {
  title?: React.ReactNode;
  items: WaysToUseItem[]; // expect 12 items for 4x3 grid
  containerSize?: "sm" | "md" | "lg" | "xl" | "full";
  sectionPadding?: string | number;
  minColWidth?: number; // 220 gives up to 4 cols like homepage grid
  gap?: "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl" | "4xl" | "5xl";
  columns?: number; // force exact number of columns, e.g., 4
}

const WaysToUseGridSection: React.FC<WaysToUseGridSectionProps> = ({
  title = <>Ways to use Vault Pay</>,
  items,
  containerSize = "full",
  sectionPadding = "24px 0",
  minColWidth = 220,
  gap = "xl",
  columns = 4,
}) => {
  return (
    <section style={{ padding: sectionPadding }}>
      <Container size={containerSize}>
        <Typography as="h1" font="Space Grotesk" weight={400}>
          {title}
        </Typography>
        <Grid
          minColWidth={minColWidth}
          gap={gap}
          style={{
            alignItems: "start",
            marginTop: vars.space.lg,
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }}
        >
          {items.map(({ src, alt, label, width = 240, height = 180 }) => (
            <div key={label}>
              <Image src={src} alt={alt} width={width} height={height} />
              <Typography
                as="h4"
                font="Instrument Sans"
                weight={400}
                style={{ marginTop: vars.space.lg, fontSize: "30px" }}
              >
                {label}
              </Typography>
            </div>
          ))}
        </Grid>
      </Container>
    </section>
  );
};

export default WaysToUseGridSection;
