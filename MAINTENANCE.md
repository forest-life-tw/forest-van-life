# 森活家官網維護

## 本地驗證

使用相容的 Node.js 與 npm，執行 `npm ci`、`npm run lint`、`npm run build`。預覽：`npm run start -- -H 127.0.0.1 -p 3001`。
改版使用 `improve/consultation-seo` 分支。分支推送可能觸發 Vercel Preview；只有合併正式分支或另外提升部署，才應更新正式網站。不要把本地或 Preview 驗證當成正式上線。

## 諮詢頁與設定

- `/about` 為整合諮詢頁；保留 `/about#contact`，團隊介紹為 `/about#team`。
- 聯絡資訊沿用 `content/site-config.json` 的 `contact`，避免不同頁面維護多份。
- `about.services` 與 `about.consultationSteps` 為字串陣列，每項使用 `標題｜說明`，以第一個全形直線切分。
- 需求表只在瀏覽器整理文字，不寫入伺服器、不自動傳送 LINE；使用者自行確認及送出。
- 原照片在 `public/consultation`，不重新調色、不自行標註未確認車型。

## 內容責任

文章統一顯示「內容維護：森活家施工團隊」，連至團隊介紹。這不是每篇已完成專業審稿的聲明。
Markdown 可選 frontmatter：`author`、`reviewer`、`reviewedAt`。只有真實撰寫者才填 author；reviewer 與 reviewedAt 必須對應實際完成的覆核，兩者都有才顯示。
目前管理介面尚未提供這三個欄位的專用輸入，需編輯 Markdown。不要為搜尋排名虛填姓名、證照、審稿或更新日期。

## 搜尋設定

正式網址集中在 `src/lib/metadata.ts`；正式換域時需同步核對 canonical、OG、robots、sitemap 與商家資料。
sitemap 依啟用文章分類產生，重複 slug 保留第一個，與文章解析一致。

## 外部服務界線

管理後台儲存會透過 GitHub API 產生 commit，媒體上傳使用 Vercel Blob；不得當作無外部影響的本地測試。
不要將正式金鑰寫入原始碼、文件、截圖或測試資料。已核對原 Vercel 專案、正式網域與 Blob 連結；實際還原權限仍待驗證。GITHUB_TOKEN 目前只套用 Production，Blob 寫入 token 則套用所有環境，Preview 驗證不可上傳或刪除正式素材。
commit、push、公開部署須先取得阿雍明確授權。備份與還原方案另行驗證。
