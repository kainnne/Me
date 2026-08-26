# Kainnne 品牌主視覺

`kainnne-primary-visual-v1.png` 是目前正式的 Kainnne 品牌總圖案：透明背景、流線 ribbon K。它是原始保存檔，不直接由頁面程式重畫，也不應被拉伸或加上白色、黑色底圖。

## 線上固定入口

- 品牌圖片：`https://kainnne.com/brand/kainnne-mark.png`
- 機器可讀資訊：`https://kainnne.com/brand/brand.json`

所有 Kainnne 網站的 favicon、Apple 圖示與 Open Graph／Twitter 分享圖片，應由單一 metadata／layout 設定引用上面的品牌圖片。新建立的 `*.kainnne.com` 網站也使用同一網址；DNS 不會自動加入網頁圖示，仍需在新網站的 `<head>` 或框架 metadata 中套用這項設定。

```html
<link rel="icon" type="image/png" href="https://kainnne.com/brand/kainnne-mark.png" />
<link rel="apple-touch-icon" href="https://kainnne.com/brand/kainnne-mark.png" />
<meta property="og:image" content="https://kainnne.com/brand/kainnne-mark.png" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:image" content="https://kainnne.com/brand/kainnne-mark.png" />
```

## 日後更換 Logo

1. 保留新原始檔於本資料夾，使用新的版本檔名。
2. 等比例輸出 `public/brand/kainnne-mark.png`、192、512、180 與 32 px 衍生圖，不裁掉圖案、不加背景。
3. 更新 `public/brand/brand.json` 的版本、尺寸與來源檔名。
4. 維持線上固定入口 `/brand/kainnne-mark.png` 不變，再執行 `npm run seo:generate`、測試與部署。

沿用固定入口的子網域會跟著更新；瀏覽器、LINE 或其他社群服務的圖片快取可能需要一段時間才會刷新。
