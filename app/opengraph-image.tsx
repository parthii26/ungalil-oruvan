import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/services/settings";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default share card for every page without its own opengraph-image. */
export default async function OgImage() {
  const settings = getSiteSettings();
  const line = `${settings.english_tagline} · ${settings.hero_subhead.split("—")[0].trim()}`;
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#211910",
          color: "#F5F0E5",
          fontFamily: "Georgia, 'Times New Roman', serif",
          padding: "64px 80px",
        }}
      >
        <div style={{ fontFamily: "Arial, sans-serif", fontSize: 26, letterSpacing: 6, color: "#C59A3D" }}>
          ORGANIC PANTRY
        </div>
        <div style={{ fontSize: 92, lineHeight: 1.02, marginTop: 24 }}>{settings.brand_name}</div>
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: 30, marginTop: 20, color: "rgba(245,240,229,0.75)" }}>
            {line}
          </div>
      </div>
    ),
    { ...size },
  );
}
