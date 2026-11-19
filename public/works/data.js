/* 朱璽 Kaine Zhu 作品集：資料（第四輪第二版，2026-11-18）
  - 首頁上方輪播寫在 index.html。下方作品字卡由 WORKS 產生，順序＝畫面順序（兩張一組）。
  - 每件作品：ai＝true 標「AI 協作」、false 標「非 AI」。type＝類型（眉標）、title＝作品名、ways＝製作手法（條列）、tone＝色調、icon＝圖示。
    open＝字卡上的外部連結（Open 按鈕）。detail＝點 Details 後展開的內容：facts、media、videos／vnVideo、track、links、fold。
  - 視覺小說的作品名稱不出現在網站與影片上（Kaine 2026-11-18 指定）。
  - 拿掉（Kaine 2026-11-18 指定）：四首 AI 協作新歌、MV、〈高雄到桃園〉〈朱璽的精華〉、《從巴黎到臺灣》、哲威揚官網草稿與 v7、所有年份。
  - 所有路徑以 / 開頭。
*/
window.SITE = {
  // 視覺小說宣傳片 vn-promo-v2（2026-11-19）：全部用重新錄製的遊玩影片（27 段），分割畫面與影片牆每格都在播放，字卡說明特色，影片專用的新主選單，主題曲原速。
  // 前一版 vn-promo-v1（2026-11-19）：HyperFrames 製作，主題曲 Lunar Ambition 原速，15 段每段 16 拍（5.57 秒），遊玩錄影與 CG 展示輪流，3D 幾何轉場。工程在 scratchpad promo/vn-promo。
  // 前一版 vn-demo-v3-fast：v3 重錄（一般句 0.38 秒停留、擬音句最多 0.9 秒），中段遊玩再加速 1.25 倍，平均約 0.48 秒一句，片頭片尾原速。
  // 前一版 vn-demo-v2：重新錄製，每句約 1 秒，含開場擬音、六語切換、Kain³ 品牌片頭片尾（2026-11-18 背景 agent 錄製）。
  // 備用 vn-demo-fast：gameplay-2.2.4.mp4 從 6.6 秒（CG 鑑賞）剪到 91.5 秒，畫面加速 1.6 倍，音樂維持原速。Kaine 要求對話加快。
  // 舊的 vn-demo-trim：gameplay-2.2.4.mp4 剪掉有作品名稱的主選單（0–16 秒、91.7 秒後），只留實機遊玩 75 秒。
  // 新錄的版本（含開場音效、Kain³ 片頭片尾）完成後換成 vn-demo-v2.mp4。
  VN_VIDEO: { src: "assets/vn/vn-promo-v6.mp4", poster: "assets/vn/vn-promo-v6-poster.jpg", w: 1920, h: 1080, title: "視覺小說宣傳片", len: "0:58" },

  VIDEOS: [
    { id: "p01", src: "assets/video/kainnne-academy-p01-web.mp4", poster: "assets/video/kainnne-academy-p01-poster.jpg", w: 1920, h: 1080, title: "Kain³e Academy P01", len: "2:37" },
    { id: "forum", src: "assets/video/kcis-forum-report-web.mp4", poster: "assets/video/kcis-forum-report-cover.jpg", w: 1920, h: 1080, title: "國際教育領袖論壇報告", len: "3:51" },
    { id: "k04", src: "assets/video/kcis-k04-data-before-ai-web.mp4", poster: "assets/video/kcis-k04-cover.jpg", w: 1920, h: 1080, title: "資料交給 AI 之前", len: "6:51" },
    { id: "loop", src: "assets/video/zwy-loop-engineering-short-web.mp4", poster: "assets/video/zwy-short-poster.jpg", w: 1080, h: 1920, title: "1 分鐘了解 Loop Engineering", len: "1:03" },
  ],

  WORKS: [
    {
      id: "kainnne", ai: true, type: "網站設計", title: "kainnne.com", tone: "lilac", icon: "web",
      ways: ["UI／UX", "前端", "互動設計"],
      open: "https://kainnne.com/",
      detail: { media: [{ src: "assets/web/kainnne-com.jpg", w: 1440, h: 900, alt: "kainnne.com 首頁" }] },
    },
    {
      id: "vn", ai: true, type: "遊戲委託案", title: "視覺小說", tone: "blue", icon: "game",
      ways: ["系統架構", "音樂監製", "音效設計", "多語系"],
      detail: {
        vnVideo: true,
        facts: [["製作", "一人獨立製作：系統、美術、配樂、音效、多語系"], ["語言", "繁中、簡中、粵語、英文、日文、韓文"], ["正文", "82,933 字"], ["章節", "主線 32 章、追加故事 4 篇"], ["角色", "15 組服裝，各 4 種表情"], ["演出提示", "547 個"], ["配樂", "86 個配樂節點"]],
        media: [
          { src: "assets/vn/cg-01c.jpg", w: 1600, h: 900, alt: "視覺小說 CG 1" },
          { src: "assets/vn/cg-12c.jpg", w: 1600, h: 900, alt: "視覺小說 CG 2" },
          { src: "assets/vn/cg-19c.jpg", w: 1600, h: 900, alt: "視覺小說 CG 3" },
          { src: "assets/vn/cg-06b.jpg", w: 1600, h: 900, alt: "視覺小說 CG 4" },
        ],
      },
    },
    {
      id: "video", ai: true, type: "影片製作", title: "教學與品牌影片", tone: "mint", icon: "film",
      ways: ["腳本", "AI 配音", "混音", "雙語字幕"],
      detail: { videos: true },
    },
    {
      id: "eb24", ai: false, type: "音樂專輯", title: "Everything Before 24", tone: "berry", icon: "album",
      ways: ["作曲", "製譜", "Affinity Publisher 排版", "樂手召集與排練"],
      detail: {
        track: "eb24",
        facts: [["曲數", "10 首"], ["長度", "約 49 分鐘"], ["編制", "鋼琴五重奏與長笛"], ["紙本樂譜", "142 頁"], ["排版", "Affinity Publisher"]],
        // 紙本專輯譜：~/Desktop/雲端封存/紙本專輯譜/2026.5.24(finish!!).pdf 第 3、16、17、27、28、41 頁（照片頁有其他樂手，沒放）。
        media: [
          { src: "assets/design/2026-eb24-cover-v2.jpg", w: 1272, h: 1800, alt: "《Everything Before 24》書封" },
          { src: "assets/design/2026-eb24-back-v2.jpg", w: 1274, h: 1800, alt: "《Everything Before 24》書背" },
          { src: "assets/music/eb24-pages/p003.webp", w: 1100, h: 1555, alt: "目錄" },
          { src: "assets/music/eb24-pages/p016.webp", w: 1100, h: 1555, alt: "Prologue 扉頁" },
          { src: "assets/music/eb24-pages/p017.webp", w: 1100, h: 1555, alt: "A Memory with Kaine 總譜" },
          { src: "assets/music/eb24-pages/p027.webp", w: 1100, h: 1555, alt: "I. Whimsy 扉頁" },
          { src: "assets/music/eb24-pages/p028.webp", w: 1100, h: 1555, alt: "I. Whimsy 總譜" },
          { src: "assets/music/eb24-pages/p041.webp", w: 1100, h: 1555, alt: "II. Sudden Light 總譜" },
        ],
        links: [
          { label: "Spotify", href: "https://open.spotify.com/album/7kH1LtAHtDu2H0evbe5Jib" },
          { label: "Apple Music", href: "https://music.apple.com/tw/album/everything-before-24/1891561916" },
          { label: "YouTube Music", href: "https://music.youtube.com/playlist?list=OLAK5uy_mnNVxpjDw5dwcnLaquhOUxn_S_Jn6a46Q" },
        ],
      },
    },
    {
      // 來源路徑見 assets/design/designs.json。
      id: "design", ai: false, type: "平面設計", title: "海報與印刷品", tone: "peach", icon: "design",
      ways: ["海報", "邀請卡", "節目單", "書封與樂譜排版"],
      // pieces：展開後以 01–07 字卡呈現（type＝品項、title＝作品名）。
      detail: {
        facts: [["工具", "Affinity Publisher、Canva"]],
        pieces: [
          { src: "assets/design/2025-dear-love-poster.jpg", w: 1272, h: 1800, type: "海報", title: "DEAR LOVE", tone: "rose" },
          { src: "assets/design/2026-rationality-and-music-poster.jpg", w: 1272, h: 1800, type: "海報", title: "理性與樂音", tone: "lilac" },
          { src: "assets/design/2026-eb24-cover-v2.jpg", w: 1272, h: 1800, type: "書封", title: "Everything Before 24", tone: "blue" },
          { src: "assets/design/2026-eb24-back-v2.jpg", w: 1274, h: 1800, type: "書背", title: "Everything Before 24", tone: "lilac" },
          { src: "assets/design/2026-eb24-invitation-digital.jpg", w: 1800, h: 1277, type: "邀請卡（電子檔）", title: "for you", tone: "berry" },
          { src: "assets/design/2025-dear-love-program.jpg", w: 1080, h: 1350, type: "節目單", title: "DEAR LOVE", tone: "berry" },
          { src: "assets/design/2026-rationality-and-music-invitation-piano.jpg", w: 1278, h: 1800, type: "邀請卡", title: "理性與樂音（直式）", tone: "peach" },
          { src: "assets/design/2025-dear-love-invitation-front.jpg", w: 1800, h: 1278, type: "邀請卡", title: "DEAR LOVE", tone: "rose" },
          { src: "assets/design/2026-rationality-and-music-invitation-violin.jpg", w: 1800, h: 1278, type: "邀請卡", title: "理性與樂音（橫式）", tone: "mint" },
        ],
      },
    },
  ],

  // 輪播 02 Title：點頭銜展開的說明。文字照 104 履歷（~/Downloads/朱璽 (6).pdf）原句截取，不改寫，只接回 PDF 斷行。
  // 哲威揚的工研院課程那句取自哲威揚官網 v7 的課程頁原文（104 沒有寫）。
  ROLES: {
    zwy: {
      lead: "我與兩位夥伴共同創立哲威揚科技（ZWY TECH），擔任共同創辦人與產品長。團隊作品 AirLock「地端語音接待與進場查核系統」獲得 2026 Agentic AI on the Edge Hackathon 新北特別獎。",
      items: [
        "AirLock 結合電腦視覺與 AI Agents，針對半導體廠區、國際學校等高安全需求場域，串接訪客接待、身分辨識、聯繫受訪者、審核與進場核准流程。",
        "我們在單一主機上並行執行兩個經 NVFP4 量化的 30B 模型，並將訪客說話結束到系統語音回覆的延遲，由 1.85 秒降至 226 毫秒。",
        "負責系統中主要的系統架構、運作邏輯與功能設計、Agent 的回覆邏輯，以及前端設計。",
        "工研院產業學院・Claude Code 韌體開發實戰班，共 12 小時，含開發板、麵包板與電子元件套件。",
      ],
    },
    kcis: {
      lead: "在康橋國際學校擔任 AI Education Engineer，負責 AI 導入、應用開發、AI 教育訓練與工作流程改善。",
      items: [
        "依教師及行政同仁的實際需求，建置校內 AI 工具與提示詞引導工具。",
        "製作 AI 教學內容，設計不同程度的老師與同仁容易理解的流程，協助導入日常工作。",
        "參與 LLM 與 AI Agent 驅動的校內知識平台設計與開發，結合共享筆記、結構化知識與智慧搜尋，協助同仁整理及查找資訊，並負責平台前端開發及 UI／UX 設計。",
      ],
    },
    ntu: {
      lead: "目前與臺大生工系合作的研究主題為 LLM 於 ESG 的應用，相關研究與期刊工作仍在進行中，尚未發表。",
      items: [
        "實現「即時淹水預警系統」模型架構與完整 Python 程式碼編寫。",
        "負責專案進度管理，代表研究室與政府機關及外部科技公司進行需求訪談與進度回報。",
        "負責將 AI 模型封裝為正式執行檔，協助合作廠商將模型預測結果介接至政府公共網站平台。",
      ],
    },
  },

  // 換音檔只改這裡。eb24：~/Desktop/Everything Before 24.mp3（專輯哪一段待確認）。
  TRACKS: {
    eb24: { src: "assets/music/eb24-track.mp3", title: "Everything Before 24" },
  },
};
