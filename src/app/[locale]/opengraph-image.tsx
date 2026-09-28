import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/features/seo/site";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// satori only understands an explicit flex layout, so the palette is inlined
// here rather than read from the globals.css tokens.
const imageStyle = {
  alignItems: "center",
  background: "#fff9ef",
  color: "#17120e",
  display: "flex",
  flexDirection: "column" as const,
  height: "100%",
  justifyContent: "center",
  padding: "80px",
  textAlign: "center" as const,
  width: "100%",
};

const titleStyle = { color: "#7a3f22", fontSize: 108, fontWeight: 700 };
const taglineStyle = { fontSize: 40, marginTop: 24 };
const placeStyle = { color: "#315c45", fontSize: 30, marginTop: 40 };

export default function OpenGraphImage(): ImageResponse {
  return new ImageResponse(
    <div style={imageStyle}>
      <div style={titleStyle}>{SITE_NAME}</div>
      <div style={taglineStyle}>Morgens frisch, abends bestellt.</div>
      <div style={placeStyle}>Handwerksbäckerei in Kassel</div>
    </div>,
    size,
  );
}
