console.log("Cheater Background is loaded");
async function sendSelectedTextToServer(text) {
  const url = 'http://localhost:8080/push';
  const data = { text: text };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    console.log('Selected text sent successfully');
  } catch (error) {
    console.error('Failed to send selected text:', error);
  }
}

browser.browserAction.onClicked.addListener(() => {
  browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    browser.tabs.sendMessage(tabs[0].id, 'cheatSelectedText');
  });
});

browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'sendTextToServer') {
    sendSelectedTextToServer(message.text);
  }
});
