function loadNavBar() {
    fetch('../nav-bar/nav.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
        });
}
loadNavBar();

function logout() {
    window.location.href = "../login/login.html";
}