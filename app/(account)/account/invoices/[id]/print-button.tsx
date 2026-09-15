"use client";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="btn btn-primary text-xs py-1.5 px-4 print:hidden"
    >
      🖨️ Print / Save as PDF
    </button>
  );
}
