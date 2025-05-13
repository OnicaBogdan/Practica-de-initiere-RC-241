function loadNavbar() {
    fetch('../navbar/nav.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
        })
        .catch(error => {
            console.error('Eroare la încărcarea navbarului:', error);
        });
}
loadNavbar();