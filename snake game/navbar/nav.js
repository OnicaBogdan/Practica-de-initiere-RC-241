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
            const style = document.createElement('link');
            style.rel = 'stylesheet';
            style.href = '../navbar/nav.css';
            document.head.appendChild(style);
            
            const logoutButton = document.querySelector('.logout-button');
            if (logoutButton) {
                logoutButton.addEventListener('click', () => {
                    window.location.href = '../login/login.html'; 
                });
            }
        })
        .catch(error => {
            console.error('Eroare la încărcarea navbarului:', error);
        });
}

loadNavbar();