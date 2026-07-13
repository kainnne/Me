# 朱璽的個人網站

這個儲存庫用來製作與維護朱璽的個人介紹網站。目前第一版位於 [`v1/`](./v1)，著重呈現 AI、數位教學、研究與音樂創作的能力與方向；它不是套用模板，而是以原生網頁技術從零建立。

## 目前完成內容

- 單頁式個人網站：自我介紹、現在投入、中英雙語履歷詳述、專業能力、探索方向與聯絡方式。
- 夢幻粉色視覺系統，以及桌機、平板與手機的響應式版面。
- 手機導覽選單、平滑捲動與鍵盤使用者可用的「跳至主要內容」連結。
- 履歷資料和版面分離，未來加入大頭照、UI/UX 或 LLM 專案時，不需要重寫網站。

## 本機預覽

直接用瀏覽器開啟 [`v1/index.html`](./v1/index.html) 即可。若使用 VS Code，建議安裝 **Live Server** 擴充功能，對 `v1/index.html` 選擇「Open with Live Server」，每次儲存後瀏覽器會自動更新。

## 檔案說明

```
v1/
├── index.html  # 網頁結構
├── style.css   # 顏色、字體、版面與響應式規則
├── data.js     # 個人資料、經歷、技能、專案、連結（主要編輯位置）
└── main.js     # 將資料呈現在網頁上，以及手機選單互動
profile/        # 原始履歷與素材，僅供製作時參考
```

## 日後更新內容

一般情況只需要編輯 [`v1/data.js`](./v1/data.js)：

- `about`、`facts`：更新自我介紹與基本資料。
- `experiences`：更新首頁的精簡經歷。
- `bilingualResume`：更新完整的中英文工作經驗、學歷與論文內容。
- `skills`：新增或調整能力標籤。
- `projects`：加入 UI/UX、LLM 或其他專案，每項可設定名稱、介紹與外部連結。
- `socials`、`email`：更新聯絡方式。

未來加入大頭照時，建議把圖片放在 `v1/assets/`，再於 `index.html` 加入圖片區塊，這樣網站資產會集中在 `v1` 中。

## 上傳 GitHub

在專案根目錄執行：

```bash
git init
git add README.md v1 profile
git commit -m "Create first version of personal website"
```

之後在 GitHub 建立空白 repository，依 GitHub 顯示的步驟加入遠端網址並推送。若原始履歷 PDF 或個人素材不想公開，請在第一次 `git add` 前將 `profile/` 加入 `.gitignore`。
