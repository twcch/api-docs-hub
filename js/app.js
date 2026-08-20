/* ============================================================
   API Docs Hub — 應用邏輯
   左側清單 → 右側 iframe 顯示，全程不離開本頁
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 小工具 ---------- */
  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
  const IS_MAC = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  const LS = {
    get(k, d) { try { const v = localStorage.getItem('adh:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('adh:' + k, JSON.stringify(v)); } catch (e) {} },
  };

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return u; } };

  /* ---------- 狀態 ---------- */
  const MAX_TABS = 8;

  const state = {
    q: '',
    cat: LS.get('cat', 'all'),
    favs: LS.get('favs', []),
    custom: LS.get('custom', []),
    override: LS.get('override', {}), // id -> true/false：使用者手動更正的內嵌標記
    tabs: [],
    active: null,
    forceTry: {},                     // 這次工作階段中「明知會被擋仍要試」的項目
  };

  // 「可內嵌」篩選已移除；舊的 localStorage 值導回「全部」，免得清單整個空掉
  if (state.cat === 'embed') { state.cat = 'all'; LS.set('cat', 'all'); }

  const frames = Object.create(null);

  const allItems = () => APIS.concat(state.custom);
  const byId = (id) => allItems().find((x) => x.id === id);
  const catOf = (id) => CATEGORIES.find((c) => c.id === id) || { id: 'other', name: '其他', icon: '📄', accent: '#8b93a7' };
  const isFav = (id) => state.favs.indexOf(id) > -1;

  // 能不能被放進 iframe，是由對方伺服器的回應標頭決定的（X-Frame-Options /
  // CSP frame-ancestors）。瀏覽器不讓 JS 讀跨網域 iframe 的任何狀態，
  // 實測過：載入成功和被擋下來，前端拿到的訊號一模一樣，所以無從偵測。
  // 因此改成：資料檔裡的 embed 旗標是事先打過該網址標頭得到的結果，
  // 使用者若發現對方改了設定，可以在網頁上手動更正（存進 override）。
  const canEmbed = (a) => (
    a && Object.prototype.hasOwnProperty.call(state.override, a.id)
      ? !!state.override[a.id]
      : !(a && a.embed === false)
  );

  /* ---------- DOM ---------- */
  const el = {
    root: document.documentElement,
    split: $('#split'),
    listPane: $('#listPane'),
    gutter: $('#gutter'),
    list: $('#list'),
    chips: $('#chips'),
    filter: $('#filterInput'),
    sfield: $('#sfield'),
    footStat: $('#footStat'),
    docTabs: $('#docTabs'),
    viewBar: $('#viewBar'),
    stage: $('#stage'),
    welcome: $('#welcome'),
    welcomeHot: $('#welcomeHot'),
    loadBar: $('#loadBar'),
    palette: $('#palette'),
    paletteInput: $('#paletteInput'),
    paletteList: $('#paletteList'),
    addModal: $('#addModal'),
    toast: $('#toast'),
    scrim: $('#scrim'),
  };

  /* ============================================================
     主題 / 版面
     ============================================================ */
  function initTheme() {
    const saved = LS.get('theme', null);
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    el.root.dataset.theme = saved || (prefersLight ? 'light' : 'dark');
    el.root.dataset.layout = LS.get('layout', 'h');
    applyPaneSize(null);
  }

  $('#themeBtn').addEventListener('click', () => {
    el.root.dataset.theme = el.root.dataset.theme === 'dark' ? 'light' : 'dark';
    LS.set('theme', el.root.dataset.theme);
  });

  $('#layoutBtn').addEventListener('click', () => {
    const next = el.root.dataset.layout === 'h' ? 'v' : 'h';
    el.root.dataset.layout = next;
    LS.set('layout', next);
    applyPaneSize(null);
    toast(next === 'h' ? '已切換為左右分割' : '已切換為上下分割');
  });

  function applyPaneSize(px) {
    const horiz = el.root.dataset.layout === 'h';
    const key = horiz ? 'paneSizeH' : 'paneSizeV';
    const val = px != null ? px : LS.get(key, horiz ? 320 : 300);
    el.split.style.setProperty('--pane-size', val + 'px');
    if (px != null) LS.set(key, val);
  }

  /* ---------- 拖曳分隔線 ---------- */
  (function dragGutter() {
    let dragging = false;

    const move = (ev) => {
      if (!dragging) return;
      const horiz = el.root.dataset.layout === 'h';
      const r = el.split.getBoundingClientRect();
      const pt = ev.touches ? ev.touches[0] : ev;
      let size = horiz ? pt.clientX - r.left : pt.clientY - r.top;
      const max = (horiz ? r.width : r.height) - 260;
      size = Math.max(220, Math.min(size, Math.max(260, max)));
      el.split.style.setProperty('--pane-size', size + 'px');
      ev.preventDefault();
    };

    const stop = () => {
      if (!dragging) return;
      dragging = false;
      document.body.classList.remove('dragging');
      const cur = parseInt(el.split.style.getPropertyValue('--pane-size'), 10);
      if (cur) applyPaneSize(cur);
    };

    const start = (ev) => {
      dragging = true;
      document.body.classList.add('dragging');
      ev.preventDefault();
    };

    el.gutter.addEventListener('mousedown', start);
    el.gutter.addEventListener('touchstart', start, { passive: false });
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('mouseup', stop);
    window.addEventListener('touchend', stop);

    el.gutter.addEventListener('dblclick', () => {
      applyPaneSize(el.root.dataset.layout === 'h' ? 320 : 300);
      toast('已還原預設寬度');
    });

    // 鍵盤微調（無障礙）
    el.gutter.addEventListener('keydown', (e) => {
      const horiz = el.root.dataset.layout === 'h';
      const dec = horiz ? 'ArrowLeft' : 'ArrowUp';
      const inc = horiz ? 'ArrowRight' : 'ArrowDown';
      if (e.key !== dec && e.key !== inc) return;
      const cur = parseInt(getComputedStyle(el.split).getPropertyValue('--pane-size'), 10) || 320;
      applyPaneSize(Math.max(220, cur + (e.key === inc ? 24 : -24)));
      e.preventDefault();
    });
  }());

  $('#wideBtn').addEventListener('click', () => {
    document.body.classList.toggle('wide');
    toast(document.body.classList.contains('wide') ? '已隱藏左側清單' : '已顯示左側清單');
  });

  /* ============================================================
     左側清單
     ============================================================ */
  function renderChips() {
    const counts = {};
    allItems().forEach((a) => { counts[a.cat] = (counts[a.cat] || 0) + 1; });

    const items = [{ id: 'all', name: '全部', icon: '✦', n: allItems().length }];
    if (state.favs.length) items.push({ id: 'fav', name: '收藏', icon: '★', n: state.favs.length });
    CATEGORIES.forEach((c) => { if (counts[c.id]) items.push({ id: c.id, name: c.name, icon: c.icon, n: counts[c.id] }); });
    if (state.custom.length) items.push({ id: 'custom', name: '我的收錄', icon: '🔖', n: state.custom.length });

    el.chips.innerHTML = items.map((c) => (
      '<button class="chip' + (state.cat === c.id ? ' on' : '') + '" data-cat="' + c.id + '">' +
        '<span>' + c.icon + '</span>' + esc(c.name) +
        '<b>' + c.n + '</b>' +
      '</button>'
    )).join('');
  }

  el.chips.addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    state.cat = b.dataset.cat;
    LS.set('cat', state.cat);
    renderChips();
    renderList();
  });

  function matches(a, q) {
    if (!q) return true;
    const hay = [a.name, a.zh, a.desc, a.id, (a.tags || []).join(' '), catOf(a.cat).name, host(a.url)]
      .join(' ').toLowerCase();
    return q.toLowerCase().split(/\s+/).filter(Boolean).every((t) => hay.indexOf(t) > -1);
  }

  function visibleItems() {
    return allItems().filter((a) => {
      if (state.cat === 'fav' && !isFav(a.id)) return false;
      if (state.cat === 'custom' && !a.custom) return false;
      if (['all', 'fav', 'custom'].indexOf(state.cat) === -1 && a.cat !== state.cat) return false;
      return matches(a, state.q);
    });
  }

  function badge(id) {
    const a = byId(id);
    if (!a) return '';
    return canEmbed(a)
      ? '<i class="bdg bdg--ok" title="這個站台允許內嵌，會直接顯示在右邊視窗">內嵌</i>'
      : '<i class="bdg bdg--no" title="對方禁止內嵌，會改用獨立視窗或新分頁開啟">外開</i>';
  }

  function itemHTML(a) {
    const c = catOf(a.cat);
    return '' +
      '<a class="item' + (state.active === a.id ? ' active' : '') + '" href="#' + a.id + '" data-id="' + a.id + '" ' +
         'style="--accent:' + (a.accent || c.accent) + '">' +
        '<span class="item__ico">' + esc(a.icon || c.icon) + '</span>' +
        '<span class="item__body">' +
          '<span class="item__name">' + esc(a.name) + badge(a.id) + '</span>' +
          '<span class="item__sub">' + esc(a.zh || a.desc || host(a.url)) + '</span>' +
        '</span>' +
        '<span class="item__acts">' +
          '<button class="mini' + (isFav(a.id) ? ' on' : '') + '" data-fav="' + a.id + '" title="收藏" aria-label="收藏">★</button>' +
          (a.custom ? '<button class="mini" data-del="' + a.id + '" title="移除自訂項目" aria-label="移除">✕</button>' : '') +
        '</span>' +
      '</a>';
  }

  function renderList() {
    const items = visibleItems();
    const keepScroll = el.list.scrollTop;

    if (!items.length) {
      el.list.innerHTML = '<div class="empty">' +
        '<div class="empty__i">🔍</div>' +
        '<p>找不到符合「' + esc(state.q) + '」的文件</p>' +
        '<button class="btn" id="emptyAdd">＋ 把它加進收錄清單</button>' +
      '</div>';
      const ea = $('#emptyAdd');
      if (ea) ea.addEventListener('click', () => openAdd(state.q));
      el.footStat.textContent = '0 筆結果';
      return;
    }

    let html = '';
    const flat = state.cat !== 'all' || !!state.q;

    if (flat) {
      html = items.map(itemHTML).join('');
    } else {
      const groups = CATEGORIES.slice();
      if (state.custom.length) groups.push({ id: '__custom', name: '我的收錄', icon: '🔖', accent: '#8b93a7' });
      groups.forEach((c) => {
        const sub = items.filter((a) => (c.id === '__custom' ? a.custom : (a.cat === c.id && !a.custom)));
        if (!sub.length) return;
        html += '<div class="ghead"><span>' + c.icon + '</span>' + esc(c.name) + '<b>' + sub.length + '</b></div>';
        html += sub.map(itemHTML).join('');
      });
    }

    el.list.innerHTML = html;
    el.list.scrollTop = keepScroll;
    el.footStat.textContent = items.length + ' 筆文件' + (state.favs.length ? ' · ' + state.favs.length + ' 個收藏' : '');
  }

  el.list.addEventListener('click', (e) => {
    const fav = e.target.closest('[data-fav]');
    if (fav) { e.preventDefault(); toggleFav(fav.dataset.fav); return; }

    const del = e.target.closest('[data-del]');
    if (del) { e.preventDefault(); removeCustom(del.dataset.del); return; }

    const item = e.target.closest('[data-id]');
    if (!item) return;
    e.preventDefault();
    openDoc(item.dataset.id);
    if (window.innerWidth <= 900) closeNav();
  });

  /* 搜尋框 */
  el.filter.addEventListener('input', () => {
    state.q = el.filter.value.trim();
    el.sfield.classList.toggle('has-value', !!state.q);
    renderList();
  });
  $('#filterClear').addEventListener('click', () => {
    el.filter.value = ''; state.q = '';
    el.sfield.classList.remove('has-value');
    renderList(); el.filter.focus();
  });

  /* ---------- 收藏 / 自訂 ---------- */
  function toggleFav(id) {
    const i = state.favs.indexOf(id);
    if (i > -1) state.favs.splice(i, 1); else state.favs.push(id);
    LS.set('favs', state.favs);
    if (state.cat === 'fav' && !state.favs.length) state.cat = 'all';
    renderChips(); renderList(); syncViewBar();
    toast(i > -1 ? '已取消收藏' : '已加入收藏 ★');
  }

  function removeCustom(id) {
    const it = byId(id);
    if (!it || !confirm('確定要從清單移除「' + it.name + '」嗎？')) return;
    state.custom = state.custom.filter((x) => x.id !== id);
    LS.set('custom', state.custom);
    closeTab(id, true);
    renderChips(); renderList();
    toast('已移除');
  }

  /* ============================================================
     右側：分頁 + iframe
     ============================================================ */
  function renderTabs() {
    if (!state.tabs.length) { el.docTabs.innerHTML = ''; el.docTabs.hidden = true; return; }
    el.docTabs.hidden = false;
    el.docTabs.innerHTML = state.tabs.map((id) => {
      const a = byId(id); if (!a) return '';
      const c = catOf(a.cat);
      return '<button class="dtab' + (state.active === id ? ' on' : '') + '" data-tab="' + id + '" ' +
             'style="--accent:' + (a.accent || c.accent) + '" title="' + esc(a.name) + '">' +
               '<span class="dtab__i">' + esc(a.icon || c.icon) + '</span>' +
               '<span class="dtab__n">' + esc(a.name) + '</span>' +
               '<span class="dtab__x" data-close="' + id + '" role="button" aria-label="關閉">✕</span>' +
             '</button>';
    }).join('') + '<button class="dtab dtab--add" id="tabAdd" title="開啟其他文件（⌘K）">＋</button>';
  }

  el.docTabs.addEventListener('click', (e) => {
    const x = e.target.closest('[data-close]');
    if (x) { e.stopPropagation(); closeTab(x.dataset.close); return; }
    if (e.target.closest('#tabAdd')) { openPalette(); return; }
    const t = e.target.closest('[data-tab]');
    if (t) activate(t.dataset.tab);
  });

  function openDoc(id) {
    const a = byId(id);
    if (!a) return;

    if (state.tabs.indexOf(id) === -1) {
      state.tabs.push(id);
      // 超過上限就把最舊、且非目前使用中的分頁收掉
      while (state.tabs.length > MAX_TABS) {
        const drop = state.tabs.find((t) => t !== id && t !== state.active) || state.tabs[0];
        destroyFrame(drop);
        state.tabs = state.tabs.filter((t) => t !== drop);
      }
    }
    activate(id);
  }

  function activate(id) {
    const a = byId(id);
    if (!a) return;
    state.active = id;

    el.welcome.classList.add('hidden');
    Object.keys(frames).forEach((k) => { frames[k].classList.toggle('on', k === id); });

    if ((canEmbed(a) || state.forceTry[id]) && !frames[id]) createFrame(a);

    try { history.replaceState(null, '', '#' + id); }
    catch (err) { location.hash = id; }

    renderTabs();
    renderList();
    syncViewBar();
    updateOverlay();
  }

  function createFrame(a) {
    const f = document.createElement('iframe');
    f.className = 'docframe on';
    f.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    f.setAttribute('allow', 'clipboard-write; fullscreen; encrypted-media');
    f.dataset.id = a.id;
    frames[a.id] = f;

    el.loadBar.classList.add('on');
    const done = () => el.loadBar.classList.remove('on');
    f.addEventListener('load', done);
    f.addEventListener('error', done);
    setTimeout(done, 15000);

    f.src = a.url;
    el.stage.appendChild(f);
  }

  function destroyFrame(id) {
    const f = frames[id];
    if (f) { f.src = 'about:blank'; f.remove(); delete frames[id]; }
  }

  function closeTab(id, silent) {
    const i = state.tabs.indexOf(id);
    if (i === -1) return;
    state.tabs.splice(i, 1);
    destroyFrame(id);

    if (state.active === id) {
      const next = state.tabs[i] || state.tabs[i - 1] || null;
      state.active = null;
      if (next) { activate(next); }
      else {
        el.welcome.classList.remove('hidden');
        el.viewBar.hidden = true;
        try { history.replaceState(null, '', location.pathname + location.search); } catch (err) {}
        renderTabs(); renderList(); updateOverlay();
      }
    } else {
      renderTabs();
    }
    if (!silent) toast('已關閉分頁');
  }

  function syncViewBar() {
    const a = byId(state.active);
    if (!a) { el.viewBar.hidden = true; return; }
    const c = catOf(a.cat);
    el.viewBar.hidden = false;
    el.viewBar.style.setProperty('--accent', a.accent || c.accent);
    $('#vbIco').textContent = a.icon || c.icon;
    $('#vbName').textContent = a.name;
    $('#vbUrl').textContent = a.url;
    $('#openBtn').href = a.url;
    $('#favBtn').classList.toggle('on', isFav(a.id));
    $('#markBtn').title = canEmbed(a)
      ? '目前標記為「可內嵌」— 點一下改成不可內嵌'
      : '目前標記為「不可內嵌」— 點一下改成可內嵌';
  }

  $('#favBtn').addEventListener('click', () => { if (state.active) toggleFav(state.active); });
  $('#reloadBtn').addEventListener('click', () => {
    const a = byId(state.active); if (!a) return;
    destroyFrame(a.id);
    if (canEmbed(a) || state.forceTry[a.id]) createFrame(a);
    updateOverlay();
    toast('重新載入中…');
  });

  // 被擋內嵌時的替代方案：開一個尺寸剛好、可以跟本頁並排的獨立視窗
  function popout(a) {
    const w = Math.min(1120, Math.round((screen.availWidth || 1440) * 0.56));
    const ht = Math.round((screen.availHeight || 900) * 0.94);
    const left = Math.max(0, (screen.availWidth || 1440) - w);
    window.open(a.url, 'doc_' + a.id,
      'width=' + w + ',height=' + ht + ',left=' + left + ',top=0,noopener,resizable,scrollbars');
  }
  $('#popBtn').addEventListener('click', () => {
    const a = byId(state.active); if (a) popout(a);
  });

  // 對方改了設定時，讓使用者手動更正標記
  $('#markBtn').addEventListener('click', () => {
    const a = byId(state.active); if (!a) return;
    const next = !canEmbed(a);
    state.override[a.id] = next;
    LS.set('override', state.override);
    delete state.forceTry[a.id];
    destroyFrame(a.id);
    if (next) createFrame(a);
    renderList(); syncViewBar(); updateOverlay();
    toast(next ? '已標記為「可內嵌」，直接載入看看' : '已標記為「不可內嵌」，改用外開');
  });

  /* ---------- 無法內嵌時的替代畫面 ---------- */
  function overlayEl() {
    let o = $('#blockOverlay');
    if (o) return o;
    o = document.createElement('div');
    o.id = 'blockOverlay';
    o.className = 'blocked';
    o.innerHTML =
      '<div class="blocked__box">' +
        '<div class="blocked__ico">🪟</div>' +
        '<h3 id="boTitle"></h3>' +
        '<p id="boText"></p>' +
        '<div class="blocked__acts">' +
          '<button class="btn btn--accent" id="boPop">開成獨立視窗並排看</button>' +
          '<a class="btn" id="boOpen" target="_blank" rel="noopener">新分頁開啟 ↗</a>' +
        '</div>' +
        '<button class="btn btn--ghost" id="boTry">還是要試著載入看看</button>' +
        '<p class="blocked__fine">這是對方伺服器用 <b>X-Frame-Options</b> 或 <b>CSP frame-ancestors</b> 設定的，' +
        '屬於瀏覽器層級的安全限制，任何前端寫法都無法繞過。<br>' +
        '若對方之後改了設定，可以用工具列的 <b>⇄</b> 按鈕手動改成「可內嵌」。</p>' +
      '</div>';
    el.stage.appendChild(o);

    $('#boPop', o).addEventListener('click', () => { const a = byId(state.active); if (a) popout(a); });
    $('#boTry', o).addEventListener('click', () => {
      const a = byId(state.active); if (!a) return;
      state.forceTry[a.id] = true;
      if (!frames[a.id]) createFrame(a);
      updateOverlay();
    });
    return o;
  }

  function updateOverlay() {
    const a = byId(state.active);
    const o = overlayEl();
    const show = !!a && !canEmbed(a) && !state.forceTry[a.id];
    o.classList.toggle('on', show);
    if (!show || !a) return;
    $('#boTitle').textContent = '「' + a.name + '」不允許被內嵌';
    $('#boText').innerHTML = '<b>' + esc(host(a.url)) + '</b> 在 HTTP 回應標頭裡明確拒絕被放進別人的頁面，' +
      '所以右邊這塊區域載不出它的內容。建議開成獨立視窗，就能跟這裡並排對照著看。';
    $('#boOpen').href = a.url;
  }

  /* ============================================================
     命令面板
     ============================================================ */
  let pSel = 0, pRes = [];

  function score(a, q) {
    const n = (a.name + ' ' + (a.zh || '')).toLowerCase();
    const t = q.toLowerCase();
    if (n.indexOf(t) === 0) return 0;
    if (n.indexOf(t) > -1) return 1;
    if ((a.tags || []).join(' ').toLowerCase().indexOf(t) > -1) return 2;
    return 3;
  }

  function renderPalette() {
    const q = el.paletteInput.value.trim();
    pRes = allItems().filter((a) => matches(a, q));
    if (q) pRes.sort((x, y) => score(x, q) - score(y, q));
    else pRes = state.favs.map(byId).filter(Boolean).concat(pRes).filter((v, i, arr) => arr.indexOf(v) === i);
    pRes = pRes.slice(0, 60);
    pSel = 0;

    if (!pRes.length) {
      el.paletteList.innerHTML = '<div class="palette__empty">沒有符合的文件<br><span>試試別的關鍵字，或用右上角「＋」加入新的文件連結</span></div>';
      return;
    }
    el.paletteList.innerHTML = pRes.map((a, i) => {
      const c = catOf(a.cat);
      return '<div class="pres' + (i === 0 ? ' sel' : '') + '" data-i="' + i + '">' +
        '<span class="pres__ico">' + esc(a.icon || c.icon) + '</span>' +
        '<span class="pres__b"><span class="pres__n">' + esc(a.name) + '</span>' +
        '<span class="pres__d">' + esc(a.desc || a.zh || '') + '</span></span>' +
        '<span class="pres__c">' + esc(c.name) + '</span>' +
      '</div>';
    }).join('');
  }

  function moveSel(d) {
    const nodes = $$('.pres', el.paletteList);
    if (!nodes.length) return;
    nodes[pSel].classList.remove('sel');
    pSel = (pSel + d + nodes.length) % nodes.length;
    nodes[pSel].classList.add('sel');
    nodes[pSel].scrollIntoView({ block: 'nearest' });
  }

  function openPalette() {
    el.palette.classList.add('open');
    el.paletteInput.value = '';
    renderPalette();
    setTimeout(() => el.paletteInput.focus(), 30);
  }
  function closePalette() { el.palette.classList.remove('open'); }

  el.paletteInput.addEventListener('input', renderPalette);
  el.paletteList.addEventListener('click', (e) => {
    const r = e.target.closest('[data-i]');
    if (!r) return;
    openDoc(pRes[+r.dataset.i].id);
    closePalette();
  });
  el.palette.addEventListener('mousedown', (e) => { if (e.target === el.palette) closePalette(); });

  el.paletteInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { moveSel(1); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { moveSel(-1); e.preventDefault(); }
    else if (e.key === 'Enter') {
      const a = pRes[pSel];
      if (!a) return;
      if (e.metaKey || e.ctrlKey) window.open(a.url, '_blank', 'noopener');
      else openDoc(a.id);
      closePalette();
      e.preventDefault();
    }
  });

  $('#searchBtn').addEventListener('click', openPalette);

  /* ============================================================
     新增自訂文件
     ============================================================ */
  function openAdd(prefillName) {
    $('#fCat').innerHTML = CATEGORIES.map((c) => '<option value="' + c.id + '">' + c.icon + ' ' + esc(c.name) + '</option>').join('');
    $('#fName').value = prefillName || '';
    $('#fUrl').value = '';
    $('#fDesc').value = '';
    $('#fIcon').value = '';
    el.addModal.classList.add('open');
    setTimeout(() => $('#fName').focus(), 30);
  }
  function closeAdd() { el.addModal.classList.remove('open'); }

  $('#addBtn').addEventListener('click', () => openAdd());
  $('#addBtn2').addEventListener('click', () => openAdd());
  $('#addClose').addEventListener('click', closeAdd);
  $('#addCancel').addEventListener('click', closeAdd);
  el.addModal.addEventListener('mousedown', (e) => { if (e.target === el.addModal) closeAdd(); });

  $('#addForm').addEventListener('submit', (e) => {
    e.preventDefault();
    let url = $('#fUrl').value.trim();
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

    const item = {
      id: 'my-' + Math.random().toString(36).slice(2, 9),
      cat: $('#fCat').value,
      icon: $('#fIcon').value.trim() || '📘',
      name: $('#fName').value.trim(),
      zh: '',
      desc: $('#fDesc').value.trim() || host(url),
      tags: ['自訂'],
      url: url,
      site: url,
      custom: true,
    };
    state.custom.push(item);
    LS.set('custom', state.custom);
    closeAdd();
    renderChips(); renderList();
    openDoc(item.id);
    toast('已加入「' + item.name + '」');
  });

  /* ============================================================
     行動版抽屜 / 快捷鍵 / Toast
     ============================================================ */
  function openNav() { document.body.classList.add('nav-open'); }
  function closeNav() { document.body.classList.remove('nav-open'); }
  $('#menuBtn').addEventListener('click', () => document.body.classList.toggle('nav-open'));
  el.scrim.addEventListener('click', closeNav);

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openPalette(); return; }
    if (e.key === 'Escape') {
      if (el.palette.classList.contains('open')) closePalette();
      else if (el.addModal.classList.contains('open')) closeAdd();
      else closeNav();
      return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'w' && state.active) {
      e.preventDefault(); closeTab(state.active);
    }
  });

  let toastT;
  function toast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => el.toast.classList.remove('show'), 2000);
  }

  /* ============================================================
     歡迎畫面的熱門項目
     ============================================================ */
  function renderWelcome() {
    const all = allItems();
    const n = all.filter(canEmbed).length;
    $('#welcomeStat').innerHTML =
      '<span><b>' + all.length + '</b> 份文件</span>' +
      '<span><b>' + n + '</b> 份可直接內嵌</span>' +
      '<span><b>' + (all.length - n) + '</b> 份官方禁止內嵌，一鍵開成並排視窗</span>';

    // 只放實測可以內嵌的，讓第一次點下去就直接看到內容
    const picks = ['line', 'gitlab', 'ecpay', 'owm', 'jsonplaceholder', 'pokeapi', 'twilio', 'twitch']
      .map(byId).filter(Boolean).filter(canEmbed)
      .concat(all.filter(canEmbed)).filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 8);
    el.welcomeHot.innerHTML = picks.map((a) => {
      const c = catOf(a.cat);
      return '<button class="hot" data-id="' + a.id + '" style="--accent:' + (a.accent || c.accent) + '">' +
        '<span class="hot__i">' + esc(a.icon || c.icon) + '</span>' +
        '<span class="hot__n">' + esc(a.name) + '</span>' +
      '</button>';
    }).join('');
  }
  el.welcomeHot.addEventListener('click', (e) => {
    const b = e.target.closest('[data-id]');
    if (b) openDoc(b.dataset.id);
  });

  /* ============================================================
     啟動
     ============================================================ */
  function boot() {
    initTheme();
    $('#kbdHint').textContent = IS_MAC ? '⌘K' : 'Ctrl K';
    renderChips();
    renderList();
    renderWelcome();
    renderTabs();

    const h = decodeURIComponent((location.hash || '').replace(/^#/, ''));
    if (h && byId(h)) openDoc(h);

    window.addEventListener('hashchange', () => {
      const id = decodeURIComponent((location.hash || '').replace(/^#/, ''));
      if (id && byId(id) && id !== state.active) openDoc(id);
    });

    if (location.protocol === 'file:') {
      setTimeout(() => toast('提示：用本機伺服器開啟（例如 python3 -m http.server）內嵌成功率更高'), 1200);
    }
  }

  boot();
}());
