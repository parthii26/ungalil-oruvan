import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";
import { getPublicProduct } from "@/lib/services/catalog";
import { getSiteSettings } from "@/lib/services/settings";
import { formatPrice } from "@/lib/formatters";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Per-product share card: brand, name, price, thumbnail. Falls back to a brand card. */
export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const settings = getSiteSettings();
  let name: string | null = null;
  let price: string | null = null;
  let img: string | null = null;
  try {
    const { product, variants, images } = getPublicProduct(slug);
    name = product.name;
    const v = variants.find((x) => x.status === "active") ?? variants[0];
    // Satori's default font has no ₹ glyph — use an ASCII-safe price here.
    if (v) price = formatPrice(v.price_paise).replace("₹", "Rs. ");
    const thumb = images.find((i) => i.is_thumbnail) ?? images[0];
    if (thumb && /\.(jpe?g|png)$/i.test(thumb.path)) {
      const file = await readFile(path.join(process.cwd(), "public", thumb.path.replace(/^\//, "")));
      const mime = /\.png$/i.test(thumb.path) ? "image/png" : "image/jpeg";
      img = `data:${mime};base64,${file.toString("base64")}`;
    }
  } catch {
    name = null;
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#211910",
          color: "#F5F0E5",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: img ? 640 : 1200,
            padding: "64px 72px",
          }}
        >
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: 26, letterSpacing: 6, color: "#C59A3D" }}>
            {settings.brand_name.toUpperCase()}
          </div>
          <div style={{ fontSize: name && name.length > 26 ? 54 : 70, lineHeight: 1.05, marginTop: 24 }}>
            {name ?? settings.brand_name}
          </div>
          {price && (
            <div style={{ fontFamily: "Arial, sans-serif", fontSize: 44, marginTop: 28, color: "#C59A3D" }}>{price}</div>
          )}
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: 24, marginTop: 16, color: "rgba(245,240,229,0.7)" }}>
            {settings.english_tagline}
          </div>
        </div>
        {img && <img src={img} width={560} height={630} style={{ objectFit: "cover" }} alt="" />}
      </div>
    ),
    { ...size },
  );
}
