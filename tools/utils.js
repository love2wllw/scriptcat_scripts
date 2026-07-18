/**
 * 基于 Windows 格式化规则的时间格式化函数
 * 支持：yyyy, yy, MMMM, MMM, MM, M, dddd, ddd, dd, d, HH, H, hh, h, mm, m, ss, s, tt
 * 
 * @param {Date|string} date - 日期对象或日期字符串
 * @param {string} format - 格式字符串，如 'yyyy-MM-dd HH:mm:ss'
 * @returns {string} 格式化后的时间字符串
 */
const dateFmt = (date, format = 'yyyy-MM-dd HH:mm:ss') => {
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

const getImageExtByMimeType = (mimeType) => {
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

const strToBase64 = (text) => {
    const utf8Bytes = new TextEncoder().encode(text);
    const base64Content = btoa(String.fromCharCode(...utf8Bytes));
    return base64Content;
}

export default {
    dateFmt,
    getImageExtByMimeType,
    strToBase64
}