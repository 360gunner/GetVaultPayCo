import React from "react";
import Image, { ImageProps } from "next/image";
import * as s from "./AppImage.css";

export type ImageShape = keyof typeof s.shape; // square|rounded|circle

export type AppImageProps = Omit<ImageProps, "className"> &
  React.HTMLAttributes<HTMLDivElement> & {
    shape?: ImageShape;
    wrapperClassName?: string;
  };

export const AppImage: React.FC<AppImageProps> = ({
  shape = "rounded",
  wrapperClassName,
  alt,
  width,
  height,
  ...imgProps
}) => {
  const wrapper = [s.root, s.shape[shape], wrapperClassName]
    .filter(Boolean)
    .join(" ");
  const { className, ...rest } = imgProps as any;
  return (
    <div className={wrapper} style={{ width, height }}>
      <Image
        {...(rest as ImageProps)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        alt={alt}
        width={width}
        height={height}
      />
    </div>
  );
};

export default AppImage;
