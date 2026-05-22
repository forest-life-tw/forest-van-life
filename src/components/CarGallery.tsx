"use client";
import Image from "next/image";
import { useState } from "react";

export default function CarGallery({ images, carName }: { images: string[]; carName: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  function prev() {
    setLightbox((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }
  function next() {
    setLightbox((i) => (i === null ? null : (i + 1) % images.length));
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((url, i) => (
          <button
            key={url}
            onClick={() => setLightbox(i)}
            className="group relative aspect-video overflow-hidden rounded-xl border border-stone-200 bg-stone-100"
          >
            <Image
              src={url}
              alt={`${carName} 改裝實績 ${i + 1}`}
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

      {/* Lightbox */}
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
            className="relative max-h-[90vh] max-w-5xl w-full mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightbox]}
              alt={`${carName} ${lightbox + 1}`}
              width={1200}
              height={800}
              className="rounded-xl object-contain max-h-[85vh] w-full"
            />
            <p className="mt-2 text-center text-sm text-white/60">
              {lightbox + 1} / {images.length}
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
            className="absolute top-4 right-4 rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
