"use client";

import { vars } from "@/styles/theme.css";
import Container from "../Layout/Container";
import Stack from "../Layout/Stack";
import Typography from "../Typography/Typography";
import Image from "next/image";
import Button from "../Button/Button";
import { fluidUnit } from "@/styles/fluid-unit";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

interface BottomCallToActionBannerProps {
  dark?: boolean;
}
const BottomCallToActionBanner: React.FC<BottomCallToActionBannerProps> = (
  props: BottomCallToActionBannerProps
) => {
  return (
    <FadeIn variant="scale">
    <section style={{ padding: "64px 0" }}>
      <Container
        size="full"
        style={{
          paddingRight: fluidUnit(24),
          paddingLeft: fluidUnit(24),
        }}
      >
        {/* Image with overlay content */}
        <div
          style={{
            position: "relative",
            width: "100%",
            borderRadius: fluidUnit(16),
            overflow: "hidden",
          }}
        >
          <Image
            unoptimized
            src={props.dark ? "/cta_banner_dark.png" : "/image 96.png"}
            alt="VaultPay devices"
            width={1200}
            height={560}
            style={{ width: "100%", height: "auto" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: fluidUnit(24),
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: fluidUnit(12),
                textAlign: "center",
                color: "#fff",
              }}
            >
              <Image
                src="/vault_logo_icon_white.svg"
                alt="VaultPay"
                width={69}
                height={69}
                style={{
                  width: fluidUnit(69),
                  height: fluidUnit(69),
                }}
              />
              <Typography
                as="h1"
                font="Space Grotesk"
                style={{
                  color: "#fff",
                  fontWeight: 400,
                  fontSize: fluidUnit(96),
                }}
              >
                Start your vault
              </Typography>
              <Link href={"/signup"}>
                <Button
                  variant="colored"
                  size="large"
                  style={{
                    padding: `${fluidUnit(16)} ${fluidUnit(24)}`,
                  }}
                  backgroundColor={vars.color.neonMint}
                >
                  <Typography
                    as="span"
                    style={{
                      margin: 0,
                      fontWeight: 400,
                      fontSize: fluidUnit(26),
                    }}
                  >
                    Download The App
                  </Typography>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
    </FadeIn>
  );
};
export default BottomCallToActionBanner;
