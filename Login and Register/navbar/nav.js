// Funcție pentru încărcarea NavBar DOAR pe pagina main.html
function loadNavBar() {
    // Obținem numele paginii curente
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage !== "main.html") {
        console.log("NavBar nu este încărcat deoarece nu suntem pe main.html");
        return;
    }

    // Calea către nav.html
    const pathToNav = "../nav-bar/nav.html";

    fetch(pathToNav)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const container = document.createElement('div');
            container.innerHTML = data;
            document.body.insertAdjacentElement('afterbegin', container); // Adăugăm NavBar la începutul body
        })
        .catch(error => {
            console.error('Eroare la încărcarea NavBar:', error);
        });
}

// Funcția de Logout
function logout() {
    window.location.href = "../login/login.html";
}

// Încarcă NavBar-ul doar când DOM-ul este gata
document.addEventListener("DOMContentLoaded", loadNavBar);