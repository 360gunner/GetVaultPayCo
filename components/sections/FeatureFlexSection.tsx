"use client";

import React from "react";
import Container, { ContainerSize } from "@/components/Layout/Container";
import Grid from "@/components/Layout/Grid";
import Typography from "@/components/Typography/Typography";
import { vars } from "@/styles/theme.css";
import Image from "next/image";
import Button from "@/components/Button/Button";
import Link from "next/link";
import { fluidUnit } from "@/styles/fluid-unit";
import FadeIn from "@/components/FadeIn";

export interface FeatureItem {
  src: string;
  alt: string;
  title: string;
  description: string;
  width?: number;
  height?: number;
  buttonLabel?: string;
  href?: string;
  buttonHref?: string;
}

export interface FeatureFlexSectionProps {
  items: FeatureItem[];
  containerSize?: ContainerSize;
  sectionPadding?: string | number;
  sectionStyle?: React.CSSProperties;
  negativeMarginPercentage?: number;
  dark?: boolean;
  center?: boolean;
  columnGap?: number | string;
  minColWidth?: number; // controls how many columns fit; use 220 for up to 4 cols
  gap?: "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl" | "4xl" | "5xl";
}

const FeatureFlexSection: React.FC<FeatureFlexSectionProps> = ({
  items,
  containerSize = "full",
  sectionPadding = "24px",
  sectionStyle = {},
  dark = false,
  center = false,
  minColWidth = 220,
  negativeMarginPercentage = 10,
  columnGap,
  gap = "xl",
}) => {
  return (
    <FadeIn variant="up">
      <section style={{ padding: sectionPadding, ...sectionStyle }}>
        <Container
          size={containerSize}
          style={{ paddingLeft: 0, paddingRight: 0 }}
        >
          <div
            style={{
              display: "flex",
              gap: "-48px",
              alignItems: "flex-start",
              paddingLeft: `${Math.round(
                negativeMarginPercentage / items.length
              )}%`,
              boxSizing: "border-box",
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
                href = "#",
              }, index) => (
                <FadeIn key={title} variant="up" delay={index * 100}>
                <Link href={href} style={{ flex: 1 }}>
                  <div style={{ marginLeft: `-${negativeMarginPercentage}%` }}>
                    <Image
                      src={src}
                      alt={alt}
                      width={width}
                      height={height}
                      unoptimized={true}
                      style={{ width: "100%", height: "auto" }}
                    />
                    <Typography
                      as="h4"
                      font="Instrument Sans"
                      weight={400}
                      style={{
                        marginTop: vars.space.lg,
                        fontSize: fluidUnit(30, 14),
                        color: dark
                          ? vars.color.vaultWhite
                          : vars.color.vaultBlack,

                        width: "100%",
                        paddingRight: "15%",
                      }}
                    >
                      {title}
                    </Typography>
                    <Typography
                      as="p"
                      style={{
                        maxWidth: "75%",
                        fontSize: fluidUnit(20, 8),

                        color: dark
                          ? vars.color.vaultWhite
                          : vars.color.vaultBlack,
                      }}
                    >
                      {description}
                    </Typography>
                    {buttonLabel && (
                      <Link href={buttonHref || "#"}>
                        <Button
                          style={{
                            borderColor: vars.color.vaultBlack,
                            borderWidth: "1px",
                            borderStyle: "solid",
                            boxShadow: "none",
                            padding: `${fluidUnit(20, 8)}`,

                            backgroundColor: dark
                              ? vars.color.vaultWhite
                              : undefined,
                          }}
                          textStyle={{ fontSize: `${fluidUnit(20, 10)}` }}
                          variant="secondary"
                          label={buttonLabel}
                        />
                      </Link>
                    )}
                  </div>
                </Link>
                </FadeIn>
              )
            )}
          </div>
        </Container>
      </section>
    </FadeIn>
  );
};

export default FeatureFlexSection;
