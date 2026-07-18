// ==UserScript==
// @name         civitai_tools
// @version      0.1.12
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

    /**
     * 基于 Windows 格式化规则的时间格式化函数
     * 支持：yyyy, yy, MMMM, MMM, MM, M, dddd, ddd, dd, d, HH, H, hh, h, mm, m, ss, s, tt
     * 
     * @param {Date|string} date - 日期对象或日期字符串
     * @param {string} format - 格式字符串，如 'yyyy-MM-dd HH:mm:ss'
     * @returns {string} 格式化后的时间字符串
     */
    function dateFmt(date, format = 'yyyy-MM-dd HH:mm:ss') {
        let d = new Date();
        if (date) {
            d = new Date(date);
        }
        // 检查日期是否有效
        if (isNaN(d.getTime())) {
            throw new Error('Invalid date');
        }
        const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'];
        const monthNamesShort = ['1月', '2月', '3月', '4月', '5月', '6月',
            '7月', '8月', '9月', '10月', '11月', '12月'];
        const dayNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const dayNamesShort = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

        // 获取时间各部分
        const year = d.getFullYear();
        const month = d.getMonth(); // 0-11
        const day = d.getDate();
        const hours = d.getHours();
        const minutes = d.getMinutes();
        const seconds = d.getSeconds();
        const dayOfWeek = d.getDay(); // 0-6

        // 判断上午/下午
        const ampm = hours >= 12 ? '下午' : '上午';
        const hours12 = hours % 12 || 12; // 12小时制的小时

        // 定义替换规则（按长度从长到短排序，避免覆盖）
        const rules = [
            // 年份
            { pattern: 'yyyy', value: String(year).padStart(4, '0') },
            { pattern: 'yy', value: String(year).slice(-2) },

            // 月份（优先匹配长格式）
            { pattern: 'MMMM', value: monthNames[month] },
            { pattern: 'MMM', value: monthNamesShort[month] },
            { pattern: 'MM', value: String(month + 1).padStart(2, '0') },
            { pattern: 'M', value: String(month + 1) },

            // 日期
            { pattern: 'dddd', value: dayNames[dayOfWeek] },
            { pattern: 'ddd', value: dayNamesShort[dayOfWeek] },
            { pattern: 'dd', value: String(day).padStart(2, '0') },
            { pattern: 'd', value: String(day) },

            // 小时（24小时制）
            { pattern: 'HH', value: String(hours).padStart(2, '0') },
            { pattern: 'H', value: String(hours) },

            // 小时（12小时制）
            { pattern: 'hh', value: String(hours12).padStart(2, '0') },
            { pattern: 'h', value: String(hours12) },

            // 分钟
            { pattern: 'mm', value: String(minutes).padStart(2, '0') },
            { pattern: 'm', value: String(minutes) },

            // 秒
            { pattern: 'ss', value: String(seconds).padStart(2, '0') },
            { pattern: 's', value: String(seconds) },

            // 上午/下午标识
            { pattern: 'tt', value: ampm },
        ];

        // 执行替换
        let result = format;
        for (const rule of rules) {
            // 使用正则表达式全局替换，注意特殊字符转义
            const regex = new RegExp(rule.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            result = result.replace(regex, rule.value);
        }

        return result;
    }

    function getExtByFileName(filename) {
        filename = filename || "";
        const fsp = filename.split(".");
        if (fsp.length > 1) {
            return fsp[fsp.length - 1];
        }
        return "png";
    }

    function getExtByMimeType(mimeType) {
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
        } catch {
            Swal.fire({ title: "复制失败", icon: "error" });
            return false;
        }
    }

    async function getHtml(url) {
        try {
            const response = await fetch(url, {
                method: 'GET', headers: {
                    'Content-Type': 'text/html',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36'
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

    function s2b64(text) {
        const utf8Bytes = new TextEncoder().encode(text);
        const base64Content = btoa(String.fromCharCode(...utf8Bytes));
        return base64Content;
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
                copyBtn.addEventListener("click", () => {
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

    function add_btn_in_post_view() {
        const _getViewData = () => {
            return [...document.querySelectorAll(`a.mantine-focus-auto.mantine-Text-root.mantine-Anchor-root`)]
                .filter(x => /\/images\/\d+/i.test(x.href))
                .map(x => {
                    const img = x.querySelector("img");
                    let src = img.src;
                    //src = src.replace("original=true", "original=false");
                    //let ext = getExtByFileName(img.alt);
                    let ext = getExtByFileName(src);
                    //src = /\/\w+\/([\w-]+)\//i.exec(src)[1];
                    //src = `https://image-b2.civitai.com/file/civitai-media-cache/${src}`;
                    return { href: x.href, src, ext };
                });
        };
        const _getMarkdown1 = (html, name, index, ext) => {
            let resText = "";
            const pattern = '(<div class="(?:flex|flex-col|gap-3|rounded-xl|m_\\w+|mantine-Card-root|m_\\w+|mantine-Paper-root| ){10,}">' +
                '\\s*?<div class="(?:flex|items-center|gap-3| ){5,}">[\\s\\S]+?<span>Generation data<\\/span>[\\s\\S]+?<\\/div>)\\s*?' +
                '<div class="(?:flex|flex-col|gap-3|rounded-xl|m_\\w+|mantine-Card-root|m_\\w+|mantine-Paper-root| ){10,}">';
            const regex = new RegExp(pattern);
            html = regex.exec(html)[1];
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const mainNode = doc.body.firstChild;
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
                    if (resNode) {
                        resText = "\n\n***\n\n![img](" + name + "-" + index + "." + ext + ")\n";
                        resText += "\n> **Resources used**\n> ";
                        resNode.querySelectorAll("li").forEach(x => {
                            const a = x.querySelector("a");
                            const link = a != null ? a.getAttribute("href") : "";
                            const modelName = x.querySelector("div>a")?.innerText || "";
                            const modelType = x.querySelector("div>div")?.innerText || "";
                            const modelVer = Array.from(x.children).find(x => x.tagName == "A")?.innerText || "";
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
                }
            }
            return resText;
        };
        const _getMarkdown2 = (html, name, index, ext) => {
            let resText = "";
            const mc = html.match(/<script\s+id="__NEXT_DATA__"\s+type="application\/json">([\s\S]*?)<\/script>/);
            const jo = JSON.parse(mc[1].trim());
            const queries = jo["props"]["pageProps"]["trpcState"]["json"]["queries"];
            const genData = queries.find(x => x["queryKey"] && x["queryKey"][0].join("-") == "image-getGenerationData");
            if (genData && genData["state"] && genData["state"]["data"]) {
                const data = genData["state"]["data"];
                const meta = data["meta"];
                const resources = data["resources"];
                resText = "\n\n***\n\n![img](" + name + "-" + index + "." + ext + ")\n";
                resText += "\n> **Resources used**\n>";
                if (resources && Array.isArray(resources)) {
                    resources.forEach(x => {
                        const modelId = x["modelId"] || "";
                        const modelName = x["modelName"] || "";
                        const modelType = x["modelType"] || "";
                        const versionName = x["versionName"] || "";
                        resText += `\n> > [${modelName}](https://civitai.red/models/${modelId}) **\`\`${modelType}\`\`**`;
                        if (versionName) {
                            resText += `\n> > *${versionName}*`;
                        }
                    });
                }
                if (meta) {
                    let prompt = meta["prompt"] || "";
                    if (prompt) {
                        resText += `\n> \n> **Prompt**\n> \n> > ${prompt}`;
                    }
                    let negative = meta["negativePrompt"] || "";
                    if (negative) {
                        negative = negative.replace(/([^\\])([\\[<>\\(\\)\]])/g, "$1\\$2");
                        resText += `\n> \n> **Negative prompt**\n> \n> > ${negative}`;
                    }
                    resText += "\n> \n> **Other metadata**\n> \n> >";
                    resText += ` \`\`steps:${(meta["steps"] || "")}\`\``;
                    resText += ` \`\`cfgScale:${(meta["cfgScale"] || "")}\`\``;
                    resText += ` \`\`sampler:${(meta["sampler"] || "")}\`\``;
                    resText += ` \`\`scheduler:${(meta["scheduler"] || "")}\`\``;
                    resText += ` \`\`denoise:${(meta["denoise"] || "")}\`\``;
                    resText += ` \`\`seed:${(meta["seed"] || "")}\`\``;
                    resText += ` \`\`width:${(meta["width"] || "")}\`\``;
                    resText += ` \`\`height:${(meta["height"] || "")}\`\``;
                }
            }
            return resText;
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
                        ret = _getMarkdown1(html, name, index, item.ext);
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
                const defaultName = dateFmt(null, "yyyyMMddHHmmss");
                Swal.fire({
                    title: "文件名和目录",
                    html: `
                    <input type="text" id="swal2_input_name" class="swal2-input" value="${defaultName}">
                    <input type="text" id="swal2_input_dir" class="swal2-input">
                    `,
                    showCancelButton: true,
                    confirmButtonText: "确定",
                    showLoaderOnConfirm: true,
                    preConfirm: async () => {
                        let inputName = document.getElementById("swal2_input_name").value;
                        let inputDir = document.getElementById("swal2_input_dir").value;
                        if (inputName && inputDir) {
                            inputDir = inputDir.replace(/\\/g, "/").trim().trimEnd("/");
                            inputDir = inputDir + "/" + inputName;
                            try {
                                let markdown = "";
                                let aria2 = "";
                                const viewData = _getViewData();
                                for (const [index, item] of viewData.entries()) {
                                    aria2 += ` aria2c -m 3 --retry-wait 3 -c "${item.src}" -o ${inputName}-${index}.${item.ext};`;
                                    const txt = await _getDetail(inputName, item, index);
                                    markdown += txt;
                                }

                                const mdFile = `${inputDir}/${inputName}.md`;
                                const b64Content = s2b64(markdown);

                                // 生成 PowerShell 命令
                                let psCmd = `$dir="${inputDir}"; if(!(Test-Path $dir)){New-Item $dir -ItemType Directory}; cd $dir;`;
                                psCmd += ` $bytes=[Convert]::FromBase64String('${b64Content}'); [System.IO.File]::WriteAllBytes('${mdFile}', $bytes);`;
                                psCmd += aria2;

                                writeClipboardText(psCmd);

                            } catch (err) {
                                Swal.showValidationMessage(`Request failed: ${err}`);
                            }
                        }
                    },
                    allowOutsideClick: () => !Swal.isLoading()
                }).then((r) => {
                    if (r.isConfirmed) {
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