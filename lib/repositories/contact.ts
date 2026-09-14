import { loadDb, mutate } from "@/lib/db/store";
import type { ContactMessage } from "@/lib/db/types";
import { nowIso, uid } from "@/lib/utils";

export function listAllMessages() {
  return loadDb()
    .contact_messages.slice()
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function createMessage(input: Omit<ContactMessage, "id" | "read" | "created_at">) {
  return mutate((db) => {
    const row: ContactMessage = {
      ...input,
      id: uid(),
      read: false,
      created_at: nowIso(),
    };
    db.contact_messages.push(row);
    return row;
  });
}

export function markRead(id: string) {
  mutate((db) => {
    const row = db.contact_messages.find((m) => m.id === id);
    if (row) row.read = true;
  });
}

export function deleteMessage(id: string) {
  mutate((db) => {
    db.contact_messages = db.contact_messages.filter((m) => m.id !== id);
  });
}

export function unreadCount() {
  return loadDb().contact_messages.filter((m) => !m.read).length;
}
