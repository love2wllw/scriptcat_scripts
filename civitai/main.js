// ==UserScript==
// @name         civitai_tools
// @version      0.1.3
// @namespace    https://github.com/love2wllw/scriptcat_scripts/
// @updateURL    https://raw.githubusercontent.com/love2wllw/scriptcat_scripts/refs/heads/main/civitai/main.js
// @downloadURL  https://raw.githubusercontent.com/love2wllw/scriptcat_scripts/refs/heads/main/civitai/main.js
// @description  my ScriptCat custom scripts
// @author       ddLee
// @include      https://civitai.*
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
        btn.setAttribute("href", new_url);
        btn.innerHTML = ico_svg;
        wrap.append(btn);
    }

    function add_post_detail() {
        const _addBtn = (p) => {
            const btn = document.createElement("p");
            btn.setAttribute("style", "color:var(--mantine-color-blue-4)");
            btn.setAttribute("class", "mantine-focus-auto flex cursor-pointer items-center gap-1 text-xs m_b6d8b162 mantine-Text-root");
            btn.setAttribute("href", "javascript:;");
            btn.innerHTML = "<span>复制</span>";
            p.append(btn);
            return btn;
        }
        const nodes = document.querySelectorAll('div[class~="mantine-Card-root"][class~="mantine-Paper-root"]');
        const mainNode = Array.from(nodes).find(x => (x.innerText || "").replace(/\s/g, "").startsWith("Generationdata"));
        if (mainNode) {
            let genNode = null;
            let resNode = null;
            let promptNode = null;
            let otherNode = null;
            mainNode.childNodes.forEach(x => {
                let innerText = (x.innerText || "").replace(/\s/g, "");
                if (innerText.startsWith("Generationdata")) {
                    genNode = x;
                } else if (innerText.startsWith("Resourcesused")) {
                    resNode = x;
                } else if (innerText.startsWith("Prompt")) {
                    promptNode = x;
                } else if (innerText.startsWith("Othermetadata")) {
                    otherNode = x;
                }
            });
            if (genNode) {
                const copyBtn = _addBtn(genNode);
                copyBtn.addEventListener("click", (e) => {
                    console.log(e.target);
                });
            }
            console.log(genNode);
            console.log(resNode);
            console.log(promptNode);
            console.log(otherNode);
        }
    }

    function loaded() {
        // 添加civarchive.com跳转按钮
        /^\/models\/\d+\/?/.test(S_Path) && add_civarchive_button();
        // 示例详情页
        /^\/images\/\d+\/?/.test(S_Path) && add_post_detail();
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