// ==UserScript==
// @name         小工具合集
// @namespace    http://localhost:3380/
// @version      0.0.1
// @description  小工具合集
// @author       Didi
// @match        https://kanliao*.*/*
// @match        https://*.watchfreejavonline.co/*/
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';

    function watchfreejavonline() {
        const wrap = document.querySelector("div.video_player");
        const link = wrap && wrap.querySelector("a.btn.btn-success");
        const href = link.href || "";
        if (href) {
            fetch(href).then(r => r.text()).then(html => {
                let rg = /data-url="\/embed\-(\w+)\.html"/g;
                let mc;
                while ((mc = rg.exec(html)) !== null) {
                    console.log(`/embed-${mc[1]}.html`);
                }
            });
        }
    }
    function windowLoaded() {
        watchfreejavonline();
    }

    if (["interactive", "complete"].includes(document.readyState)) {
        windowLoaded();
    } else {
        console.log('DOMContentLoaded');
        window.addEventListener("DOMContentLoaded", windowLoaded);
    }
})();