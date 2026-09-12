# Kainnne — Personal Portal

<https://kainnne.com> 是 Kaine Zhu 的個人品牌入口：集中展示產品、網站、知識系統、研究與持續進行中的創作實驗。這一版刻意不再以學歷或工作年表為主，而是讓訪客直接進入作品。

## 網站特色

- 夢幻粉紅與深莓色的雙模式視覺系統
- 作品分類篩選、滑鼠立體卡片、捲動進場與細節動畫
- `⌘/Ctrl + K` 作品快速入口
- 完整手機導覽、觸控版面與 `prefers-reduced-motion`
- Person／ProfilePage／WebSite 結構化資料、`robots.txt` 與 `sitemap.xml`
- 集中式網站 metadata 與建置前 GEO／SEO 同步檢查
- 統一的粉紅幾何 `K` 主視覺、favicon、Apple touch icon 與社群分享圖片
- 允許搜尋引擎與 OAI-SearchBot 索引的 GEO／SEO 基礎
- 頁尾顯示免 Cookie 的公開總瀏覽數
- GitHub Actions 自動建置並部署到 GitHub Pages

## 搜尋與 GEO

- 正式 canonical URL：`https://kainnne.com/`
- Sitemap：`https://kainnne.com/sitemap.xml`
- Robots：`https://kainnne.com/robots.txt`
- 結構化資料描述 `Kainnne`、`Kaine Zhu`、`朱璽` 與主要作品之間的關聯。
- `robots.txt` 明確允許 `OAI-SearchBot`，讓網站具備進入 ChatGPT 搜尋結果的技術條件。

部署後仍需由網域擁有者在 Google Search Console 與 Bing Webmaster Tools 驗證網域並提交 sitemap；技術設定能協助發現與理解網站，但不保證排名或被引用。

頁尾瀏覽數由 [Hits](https://hits.sh/docs/) 提供。這是公開的頁面載入次數，不是去除重複訪客後的唯一人數，也可能包含機器人流量。

## 更新作品

所有入口資料集中在 `src/projects.json`，並由 `src/projects.ts` 提供型別。新增一個 `Project` 物件就會同步出現在作品網格、分類數量、快速搜尋選單與 JSON-LD，不需要改動主要頁面。

網站名稱、正式網址、個人公開名稱關係、品牌圖片與社群連結集中在 `src/siteMetadata.json`。修改上述資料後執行：

```bash
npm run seo:generate
npm run seo:check
```

產生器會同步 `index.html`、`robots.txt`、`sitemap.xml` 與 `site.webmanifest`；CI 會在部署前阻擋未同步的 GEO／SEO artifacts。

主視覺的來源檔、固定網址、新網站接法與日後更換流程記錄在 [`brand-assets/README.md`](brand-assets/README.md)。

## 履歷入口

- 中文：<https://kainnne.com/resume/>；英文：<https://kainnne.com/resume/en.html>，沿用 GitHub Pages，免登入瀏覽。
- 單一內容來源：`public/resume/resume.zh.md` 與 `public/resume/resume.en.md`。修改 Markdown 後執行 `npm run resume:generate`；`npm run resume:check` 檢查 HTML 是否同步。正式 build 會自動產生兩份 HTML，無 JavaScript 時也能閱讀內容。
- 使用 LumaReader Web 的閱讀介面：22 組色系、深淺色、字級、11 種介面語言、四種閱讀排列、目錄、搜尋與圖片瀏覽。公開履歷隱藏原文、媒體面板及 Markdown 分享入口，工具列預設只顯示設定，介面語言、閱讀模式、字級與 PDF 匯出全部預設不勾選，可由設定啟用；履歷的中英文內容獨立切換。手機直式版面使用精簡工具列。
- 初次載入沿用 LumaReader 的轉圈與閱讀準備畫面，等 Markdown、字型與照片準備完成後顯示。若讀取失敗或超時，改顯示預先產生的靜態履歷，避免停留在轉圈畫面。
- PDF 匯出開啟瀏覽器列印視窗，選擇「儲存為 PDF」。依目前內容與外框設定輸出；自訂頁尾／色框依瀏覽器支援，瀏覽器無法回報實際存檔成功與否。
- `resume-bridge.js` 只提供兩份固定 Markdown 的讀取與閱讀偏好，沒有上傳、建立、寫入、刪除或開啟任意來源的 API。上游 editor 相容節點保持 inert／停用，編輯能力固定為 false；不提供 Markdown 分享 API。閱讀偏好僅存於訪客瀏覽器。
- LumaReader Web 程式碼取自 [v1.3.1](https://github.com/kainnne/Kainnne-LumaReader/tree/1fcc69ea659ce9b15ca48fbaf8997e60b458a075/site/web)，置於 `public/resume/vendor/lumareader/`，保留 MIT 與各套件授權。適配修改包含：停用編輯／匯入／新手教學／輪詢、固定履歷路由、lazy Mermaid 路徑與瀏覽器 PDF 說明。`scripts/resume/template.html` 保留上游 HTML，產生器統一適配兩種語言。
- 保留 `noindex`，不加入主站 sitemap。含舊聯絡資訊的靜態 PDF 已撤下；PDF 由目前頁面匯出。既有 ChatGPT Sites 網址為先前版本，並非此網站的正式入口。

## Cake 履歷素材

- 逐塊複製頁：<https://kainnne.com/resume/cake/>，採白底與深灰字，可切換中文、英文或中英對照。
- 從正式 Markdown 自動拆成 14 組模組，不改寫工作內容與成果。提供含格式的整塊複製、純文字內文複製、TXT／HTML 單檔、完整文字、原始照片與 ZIP 素材包。
- 在 Cake 先新增 Profile／Lists／Paragraph 等區塊，再複製貼入文字；ZIP 並非 Cake 專用匯入檔。
- 產生器：`scripts/build-cake.mjs`；樣式與互動：`scripts/cake/`；輸出：`public/resume/cake/`。
- 正式 build 自動同步，`npm run cake:check` 驗證素材與目前 Markdown 一致。正式履歷頁只移除 Ryan 音樂網站連結，保留創作經驗。

## 本機開發

```bash
npm install
npm run dev
```

正式建置：

```bash
npm run build
```

## GitHub Pages 設定

1. 進入 `kainnne/Me` → **Settings** → **Pages**。
2. 在 **Build and deployment / Source** 選擇 **GitHub Actions**。
3. 在 **Custom domain** 輸入 `kainnne.com` 並儲存。
4. 推送到 `main` 後，`.github/workflows/deploy-pages.yml` 會自動建置與部署。

## Porkbun DNS 設定

在 Porkbun 的 **Domain Management** 找到 `kainnne.com`，按 **DNS** → **Add Record**，加入以下五筆：

| Type | Host | Answer / Value | TTL |
| --- | --- | --- | --- |
| A | 留空 | `185.199.108.153` | Default |
| A | 留空 | `185.199.109.153` | Default |
| A | 留空 | `185.199.110.153` | Default |
| A | 留空 | `185.199.111.153` | Default |
| CNAME | `www` | `kainnne.github.io` | Default |

若 Porkbun 已有指向停放頁面（例如 `pixie.porkbun.com`）的根網域 A／ALIAS，或 `www` 的舊 CNAME，先刪除那些互相衝突的網站記錄；不要誤刪郵件使用的 MX、DKIM、DMARC 或 SPF 記錄。

DNS 可能需要最多 24 小時傳播。GitHub Pages 顯示 DNS 檢查成功後，再勾選 **Enforce HTTPS**。`www.kainnne.com` 會自動轉址到主要的 `kainnne.com`。

## 專案結構

```text
src/App.tsx            # 一頁式入口、互動與元件
src/projects.json      # 可擴充作品資料與 JSON-LD 來源
src/projects.ts        # Project 型別與資料轉接
src/siteMetadata.json  # 網站、人物、品牌與搜尋 metadata 單一來源
src/styles.css         # 視覺系統、動畫與響應式設計
scripts/generate-seo.mjs # GEO／SEO artifacts 產生與一致性檢查
public/CNAME           # 自訂網域備份
.github/workflows/     # GitHub Pages 自動部署
v1/                    # 第一版網站封存
profile/               # 原始個人資料（不在入口頁呈現）
```
