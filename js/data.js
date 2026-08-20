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
  { id: 'database', name: '資料庫',      icon: '🛢️', accent: '#f2a35e' },
  // { id: 'pay',   name: '金流與支付',        icon: '💳', accent: '#5ac8a8' },
  // { id: 'msg',   name: '通訊與社群',        icon: '💬', accent: '#4ecb71' },
  // { id: 'geo',   name: '地圖、天氣與位置',  icon: '🗺️', accent: '#54c7d8' },
  // { id: 'media', name: '影音與娛樂',        icon: '🎬', accent: '#f2748f' },
  // { id: 'data',  name: '公開資料',          icon: '📊', accent: '#c99bf0' },
  // { id: 'tool',  name: '測試與工具型 API',  icon: '🧪', accent: '#9aa6bd' },
];

const APIS = [
  /* ---------- 資料科學 ---------- */
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

  /* ---------- 網站開發 ---------- */
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

  { id: 'mvnrepository', cat: 'dev', icon: '📦', name: 'MVN Repository',
    zh: 'Maven 套件索引', tags: ['Java', '相依套件', 'Gradle'],
    desc: '查 Java 套件的版本與座標，直接複製 Maven／Gradle 的相依宣告貼進專案。',
    embed: false, url: 'https://mvnrepository.com/', site: 'https://mvnrepository.com' },

  { id: 'vue', cat: 'dev', icon: '💚', name: 'Vue API',
    zh: 'Vue.js 官方文件', tags: ['前端', 'Composition API', 'SFC'],
    desc: 'Vue 3 的完整 API 列表，含 Composition API、內建元件與響應式工具函式。',
    embed: false, url: 'https://vuejs.org/api/', site: 'https://vuejs.org' },

  { id: 'react', cat: 'dev', icon: '⚛️', name: 'React Reference',
    zh: 'React 官方文件', tags: ['前端', 'Hook', 'Component'],
    desc: 'React 的 API 參考，Hook、元件與 react-dom 的行為與參數都在這一區。',
    embed: true, url: 'https://react.dev/reference/react', site: 'https://react.dev' },

  { id: 'bootstrap', cat: 'dev', icon: '🅱️', name: 'Bootstrap 5.3 Docs',
    zh: 'Bootstrap 前端框架', tags: ['CSS', '元件', 'RWD'],
    desc: '最普及的 CSS 框架，格線系統、元件與工具類別的用法與範例都在這裡。',
    embed: true, url: 'https://getbootstrap.com/docs/5.3/getting-started/introduction/', site: 'https://getbootstrap.com' },

  /* ---------- 資料庫 ---------- */
  { id: 'postgres', cat: 'database', icon: '🐘', name: 'PostgreSQL Docs',
    zh: 'PostgreSQL 手冊', tags: ['SQL', '關聯式', '開源'],
    desc: '功能最完整的開源關聯式資料庫，SQL 語法、型別、索引與設定參數的官方手冊。',
    embed: false, url: 'https://www.postgresql.org/docs/current/', site: 'https://www.postgresql.org' },

  { id: 'mysql', cat: 'database', icon: '🐬', name: 'MySQL 8.4 Reference Manual',
    zh: 'MySQL 手冊', tags: ['SQL', '關聯式', 'InnoDB'],
    desc: '最常見的關聯式資料庫之一，8.4 LTS 版的語法、儲存引擎與複寫設定參考。',
    embed: false, url: 'https://dev.mysql.com/doc/refman/8.4/en/', site: 'https://www.mysql.com' },

  { id: 'mongodb', cat: 'database', icon: '🍃', name: 'MongoDB Reference',
    zh: 'MongoDB 手冊', tags: ['NoSQL', '文件導向', 'Aggregation'],
    desc: '文件導向資料庫的參考文件，含查詢運算子、聚合管線與索引設定。',
    embed: true, url: 'https://www.mongodb.com/docs/manual/reference/', site: 'https://www.mongodb.com' },

  { id: 'redis', cat: 'database', icon: '🟥', name: 'Redis Commands',
    zh: 'Redis 指令參考', tags: ['快取', 'Key-Value', '記憶體'],
    desc: '記憶體型資料庫的完整指令列表，每個指令都標了時間複雜度與可用版本。',
    embed: true, url: 'https://redis.io/docs/latest/commands/', site: 'https://redis.io' },
];
