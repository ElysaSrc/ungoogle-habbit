document.addEventListener('DOMContentLoaded', async function () {
    // Load current settings
    const { settings } = await browser.storage.local.get("settings");
    if (settings) {
        document.getElementById('alternativeSearchUrl').value = settings.alternativeSearchUrl;
        document.getElementById('bypassDuration').value = settings.bypassDurationMinutes;
    }

    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(button => {
        button.addEventListener('click', function () {
            document.getElementById('alternativeSearchUrl').value = this.dataset.url;
        });
    });

    // Save settings
    document.getElementById('settingsForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const url = document.getElementById('alternativeSearchUrl').value.trim();
        const duration = parseInt(document.getElementById('bypassDuration').value);

        // Validate URL format
        if (!url.includes('{q}')) {
            alert('URL must contain {q} to indicate where the search query should go');
            return;
        }

        try {
            // Test URL validity with a sample query
            new URL(url.replace('{q}', 'test'));

            await browser.storage.local.set({
                settings: {
                    alternativeSearchUrl: url,
                    bypassDurationMinutes: duration
                }
            });

            // Show saved message
            const savedMessage = document.getElementById('savedMessage');
            savedMessage.style.display = 'block';
            setTimeout(() => {
                savedMessage.style.display = 'none';
            }, 2000);

        } catch (e) {
            alert('Please enter a valid URL');
        }
    });
});