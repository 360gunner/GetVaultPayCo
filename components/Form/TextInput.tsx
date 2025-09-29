import React from "react";
import Typography from "@/components/Typography/Typography";

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
    <label style={{ display: "grid", gap: 8 }}>
      <Typography
        as="span"
        font="Instrument Sans"
        style={{
          fontSize: 14,
          marginBottom: 0,
          color: labelColor || undefined,
        }}
      >
        {label}
      </Typography>
      <input
        {...props}
        style={{
          padding: "12px 14px",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          outline: "none",
          fontSize: 16,
          fontFamily: "Instrument Sans, system-ui, sans-serif",
          background: "#fff",
          ...(style || {}),
        }}
      />
    </label>
  );
};

export default TextInput;
