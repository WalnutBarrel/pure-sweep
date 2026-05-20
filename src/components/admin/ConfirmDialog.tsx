"use client";

import { useState } from "react";

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  destructive?: boolean;
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
  destructive = false,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white border border-stone-200 p-6 max-w-sm w-full mx-4 space-y-4 animate-enter-fade">
        <h3 className="text-[15px] font-semibold text-stone-900">{title}</h3>
        <p className="text-[13px] text-stone-500 leading-relaxed">{description}</p>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-[12px] font-medium text-stone-600 border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`px-4 py-2 text-[12px] font-medium text-white transition-colors cursor-pointer disabled:opacity-50 ${
              destructive
                ? "bg-red-600 hover:bg-red-700 border border-red-600"
                : "bg-stone-900 hover:bg-stone-800 border border-stone-900"
            }`}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
