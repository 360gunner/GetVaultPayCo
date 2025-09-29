import React from "react";
import Container from "@/components/Layout/Container";
import Image from "next/image";

export interface BigImageBannerImageSpec {
  src: string;
  alt: string;
  width?: number; // optional intrinsic width if you prefer width/height rendering
  height?: number; // optional intrinsic height
  priority?: boolean;
  sizes?: string; // next/image sizes attribute
}

export interface BigImageBannerProps {
  image: BigImageBannerImageSpec;
  containerSize?: "sm" | "md" | "lg" | "xl" | "full";
  sectionPadding?: string | number; // padding applied to the section wrapper
  rounded?: number; // border radius in px
  shadow?: boolean; // optional drop shadow
  aspectRatio?: number | string; // e.g., 16/9 or "16 / 9" when using fill mode
  fit?: "contain" | "cover"; // how the image fits inside the box; both preserve aspect ratio
  fullBleed?: boolean; // if true, disables container and lets image span the page width
}

const BigImageBanner: React.FC<BigImageBannerProps> = ({
  image,
  containerSize = "full",
  sectionPadding = "24px 0",
  rounded = 16,
  shadow = false,
  aspectRatio = "16 / 9",
  fit = "contain",
  fullBleed = false,
}) => {
  const content = (
    <div
      style={{
        position: "relative",
        width: "100%",
        borderRadius: rounded,
        overflow: "hidden",
        boxShadow: shadow ? "0 8px 28px rgba(0,0,0,0.12)" : undefined,
        // If width/height not provided, aspectRatio + fill image preserves ratio
        aspectRatio: image.width && image.height ? undefined : (aspectRatio as any),
      }}
    >
      {image.width && image.height ? (
        // When intrinsic dimensions provided, Next.js will preserve aspect ratio with height:auto
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          priority={image.priority}
          sizes={image.sizes}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      ) : (
        // Fallback to fill mode with CSS aspect-ratio
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={image.priority}
          sizes={image.sizes || "100vw"}
          style={{ objectFit: fit, inset: 0 }}
        />
      )}
    </div>
  );

  return (
    <section style={{ padding: sectionPadding }}>
      {fullBleed ? (
        content
      ) : (
        <Container size={containerSize}>{content}</Container>
      )}
    </section>
  );
};

export default BigImageBanner;
