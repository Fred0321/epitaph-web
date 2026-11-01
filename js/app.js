/**
 * 数字碑 · 本地草稿与搜索（file:// 可用 · 无 ES modules）
 * 草稿键 epitaph_web_draft_v2 保持不变。
 * 已保存的碑在 epitaph_web_saved_v1。搜索只走 EpitaphData。
 */
(function (global) {
  var STORAGE_KEY = "epitaph_web_draft_v2";
  var SAVED_KEY = "epitaph_web_saved_v1";

  var PINE_SVG =
    '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<g fill="none" stroke="#2d523e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M32 58 V28"/>' +
    '<path d="M32 30 L18 42"/>' +
    '<path d="M32 30 L46 42"/>' +
    '<path d="M32 22 L22 34"/>' +
    '<path d="M32 22 L42 34"/>' +
    '<path d="M32 14 L26 24"/>' +
    '<path d="M32 14 L38 24"/>' +
    '<path d="M28 50 L20 56"/>' +
    '<path d="M36 50 L44 56"/>' +
    '</g></svg>';

  var TEMPLATES = [
    { id: "diligent", tag: "勤恳", text: "一生勤恳，家人安好" },
    { id: "journey", tag: "山河", text: "走过山河，心有归处" },
    { id: "plain", tag: "平凡", text: "平凡岁月，足矣" }
  ];

  /* 统一示例：出生年 1958（与时间线设计一致） */
  var SAMPLE = {
    role: "self",
    name: "王德福",
    years: "",
    epitaph: "一生勤恳，家人安好",
    templateId: "diligent",
    events: [
      { id: "e1", year: 1958, title: "出生于江南水乡", note: "" },
      { id: "e2", year: 1982, title: "成家立业", note: "" },
      { id: "e3", year: 2005, title: "孙辈绕膝", note: "" }
    ],
    photoSlots: 2,
    familyMessage: "愿你们平安喜乐，吾心足矣",
    shareId: "demo-wang-defu",
    isPublic: false
  };

  /* 内置公开示例。籍贯只在详情里出现，搜索不使用该字段。 */
  var PUBLIC_SAMPLES = [
    {
      id: "sample-wang-defu",
      name: "王德福",
      hometown: "江南水乡",
      birthYear: 1958,
      deathYear: null,
      epitaph: "一生勤恳，家人安好",
      events: [
        { id: "e1", year: 1958, title: "出生于江南水乡", note: "" },
        { id: "e2", year: 1982, title: "成家立业", note: "" },
        { id: "e3", year: 2005, title: "孙辈绕膝", note: "" }
      ],
      familyMessage: "愿你们平安喜乐，吾心足矣",
      isPublic: true,
      source: "sample"
    },
    {
      id: "sample-li-xiuying",
      name: "李秀英",
      hometown: "浙江杭州",
      birthYear: 1955,
      deathYear: 2022,
      epitaph: "春蚕到死丝方尽",
      events: [
        { id: "l1", year: 1955, title: "出生于杭州", note: "" },
        { id: "l2", year: 1978, title: "任教小学", note: "" },
        { id: "l3", year: 2022, title: "安然离世", note: "" }
      ],
      familyMessage: "孩子们，好好吃饭，常回家看看。",
      isPublic: true,
      source: "sample"
    },
    {
      id: "sample-zhang-jianguo",
      name: "张建国",
      hometown: "河北保定",
      birthYear: 1960,
      deathYear: 2023,
      epitaph: "桃李不言，下自成蹊",
      events: [
        { id: "z1", year: 1960, title: "出生于保定", note: "" },
        { id: "z2", year: 1984, title: "执教乡中", note: "" },
        { id: "z3", year: 2023, title: "病逝", note: "" }
      ],
      familyMessage: "桃李若有成，为师已无憾。",
      isPublic: true,
      source: "sample"
    },
    {
      id: "sample-chen-guilan",
      name: "陈桂兰",
      hometown: "四川成都",
      birthYear: 1948,
      deathYear: 2019,
      epitaph: "慈心如水，照亮一家",
      events: [
        { id: "c1", year: 1948, title: "出生于成都", note: "" },
        { id: "c2", year: 1970, title: "成家", note: "" },
        { id: "c3", year: 2019, title: "安详离世", note: "" }
      ],
      familyMessage: "家和万事足。",
      isPublic: true,
      source: "sample"
    },
    {
      id: "sample-zhao-shouren",
      name: "赵守仁",
      hometown: "陕西西安",
      birthYear: 1952,
      deathYear: 2021,
      epitaph: "一生务实，不负春秋",
      events: [
        { id: "s1", year: 1952, title: "出生于西安", note: "" },
        { id: "s2", year: 1975, title: "进厂做工", note: "" },
        { id: "s3", year: 2021, title: "辞世", note: "" }
      ],
      familyMessage: "踏实过日子，就是最好的福气。",
      isPublic: true,
      source: "sample"
    }
  ];

  var TAB_PINE =
    '<svg viewBox="0 0 64 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<g fill="none" stroke="#2d523e" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M32 36 V14"/>' +
    '<path d="M32 16 L22 26"/>' +
    '<path d="M32 16 L42 26"/>' +
    '<path d="M32 10 L26 18"/>' +
    '<path d="M32 10 L38 18"/>' +
    "</g></svg>";

  function uid(prefix) {
    return (prefix || "id") + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        save(SAMPLE);
        return JSON.parse(JSON.stringify(SAMPLE));
      }
      return JSON.parse(raw);
    } catch (e) {
      return JSON.parse(JSON.stringify(SAMPLE));
    }
  }

  function save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  function resetSample() {
    save(SAMPLE);
    return JSON.parse(JSON.stringify(SAMPLE));
  }

  function getShareUrl(shareId) {
    return "https://example.com/bei/" + (shareId || "demo");
  }

  function toast(msg) {
    var el = document.getElementById("toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(el._t);
    el._t = setTimeout(function () {
      el.classList.remove("show");
    }, 1800);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () {
        toast("已复制链接");
        return true;
      }).catch(function () {
        return fallbackCopy(text);
      });
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      toast("已复制链接");
      return true;
    } catch (e) {
      toast("请手动复制");
      return false;
    } finally {
      document.body.removeChild(ta);
    }
  }

  function roleLabel(role) {
    return role === "family" ? "家人代写" : "本人来写";
  }

  function sortEvents(events) {
    return (events || []).slice().sort(function (a, b) {
      return Number(a.year) - Number(b.year);
    });
  }

  function pineCornerHtml() {
    return '<div class="pine-corner" aria-hidden="true">' + PINE_SVG + "</div>";
  }

  function ornamentHtml() {
    return (
      '<div class="footer-ornament" aria-hidden="true">' +
      '<svg viewBox="0 0 40 20" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M20 16 V6 M20 8 L12 14 M20 8 L28 14 M20 4 L16 9 M20 4 L24 9" ' +
      'fill="none" stroke="#5a7a68" stroke-width="1.4" stroke-linecap="round"/>' +
      "</svg></div>"
    );
  }

  function tabbarHtml(active) {
    var items = [
      { id: "home", href: "index.html", label: "首页" },
      { id: "write", href: "epitaph.html", label: "写碑" },
      { id: "search", href: "search.html", label: "搜索" },
      { id: "mine", href: "preview.html", label: "我的" }
    ];
    var html = '<nav class="tabbar" aria-label="底部导航">';
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var on = item.id === active;
      html += '<a class="tabbar-item' + (on ? " active" : "") + '" href="' + item.href + '"' +
        (on ? ' aria-current="page"' : "") + ">";
      html += "<span>" + item.label + "</span>";
      if (on) html += '<span class="tabbar-pine" aria-hidden="true">' + TAB_PINE + "</span>";
      html += "</a>";
    }
    html += "</nav>";
    return html;
  }

  function mountTabbar(active, withActionBar) {
    var old = document.querySelector(".tabbar");
    if (old && old.parentNode) old.parentNode.removeChild(old);
    document.body.classList.add("has-tabbar");
    if (withActionBar) document.body.classList.add("has-actionbar");
    document.body.insertAdjacentHTML("beforeend", tabbarHtml(active));
  }

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function formatYears(rec) {
    var birth = rec && rec.birthYear ? Number(rec.birthYear) : 0;
    var death = rec && rec.deathYear ? Number(rec.deathYear) : 0;
    if (birth && death) return birth + "-" + death;
    if (birth) return String(birth);
    if (death) return String(death);
    return "";
  }

  function deriveYears(draft) {
    var birth = draft.birthYear ? Number(draft.birthYear) : 0;
    var death = draft.deathYear ? Number(draft.deathYear) : 0;
    var events = sortEvents(draft.events || []);
    for (var i = 0; i < events.length; i++) {
      var title = events[i].title || "";
      var year = Number(events[i].year);
      if (!year) continue;
      if (!birth && /出生|生于/.test(title)) birth = year;
      if (!death && /去世|逝世|辞世|离世|病逝|仙逝/.test(title)) death = year;
    }
    return {
      birthYear: birth || null,
      deathYear: death || null
    };
  }

  /**
   * LocalAdapter：目前只读写本机。
   * 接入 Supabase 时替换 readSaved / writeSaved / readSamples，
   * 页面继续调用 EpitaphData.search、getPublic、saveStele。
   */
  var LocalAdapter = {
    readSaved: function () {
      try {
        var raw = global.localStorage.getItem(SAVED_KEY);
        if (!raw) return [];
        var parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    },
    writeSaved: function (list) {
      global.localStorage.setItem(SAVED_KEY, JSON.stringify(list));
    },
    readSamples: function () {
      return clone(PUBLIC_SAMPLES);
    }
  };

  function asStele(raw, source) {
    var years = deriveYears(raw || {});
    return {
      id: (raw && (raw.id || raw.shareId)) || "",
      name: (raw && raw.name) || "",
      hometown: (raw && raw.hometown) || "",
      birthYear: raw && raw.birthYear ? Number(raw.birthYear) : years.birthYear,
      deathYear: raw && raw.deathYear ? Number(raw.deathYear) : years.deathYear,
      epitaph: (raw && raw.epitaph) || "",
      events: (raw && raw.events) || [],
      familyMessage: (raw && raw.familyMessage) || "",
      isPublic: !!(raw && raw.isPublic === true),
      source: (raw && raw.source) || source || "local"
    };
  }

  function collectPublic() {
    var saved = LocalAdapter.readSaved().map(function (item) {
      return asStele(item, "local");
    });
    var samples = LocalAdapter.readSamples().map(function (item) {
      return asStele(item, "sample");
    });
    var seen = {};
    var out = [];
    saved.concat(samples).forEach(function (rec) {
      if (!rec.id || seen[rec.id] || rec.isPublic !== true) return;
      seen[rec.id] = true;
      out.push(rec);
    });
    return out;
  }

  function nameHit(rec, query) {
    var name = (rec.name || "").toLowerCase();
    return name.indexOf(String(query || "").trim().toLowerCase()) !== -1;
  }

  function exactYearHit(rec, yearText) {
    var text = String(yearText || "").trim();
    if (!/^\d+$/.test(text)) return false;
    var year = Number(text);
    var birth = rec.birthYear ? Number(rec.birthYear) : NaN;
    var death = rec.deathYear ? Number(rec.deathYear) : NaN;
    return birth === year || death === year;
  }

  function toCard(rec) {
    return {
      id: rec.id,
      name: rec.name,
      years: formatYears(rec),
      epitaph: rec.epitaph || ""
    };
  }

  /**
   * 搜索与读取的唯一入口。返回的卡片只有姓名、年份、墓志铭一行。
   * 姓名为包含匹配，年份须与生年或卒年完全相同。两个都填则同时满足。
   * 不按籍贯过滤，也不把籍贯放进卡片。未公开的碑不会离开这一层。
   */
  var EpitaphData = {
    formatYears: formatYears,
    search: function (criteria) {
      var opts = criteria || {};
      var name = String(opts.name || "").trim();
      var year = String(opts.year == null ? "" : opts.year).trim();
      if (!name && !year) return [];
      return collectPublic().filter(function (rec) {
        if (name && !nameHit(rec, name)) return false;
        if (year && !exactYearHit(rec, year)) return false;
        return true;
      }).map(toCard);
    },
    getPublic: function (id) {
      if (!id) return null;
      var list = collectPublic();
      for (var i = 0; i < list.length; i++) {
        if (list[i].id === id) return clone(list[i]);
      }
      return null;
    },
    hasSaved: function (id) {
      if (!id) return false;
      return LocalAdapter.readSaved().some(function (item) {
        return item && item.id === id;
      });
    },
    saveStele: function (draft) {
      try {
        var data = draft || {};
        if (!data.shareId) data.shareId = uid("stele");
        var years = deriveYears(data);
        var rec = {
          id: data.shareId,
          name: data.name || "",
          hometown: data.hometown || "",
          birthYear: years.birthYear,
          deathYear: years.deathYear,
          epitaph: data.epitaph || "",
          events: clone(data.events || []),
          familyMessage: data.familyMessage || "",
          role: data.role || "self",
          isPublic: data.isPublic === true,
          source: "local",
          savedAt: Date.now()
        };
        var list = LocalAdapter.readSaved().filter(function (item) {
          return item && item.id !== rec.id;
        });
        list.unshift(rec);
        LocalAdapter.writeSaved(list);
        return true;
      } catch (e) {
        return false;
      }
    }
  };

  global.EpitaphApp = {
    TEMPLATES: TEMPLATES,
    SAMPLE: SAMPLE,
    load: load,
    save: save,
    resetSample: resetSample,
    uid: uid,
    getShareUrl: getShareUrl,
    toast: toast,
    copyText: copyText,
    roleLabel: roleLabel,
    sortEvents: sortEvents,
    pineCornerHtml: pineCornerHtml,
    ornamentHtml: ornamentHtml,
    tabbarHtml: tabbarHtml,
    mountTabbar: mountTabbar,
    PINE_SVG: PINE_SVG
  };
  global.EpitaphData = EpitaphData;
})(window);
