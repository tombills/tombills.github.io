/* ============================================================
   个人网站 · 交互脚本（原生 JS，无依赖）
   ============================================================ */
(function () {
  "use strict";

  /* 1. 年份自动填充 */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* 2. 移动端菜单开合 */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    // 点击菜单项后自动收起
    menu.querySelectorAll(".nav__link").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* 3. 滚动揭示动画 */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* 4. 导航高亮当前区块 */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".nav__link");
  if (sections.length && navLinks.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navLinks.forEach(function (link) {
              link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
            });
          }
        });
      },
      { threshold: 0.5 }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* 5. 本站技术演示：实时时钟 / 运行时长 / 点击计数 */
  var clockEl = document.getElementById("jsClock");
  if (clockEl) {
    var pad = function (n) { return n < 10 ? "0" + n : "" + n; };
    var tick = function () {
      var d = new Date();
      clockEl.textContent = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
    };
    tick();
    setInterval(tick, 1000);
  }

  var uptimeEl = document.getElementById("jsUptime");
  if (uptimeEl) {
    var startedAt = Date.now();
    setInterval(function () {
      var s = Math.floor((Date.now() - startedAt) / 1000);
      uptimeEl.textContent = s + " 秒";
    }, 1000);
  }

  var counterBtn = document.getElementById("jsCounter");
  if (counterBtn) {
    var clicks = 0;
    counterBtn.addEventListener("click", function () {
      clicks++;
      counterBtn.textContent = "已点击 " + clicks + " 次";
    });
  }
})();
