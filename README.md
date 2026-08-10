# Kainnne — Personal Portal

<https://kainnne.com> 是 Kaine Zhu 的個人品牌入口：集中展示產品、網站、知識系統、研究與持續進行中的創作實驗。這一版刻意不再以學歷或工作年表為主，而是讓訪客直接進入作品。

## 網站特色

- 夢幻粉紅與深莓色的雙模式視覺系統
- 作品分類篩選、滑鼠立體卡片、捲動進場與細節動畫
- `⌘/Ctrl + K` 作品快速入口
- 完整手機導覽、觸控版面與 `prefers-reduced-motion`
- GitHub Actions 自動建置並部署到 GitHub Pages

## 更新作品

所有入口資料集中在 `src/projects.ts`。新增一個 `Project` 物件就會同步出現在作品網格、分類數量與快速搜尋選單，不需要改動主要頁面。

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
src/projects.ts        # 可擴充作品資料
src/styles.css         # 視覺系統、動畫與響應式設計
public/CNAME           # 自訂網域備份
.github/workflows/     # GitHub Pages 自動部署
v1/                    # 第一版網站封存
profile/               # 原始個人資料（不在入口頁呈現）
```
