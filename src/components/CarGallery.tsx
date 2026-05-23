"use client";
import Image from "next/image";
import { useState } from "react";

type ImageGroup = { name: string; images: string[] };

type Props = {
  imageGroups?: ImageGroup[];
  images?: string[];
  carName: string;
};

export default function CarGallery({ imageGroups, images = [], carName }: Props) {
  const groups: ImageGroup[] =
    imageGroups && imageGroups.length > 0
      ? imageGroups
      : images.length > 0
      ? [{ name: "改裝實績", images }]
      : [];

  const [activeIdx, setActiveIdx] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (groups.length === 0) return null;

  const current = groups[activeIdx] ?? groups[0];

  function prev() {
    setLightbox((i) => (i === null ? null : (i - 1 + current.images.length) % current.images.length));
  }
  function next() {
    setLightbox((i) => (i === null ? null : (i + 1) % current.images.length));
  }

  return (
    <>
      {groups.length > 1 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {groups.map((g, i) => (
            <button
              key={i}
              onClick={() => { setActiveIdx(i); setLightbox(null); }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                i === activeIdx
                  ? "bg-emerald-700 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {g.name}
              <span className="ml-1.5 text-xs opacity-70">({g.images.length})</span>
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {current.images.map((url, i) => (
          <button
            key={url}
            onClick={() => setLightbox(i)}
            className="group relative aspect-video overflow-hidden rounded-xl border border-stone-200 bg-stone-100"
          >
            <Image
              src={url}
              alt={`${carName} ${current.name} ${i + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20">
              <svg className="opacity-0 group-hover:opacity-100 transition-opacity" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 rounded-full bg-white/20 p-3 text-white hover:bg-white/30"
          >
            ←
          </button>

          <div
            className="relative mx-16 w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current.images[lightbox]}
              alt={`${carName} ${lightbox + 1}`}
              width={1200}
              height={800}
              className="max-h-[85vh] w-full rounded-xl object-contain"
            />
            <p className="mt-2 text-center text-sm text-white/60">
              {groups.length > 1 && <span className="mr-2">{current.name} ·</span>}
              {lightbox + 1} / {current.images.length}
            </p>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 rounded-full bg-white/20 p-3 text-white hover:bg-white/30"
          >
            →
          </button>

          <button
            onClick={() => setLightbox(null)}
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
