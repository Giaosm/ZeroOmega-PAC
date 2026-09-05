// Zero Omega 黑名单模式 PAC 脚本
// 仅列表中的网站走代理，其余网站直连
// 当前为 HTTP 代理: http://127.0.0.1:7897 (混合端口)
// 如需改为 SOCKS5，将下方 PROXY 改为 SOCKS5 即可

// PROXY 即 HTTP 代理
var PROXY = "PROXY 127.0.0.1:7897; DIRECT";

// 需要走代理的国外网站关键字/域名列表（黑名单）
var proxyDomains = [
    // Google 系
    "google", "gstatic", "ggpht",
    // YouTube
    "youtu", "ytimg", "yt.be",
    // Steam / Valve
    "steam",
    "valvesoftware",
    // 代码托管
    "github", "gitlab", "bitbucket",
    // X / Twitter
    "twitter", "x.com", "twimg",
    // Meta
    "facebook", "fbcdn", "instagram", "whatsapp",
    // Telegram
    "telegram", "t.me", "tdesktop", "telegra.ph",
    // Discord / Reddit
    "discord",
    "reddit", "redd.it", "imgur",
    // 直播
    "twitch", "ttvnw",
    // Pinterest / TikTok / LinkedIn / Snapchat
    "pinterest", "pinimg",
    "tiktok",
    "linkedin", "licdn",
    "snapchat",
    // 维基 / 技术社区
    "wikimedia", "wikipedia",
    "stackoverflow", "stackexchange",
    "medium", "quora",
    "hackernews", "news.ycombinator",
    "v2ex",
    // 流媒体
    "netflix", "hulu", "spotify", "vimeo", "soundcloud",
    // Apple
    "apple", "icloud",
    // 云存储 / CDN
    "dropbox", "mega.nz", "cloudflare", "fastly", "cloudfront", "cdn77",
    // 新闻
    "nytimes", "bbc", "cnn", "wired", "theverge",
    // 包管理 / 开发工具
    "npmjs", "docker", "maven", "pypi", "nuget", "crates.io",
    "golang.org", "go.dev", "rust-lang", "rustup.rs", "pub.dev",
    // 用户脚本（油猴）
    "greasyfork",
    // AI
    "openai", "chatgpt", "anthropic", "claude",
    "gemini", "perplexity", "huggingface", "midjourney",
    // 效率办公 / 众筹
    "notion", "figma", "slack", "zoom.us", "trello", "atlassian", "patreon",
    // 学术
    "arxiv", "springer", "sciencedirect",
    // Klei（饥荒）
    "klei",
    // Epic
    "epicgames", "epic.com", "unrealengine", "easyanticheat",
    // 其他游戏平台
    "itch.io", "gog.com", "riotgames",
    // 漫画 / 插画
    "baozimh", "mangabz", "mangadex",
    "pixiv", "pximg",
    // 壁纸 / 设计 / 图床
    "wallhaven",
    "behance", "dribbble", "flickr",
    // 网盘
    "pikpak",
    // 其他需代理站点
    "91porn", "pornhub", "phncdn", "51cg", "jiuse3"
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
