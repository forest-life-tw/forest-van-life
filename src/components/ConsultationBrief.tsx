"use client";

import { useState, type FormEvent } from "react";
import styles from "@/app/about/consultation.module.css";

export default function ConsultationBrief() {
  const [brief, setBrief] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const vehicle = String(data.get("vehicle") ?? "").trim();
    const needs = String(data.get("needs") ?? "").trim();
    setBrief(`你好，我想諮詢森活家改裝。\n車型：${vehicle || "想先討論車型"}\n方向：${data.get("scope")}\n需求：${needs || "希望先聊聊配置方向"}`);
    setStatus("已整理，確認後可複製到 LINE。");
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(brief ?? "");
      setStatus("已複製，請到 LINE 貼上並確認後送出。");
    } catch {
      setStatus("無法自動複製，請選取上方文字後手動複製到 LINE。");
    }
  }

  return <div>
    <form className={styles.form} onSubmit={prepare}>
      <label>車型<input name="vehicle" maxLength={100} placeholder="例如：VW Caddy maxi" /></label>
      <label>這次想做的方向<select name="scope"><option>全車客製裝潢</option><option>單項改裝升級</option><option>配件與安裝</option><option>想先聊聊方向</option></select></label>
      <label className={styles.full}>主要用途與想調整的地方<textarea name="needs" maxLength={1500} placeholder="例如：兩人出遊，希望討論床面、收納與冷氣配置。" /></label>
      <div className={`${styles.full} ${styles.formActions}`}><button className={styles.btn} type="submit">整理諮詢內容</button><span className={styles.note}>選填，不填也能直接諮詢。</span></div>
      <p className={`${styles.full} ${styles.note}`}>這裡只幫你整理文字，不會自動送出或儲存。確認後，再自行複製到 LINE。</p>
    </form>
    {brief !== null && <div className={styles.result}>
      <label>你的諮詢內容，可自行修改<textarea value={brief} onChange={event => setBrief(event.target.value)} /></label>
      <button type="button" className={`${styles.btn} ${styles.light}`} onClick={copy}>複製諮詢內容</button>
    </div>}
    <p className={styles.note} role="status" aria-live="polite">{status}</p>
  </div>;
}
