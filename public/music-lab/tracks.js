// 作品字卡的版本、音檔與總譜頁面設定。換版本只改這裡，再執行：python3 tools/measure_audio.py
// 等號右邊必須是合法 JSON（measure_audio.py 會直接讀）。
// versions 由舊到新，最後一項是最新版，頁面預設播放最新版。file 留空字串＝這一版沒有音檔，只顯示文字。
// mirror＝Love Beyond Reach Mvt. 1（Remix），頁面標題在 index.html 的 data-title。v15 是 R3b（再現段修正）的 Logic 版。
// 總譜跟著版本數線走：版本的 score 指向 scores 裡的一份總譜；沒有 score 的版本沿用前面最近一版的總譜。
// scores.*.pages 是 scores/pages/ 裡的圖片數量（由 PDF 每頁轉成 WebP，寬 1600px），pdf 是原檔副本。
window.TRACKS = {
  "mirror": {
    "versions": [
      { "v": "v1", "date": "11/07", "file": "audio/first_mirror_R1.m4a", "text": "第一版：分軌轉成 MIDI 後在 Logic 重新編曲與混音，電吉他大多沒有發聲。", "score": "first" },
      { "v": "v2", "date": "11/07", "file": "audio/mirror_v02.m4a", "text": "解決電吉他沒有發聲的問題（取樣音源把 MIDI 通道當成六條弦），並移除混音裡的節拍器聲。" },
      { "v": "v3", "date": "11/08", "file": "audio/mirror_v03.m4a", "text": "主旋律改從生成曲的吉他聲音重建，加上圓滑奏。聽起來像合成器，未採用。" },
      { "v": "v4", "date": "11/08", "file": "audio/mirror_v04.m4a", "text": "改用真人吉他的彈法規則：主奏一音一撥、不推弦，強力和弦分成左右兩軌。" },
      { "v": "v5", "date": "11/08", "file": "audio/mirror_v05.m4a", "text": "自製物理模型吉他引擎，加入分段揉弦，拿掉背景的節奏吉他。" },
      { "v": "v6", "date": "11/09", "file": "audio/mirror_v06.m4a", "text": "加入搥勾、推弦、滑音並在總譜標圓滑線。旋律反而破碎，未採用。" },
      { "v": "v7", "date": "11/09", "file": "audio/mirror_v07.m4a", "text": "合併新版 MIDI 的旋律線，主奏接上真實音箱模型。" },
      { "v": "v8", "date": "11/13", "file": "audio/mirror_R8.m4a", "text": "主奏改用 Logic 內建電吉他音色鏈。" },
      { "v": "v9", "date": "11/18", "file": "audio/mirror_v09_score.m4a", "text": "找到旋律亂的原因：生成曲的電吉他其實是兩把，轉 MIDI 時被合成一條線。依原曲樂譜拆成主奏與副旋律兩軌，總譜每小節加上和弦。", "score": "v9" },
      { "v": "v10", "date": "11/18", "file": "audio/mirror_R2_offline.m4a", "text": "兩把吉他寫成吉他語法：快速音群、悶音、點弦。主奏偏左，副旋律悶音偏右。", "score": "v10" },
      { "v": "v11", "date": "11/18", "file": "audio/mirror_R2_logic.m4a", "text": "Logic 版：四條吉他軌接上 Logic 電吉他音色鏈。" },
      { "v": "v12", "date": "11/18", "file": "audio/mirror_R2_logic_pianofix.m4a", "text": "補回鋼琴第 19、20 小節的兩個經過音。" },
      { "v": "v13", "date": "11/18", "file": "audio/mirror_R3_offline.m4a", "text": "主旋律改以生成曲的吉他為主（81%），原曲樂譜只做校正（6.6%）。副旋律還原成生成曲的雙音，兩把吉他用不同音色。", "score": "latest" },
      { "v": "v14", "date": "11/18", "file": "audio/mirror_R3_logic.m4a", "text": "Logic 版：主奏高增益加附點八分延遲，副旋律用乾淨音色加合唱效果，兩把左右分開，副旋律比主奏小 3.5 dB。" },
      { "v": "v15", "date": "11/18", "file": "audio/mirror_R3b_logic.m4a", "text": "修正結尾再現段的主奏，改以前段確認過的旋律為骨架，不再像亂彈。", "score": "v15" }
    ],
    "ref": { "file": "audio/mirror_suno.m4a", "label": "生成原曲（對照）" },
    "scores": {
      "first": { "prefix": "mirror_first", "pages": 11, "pdf": "scores/before_mirror.pdf" },
      "v9": { "prefix": "mirror_v09", "pages": 34, "pdf": "scores/mirror_v09_R1_score.pdf" },
      "v10": { "prefix": "mirror_v10", "pages": 34, "pdf": "scores/mirror_v012b_2gtr_R2.pdf" },
      "latest": { "prefix": "mirror_latest", "pages": 12, "pdf": "scores/mirror_R3_score.pdf" },
      "v15": { "prefix": "mirror_v15", "pages": 12, "pdf": "scores/mirror_R3b_score.pdf" }
    }
  },
  "srh": {
    "versions": [
      { "v": "v1", "date": "11/06", "file": "audio/first_srh_R1.m4a", "text": "第一版：234 個主唱音有 126 個沒有聲音，空間聽起來像卡拉 OK。", "score": "first" },
      { "v": "v2", "date": "11/06", "file": "audio/srh_v02.m4a", "text": "補回所有主唱音（151 個字都有聲音），只留一位歌手，刪掉 48 個貝斯雜音，混音比例對齊生成曲。" },
      { "v": "v3", "date": "11/06", "file": "audio/srh_v03.m4a", "text": "加強鼓的起音，和聲降低 4 dB，人聲改用真實空間殘響，整理總譜版面。" },
      { "v": "v4", "date": "11/18", "file": "audio/srh_v005_lyricfix.m4a", "text": "解決歌詞沒對上的問題：生成曲與分軌的時間差從 0.04 秒漂移到 0.83 秒，改用強制對齊，146 個字中有 80 個重新定位。" },
      { "v": "v5", "date": "11/18", "file": "audio/srh_logic_v002b.m4a", "text": "Logic 版：對位後的人聲接進 Logic 工程重新混音。" },
      { "v": "v6", "date": "11/18", "file": "audio/srh_v06_score.m4a", "text": "總譜 v004：人聲照新的對位，52 小節每小節都有和弦。", "score": "v6" },
      { "v": "v7", "date": "11/18", "file": "audio/srh_logic_v003.m4a", "text": "加入 12 處換氣（只縮短前一個音的尾巴），電鋼琴加大並加空間，總譜同步標上換氣休止符。", "score": "latest" }
    ],
    "ref": { "file": "audio/srh_suno.m4a", "label": "生成原曲（對照）" },
    "scores": {
      "first": { "prefix": "srh_first", "pages": 7, "pdf": "scores/before_srh.pdf" },
      "v6": { "prefix": "srh_v06", "pages": 7, "pdf": "scores/srh_score_v004_R4.pdf" },
      "latest": { "prefix": "srh_latest", "pages": 7, "pdf": "scores/srh_score_v005.pdf" }
    }
  }
}
