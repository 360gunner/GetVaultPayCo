import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        html, body {
          padding: 0 !important;
          margin: 0 !important;
          background: #0a0a0a !important;
          min-height: 100vh !important;
          width: 100vw !important;
          overflow-x: hidden !important;
        }
      `}</style>
      {children}
    </>
  );
}
