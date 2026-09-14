"use client";

import { useState, useTransition, useEffect } from "react";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, Plus, Trash2, ArrowUp, ArrowDown, Check, AlertCircle, Loader2 } from "lucide-react";
import type { NavigationItem } from "@/lib/db/types";
import { saveNavigationItemsAction } from "@/lib/actions/navigation";
import { uid } from "@/lib/utils";

interface EditableItem {
  id: string;
  label: string;
  url: string;
  is_active: boolean;
  display_order: number;
}

export function NavigationEditor({ initialItems }: { initialItems: NavigationItem[] }) {
  const [items, setItems] = useState<EditableItem[]>(() =>
    initialItems.map((it, idx) => ({
      id: it.id,
      label: it.label,
      url: it.url,
      is_active: it.is_active,
      display_order: it.display_order ?? idx + 1,
    }))
  );

  const [initialSnapshot, setInitialSnapshot] = useState<string>(() =>
    JSON.stringify(initialItems.map((it, idx) => ({
      id: it.id,
      label: it.label,
      url: it.url,
      is_active: it.is_active,
      display_order: it.display_order ?? idx + 1,
    })))
  );

  const [isPending, startTransition] = useTransition();
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const hasUnsavedChanges = JSON.stringify(items) !== initialSnapshot;

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

  const updateItem = (id: string, field: keyof EditableItem, value: any) => {
    setStatusMessage(null);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    setStatusMessage(null);
    const newItem: EditableItem = {
      id: uid(),
      label: "NEW LINK",
      url: "/new-link",
      is_active: true,
      display_order: items.length + 1,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) {
      alert("At least one navigation item must remain.");
      return;
    }
    setStatusMessage(null);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    setStatusMessage(null);
    const newItems = [...items];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);
    setItems(newItems);
  };

  const handleSave = () => {
    setStatusMessage(null);

    // Validate
    for (const item of items) {
      if (!item.label.trim()) {
        setStatusMessage({ type: "error", text: "All navigation items must have a label." });
        return;
      }
      if (!item.url.trim()) {
        setStatusMessage({ type: "error", text: "All navigation items must have a valid URL." });
        return;
      }
    }

    startTransition(async () => {
      const payload = items.map((it, idx) => ({
        id: it.id,
        label: it.label.trim(),
        url: it.url.trim(),
        is_active: it.is_active,
        display_order: idx + 1,
      }));

      const res = await saveNavigationItemsAction(payload);
      if (res.ok) {
        setInitialSnapshot(JSON.stringify(payload));
        setStatusMessage({ type: "success", text: "Navigation updated successfully! Changes are live on the store." });
      } else {
        setStatusMessage({ type: "error", text: res.error || "Failed to save navigation." });
      }
    });
  };

  const handleReset = () => {
    try {
      const parsed = JSON.parse(initialSnapshot);
      setItems(parsed);
      setStatusMessage(null);
    } catch {
      // noop
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
        <div>
          <h1 className="text-2xl font-semibold">Header Navigation</h1>
          <p className="mt-1 text-xs text-ink-soft">
            Manage public website header links. Drag to reorder, edit labels/URLs, or toggle visibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded">
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              Unsaved changes
            </span>
          )}

          {hasUnsavedChanges && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isPending}
              className="btn btn-ghost ink text-xs !py-1.5 px-3"
            >
              Discard
            </button>
          )}

          <button
            type="button"
            data-testid="save-navigation-btn"
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

      {statusMessage && (
        <div
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

      {/* Header labels */}
      <div className="hidden sm:grid grid-cols-[36px_1fr_1fr_100px_90px] gap-3 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft border-b border-line">
        <span title="Reorder">Order</span>
        <span>Navigation Label</span>
        <span>Destination URL</span>
        <span className="text-center">Status</span>
        <span className="text-right">Actions</span>
      </div>

      {/* Reorderable list */}
      <Reorder.Group
        axis="y"
        values={items}
        onReorder={(newOrder) => {
          setStatusMessage(null);
          setItems(newOrder);
        }}
        className="space-y-2"
      >
        {items.map((item, index) => (
          <NavigationRow
            key={item.id}
            item={item}
            index={index}
            totalCount={items.length}
            onUpdate={updateItem}
            onRemove={removeItem}
            onMove={moveItem}
          />
        ))}
      </Reorder.Group>

      {/* Add new button */}
      <div className="pt-2">
        <button
          type="button"
          data-testid="add-navigation-btn"
          onClick={addItem}
          className="btn btn-ghost ink text-xs !py-2 px-3 inline-flex items-center gap-1.5 border border-dashed border-line hover:border-black/30 w-full sm:w-auto justify-center"
        >
          <Plus size={15} />
          <span>Add Navigation Item</span>
        </button>
      </div>
    </div>
  );
}

function NavigationRow({
  item,
  index,
  totalCount,
  onUpdate,
  onRemove,
  onMove,
}: {
  item: EditableItem;
  index: number;
  totalCount: number;
  onUpdate: (id: string, field: keyof EditableItem, value: any) => void;
  onRemove: (id: string) => void;
  onMove: (index: number, direction: "up" | "down") => void;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      as="li"
      value={item}
      dragListener={false}
      dragControls={dragControls}
      data-testid="nav-row"
      data-nav-id={item.id}
      data-nav-label={item.label.toLowerCase().replace(/\s+/g, "-")}
      className={`grid grid-cols-1 sm:grid-cols-[36px_1fr_1fr_100px_90px] items-center gap-3 p-3 bg-white border rounded shadow-xs transition-colors ${
        item.is_active ? "border-line" : "border-line/40 bg-zinc-50/70 opacity-75"
      }`}
    >
      {/* Drag handle & order buttons */}
      <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-1">
        <div
          onPointerDown={(e) => dragControls.start(e)}
          className="cursor-grab active:cursor-grabbing p-1 text-ink-soft hover:text-ink select-none touch-none"
          title="Drag to reorder"
          aria-label="Drag handle"
        >
          <GripVertical size={18} />
        </div>

        {/* Mobile order helpers */}
        <div className="flex sm:hidden items-center gap-1">
          <button
            type="button"
            onClick={() => onMove(index, "up")}
            disabled={index === 0}
            className="p-1 text-ink-soft hover:text-ink disabled:opacity-30"
            title="Move up"
          >
            <ArrowUp size={14} />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, "down")}
            disabled={index === totalCount - 1}
            className="p-1 text-ink-soft hover:text-ink disabled:opacity-30"
            title="Move down"
          >
            <ArrowDown size={14} />
          </button>
        </div>
      </div>

      {/* Label */}
      <div>
        <label className="block text-[0.65rem] uppercase text-ink-soft sm:hidden mb-1">Label</label>
        <input
          type="text"
          name="nav_label"
          data-testid="nav-label-input"
          value={item.label}
          onChange={(e) => onUpdate(item.id, "label", e.target.value)}
          placeholder="e.g. SHOP"
          className="input !py-1.5 text-sm w-full font-medium"
        />
      </div>

      {/* URL */}
      <div>
        <label className="block text-[0.65rem] uppercase text-ink-soft sm:hidden mb-1">URL</label>
        <input
          type="text"
          name="nav_url"
          data-testid="nav-url-input"
          value={item.url}
          onChange={(e) => onUpdate(item.id, "url", e.target.value)}
          placeholder="e.g. /shop"
          className="input !py-1.5 text-sm w-full font-mono text-xs"
        />
      </div>

      {/* Status */}
      <div className="flex items-center sm:justify-center gap-2">
        <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs select-none">
          <input
            type="checkbox"
            data-testid="nav-active-checkbox"
            checked={item.is_active}
            onChange={(e) => onUpdate(item.id, "is_active", e.target.checked)}
            className="rounded border-line text-forest focus:ring-forest h-4 w-4 cursor-pointer"
          />
          <span className={item.is_active ? "text-emerald-700 font-medium" : "text-ink-soft"}>
            {item.is_active ? "Active" : "Hidden"}
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          data-testid="move-up-btn"
          onClick={() => onMove(index, "up")}
          disabled={index === 0}
          className="hidden sm:inline-flex p-1.5 text-ink-soft hover:text-ink disabled:opacity-20 transition"
          title="Move up"
        >
          <ArrowUp size={14} />
        </button>
        <button
          type="button"
          data-testid="move-down-btn"
          onClick={() => onMove(index, "down")}
          disabled={index === totalCount - 1}
          className="hidden sm:inline-flex p-1.5 text-ink-soft hover:text-ink disabled:opacity-20 transition"
          title="Move down"
        >
          <ArrowDown size={14} />
        </button>
        <button
          type="button"
          data-testid="delete-btn"
          onClick={() => onRemove(item.id)}
          className="p-1.5 text-ink-soft hover:text-rose-600 transition"
          title="Delete navigation item"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </Reorder.Item>
  );
}
