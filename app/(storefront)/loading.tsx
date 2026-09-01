export default function Loading() {
  return (
    <div className="container-page py-24 animate-pulse">
      <div className="h-10 w-48 bg-paper-deep" />
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] bg-paper-deep" />
        ))}
      </div>
    </div>
  );
}
