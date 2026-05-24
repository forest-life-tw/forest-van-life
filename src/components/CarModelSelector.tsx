"use client";
import { useState } from "react";
import CarModelViewer from "./CarModelViewer";

type Model3dItem = { label: string; url: string };

export default function CarModelSelector({ items, carName }: { items: Model3dItem[]; carName: string }) {
  const [active, setActive] = useState(0);

  if (items.length === 0) return null;

  if (items.length === 1) {
    return <CarModelViewer src={items[0].url} alt={`${carName} 3D 模型 - 森活家露營車改裝`} />;
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setActive(idx)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              active === idx
                ? "border-emerald-700 bg-emerald-700 text-white"
                : "border-stone-300 text-stone-600 hover:border-emerald-400 hover:text-emerald-700"
            }`}
          >
            {item.label || `模型 ${idx + 1}`}
          </button>
        ))}
      </div>
      <CarModelViewer src={items[active].url} alt={`${carName} ${items[active].label} 3D 模型 - 森活家露營車改裝`} />
    </div>
  );
}
