// ==UserScript==
// @name         civitai_tools
// @version      0.1.11
// @namespace    https://github.com/love2wllw/scriptcat_scripts/
// @updateURL    https://raw.githubusercontent.com/love2wllw/scriptcat_scripts/refs/heads/main/civitai/main.js
// @downloadURL  https://raw.githubusercontent.com/love2wllw/scriptcat_scripts/refs/heads/main/civitai/main.js
// @description  my ScriptCat custom scripts
// @author       ddLee
// @include      https://civitai.*
// @require      https://scriptcat.org/lib/2691/1.0.0/sweetalert2.all.min-11.15.10.js?sha384-O1kBn1fdY7JEyTHMP/0shbUTh839VvXxg1t758rE9xIUuofX+tobxkHuDyVrMwJK
// @grant        none
// @noframes
// ==/UserScript==

/**
 * https://sweetalert2.github.io/#examples
 */

/* global Swal */
(function () {
    'use strict';

    const S_URL = document.location.href;
    const S_Path = document.location.pathname;

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function getExtensionByMimeType(mimeType) {
        const map = {
            'image/jpeg': 'jpg',
            'image/jpg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/bmp': 'bmp',
            'image/webp': 'webp',
            'image/svg+xml': 'svg',
            'image/tiff': 'tiff',
            'image/x-icon': 'ico',
            'image/vnd.microsoft.icon': 'ico',
            'image/avif': 'avif',
            'image/heic': 'heic',
            'image/heif': 'heif',
            'image/raw': 'raw',
            'image/x-raw': 'raw',
            'image/x-portable-pixmap': 'ppm',
            'image/x-pcx': 'pcx',
            'image/x-tga': 'tga',
            'image/x-rgb': 'rgb',
            'image/x-pict': 'pict',
            'image/x-quicktime': 'qtif'
        };
        return map[mimeType] || null;
    }

    async function writeClipboardText(text) {
        try {
            await navigator.clipboard.writeText(text);
            Swal.fire({ title: "复制成功", icon: "success" });
            return true;
        } catch (err) {
            Swal.fire({ title: "复制失败", icon: "error" });
            return false;
        }
    }

    async function getHtml(url) {
        try {
            const response = await fetch(url, {
                method: 'GET', headers: {
                    'Content-Type': 'text/html',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error('请求失败:', error);
            return null;
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function add_post_detail() {
        const _addBtn = (p) => {
            const btn = document.createElement("p");
            btn.setAttribute("style", "color:var(--mantine-color-red-4)");
            btn.setAttribute("class", "mantine-focus-auto flex cursor-pointer items-center gap-1 text-xs mantine-Text-root");
            btn.setAttribute("href", "javascript:;");
            btn.innerHTML = "<span>复制</span>";
            p.append(btn);
            return btn;
        };
        const nodes = document.querySelectorAll('div[class~="mantine-Card-root"][class~="mantine-Paper-root"]');
        const mainNode = Array.from(nodes).find(x => (x.innerText || "").replace(/\s/g, "").startsWith("Generationdata"));
        if (mainNode) {
            let genNode = null;
            let resNode = null;
            let promptNode = null;
            let negativeNode = null;
            let otherNode = null;
            mainNode.childNodes.forEach(x => {
                let innerText = (x.innerText || "").replace(/\s/g, "");
                if (innerText.startsWith("Generationdata")) {
                    genNode = x;
                } else if (innerText.startsWith("Resourcesused")) {
                    resNode = x;
                } else if (innerText.startsWith("Prompt")) {
                    promptNode = x;
                } else if (innerText.startsWith("Negativeprompt")) {
                    negativeNode = x;
                } else if (innerText.startsWith("Othermetadata")) {
                    otherNode = x;
                }
            });
            if (genNode) {
                const copyBtn = _addBtn(genNode);
                copyBtn.addEventListener("click", (e) => {
                    let resText = "";
                    if (resNode) {
                        resText += `\n> **Resources used**\n> `;
                        resNode.querySelectorAll("li").forEach(x => {
                            const a = x.querySelector("a");
                            const link = a != null ? a.getAttribute("href") : "";
                            const text = x.innerText || "";
                            const texts = text.split("\n\n");
                            const modelName = texts.length > 0 ? texts[0] : "";
                            let modelType = texts.length > 1 ? texts[1] : "";
                            if (modelType.length > 0) {
                                modelType = modelType.split("\n")[0];
                            }
                            const modelVer = texts.length > 2 ? texts[2] : "";
                            resText += `\n> > [${modelName}](${location.origin}${link}) **\`\`${modelType}\`\`**`;
                            if (modelVer) {
                                resText += `\n> > *${modelVer}*`;
                            }
                        });
                    }
                    if (promptNode) {
                        let promptText = promptNode.querySelectorAll("div.break-words.relative.text-sm")[0]?.innerText || "";
                        promptText = promptText.split("\n")[0];
                        promptText = promptText.replace(/(<|>)/g, "\\$1");
                        resText += `\n> \n> **Prompt**\n> \n> > ${promptText}`;
                    }
                    if (negativeNode) {
                        let negativeText = negativeNode.querySelectorAll("div.break-words.relative.text-sm")[0]?.innerText || "";
                        negativeText = negativeText.split("\n")[0];
                        resText += `\n> \n> **Negative prompt**\n> \n> > ${negativeText}`;
                    }
                    if (otherNode) {
                        resText += `\n> \n> **Other metadata**\n> \n> >`;
                        otherNode.querySelectorAll("div.mantine-Badge-root").forEach(x => {
                            resText += ` \`\`${(x.innerText || "").replace("\n", "")}\`\``;
                        });
                    }
                    writeClipboardText(resText);
                });
            }
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function getPostViewData() {
        return [...document.querySelectorAll(`a.mantine-focus-auto.mantine-Text-root.mantine-Anchor-root`)]
            .filter(x => /\/images\/\d+/i.test(x.href))
            .map(x => {
                let src = x.querySelector("img").src;
                src = /\/\w+\/([\w-]+)\//i.exec(src)[1];
                src = `https://image-b2.civitai.com/file/civitai-media-cache/${src}`;
                return { href: x.href, src };
            });
    }
    function add_btn_in_post_view() {
        const _getViewData = () => {
            return [...document.querySelectorAll(`a.mantine-focus-auto.mantine-Text-root.mantine-Anchor-root`)]
                .filter(x => /\/images\/\d+/i.test(x.href))
                .map(x => {
                    let src = x.querySelector("img").src;
                    src = /\/\w+\/([\w-]+)\//i.exec(src)[1];
                    src = `https://image-b2.civitai.com/file/civitai-media-cache/${src}`;
                    return { href: x.href, src };
                });
        };
        const _addBtn = () => {
            const wrap = [...document.querySelectorAll("button.mantine-Button-root.mantine-UnstyledButton-root[data-size='compact-md']")].find(x => x.innerText == "Save").parentElement;
            const btn = document.createElement("button");
            btn.setAttribute("style", "--button-height:var(--button-height-compact-md);--button-padding-x:var(--button-padding-x-compact-md);--button-fz:var(--mantine-font-size-md);--button-radius:var(--mantine-radius-xl);--button-bg:var(--mantine-color-gray-filled);--button-hover:var(--mantine-color-gray-filled-hover);--button-color:var(--mantine-color-white);--button-bd:calc(0.0625rem * var(--mantine-scale)) solid transparent");
            btn.setAttribute("class", "mantine-focus-auto mantine-active mantine-Button-root mantine-UnstyledButton-root");
            btn.innerHTML = "<span class='mantine-Button-inner'><span class='mantine-Button-label'><p class='mantine-focus-auto text-xs mantine-Text-root'>下载</p></span></span>";
            wrap.append(btn);
            return btn;
        };
        const _getDetail = async (name, item, index) => {
            let ret = "";
            if (item) {
                try {
                    //console.log(item.href);
                    const html = await getHtml(item.href);
                    if (html) {
                        const jo = JSON.parse(html.match(/<script\s+id="__NEXT_DATA__"\s+type="application\/json">([\s\S]*?)<\/script>/)[1].trim());
                        const queries = jo["props"]["pageProps"]["trpcState"]["json"]["queries"];
                        const imgData = queries.find(x => x["queryKey"] && x["queryKey"][0].join("-") == "image-get");
                        let mimeType = "image/png";
                        if (imgData && imgData["state"] && imgData["state"]["data"]) {
                            mimeType = imgData["mimeType"] || "image/png";
                        }
                        let ext = getExtensionByMimeType(mimeType);
                        const genData = queries.find(x => x["queryKey"] && x["queryKey"][0].join("-") == "image-getGenerationData");
                        if (genData && genData["state"] && genData["state"]["data"]) {
                            const data = genData["state"]["data"];
                            const meta = data["meta"];
                            const resources = data["resources"];
                            ret = "\n\n***\n\n![img](" + name + "-" + index + "." + ext + ")\n";
                            ret += "\n> **Resources used**\n>";
                            if (resources && Array.isArray(resources)) {
                                resources.forEach(x => {
                                    const modelId = x["modelId"] || "";
                                    const modelName = x["modelName"] || "";
                                    const modelType = x["modelType"] || "";
                                    const versionName = x["versionName"] || "";
                                    ret += `\n> > [${modelName}](https://civitai.red/models/${modelId}) **\`\`${modelType}\`\`**`;
                                    if (versionName) {
                                        ret += `\n> > *${versionName}*`;
                                    }
                                });
                            }
                            if (meta) {
                                let prompt = meta["prompt"] || "";
                                if (prompt) {
                                    ret += `\n> \n> **Prompt**\n> \n> > ${prompt}`;
                                }
                                let negative = meta["negativePrompt"] || "";
                                if (negative) {
                                    negative = negative.replace(/([^\\])([\\[<>\\(\\)\]])/g, "$1\\$2");
                                    ret += `\n> \n> **Negative prompt**\n> \n> > ${negative}`;
                                }
                                ret += "\n> \n> **Other metadata**\n> \n> >";
                                ret += ` \`\`steps:${(meta["steps"] || "")}\`\``;
                                ret += ` \`\`cfgScale:${(meta["cfgScale"] || "")}\`\``;
                                ret += ` \`\`sampler:${(meta["sampler"] || "")}\`\``;
                                ret += ` \`\`scheduler:${(meta["scheduler"] || "")}\`\``;
                                ret += ` \`\`denoise:${(meta["denoise"] || "")}\`\``;
                                ret += ` \`\`seed:${(meta["seed"] || "")}\`\``;
                                ret += ` \`\`width:${(meta["width"] || "")}\`\``;
                                ret += ` \`\`height:${(meta["height"] || "")}\`\``;
                            }
                            //console.log(ret);
                        }
                    }
                } catch (err) {
                    console.error(err);
                }
            }
            return ret;
        };
        const _init = () => {
            const btn = _addBtn();
            btn.addEventListener("click", () => {

                Swal.fire({
                    title: "输入文件名",
                    input: "text",
                    inputAttributes: { autocapitalize: "off" },
                    showCancelButton: true,
                    confirmButtonText: "确定",
                    showLoaderOnConfirm: true,
                    preConfirm: async (name) => {
                        try {

                            let markdown = "";
                            let imgs = "";
                            const viewData = _getViewData();
                            for (const [index, item] of viewData.entries()) {
                                imgs += `\n${item.src}`;
                                const txt = await _getDetail(name, item, index);
                                markdown += txt;
                            }
                            markdown = imgs + markdown
                            writeClipboardText(markdown);

                        } catch (error) {
                            Swal.showValidationMessage(`Request failed: ${error}`);
                        }
                    },
                    allowOutsideClick: () => !Swal.isLoading()
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire("处理完毕，已写入剪切板");
                    }
                });

            });
        }
        _init();
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function loaded() {
        // 添加civarchive.com跳转按钮
        /^\/models\/\d+\/?/.test(S_Path) && add_civarchive_button();
        // 示例详情页
        /^\/images\/\d+\/?/.test(S_Path) && add_post_detail();
        // postview
        /^\/posts\/\d+\/?/.test(S_Path) && add_btn_in_post_view();
    }

    if (["interactive", "complete"].includes(document.readyState)) {
        loaded();
    } else {
        window.addEventListener("DOMContentLoaded", loaded);
    }

})();