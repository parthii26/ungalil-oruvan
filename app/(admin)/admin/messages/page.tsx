import { listAllMessages } from "@/lib/repositories/contact";
import { formatDateTime } from "@/lib/formatters";
import { markReadAction, deleteMessageAction } from "@/lib/actions/contact";

export const metadata = { title: "Messages" };

export default function AdminMessagesPage() {
  const messages = listAllMessages();
  const unread = messages.filter((m) => !m.read).length;
  return (
    <div>
      <h1 className="font-serif text-3xl md:text-4xl">
        Messages
        {unread > 0 && (
          <span className="ml-3 text-base font-sans bg-[#203123] text-white px-2.5 py-0.5 rounded-full">
            {unread} new
          </span>
        )}
      </h1>
      {messages.length === 0 && (
        <p className="mt-6 text-ink-soft">No messages received yet.</p>
      )}
      <ul className="mt-8 divide-y divide-line border-b border-line">
        {messages.map((m) => (
          <li key={m.id} className={`py-4 ${m.read ? "opacity-70" : ""}`}>
            <div className="flex flex-wrap justify-between items-start gap-2">
              <div>
                <span className="font-medium">{m.name}</span>
                <span className="text-sm text-ink-soft ml-2">{m.email}</span>
                {!m.read && (
                  <span className="ml-2 text-xs bg-[#203123] text-white px-1.5 py-0.5 rounded">
                    New
                  </span>
                )}
              </div>
              <span className="text-xs text-ink-soft">{formatDateTime(m.created_at)}</span>
            </div>
            <p className="mt-2 text-sm whitespace-pre-wrap">{m.message}</p>
            <div className="mt-3 flex gap-4">
              {!m.read && (
                <form action={markReadAction.bind(null, m.id)}>
                  <button className="text-xs underline underline-offset-4 text-forest font-medium">
                    Mark as read
                  </button>
                </form>
              )}
              <form action={deleteMessageAction.bind(null, m.id)}>
                <button className="text-xs text-ink-soft hover:text-red-700 underline underline-offset-4">
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
