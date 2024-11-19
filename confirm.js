async function getSettings() {
    return (await browser.storage.local.get()).settings;
}

document.addEventListener('DOMContentLoaded', function () {
    // Get the original Google URL from the query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const googleUrl = urlParams.get('url');

    const searchQuery = getSearchQuery(googleUrl);

    document.getElementById('proceed').addEventListener('click', async function () {
        // Get the settings
        const settings = await getSettings();
        console.log(settings);

        await browser.storage.local.set({
            bypass: Date.now() + (settings.bypassDurationMinutes * 60 * 1000),
            settings: settings
        });
        // Proceed to Google
        window.location.href = googleUrl;
    });

    document.getElementById('alternative').addEventListener('click', async function () {
        const encodedSearch = encodeURIComponent(searchQuery);
        const settings = await getSettings();
        const finalUrl = settings.alternativeSearchUrl.replace("{q}", encodedSearch);
        window.location.href = finalUrl;
    });
});

function getSearchQuery(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.searchParams.get('q') || '';
    } catch (e) {
        return '';
    }
}
