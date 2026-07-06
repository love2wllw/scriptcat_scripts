// ==UserScript==
// @name         civitai_tools
// @version      0.1.0
// @namespace    https://github.com/love2wllw/scriptcat_scripts/
// @updateURL    https://raw.githubusercontent.com/love2wllw/scriptcat_scripts/refs/heads/main/civitai/main.js
// @downloadURL  https://raw.githubusercontent.com/love2wllw/scriptcat_scripts/refs/heads/main/civitai/main.js
// @description  my ScriptCat custom scripts
// @author       ddLee
// @match        http*://civitai.*
// @grant        none
// @noframes
// ==/UserScript==

(function () {
    'use strict';

    const S_URL = document.location.href;
    const S_Path = document.location.pathname;

    function add_civarchive_button() {
        const new_url = new URL(S_URL);
        new_url.hostname = "civarchive.com";

        const ico_svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"` +
            ` viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"` +
            ` stroke-linecap="round" stroke-linejoin="round"` +
            ` class="lucide lucide-package h-6 w-6 stroke-blue-600" aria-hidden="true">` +
            `<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"></path>` +
            `<path d="M12 22V12"></path><polyline points="3.29 7 12 12 20.71 7"></polyline><path d="m7.5 4.27 9 5.15"></path>` +
            `</svg>`;

        const wrap = document.querySelector('button.mantine-UnstyledButton-root[aria-label="Model options"][aria-haspopup="menu"][aria-expanded="false"]').parentElement;
        const btn = document.createElement("a");
        btn.setAttribute("aria-label", "跳转至CivArchive");
        btn.setAttribute("style", "--text-fz:var(--mantine-font-size-xs);line-height:1;color:var(--mantine-color-error);text-decoration:underline;padding:5px");
        btn.setAttribute("class", "mantine-focus-auto mantine-Text-root");
        btn.setAttribute("data-size", "xs");
        btn.setAttribute("target", "_blank");
        btn.setAttribute("href", url);
        btn.innerHTML = ico_svg;
        wrap.append(btn);
    }

    function loaded() {
        // 添加civarchive.com跳转按钮
        /^\/models\/\d+\/?/.test(S_Path) && add_civarchive_button();
    }

    loaded();
    /*
    if (["interactive", "complete"].includes(document.readyState)) {
        loaded();
    } else {
        window.addEventListener("DOMContentLoaded", loaded);
    }
    */
})();