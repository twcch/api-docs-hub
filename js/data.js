/* ============================================================
   API Docs Hub — 收錄清單
   這裡只存「名稱 / 分類 / 官方文件網址 / 一句話說明」，
   實際文件內容由右側視窗直接載入官方站台，不做任何抓取或複製。
   想新增自己的項目，可以直接在網頁上用「＋ 新增」，
   或在下面的陣列裡加一筆。

   embed 欄位是實際打過該網址的 HTTP 標頭後標記的：
     true  → 對方允許被放進 iframe，會直接顯示在右邊視窗
     false → 對方回了 X-Frame-Options 或 CSP frame-ancestors 拒絕內嵌，
             瀏覽器一定會擋，前端無法繞過，所以改為提供新分頁／獨立視窗開啟
   （對方隨時可能改設定，網頁上每一筆都能手動改標記。）
   ============================================================ */

const CATEGORIES = [
  { id: 'ai',    name: '資料科學', icon: '🧠', accent: '#8b7cff' },
  { id: 'dev',   name: '網站開發',        icon: '⚙️', accent: '#5fb3f5' },
  { id: 'pay',   name: '金流與支付',        icon: '💳', accent: '#5ac8a8' },
  { id: 'msg',   name: '通訊與社群',        icon: '💬', accent: '#4ecb71' },
  { id: 'cloud', name: '雲端與資料庫',      icon: '☁️', accent: '#f2a35e' },
  { id: 'geo',   name: '地圖、天氣與位置',  icon: '🗺️', accent: '#54c7d8' },
  { id: 'media', name: '影音與娛樂',        icon: '🎬', accent: '#f2748f' },
  { id: 'data',  name: '公開資料',          icon: '📊', accent: '#c99bf0' },
  { id: 'tool',  name: '測試與工具型 API',  icon: '🧪', accent: '#9aa6bd' },
];

const APIS = [
  /* ---------- AI ---------- */
  { id: 'sklearn', cat: 'ai', icon: '🧮', name: 'scikit-learn API',
    zh: 'scikit-learn 機器學習', tags: ['Python', '機器學習', 'Estimator'],
    desc: '傳統機器學習的標準工具箱，分類、迴歸、分群與前處理都走同一套 fit/predict 介面。',
    embed: true, url: 'https://scikit-learn.org/stable/api/index.html', site: 'https://scikit-learn.org' },

  { id: 'pytorch', cat: 'ai', icon: '🔥', name: 'PyTorch API',
    zh: 'PyTorch 深度學習', tags: ['Python', '深度學習', 'Tensor'],
    desc: '張量運算、autograd、nn 模組與訓練相關 API 的完整參考，研究圈的主流框架。',
    embed: true, url: 'https://docs.pytorch.org/docs/stable/index.html', site: 'https://pytorch.org' },

  { id: 'tensorflow', cat: 'ai', icon: '🟧', name: 'TensorFlow API',
    zh: 'TensorFlow / Keras', tags: ['Python', 'Keras', '深度學習'],
    desc: 'tf 命名空間下所有模組與 Keras 高階介面的 Python API 文件。',
    embed: false, url: 'https://www.tensorflow.org/api_docs/python/tf', site: 'https://www.tensorflow.org' },

  { id: 'langchain', cat: 'ai', icon: '🦜', name: 'LangChain Docs',
    zh: 'LangChain 參考文件', tags: ['LLM', 'Chain', 'Agent'],
    desc: '把 LLM 串成鏈與代理人的框架，這頁是各套件模組與類別的完整 API 索引。',
    embed: false, url: 'https://docs.langchain.com/oss/python/langchain/', site: 'https://www.langchain.com' },

  { id: 'huggingface', cat: 'ai', icon: '🤗', name: 'HuggingFace Docs',
    zh: 'Hugging Face API', tags: ['開源模型', 'Hub'],
    desc: '直接呼叫 Hub 上數十萬個開源模型做推論，也能查詢模型與資料集資訊。',
    embed: false, url: 'https://huggingface.co/docs/', site: 'https://huggingface.co' },

  { id: 'ollama', cat: 'ai', icon: '🦙', name: 'Ollama API',
    zh: 'Ollama 本機模型', tags: ['本機部署', 'localhost', '開源'],
    desc: '在自己電腦上跑模型時使用的本機 REST 介面，預設監聽 11434 埠。',
    embed: false, url: 'https://docs.ollama.com/api/', site: 'https://ollama.com' },

  { id: 'vllm', cat: 'ai', icon: '⚡', name: 'vLLM API',
    zh: 'vLLM 推論服務', tags: ['LLM', '推論', 'OpenAI 相容'],
    desc: '以 PagedAttention 做高吞吐量 LLM 推論的服務框架，可直接開成 OpenAI 相容端點。',
    embed: true, url: 'https://docs.vllm.ai/en/stable/api/', site: 'https://vllm.ai' },

  { id: 'matplotlib', cat: 'ai', icon: '📉', name: 'Matplotlib API',
    zh: 'Matplotlib 繪圖', tags: ['Python', '繪圖', 'pyplot'],
    desc: 'Python 繪圖的基礎函式庫，pyplot、Figure 與 Axes 各層級的完整 API 索引。',
    embed: false, url: 'https://matplotlib.org/stable/api/index.html', site: 'https://matplotlib.org' },

  { id: 'seaborn', cat: 'ai', icon: '🌊', name: 'seaborn API',
    zh: 'seaborn 統計繪圖', tags: ['Python', '統計圖表', 'DataFrame'],
    desc: '架在 Matplotlib 之上的統計繪圖介面，直接吃 DataFrame 畫出有預設美感的圖表。',
    embed: true, url: 'https://seaborn.pydata.org/api.html', site: 'https://seaborn.pydata.org' },

  /* ---------- 開發者平台 ---------- */
  { id: 'python', cat: 'dev', icon: '🐍', name: 'Python 3 API',
    zh: 'Python 3 官方文件', tags: ['Python', '標準函式庫', '內建模組'],
    desc: 'Python 3 內建模組的官方參考，型別、檔案 IO、並行與網路模組都收在這裡。',
    embed: true, url: 'https://docs.python.org/3/library/index.html', site: 'https://www.python.org' },

  { id: 'fastapi', cat: 'dev', icon: '🚀', name: 'FastAPI Reference',
    zh: 'FastAPI 參考文件', tags: ['Python', 'ASGI', 'OpenAPI'],
    desc: '用型別註記自動產生 OpenAPI 規格的非同步框架，這頁列出各類別與函式的簽章。',
    embed: true, url: 'https://fastapi.tiangolo.com/reference/', site: 'https://fastapi.tiangolo.com' },

  { id: 'flask', cat: 'dev', icon: '🍶', name: 'Flask API Reference',
    zh: 'Flask 微框架', tags: ['Python', 'WSGI', 'Blueprint'],
    desc: 'Flask 的 API 參考，涵蓋 app、request、blueprint 與 context 相關物件。',
    embed: true, url: 'https://flask.palletsprojects.com/en/stable/api/', site: 'https://flask.palletsprojects.com' },

  { id: 'django', cat: 'dev', icon: '🎸', name: 'Django 6.1 API Reference',
    zh: 'Django 文件', tags: ['Python', 'ORM', '全功能框架'],
    desc: 'Django 各模組的參考文件，含 ORM 查詢、表單、模板標籤與 settings 設定項。',
    embed: false, url: 'https://docs.djangoproject.com/en/6.1/ref/', site: 'https://www.djangoproject.com' },

  { id: 'streamlit', cat: 'ai', icon: '🎈', name: 'Streamlit API',
    zh: 'Streamlit 資料應用', tags: ['Python', '資料應用', 'UI 元件'],
    desc: '用純 Python 寫互動式資料應用，這頁列出所有 st.* 元件與快取、狀態相關 API。',
    embed: false, url: 'https://docs.streamlit.io/develop/api-reference', site: 'https://streamlit.io' },

  { id: 'java24', cat: 'dev', icon: '☕', name: 'Java SE 24 Docs',
    zh: 'Java 24 Javadoc', tags: ['Java', 'LTS', '虛擬執行緒'],
    desc: '較新的 LTS 版本，虛擬執行緒與 SequencedCollection 等新標準 API 都在這一版。',
    embed: true, url: 'https://docs.oracle.com/en/java/javase/24/docs/api/index.html', site: 'https://www.oracle.com/java/' },

  { id: 'spring-framework', cat: 'dev', icon: '🌿', name: 'Spring Framework 7.0 API',
    zh: 'Spring Framework Javadoc', tags: ['Java', 'IoC', 'AOP'],
    desc: '7.0.8 版的完整 Javadoc，Bean 容器、AOP、事務與 WebFlux 的類別與介面說明。',
    embed: true, url: 'https://docs.spring.io/spring-framework/docs/7.0.8/javadoc-api/', site: 'https://spring.io/projects/spring-framework' },

  { id: 'spring-boot', cat: 'dev', icon: '🥾', name: 'Spring Boot 4.1 API',
    zh: 'Spring Boot Javadoc', tags: ['Java', '自動組態', 'Starter'],
    desc: '自動組態類別、@ConfigurationProperties 設定項與 Actuator 端點的 Javadoc。',
    embed: true, url: 'https://docs.spring.io/spring-boot/api/java/index.html', site: 'https://spring.io/projects/spring-boot' },

  { id: 'spring-security', cat: 'dev', icon: '🔐', name: 'Spring Security 7.1 API',
    zh: 'Spring Security Javadoc', tags: ['Java', '驗證授權', 'OAuth 2.0'],
    desc: '驗證與授權框架的 Javadoc，含 SecurityFilterChain、OAuth2 與方法層級權限。',
    embed: true, url: 'https://docs.spring.io/spring-security/reference/api/java/index.html', site: 'https://spring.io/projects/spring-security' },

  { id: 'spring-data', cat: 'dev', icon: '🗃️', name: 'Spring Data Core 4.1 API',
    zh: 'Spring Data Commons Javadoc', tags: ['Java', 'Repository', '分頁排序'],
    desc: '各 Spring Data 模組共用的核心型別：Repository、Pageable、Sort 與查詢衍生規則。',
    embed: true, url: 'https://docs.spring.io/spring-data/commons/reference/api/java/', site: 'https://spring.io/projects/spring-data' },

  { id: 'maven', cat: 'dev', icon: '🏗️', name: 'Apache Maven Guides',
    zh: 'Maven 建置工具', tags: ['Java', '建置', 'POM'],
    desc: 'Java 專案的建置與相依管理工具，官方指南含 POM 欄位與生命週期說明。',
    embed: false, url: 'https://maven.apache.org/guides/index.html', site: 'https://maven.apache.org' },

  { id: 'react', cat: 'dev', icon: '⚛️', name: 'React Reference',
    zh: 'React 官方文件', tags: ['前端', 'Hook', 'Component'],
    desc: 'React 的 API 參考，Hook、元件與 react-dom 的行為與參數都在這一區。',
    embed: true, url: 'https://react.dev/reference/react', site: 'https://react.dev' },

  { id: 'vue', cat: 'dev', icon: '💚', name: 'Vue 3 API',
    zh: 'Vue.js 官方文件', tags: ['前端', 'Composition API', 'SFC'],
    desc: 'Vue 3 的完整 API 列表，含 Composition API、內建元件與響應式工具函式。',
    embed: false, url: 'https://vuejs.org/api/', site: 'https://vuejs.org' },

  { id: 'bootstrap', cat: 'dev', icon: '🅱️', name: 'Bootstrap 5.3 文件',
    zh: 'Bootstrap 前端框架', tags: ['CSS', '元件', 'RWD'],
    desc: '最普及的 CSS 框架，格線系統、元件與工具類別的用法與範例都在這裡。',
    embed: true, url: 'https://getbootstrap.com/docs/5.3/getting-started/introduction/', site: 'https://getbootstrap.com' },

  /* ---------- 金流 ---------- */
  { id: 'stripe', cat: 'pay', icon: '💠', name: 'Stripe API',
    zh: 'Stripe 金流', tags: ['付款', '訂閱', 'Webhook'],
    desc: '國際金流的業界標準，文件本身就是很好的 API 設計範本。',
    embed: false, url: 'https://docs.stripe.com/api', site: 'https://stripe.com' },

  { id: 'paypal', cat: 'pay', icon: '🅿️', name: 'PayPal REST API',
    zh: 'PayPal', tags: ['付款', '訂閱', 'OAuth 2.0'],
    desc: 'Orders、Payments、Subscriptions 等 REST 端點與沙箱環境說明。',
    embed: false, url: 'https://developer.paypal.com/api/rest/', site: 'https://www.paypal.com' },

  { id: 'ecpay', cat: 'pay', icon: '🟢', name: '綠界科技 ECPay',
    zh: '綠界全方位金流', tags: ['台灣', '超商代碼', 'CheckMacValue'],
    desc: '台灣最常見的金流串接之一，涵蓋信用卡、ATM、超商代碼與電子發票。',
    embed: true, url: 'https://developers.ecpay.com.tw/', site: 'https://www.ecpay.com.tw' },

  { id: 'tappay', cat: 'pay', icon: '💚', name: 'TapPay',
    zh: 'TapPay 金流', tags: ['台灣', 'SDK', 'Apple Pay'],
    desc: '台灣的行動支付串接服務，前端 SDK 取得 prime 後由後端請款。',
    embed: true, url: 'https://docs.tappaysdk.com/', site: 'https://www.tappaysdk.com' },

  { id: 'newebpay', cat: 'pay', icon: '🔵', name: '藍新金流 NewebPay',
    zh: '藍新金流', tags: ['台灣', 'AES 加密', '幕前支付'],
    desc: '台灣常見金流服務商，串接時需處理 AES/SHA256 的交易資料加解密。',
    embed: false, url: 'https://www.newebpay.com/website/Page/content/download_api', site: 'https://www.newebpay.com' },

  { id: 'linepay', cat: 'pay', icon: '💚', name: 'LINE Pay API',
    zh: 'LINE Pay', tags: ['台灣', '行動支付', 'LINE'],
    desc: 'LINE Pay 線上支付的請求／確認流程與商家串接規格。',
    embed: true, url: 'https://pay.line.me/tw/developers/apis/onlineApis', site: 'https://pay.line.me' },

  /* ---------- 通訊 ---------- */
  { id: 'line', cat: 'msg', icon: '💚', name: 'LINE Messaging API',
    zh: 'LINE 官方帳號', tags: ['Bot', 'Webhook', 'Flex Message'],
    desc: '打造 LINE official account 機器人，含推播、回覆與 Flex Message 版型。',
    embed: true, url: 'https://developers.line.biz/en/reference/messaging-api/', site: 'https://developers.line.biz' },

  { id: 'slack', cat: 'msg', icon: '💼', name: 'Slack Web API',
    zh: 'Slack API', tags: ['Bot', 'Block Kit', 'Socket Mode'],
    desc: 'Slack 應用開發的核心方法列表，配合 Block Kit 做互動式訊息。',
    embed: false, url: 'https://api.slack.com/web', site: 'https://slack.com' },

  { id: 'discord', cat: 'msg', icon: '🎮', name: 'Discord API',
    zh: 'Discord 開發者', tags: ['Bot', 'Gateway', 'Slash Command'],
    desc: 'REST 端點加上 WebSocket Gateway，是做 Discord 機器人的入口。',
    embed: false, url: 'https://discord.com/developers/docs/intro', site: 'https://discord.com' },

  { id: 'telegram', cat: 'msg', icon: '✈️', name: 'Telegram Bot API',
    zh: 'Telegram 機器人', tags: ['Bot', '免費', 'Long Polling'],
    desc: '單一頁面就寫完所有方法，是最容易上手的機器人 API 之一。',
    embed: false, url: 'https://core.telegram.org/bots/api', site: 'https://telegram.org' },

  { id: 'twilio', cat: 'msg', icon: '📞', name: 'Twilio API',
    zh: 'Twilio 簡訊語音', tags: ['SMS', '語音', 'WhatsApp'],
    desc: '簡訊、語音通話、WhatsApp 與驗證碼服務的雲端通訊 API。',
    embed: true, url: 'https://www.twilio.com/docs/usage/api', site: 'https://www.twilio.com' },

  { id: 'resend', cat: 'msg', icon: '✉️', name: 'Resend API',
    zh: 'Resend 郵件', tags: ['Email', 'React Email', '開發者導向'],
    desc: '為開發者設計的交易郵件服務，API 極簡、支援 React 版型。',
    embed: false, url: 'https://resend.com/docs/api-reference/introduction', site: 'https://resend.com' },

  /* ---------- 雲端 ---------- */
  { id: 'supabase', cat: 'cloud', icon: '⚡', name: 'Supabase API',
    zh: 'Supabase', tags: ['PostgREST', 'Auth', 'Realtime'],
    desc: '以 PostgreSQL 為核心的後端服務，資料表自動產生 REST 端點。',
    embed: false, url: 'https://supabase.com/docs/guides/api', site: 'https://supabase.com' },

  { id: 'firebase', cat: 'cloud', icon: '🔥', name: 'Firebase REST API',
    zh: 'Firebase', tags: ['Realtime DB', 'Firestore', 'FCM'],
    desc: 'Realtime Database 與 Firestore 的 REST 存取方式，適合無 SDK 環境。',
    embed: false, url: 'https://firebase.google.com/docs/reference/rest/database', site: 'https://firebase.google.com' },

  { id: 'cloudflare', cat: 'cloud', icon: '🟠', name: 'Cloudflare API',
    zh: 'Cloudflare', tags: ['DNS', 'Workers', 'R2'],
    desc: 'DNS、快取、Workers、R2 儲存等全線產品的統一 API 介面。',
    embed: false, url: 'https://developers.cloudflare.com/api/', site: 'https://www.cloudflare.com' },

  { id: 'airtable', cat: 'cloud', icon: '🗂️', name: 'Airtable Web API',
    zh: 'Airtable', tags: ['試算表', 'CRUD', '無程式後台'],
    desc: '把 Airtable 當資料庫用，提供標準的欄位查詢與 CRUD 端點。',
    embed: false, url: 'https://airtable.com/developers/web/api/introduction', site: 'https://airtable.com' },

  { id: 's3', cat: 'cloud', icon: '🪣', name: 'Amazon S3 API',
    zh: 'AWS S3', tags: ['物件儲存', 'SigV4', 'Presigned URL'],
    desc: '物件儲存的事實標準，簽章流程 SigV4 也被許多相容服務沿用。',
    embed: false, url: 'https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html', site: 'https://aws.amazon.com/s3/' },

  { id: 'gdrive', cat: 'cloud', icon: '📁', name: 'Google Drive API',
    zh: 'Google 雲端硬碟', tags: ['檔案', 'OAuth 2.0', '權限'],
    desc: '上傳下載檔案、管理資料夾與共用權限，需走 Google OAuth 授權。',
    embed: false, url: 'https://developers.google.com/drive/api/reference/rest/v3', site: 'https://drive.google.com' },

  { id: 'postgres', cat: 'cloud', icon: '🐘', name: 'PostgreSQL 文件',
    zh: 'PostgreSQL 手冊', tags: ['SQL', '關聯式', '開源'],
    desc: '功能最完整的開源關聯式資料庫，SQL 語法、型別、索引與設定參數的官方手冊。',
    embed: false, url: 'https://www.postgresql.org/docs/current/', site: 'https://www.postgresql.org' },

  { id: 'mysql', cat: 'cloud', icon: '🐬', name: 'MySQL 8.4 Reference Manual',
    zh: 'MySQL 手冊', tags: ['SQL', '關聯式', 'InnoDB'],
    desc: '最常見的關聯式資料庫之一，8.4 LTS 版的語法、儲存引擎與複寫設定參考。',
    embed: false, url: 'https://dev.mysql.com/doc/refman/8.4/en/', site: 'https://www.mysql.com' },

  { id: 'mongodb', cat: 'cloud', icon: '🍃', name: 'MongoDB Reference',
    zh: 'MongoDB 手冊', tags: ['NoSQL', '文件導向', 'Aggregation'],
    desc: '文件導向資料庫的參考文件，含查詢運算子、聚合管線與索引設定。',
    embed: true, url: 'https://www.mongodb.com/docs/manual/reference/', site: 'https://www.mongodb.com' },

  { id: 'redis', cat: 'cloud', icon: '🟥', name: 'Redis Commands',
    zh: 'Redis 指令參考', tags: ['快取', 'Key-Value', '記憶體'],
    desc: '記憶體型資料庫的完整指令列表，每個指令都標了時間複雜度與可用版本。',
    embed: true, url: 'https://redis.io/docs/latest/commands/', site: 'https://redis.io' },

  /* ---------- 地圖天氣 ---------- */
  { id: 'gmaps', cat: 'geo', icon: '📍', name: 'Google Maps Platform',
    zh: 'Google 地圖', tags: ['地理編碼', '路線', 'Places'],
    desc: '地圖顯示、地理編碼、路線規劃與地點搜尋的整套服務文件。',
    embed: false, url: 'https://developers.google.com/maps/documentation', site: 'https://mapsplatform.google.com' },

  { id: 'mapbox', cat: 'geo', icon: '🧭', name: 'Mapbox API',
    zh: 'Mapbox', tags: ['向量圖磚', '導航', '自訂樣式'],
    desc: '高度可客製的地圖服務，向量圖磚與導航 API 是主力。',
    embed: false, url: 'https://docs.mapbox.com/api/overview/', site: 'https://www.mapbox.com' },

  { id: 'owm', cat: 'geo', icon: '🌦️', name: 'OpenWeatherMap API',
    zh: 'OpenWeather', tags: ['天氣', '預報', '免費額度'],
    desc: '全球即時天氣與預報資料，免費方案就夠做個人專案。',
    embed: true, url: 'https://openweathermap.org/api', site: 'https://openweathermap.org' },

  { id: 'cwa', cat: 'geo', icon: '🌀', name: '中央氣象署開放資料',
    zh: 'CWA 氣象開放平臺', tags: ['台灣', '天氣', '地震'],
    desc: '台灣官方氣象、地震、潮汐資料，申請授權碼後即可呼叫。',
    embed: false, url: 'https://opendata.cwa.gov.tw/dist/opendata-swagger.html', site: 'https://opendata.cwa.gov.tw' },

  { id: 'nominatim', cat: 'geo', icon: '🗾', name: 'OSM Nominatim',
    zh: 'OpenStreetMap 地理編碼', tags: ['開源', '地理編碼', '免金鑰'],
    desc: 'OpenStreetMap 的地址與座標互轉服務，注意有嚴格的使用禮儀規範。',
    embed: true, url: 'https://nominatim.org/release-docs/latest/api/Overview/', site: 'https://www.openstreetmap.org' },

  { id: 'ipapi', cat: 'geo', icon: '🌍', name: 'ipapi',
    zh: 'IP 位置查詢', tags: ['IP', '定位', '免金鑰試用'],
    desc: '用 IP 反查國家、城市與時區，前端就能直接呼叫。',
    embed: false, url: 'https://ipapi.co/api/', site: 'https://ipapi.co' },

  /* ---------- 影音 ---------- */
  { id: 'youtube', cat: 'media', icon: '▶️', name: 'YouTube Data API v3',
    zh: 'YouTube 資料 API', tags: ['影片', '頻道', '配額'],
    desc: '搜尋影片、讀取頻道與播放清單資料，注意每日配額計算方式。',
    embed: false, url: 'https://developers.google.com/youtube/v3/docs', site: 'https://www.youtube.com' },

  { id: 'spotify', cat: 'media', icon: '🎵', name: 'Spotify Web API',
    zh: 'Spotify', tags: ['音樂', 'OAuth', 'PKCE'],
    desc: '曲目搜尋、播放清單管理與播放控制，前端建議走 PKCE 流程。',
    embed: false, url: 'https://developer.spotify.com/documentation/web-api', site: 'https://www.spotify.com' },

  { id: 'tmdb', cat: 'media', icon: '🎞️', name: 'TMDB API',
    zh: '電影資料庫', tags: ['電影', '影集', '海報圖'],
    desc: '電影與影集的中繼資料與圖片來源，個人專案申請即可免費使用。',
    embed: false, url: 'https://developer.themoviedb.org/reference/intro/getting-started', site: 'https://www.themoviedb.org' },

  { id: 'twitch', cat: 'media', icon: '🟣', name: 'Twitch API',
    zh: 'Twitch', tags: ['直播', 'EventSub', 'OAuth'],
    desc: '直播狀態查詢、聊天室整合與 EventSub 事件訂閱。',
    embed: true, url: 'https://dev.twitch.tv/docs/api/reference/', site: 'https://www.twitch.tv' },

  { id: 'unsplash', cat: 'media', icon: '📷', name: 'Unsplash API',
    zh: 'Unsplash 圖庫', tags: ['圖片', '免費授權', '搜尋'],
    desc: '高品質免費圖庫的搜尋與下載端點，需標註攝影者。',
    embed: false, url: 'https://unsplash.com/documentation', site: 'https://unsplash.com' },

  { id: 'giphy', cat: 'media', icon: '🎪', name: 'GIPHY API',
    zh: 'GIPHY', tags: ['GIF', '貼圖', '搜尋'],
    desc: 'GIF 與貼圖的搜尋、趨勢與隨機端點，常用來做聊天室功能。',
    embed: true, url: 'https://developers.giphy.com/docs/api/', site: 'https://giphy.com' },

  /* ---------- 公開資料 ---------- */
  { id: 'datagovtw', cat: 'data', icon: '🇹🇼', name: '政府資料開放平臺',
    zh: 'data.gov.tw', tags: ['台灣', '開放資料', '免金鑰'],
    desc: '台灣各部會開放資料集的入口，多數資料可直接以 JSON 取得。',
    embed: false, url: 'https://data.gov.tw/api-service', site: 'https://data.gov.tw' },

  { id: 'twse', cat: 'data', icon: '📈', name: '臺灣證券交易所 OpenAPI',
    zh: 'TWSE 證交所', tags: ['台股', '免金鑰', 'Swagger'],
    desc: '上市股票日成交、法人買賣超等公開資料，免申請即可呼叫。',
    embed: false, url: 'https://openapi.twse.com.tw/', site: 'https://www.twse.com.tw' },

  { id: 'tdx', cat: 'data', icon: '🚆', name: 'TDX 運輸資料流通服務',
    zh: '交通部 TDX', tags: ['台灣', '公車', '鐵路'],
    desc: '全台公車、鐵路、航班與即時路況資料，需先申請 OAuth 憑證。',
    embed: false, url: 'https://tdx.transportdata.tw/api-service/swagger', site: 'https://tdx.transportdata.tw' },

  { id: 'taipei', cat: 'data', icon: '🏙️', name: '臺北市資料大平臺',
    zh: 'data.taipei', tags: ['台北', '開放資料', 'CKAN'],
    desc: '台北市政府開放資料，走 CKAN 標準介面查詢資料集。',
    embed: false, url: 'https://data.taipei/', site: 'https://data.taipei' },

  { id: 'restcountries', cat: 'data', icon: '🏳️', name: 'REST Countries',
    zh: '國家資料 API', tags: ['免金鑰', '國旗', '教學常用'],
    desc: '各國名稱、國旗、貨幣、語言資料，完全免費且免驗證。',
    embed: true, url: 'https://restcountries.com/', site: 'https://restcountries.com' },

  { id: 'nasa', cat: 'data', icon: '🚀', name: 'NASA Open APIs',
    zh: 'NASA 開放 API', tags: ['太空', '每日天文圖', 'DEMO_KEY'],
    desc: '每日天文圖、火星探測車照片與近地小行星資料，可用 DEMO_KEY 試玩。',
    embed: false, url: 'https://api.nasa.gov/', site: 'https://www.nasa.gov' },

  { id: 'coingecko', cat: 'data', icon: '🪙', name: 'CoinGecko API',
    zh: '加密貨幣行情', tags: ['幣價', '免費版', '歷史資料'],
    desc: '加密貨幣即時價格、市值與歷史走勢，免費版有速率限制。',
    embed: false, url: 'https://docs.coingecko.com/reference/introduction', site: 'https://www.coingecko.com' },

  /* ---------- 工具 ---------- */
  { id: 'jsonplaceholder', cat: 'tool', icon: '🧩', name: 'JSONPlaceholder',
    zh: '假資料 API', tags: ['測試', '免金鑰', 'CORS 開放'],
    desc: '前端練習與 demo 最常用的假 REST API，直接打就有資料。',
    embed: true, url: 'https://jsonplaceholder.typicode.com/', site: 'https://jsonplaceholder.typicode.com' },

  { id: 'httpbin', cat: 'tool', icon: '🔬', name: 'httpbin',
    zh: 'HTTP 測試工具', tags: ['除錯', '回音服務', '狀態碼'],
    desc: '把你送出的請求原封不動回傳，測 header、狀態碼與延遲很好用。',
    embed: true, url: 'https://httpbin.org/', site: 'https://httpbin.org' },

  { id: 'petstore', cat: 'tool', icon: '🐾', name: 'Swagger Petstore',
    zh: 'OpenAPI 範例', tags: ['OpenAPI', '規格範例', '可試打'],
    desc: 'OpenAPI 官方示範規格，是理解 Swagger UI 與規格寫法的標準教材。',
    embed: false, url: 'https://petstore.swagger.io/', site: 'https://swagger.io' },

  { id: 'publicapis', cat: 'tool', icon: '📚', name: 'Public APIs 清單',
    zh: '免費 API 大全', tags: ['清單', '收錄', 'GitHub'],
    desc: 'GitHub 上維護的免費公開 API 總表，想找新東西時從這裡挖。',
    embed: false, url: 'https://github.com/public-apis/public-apis', site: 'https://github.com' },

  { id: 'qrcode', cat: 'tool', icon: '🔳', name: 'QR Code API',
    zh: 'QR 產生器', tags: ['圖片', '免金鑰', 'GET 即可'],
    desc: '用一個 GET 網址就能產生 QR Code 圖片，適合嵌在任何頁面。',
    embed: false, url: 'https://goqr.me/api/', site: 'https://goqr.me' },
];
