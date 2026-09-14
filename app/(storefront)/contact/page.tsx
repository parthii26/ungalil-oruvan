import { getSiteSettings } from "@/lib/services/settings";
import { ContactForm } from "./form";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  const s = getSiteSettings();
  return (
    <div className="container-page py-10 md:py-16 max-w-xl">
      <h1 className="font-serif text-4xl md:text-5xl">Contact</h1>
      <div className="mt-6 space-y-1 text-ink-soft">
        {s.address && <p>{s.address}</p>}
        {s.contact_email && <p>{s.contact_email}</p>}
        {s.contact_phone && <p>{s.contact_phone}</p>}
      </div>
      <ContactForm />
    </div>
  );
}
