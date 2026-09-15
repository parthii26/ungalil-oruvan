"use client";

import { useState, useTransition, useEffect, useId } from "react";
import Link from "next/link";
import {
  Check,
  AlertCircle,
  Loader2,
  ExternalLink,
  Upload,
  Eye,
  Edit3,
  Image as ImageIcon,
} from "lucide-react";
import type { SiteSettings } from "@/lib/db/types";
import { saveAboutContentAction, uploadAboutImageAction } from "@/lib/actions/about";
import type { AboutContentInput } from "@/lib/validations/about";

const PRESET_IMAGES = [
  { label: "Farm at Dawn", url: "/images/farm-dawn.jpg", alt: "Farm at dawn" },
  { label: "Working Hands", url: "/images/soil-hands.jpg", alt: "Soil in working hands" },
  { label: "Honey Harvest", url: "/images/honey.jpg", alt: "Organic honey jar" },
  { label: "Golden Turmeric", url: "/images/turmeric.jpg", alt: "Single-farm turmeric" },
  { label: "Foxtail Millet", url: "/images/millet-foxtail.jpg", alt: "Freshly harvested millets" },
  { label: "Farmer in Field", url: "/images/farmer-field.jpg", alt: "Farmer walking the field" },
];

export function AboutEditor({ initialData }: { initialData: SiteSettings }) {
  const [formData, setFormData] = useState<AboutContentInput>({
    about_tamil_badge: initialData.about_tamil_badge ?? initialData.tamil_tagline ?? "உங்களில் ஒருவர்",
    about_title: initialData.about_title || initialData.brand_name || "Ungalil Oruvar",
    about_intro:
      initialData.about_intro ||
      `${initialData.english_tagline || "One among you"}. ${initialData.footer_text || "Organic pantry goods from small farm lots."}`,
    about_image_1: initialData.about_image_1 || "/images/farm-dawn.jpg",
    about_image_1_alt: initialData.about_image_1_alt || "Farm at dawn",
    about_image_2: initialData.about_image_2 || "/images/soil-hands.jpg",
    about_image_2_alt: initialData.about_image_2_alt || "Soil in working hands",
    story_tamil: initialData.story_tamil ?? "நமது மண்ணில் வேரூன்றியது",
    story_title: initialData.story_title || "Rooted in Our Soil",
    story_body:
      initialData.story_body ||
      "Traditional roots, modern commerce. The storefront carries honest soil in its details — millet names, farm lots, terracotta accents — bringing authentic native harvests directly from small family farms to your kitchen table.",
  });

  const [savedData, setSavedData] = useState<AboutContentInput>(formData);
  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "preview" | "split">("split");
  const [uploadingImg1, setUploadingImg1] = useState(false);
  const [uploadingImg2, setUploadingImg2] = useState(false);

  const fileInputId1 = useId();
  const fileInputId2 = useId();

  const hasUnsavedChanges = JSON.stringify(formData) !== JSON.stringify(savedData);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleChange = (field: keyof AboutContentInput, value: string) => {
    setStatusMessage(null);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (index: 1 | 2, file: File) => {
    const setUploading = index === 1 ? setUploadingImg1 : setUploadingImg2;
    setUploading(true);
    setStatusMessage(null);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await uploadAboutImageAction(fd);
      if (res.ok) {
        if (index === 1) {
          setFormData((prev) => ({ ...prev, about_image_1: res.url }));
        } else {
          setFormData((prev) => ({ ...prev, about_image_2: res.url }));
        }
        setStatusMessage({ type: "success", text: `Image ${index} uploaded successfully.` });
      } else {
        setStatusMessage({ type: "error", text: res.error || "Failed to upload image." });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Error uploading image." });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    setStatusMessage(null);
    startTransition(async () => {
      const res = await saveAboutContentAction(formData);
      if (res.ok) {
        setSavedData(formData);
        setStatusMessage({ type: "success", text: "About page updated successfully." });
      } else {
        setStatusMessage({ type: "error", text: res.error || "Failed to save about page." });
      }
    });
  };

  return (
    <div className="space-y-6 max-w-6xl pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl sm:text-3xl text-ink">About Page Editor</h1>
            {hasUnsavedChanges && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[0.65rem] font-medium bg-amber-100 text-amber-800 border border-amber-300">
                Unsaved changes
              </span>
            )}
          </div>
          <p className="text-xs text-ink-soft mt-1">
            Edit the content, photos, and story displayed at{" "}
            <code className="text-forest font-mono">/about</code>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/about"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost ink text-xs !py-1.5 px-3 inline-flex items-center gap-1.5 border border-line"
            title="Open public /about page in new tab"
          >
            <span>View Live</span>
            <ExternalLink size={13} />
          </Link>

          <button
            type="button"
            data-testid="save-about-btn"
            onClick={handleSave}
            disabled={isPending || !hasUnsavedChanges}
            className="btn btn-primary text-xs !py-1.5 px-4 inline-flex items-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>

      {/* Notification banner */}
      {statusMessage && (
        <div
          data-testid="about-status-banner"
          className={`flex items-center gap-2 p-3 text-sm rounded border ${
            statusMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {statusMessage.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* View tabs for smaller screens or toggling */}
      <div className="flex items-center gap-1 border-b border-line pb-2 lg:hidden">
        <button
          type="button"
          onClick={() => setActiveTab("edit")}
          className={`px-3 py-1.5 text-xs font-medium rounded inline-flex items-center gap-1.5 ${
            activeTab === "edit"
              ? "bg-forest text-cream"
              : "text-ink-soft hover:text-ink hover:bg-paper-deep"
          }`}
        >
          <Edit3 size={13} />
          <span>Editor</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("preview")}
          className={`px-3 py-1.5 text-xs font-medium rounded inline-flex items-center gap-1.5 ${
            activeTab === "preview"
              ? "bg-forest text-cream"
              : "text-ink-soft hover:text-ink hover:bg-paper-deep"
          }`}
        >
          <Eye size={13} />
          <span>Live Preview</span>
        </button>
      </div>

      {/* Main Grid: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Form */}
        <div
          className={`lg:col-span-7 space-y-6 ${
            activeTab === "preview" ? "hidden lg:block" : "block"
          }`}
        >
          {/* Section 1: Intro & Header */}
          <div className="bg-white border border-line p-5 rounded space-y-4">
            <div className="border-b border-line pb-2">
              <h2 className="font-serif text-lg text-ink">1. Header & Intro</h2>
              <p className="text-xs text-ink-soft">The top hero section of the about page.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1">
                Tamil Tagline / Kicker
              </label>
              <input
                type="text"
                data-testid="about-tamil-badge-input"
                value={formData.about_tamil_badge}
                onChange={(e) => handleChange("about_tamil_badge", e.target.value)}
                placeholder="e.g. உங்களில் ஒருவர்"
                className="input !py-1.5 text-sm w-full font-tamil"
              />
              <span className="text-[0.7rem] text-ink-soft mt-0.5 block">
                Displayed in terracotta font above the main title.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1">
                Page Title / Brand Heading
              </label>
              <input
                type="text"
                data-testid="about-title-input"
                value={formData.about_title}
                onChange={(e) => handleChange("about_title", e.target.value)}
                placeholder="e.g. Ungalil Oruvar"
                className="input !py-1.5 text-sm w-full font-serif text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1">
                Introductory Narrative
              </label>
              <textarea
                data-testid="about-intro-input"
                rows={3}
                value={formData.about_intro}
                onChange={(e) => handleChange("about_intro", e.target.value)}
                placeholder="Intro text about the store and products..."
                className="input !py-2 text-sm w-full leading-relaxed"
              />
            </div>
          </div>

          {/* Section 2: Editorial Photos */}
          <div className="bg-white border border-line p-5 rounded space-y-6">
            <div className="border-b border-line pb-2">
              <h2 className="font-serif text-lg text-ink">2. Editorial Photos</h2>
              <p className="text-xs text-ink-soft">
                Two photographs placed side-by-side below the intro text.
              </p>
            </div>

            {/* Photo 1 */}
            <div className="border border-line/60 p-4 rounded bg-zinc-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-ink">Photo 1 (Left)</span>
                {formData.about_image_1 && (
                  <span className="text-[0.65rem] text-emerald-700 font-mono">Configured</span>
                )}
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-24 h-20 shrink-0 border border-line rounded overflow-hidden bg-paper-deep">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    data-testid="about-img1-preview"
                    src={formData.about_image_1}
                    alt={formData.about_image_1_alt || "Photo 1 preview"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/farm-dawn.jpg";
                    }}
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <div>
                    <label className="block text-[0.65rem] uppercase text-ink-soft mb-0.5">Image URL</label>
                    <input
                      type="text"
                      data-testid="about-img1-input"
                      value={formData.about_image_1}
                      onChange={(e) => handleChange("about_image_1", e.target.value)}
                      placeholder="/images/farm-dawn.jpg"
                      className="input !py-1 text-xs font-mono w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] uppercase text-ink-soft mb-0.5">Alt Text</label>
                    <input
                      type="text"
                      data-testid="about-img1-alt-input"
                      value={formData.about_image_1_alt}
                      onChange={(e) => handleChange("about_image_1_alt", e.target.value)}
                      placeholder="e.g. Farm at dawn"
                      className="input !py-1 text-xs w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Presets and Upload */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-line/40">
                <label
                  htmlFor={fileInputId1}
                  className="btn btn-ghost text-[0.7rem] !py-1 px-2 border border-line cursor-pointer inline-flex items-center gap-1 hover:bg-white"
                >
                  <Upload size={12} />
                  <span>{uploadingImg1 ? "Uploading..." : "Upload File"}</span>
                </label>
                <input
                  id={fileInputId1}
                  data-testid="about-img1-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(1, file);
                  }}
                />

                <span className="text-[0.68rem] text-ink-soft">Presets:</span>
                {PRESET_IMAGES.slice(0, 3).map((p) => (
                  <button
                    key={p.url}
                    type="button"
                    onClick={() => {
                      handleChange("about_image_1", p.url);
                      handleChange("about_image_1_alt", p.alt);
                    }}
                    className="text-[0.68rem] underline text-forest hover:text-earth"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo 2 */}
            <div className="border border-line/60 p-4 rounded bg-zinc-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-ink">Photo 2 (Right)</span>
                {formData.about_image_2 && (
                  <span className="text-[0.65rem] text-emerald-700 font-mono">Configured</span>
                )}
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-24 h-20 shrink-0 border border-line rounded overflow-hidden bg-paper-deep">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    data-testid="about-img2-preview"
                    src={formData.about_image_2}
                    alt={formData.about_image_2_alt || "Photo 2 preview"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/soil-hands.jpg";
                    }}
                  />
                </div>

                <div className="flex-1 space-y-2">
                  <div>
                    <label className="block text-[0.65rem] uppercase text-ink-soft mb-0.5">Image URL</label>
                    <input
                      type="text"
                      data-testid="about-img2-input"
                      value={formData.about_image_2}
                      onChange={(e) => handleChange("about_image_2", e.target.value)}
                      placeholder="/images/soil-hands.jpg"
                      className="input !py-1 text-xs font-mono w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-[0.65rem] uppercase text-ink-soft mb-0.5">Alt Text</label>
                    <input
                      type="text"
                      data-testid="about-img2-alt-input"
                      value={formData.about_image_2_alt}
                      onChange={(e) => handleChange("about_image_2_alt", e.target.value)}
                      placeholder="e.g. Soil in working hands"
                      className="input !py-1 text-xs w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Presets and Upload */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-line/40">
                <label
                  htmlFor={fileInputId2}
                  className="btn btn-ghost text-[0.7rem] !py-1 px-2 border border-line cursor-pointer inline-flex items-center gap-1 hover:bg-white"
                >
                  <Upload size={12} />
                  <span>{uploadingImg2 ? "Uploading..." : "Upload File"}</span>
                </label>
                <input
                  id={fileInputId2}
                  data-testid="about-img2-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(2, file);
                  }}
                />

                <span className="text-[0.68rem] text-ink-soft">Presets:</span>
                {PRESET_IMAGES.slice(1, 4).map((p) => (
                  <button
                    key={p.url}
                    type="button"
                    onClick={() => {
                      handleChange("about_image_2", p.url);
                      handleChange("about_image_2_alt", p.alt);
                    }}
                    className="text-[0.68rem] underline text-forest hover:text-earth"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Story Narrative (#story) */}
          <div className="bg-white border border-line p-5 rounded space-y-4">
            <div className="border-b border-line pb-2">
              <h2 className="font-serif text-lg text-ink">3. Our Story Section (#story)</h2>
              <p className="text-xs text-ink-soft">
                Anchored at <code className="text-forest font-mono">/about#story</code> and linked from top navigation.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1">
                Story Tamil Subheading
              </label>
              <input
                type="text"
                data-testid="story-tamil-input"
                value={formData.story_tamil}
                onChange={(e) => handleChange("story_tamil", e.target.value)}
                placeholder="e.g. நமது மண்ணில் வேரூன்றியது"
                className="input !py-1.5 text-sm w-full font-tamil"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1">
                Story English Title
              </label>
              <input
                type="text"
                data-testid="story-title-input"
                value={formData.story_title}
                onChange={(e) => handleChange("story_title", e.target.value)}
                placeholder="e.g. Rooted in Our Soil"
                className="input !py-1.5 text-sm w-full font-serif text-base"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-soft mb-1">
                Story Narrative Body
              </label>
              <textarea
                data-testid="story-body-input"
                rows={5}
                value={formData.story_body}
                onChange={(e) => handleChange("story_body", e.target.value)}
                placeholder="Detailed story and philosophy of the brand..."
                className="input !py-2 text-sm w-full leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Live Preview Column */}
        <div
          className={`lg:col-span-5 ${
            activeTab === "edit" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="sticky top-20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink">
                <Eye size={14} className="text-forest" />
                <span>Live Storefront Preview</span>
              </div>
              <span className="text-[0.65rem] bg-paper-deep text-ink-soft px-2 py-0.5 rounded border border-line/60">
                /about
              </span>
            </div>

            {/* Rendered Preview Card */}
            <div className="border border-line rounded-lg overflow-hidden bg-paper shadow-sm">
              {/* Mock Browser Header */}
              <div className="bg-paper-deep px-3 py-2 border-b border-line flex items-center gap-2 text-xs text-ink-soft">
                <div className="flex gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                </div>
                <div className="flex-1 bg-white/80 border border-line rounded px-2 py-0.5 text-[0.68rem] text-center font-mono truncate">
                  ungalil-oruvan.vercel.app/about
                </div>
              </div>

              {/* Preview Content Container */}
              <div className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
                <div>
                  {formData.about_tamil_badge && (
                    <p className="font-tamil text-2xl md:text-3xl font-semibold text-forest leading-tight">
                      {formData.about_tamil_badge}
                    </p>
                  )}
                  <h1 className="font-serif text-2xl md:text-3xl text-ink leading-tight mt-0.5">
                    {formData.about_title}
                  </h1>
                  <p className="mt-4 text-sm leading-relaxed text-ink-soft whitespace-pre-line">
                    {formData.about_intro}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="h-32 bg-paper-deep rounded overflow-hidden border border-line/60">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.about_image_1}
                      alt={formData.about_image_1_alt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/images/farm-dawn.jpg";
                      }}
                    />
                  </div>
                  <div className="h-32 bg-paper-deep rounded overflow-hidden border border-line/60">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.about_image_2}
                      alt={formData.about_image_2_alt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/images/soil-hands.jpg";
                      }}
                    />
                  </div>
                </div>

                <section id="preview-story" className="pt-4 border-t border-line/40">
                  {formData.story_tamil && (
                    <p className="font-tamil text-xl md:text-2xl font-semibold text-forest leading-tight">{formData.story_tamil}</p>
                  )}
                  <h2 className="font-serif text-xl md:text-2xl text-ink leading-tight mt-0.5">
                    {formData.story_title}
                  </h2>
                  <p className="mt-3 text-xs leading-relaxed text-ink/80 whitespace-pre-line">
                    {formData.story_body}
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
