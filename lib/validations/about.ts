import { z } from "zod";

export const aboutContentSchema = z.object({
  about_tamil_badge: z.string().trim().max(100, "Tamil badge must be 100 characters or less").default(""),
  about_title: z.string().trim().min(1, "Title is required").max(120, "Title must be 120 characters or less"),
  about_intro: z.string().trim().min(1, "Intro text is required").max(1500, "Intro text must be 1500 characters or less"),
  about_image_1: z.string().trim().min(1, "Image 1 URL is required"),
  about_image_1_alt: z.string().trim().max(200, "Alt text must be 200 characters or less").default(""),
  about_image_2: z.string().trim().min(1, "Image 2 URL is required"),
  about_image_2_alt: z.string().trim().max(200, "Alt text must be 200 characters or less").default(""),
  story_tamil: z.string().trim().max(100, "Story Tamil heading must be 100 characters or less").default(""),
  story_title: z.string().trim().min(1, "Story title is required").max(120, "Story title must be 120 characters or less"),
  story_body: z.string().trim().min(1, "Story narrative is required").max(3000, "Story narrative must be 3000 characters or less"),
});

export type AboutContentInput = z.infer<typeof aboutContentSchema>;
