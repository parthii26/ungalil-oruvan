"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-page py-24 text-center">
      <h1 className="font-serif text-4xl">Something went wrong</h1>
      <button className="btn btn-primary mt-6" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
