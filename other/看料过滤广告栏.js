// ==UserScript==
// @name         看料过滤广告栏
// @version      0.1.1
// @namespace    https://github.com/love2wllw/scriptcat_scripts/
// @updateURL    https://raw.githubusercontent.com/love2wllw/scriptcat_scripts/refs/heads/main/other/看料过滤广告栏.js
// @downloadURL  https://raw.githubusercontent.com/love2wllw/scriptcat_scripts/refs/heads/main/other/看料过滤广告栏.js
// @description  my ScriptCat custom scripts
// @author       ddLee
// @match        https://kanliao*.*/*
// @match        https://*.kanliao*.*/*
// @exclude      https://kanliao*.*/archives/*
// ==/UserScript==

(function () {
    'use strict';

    function removeAds() {
        const predicate1 = (x) => x.querySelector("h2>div[class='wrap']>span[class='wraps']") != null;
        const predicate2 = (x) => [...x.querySelectorAll("div[class='post-card-info']>span")].some(x => x.innerText == "无分类");
        const articles = [...document.querySelectorAll("article")].filter(x => predicate1(x) && predicate2(x));
        console.log(articles);
        for (let i = 0; i < articles.length; i++) {
            articles[i].remove();
        }
        //document.querySelector("div.blog-notice").remove();
        //document.querySelector("header#masthead").style.height = "60px";
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