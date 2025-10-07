import React from "react";
import Button from "@/components/Button/Button";
import Typography from "@/components/Typography/Typography";
import { fluidUnit } from "@/styles/fluid-unit";

export interface SocialButtonProps {
  icon: React.ReactNode;
  label: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  label,
  style,
  onClick,
}) => {
  return (
    <Button
      variant="ghost"
      size="medium"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: fluidUnit(10),
        justifyContent: "center",
        width: "100%",
        padding: `${fluidUnit(12)} ${fluidUnit(16)}`,
        borderRadius: fluidUnit(12),
        background: "#fff",
        color: "#111827",
        border: "none",
        ...style,
      }}
    >
      {icon}
      {typeof label === "string" ? (
        <Typography
          as="span"
          weight={400}
          style={{ fontSize: fluidUnit(16), margin: 0 }}
        >
          {label}
        </Typography>
      ) : (
        label
      )}
    </Button>
  );
};

export default SocialButton;
