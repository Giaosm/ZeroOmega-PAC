// Zero Omega 黑名单模式 PAC 脚本
// 仅列表中的网站走代理，其余网站直连
// 当前为 HTTP 代理: http://127.0.0.1:7897 (混合端口)
// 如需改为 SOCKS5，将下方 PROXY 改为 SOCKS5 即可

// PROXY 即 HTTP 代理
var PROXY = "PROXY 127.0.0.1:7897; DIRECT";

// 需要走代理的国外网站关键字/域名列表（黑名单）
var proxyDomains = [
    "google", "googleapis", "googleusercontent", "gstatic", "ggpht",
    "youtube", "youtu", "ytimg", "googlevideo", "yt.be",
    "steampowered", "steamcommunity", "steamstatic", "steamcdn",
    "steamserver", "steamusercontent", "valvesoftware",
    "github", "githubusercontent", "githubassets", "gitlab", "bitbucket",
    "twitter", "x.com", "twimg", "facebook", "fbcdn", "instagram", "whatsapp",
    "telegram", "t.me", "tdesktop", "telegra.ph",
    "discord", "discordapp", "reddit", "redd.it", "imgur",
    "twitch", "ttvnw", "pinterest", "pinimg", "tiktok", "tiktokcdn",
    "linkedin", "licdn", "snapchat",
    "wikimedia", "wikipedia", "stackoverflow", "stackexchange",
    "medium", "quora", "netflix", "hulu", "spotify",
    "apple", "icloud", "dropbox", "mega.nz", "cloudflare", "fastly", "cloudfront",
    "v2ex", "nytimes", "bbc", "cnn", "wired", "theverge",
    "hackernews", "news.ycombinator",
    "npmjs", "docker", "maven", "pypi", "pypi.org", "nuget", "crates.io",
    "golang.org", "rust-lang",
    "openai", "chatgpt", "anthropic", "claude.ai", "claude", "gemini", "perplexity",
    "notion", "figma", "slack", "zoom.us", "huggingface",
    "arxiv", "springer", "sciencedirect", "klei",
    "epicgames", "epic.com", "epicgames.com", "epicgames.dev", "epicgames.net",
    "unrealengine", "easyanticheat",
    "baozimh", "mangabz", "pixiv", "pikpak",
    "91porn", "pornhub", "phncdn", "51cg", "jiuse3", "cdn77", "greasyfork"
];

// 需要直连的例外域名（即使包含以上关键字，也保持直连）
var directDomains = [
    // 示例：国内镜像站
    "cn.bing.com",
    "www.google.cn",
    "npm.taobao.org",
    "registry.npmmirror.com",
    "mirrors.aliyun.com"
];

function FindProxyForURL(url, host) {
    host = host.toLowerCase();

    // 本地地址直连
    if (isPlainHostName(host) ||
        isInNet(dnsResolve(host), "10.0.0.0", "255.0.0.0") ||
        isInNet(dnsResolve(host), "172.16.0.0", "255.240.0.0") ||
        isInNet(dnsResolve(host), "192.168.0.0", "255.255.0.0") ||
        isInNet(dnsResolve(host), "127.0.0.0", "255.255.255.0")) {
        return "DIRECT";
    }

    // 例外：直连的域名优先判断
    for (var i = 0; i < directDomains.length; i++) {
        if (host === directDomains[i] || host.endsWith("." + directDomains[i])) {
            return "DIRECT";
        }
    }

    // 黑名单：命中关键字则走代理
    for (var j = 0; j < proxyDomains.length; j++) {
        if (host.indexOf(proxyDomains[j]) !== -1) {
            return PROXY;
        }
    }

    // 其余直连
    return "DIRECT";
}
