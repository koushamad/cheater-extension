console.log("Cheater Background is loaded");

const apiKey = "test";
const client = "firefox";
// Define the WebSocket URL
const serverURL = "wss://cheater-server-mbmu9.ondigitalocean.app/ws";
// const serverURL = "ws://localhost:8080/ws";

// Create a WebSocket connection
var socket;

async function sendTextToWS(text) {
    // Check if the WebSocket connection is open before sending the message
    if (socket.readyState === WebSocket.OPEN) {
        // Create the JSON structure
        const message = {
            apiKey: apiKey,
            client: "mac",
            content: text,
        };

        // Send the JSON structure as a string
        socket.send(JSON.stringify(message));
        browser.runtime.sendMessage({ action: 'log', text: 'Message sent: ' + text});
    } else {
        browser.runtime.sendMessage({ action: 'log', text: 'WebSocket connection is not open'});
    }
}


function connectToWS() {
    socket = new WebSocket(serverURL);

    socket.addEventListener('open', function(event) {
        browser.runtime.sendMessage({ action: 'log', text: 'WebSocket connection established'});

        var message = {
            apiKey: apiKey,
            client: client,
            content: 'register'
        };

        socket.send(JSON.stringify(message));
    });

    socket.addEventListener('message', function(event) {
        browser.runtime.sendMessage({ action: 'log', text: 'WebSocket message received: '});
        browser.runtime.sendMessage({ action: 'log', text: event});

        let msg = JSON.parse(event.data);
        if (msg.client === client) {
            browser.runtime.sendMessage({ action: 'log', text: msg});
        }
    });

    socket.addEventListener('close', function(event) {
        browser.runtime.sendMessage({ action: 'log', text: 'WebSocket connection closed: '});
        browser.runtime.sendMessage({ action: 'log', text: event});
        connectToWS();
    });

    socket.addEventListener('error', function(event) {
        browser.runtime.sendMessage({ action: 'log', text: 'WebSocket error: '});
        browser.runtime.sendMessage({ action: 'log', text: event});
    });
}

browser.browserAction.onClicked.addListener(() => {
    browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
        browser.tabs.sendMessage(tabs[0].id, 'cheatSelectedText');
    });
});

browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'sendTextToServer') {
        sendTextToWS(message.text);
    }
});

browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'connectToWS') {
        connectToWS();
    }
});
