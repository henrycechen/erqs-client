window.onload = function () {
    element('btn-login').onclick = function () {
        login();
    };

    document.addEventListener('keydown', function (event) {
        if (event.keyCode === 13) {
            login();
        }
    });

};

function login() {
    window.location = `http://localhost:8082/dashboard?username=${element('input-id').value}&password=${element('input-password').value}`;
}