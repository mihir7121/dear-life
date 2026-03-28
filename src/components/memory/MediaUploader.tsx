"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Upload, X, ImageIcon, Video, GripVertical, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UploadedMedia {
  id: string;
  url: string;
  thumbnailUrl?: string;
  publicId?: string;
  type: "image" | "video";
  caption?: string;
  orderIndex: number;
  // Local state during upload
  localPreview?: string;
  uploading?: boolean;
  error?: string;
  file?: File;
}

interface MediaUploaderProps {
  value: UploadedMedia[];
  onChange: React.Dispatch<React.SetStateAction<UploadedMedia[]>>;
  coverMediaId?: string;
  onCoverChange?: (id: string) => void;
  maxFiles?: number;
  className?: string;
}

export function MediaUploader({
  value,
  onChange,
  coverMediaId,
  onCoverChange,
  maxFiles = 10,
  className,
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const uploadFile = useCallback(async (file: File): Promise<UploadedMedia | null> => {
    try {
      // Get a signed upload params from our API (no file data sent to Next.js)
      const sigRes = await fetch("/api/upload-signature", { method: "POST" });
      if (!sigRes.ok) throw new Error("Failed to get upload signature");
      const { signature, timestamp, folder, cloudName, apiKey } = await sigRes.json();

      const isVideo = file.type.startsWith("video/");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", String(timestamp));
      formData.append("folder", folder);
      formData.append("api_key", apiKey);

      // Upload directly to Cloudinary — bypasses Next.js body limit entirely
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/${isVideo ? "video" : "image"}/upload`,
        { method: "POST", body: formData },
      );
      if (!res.ok) throw new Error("Cloudinary upload failed");
      const data = await res.json();

      const thumbnailUrl = isVideo
        ? `https://res.cloudinary.com/${cloudName}/video/upload/so_0,pg_1,w_400,h_300,c_fill,f_jpg/${data.public_id}.jpg`
        : undefined;

      return {
        id: `uploaded-${Date.now()}-${Math.random()}`,
        url: data.secure_url,
        thumbnailUrl,
        publicId: data.public_id,
        type: isVideo ? "video" : "image",
        orderIndex: value.length,
      };
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  }, [value.length]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const remaining = maxFiles - value.length;
      const filesToProcess = acceptedFiles.slice(0, remaining);

      // Create local preview items
      const previewItems: UploadedMedia[] = filesToProcess.map((file, i) => ({
        id: `preview-${Date.now()}-${i}`,
        url: "",
        type: file.type.startsWith("video/") ? "video" : "image",
        localPreview: URL.createObjectURL(file),
        uploading: true,
        orderIndex: value.length + i,
        file,
      }));

      const withPreviews = [...value, ...previewItems];
      onChange(withPreviews);
      setUploading(true);

      // Upload in parallel
      const results = await Promise.all(filesToProcess.map((file) => uploadFile(file)));

      // Replace preview items with uploaded results (using latest snapshot)
      const finalItems = [...withPreviews];
      previewItems.forEach((preview, i) => {
        const idx = finalItems.findIndex((item) => item.id === preview.id);
        if (idx !== -1) {
          if (results[i]) {
            finalItems[idx] = { ...results[i]!, orderIndex: idx };
          } else {
            finalItems[idx] = { ...finalItems[idx], uploading: false, error: "Upload failed" };
          }
        }
      });
      onChange(finalItems);

      setUploading(false);

      // Auto-set cover to first image if none set
      if (!coverMediaId && results[0] && onCoverChange) {
        onCoverChange(results[0].id);
      }
    },
    [value, maxFiles, onChange, uploadFile, coverMediaId, onCoverChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp", ".heic"],
      "video/*": [".mp4", ".mov", ".webm"],
    },
    maxFiles: maxFiles - value.length,
    disabled: value.length >= maxFiles,
  });

  const removeItem = (id: string) => {
    const newItems = value
      .filter((item) => item.id !== id)
      .map((item, i) => ({ ...item, orderIndex: i }));
    onChange(newItems);
    if (coverMediaId === id && onCoverChange && newItems[0]) {
      onCoverChange(newItems[0].id);
    }
  };

  const updateCaption = (id: string, caption: string) => {
    onChange(value.map((item) => (item.id === id ? { ...item, caption } : item)));
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Upload zone */}
      {value.length < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            "relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-secondary/50",
            value.length >= maxFiles && "opacity-50 pointer-events-none",
          )}
        >
          <input {...getInputProps()} />
          <motion.div
            animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                isDragActive ? "bg-primary/20" : "bg-muted",
              )}
            >
              <Upload
                className={cn(
                  "w-6 h-6 transition-colors",
                  isDragActive ? "text-primary" : "text-muted-foreground",
                )}
              />
            </div>
            <div>
              <p className="font-medium text-sm">
                {isDragActive ? "Drop them in" : "Drag & drop photos or videos"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse · {value.length}/{maxFiles} uploaded
              </p>
              <p className="text-xs text-muted-foreground">
                JPG, PNG, WEBP, MP4, MOV supported
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Media grid */}
      {value.length > 0 && (
        <Reorder.Group
          axis="x"
          values={value}
          onReorder={(newOrder) =>
            onChange(newOrder.map((item, i) => ({ ...item, orderIndex: i })))
          }
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
        >
          <AnimatePresence>
            {value.map((item) => (
              <Reorder.Item
                key={item.id}
                value={item}
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={cn(
                    "relative aspect-square rounded-xl overflow-hidden border-2 transition-colors",
                    coverMediaId === item.id ? "border-primary" : "border-border",
                  )}
                >
                  {/* Media preview */}
                  {item.type === "video" ? (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      {item.localPreview ? (
                        <video src={item.localPreview} className="w-full h-full object-cover" />
                      ) : (
                        <Video className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                  ) : (
                    <img
                      src={item.localPreview || item.url}
                      alt={item.caption || ""}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Upload overlay */}
                  {item.uploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {/* Error overlay */}
                  {item.error && (
                    <div className="absolute inset-0 bg-destructive/20 flex items-center justify-center">
                      <span className="text-xs text-destructive font-medium">Failed</span>
                    </div>
                  )}

                  {/* Cover badge */}
                  {coverMediaId === item.id && (
                    <div className="absolute top-1.5 left-1.5 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      Cover
                    </div>
                  )}

                  {/* Type badge */}
                  <div className="absolute top-1.5 right-8 bg-black/50 backdrop-blur rounded-full p-1">
                    {item.type === "video" ? (
                      <Video className="w-2.5 h-2.5 text-white" />
                    ) : (
                      <ImageIcon className="w-2.5 h-2.5 text-white" />
                    )}
                  </div>

                  {/* Controls */}
                  <div className="absolute top-1.5 right-1.5 flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="w-6 h-6 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {onCoverChange && item.type === "image" && !item.uploading && (
                      <button
                        type="button"
                        onClick={() => onCoverChange(item.id)}
                        title="Set as cover"
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                          coverMediaId === item.id
                            ? "bg-primary text-white"
                            : "bg-black/60 backdrop-blur text-white hover:bg-primary/80",
                        )}
                      >
                        <Star className="w-3 h-3 fill-current" />
                      </button>
                    )}
                  </div>

                  {/* Drag handle */}
                  <div className="absolute bottom-1.5 left-1.5 cursor-grab active:cursor-grabbing text-white/70">
                    <GripVertical className="w-4 h-4" />
                  </div>
                </div>

                {/* Caption */}
                <input
                  type="text"
                  placeholder="Caption..."
                  value={item.caption || ""}
                  onChange={(e) => updateCaption(item.id, e.target.value)}
                  className="mt-1.5 w-full text-xs px-2 py-1.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-muted-foreground/50"
                />
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}

      {value.length >= maxFiles && (
        <p className="text-xs text-muted-foreground text-center">
          Maximum {maxFiles} media items reached
        </p>
      )}
    </div>
  );
}
