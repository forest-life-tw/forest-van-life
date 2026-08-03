"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

const DISMISS_KEY = "fvl_qr_popup_dismissed";

export default function QrCodePopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) return;
    setVisible(true);
  }, []);

  function close() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 px-4">
      <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <button
          onClick={close}
          aria-label="關閉"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
        >
          ✕
        </button>

        <h3 className="mb-4 pr-8 text-center text-lg font-semibold text-stone-900">
          歡迎光臨森活家露營車
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <div className="overflow-hidden rounded-lg border border-stone-200 p-2">
              <Image
                src="/qrcodes/website-qrcode.png"
                alt="森活家官網 QR Code"
                width={140}
                height={140}
                className="h-auto w-full"
              />
            </div>
            <p className="mt-2 text-sm font-medium text-stone-700">森活家官網</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="overflow-hidden rounded-lg border border-stone-200 p-2">
              <Image
                src="/qrcodes/line-qrcode.png"
                alt="官方 LINE QR Code"
                width={140}
                height={140}
                className="h-auto w-full"
              />
            </div>
            <p className="mt-2 text-sm font-medium text-stone-700">官方 LINE</p>
          </div>
        </div>
      </div>
    </div>
  );
}
