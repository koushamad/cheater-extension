// Use 'chrome' in Chrome and 'browser' in Firefox
const storage = typeof chrome !== 'undefined' ? chrome.storage : browser.storage;

var PromptInput = document.getElementById('prompt');

// Retrieve the stored prompt when the popup is opened
storage.local.get('prompt', (result) => {
    if (result.prompt) {
        PromptInput.textContent = result.prompt;
    }
});

// Update the stored prompt whenever the input value changes
PromptInput.addEventListener('change', function() {
    var newPrompt = PromptInput.textContent;

    // Store the new prompt in the local storage
    storage.local.set({ prompt: newPrompt });
});
