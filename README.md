# Kaine Zhu — Personal Website

朱璽（Kaine Zhu）的互動式個人網站，呈現 AI 軟體、數位學習、資料系統、研究與音樂創作經驗。

線上網站：<https://zx50416.github.io/Me/>

## 設計概念

這一版採用「先吸引、再探索」的資訊架構：首頁先提供定位、代表成果與明確導向；技能和完整雙語履歷預設收合，由訪客自行選擇想深入的部分。動畫以 CSS 與少量原生 JavaScript 製作，並支援手機、鍵盤操作與 `prefers-reduced-motion`。

## 檔案結構

```text
index.html  # 網站結構、SEO 與社群分享資訊
style.css   # 視覺系統、響應式排版與動畫
data.js     # 個人資料、技能、成果及完整中英文履歷
main.js     # 資料渲染、收合、導覽、捲動動畫與複製 Email
profile/    # 原始履歷與參考素材
v1/         # 第一版網站封存
```

## 更新內容

大部分更新只需要編輯 `data.js`：

- `capabilities`：首頁可展開的能力分類。
- `highlights`：預設顯示的三項代表成果。
- `bilingualResume`：工作經驗、論文、學歷與其他經驗的中英文內容。
- `facts`、`about`、`socials`：簡介與聯絡資料。

若要調整版面或動畫，編輯 `style.css`；若要改變收合或互動方式，編輯 `main.js`。

## 本機預覽

可直接開啟 `index.html`，或在專案根目錄啟動任何靜態檔案伺服器，例如 VS Code Live Server。

## 部署

網站由 GitHub Pages 發佈，來源為 `main` 分支的根目錄。根目錄的 `.nojekyll` 會讓 GitHub Pages 直接提供靜態檔案，不進行 Jekyll 處理。
