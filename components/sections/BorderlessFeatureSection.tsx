import React from "react";
import Container from "@/components/Layout/Container";
import Grid from "@/components/Layout/Grid";
import Stack from "@/components/Layout/Stack";
import Typography from "@/components/Typography/Typography";
import Button from "@/components/Button/Button";
import Image from "next/image";
import { vars } from "@/styles/theme.css";

export interface BorderlessFeatureSectionProps {
  heading?: React.ReactNode; // allows exact markup like "Borderless <br /> payments for all"
  imageSrc: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageStyle?: React.CSSProperties;
  rightTitle?: React.ReactNode; // allows line breaks
  rightBody?: React.ReactNode;
  buttonLabel?: string;
}

const BorderlessFeatureSection: React.FC<BorderlessFeatureSectionProps> = ({
  heading = (
    <>
      Borderless <br /> payments for all
    </>
  ),
  imageSrc,
  imageAlt = "Cross-border payments",
  rightTitle = (
    <>
      Built for a World <br /> Without Limits
    </>
  ),
  rightBody = (
    <>
      VaultPay lets you send, receive, and manage money across countries,
      currencies, and communities—without the usual friction. Whether you're
      supporting family, traveling, or building your business, we make it feel
      effortless.
    </>
  ),
  buttonLabel = "Learn more",
  imageWidth = 600,
  imageHeight = 600,
  imageStyle = {},
}) => {
  return (
    <section style={{ padding: "24px 0" }}>
      <Container size="md">
        <Stack gap="sm">
          <Typography as="h1" font="Space Grotesk" weight={400}>
            {heading}
          </Typography>
          <Grid minColWidth={320} gap="lg" style={{ alignItems: "center" }}>
            <div>
              <Image
                src={imageSrc}
                alt={imageAlt}
                width={imageWidth}
                height={imageHeight}
                style={imageStyle}
              />
            </div>
            <div
              style={{
                paddingTop: vars.space.xl,
                paddingBottom: vars.space.xl,
              }}
            >
              <Typography as="h2" font="Instrument Sans" weight={400}>
                {rightTitle}
              </Typography>
              <Typography as="p">{rightBody}</Typography>
              <Button variant="secondary" size="medium" label={buttonLabel} />
            </div>
          </Grid>
        </Stack>
      </Container>
    </section>
  );
};

export default BorderlessFeatureSection;
