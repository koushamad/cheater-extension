// console.log("Cheater Background is loaded");

const apiKey = "test";
const client = "firefox";
// Define the WebSocket URL
const serverURL = "wss://cheater-server-mbmu9.ondigitalocean.app/ws";
const prompt = "solve this challenge and develop it with Golang and explain your solution in english A2 level";

// Create a WebSocket connection
var socket;

async function AskToGPT(text) {
    // Check if the WebSocket connection is open before sending the message
    if (socket.readyState === WebSocket.OPEN) {
        // Create the JSON structure
        const message = {
            apiKey: apiKey,
            client: "ios",
            type: "ask",
            content: prompt + "\n\n" + text,
        };

        // Send the JSON structure as a string
        socket.send(JSON.stringify(message));
        browser.runtime.sendMessage({action: 'log', text: 'Message sent: ' + text});
    } else {
        browser.runtime.sendMessage({action: 'log', text: 'WebSocket connection is not open'});
    }
}

async function AttachToGPT(text) {
    // Check if the WebSocket connection is open before sending the message
    if (socket.readyState === WebSocket.OPEN) {
        // Create the JSON structure
        const message = {
            apiKey: apiKey,
            client: "ios",
            type: "attach",
            content: text + "\n",
        };

        // Send the JSON structure as a string
        socket.send(JSON.stringify(message));
        browser.runtime.sendMessage({action: 'log', text: 'Message sent: ' + text});
    } else {
        browser.runtime.sendMessage({action: 'log', text: 'WebSocket connection is not open'});
    }
}

function connectToWS() {
    socket = new WebSocket(serverURL);

    socket.addEventListener('open', function (event) {
        browser.runtime.sendMessage({action: 'log', text: 'WebSocket connection established'});

        var message = {
            apiKey: apiKey,
            client: client,
            type: 'register',
            content: 'register'
        };

        setInterval(function () {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({type: 'ping'}));
            }
        }, 1000); // Send a ping message every 30 seconds

        socket.send(JSON.stringify(message));
    });

    socket.addEventListener('message', function (event) {
        let msg = JSON.parse(event.data);
        if (msg.client === client) {
            browser.runtime.sendMessage({action: 'log', text: msg});
        }
    });

    socket.addEventListener('close', function (event) {
        browser.runtime.sendMessage({action: 'log', text: 'WebSocket connection closed: '});
        browser.runtime.sendMessage({action: 'log', text: event});
        connectToWS();
    });

    socket.addEventListener('error', function (event) {
        browser.runtime.sendMessage({action: 'log', text: 'WebSocket error: '});
        browser.runtime.sendMessage({action: 'log', text: event});
    });
}

browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'AskToGPT') {
        AskToGPT(message.text);
    }
});

browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'AttachToGPT') {
        AttachToGPT(message.text);
    }
});

browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'connectToWS') {
        connectToWS();
    }
});

browser.browserAction.onClicked.addListener(() => {
    browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
        browser.tabs.sendMessage(tabs[0].id, 'cheatSelectedText');
    });
});

browser.commands.onCommand.addListener((command) => {
    if (command === "cheat-it") {
        browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, 'attachSelectedText');
        });
    }
});
