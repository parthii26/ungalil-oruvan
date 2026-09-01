import {
  deleteImageAction,
  moveImageAction,
  saveImageAltAction,
  setThumbnailAction,
  uploadProductImageAction,
} from "@/lib/actions/admin";
import type { ProductImage } from "@/lib/db/types";

export function ImagePanel({ productId, images }: { productId: string; images: ProductImage[] }) {
  return (
    <section className="mt-16">
      <h2 className="text-lg font-semibold">Images</h2>
      <p className="text-xs text-ink-soft mt-1">Stored as files under /public/uploads. Paths are saved in the catalog — not binary in the database.</p>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.path} alt={img.alt} className="aspect-square object-cover w-full" />
            <div className="p-2 space-y-2 text-xs uppercase tracking-widest">
              {img.is_thumbnail ? <p className="text-earth">Thumbnail</p> : (
                <form action={setThumbnailAction.bind(null, img.id, productId)}>
                  <button>Set thumbnail</button>
                </form>
              )}
              <div className="flex gap-2">
                <form action={moveImageAction.bind(null, img.id, productId, "up")}>
                  <button>Up</button>
                </form>
                <form action={moveImageAction.bind(null, img.id, productId, "down")}>
                  <button>Down</button>
                </form>
                <form action={deleteImageAction.bind(null, img.id, productId)}>
                  <button>Delete</button>
                </form>
              </div>
              <form action={saveImageAltAction.bind(null, img.id, productId)} className="flex gap-1">
                <input name="alt" defaultValue={img.alt} className="input !py-1" />
                <button>Alt</button>
              </form>
            </div>
          </div>
        ))}
      </div>
      <form action={uploadProductImageAction.bind(null, productId)} className="mt-6 flex flex-wrap gap-3 items-end">
        <div>
          <label className="label">File</label>
          <input type="file" name="file" accept="image/*" className="input" />
        </div>
        <div>
          <label className="label">Alt text</label>
          <input name="alt" className="input" />
        </div>
        <button className="btn btn-primary">Upload</button>
      </form>
    </section>
  );
}
