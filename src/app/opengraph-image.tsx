import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#f6f0e5",
          color: "#1c1917",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "center",
          padding: "72px",
          width: "100%",
        }}
      >
        <div style={{ color: "#78716c", display: "flex", fontSize: 28, letterSpacing: 8, textTransform: "uppercase" }}>
          Full Stack Developer · India
        </div>
        <div style={{ display: "flex", fontSize: 92, fontWeight: 700, letterSpacing: -4, marginTop: 34 }}>
          Devashish Tyagi
        </div>
        <div style={{ color: "#57534e", display: "flex", fontSize: 36, marginTop: 28 }}>
          1.5+ years building web, backend & AI products
        </div>
      </div>
    ),
    size,
  );
}
