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

  function normalizeName(name) {
    return String(name || "").replace(/[\s\u3000]+/g, "");
  }

  function identityOf(draft) {
    var years = deriveYears(draft || {});
    return {
      name: normalizeName(draft && draft.name),
      birthYear: years.birthYear || null,
      deathYear: years.deathYear || null
    };
  }

  function sameYear(a, b) {
    var left = a ? Number(a) : null;
    var right = b ? Number(b) : null;
    if (!left && !right) return true;
    return left === right;
  }

  function samePerson(bound, current) {
    if (!bound || !current) return false;
    if ((bound.name || "") !== (current.name || "")) return false;
    if (!sameYear(bound.birthYear, current.birthYear)) return false;
    if (!sameYear(bound.deathYear, current.deathYear)) return false;
    return true;
  }

  function findSaved(id) {
    if (!id) return null;
    var list = LocalAdapter.readSaved();
    for (var i = 0; i < list.length; i++) {
      if (list[i] && list[i].id === id) return list[i];
    }
    return null;
  }

  function detachPayment(data) {
    data.shareId = uid("stele");
    data.paid = false;
    data.isPublic = false;
    data.payMethod = "";
    data.paidAt = null;
    data.cloudId = null;
    data.paidIdentity = null;
    return data;
  }

  /* 付费只属于一座碑。改成另一个人或另一组生卒年，就换新 id，并不再继承 paid。 */
  function reconcileDraft(data) {
    if (!data) return false;
    var changed = false;
    var saved = findSaved(data.shareId);
    var marked = data.paid === true || !!(saved && saved.paid === true);
    if (!marked) {
      if (data.paid) {
        data.paid = false;
        changed = true;
      }
      return changed;
    }
    var current = identityOf(data);
    /* 已保存列表里的姓名/年份可能已被这次编辑覆盖，不能拿来当付费凭据。
       没有冻结的 paidIdentity 时，只有仍与示例「王德福 1958」一致的示例 id 可以继续算已付费。 */
    var bound = null;
    if (data.paidIdentity && (data.paidIdentity.name || data.paidIdentity.birthYear)) {
      bound = data.paidIdentity;
    } else if (data.shareId === SAMPLE.shareId) {
      bound = identityOf(SAMPLE);
    }
    if (!bound || !samePerson(bound, current)) {
      detachPayment(data);
      return true;
    }
    if (data.paid !== true) {
      data.paid = true;
      changed = true;
    }
    if (bound && !data.paidIdentity) {
      data.paidIdentity = bound;
      changed = true;
    }
    return changed;
  }

  function unpaidCopy(source) {
    var copy = JSON.parse(JSON.stringify(source || SAMPLE));
    copy.shareId = uid("stele");
    copy.paid = false;
    copy.isPublic = false;
    copy.payMethod = "";
    copy.paidAt = null;
    copy.cloudId = null;
    copy.paidIdentity = null;
    return copy;
  }

  function load() {
    var data;
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      data = raw ? JSON.parse(raw) : unpaidCopy(SAMPLE);
    } catch (e) {
      data = unpaidCopy(SAMPLE);
    }
    if (reconcileDraft(data) || !localStorage.getItem(STORAGE_KEY)) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (err) { /* ignore quota */ }
    }
    return data;
  }

  function save(data) {
    try {
      reconcileDraft(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  }

  function resetSample() {
    var copy = unpaidCopy(SAMPLE);
    save(copy);
    return copy;
  }

  function startNewStele(role) {
    var draft = {
      role: role || "self",
      name: "",
      years: "",
      epitaph: "",
      templateId: "",
      events: [],
      photoSlots: 2,
      familyMessage: "",
      shareId: uid("stele"),
      isPublic: false,
      paid: false,
      payMethod: "",
      paidAt: null,
      cloudId: null,
      paidIdentity: null
    };
    save(draft);
    return draft;
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
      { id: "clan", href: "family.html", label: "族谱" },
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
    var birth = null;
    var death = null;
    var events = sortEvents((draft && draft.events) || []);
    for (var i = 0; i < events.length; i++) {
      var title = events[i].title || "";
      var year = Number(events[i].year);
      if (!year) continue;
      if (!birth && /出生|生于/.test(title)) birth = year;
      if (!death && /去世|逝世|辞世|离世|病逝|仙逝/.test(title)) death = year;
    }
    if (!birth && events.length && Number(events[0].year)) birth = Number(events[0].year);
    if (!birth && draft && draft.birthYear) birth = Number(draft.birthYear);
    if (!death && draft && draft.deathYear) death = Number(draft.deathYear);
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
      paid: (source === "sample") || (raw && raw.source === "sample") || !!(raw && raw.paid === true),
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
      if (!rec.id || seen[rec.id] || rec.isPublic !== true || rec.paid !== true) return;
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

  function isUuid(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(value || ""));
  }

  function cloudMessage(error) {
    var text = "";
    var code = "";
    if (error) {
      text = String(error.message || error.msg || error.error_code || error);
      code = String(error.code || error.error_code || error.status || "");
    }
    var blob = text + " " + code;
    if (/anonymous_provider_disabled|anonymous sign-ins are disabled/i.test(blob)) {
      return "云端匿名登录还没打开。请在 Supabase 的 Authentication → Sign In / Providers 里启用 Anonymous sign-ins。当前只使用本机和示例。";
    }
    if (/PGRST205|schema cache|does not exist|Could not find the table|relation .* does not exist|42P01/i.test(blob)) {
      return "云端数据表还没建好。请到 Supabase SQL Editor 运行仓库里的 supabase/schema.sql。当前只显示本机和示例。";
    }
    if (/no-cloud|Failed to fetch|NetworkError|Load failed/i.test(blob)) {
      return "暂时连不上云端，已改用本机和示例。";
    }
    if (error) return "暂时连不上云端，已改用本机和示例。";
    return "";
  }

  var cloudClient = null;

  function getCloud() {
    try {
      var cfg = global.EPITAPH_SUPABASE;
      var lib = global.supabase;
      if (!cfg || !cfg.url || !cfg.key || !lib || typeof lib.createClient !== "function") return null;
      if (!cloudClient) {
        cloudClient = lib.createClient(cfg.url, cfg.key, {
          auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
        });
      }
      return cloudClient;
    } catch (e) {
      cloudClient = null;
      return null;
    }
  }

  function loadSupabaseLater() {
    try {
      if (!global.document || global.EPITAPH_SUPABASE_FAILED) return;
      if (global.supabase && typeof global.supabase.createClient === "function") return;
      if (document.querySelector("script[data-epitaph-supabase]")) return;
      var tag = document.createElement("script");
      tag.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.118.0/dist/umd/supabase.js";
      tag.async = true;
      tag.setAttribute("data-epitaph-supabase", "1");
      tag.onerror = function () { global.EPITAPH_SUPABASE_FAILED = true; };
      (document.head || document.documentElement).appendChild(tag);
    } catch (e) {
      global.EPITAPH_SUPABASE_FAILED = true;
    }
  }

  function ensureSession(callback) {
    var client = getCloud();
    var settled = false;
    function finish(err, session) {
      if (settled) return;
      settled = true;
      callback(err, session || null);
    }
    if (!client) {
      finish(new Error("no-cloud"));
      return;
    }
    client.auth.getSession().then(function (res) {
      var session = res && res.data && res.data.session;
      if (session && session.user) {
        finish(null, session);
        return null;
      }
      return client.auth.signInAnonymously();
    }).then(function (out) {
      if (!out || settled) return;
      if (out.error || !out.data || !out.data.session) {
        finish(out.error || new Error("anon"));
        return;
      }
      finish(null, out.data.session);
    }).catch(function (err) {
      finish(err);
    });
  }

  function rememberCloudId(data, cloudId) {
    if (!data || !cloudId) return;
    data.cloudId = cloudId;
    save(data);
    var list = LocalAdapter.readSaved();
    var changed = false;
    for (var i = 0; i < list.length; i++) {
      if (list[i] && list[i].id === data.shareId) {
        list[i].cloudId = cloudId;
        changed = true;
      }
    }
    if (changed) LocalAdapter.writeSaved(list);
  }

  var CloudStore = {
    searchCards: function (name, year, callback) {
      ensureSession(function (err) {
        if (err) {
          callback(err, [], cloudMessage(err));
          return;
        }
        var client = getCloud();
        var query = client.from("steles_public_cards").select("id,name,birth_year,death_year,epitaph");
        if (name) {
          var safeName = String(name).replace(/[%_,.()]/g, "");
          if (safeName) query = query.ilike("name", "%" + safeName + "%");
        }
        if (year) {
          var yearNum = Number(year);
          query = query.or("birth_year.eq." + yearNum + ",death_year.eq." + yearNum);
        }
        query.limit(50).then(function (res) {
          if (res.error) {
            callback(res.error, [], cloudMessage(res.error));
            return;
          }
          var cards = (res.data || []).map(function (row) {
            return {
              id: row.id,
              name: row.name || "",
              years: formatYears({ birthYear: row.birth_year, deathYear: row.death_year }),
              epitaph: row.epitaph || ""
            };
          });
          callback(null, cards, "");
        }).catch(function (fetchErr) {
          callback(fetchErr, [], cloudMessage(fetchErr));
        });
      });
    },
    fetchDetail: function (id, callback) {
      if (!isUuid(id)) {
        callback(null, null, "");
        return;
      }
      ensureSession(function (err) {
        if (err) {
          callback(err, null, cloudMessage(err));
          return;
        }
        getCloud().from("steles").select("id,name,birth_year,death_year,hometown,epitaph,content,is_public,paid").eq("id", id).maybeSingle().then(function (res) {
          if (res.error) {
            callback(res.error, null, cloudMessage(res.error));
            return;
          }
          if (!res.data || res.data.is_public !== true || res.data.paid !== true) {
            callback(null, null, "");
            return;
          }
          var body = res.data.content || {};
          callback(null, {
            id: res.data.id,
            name: res.data.name || "",
            hometown: res.data.hometown || "",
            birthYear: res.data.birth_year || null,
            deathYear: res.data.death_year || null,
            epitaph: res.data.epitaph || "",
            events: body.events || [],
            familyMessage: body.familyMessage || "",
            isPublic: true,
            paid: true,
            source: "cloud"
          }, "");
        }).catch(function (fetchErr) {
          callback(fetchErr, null, cloudMessage(fetchErr));
        });
      });
    },
    upsertPaid: function (data, rec, callback) {
      ensureSession(function (err, session) {
        if (err) {
          callback(err, null, cloudMessage(err));
          return;
        }
        var row = {
          owner: session.user.id,
          name: rec.name || "",
          birth_year: rec.birthYear || null,
          death_year: rec.deathYear || null,
          hometown: rec.hometown || null,
          epitaph: rec.epitaph || "",
          content: {
            events: rec.events || [],
            familyMessage: rec.familyMessage || "",
            role: rec.role || "self",
            photoSlots: data.photoSlots || 0
          },
          is_public: rec.isPublic === true,
          paid: true
        };
        var query;
        if (isUuid(data.cloudId)) {
          query = getCloud().from("steles").update(row).eq("id", data.cloudId).select("id").single();
        } else {
          query = getCloud().from("steles").insert(row).select("id").single();
        }
        query.then(function (res) {
          if (res.error) {
            callback(res.error, null, cloudMessage(res.error));
            return;
          }
          var cloudId = res.data && res.data.id;
          rememberCloudId(data, cloudId);
          callback(null, cloudId, "");
        }).catch(function (fetchErr) {
          callback(fetchErr, null, cloudMessage(fetchErr));
        });
      });
    }
  };

  function queryParts(criteria) {
    var opts = criteria || {};
    return {
      name: String(opts.name || "").trim(),
      year: String(opts.year == null ? "" : opts.year).trim()
    };
  }

  function cardsMatching(list, name, year) {
    if (!name && !year) return [];
    if (year && !/^\d+$/.test(year)) return [];
    var seen = {};
    var out = [];
    (list || []).forEach(function (rec) {
      if (!rec || !rec.id || seen[rec.id]) return;
      if (rec.isPublic !== true || rec.paid !== true) return;
      if (name && !nameHit(rec, name)) return;
      if (year && !exactYearHit(rec, year)) return;
      seen[rec.id] = true;
      out.push(toCard(rec));
    });
    return out;
  }

  function mergeCards(first, second) {
    var seen = {};
    var out = [];
    first.concat(second).forEach(function (card) {
      if (!card || !card.id || seen[card.id]) return;
      seen[card.id] = true;
      out.push({
        id: card.id,
        name: card.name || "",
        years: card.years || "",
        epitaph: card.epitaph || ""
      });
    });
    return out;
  }

  /**
   * 搜索与读取的唯一入口。卡片只有姓名、年份、墓志铭一行。
   * 云端可用时：示例 + steles_public_cards。云端不可用时退回本机已付费公开记录和示例。
   * 不按籍贯过滤。未公开或未付费的碑不会出现。
   */
  var EpitaphData = {
    formatYears: formatYears,
    search: function (criteria, callback) {
      var parts = queryParts(criteria);
      var samples = cardsMatching(LocalAdapter.readSamples().map(function (item) {
        return asStele(item, "sample");
      }), parts.name, parts.year);
      var localCards = cardsMatching(collectPublic(), parts.name, parts.year);
      if (!parts.name && !parts.year) {
        if (typeof callback === "function") callback(null, [], "");
        return [];
      }
      if (parts.year && !/^\d+$/.test(parts.year)) {
        if (typeof callback === "function") callback(null, [], "");
        return [];
      }
      if (typeof callback !== "function") return localCards;
      CloudStore.searchCards(parts.name, parts.year, function (err, cloudCards, message) {
        if (err) {
          callback(err, localCards, message || cloudMessage(err));
          return;
        }
        callback(null, mergeCards(samples, cloudCards), "");
      });
      return localCards;
    },
    getPublic: function (id, callback) {
      var local = null;
      if (id) {
        var list = collectPublic();
        for (var i = 0; i < list.length; i++) {
          if (list[i].id === id) {
            local = clone(list[i]);
            break;
          }
        }
      }
      if (typeof callback !== "function") return local;
      if (!id) {
        callback(null, null, "");
        return null;
      }
      if (local && local.source === "sample") {
        callback(null, local, "");
        return local;
      }
      CloudStore.fetchDetail(id, function (err, rec, message) {
        if (rec) {
          callback(null, rec, "");
          return;
        }
        if (local && local.isPublic === true && local.paid === true) {
          callback(err, local, message || "");
          return;
        }
        callback(err, null, message || "");
      });
      return local;
    },
    hasSaved: function (id) {
      if (!id) return false;
      return LocalAdapter.readSaved().some(function (item) {
        return item && item.id === id;
      });
    },
    isPaid: function (draft) {
      if (!draft) return false;
      if (reconcileDraft(draft)) save(draft);
      return draft.paid === true;
    },
    describeDraft: function (draft) {
      var stele = asStele(draft || {}, "local");
      return {
        name: stele.name,
        years: formatYears(stele),
        epitaph: stele.epitaph
      };
    },
    /**
     * 记下已模拟支付。不自动公开。
     * 真实微信支付 / 支付宝接入后，仍由这里写入 paid。
     */
    markPaid: function (draft, receipt, callback) {
      var data = draft || {};
      data.paid = true;
      data.paidIdentity = identityOf(data);
      data.payMethod = (receipt && receipt.method) || "";
      data.paidAt = Date.now();
      var okDraft = save(data);
      return EpitaphData.saveStele(data, function (err, ok, message) {
        if (typeof callback === "function") callback(err, okDraft && ok, message);
      });
    },
    saveStele: function (draft, callback) {
      var ok = false;
      var data = draft || {};
      var rec = null;
      try {
        if (!data.shareId) data.shareId = uid("stele");
        var years = deriveYears(data);
        var paid = data.paid === true;
        rec = {
          id: data.shareId,
          name: data.name || "",
          hometown: data.hometown || "",
          birthYear: years.birthYear,
          deathYear: years.deathYear,
          epitaph: data.epitaph || "",
          events: clone(data.events || []),
          familyMessage: data.familyMessage || "",
          role: data.role || "self",
          isPublic: data.isPublic === true && paid,
          paid: paid,
          payMethod: paid ? (data.payMethod || "") : "",
          paidAt: paid ? (data.paidAt || null) : null,
          cloudId: isUuid(data.cloudId) ? data.cloudId : null,
          source: "local",
          savedAt: Date.now()
        };
        var list = LocalAdapter.readSaved().filter(function (item) {
          return item && item.id !== rec.id;
        });
        list.unshift(rec);
        LocalAdapter.writeSaved(list);
        ok = true;
      } catch (e) {
        ok = false;
      }
      if (!ok || !rec || rec.paid !== true) {
        if (typeof callback === "function") callback(ok ? null : new Error("save"), ok, "");
        return ok;
      }
      CloudStore.upsertPaid(data, rec, function (err, cloudId, message) {
        if (typeof callback === "function") callback(err, ok, message || "");
      });
      return ok;
    }
  };

  global.EpitaphApp = {
    TEMPLATES: TEMPLATES,
    SAMPLE: SAMPLE,
    load: load,
    save: save,
    resetSample: resetSample,
    startNewStele: startNewStele,
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

  /**
   * 支付桩。现在只模拟成功，不访问网络、不扣款。
   * 换成微信支付 / 支付宝时，只替换 EpitaphPay.pay，页面不用改。
   */
  var EpitaphPay = {
    price: 3,
    pay: function (method, callback) {
      var allowed = method === "wechat" || method === "alipay";
      if (typeof callback !== "function") return;
      if (!allowed) {
        callback(new Error("unsupported-method"));
        return;
      }
      callback(null, {
        ok: true,
        simulated: true,
        method: method,
        amount: 3,
        provider: "stub"
      });
    }
  };
  global.EpitaphPay = EpitaphPay;

  var LOGIN_KEY = "epitaph_web_login_v1";
  var FAMILY_KEY = "epitaph_web_family_v1";
  var DEMO_CODE = "123456";

  function readLogin() {
    try {
      var raw = localStorage.getItem(LOGIN_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || data.loggedIn !== true || !data.phone) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  function sampleFamily() {
    return {
      title: "王德福这一支",
      isPublic: false,
      cloudId: null,
      self: { name: "王德福", birthYear: 1958, deathYear: 2024 },
      parents: [{ name: "王守仁", birthYear: 1931, deathYear: 2001 }],
      spouse: null,
      siblings: [{ name: "王德明", birthYear: 1960, deathYear: null }],
      children: [
        { name: "王强", birthYear: null, deathYear: null },
        { name: "王丽", birthYear: null, deathYear: null },
        { name: "王芳", birthYear: null, deathYear: null }
      ]
    };
  }

  function linkPhoneToCloud(phone, callback) {
    ensureSession(function (err) {
      if (err) {
        if (callback) callback(null);
        return;
      }
      var client = getCloud();
      if (!client || !client.auth || typeof client.auth.updateUser !== "function") {
        if (callback) callback(null);
        return;
      }
      client.auth.updateUser({ data: { phone: phone } }).then(function () {
        if (callback) callback(null);
      }).catch(function () {
        if (callback) callback(null);
      });
    });
  }

  var EpitaphAuth = {
    DEMO_CODE: DEMO_CODE,
    isLoggedIn: function () {
      return !!readLogin();
    },
    current: function () {
      return readLogin();
    },
    loginDemo: function (phone, code, callback) {
      var digits = String(phone || "").replace(/\D/g, "");
      if (!/^1\d{10}$/.test(digits)) {
        callback(new Error("phone"));
        return;
      }
      if (String(code || "").trim() !== DEMO_CODE) {
        callback(new Error("code"));
        return;
      }
      var session = { phone: digits, loggedIn: true, demo: true, at: Date.now() };
      try {
        localStorage.setItem(LOGIN_KEY, JSON.stringify(session));
      } catch (e) {
        callback(e);
        return;
      }
      linkPhoneToCloud(digits, function () {
        callback(null, session);
      });
    },
    logout: function () {
      try { localStorage.removeItem(LOGIN_KEY); } catch (e) { /* ignore */ }
    },
    require: function (from) {
      if (readLogin()) return true;
      var target = from || "index.html";
      window.location.href = "login.html?from=" + encodeURIComponent(target);
      return false;
    }
  };

  function readFamily() {
    try {
      var raw = localStorage.getItem(FAMILY_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || !data.self) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  function upsertFamilyCloud(tree, callback) {
    ensureSession(function (err) {
      if (err) {
        callback(err, tree, "暂时只保存在本机。");
        return;
      }
      var client = getCloud();
      if (!client) {
        callback(new Error("no-cloud"), tree, "暂时只保存在本机。");
        return;
      }
      var row = {
        title: tree.title || "",
        is_public: tree.isPublic === true,
        tree: {
          self: tree.self,
          parents: tree.parents || [],
          spouse: tree.spouse || null,
          siblings: tree.siblings || [],
          children: tree.children || []
        }
      };
      var query = isUuid(tree.cloudId)
        ? client.from("family_trees").update(row).eq("id", tree.cloudId).select("id").single()
        : client.from("family_trees").insert(row).select("id").single();
      query.then(function (res) {
        if (res.error) {
          callback(res.error, tree, "族谱云端表还没建好，已保存在本机。请运行 supabase/schema_family.sql。");
          return;
        }
        if (res.data && res.data.id) tree.cloudId = res.data.id;
        try { localStorage.setItem(FAMILY_KEY, JSON.stringify(tree)); } catch (e) { /* ignore */ }
        callback(null, tree, "");
      }).catch(function () {
        callback(new Error("network"), tree, "暂时只保存在本机。");
      });
    });
  }

  var EpitaphFamily = {
    sample: sampleFamily,
    load: function () {
      return readFamily() || sampleFamily();
    },
    save: function (tree, callback) {
      try {
        localStorage.setItem(FAMILY_KEY, JSON.stringify(tree));
      } catch (e) {
        if (callback) callback(e, tree, "本机保存失败");
        return;
      }
      upsertFamilyCloud(tree, callback || function () {});
    }
  };

  global.EpitaphAuth = EpitaphAuth;
  global.EpitaphFamily = EpitaphFamily;
  loadSupabaseLater();
})(window);
