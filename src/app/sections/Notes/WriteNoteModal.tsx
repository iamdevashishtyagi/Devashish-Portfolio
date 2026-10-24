"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Sparkles,
  Send,
  Check,
  Upload,
  Trash2,
  Lock,
  Building,
  Briefcase,
  Mail,
  Eye,
  Loader2,
} from "lucide-react";
import { ALLOWED_NOTE_COLORS, NoteColor, GuestbookNote } from "@/src/app/lib/guestbook-types";
import { PRESET_AVATARS, AvatarSvg, AvatarDisplay } from "@/src/app/lib/avatars";
import { collectClientTelemetry } from "@/src/app/lib/telemetry";

interface WriteNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNoteAdded: (note: GuestbookNote) => void;
}

export default function WriteNoteModal({
  isOpen,
  onClose,
  onNoteAdded,
}: WriteNoteModalProps) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [selectedColor, setSelectedColor] = useState<NoteColor>(ALLOWED_NOTE_COLORS[0]);
  const [avatar, setAvatar] = useState<string>("dev"); // default preset
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle client-side canvas crop & Cloudinary upload pipeline
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image is too large. Please select a photo under 10MB.");
      return;
    }

    setIsUploadingPhoto(true);
    setError(null);

    try {
      // 1. Process client-side canvas crop (150x150)
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          const img = new Image();
          img.onload = () => {
            try {
              const canvas = document.createElement("canvas");
              const size = 150;
              canvas.width = size;
              canvas.height = size;
              const ctx = canvas.getContext("2d");
              if (!ctx) return reject(new Error("Canvas context unavailable"));

              const minDim = Math.min(img.width, img.height);
              const sx = (img.width - minDim) / 2;
              const sy = (img.height - minDim) / 2;
              ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

              let croppedUrl = canvas.toDataURL("image/webp", 0.85);
              if (!croppedUrl.startsWith("data:image/webp")) {
                croppedUrl = canvas.toDataURL("image/jpeg", 0.85);
              }
              resolve(croppedUrl);
            } catch (err) {
              reject(err);
            }
          };
          img.onerror = () => reject(new Error("Could not load image"));
          img.src = loadEvt.target?.result as string;
        };
        reader.onerror = () => reject(new Error("Could not read file"));
        reader.readAsDataURL(file);
      });

      // 2. Upload to Cloudinary via server endpoint (/api/upload)
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });

      const uploadData = await uploadRes.json();
      if (uploadRes.ok && uploadData.url) {
        setAvatar(uploadData.url);
      } else {
        // Fallback to client cropped dataUrl
        setAvatar(dataUrl);
      }
    } catch {
      setError("Failed to process photo. Please try another image.");
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || message.trim().length < 3) {
      setError("Please write a short note before sending!");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const telemetry = collectClientTelemetry();

      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Anonymous Visitor",
          company: company.trim() || undefined,
          role: role.trim() || undefined,
          email: email.trim() || undefined,
          message: message.trim().slice(0, 200),
          color: selectedColor,
          avatar,
          telemetry,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to post note");
      }

      onNoteAdded(data.note);

      // Reset form
      setMessage("");
      setName("");
      setCompany("");
      setRole("");
      setEmail("");
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCustomUploaded =
    avatar.startsWith("data:image/") ||
    avatar.startsWith("http://") ||
    avatar.startsWith("https://");

  const subtitlePreview = [role.trim(), company.trim()].filter(Boolean).join(" at ");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2-Column Split Modal Dialog */}
      <div className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl border border-slate-200 z-10 overflow-hidden text-slate-900 max-h-[92vh] flex flex-col md:flex-row">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: Live Card Preview & Privacy Assurance        */}
        {/* ========================================================= */}
        <div className="md:w-5/12 bg-slate-50/90 border-b md:border-b-0 md:border-r border-slate-200 p-5 sm:p-7 flex flex-col justify-between shrink-0">
          <div>
            {/* Preview Section Header */}
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100/70 text-amber-900 border border-amber-200/80">
                <Eye className="w-3.5 h-3.5 text-amber-700" /> Live Preview
              </span>
              <span className="text-xs text-slate-400 font-medium">Updates as you type</span>
            </div>

            {/* The Actual Sticky Note Preview Card */}
            <div
              className="relative p-5 sm:p-6 rounded-2xl border border-black/10 shadow-lg transition-all duration-300 min-h-[200px] flex flex-col justify-between"
              style={{ backgroundColor: selectedColor }}
            >
              {/* Paper Washi Tape Pin Accent */}
              <div
                className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 rounded-xs bg-white/50 backdrop-blur-xs border border-black/5 shadow-2xs rotate-[-1deg]"
                aria-hidden="true"
              />

              {/* Note Content */}
              <div className="pt-1.5">
                <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-wrap break-words min-h-[70px] font-normal font-sans">
                  {message.trim() || "Your note will appear right here on the wall..."}
                </p>
              </div>

              {/* Footer / Author Bar */}
              <div className="mt-4 pt-3.5 border-t border-black/8 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <AvatarDisplay avatar={avatar} name={name} size="sm" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-slate-900 truncate text-xs">
                      {name.trim() || "Your Name"}
                    </span>
                    {subtitlePreview && (
                      <span className="text-[11px] text-slate-600 truncate mt-0.5 opacity-80">
                        {subtitlePreview}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 font-medium shrink-0 ml-auto">
                  Just now
                </span>
              </div>
            </div>
          </div>

          {/* Privacy Note at Bottom of Left Column */}
          <div className="mt-5 pt-4 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-start gap-2 leading-relaxed">
            <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-700 font-semibold">Privacy First:</strong> Your email and device IP are strictly private for Devashish and will never be shown publicly on this card.
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Form Fields & Actions                       */}
        {/* ========================================================= */}
        <div className="md:w-7/12 p-5 sm:p-7 flex flex-col justify-between overflow-y-auto max-h-[85vh]">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1">
                <Sparkles className="w-3 h-3 text-emerald-600" /> Devashish&apos;s Portfolio Wall
              </div>
              <h3 id="modal-title" className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Before you Leave, Leave a note
              </h3>
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* 1. Color Picker */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Card Color
              </label>
              <div className="flex items-center gap-2">
                {ALLOWED_NOTE_COLORS.map((color) => {
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                      className={`w-7 h-7 rounded-full border-2 transition-transform flex items-center justify-center ${
                        isSelected
                          ? "border-slate-900 scale-110 shadow-md ring-2 ring-slate-900/20"
                          : "border-black/10 hover:scale-105"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-slate-900" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Avatar / Profile Photo Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Profile Photo / Avatar
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {/* 8 Preset Avatars */}
                {PRESET_AVATARS.map((p) => {
                  const isSelected = avatar === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setAvatar(p.id)}
                      title={p.name}
                      className={`relative w-8 h-8 rounded-full overflow-hidden transition-all border-2 ${
                        isSelected
                          ? "border-slate-900 ring-2 ring-slate-900/20 scale-110 shadow-sm"
                          : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"
                      }`}
                    >
                      <AvatarSvg id={p.id} />
                    </button>
                  );
                })}

                {/* Cloudinary Photo Upload */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    isCustomUploaded
                      ? "bg-slate-900 text-white border-slate-900 ring-2 ring-slate-900/20"
                      : "bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {isUploadingPhoto ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3 h-3" />
                      {isCustomUploaded ? "Change" : "Upload"}
                    </>
                  )}
                </button>

                {isCustomUploaded && (
                  <button
                    type="button"
                    onClick={() => setAvatar("dev")}
                    title="Remove custom photo"
                    className="p-1 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 3. Your Name */}
            <div>
              <label htmlFor="note-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Your name <span className="text-red-500">*</span>
              </label>
              <input
                id="note-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={45}
                placeholder="e.g. Sarah Connor"
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* 4. Company & Designation (2-column layout) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="note-company" className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                    <Building className="w-3 h-3 text-slate-400" /> Where do you work?
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">optional</span>
                </div>
                <input
                  id="note-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  maxLength={60}
                  placeholder="Company (e.g. Google, Startup)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="note-role" className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-slate-400" /> Your role
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">optional</span>
                </div>
                <input
                  id="note-role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  maxLength={60}
                  placeholder="Designation (e.g. Product Designer)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* 5. Email (only I'll see this) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="note-email" className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" /> Email
                </label>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Lock className="w-2.5 h-2.5" /> only I’ll see this
                </span>
              </div>
              <input
                id="note-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={100}
                placeholder="your.email@example.com"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
              />
            </div>

            {/* 6. Your Note (0 / 200) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="note-message" className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Your note <span className="text-red-500">*</span>
                </label>
                <span className={`text-xs ${message.length > 180 ? "text-amber-600 font-semibold" : "text-slate-400"}`}>
                  {message.length} / 200
                </span>
              </div>
              <textarea
                id="note-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={200}
                rows={3}
                placeholder="Share your thoughts, feedback, or a quick note before you leave..."
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isUploadingPhoto || !message.trim()}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Posting...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Post Note
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
