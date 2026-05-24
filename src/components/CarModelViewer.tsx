"use client";
import React from "react";
import Script from "next/script";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        alt?: string;
        "camera-controls"?: boolean | string;
        "auto-rotate"?: boolean | string;
        "shadow-intensity"?: string;
        ar?: boolean | string;
        style?: React.CSSProperties;
      };
    }
  }
}

export default function CarModelViewer({ src, alt }: { src: string; alt: string }) {
  return (
    <>
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js"
        strategy="lazyOnload"
      />
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
        <model-viewer
          src={src}
          alt={alt}
          camera-controls
          auto-rotate
          shadow-intensity="1"
          ar
          style={{ width: "100%", height: "420px", background: "transparent" }}
        />
        <p className="py-2 text-center text-xs text-stone-400">
          滑鼠拖曳旋轉 · 滾輪縮放 · 行動裝置可用 AR 觀看
        </p>
      </div>
    </>
  );
}
