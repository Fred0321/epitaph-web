/**
 * 数字碑 · 本地草稿（file:// 可用 · 无 ES modules）
 */
(function (global) {
  var STORAGE_KEY = "epitaph_web_draft_v2";

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
    shareId: "demo-wang-defu"
  };

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
    PINE_SVG: PINE_SVG
  };
})(window);
