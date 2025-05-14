document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const phoneNumber = document.getElementById("phoneNumber").value.trim();
    const errorMessage = document.getElementById("error-message");

    if (!/^[A-Z][a-z]*$/.test(firstName)) {
        errorMessage.textContent = "Prenumele trebuie să înceapă cu literă mare.";
        return;
    }

    if (!/^[A-Z][a-z]*$/.test(lastName)) {
        errorMessage.textContent = "Numele trebuie să înceapă cu literă mare.";
        return;
    }

    if (!/^[67]\d{7}$/.test(phoneNumber)) {
        errorMessage.textContent = "Numărul de telefon trebuie să aibă 8 cifre și să înceapă cu 6 sau 7.";
        return;
    }

    errorMessage.textContent = "";
    alert("Formular trimis cu succes!");
});