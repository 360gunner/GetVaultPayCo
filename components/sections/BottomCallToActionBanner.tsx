import { vars } from "@/styles/theme.css";
import Container from "../Layout/Container";
import Stack from "../Layout/Stack";
import Typography from "../Typography/Typography";
import Image from "next/image";
import Button from "../Button/Button";
import { responsiveFont } from "@/styles/responsive-font";

interface BottomCallToActionBannerProps {
  dark?: boolean;
}
const BottomCallToActionBanner: React.FC<BottomCallToActionBannerProps> = (
  props: BottomCallToActionBannerProps
) => {
  return (
    <section style={{ padding: "64px 0" }}>
      <Container
        size="full"
        style={{
          paddingRight: responsiveFont(16),
          paddingLeft: responsiveFont(16),
        }}
      >
        {/* Image with overlay content */}
        <div
          style={{
            position: "relative",
            width: "100%",
            borderRadius: responsiveFont(16),
            overflow: "hidden",
          }}
        >
          <Image
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
              padding: responsiveFont(24),
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: responsiveFont(12),
                textAlign: "center",
                color: "#fff",
              }}
            >
              <Image
                src="/vault_logo_icon_white.png"
                alt="VaultPay"
                width={69}
                height={69}
                style={{
                  width: responsiveFont(69),
                  height: responsiveFont(69),
                }}
              />
              <Typography
                as="h1"
                font="Space Grotesk"
                style={{
                  color: "#fff",
                  fontWeight: 400,
                  fontSize: responsiveFont(96),
                }}
              >
                Start your vault
              </Typography>
              <Button
                variant="colored"
                size="large"
                style={{
                  padding: `${responsiveFont(16)} ${responsiveFont(24)}`,
                }}
                backgroundColor={vars.color.neonMint}
              >
                <Typography
                  as="span"
                  style={{
                    margin: 0,
                    fontWeight: 400,
                    fontSize: responsiveFont(26),
                  }}
                >
                  Download The App
                </Typography>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
export default BottomCallToActionBanner;
