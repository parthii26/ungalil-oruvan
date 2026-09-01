"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/batches", label: "Batches" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/settings", label: "Settings" },
];

function Links({ onClick }: { onClick?: () => void }) {
  const path = usePathname();
  return (
    <nav className="flex flex-col py-3">
      {nav.map((n) => {
        const active = n.href === "/admin" ? path === "/admin" : path.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            onClick={onClick}
            className={cn(
              "px-5 py-2 text-sm border-l-2",
              active ? "border-[#C59A3D] bg-white/5 text-white" : "border-transparent text-white/70 hover:text-white",
            )}
          >
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminNav({ mobile }: { mobile?: boolean }) {
  const [open, setOpen] = useState(false);
  if (!mobile) return <Links />;
  return (
    <div className="md:hidden">
      <button type="button" className="p-2" aria-label="Open menu" onClick={() => setOpen(true)}>
        <Menu size={18} />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-[#1c211d] text-[#E8E4DA]">
          <div className="flex justify-between items-center px-4 h-14 border-b border-white/10">
            <span className="text-sm tracking-widest uppercase">Menu</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close">
              <X />
            </button>
          </div>
          <Links onClick={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
