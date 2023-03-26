console.log("Cheater Content is loaded");

function getSelectedText() {
    return window.getSelection().toString();
}

function readAllText() {
    var elements = document.querySelectorAll('*');

    var allText = '';

    var blacklist = ['SCRIPT', 'STYLE', 'HEADER', 'FOOTER', 'INPUT', 'BUTTON', 'LINK'];

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

        browser.runtime.sendMessage({ action: 'sendTextToServer', text: text });
    }
});