import React from "react";
import Button from "@/components/Button/Button";
import Typography from "@/components/Typography/Typography";

export interface SocialButtonProps {
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick?: () => void;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  label,
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
        gap: 10,
        justifyContent: "center",
        width: "100%",
        padding: "12px 16px",
        borderRadius: 12,
        background: "#fff",
        color: "#111827",
        border: "none",
      }}
    >
      {icon}
      {typeof label === "string" ? (
        <Typography as="span" weight={400} style={{ fontSize: 16, margin: 0 }}>
          {label}
        </Typography>
      ) : (
        label
      )}
    </Button>
  );
};

export default SocialButton;
