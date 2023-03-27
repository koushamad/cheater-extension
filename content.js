console.log("Cheater Content is loaded");

function getSelectedText() {
    let selection = window.getSelection().toString();
    return selection;
}

function readAllText() {
    var elements = document.querySelectorAll('body');

    var allText = '';

    var blacklist = ['SCRIPT', 'STYLE', 'HEADER', 'FOOTER'];

    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];

        console.log(element.tagName)

        if (blacklist.indexOf(element.tagName) !== -1) {
            element.removeChild(element);
        } else {
            var text = element.textContent.trim();

            allText += element.tagName + text + ' ';
        }
    }

    return allText.trim();
}

browser.runtime.onMessage.addListener((message) => {
    if (message === 'cheatSelectedText') {
        let text = getSelectedText();

        if (!text) {
            text = readAllText();
        }
        console.log('send text to server: ' + text);
        browser.runtime.sendMessage({ action: 'sendTextToServer', text: text });
    }
});

browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'log') {
        let text = message.text;

        console.log('Log: ' + text);
    }
});

setTimeout(() => {
    console.log('connect To WS')
    browser.runtime.sendMessage({ action: 'connectToWS' });
} , 500);