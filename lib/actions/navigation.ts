"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { ForbiddenError, ValidationError, toUserMessage } from "@/lib/errors";
import { navigationListSchema, type NavigationItemInput } from "@/lib/validations/navigation";
import { saveAllNavigationItems, deleteNavigationItem } from "@/lib/repositories/navigation";

async function requireAdmin() {
  const session = await getSession();
  if (session?.role !== "admin") throw new ForbiddenError("Admin access only.");
  return session;
}

export async function saveNavigationItemsAction(rawItems: unknown) {
  try {
    await requireAdmin();
    const parsed = navigationListSchema.safeParse(rawItems);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const msg = issue ? `${issue.message}` : "Invalid navigation items data.";
      return { ok: false as const, error: msg };
    }

    if (parsed.data.length === 0) {
      return { ok: false as const, error: "At least one navigation item is required." };
    }

    saveAllNavigationItems(parsed.data);

    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/navigation");

    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: toUserMessage(err) };
  }
}

export async function deleteNavigationItemAction(id: string) {
  try {
    await requireAdmin();
    deleteNavigationItem(id);

    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/admin/navigation");

    return { ok: true as const };
  } catch (err) {
    return { ok: false as const, error: toUserMessage(err) };
  }
}
