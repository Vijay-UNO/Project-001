document.addEventListener("DOMContentLoaded", async () => {
    const searchBtn = document.getElementById("searchBtn");
    const productInput = document.getElementById("searchInput");
    const amazonTab = document.getElementById("amazonTab");
    const youtubeTab = document.getElementById("youtubeTab");
    const gptTab = document.getElementById("gptTab");
    const amazonContent = document.getElementById("amazonContent");
    const youtubeContent = document.getElementById("youtubeContent");
    const gptTabContent = document.getElementById("gptContent");

    function switchTab(tab) {
        amazonContent.style.display = tab === "amazon" ? "block" : "none";
        youtubeContent.style.display = tab === "youtube" ? "block" : "none";
        gptTabContent.style.display = tab === "gpt" ? "block" : "none";
    }

    amazonTab.addEventListener("click", () => switchTab("amazon"));
    youtubeTab.addEventListener("click", () => switchTab("youtube"));
    gptTab.addEventListener("click", () => switchTab("gpt"));

    searchBtn.addEventListener("click", async () => {
        chrome.storage.local.get("bytebuddyEnabled", async (data) => {
            if (!data.bytebuddyEnabled) {
                alert("⚠️ ByteBuddy is OFF. Press Ctrl+Q to toggle it ON.");
                return;
            }

            const productName = productInput.value.trim();
            if (!productName) return alert("Enter a product name!");

            gptTabContent.innerHTML = "<p>Loading ChatGPT suggestions...</p>";
            amazonContent.innerHTML = "<p>Loading Amazon data...</p>";
            youtubeContent.innerHTML = "<p>Loading YouTube data...</p>";

            try {
                const [priceData, youtubeData, gptSuggestion] = await Promise.all([
                    fetchPriceComparison(productName),
                    fetchTechProduct(productName),
                    fetchChatGPTSuggestion(productName)
                ]);

                displayResults(priceData, youtubeData);
                gptTabContent.innerHTML = `<p>${gptSuggestion}</p>`;
            } catch (error) {
                console.error(error);
                gptTabContent.innerHTML = "<p>Error loading ChatGPT suggestions.</p>";
                amazonContent.innerHTML = "<p>Error fetching Amazon data.</p>";
                youtubeContent.innerHTML = "<p>Error fetching YouTube data.</p>";
            }
        });
    });

    const fabBtn = document.getElementById("openAssistant");
    const assistantPopup = document.getElementById("assistant-popup");

    fabBtn?.addEventListener("click", () => {
        assistantPopup?.classList.toggle("hidden");
    });

    document.getElementById("runAssistant")?.addEventListener("click", async () => {
        const query = document.getElementById("assistantInput").value.trim();
        const assistantResult = document.getElementById("assistantResult");

        if (!query) {
            assistantResult.innerHTML = "<p>❗ Please enter a question.</p>";
            return;
        }

        assistantResult.innerHTML = "🤖 Thinking...";

        try {
            const pageText = document.body.innerText.slice(0, 4000);
            const prompt = `User asked: "${query}". Use this page context to help:\n\n${pageText}`;

            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "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"
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt }]
                })
            });

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;
            assistantResult.innerHTML = content ? `<p>${content}</p>` : "❌ No response found.";
        } catch (error) {
            console.error("Assistant Error:", error);
            assistantResult.innerHTML = "<p>❌ Error while fetching summary or search.</p>";
        }
    });
});

// Existing functions (unchanged below this point)
