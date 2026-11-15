"use client";

import React, { useState } from "react";
import { ChildProfile } from "@/lib/types";
import { getAvatarById } from "@/lib/child-profiles/constants";
import { Icons } from "../ui/Icons";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  profile: ChildProfile | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteConfirmationModal({
  isOpen,
  profile,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !profile) return null;

  const avatar = getAvatarById(profile.avatarId);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity">
      <div
        className="relative w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3.5 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20">
            <Icons.Trash2 size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Delete Child Profile</h3>
            <p className="text-xs text-zinc-400">This action cannot be undone.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 mb-5 flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${avatar.bgColor} text-2xl shadow-md`}
          >
            {avatar.emoji}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">{profile.name}</h4>
            <p className="text-xs text-zinc-400">
              Age {profile.age} • {profile.ageGroup} Group
            </p>
          </div>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed mb-6">
          Are you sure you want to delete <span className="font-semibold text-white">{profile.name}&apos;s</span> profile?
          Their personalized watch history, saved content preferences, and settings will be permanently removed.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-full px-4 py-2 text-xs font-semibold text-zinc-400 hover:bg-zinc-800 hover:text-white transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-red-600/30 hover:bg-red-500 transition disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Icons.Trash2 size={14} />
                <span>Confirm Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
