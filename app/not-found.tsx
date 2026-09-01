import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center p-8 text-center">
      <div>
        <p className="label">404</p>
        <h1 className="font-serif text-5xl mt-2">That page is not here.</h1>
        <Link href="/" className="btn btn-primary mt-8">
          Home
        </Link>
      </div>
    </div>
  );
}
