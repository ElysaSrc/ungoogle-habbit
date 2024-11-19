async function initializeSettings() {
    await browser.storage.local.clear();
    const { settings } = await browser.storage.local.get("settings");
    if (!settings) {
        await browser.storage.local.set({
            bypass: null,
            settings: {
                alternativeSearchUrl: "https://duckduckgo.com/?q={q}",
                bypassDurationMinutes: 5
            }
        });
    }
}

async function checkBypass() {
    const { bypass } = await browser.storage.local.get("bypass");
    if (bypass) {
        return bypass > Date.now();
    }
    return false;
}

initializeSettings();

browser.webRequest.onBeforeRequest.addListener(
    async function (details) {
        // Check if this is a Google search domain
        if (details.url.match(/^https?:\/\/(?:www\.)?google\.[a-z.]{2,}/i)) {

            // Bypassing
            const bypassActive = await checkBypass();
            if (bypassActive) {
                return { cancel: false };
            }

            return {
                redirectUrl: browser.runtime.getURL("confirm.html") + "?url=" + encodeURIComponent(details.url)
            };
        }
        return { cancel: false };
    },
    {
        urls: [
            "*://*.google.com/*",
            "*://*.google.co.uk/*",
            "*://*.google.ca/*",
            "*://*.google.fr/*",
            "*://*.google.de/*",
            "*://*.google.es/*",
            "*://*.google.it/*",
            "*://*.google.nl/*",
            "*://*.google.ru/*",
            "*://*.google.co.in/*",
            "*://*.google.co.jp/*",
            "*://*.google.cn/*",
            "*://*.google.com.au/*",
            "*://*.google.com.br/*",
            "*://*.google.com.ar/*",
            "*://*.google.com.mx/*",
            "*://*.google.com.sg/*",
            "*://*.google.com.hk/*",
            "*://*.google.com.tw/*",
            "*://*.google.com.vn/*",
            "*://*.google.com.my/*",
            "*://*.google.co.za/*",
            "*://*.google.co.kr/*",
            "*://*.google.co.id/*",
            "*://*.google.com.tr/*",
            "*://*.google.com.eg/*",
            "*://*.google.com.sa/*",
            "*://*.google.com.pk/*",
            "*://*.google.gr/*",
            "*://*.google.se/*",
            "*://*.google.no/*",
            "*://*.google.dk/*",
            "*://*.google.fi/*",
            "*://*.google.pt/*",
            "*://*.google.ie/*",
            "*://*.google.pl/*",
            "*://*.google.hu/*",
            "*://*.google.sk/*",
            "*://*.google.cz/*",
            "*://*.google.at/*",
            "*://*.google.be/*",
            "*://*.google.ch/*",
            "*://*.google.nz/*",
            "*://*.google.cl/*",
            "*://*.google.co.th/*",
            "*://*.google.lk/*",
            "*://*.google.co.ke/*",
            "*://*.google.co.ug/*",
            "*://*.google.co.tz/*",
            "*://*.google.com.ph/*",
            "*://*.google.co.zw/*"
        ]
    },
    ["blocking"]
);
