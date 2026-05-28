(function () {
  var maxPage = window.__KLARIFY_PREVIEW_MAX_PAGE__ || 20;
  var purchaseUrl =
    window.__KLARIFY_PURCHASE_URL__ || "https://book.klarify.africa/checkout/founders-guide";
  var overlayId = "klarify-preview-gate";
  var nudgeId = "klarify-read-nudge";
  var nudgeStylesId = "klarify-read-nudge-styles";
  var lastBlockedAt = 0;
  var nudgeDismissed = false;
  var nudgeStartPage = 1;

  var nudgeStorageKey =
    "klarify_flip_nudge_" +
    (location.pathname.split("/").filter(Boolean)[0] || "book");

  function isTouchDevice() {
    return (
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0
    );
  }

  function injectNudgeStyles() {
    if (document.getElementById(nudgeStylesId)) return;

    var style = document.createElement("style");
    style.id = nudgeStylesId;
    style.textContent =
      "@keyframes klarifyNudgePulse{0%,100%{opacity:.45;transform:translateX(0)}50%{opacity:1;transform:translateX(4px)}}" +
      "@keyframes klarifyNudgeFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}" +
      "#" +
      nudgeId +
      "{animation:klarifyNudgeFloat 2.4s ease-in-out infinite}" +
      "#" +
      nudgeId +
      " .klarify-nudge-arrow{animation:klarifyNudgePulse 1.4s ease-in-out infinite}";
    document.head.appendChild(style);
  }

  function dismissReadNudge(persist) {
    if (nudgeDismissed) return;
    nudgeDismissed = true;
    if (persist !== false) {
      try {
        sessionStorage.setItem(nudgeStorageKey, "1");
      } catch (e) {}
    }
    var nudge = document.getElementById(nudgeId);
    if (nudge) {
      nudge.style.opacity = "0";
      nudge.style.transform = "translate(-50%, 12px)";
      nudge.style.transition = "opacity .25s ease, transform .25s ease";
      setTimeout(function () {
        if (nudge.parentNode) nudge.parentNode.removeChild(nudge);
      }, 260);
    }
  }

  function showReadNudge() {
    if (nudgeDismissed || document.getElementById(nudgeId)) return;

    try {
      if (sessionStorage.getItem(nudgeStorageKey) === "1") {
        nudgeDismissed = true;
        return;
      }
    } catch (e) {}

    injectNudgeStyles();

    var touch = isTouchDevice();
    var actionText = touch
      ? "Swipe left or right to turn pages"
      : "Click or drag the page edges to flip";
    var hintText =
      "Free preview · table of contents, foreword, preface & introduction";

    var nudge = document.createElement("div");
    nudge.id = nudgeId;
    nudge.setAttribute("role", "status");
    nudge.setAttribute("aria-live", "polite");
    nudge.style.cssText =
      "position:fixed;left:50%;bottom:max(20px, env(safe-area-inset-bottom));transform:translateX(-50%);z-index:99998;" +
      "max-width:min(92vw, 420px);width:calc(100% - 32px);background:rgba(12,12,18,0.96);" +
      "border:1px solid rgba(16,185,129,0.28);border-radius:16px;padding:14px 16px;" +
      "box-shadow:0 18px 50px rgba(0,0,0,0.45);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;" +
      "color:#f4f4f5;transition:opacity .25s ease, transform .25s ease;";

    nudge.innerHTML =
      '<div style="display:flex;align-items:flex-start;gap:12px;">' +
      '<div style="flex-shrink:0;width:40px;height:40px;border-radius:12px;background:rgba(16,185,129,0.12);display:flex;align-items:center;justify-content:center;color:#10b981;">' +
      (touch
        ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M7 8l-4 4 4 4"/><path d="M17 8l4 4-4 4"/><path d="M3 12h18"/></svg>'
        : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 6h16M4 12h10M4 18h16"/></svg>') +
      "</div>" +
      '<div style="min-width:0;flex:1;">' +
      '<p style="margin:0 0 4px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#10b981;">Preview mode</p>' +
      '<p style="margin:0 0 4px;font-size:15px;font-weight:600;line-height:1.35;">' +
      actionText +
      "</p>" +
      '<p style="margin:0;font-size:12px;line-height:1.45;color:#a1a1aa;">' +
      hintText +
      "</p>" +
      "</div>" +
      '<button type="button" id="klarify-read-nudge-close" aria-label="Dismiss reading hint" style="flex-shrink:0;background:none;border:none;color:#a1a1aa;font-size:20px;line-height:1;padding:0;cursor:pointer;">×</button>' +
      "</div>" +
      (touch
        ? '<div style="margin-top:10px;display:flex;align-items:center;justify-content:center;gap:8px;color:#10b981;font-size:12px;font-weight:500;">' +
          '<span class="klarify-nudge-arrow">←</span> Swipe to read <span class="klarify-nudge-arrow">→</span>' +
          "</div>"
        : "");

    document.body.appendChild(nudge);

    document.getElementById("klarify-read-nudge-close").onclick = function () {
      dismissReadNudge(true);
    };

    nudgeStartPage = getCurrentPage();

    document.addEventListener(
      "touchstart",
      function onTouch() {
        dismissReadNudge(true);
        document.removeEventListener("touchstart", onTouch, true);
      },
      true
    );

    setTimeout(function () {
      if (!nudgeDismissed) dismissReadNudge(true);
    }, 12000);
  }

  function maybeDismissNudgeOnPageChange() {
    if (nudgeDismissed) return;
    var current = getCurrentPage();
    if (current !== nudgeStartPage) {
      dismissReadNudge(true);
    }
  }

  function showOverlay() {
    if (document.getElementById(overlayId)) return;
    dismissReadNudge(true);

    var overlay = document.createElement("div");
    overlay.id = overlayId;
    overlay.style.cssText =
      "position:fixed;inset:0;z-index:99999;background:rgba(5,5,8,0.92);display:flex;align-items:center;justify-content:center;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;";

    overlay.innerHTML =
      '<div style="max-width:420px;width:100%;background:#0c0c12;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:28px;text-align:center;color:#f4f4f5;">' +
      '<p style="margin:0 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#10b981;">Preview limit reached</p>' +
      '<h2 style="margin:0 0 12px;font-size:22px;line-height:1.3;">Continue reading with full access</h2>' +
      '<p style="margin:0 0 24px;color:#a1a1aa;font-size:15px;line-height:1.6;">Public preview covers the table of contents, foreword, preface, and introduction. Purchase to unlock the full book and download PDF + Mac/Windows pack.</p>' +
      '<a href="' +
      purchaseUrl +
      '" style="display:inline-block;background:#10b981;color:#041008;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:10px;">Get full access</a>' +
      '<button type="button" id="klarify-preview-close" style="display:block;margin:16px auto 0;background:none;border:none;color:#a1a1aa;cursor:pointer;font-size:14px;">Stay on preview page</button>' +
      "</div>";

    document.body.appendChild(overlay);
    document.getElementById("klarify-preview-close").onclick = function () {
      overlay.remove();
    };
  }

  function getCurrentPage() {
    if (typeof currentPageIndex !== "undefined" && currentPageIndex) {
      return parseInt(currentPageIndex, 10) || 1;
    }
    if (typeof bookConfig !== "undefined" && bookConfig.currentPageIndex) {
      return parseInt(bookConfig.currentPageIndex, 10) || 1;
    }
    return 1;
  }

  function blockIfBeyond(page) {
    if (!page || page <= maxPage) return false;
    var now = Date.now();
    if (now - lastBlockedAt > 800) {
      lastBlockedAt = now;
      showOverlay();
      if (typeof gotoPageFun === "function") {
        gotoPageFun(maxPage, false, "0");
      }
    }
    return true;
  }

  function installHooks() {
    if (typeof gotoPageFun === "function" && !gotoPageFun.__klarifyWrapped) {
      var original = gotoPageFun;
      gotoPageFun = function (page) {
        var target = parseInt(page, 10) || 1;
        if (target > maxPage) {
          blockIfBeyond(target);
          return;
        }
        var result = original.apply(this, arguments);
        maybeDismissNudgeOnPageChange();
        return result;
      };
      gotoPageFun.__klarifyWrapped = true;
    }

    blockIfBeyond(getCurrentPage());
    maybeDismissNudgeOnPageChange();
  }

  var attempts = 0;
  var nudgeShown = false;
  var timer = setInterval(function () {
    attempts += 1;
    installHooks();

    if (!nudgeShown && attempts >= 4) {
      nudgeShown = true;
      setTimeout(showReadNudge, 800);
    }

    if (attempts > 120) clearInterval(timer);
  }, 500);
})();
