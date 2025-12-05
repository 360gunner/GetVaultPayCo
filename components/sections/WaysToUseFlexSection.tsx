import React from "react";
import Container, { ContainerSize } from "@/components/Layout/Container";
import Grid from "@/components/Layout/Grid";
import Typography from "@/components/Typography/Typography";
import Image from "next/image";
import { vars } from "@/styles/theme.css";
import { fluidUnit } from "@/styles/fluid-unit";
import FeatureFlexSection from "./FeatureFlexSection";

export type WaysToUseItem = {
  src: string;
  alt: string;
  label: string;
  width?: number;
  height?: number;
  brandLogo?: string; // URL to brand logo to overlay on tile
};

export interface WaysToUseFlexSectionProps {
  title?: React.ReactNode;
  items: WaysToUseItem[]; // expect 12 items for 4x3 grid
  containerSize?: ContainerSize;
  sectionPadding?: string | number;
  titleStyle?: React.CSSProperties;
  dark?: boolean;
  sectionStyle?: React.CSSProperties;
  columnGap?: number | string;
  titleFontSize?: number;
  minColWidth?: number; // 220 gives up to 4 cols like homepage grid
  gap?: "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl" | "4xl" | "5xl";
  columns?: number; // force exact number of columns, e.g., 4
}

const WaysToUseFlexSection: React.FC<WaysToUseFlexSectionProps> = ({
  title = <>Ways to use Vault Pay</>,
  items,
  containerSize = "full",
  sectionPadding = "24px 0",
  dark = false,
  sectionStyle = {},
  minColWidth = 220,
  titleFontSize,
  columnGap,
  gap = "xl",
  columns = 4,
  titleStyle = {},
}) => {
  const rows: Array<WaysToUseFlexSectionProps["items"]> = [];
  for (let i = 0; i < items.length; i += columns) {
    rows.push([...items.slice(i, i + 4)]);
  }
  console.log(rows);
  return (
    <section style={{ padding: sectionPadding, ...sectionStyle }}>
      <Container size={containerSize}>
        <Typography
          as="h1"
          font="Space Grotesk"
          weight={400}
          style={{
            fontSize: titleFontSize || fluidUnit(60),
            marginBottom: vars.space.xxl,
            color: dark ? vars.color.vaultWhite : vars.color.vaultBlack,
            ...titleStyle,
          }}
        >
          {title}
        </Typography>
        {rows.map((r) => (
          <>
            {
              <FeatureFlexSection
                sectionPadding={0}
                dark={dark}
                items={r.map((i) => ({
                  alt: i.alt,
                  src: i.src,
                  title: i.label,
                  description: "",
                  brandLogo: i.brandLogo,
                }))}
              ></FeatureFlexSection>
            }
          </>
        ))}
      </Container>
    </section>
  );
};

export default WaysToUseFlexSection;
