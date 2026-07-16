// ==UserScript==
// @name         看料过滤广告栏
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.2
// @description  看料过滤广告栏
// @author       Didi
// @match        https://kanliao*.*/*
// @match        https://*.kanliao*.*/*
// @exclude      https://kanliao*.*/archives/*
// ==/UserScript==

(function () {
    'use strict';

    function removeAds() {
        const articles = document.querySelectorAll("article");
        const bans = [];
        for (const art of articles) {
            const hot = art.querySelector("h2.post-card-title div.wrap span.wraps");
            const sub = art.querySelector("div.blog-background");
            if (sub && sub.style.backgroundImage) {
                const imgu = sub.style.backgroundImage;
                if (imgu && (!/^url\("\//i.test(imgu) || /\.gif"\)/i.test(imgu) || hot)) {
                    bans.push(art);
                }
            }
        }
        bans.forEach((m) => { m.remove(); });
        document.querySelector("div.blog-notice").remove();
        document.querySelector("header#masthead").style.height = "60px";
    }
    function windowLoaded() {
        removeAds();
    }

    if (["interactive", "complete"].includes(document.readyState)) {
        windowLoaded();
    } else {
        console.log('DOMContentLoaded');
        window.addEventListener("DOMContentLoaded", windowLoaded);
    }
})();