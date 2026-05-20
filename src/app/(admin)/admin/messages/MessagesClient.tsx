/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { useToast } from "@/components/admin/Toast";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { updateContactMessageStatus, deleteContactMessage } from "@/actions/crud";
import { Check, Trash2 } from "lucide-react";

interface MessagesClientProps {
  messages: any[];
}

export function MessagesClient({ messages: initialMessages }: MessagesClientProps) {
  const { toast } = useToast();
  const [, startTransition] = useTransition();
  const [filter, setFilter] = useState<"ALL" | "UNREAD" | "READ">("ALL");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleToggleStatus = (id: string, currentRead: boolean) => {
    startTransition(async () => {
      const res = await updateContactMessageStatus(id, !currentRead);
      if (res.success) {
        toast(currentRead ? "Marked as unread" : "Marked as read");
      } else {
        toast("Failed to update status", "error");
      }
    });
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    const res = await deleteContactMessage(deleteConfirmId);
    if (res.success) {
      toast("Inquiry deleted successfully");
      setDeleteConfirmId(null);
    } else {
      toast("Failed to delete inquiry", "error");
    }
  };

  const filteredMessages = initialMessages.filter((msg) => {
    if (filter === "UNREAD") return !msg.read;
    if (filter === "READ") return msg.read;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filter Strip */}
      <div className="flex border-b border-stone-200 bg-white p-1 gap-1">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-4 py-2 text-[12px] font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
            filter === "ALL"
              ? "border-stone-900 text-stone-900 bg-stone-50"
              : "border-transparent text-stone-400 hover:text-stone-700"
          }`}
        >
          All Inbox ({initialMessages.length})
        </button>
        <button
          onClick={() => setFilter("UNREAD")}
          className={`px-4 py-2 text-[12px] font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
            filter === "UNREAD"
              ? "border-stone-900 text-stone-900 bg-stone-50"
              : "border-transparent text-stone-400 hover:text-stone-700"
          }`}
        >
          Unread ({initialMessages.filter((m) => !m.read).length})
        </button>
        <button
          onClick={() => setFilter("READ")}
          className={`px-4 py-2 text-[12px] font-bold uppercase tracking-wider transition-colors cursor-pointer border-b-2 ${
            filter === "READ"
              ? "border-stone-900 text-stone-900 bg-stone-50"
              : "border-transparent text-stone-400 hover:text-stone-700"
          }`}
        >
          Archived Read ({initialMessages.filter((m) => m.read).length})
        </button>
      </div>

      {/* Messages Grid */}
      <div className="space-y-4">
        {filteredMessages.map((msg) => (
          <div
            key={msg.id}
            className={`bg-white border p-5 space-y-4 hover:shadow-sm transition-all ${
              msg.read ? "border-stone-200 bg-stone-50/20" : "border-stone-900/60 shadow-sm"
            }`}
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-semibold text-stone-900">{msg.name}</h3>
                  {!msg.read && (
                    <span className="text-[9px] font-bold bg-stone-950 text-white px-2 py-0.5 uppercase tracking-wider">
                      New Inquiry
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-stone-400 space-x-2 mt-1">
                  <span>{msg.email}</span>
                  {msg.phone && <span>&middot; {msg.phone}</span>}
                </div>
              </div>
              <span className="text-[11px] font-mono text-stone-400">
                {new Date(msg.createdAt).toLocaleString("en-NZ", { dateStyle: "medium", timeStyle: "short" })}
              </span>
            </div>

            <div className="border-t border-stone-100 pt-3">
              {msg.subject && (
                <p className="text-[12px] font-semibold text-stone-850 mb-1">{msg.subject}</p>
              )}
              <p className="text-[13px] text-stone-600 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
            </div>

            <div className="border-t border-stone-100 pt-3 flex justify-between items-center gap-2 shrink-0">
              <button
                onClick={() => handleToggleStatus(msg.id, msg.read)}
                className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider border px-3 py-1.5 transition-colors cursor-pointer ${
                  msg.read
                    ? "text-stone-500 hover:text-stone-900 border-stone-200"
                    : "text-stone-900 hover:bg-stone-50 border-stone-900"
                }`}
              >
                <Check className="h-3.5 w-3.5" />
                {msg.read ? "Mark Unread" : "Mark Read"}
              </button>
              <button
                onClick={() => setDeleteConfirmId(msg.id)}
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 border border-red-100 px-3 py-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete Inquiry
              </button>
            </div>
          </div>
        ))}

        {filteredMessages.length === 0 && (
          <div className="bg-white border border-stone-200 p-8 text-center text-[13px] text-stone-400 font-medium">
            Inbox clear. No inquiries in this category.
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <ConfirmDialog
          title="Delete Contact Inquiry"
          description="Are you absolutely sure you want to delete this customer inquiry form submission? This action is permanent."
          onConfirm={handleDelete}
          onCancel={() => setDeleteConfirmId(null)}
          destructive
        />
      )}
    </div>
  );
}
