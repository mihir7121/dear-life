"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  MapPin,
  Calendar,
  Tag,
  Smile,
  ImageIcon,
  FileText,
  Globe,
  Search,
} from "lucide-react";
import { CATEGORIES, MOODS } from "@/lib/categories";
import { getCategoryColor } from "@/lib/utils";
import { MediaUploader, type UploadedMedia } from "./MediaUploader";
import type { Memory, Category } from "@/types";

const STEPS = [
  { id: 1, label: "Category & Date", icon: Calendar },
  { id: 2, label: "Location", icon: MapPin },
  { id: 3, label: "Story", icon: FileText },
  { id: 4, label: "Media", icon: ImageIcon },
  { id: 5, label: "Details", icon: Tag },
];

interface MemoryFormProps {
  initialData?: Partial<Memory>;
  mode?: "create" | "edit";
}

interface FormData {
  title: string;
  description: string;
  category: Category;
  date: string;
  endDate: string;
  locationName: string;
  latitude: string;
  longitude: string;
  address: string;
  city: string;
  country: string;
  tags: string;
  mood: string;
  colorTheme: string;
  rating: number;
  favorite: boolean;
  published: boolean;
}

export function MemoryForm({ initialData, mode = "create" }: MemoryFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [mediaItems, setMediaItems] = useState<UploadedMedia[]>(
    initialData?.mediaItems?.map((m, i) => ({
      id: m.id,
      url: m.url,
      thumbnailUrl: m.thumbnailUrl ?? undefined,
      publicId: m.publicId ?? undefined,
      type: m.type as "image" | "video",
      caption: m.caption ?? undefined,
      orderIndex: i,
    })) ?? [],
  );
  const [coverMediaId, setCoverMediaId] = useState<string>(
    initialData?.coverMediaId ?? "",
  );
  const [locationSearching, setLocationSearching] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState<any[]>([]);
  const [tagInput, setTagInput] = useState("");

  const [form, setForm] = useState<FormData>({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    category: (initialData?.category as Category) ?? "travel",
    date: initialData?.date ? new Date(initialData.date).toISOString().slice(0, 10) : "",
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().slice(0, 10) : "",
    locationName: initialData?.locationName ?? "",
    latitude: initialData?.latitude?.toString() ?? "",
    longitude: initialData?.longitude?.toString() ?? "",
    address: initialData?.address ?? "",
    city: initialData?.city ?? "",
    country: initialData?.country ?? "",
    tags: initialData?.tags?.join(", ") ?? "",
    mood: initialData?.mood ?? "",
    colorTheme: initialData?.colorTheme ?? getCategoryColor(initialData?.category ?? "travel"),
    rating: initialData?.rating ?? 0,
    favorite: initialData?.favorite ?? false,
    published: initialData?.published ?? true,
  });

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const searchLocation = async (query: string) => {
    if (!query.trim()) return;
    setLocationSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
      );
      const data = await res.json();
      setLocationResults(data);
    } catch {
      setLocationResults([]);
    }
    setLocationSearching(false);
  };

  const selectLocation = (result: any) => {
    const parts = result.display_name.split(", ");
    setForm((prev) => ({
      ...prev,
      locationName: result.display_name.split(",")[0],
      latitude: result.lat,
      longitude: result.lon,
      address: result.display_name,
      city: parts[1] ?? "",
      country: parts[parts.length - 1] ?? "",
    }));
    setLocationResults([]);
    setLocationQuery(result.display_name.split(",")[0]);
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    const existing = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const newTag = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (!existing.includes(newTag)) {
      setForm((prev) => ({
        ...prev,
        tags: [...existing, newTag].join(", "),
      }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    const existing = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    setForm((prev) => ({
      ...prev,
      tags: existing.filter((t) => t !== tag).join(", "),
    }));
  };

  const canAdvance = () => {
    switch (step) {
      case 1:
        return form.category && form.date && form.title.trim().length > 0;
      case 2:
        return form.locationName.trim() && form.latitude && form.longitude;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return true;
    }
  };

  const buildPayload = (published: boolean) => {
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    return {
      title: form.title,
      description: form.description,
      category: form.category,
      date: form.date,
      endDate: form.endDate || null,
      locationName: form.locationName,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      address: form.address || null,
      city: form.city || null,
      country: form.country || null,
      tags,
      mood: form.mood || null,
      colorTheme: form.colorTheme || null,
      rating: form.rating || null,
      favorite: form.favorite,
      published,
      coverMediaId: coverMediaId || null,
      mediaItems: mediaItems
        .filter((m) => !m.uploading && !m.error && m.url)
        .map((m, i) => ({
          type: m.type,
          url: m.url,
          thumbnailUrl: m.thumbnailUrl || null,
          publicId: m.publicId || null,
          caption: m.caption || null,
          orderIndex: i,
        })),
    };
  };

  const submit = async (published = true) => {
    if (published) setSaving(true);
    else setSavingDraft(true);

    try {
      const payload = buildPayload(published);
      const url = mode === "edit" && initialData?.id
        ? `/api/memories/${initialData.id}`
        : "/api/memories";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      router.push(`/dashboard/memories/${data.id}`);
      router.refresh();
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
      setSavingDraft(false);
    }
  };

  const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isDone = step > s.id;
          return (
            <div key={s.id} className="flex items-center gap-2">
              <button
                onClick={() => isDone && setStep(s.id)}
                disabled={!isDone && !isActive}
                className="flex flex-col items-center gap-1"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-depth"
                      : isDone
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`text-[10px] font-medium hidden sm:block ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 w-8 lg:w-12 rounded-full transition-colors ${
                    step > s.id ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Form steps */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ── STEP 1: Category & Date ── */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-bold text-2xl mb-1">What kind of memory is this?</h2>
                <p className="text-muted-foreground text-sm">Pick a category, give it a title, and mark when it happened.</p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">Memory title *</label>
                <input
                  type="text"
                  placeholder="e.g. Dinner at Noma, Taylor Swift in Sydney..."
                  value={form.title}
                  onChange={set("title")}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 text-base"
                  autoFocus
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-3">Category *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          category: cat.value as Category,
                          colorTheme: cat.color,
                        }))
                      }
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                        form.category === cat.value
                          ? "border-transparent shadow-depth"
                          : "border-border bg-background hover:border-primary/30"
                      }`}
                      style={
                        form.category === cat.value
                          ? { background: cat.bgColor, color: cat.color, borderColor: cat.color + "50" }
                          : {}
                      }
                    >
                      <span>{cat.icon}</span>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={set("date")}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End date <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={set("endDate")}
                    min={form.date}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Location ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-bold text-2xl mb-1">Where did this happen?</h2>
                <p className="text-muted-foreground text-sm">Search for a place or enter coordinates manually.</p>
              </div>

              {/* Location search */}
              <div className="relative">
                <label className="block text-sm font-medium mb-2">Search location</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Eiffel Tower, Tokyo, Madison Square Garden..."
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchLocation(locationQuery)}
                    className="w-full pl-9 pr-20 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <button
                    type="button"
                    onClick={() => searchLocation(locationQuery)}
                    disabled={locationSearching}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-lg hover:opacity-90 disabled:opacity-50"
                  >
                    {locationSearching ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      "Search"
                    )}
                  </button>
                </div>

                {/* Results dropdown */}
                {locationResults.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-popover border border-border rounded-xl shadow-depth-lg overflow-hidden">
                    {locationResults.map((result, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => selectLocation(result)}
                        className="flex items-start gap-2 w-full px-4 py-3 text-left hover:bg-secondary transition-colors text-sm border-b border-border last:border-0"
                      >
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2 text-sm">{result.display_name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Manual fields */}
              <div>
                <label className="block text-sm font-medium mb-2">Location name *</label>
                <input
                  type="text"
                  placeholder="e.g. Café de Flore, Fushimi Inari..."
                  value={form.locationName}
                  onChange={set("locationName")}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Latitude *</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 48.8566"
                    value={form.latitude}
                    onChange={set("latitude")}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Longitude *</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 2.3522"
                    value={form.longitude}
                    onChange={set("longitude")}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    placeholder="Paris"
                    value={form.city}
                    onChange={set("city")}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <input
                    type="text"
                    placeholder="France"
                    value={form.country}
                    onChange={set("country")}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Story ── */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-bold text-2xl mb-1">Tell the story</h2>
                <p className="text-muted-foreground text-sm">Write about what made this memory worth keeping. There's no word limit — be honest, be vivid.</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Your story</label>
                <textarea
                  placeholder="The best way to describe it is..."
                  value={form.description}
                  onChange={set("description")}
                  rows={10}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none text-sm leading-relaxed"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  {form.description.length} characters
                </p>
              </div>
            </div>
          )}

          {/* ── STEP 4: Media ── */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-bold text-2xl mb-1">Add your photos & videos</h2>
                <p className="text-muted-foreground text-sm">3–10 media items make the richest memories. Drag to reorder. Star to set as cover.</p>
              </div>
              <MediaUploader
                value={mediaItems}
                onChange={setMediaItems}
                coverMediaId={coverMediaId}
                onCoverChange={setCoverMediaId}
                maxFiles={10}
              />
            </div>
          )}

          {/* ── STEP 5: Details ── */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-bold text-2xl mb-1">Finishing touches</h2>
                <p className="text-muted-foreground text-sm">Add tags, a mood, a rating — whatever helps you find and feel this memory later.</p>
              </div>

              {/* Mood */}
              <div>
                <label className="block text-sm font-medium mb-3">Mood</label>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map((m) => (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          mood: prev.mood === m.value ? "" : m.value,
                        }))
                      }
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                        form.mood === m.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {m.emoji} {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2.5 rounded-xl bg-primary/10 text-primary font-medium text-sm hover:bg-primary/20 transition-colors"
                  >
                    Add
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1.5 text-sm px-3 py-1 rounded-full bg-secondary border border-border"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({ ...prev, rating: prev.rating === r ? 0 : r }))
                      }
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
                        form.rating >= r ? "text-yellow-400 scale-110" : "text-muted-foreground/30"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Favorite */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm((prev) => ({ ...prev, favorite: !prev.favorite }))}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    form.favorite ? "bg-rose-500" : "bg-border"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      form.favorite ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
                <span className="text-sm font-medium">Mark as favorite ♥</span>
              </label>

              {/* Color theme */}
              <div>
                <label className="block text-sm font-medium mb-2">Memory color</label>
                <div className="flex gap-3 flex-wrap">
                  {["#8b5cf6", "#f97316", "#f59e0b", "#3b82f6", "#10b981", "#f43f5e", "#eab308", "#22c55e", "#a855f7", "#06b6d4"].map(
                    (color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, colorTheme: color }))}
                        className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                          form.colorTheme === color ? "scale-110 ring-2 ring-offset-2 ring-offset-background ring-foreground" : ""
                        }`}
                        style={{ background: color }}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex gap-3">
          {step === STEPS.length ? (
            <>
              <button
                type="button"
                onClick={() => submit(false)}
                disabled={savingDraft}
                className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50"
              >
                {savingDraft ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save draft"}
              </button>
              <button
                type="button"
                onClick={() => submit(true)}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-depth"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    {mode === "edit" ? "Save changes" : "Publish memory"}
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(STEPS.length, s + 1))}
              disabled={!canAdvance()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 shadow-depth"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
