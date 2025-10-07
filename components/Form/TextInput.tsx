import React from "react";
import Typography from "@/components/Typography/Typography";
import { fluidUnit } from "@/styles/fluid-unit";

export interface TextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;

  labelColor?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  labelColor,
  style,
  ...props
}) => {
  return (
    <label style={{ display: "grid", gap: fluidUnit(8) }}>
      <Typography
        as="span"
        font="Instrument Sans"
        style={{
          fontSize: fluidUnit(14),
          marginBottom: 0,
          color: labelColor || undefined,
        }}
      >
        {label}
      </Typography>
      <input
        {...props}
        style={{
          padding: `${fluidUnit(12)} ${fluidUnit(14)}`,
          borderRadius: fluidUnit(12),
          border: "1px solid #e5e7eb",
          outline: "none",
          fontSize: fluidUnit(16),
          fontFamily: "Instrument Sans, system-ui, sans-serif",
          background: "#fff",
          ...(style || {}),
        }}
      />
    </label>
  );
};

export default TextInput;
