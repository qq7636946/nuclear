# 🌍 3D Earth Viewer - GitHub Pages 設定指南

## ✅ 已完成的步驟

1. ✅ 修改 `3d-viewer.html` 移除 ES6 modules，改用傳統 script 標籤
2. ✅ 移除 Claude API 聊天功能（需要後端伺服器）
3. ✅ 使用 CDN 載入所有必要的庫
4. ✅ 包含 3D 地球模型檔案和材質
5. ✅ 推送到 GitHub 分支 `3d-earth-viewer`

## 🚀 如何設定 GitHub Pages

### 方法 1: 使用網頁介面（推薦）

1. 前往您的 GitHub 倉庫：
   - https://github.com/qq7636946/nuclear

2. 點擊 **Settings**（設定）標籤頁

3. 在左側選單中找到 **Pages**

4. 在 **Source** 部分：
   - Branch: 選擇 `3d-earth-viewer`
   - Folder: 選擇 `/ (root)`
   - 點擊 **Save**

5. 等待幾分鐘後，您的網站將會在以下網址可用：
   - **https://qq7636946.github.io/nuclear/3d-viewer.html**

### 方法 2: 使用 main 分支（替代方案）

如果您想使用 main 分支來部署 GitHub Pages：

1. 先解決 main 分支的合併衝突
2. 將 3d-viewer.html 合併到 main 分支
3. 在 GitHub Pages 設定中選擇 `main` 分支

## 📱 訪問您的 3D Earth Viewer

設定完成後，您可以透過以下網址訪問：

- **完整網址**: https://qq7636946.github.io/nuclear/3d-viewer.html
- **首頁** (如果設定): https://qq7636946.github.io/nuclear/

## 🎨 功能說明

您的 3D Earth Viewer 包含：

- ✨ 互動式 3D 地球模型
- 📜 滾動動畫（Hero 切換到統計數據）
- 🖱️ 滑鼠互動（地球會隨著滑鼠移動傾斜）
- 🌐 完全基於瀏覽器，無需本地伺服器
- 📊 日本工作統計數據展示

## ⚠️ 重要提示

### 為什麼無法直接右鍵開啟 HTML？

即使已經修改，直接右鍵開啟 HTML 檔案（使用 `file://` 協議）仍然會遇到問題：

1. **CORS 限制**: 瀏覽器會阻止載入本地的 3D 模型檔案（.glb）
2. **CDN 資源**: 某些 CDN 資源可能在 file:// 協議下無法載入

### 解決方案

✅ **使用 GitHub Pages**（已設定）- 透過 HTTPS 訪問，完全沒有限制

✅ **使用本地伺服器**（備選）：
```bash
# 使用 Python
python -m http.server 8000

# 或使用 Node.js
npx http-server

# 或使用您專案中的
start-server.bat
```

然後訪問 `http://localhost:8000/3d-viewer.html`

## 🔧 技術細節

### 使用的庫（透過 CDN）

- Three.js v0.160.0 - 3D 圖形渲染
- GSAP 3.12.2 - 動畫
- ScrollTrigger - 滾動觸發動畫

### 檔案結構

```
nuclear/
├── 3d-viewer.html          # 主要檔案
├── earth/
│   ├── source/
│   │   └── earth-cartoon.glb   # 3D 模型
│   └── textures/               # 材質檔案
└── earth-cartoon/              # 備份模型
```

## 📝 自訂說明

如果您想修改內容：

1. **修改文字**: 編輯 HTML 中的 Hero Section 和 Stats Section
2. **修改顏色**: 在 CSS 中更改顏色變數
3. **修改 3D 模型**: 替換 `earth/source/earth-cartoon.glb` 檔案
4. **調整動畫**: 修改 GSAP 和 ScrollTrigger 的參數

## 🎯 下一步

1. ✅ 設定 GitHub Pages（依照上述步驟）
2. ⏳ 等待部署完成（約 1-5 分鐘）
3. 🌐 透過網址訪問您的 3D Earth Viewer
4. 🎨 根據需要自訂內容和樣式

---

建立時間: 2026-02-07
建立者: Claude Sonnet 4.5
