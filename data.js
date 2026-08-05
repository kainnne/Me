/* 所有個人資料集中於此。新增經歷、專案或雙語履歷時，直接修改這個檔案即可。 */
const resumeData = {
  name: "朱璽",
  englishName: "Kaine Zhu",
  role: "AI · LEARNING · CREATION",
  headline: "把學習、技術與創作，連成可感知的體驗。",
  location: "Taipei & New Taipei, Taiwan",
  availability: "持續學習，也持續創作中",
  aboutTitle: "在技術與音樂之間，尋找讓想法發生的方法。",
  about:
    "我是朱璽（Kaine Zhu），目前從事 AI 數位教學工程，也在國立臺灣大學擔任研究助理。我的背景來自海洋環境與工程，並持續探索 AI、前端設計與大型語言模型；在工作以外，我也主辦音樂會、作曲、指揮，並進行鋼琴與長笛演奏。",
  facts: [
    ["所在地", "台北・新北"],
    ["研究領域", "生物環境系統工程"],
    ["創作形式", "音樂、數位體驗"],
  ],
  capabilities: [
    {
      name: "AI Agents & Prototyping",
      label: "AI 代理與快速原型",
      summary: "從想法到可測試成果",
      description: "用 AI-assisted programming 快速建立專案，同時管理 Token 效率、拆解任務並驗證模型與程式輸出，讓速度不犧牲可靠性。",
      items: ["AI Agent", "Codex", "Claude Code", "Prompt & Context Design", "Output Validation", "Rapid Prototyping"],
    },
    {
      name: "Machine Learning",
      label: "機器學習與資料分析",
      summary: "讓資料變成可驗證的判斷",
      description: "從資料前處理、特徵工程到模型訓練與評估，處理時間序列、能源、氣候與工程資料，關注模型結果是否能被解釋與落地。",
      items: ["Time-Series Forecasting", "Feature Engineering", "Feature Importance", "Model Evaluation", "Data Preprocessing", "Python"],
    },
    {
      name: "Systems & Data",
      label: "系統與資料流程",
      summary: "把模型接進真實使用情境",
      description: "設計即時資料處理、API 整合、ETL 與預測流程，並將 AI 模型封裝為可部署程式，銜接外部服務與公共平台。",
      items: ["Real-Time Processing", "API Integration", "ETL Pipeline", "Spatial Data", "Automation", "Forecasting Pipeline"],
    },
    {
      name: "Learning & Creative Direction",
      label: "數位學習與創作",
      summary: "讓技術更容易被理解與感受",
      description: "結合數位教學、前端體驗與音樂製作經驗，從使用者感受、資訊層級到舞台協作，讓複雜內容成為清楚且有節奏的體驗。",
      items: ["Digital Learning", "Frontend Design", "Concert Production", "Composition", "Conducting", "Piano & Flute"],
    },
  ],
  highlights: [
    {
      type: "RESEARCH / MACHINE LEARNING",
      metric: "R² > 0.99",
      title: "爆炸荷重下波紋鋼板牆位移預測",
      description: "以 LS-DYNA 模擬資料建立機器學習流程，完成資料前處理、特徵工程、模型驗證與重要性分析。",
      foot: "Master's thesis · Structural engineering",
    },
    {
      type: "PUBLIC SYSTEM / AI",
      metric: "REAL-TIME",
      title: "即時淹水預警系統",
      description: "負責模型架構、Python 實作、模型封裝與資料傳輸邏輯，協助預測結果介接政府公共網站。",
      foot: "National Taiwan University · 2025",
    },
    {
      type: "LEADERSHIP / MUSIC",
      metric: "TOP 15",
      title: "從組織管理到舞台創作",
      description: "帶領室內樂社改善評鑑成績，並以總負責人、指揮、作曲及演奏者身份完成多場音樂會與個人專輯。",
      foot: "Chamber Music Club · Creative practice",
    },
  ],
  experiences: [
    { period: "2026.7 -", role: "AI 軟體設計工程師", company: "康橋國際學校", description: "AI 數位教學與軟體開發。" },
    { period: "2025.9 - 2025.12", role: "研究助理", company: "國立臺灣大學生物環境系統工程學系", description: "即時淹水預警系統與 AI 模型應用。" },
    { period: "2026.1", role: "研究助理", company: "國立中山大學海洋環境及工程學系", description: "資料模式與特徵關係分析。" },
  ],
  bilingualResume: [
    {
      titleZh: "工作經驗", titleEn: "Work Experience",
      items: [
        {
          zh: { role: "研究助理", organization: "國立臺灣大學生物環境系統工程學系", period: "2025.9 - 2025.12", bullets: ["實現「即時淹水預警系統」模型架構與完美 Python 程式編寫。", "負責專案進度管理，代表研究室與政府局處及外部科技公司進行需求訪談與進度回報。", "負責將 AI 模型封裝為正式執行檔，並設計數據傳輸邏輯，協助合作廠商將模型預測結果介接至政府公共網站平台。", "分析資料之潛在模式與特徵分群關係，作為後續預測模型優化與驗證的依據。"] },
          en: { role: "Research Assistant", organization: "National Taiwan University\nDepartment of Bioenvironmental Systems Engineering", period: "2025.9 - 2025.12", bullets: ["Developed the architecture and implementation of a real-time flood forecasting system using Python.", "Managed project progress and communicated with government agencies and external technology companies regarding project requirements and updates.", "Packaged AI models into deployable applications and designed data transmission mechanisms to support integration with government public service platforms."] },
        },
        {
          zh: { role: "研究助理", organization: "國立中山大學海洋環境及工程學系", period: "2026.1", bullets: ["分析資料之潛在模式與特徵分群關係，作為後續預測模型優化與驗證的依據。"] },
          en: { role: "Research Assistant", organization: "National Sun Yat-sen University\nDepartment of Marine Environment and Engineering", period: "2026.1", bullets: ["Analyzed data patterns and feature relationships to support model improvement."] },
        },
        {
          zh: { role: "AI 程式設計工程師", organization: "康橋國際學校", period: "2026.7 -", bullets: [] },
          en: { role: "AI Software Engineer", organization: "Kang Chiao International School\nDepartment of Marine Environment and Engineering", period: "2026.7 -", bullets: [] },
        },
      ],
    },
    {
      titleZh: "碩士論文（英文論文）", titleEn: "Master's Thesis",
      items: [{
        zh: { role: "Prediction of Deflections on Corrugated Blast Wall under Explosion Loads Using Machine Learning", organization: "", period: "", bullets: ["利用數值模擬軟體（LS-DYNA）所建立之資料集，以機器學習方法預測波紋鋼板爆牆於爆炸荷重作用下之最大與永久位移。", "研究內容包含資料前處理、特徵工程、模型驗證及特徵重要性分析，探討結構幾何參數與荷重條件對位移反應之影響。", "研究過程中發展與建置、參數調校與實驗設計，最終模型於測試資料上取得超過 99% 的預測準確度（R² > 0.99），驗證了機器學習應用於結構工程問題之可行性。"] },
        en: { role: "Prediction of Deflections on Corrugated Blast Walls under Explosion Loads Using Machine Learning", organization: "", period: "", bullets: ["Used machine learning methods to predict the maximum and permanent deflections of corrugated blast walls under explosion loads based on datasets generated by LS-DYNA simulations.", "The research included data preprocessing, feature engineering, model validation, and feature importance analysis to investigate the effects of structural geometric parameters and loading conditions on deflection responses.", "During the study, machine learning models were developed, tuned, and evaluated through experimental design. The final models achieved over 99% prediction accuracy (R² > 0.99) on testing datasets, demonstrating the feasibility and practical value of applying machine learning to structural engineering problems."] },
      }],
    },
    {
      titleZh: "學經歷", titleEn: "Education",
      items: [
        { zh: { role: "國立中山大學", organization: "海洋環境及工程學系 學士（畢業）", period: "2019.6 - 2023.6", bullets: [] }, en: { role: "National Sun Yat-sen University", organization: "B.S. in Marine Environment and Engineering", period: "2019.9 - 2023.6", bullets: [] } },
        { zh: { role: "國立中山大學", organization: "海洋環境及工程學系 碩士（畢業）", period: "2023.9 - 2025.9", bullets: [] }, en: { role: "National Sun Yat-sen University", organization: "M.S. in Marine Environment and Engineering", period: "2023.9 - 2025.9", bullets: [] } },
      ],
    },
    {
      titleZh: "其他經驗", titleEn: "Additional Experience",
      items: [{
        zh: { role: "機器學習、社團與音樂經驗", organization: "", period: "", bullets: ["具備 ESG、能源與氣候資料相關之 Machine Learning 專案與競賽經驗。", "Kaggle: Large-scale Energy Anomaly Detection", "T-Brain: 根據區域微氣候資料預測發電量競賽", "在學期間擔任室內樂社社長，將前年不理想之社團評鑑成績提升為前 15 名之社團，獲 20000 元之獎學金", "曾任社團評鑑執行委員一年", "多次於音樂會中擔任總負責人、指揮、作曲、器樂演出並發行個人專輯，師事國立中山大學音樂系陳以軒教授。"] },
        en: { role: "Machine Learning, Leadership & Activities", organization: "", period: "", bullets: ["Experience in Machine Learning projects related to ESG, energy systems, and climate data analysis.", "Kaggle Competition: Large-scale Energy Anomaly Detection", "T-Brain Competition: Solar Power Generation Prediction Using Regional Microclimate Data.", "President of the Chamber Music Club at National Sun Yat-sen University.", "Led the team to improve its student organization ranking into the top 15 student organizations and received a scholarship award of NT$20,000.", "Organized and led multiple music performances as a project coordinator, conductor, composer, and instrumental performer, and released a personal music album under the guidance of Prof. Yi-Hsuan Chen from National Sun Yat-sen University."] },
      }],
    },
  ],
  skills: [
    { name: "Programming", items: ["Python", "C++", "AI programming (Codex, Claude Code, ...) "] },
    { name: "Machine Learning & Data Analysis", items: ["Time-Series Forecasting", "Feature Engineering", "Feature Importance Analysis", "Model Training & Evaluation", "Data Preprocessing"] },
    { name: "System & Data Processing", items: ["Real-Time Data Processing", "API Data Collection & Integration", "Spatial Data Processing", "ETL Pipeline Development", "Automation Script Development", "Forecasting Pipeline Development"] },
    { name: "音樂與創作", items: ["音樂會主辦", "作曲", "指揮", "鋼琴", "長笛"] },
  ],
  projects: [
    { title: "AI Agent 與快速原型", type: "IN PROGRESS · AI", description: "以 AI 輔助程式開發，練習在快速產出、Token 使用效率與成果驗證之間取得平衡。", link: "#", linkLabel: "專案整理中" },
    { title: "音樂創作與製作", type: "CREATION · MUSIC", description: "累積多場音樂會主辦經驗，並發行個人專輯；持續以作曲、指揮與演奏記錄創作。", link: "#", linkLabel: "內容整理中" },
  ],
  email: "chaos60649@gmail.com",
  phone: "+886 909 505 931",
  socials: [
    { label: "GitHub", url: "https://github.com/zx50416" },
    { label: "Instagram", url: "https://www.instagram.com/kaine_z_/" },
  ],
};
