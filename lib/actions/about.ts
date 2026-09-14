"use server";

import { revalidatePath } from "next/cache";
import path from "path";
import { mkdir } from "fs/promises";
import sharp from "sharp";
import { getSession } from "@/lib/auth/session";
import { ForbiddenError, ValidationError, toUserMessage } from "@/lib/errors";
import { aboutContentSchema, type AboutContentInput } from "@/lib/validations/about";
import { saveSiteSettings } from "@/lib/services/settings";

async function requireAdmin() {
  const session = await getSession();
  if (session?.role !== "admin") throw new ForbiddenError("Admin access only.");
  return session;
}

export async function saveAboutContentAction(data: AboutContentInput) {
  try {
    await requireAdmin();
    const parsed = aboutContentSchema.safeParse(data);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return {
        ok: false as const,
        error: firstIssue ? firstIssue.message : "Invalid about page content.",
      };
    }

    saveSiteSettings({
      about_tamil_badge: parsed.data.about_tamil_badge,
      about_title: parsed.data.about_title,
      about_intro: parsed.data.about_intro,
      about_image_1: parsed.data.about_image_1,
      about_image_1_alt: parsed.data.about_image_1_alt,
      about_image_2: parsed.data.about_image_2,
      about_image_2_alt: parsed.data.about_image_2_alt,
      story_tamil: parsed.data.story_tamil,
      story_title: parsed.data.story_title,
      story_body: parsed.data.story_body,
    });

    revalidatePath("/about");
    revalidatePath("/admin/about");
    revalidatePath("/");

    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: toUserMessage(e) };
  }
}

export async function uploadAboutImageAction(formData: FormData): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  try {
    await requireAdmin();
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, error: "Please choose an image file." };
    }

    const input = Buffer.from(await file.arrayBuffer());
    const name = `about-${Date.now()}.webp`;

    const optimizedBuffer = await sharp(input)
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceRoleKey) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(supabaseUrl, serviceRoleKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const { data, error } = await supabase.storage
          .from("product-images")
          .upload(`about/${name}`, optimizedBuffer, {
            contentType: "image/webp",
            upsert: true,
          });

        if (!error && data) {
          const { data: pub } = supabase.storage
            .from("product-images")
            .getPublicUrl(`about/${name}`);
          if (pub?.publicUrl) return { ok: true, url: pub.publicUrl };
        }
      } catch (err) {
        console.warn("Supabase storage upload failed, falling back to local:", err);
      }
    }

    if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      return { ok: false, error: "Image storage is not configured for cloud deployment." };
    }

    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await sharp(optimizedBuffer).toFile(path.join(dir, name));

    return { ok: true, url: `/uploads/${name}` };
  } catch (e) {
    return { ok: false, error: toUserMessage(e) };
  }
}
