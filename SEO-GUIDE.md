# 完整 SEO 最佳實踐指南

## 📋 目錄

1. [On-Page SEO](#on-page-seo)
2. [技術 SEO](#技術-seo)
3. [內容優化](#內容優化)
4. [圖片優化](#圖片優化)
5. [效能優化](#效能優化)
6. [行動裝置優化](#行動裝置優化)
7. [本地 SEO](#本地-seo)
8. [結構化資料](#結構化資料)
9. [連結建設](#連結建設)
10. [SEO 工具](#seo-工具)

---

## On-Page SEO

### 標題標籤 (Title Tag)

✅ **最佳實踐：**
- 長度：50-60 個字元（中文約 25-30 字）
- 包含主要關鍵字，最好在前面
- 每個頁面使用唯一的標題
- 格式：`主要關鍵字 - 次要關鍵字 | 品牌名稱`

❌ **避免：**
- 關鍵字堆砌
- 使用全大寫
- 重複標題
- 超過 60 個字元

**範例：**
```html
<!-- 好的標題 -->
<title>專業網頁設計服務 - 響應式網站開發 | ABC 設計公司</title>

<!-- 不好的標題 -->
<title>網頁設計,網站設計,RWD設計,響應式網站,網頁製作,網站製作</title>
```

### Meta 描述 (Meta Description)

✅ **最佳實踐：**
- 長度：150-160 個字元（中文約 75-80 字）
- 包含主要關鍵字
- 撰寫吸引人的行動呼籲
- 準確描述頁面內容

**範例：**
```html
<meta name="description" content="提供專業網頁設計服務，包含響應式網站、電商平台、企業官網設計。10年經驗，超過500個成功案例。立即諮詢！">
```

### 標題層級 (Headings)

✅ **最佳實踐：**
- 每頁只使用一個 `<h1>` 標籤
- 按照邏輯順序使用 H1-H6
- 在標題中包含關鍵字
- 保持標題簡潔有力

**結構範例：**
```html
<h1>主要頁面標題（包含主要關鍵字）</h1>
  <h2>主要章節 1</h2>
    <h3>子章節 1.1</h3>
    <h3>子章節 1.2</h3>
  <h2>主要章節 2</h2>
    <h3>子章節 2.1</h3>
```

### URL 結構

✅ **最佳實踐：**
- 使用簡短、描述性的 URL
- 包含關鍵字
- 使用連字號（-）分隔單字
- 使用小寫字母
- 避免使用特殊字元和參數

**範例：**
```
✅ 好的 URL：
https://www.example.com/web-design-services/
https://www.example.com/blog/seo-best-practices/

❌ 不好的 URL：
https://www.example.com/page.php?id=123&cat=456
https://www.example.com/網頁設計服務/
```

### 內部連結

✅ **最佳實踐：**
- 使用描述性錨文本
- 連結到相關內容
- 確保重要頁面有多個內部連結
- 修復損壞的連結

**範例：**
```html
<!-- 好的內部連結 -->
<a href="/services/web-design/">了解我們的網頁設計服務</a>

<!-- 不好的內部連結 -->
<a href="/services/web-design/">點擊這裡</a>
```

---

## 技術 SEO

### 網站速度優化

🎯 **目標：**
- First Contentful Paint (FCP) < 1.8 秒
- Largest Contentful Paint (LCP) < 2.5 秒
- Cumulative Layout Shift (CLS) < 0.1
- First Input Delay (FID) < 100 毫秒

✅ **優化方法：**

1. **最小化和壓縮文件**
   ```bash
   # CSS 最小化
   cssnano input.css output.min.css
   
   # JavaScript 最小化
   terser input.js -o output.min.js
   ```

2. **啟用 GZIP 壓縮**（參見 .htaccess 文件）

3. **使用 CDN**
   - Cloudflare
   - AWS CloudFront
   - Google Cloud CDN

4. **延遲載入圖片**
   ```html
   <img src="image.jpg" loading="lazy" alt="描述">
   ```

5. **預載入關鍵資源**
   ```html
   <link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
   ```

### HTTPS

✅ **必須使用 HTTPS：**
- 購買 SSL 憑證（或使用 Let's Encrypt 免費憑證）
- 設定 301 重定向從 HTTP 到 HTTPS
- 更新所有內部連結為 HTTPS
- 在 Google Search Console 中提交 HTTPS 版本

### XML Sitemap

✅ **最佳實踐：**
- 包含所有重要頁面
- 定期更新
- 提交到 Google Search Console 和 Bing Webmaster Tools
- 在 robots.txt 中聲明 sitemap 位置

### Robots.txt

✅ **最佳實踐：**
- 允許爬取重要內容
- 禁止爬取管理頁面和私密內容
- 聲明 sitemap 位置
- 定期檢查和更新

### 行動裝置友善

✅ **檢查項目：**
- 響應式設計
- 適當的字體大小（至少 16px）
- 可點擊元素間距足夠（至少 48x48px）
- 避免使用 Flash
- 視窗設定正確

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### 結構化資料

✅ **實作方式：**
- 使用 JSON-LD 格式（Google 推薦）
- 根據頁面類型選擇適當的 Schema
- 使用 Google Rich Results Test 驗證

**常用 Schema 類型：**
- Organization（組織）
- LocalBusiness（本地商家）
- Product（產品）
- Article（文章）
- BreadcrumbList（麵包屑）
- FAQ（常見問題）
- HowTo（操作指南）
- Event（活動）

---

## 內容優化

### 關鍵字研究

🔍 **工具：**
- Google Keyword Planner
- Ahrefs
- SEMrush
- Ubersuggest
- Answer the Public

✅ **策略：**
1. 找出主要關鍵字（高搜尋量）
2. 找出長尾關鍵字（低競爭度）
3. 分析競爭對手
4. 考慮搜尋意圖

### 內容撰寫

✅ **最佳實踐：**

1. **E-E-A-T 原則**
   - Experience（經驗）
   - Expertise（專業知識）
   - Authoritativeness（權威性）
   - Trustworthiness（可信度）

2. **內容長度**
   - 部落格文章：至少 1,000-2,000 字
   - 產品描述：至少 300 字
   - 服務頁面：至少 500 字

3. **關鍵字密度**
   - 主要關鍵字：1-2%
   - 自然地融入內容
   - 使用同義詞和相關詞

4. **內容結構**
   - 使用短段落（2-3 句）
   - 使用項目符號和編號列表
   - 加入圖片和影片
   - 使用表格整理資訊

5. **更新舊內容**
   - 定期檢查和更新
   - 加入最新資訊
   - 改善內容品質
   - 更新發布日期

### 內容類型

📝 **建議建立：**
- 部落格文章
- 操作指南
- 案例研究
- 白皮書
- 影片內容
- 資訊圖表
- FAQ 頁面
- 詞彙表

---

## 圖片優化

### 文件格式

✅ **選擇適當格式：**
- **WebP**：最佳壓縮率，現代瀏覽器支援
- **JPEG**：照片和複雜圖片
- **PNG**：需要透明背景
- **SVG**：圖標和簡單圖形

### 圖片壓縮

🛠️ **工具：**
- TinyPNG / TinyJPG
- ImageOptim
- Squoosh
- ShortPixel

✅ **目標：**
- 檔案大小 < 100KB（一般圖片）
- 檔案大小 < 200KB（大型圖片）

### Alt 文字

✅ **最佳實踐：**
```html
<!-- 好的 alt 文字 -->
<img src="blue-running-shoes.jpg" alt="Nike 藍色慢跑鞋，適合長跑訓練">

<!-- 不好的 alt 文字 -->
<img src="img001.jpg" alt="圖片">
<img src="shoes.jpg" alt="">
```

### 響應式圖片

✅ **使用 srcset 和 sizes：**
```html
<img 
  src="image-800w.jpg"
  srcset="image-400w.jpg 400w,
          image-800w.jpg 800w,
          image-1200w.jpg 1200w"
  sizes="(max-width: 600px) 400px,
         (max-width: 1000px) 800px,
         1200px"
  alt="描述">
```

### 延遲載入

```html
<img src="image.jpg" loading="lazy" alt="描述">
```

### 圖片 Sitemap

建立專門的圖片 sitemap 或在主 sitemap 中加入圖片資訊：

```xml
<url>
  <loc>https://www.example.com/page/</loc>
  <image:image>
    <image:loc>https://www.example.com/image.jpg</image:loc>
    <image:caption>圖片說明</image:caption>
    <image:title>圖片標題</image:title>
  </image:image>
</url>
```

---

## 效能優化

### Core Web Vitals

🎯 **三大指標：**

1. **LCP (Largest Contentful Paint)**
   - 目標：< 2.5 秒
   - 優化：優化圖片、使用 CDN、減少伺服器回應時間

2. **FID (First Input Delay)**
   - 目標：< 100 毫秒
   - 優化：減少 JavaScript 執行時間、程式碼分割

3. **CLS (Cumulative Layout Shift)**
   - 目標：< 0.1
   - 優化：為圖片和影片設定尺寸、避免動態插入內容

### 資源優化

✅ **CSS 優化：**
```html
<!-- 內聯關鍵 CSS -->
<style>
  /* 首屏關鍵樣式 */
</style>

<!-- 延遲載入非關鍵 CSS -->
<link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="styles.css"></noscript>
```

✅ **JavaScript 優化：**
```html
<!-- 延遲載入 -->
<script src="script.js" defer></script>

<!-- 非同步載入 -->
<script src="analytics.js" async></script>
```

### 快取策略

參見 [.htaccess](file:///d:/demo/.htaccess) 文件中的快取設定。

### 資料庫優化

- 定期清理資料庫
- 優化查詢
- 使用索引
- 啟用快取（Redis、Memcached）

---

## 行動裝置優化

### 響應式設計

✅ **檢查項目：**
- 使用 CSS Media Queries
- 彈性網格佈局
- 彈性圖片和媒體
- 適當的斷點設定

```css
/* 行動裝置優先 */
.container {
  width: 100%;
  padding: 15px;
}

/* 平板 */
@media (min-width: 768px) {
  .container {
    max-width: 750px;
    margin: 0 auto;
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
  }
}
```

### 觸控友善

✅ **最佳實踐：**
- 按鈕和連結至少 48x48px
- 元素間距至少 8px
- 避免使用 hover 效果作為唯一互動方式

### 行動頁面速度

🎯 **目標：**
- 載入時間 < 3 秒
- 頁面大小 < 1MB

✅ **優化方法：**
- AMP（Accelerated Mobile Pages）
- 減少重定向
- 優化圖片
- 最小化 CSS 和 JavaScript

---

## 本地 SEO

### Google 我的商家

✅ **優化步驟：**
1. 建立和驗證商家資料
2. 填寫完整資訊
3. 選擇正確的類別
4. 加入高品質照片
5. 收集和回覆評論
6. 定期發布貼文
7. 加入營業時間和聯絡資訊

### NAP 一致性

確保以下資訊在所有平台一致：
- **N**ame（名稱）
- **A**ddress（地址）
- **P**hone（電話）

### 本地關鍵字

✅ **策略：**
- 在標題和內容中加入城市/地區名稱
- 建立地區專屬頁面
- 使用本地化的 Schema 標記

**範例：**
```
主要關鍵字 + 地區
- "台北網頁設計"
- "台中咖啡廳"
- "高雄牙醫診所"
```

### 本地引用

📍 **重要平台：**
- Google 我的商家
- Facebook 商家頁面
- Bing Places
- Apple Maps
- 產業專屬目錄

---

## 結構化資料

### 實作方式

✅ **推薦使用 JSON-LD：**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "您的商家名稱",
  "image": "https://www.example.com/logo.jpg",
  "telephone": "+886-2-1234-5678",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "台北市信義區信義路五段7號",
    "addressLocality": "台北市",
    "postalCode": "110",
    "addressCountry": "TW"
  }
}
</script>
```

### 常用 Schema 類型

參見 [schema-templates.json](file:///d:/demo/schema-templates.json) 文件。

### 驗證工具

🔍 **測試工具：**
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [Google Search Console](https://search.google.com/search-console)

---

## 連結建設

### 內部連結策略

✅ **最佳實踐：**
- 使用描述性錨文本
- 連結到相關內容
- 建立內容樞紐（Topic Clusters）
- 確保重要頁面有多個內部連結

### 外部連結獲取

✅ **白帽 SEO 方法：**
1. **內容行銷**
   - 建立高品質內容
   - 資訊圖表
   - 研究報告
   - 工具和資源

2. **客座文章**
   - 在相關網站發表文章
   - 提供有價值的內容
   - 獲得作者簡介連結

3. **損壞連結建設**
   - 找出競爭對手的損壞連結
   - 聯絡網站管理員
   - 提供您的內容作為替代

4. **資源頁面連結**
   - 找出產業相關的資源頁面
   - 聯絡網站管理員
   - 請求加入您的資源

5. **媒體報導**
   - 發布新聞稿
   - 聯絡記者和部落客
   - 參與產業活動

❌ **避免：**
- 購買連結
- 連結農場
- 過度交換連結
- 垃圾留言連結

---

## SEO 工具

### 關鍵字研究

🔍 **免費工具：**
- Google Keyword Planner
- Google Trends
- Ubersuggest
- Answer the Public
- KeywordTool.io

💰 **付費工具：**
- Ahrefs
- SEMrush
- Moz Pro
- KWFinder

### 技術 SEO 審核

🛠️ **工具：**
- Google Search Console（免費）
- Bing Webmaster Tools（免費）
- Screaming Frog SEO Spider（免費版有限制）
- Sitebulb
- DeepCrawl

### 效能測試

⚡ **工具：**
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [GTmetrix](https://gtmetrix.com/)
- [WebPageTest](https://www.webpagetest.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

### 結構化資料測試

✅ **工具：**
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)

### 行動裝置測試

📱 **工具：**
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [BrowserStack](https://www.browserstack.com/)

### 連結分析

🔗 **工具：**
- Ahrefs
- Moz Link Explorer
- Majestic
- Google Search Console（反向連結報告）

### 排名追蹤

📊 **工具：**
- Google Search Console
- Ahrefs Rank Tracker
- SEMrush Position Tracking
- SERPWatcher

### 競爭對手分析

🔍 **工具：**
- Ahrefs
- SEMrush
- SpyFu
- SimilarWeb

---

## 📚 延伸閱讀

- [Google Search Central](https://developers.google.com/search)
- [Moz Beginner's Guide to SEO](https://moz.com/beginners-guide-to-seo)
- [Ahrefs Blog](https://ahrefs.com/blog/)
- [Search Engine Journal](https://www.searchenginejournal.com/)
- [Search Engine Land](https://searchengineland.com/)

---

**最後更新：2026-01-08**
