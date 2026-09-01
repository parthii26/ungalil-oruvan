export const metadata = { title: "Track order" };

export default async function TrackPage({ params }: { params: Promise<{ token?: string[] }> }) {
  const { token } = await params;
  return (
    <div className="container-page py-16 max-w-xl">
      <h1 className="font-serif text-5xl">Track</h1>
      <p className="mt-4 text-ink-soft">
        Public tracking tokens are a Stage 2 feature. Stage 1 shows status only on the signed-in order page.
      </p>
      {token?.[0] && <p className="mt-4 text-sm">Token received: {token[0]} — not resolved in Stage 1.</p>}
      <ol className="mt-10 space-y-3 text-sm">
        {["Order created", "Payment pending", "Confirmed", "Processing", "Packed", "Shipped", "Out for delivery", "Delivered"].map(
          (s, i) => (
            <li key={s} className={i < 2 ? "" : "text-ink-soft"}>
              {i < 2 ? "●" : "○"} {s}
              {i >= 2 && " — not active"}
            </li>
          ),
        )}
      </ol>
    </div>
  );
}
