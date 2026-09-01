import { getSiteSettings } from "@/lib/services/settings";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  const s = getSiteSettings();
  return (
    <div className="container-page py-16 max-w-xl">
      <h1 className="font-serif text-5xl">Contact</h1>
      <p className="mt-4 text-ink-soft">
        {s.address}
        <br />
        {s.contact_email}
        <br />
        {s.contact_phone}
      </p>
      <form className="mt-10 space-y-3">
        <p className="text-sm text-ink-soft">The form is not wired to email (Resend is Stage 2).</p>
        <input className="input" placeholder="Name" disabled />
        <input className="input" placeholder="Email" disabled />
        <textarea className="input min-h-28" placeholder="Message" disabled />
        <button className="btn btn-primary" disabled type="button">
          Send — not configured
        </button>
      </form>
    </div>
  );
}
