console.log("Cheater Background is loaded");

const apiKey = "test";
// Define the WebSocket URL
const serverURL = "wss://cheater-server-mbmu9.ondigitalocean.app/ws";

// Create a WebSocket connection
const socket = new WebSocket(serverURL);

async function sendTextToWS(text) {
    // Connection opened
    socket.addEventListener("open", (event) => {
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
        } else {
            setTimeout(() => {
                connectToWS();
                sendTextToWS(text);
            }, 1000);
        }
    });
}


async function connectToWS() {
// Connection opened
    socket.addEventListener("open", (event) => {
        // JSON content to be sent
        const message = {
            apiKey: apiKey,
            client: "firefox",
            content: "register",
        };

        // Send the JSON content as a string
        socket.send(JSON.stringify(message));
    });
}

// Connection closed
socket.addEventListener("close", (event) => {
    connectToWS();
    console.log("WebSocket connection closed:", event);
});

// Connection error
socket.addEventListener("error", (event) => {
    connectToWS();
    console.log("WebSocket connection closed:", event);
});

browser.browserAction.onClicked.addListener(() => {
    browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
        browser.tabs.sendMessage(tabs[0].id, 'cheatSelectedText');
    });
});

browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'sendTextToServer') {
        sendSelectedTextToServer(message.text);
    }
});

connectToWS();