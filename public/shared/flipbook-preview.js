(function () {
  var maxPage = window.__KLARIFY_PREVIEW_MAX_PAGE__ || 20;
  var purchaseUrl =
    window.__KLARIFY_PURCHASE_URL__ || "https://book.klarify.africa/checkout/founders-guide";
  var overlayId = "klarify-preview-gate";
  var lastBlockedAt = 0;

  function showOverlay() {
    if (document.getElementById(overlayId)) return;

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
        return original.apply(this, arguments);
      };
      gotoPageFun.__klarifyWrapped = true;
    }

    blockIfBeyond(getCurrentPage());
  }

  var attempts = 0;
  var timer = setInterval(function () {
    attempts += 1;
    installHooks();
    if (attempts > 120) clearInterval(timer);
  }, 500);
})();
