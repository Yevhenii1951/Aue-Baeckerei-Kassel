import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_URL } from "@/features/seo/site";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const imageStyle = {
  alignItems: "center",
  background: "#faf7f2",
  color: "#241f1c",
  display: "flex",
  flexDirection: "column" as const,
  height: "100%",
  justifyContent: "center",
  padding: "80px",
  textAlign: "center" as const,
  width: "100%",
};

const titleStyle = { color: "#8e2a2a", fontSize: 96, fontWeight: 700 };
const subtitleStyle = { fontSize: 36, marginTop: 24 };
const disclosureStyle = { fontSize: 28, marginTop: 48 };

export default function OpenGraphImage(): ImageResponse {
  return new ImageResponse(
    <div style={imageStyle}>
      <div style={titleStyle}>{SITE_NAME}</div>
      <div style={subtitleStyle}>{SITE_URL}</div>
      <div style={disclosureStyle}>Platzhalter — auf fork ersetzen</div>
    </div>,
    size,
  );
}
