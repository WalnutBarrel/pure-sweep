"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-start justify-center p-4 sm:p-6 sm:items-center overflow-y-auto">
      <div className="absolute inset-0 bg-stone-900/40" onClick={onCancel} />
      <div className="relative bg-white border border-stone-200 p-6 max-w-sm w-full mx-auto my-auto space-y-4 animate-enter-fade shadow-2xl shrink-0">
        <h3 className="text-[15px] font-sans font-bold uppercase tracking-wider text-stone-900">{title}</h3>
        <p className="text-[13px] text-stone-500 leading-relaxed">{description}</p>
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest text-stone-600 border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest text-white transition-colors cursor-pointer disabled:opacity-50 ${
              destructive
                ? "bg-red-600 hover:bg-red-700 border border-red-600"
                : "bg-stone-900 hover:bg-stone-800 border border-stone-900"
            }`}
          >
            {loading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
