"use client";

export function ConfirmSubmit({
  action,
  label,
  message,
}: {
  action: () => Promise<void> | void;
  label: string;
  message: string;
}) {
  return (
    <form
      action={async () => {
        if (!window.confirm(message)) return;
        await action();
      }}
    >
      <button type="submit">{label}</button>
    </form>
  );
}
