/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { useToast } from "@/components/admin/Toast";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { updateContactMessageStatus, deleteContactMessage } from "@/actions/crud";
import { Search, Mail, Phone, Clock, Trash2, CheckCircle2, MessageSquare, Archive, Circle } from "lucide-react";
import { MessageStatus } from "@prisma/client";

interface MessagesClientProps {
  messages: any[];
}

export function MessagesClient({ messages: initialMessages }: MessagesClientProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | MessageStatus>("ALL");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleUpdateStatus = (id: string, status: MessageStatus) => {
    startTransition(async () => {
      const res = await updateContactMessageStatus(id, status);
      if (res.success) {
        toast(`Inquiry marked as ${status.toLowerCase()}`);
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

  // 1. Search + Filter Logic
  const filteredMessages = initialMessages.filter((msg) => {
    // Status Filter
    if (statusFilter !== "ALL" && msg.status !== statusFilter) {
      return false;
    }

    // Search Query Filter
    if (searchTerm.trim() !== "") {
      const query = searchTerm.toLowerCase();
      const nameMatch = msg.name?.toLowerCase().includes(query);
      const emailMatch = msg.email?.toLowerCase().includes(query);
      const phoneMatch = msg.phone?.toLowerCase().includes(query);
      const subjectMatch = msg.subject?.toLowerCase().includes(query);
      const messageMatch = msg.message?.toLowerCase().includes(query);
      return nameMatch || emailMatch || phoneMatch || subjectMatch || messageMatch;
    }

    return true;
  });

  // Count items for badges
  const getCount = (status: "ALL" | MessageStatus) => {
    if (status === "ALL") return initialMessages.length;
    return initialMessages.filter((m) => m.status === status).length;
  };

  const getStatusStyle = (status: MessageStatus) => {
    switch (status) {
      case "NEW":
        return "bg-stone-900 text-stone-50 border border-stone-950";
      case "READ":
        return "bg-stone-100 text-stone-700 border border-stone-200/80";
      case "REPLIED":
        return "bg-emerald-50 text-emerald-700 border border-emerald-100";
      case "CLOSED":
        return "bg-stone-50 text-stone-400 border border-stone-200/50";
      default:
        return "bg-stone-100 text-stone-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filtering Dashboard Panel */}
      <div className="bg-white border border-stone-200 p-5 md:p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search inquiries by sender name, email, phone, subject, or message content..."
            className="w-full bg-stone-50 border border-stone-200 pl-10 pr-4 py-3 text-[13px] text-stone-800 placeholder-stone-400 focus:outline-none focus:border-stone-900 transition-all font-sans"
          />
        </div>

        {/* Custom Premium Tab Bar */}
        <div className="flex flex-wrap gap-1 border-t border-stone-100 pt-4">
          {(["ALL", "NEW", "READ", "REPLIED", "CLOSED"] as const).map((status) => {
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
                  isActive
                    ? "bg-stone-900 border-stone-900 text-white"
                    : "bg-white border-stone-200 text-stone-500 hover:text-stone-900 hover:border-stone-400"
                }`}
              >
                {status === "ALL" ? "All Inquiries" : status} ({getCount(status)})
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Grid */}
      <div className="space-y-4">
        {filteredMessages.map((msg) => (
          <div
            key={msg.id}
            className={`bg-white border p-5 md:p-6 space-y-4 hover:shadow-sm transition-all ${
              msg.status === "NEW" ? "border-stone-900 shadow-sm" : "border-stone-200"
            }`}
          >
            {/* Message Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[14px] font-semibold text-stone-900">{msg.name}</h3>
                  <span className={`text-[9px] font-bold px-2 py-0.5 uppercase tracking-widest ${getStatusStyle(msg.status)}`}>
                    {msg.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-stone-500">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-stone-400" />
                    {msg.email}
                  </span>
                  {msg.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-stone-400" />
                      {msg.phone}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-400 md:self-center">
                <Clock className="h-3 w-3" />
                {new Date(msg.createdAt).toLocaleString("en-NZ", { dateStyle: "medium", timeStyle: "short" })}
              </div>
            </div>

            {/* Message Body */}
            <div className="border-t border-stone-100 pt-4 space-y-2">
              {msg.subject && (
                <h4 className="text-[13px] font-bold text-stone-850">
                  Subject: <span className="font-medium text-stone-600">{msg.subject}</span>
                </h4>
              )}
              <div className="bg-stone-50/50 p-4 border border-stone-100 text-[13px] text-stone-600 leading-relaxed whitespace-pre-wrap font-sans">
                {msg.message}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="border-t border-stone-100 pt-4 flex flex-wrap justify-between items-center gap-3">
              {/* Quick Status Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {msg.status !== "READ" && (
                  <button
                    disabled={isPending}
                    onClick={() => handleUpdateStatus(msg.id, "READ")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-stone-200 hover:border-stone-800 text-[10px] font-bold uppercase tracking-wider text-stone-600 hover:text-stone-900 bg-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Archive className="h-3 w-3" />
                    Mark Read
                  </button>
                )}

                {msg.status !== "REPLIED" && (
                  <button
                    disabled={isPending}
                    onClick={() => handleUpdateStatus(msg.id, "REPLIED")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-emerald-200 hover:border-emerald-700 hover:bg-emerald-50 text-[10px] font-bold uppercase tracking-wider text-emerald-600 hover:text-emerald-800 bg-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <MessageSquare className="h-3 w-3" />
                    Mark Replied
                  </button>
                )}

                {msg.status !== "CLOSED" && (
                  <button
                    disabled={isPending}
                    onClick={() => handleUpdateStatus(msg.id, "CLOSED")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-stone-200 hover:border-stone-600 text-[10px] font-bold uppercase tracking-wider text-stone-500 hover:text-stone-800 bg-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Close inquiry
                  </button>
                )}

                {msg.status !== "NEW" && (
                  <button
                    disabled={isPending}
                    onClick={() => handleUpdateStatus(msg.id, "NEW")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-stone-850 hover:bg-stone-50 text-[10px] font-bold uppercase tracking-wider text-stone-800 bg-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Circle className="h-2.5 w-2.5 fill-current" />
                    Mark New
                  </button>
                )}
              </div>

              {/* Delete Button */}
              <button
                disabled={isPending}
                onClick={() => setDeleteConfirmId(msg.id)}
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-red-100 hover:border-red-650 hover:bg-red-50 text-[10px] font-bold uppercase tracking-wider text-red-600 hover:text-red-750 bg-white transition-colors cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="h-3 w-3" />
                Delete Submission
              </button>
            </div>
          </div>
        ))}

        {filteredMessages.length === 0 && (
          <div className="bg-white border border-stone-200 p-12 text-center text-[13px] text-stone-400 font-medium font-sans">
            No inquiries match the current search filters.
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
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
