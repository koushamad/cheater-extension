var isConnect = false;
var ApiKey = "";

document.addEventListener('DOMContentLoaded', function() {
    var connectSwitch = document.getElementById('connect-switch');
    var apiKeyInput = document.getElementById('apiKey');


    apiKeyInput.addEventListener('change', function() {
        ApiKey = apiKeyInput.value;
    });

    connectSwitch.addEventListener('change', function() {
        if (this.checked) {
            var apiKey = apiKeyInput.value;
            connectToWS(apiKey);
            isConnect = true;
        } else {
            socket.close();
            isConnect = false;
        }
    });

    connectSwitch.value = isConnect;
    apiKeyInput.value = ApiKey;
});