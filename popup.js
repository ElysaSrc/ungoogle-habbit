function formatTimeRemaining(expiryTime) {
    const now = Date.now();
    const remaining = expiryTime - now;

    if (remaining <= 0) return "No bypass active";

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);

    return `Bypass active for ${minutes}m ${seconds}s`;
}

async function updateStatus() {
    const statusDiv = document.getElementById('status');
    const clearButton = document.getElementById('clearBypass');

    const { bypass } = await browser.storage.local.get("bypass");

    if (!bypass || bypass < Date.now()) {
        statusDiv.textContent = "No bypass active";
        clearButton.disabled = true;
    } else {
        statusDiv.textContent = formatTimeRemaining(bypass);
        clearButton.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    // Initial status update
    await updateStatus();

    // Update status every second
    setInterval(updateStatus, 1000);

    // Clear bypass button
    document.getElementById('clearBypass').addEventListener('click', async function () {
        await browser.storage.local.remove("bypass");
        await updateStatus();
    });

    // Settings link
    document.getElementById('openSettings').addEventListener('click', function (e) {
        e.preventDefault();
        browser.runtime.openOptionsPage();
    });
});
