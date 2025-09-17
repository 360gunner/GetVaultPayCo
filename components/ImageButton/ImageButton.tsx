import React from "react";
import * as s from "./ImageButton.css";
import { AppImage, AppImageProps } from "../Image/AppImage";
import Icon, { IconProps } from "../Icon/Icon";

export type ImageButtonSize = keyof typeof s.size; // sm|md|lg
export type ImageButtonVariant = keyof typeof s.variant; // filled|outline|ghost
export type ImageButtonShape = keyof typeof s.shape; // square|rounded|pill

export interface ImageButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ImageButtonSize;
  variant?: ImageButtonVariant;
  shape?: ImageButtonShape;
  // You can pass either an image or an icon
  image?: Omit<AppImageProps, "wrapperClassName"> & { wrapperClassName?: string };
  icon?: IconProps;
  children?: React.ReactNode;
}

export const ImageButton: React.FC<ImageButtonProps> = ({
  size = "md",
  variant = "filled",
  shape = "rounded",
  className,
  image,
  icon,
  children,
  ...rest
}) => {
  const classes = [s.root, s.size[size], s.variant[variant], s.shape[shape], className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...rest}>
      {image ? (
        <AppImage {...image} shape={shape === "pill" ? "circle" : shape} />
      ) : icon ? (
        <Icon {...icon} />
      ) : null}
      {children}
    </button>
  );
};

export default ImageButton;
