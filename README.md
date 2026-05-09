# 闖關問答遊戲 (Pixel Art QA Game)

這是一款 2000 年代街機風格 (Pixel Art) 的網頁闖關問答遊戲。前端採用 React + Vite 開發，後端則整合 Google Apps Script (GAS) 與 Google Sheets，無需架設傳統資料庫即可管理題庫與玩家成績。

## 系統需求
- Node.js (用於執行前端專案)
- Google 帳號 (用於建立 Google Sheets 與 Apps Script)

---

## 1. 本地端安裝與執行

1. 確保已安裝相依套件：
   ```bash
   npm install
   ```
2. 啟動開發伺服器：
   ```bash
   npm run dev
   ```

---

## 2. Google Sheets 基礎設定

1. 建立一份新的 [Google 試算表](https://sheets.google.com/)。
2. 建立兩個工作表，名稱**必須**完全相符：
   - `題目`
   - `回答`
3. 在 `題目` 工作表的第一列依序輸入以下標題 (A1~G1)：
   `題號`, `題目`, `A`, `B`, `C`, `D`, `解答`
4. 在 `回答` 工作表的第一列依序輸入以下標題 (A1~G1)：
   `ID`, `闖關次數`, `總分`, `最高分`, `第一次通關分數`, `花了幾次通關`, `最近遊玩時間`

---

## 3. Google Apps Script (GAS) 部署教學

1. 在您的 Google 試算表中，點擊上方選單的 **「擴充功能」 > 「Apps Script」**。
2. 系統會開啟一個新分頁，請將預設的 `程式碼.gs` 內容清空。
3. 打開本專案目錄中的 `gas_backend.js` 檔案，複製裡面所有的程式碼，並貼上到 `程式碼.gs` 中。
4. 點擊上方的 **「儲存」** 圖示 (或按 Ctrl+S / Cmd+S)。
5. 點擊右上角的 **「部署」 > 「新增部署作業」**。
6. 在彈出視窗左側的齒輪圖示旁邊，點選 **「網頁應用程式」**。
7. 右側設定請依照以下配置：
   - 說明：(可隨意填寫，如 `v1`)
   - 執行身分：**`我 (您的信箱)`**
   - 誰可以存取：**`所有人`**
8. 點擊 **「部署」**。
   > **注意**：若是第一次部署，系統會要求授權存取您的 Google 帳號。請點選 `核准存取權` -> 選擇您的帳號 -> 點擊左下角 `進階` -> 點擊 `前往... (不安全)` -> 點擊 `允許`。
9. 部署完成後，複製畫面上提供的 **網頁應用程式 URL**。

---

## 4. 專案環境變數設定

1. 開啟專案根目錄下的 `.env` 檔案。
2. 將剛才複製的 URL 貼在對應的變數後方：
   ```env
   VITE_GOOGLE_APP_SCRIPT_URL=這裡貼上您的網頁應用程式URL
   VITE_PASS_THRESHOLD=3
   VITE_QUESTION_COUNT=5
   ```
   > 註：`VITE_PASS_THRESHOLD` 為通關及格標準，`VITE_QUESTION_COUNT` 為每次抽取的題目數量。
3. 重新啟動您的前端開發伺服器，即可開始正式遊玩！

---

## 5. 部署到 GitHub Pages (自動化部署)

本專案已配置好 GitHub Actions。當您將程式碼推送到 GitHub 時，會自動編譯並發布到 GitHub Pages。

**部署設定步驟：**
1. 將本專案上傳至您的 GitHub 儲存庫 (Repository)。
2. 在您的 GitHub 儲存庫頁面，點選上方的 **「Settings」**。
3. 於左側選單找到 **「Secrets and variables」 > 「Actions」**。
4. 點擊 **「New repository secret」**，依序新增以下三個環境變數（請參考您的 `.env` 或 `.env.example`）：
   - Name: `VITE_GOOGLE_APP_SCRIPT_URL` / Secret: `您的 GAS URL`
   - Name: `VITE_PASS_THRESHOLD` / Secret: `3` (過關及格門檻)
   - Name: `VITE_QUESTION_COUNT` / Secret: `5` (抽題數量)
5. 當您將程式碼推送到 `main` 或 `master` 分支後，GitHub Actions 就會自動運行。
6. 等待 Actions 執行完畢（這會自動幫您建立一個 `gh-pages` 分支）。
7. 在左側選單找到 **「Pages」**。
8. 在「Build and deployment」區塊的「Source」下拉選單，選擇 **「Deploy from a branch」**。
9. 在 Branch 的下拉選單選擇 **`gh-pages`**，然後點擊 **「Save」**。
10. 完成後即可在最上方取得您的專屬網址！

---

## 6. 測試題庫：生成式AI基礎知識

您可以直接複製以下表格的內容（不包含最上方的表頭，從 `1` 開始複製），直接貼上到您 Google Sheets `題目` 工作表的 **A2** 儲存格中進行測試：

| 題號 | 題目 | A | B | C | D | 解答 |
|---|---|---|---|---|---|---|
| 1 | 生成式AI的主要功能是什麼？ | 分類資料 | 產生新內容 | 刪除檔案 | 修復硬體 | B |
| 2 | 以下哪個是常見的大型語言模型(LLM)？ | Photoshop | Excel | GPT-4 | Chrome | C |
| 3 | ChatGPT 是由哪家公司開發的？ | Google | Meta | OpenAI | Microsoft | C |
| 4 | Prompt (提示詞) 在生成式AI中的作用是什麼？ | 提升硬體效能 | 指導AI生成特定輸出 | 增加網路頻寬 | 防毒 | B |
| 5 | Midjourney 主要是用來生成什麼的AI？ | 影片 | 音樂 | 程式碼 | 圖像 | D |
| 6 | 下列何者「不是」生成式AI可能帶來的風險？ | 產生幻覺(Hallucination) | 降低運算成本 | 著作權爭議 | 散佈假訊息 | B |
| 7 | 所謂的「幻覺(Hallucination)」在AI領域是指什麼？ | AI看到了鬼 | AI生成的內容看似合理但卻是錯誤的 | 螢幕顯示異常 | 使用者產生的錯覺 | B |
| 8 | 關於生成式AI的訓練資料，下列敘述何者正確？ | 不需要任何資料 | 僅使用私人對話 | 需要大量且多樣化的文本或圖像資料 | 只能用英文資料訓練 | C |
| 9 | Copilot 主要的功能是協助使用者做什麼？ | 撰寫與自動完成程式碼 | 煮飯 | 駕駛飛機 | 修理汽車 | A |
| 10 | 下列哪個詞彙最能代表AI根據輸入產出文字的過程？ | 編譯 (Compile) | 渲染 (Render) | 生成 (Generate) | 壓縮 (Compress) | C |
