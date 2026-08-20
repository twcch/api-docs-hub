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
  { id: 'ai',    name: 'Data Science',    icon: '🧠', accent: '#8b7cff' },
  { id: 'dev',   name: 'Web Development',  icon: '⚙️', accent: '#5fb3f5' },
  { id: 'database', name: 'Databases',     icon: '🛢️', accent: '#f2a35e' },
  // { id: 'pay',   name: 'Payments',              icon: '💳', accent: '#5ac8a8' },
  // { id: 'msg',   name: 'Messaging & Social',    icon: '💬', accent: '#4ecb71' },
  // { id: 'geo',   name: 'Maps, Weather & Location', icon: '🗺️', accent: '#54c7d8' },
  // { id: 'media', name: 'Media & Entertainment', icon: '🎬', accent: '#f2748f' },
  // { id: 'data',  name: 'Open Data',             icon: '📊', accent: '#c99bf0' },
  // { id: 'tool',  name: 'Testing & Utility APIs', icon: '🧪', accent: '#9aa6bd' },
];

const APIS = [
  /* ---------- 資料科學 ---------- */
  { id: 'sklearn', cat: 'ai', icon: '🧮', name: 'scikit-learn API',
    zh: 'Classical machine learning', tags: ['Python', 'Machine Learning', 'Estimator'],
    desc: 'The standard toolbox for classical ML — classification, regression, clustering and preprocessing all share one fit/predict interface.',
    embed: true, url: 'https://scikit-learn.org/stable/api/index.html', site: 'https://scikit-learn.org' },

  { id: 'pytorch', cat: 'ai', icon: '🔥', name: 'PyTorch API',
    zh: 'Deep learning framework', tags: ['Python', 'Deep Learning', 'Tensor'],
    desc: 'Full reference for tensor operations, autograd, the nn module and training utilities — the framework most research code is written in.',
    embed: true, url: 'https://docs.pytorch.org/docs/stable/index.html', site: 'https://pytorch.org' },

  { id: 'tensorflow', cat: 'ai', icon: '🟧', name: 'TensorFlow API',
    zh: 'TensorFlow / Keras', tags: ['Python', 'Keras', 'Deep Learning'],
    desc: 'Python API docs for every module under the tf namespace, plus the high-level Keras interface.',
    embed: false, url: 'https://www.tensorflow.org/api_docs/python/tf', site: 'https://www.tensorflow.org' },

  { id: 'langchain', cat: 'ai', icon: '🦜', name: 'LangChain Docs',
    zh: 'LLM application framework', tags: ['LLM', 'Chain', 'Agent'],
    desc: 'Framework for wiring LLMs into chains and agents; this page indexes the modules and classes of every package.',
    embed: false, url: 'https://docs.langchain.com/oss/python/langchain/', site: 'https://www.langchain.com' },

  { id: 'huggingface', cat: 'ai', icon: '🤗', name: 'HuggingFace Docs',
    zh: 'Hugging Face Hub', tags: ['Open Models', 'Hub'],
    desc: 'Run inference against hundreds of thousands of open models on the Hub, and query model and dataset metadata.',
    embed: false, url: 'https://huggingface.co/docs/', site: 'https://huggingface.co' },

  { id: 'ollama', cat: 'ai', icon: '🦙', name: 'Ollama API',
    zh: 'Local model runtime', tags: ['Self-hosted', 'localhost', 'Open Source'],
    desc: 'The local REST interface used when running models on your own machine — listens on port 11434 by default.',
    embed: false, url: 'https://docs.ollama.com/api/', site: 'https://ollama.com' },

  { id: 'vllm', cat: 'ai', icon: '⚡', name: 'vLLM API',
    zh: 'High-throughput inference', tags: ['LLM', 'Inference', 'OpenAI-compatible'],
    desc: 'Serving framework that uses PagedAttention for high-throughput LLM inference, and can expose an OpenAI-compatible endpoint.',
    embed: true, url: 'https://docs.vllm.ai/en/stable/api/', site: 'https://vllm.ai' },

  { id: 'matplotlib', cat: 'ai', icon: '📉', name: 'Matplotlib API',
    zh: 'Plotting library', tags: ['Python', 'Plotting', 'pyplot'],
    desc: 'The foundational plotting library for Python — a complete API index across the pyplot, Figure and Axes layers.',
    embed: false, url: 'https://matplotlib.org/stable/api/index.html', site: 'https://matplotlib.org' },

  { id: 'seaborn', cat: 'ai', icon: '🌊', name: 'seaborn API',
    zh: 'Statistical plotting', tags: ['Python', 'Statistical Charts', 'DataFrame'],
    desc: 'A statistical plotting layer on top of Matplotlib that takes a DataFrame directly and renders charts that look good by default.',
    embed: true, url: 'https://seaborn.pydata.org/api.html', site: 'https://seaborn.pydata.org' },

  /* ---------- 網站開發 ---------- */
  { id: 'python', cat: 'dev', icon: '🐍', name: 'Python 3 API',
    zh: 'Python 3 standard library', tags: ['Python', 'Standard Library', 'Built-ins'],
    desc: 'Official reference for the built-in modules of Python 3 — types, file I/O, concurrency and networking all live here.',
    embed: true, url: 'https://docs.python.org/3/library/index.html', site: 'https://www.python.org' },

  { id: 'fastapi', cat: 'dev', icon: '🚀', name: 'FastAPI Reference',
    zh: 'Async Python framework', tags: ['Python', 'ASGI', 'OpenAPI'],
    desc: 'Async framework that derives an OpenAPI spec from type hints; this page lists the signature of every class and function.',
    embed: true, url: 'https://fastapi.tiangolo.com/reference/', site: 'https://fastapi.tiangolo.com' },

  { id: 'flask', cat: 'dev', icon: '🍶', name: 'Flask API Reference',
    zh: 'Python microframework', tags: ['Python', 'WSGI', 'Blueprint'],
    desc: 'The Flask API reference, covering the app, request, blueprint and context objects.',
    embed: true, url: 'https://flask.palletsprojects.com/en/stable/api/', site: 'https://flask.palletsprojects.com' },

  { id: 'django', cat: 'dev', icon: '🎸', name: 'Django 6.1 API Reference',
    zh: 'Batteries-included framework', tags: ['Python', 'ORM', 'Full-stack'],
    desc: 'Reference docs for every Django module — ORM queries, forms, template tags and settings.',
    embed: false, url: 'https://docs.djangoproject.com/en/6.1/ref/', site: 'https://www.djangoproject.com' },

  { id: 'streamlit', cat: 'ai', icon: '🎈', name: 'Streamlit API',
    zh: 'Python data apps', tags: ['Python', 'Data Apps', 'UI Components'],
    desc: 'Build interactive data apps in pure Python; this page lists every st.* component plus the caching and state APIs.',
    embed: false, url: 'https://docs.streamlit.io/develop/api-reference', site: 'https://streamlit.io' },

  { id: 'java24', cat: 'dev', icon: '☕', name: 'Java SE 24 Docs',
    zh: 'Java 24 Javadoc', tags: ['Java', 'Javadoc', 'Virtual Threads'],
    desc: 'Javadoc for the Java SE 24 standard library, including virtual threads and SequencedCollection.',
    embed: true, url: 'https://docs.oracle.com/en/java/javase/24/docs/api/index.html', site: 'https://www.oracle.com/java/' },

  { id: 'spring-framework', cat: 'dev', icon: '🌿', name: 'Spring Framework 7.0 API',
    zh: 'Spring Framework Javadoc', tags: ['Java', 'IoC', 'AOP'],
    desc: 'Complete Javadoc for 7.0.8 — the bean container, AOP, transactions and the WebFlux classes and interfaces.',
    embed: true, url: 'https://docs.spring.io/spring-framework/docs/7.0.8/javadoc-api/', site: 'https://spring.io/projects/spring-framework' },

  { id: 'spring-boot', cat: 'dev', icon: '🥾', name: 'Spring Boot 4.1 API',
    zh: 'Spring Boot Javadoc', tags: ['Java', 'Auto-configuration', 'Starter'],
    desc: 'Javadoc for the auto-configuration classes, @ConfigurationProperties settings and Actuator endpoints.',
    embed: true, url: 'https://docs.spring.io/spring-boot/api/java/index.html', site: 'https://spring.io/projects/spring-boot' },

  { id: 'spring-security', cat: 'dev', icon: '🔐', name: 'Spring Security 7.1 API',
    zh: 'Spring Security Javadoc', tags: ['Java', 'AuthN & AuthZ', 'OAuth 2.0'],
    desc: 'Javadoc for the authentication and authorization framework, covering SecurityFilterChain, OAuth2 and method-level security.',
    embed: true, url: 'https://docs.spring.io/spring-security/reference/api/java/index.html', site: 'https://spring.io/projects/spring-security' },

  { id: 'spring-data', cat: 'dev', icon: '🗃️', name: 'Spring Data Core 4.1 API',
    zh: 'Spring Data Commons Javadoc', tags: ['Java', 'Repository', 'Paging & Sorting'],
    desc: 'The core types shared by every Spring Data module: Repository, Pageable, Sort and the query derivation rules.',
    embed: true, url: 'https://docs.spring.io/spring-data/commons/reference/api/java/', site: 'https://spring.io/projects/spring-data' },

  { id: 'maven', cat: 'dev', icon: '🏗️', name: 'Apache Maven Guides',
    zh: 'Java build tool', tags: ['Java', 'Build', 'POM'],
    desc: 'Build and dependency management for Java projects; the official guides cover POM elements and the build lifecycle.',
    embed: false, url: 'https://maven.apache.org/guides/index.html', site: 'https://maven.apache.org' },

  { id: 'mvnrepository', cat: 'dev', icon: '📦', name: 'MVN Repository',
    zh: 'Maven package index', tags: ['Java', 'Dependencies', 'Gradle'],
    desc: 'Look up versions and coordinates for Java packages, and copy the Maven or Gradle dependency declaration straight into your project.',
    embed: false, url: 'https://mvnrepository.com/', site: 'https://mvnrepository.com' },

  { id: 'vue', cat: 'dev', icon: '💚', name: 'Vue API',
    zh: 'Vue.js official docs', tags: ['Frontend', 'Composition API', 'SFC'],
    desc: 'The full Vue 3 API listing — Composition API, built-in components and the reactivity utilities.',
    embed: false, url: 'https://vuejs.org/api/', site: 'https://vuejs.org' },

  { id: 'react', cat: 'dev', icon: '⚛️', name: 'React Reference',
    zh: 'React official docs', tags: ['Frontend', 'Hook', 'Component'],
    desc: 'The React API reference, covering the behavior and parameters of hooks, components and react-dom.',
    embed: true, url: 'https://react.dev/reference/react', site: 'https://react.dev' },

  { id: 'bootstrap', cat: 'dev', icon: '🅱️', name: 'Bootstrap 5.3 Docs',
    zh: 'CSS framework', tags: ['CSS', 'Components', 'Responsive'],
    desc: 'The most widely used CSS framework — grid system, components and utility classes, each with examples.',
    embed: true, url: 'https://getbootstrap.com/docs/5.3/getting-started/introduction/', site: 'https://getbootstrap.com' },

  /* ---------- 資料庫 ---------- */
  { id: 'postgres', cat: 'database', icon: '🐘', name: 'PostgreSQL Docs',
    zh: 'PostgreSQL manual', tags: ['SQL', 'Relational', 'Open Source'],
    desc: 'The most full-featured open-source relational database; the official manual for SQL syntax, types, indexes and configuration parameters.',
    embed: false, url: 'https://www.postgresql.org/docs/current/', site: 'https://www.postgresql.org' },

  { id: 'mysql', cat: 'database', icon: '🐬', name: 'MySQL 8.4 Reference Manual',
    zh: 'MySQL manual', tags: ['SQL', 'Relational', 'InnoDB'],
    desc: 'One of the most widely deployed relational databases — syntax, storage engines and replication settings for the 8.4 LTS release.',
    embed: false, url: 'https://dev.mysql.com/doc/refman/8.4/en/', site: 'https://www.mysql.com' },

  { id: 'mongodb', cat: 'database', icon: '🍃', name: 'MongoDB Reference',
    zh: 'MongoDB manual', tags: ['NoSQL', 'Document Store', 'Aggregation'],
    desc: 'Reference docs for the document-oriented database, including query operators, aggregation pipelines and index options.',
    embed: true, url: 'https://www.mongodb.com/docs/manual/reference/', site: 'https://www.mongodb.com' },

  { id: 'redis', cat: 'database', icon: '🟥', name: 'Redis Commands',
    zh: 'Redis command reference', tags: ['Cache', 'Key-Value', 'In-Memory'],
    desc: 'The complete command list for the in-memory database, each annotated with time complexity and the version it landed in.',
    embed: true, url: 'https://redis.io/docs/latest/commands/', site: 'https://redis.io' },
];
