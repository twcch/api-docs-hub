# API Docs Hub

收錄各種 API 官方文件的個人入口。**左邊點選、右邊直接顯示，不換頁也不轉跳。**
純 HTML / CSS / JavaScript，沒有任何框架、建置工具或外部相依。

## 檔案

| 檔案 | 內容 |
|---|---|
| `index.html` | 頁面結構（頂部列、左右分割視窗、命令面板、新增視窗） |
| `styles.css` | 全部樣式，深／淺兩套主題以 CSS 變數切換 |
| `data.js` | 收錄清單：名稱、分類、官方文件網址、能否內嵌 |
| `app.js` | 全部邏輯：分割拖曳、分頁、iframe 載入、搜尋、收藏、自訂項目 |

直接用瀏覽器開 `index.html` 就能用。

## 功能

- **左右／上下分割**：中間分隔線可拖曳（雙擊還原、方向鍵可微調），右上角按鈕切換分割方向
- **多分頁**：最多同時開 8 份文件，切換時保留各自的捲動位置與登入狀態
- **搜尋**：左側即時篩選，或 `⌘K` / `Ctrl+K` 開命令面板全站搜尋
- **收藏與分類**：★ 收藏、依分類篩選、「可內嵌」篩選
- **自訂項目**：`＋` 加入自己常看的文件網址，存在瀏覽器 localStorage
- **深／淺主題**：預設跟隨系統

### 快捷鍵

| 按鍵 | 作用 |
|---|---|
| `⌘K` / `Ctrl+K` | 開啟搜尋面板 |
| `↑` `↓` `↵` | 面板中選擇並在右側開啟 |
| `⌘↵` | 改用新分頁開啟 |
| `⌘W` / `Ctrl+W` | 關閉目前分頁 |
| `Esc` | 關閉面板／視窗 |

## 關於「有些文件載不出來」

這是這類做法無法迴避的限制，說明如下。

網站可以在 HTTP 回應標頭用 `X-Frame-Options` 或 `Content-Security-Policy: frame-ancestors`
宣告「不准被放進別人的 iframe」。瀏覽器會強制執行，**任何前端寫法都繞不過去**
（這是防點擊劫持的安全機制，能繞過就失去意義了）。

而且前端連「有沒有被擋」都偵測不到 —— 實測過，載入成功和被擋下來，
`load` 事件、`contentDocument`、resource timing 給出的訊號完全一樣。

所以這個專案的做法是：**在建置階段實際去打每個網址的 HTTP 標頭**，把結果寫進
`data.js` 的 `embed` 欄位：

- `embed: true` — 對方允許內嵌，點下去直接顯示在右邊視窗
- `embed: false` — 對方拒絕內嵌，改為顯示替代畫面，提供「開成獨立視窗並排看」與「新分頁開啟」

目前 59 份文件中，**15 份可以直接內嵌**，其餘 44 份（Stripe、GitHub、OpenAI、
Google 等大廠站台）都明確拒絕。這不是程式的問題，是它們的安全設定。

對方之後若改了設定，可以用工具列的 **⇄** 按鈕手動改標記，結果會記在 localStorage。

### 重新檢查所有網址

```bash
# 注意要用 GET，不能用 HEAD —— 有些伺服器（例如證交所）兩者回的標頭不一樣
curl -s -D - -o /dev/null -L --max-time 25 \
  -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/131.0 Safari/537.36" \
  "<文件網址>" | grep -iE 'x-frame-options|frame-ancestors'
```

有 `DENY`、`SAMEORIGIN`、`frame-ancestors 'none'` 或 `'self'` 就是不能內嵌。

## 新增收錄項目

網頁上用 `＋` 加的只存在自己的瀏覽器。要讓項目變成清單的一部分，在 `data.js`
的 `APIS` 陣列加一筆：

```js
{ id: 'my-api', cat: 'dev', icon: '📘', name: 'My API',
  zh: '我的 API', tags: ['內部'],
  desc: '一句話說明這份文件在做什麼。',
  embed: true, url: 'https://docs.example.com/', site: 'https://example.com' },
```

`cat` 要對應 `CATEGORIES` 裡既有的 id：
`ai` / `dev` / `pay` / `msg` / `cloud` / `geo` / `media` / `data` / `tool`。
