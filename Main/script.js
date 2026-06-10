// Databas (array) med flygplan som används för autocompletion i sökfältet
var aircraftData = [
    { name: "Beechcraft King Air 250", image: "../image/pexels-deetalks-26618086.jpg" },
    { name: "Piper J-3 Cub", image: "../image/pexels-planespotter-geneva-1877406873-32334134.jpg" },
    { name: "Cessna 172", image: "../image/pexels-viliamphotography-32676348.jpg" }
];

// Uppdaterar navigationsmenyn om det finns en inloggad användare sparad i webbläsaren
function updateLoginNav() {
    var username = localStorage.getItem("loggedInUser");
    var loginNavBtn = document.getElementById("loginNavBtn");
    var mobileLoginBtn = document.getElementById("mobileLoginBtn");

    if (username) {
        // Om användaren är inloggad, ändra texten i desktop-menyn och lägg till klick-event för undermenyn
        if (loginNavBtn) {
            loginNavBtn.textContent = "Hi, " + username;
            loginNavBtn.href = "#";
            loginNavBtn.onclick = function(e) {
                e.preventDefault();
                toggleUserMenu();
            };
        }
        // Gör samma sak för mobilmenyn
        if (mobileLoginBtn) {
            mobileLoginBtn.textContent = "Hi, " + username;
            mobileLoginBtn.href = "#";
            mobileLoginBtn.onclick = function(e) {
                e.preventDefault();
                toggleUserMenu();
            };
        }
    }
}

// Visar eller döljer användarens personliga meny (t.ex. inställningar/logga ut)
function toggleUserMenu() {
    var userMenu = document.getElementById("userMenu");
    if (!userMenu) return;
    
    // Växlar klassen "open" för att visa/dölja menyn med CSS
    if (userMenu.classList.contains("open")) {
        userMenu.classList.remove("open");
    } else {
        userMenu.classList.add("open");
    }
}

// Loggar ut användaren genom att rensa webbläsarens lagring och ladda om sidan
function logout() {
    localStorage.removeItem("loggedInUser"); // Ta bort sparad användare
    var userMenu = document.getElementById("userMenu");
    if (userMenu) {
        userMenu.classList.remove("open"); // Stäng menyn
    }
    updateLoginNav(); // Återställ navigationsknapparna till standard
    window.location.href = "index.html"; // Skicka användaren till startsidan
}

// Stänger användarmenyn automatiskt om man klickar någonstans utanför den eller profilknappen
document.addEventListener("click", function(e) {
    var userMenu = document.getElementById("userMenu");
    var loginNavBtn = document.getElementById("loginNavBtn");
    if (userMenu && loginNavBtn && !userMenu.contains(e.target) && !loginNavBtn.contains(e.target)) {
        userMenu.classList.remove("open");
    }
});

// Hämtar aktuellt år och placerar det i footern för uppdaterad copyright-info
function updateCopyrightYear() {
    var yearElement = document.getElementById("copyrightYear");
    if (!yearElement) return;
    var currentYear = new Date().getFullYear();
    yearElement.textContent = currentYear;
}

// Kör initiala funktioner direkt när skriptet laddas
updateLoginNav();
updateCopyrightYear();

// Öppnar och stänger mobilmenyn (hamburger-menyn)
function toggleMenu() {
    var menu = document.getElementById("mobileMenu");
    var hamburger = document.getElementById("hamburger");

    if (menu.classList.contains("open")) {
        menu.classList.remove("open");
        hamburger.classList.remove("open");
    } else {
        menu.classList.add("open");
        hamburger.classList.add("open");
    }
}

// Hanterar både filtrering av flygplanskort och autocomplete-listan
function searchAircraft() {
    var searchBar = document.getElementById("searchBar");
    var autocompleteList = document.getElementById("autocompleteList");
    if (!searchBar || !autocompleteList) return;

    var input = searchBar.value.toLowerCase();
    var cards = document.querySelectorAll(".aircraft-card");
    var visibleCount = 0;

    // 1. Filtrera de befintliga flygplanskorten på sidan
    for (var i = 0; i < cards.length; i++) {
        var name = cards[i].getAttribute("data-name").toLowerCase(); 
        
        if (name.includes(input)) {
            cards[i].style.display = "block";
            visibleCount++;
        } else {
            cards[i].style.display = "none";
        }
    }

    // Visa ett meddelande om inga flygplan matchar sökningen
    var noResults = document.getElementById("noResults");
    if (noResults) { 
        if (visibleCount === 0) {
            noResults.style.display = "block";
        } else {
            noResults.style.display = "none";
        }
    }

    // Töm den gamla autocomplete-listan
    autocompleteList.innerHTML = "";

    // Om sökfältet är tomt, dölj listan helt och avsluta funktionen
    if (input.length === 0) {
        autocompleteList.style.display = "none";
        return;
    }

    // 2. Hitta matchningar i vår aircraftData-array för autocomplete
    var matches = [];
    for (var j = 0; j < aircraftData.length; j++) {
        if (aircraftData[j].name.toLowerCase().includes(input)) {
            matches.push(aircraftData[j]);
        }
    }

    // Bygg upp HTML-elementen för de matchande resultaten i autocomplete-dropwdownen
    if (matches.length > 0) {
        autocompleteList.style.display = "block";
        for (var k = 0; k < matches.length; k++) {
            var item = document.createElement("div");
            item.className = "autocomplete-item";

            // Skapa bild-element för flygplanet
            var img = document.createElement("img");
            img.src = matches[k].image;
            img.alt = matches[k].name;

            // Skapa text-element med flygplanets namn
            var text = document.createTextNode(matches[k].name);

            // Lägg till bild och text i menyvalet
            item.appendChild(img);
            item.appendChild(text);

            // Spara namnet i ett data-attribut och hantera klick på valet
            item.setAttribute("data-name", matches[k].name);
            item.onclick = function() {
                document.getElementById("searchBar").value = this.getAttribute("data-name");
                autocompleteList.style.display = "none";
                searchAircraft(); // Kör om sökningen för att filtrera korten baserat på valet
            };

            autocompleteList.appendChild(item);
        }
    } else {
        autocompleteList.style.display = "none";
    }
}

// Stänger autocomplete-listan om användaren klickar utanför sökfältet
document.addEventListener("click", function(e) {
    var wrapper = document.querySelector(".search-wrapper");
    var list = document.getElementById("autocompleteList");
    if (list && wrapper && !wrapper.contains(e.target)) {
        list.style.display = "none";
    }
});

// Öppnar modal-fönstret (popupen) med dynamisk info för det valda flygplanet
function openModal(name, price, specs, description, imageUrl, seller, location) {
    var modalOverlay = document.getElementById("modalOverlay");
    if (!modalOverlay) return;

    // Fyll i alla fält i modalen med data från det klickade flygplanet
    document.getElementById("modalImage").src = imageUrl;
    document.getElementById("modalImage").alt = name;
    document.getElementById("modalName").textContent = name;
    document.getElementById("modalPrice").textContent = price;
    document.getElementById("modalSeller").textContent = "Säljes av " + seller;
    document.getElementById("modalLocation").textContent = location;
    document.getElementById("modalSpecs").textContent = specs;
    document.getElementById("modalDesc").textContent = description;

    // Öppna modalen visuellt och lås bakgrundsscroll
    modalOverlay.classList.add("open");
    document.body.classList.add("modal-open");
}

// Stänger modal-fönstret och återställer scrollen på sidan
function closeModal() {
    var modalOverlay = document.getElementById("modalOverlay");
    if (!modalOverlay) return;

    modalOverlay.classList.remove("open");
    document.body.classList.remove("modal-open");
}

// Gör det möjligt att stänga modalen genom att trycka på Escape-knappen på tangentbordet
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});

// Växlar mellan flikarna för "Registrera" och "Logga in" i formuläret
function switchTab(tab) {
    var registerForm = document.getElementById("registerForm");
    var loginForm = document.getElementById("loginForm");
    var tabRegister = document.getElementById("tabRegister");
    var tabLogin = document.getElementById("tabLogin");

    if (tab === "register") {
        registerForm.style.display = "block";
        loginForm.style.display = "none";
        tabRegister.classList.add("active");
        tabLogin.classList.remove("active");
    } else {
        registerForm.style.display = "none";
        loginForm.style.display = "block";
        tabRegister.classList.remove("active");
        tabLogin.classList.add("active");
    }
}

// Enkel validering för att kontrollera att en e-postadress innehåller "@" och minst en punkt efteråt
function isValidEmail(email) {
    var atIndex = email.indexOf("@");
    if (atIndex === -1) return false;
    var afterAt = email.substring(atIndex);
    if (afterAt.indexOf(".") === -1) return false;
    return true;
}

// Hanterar registrering av ett nytt konto samt enklare validering
function register() {
    var email = document.getElementById("regEmail").value;
    var username = document.getElementById("regUsername").value;
    var password = document.getElementById("regPassword").value;

    // Rensa eventuella gamla felmeddelanden
    document.getElementById("regEmailError").textContent = "";
    document.getElementById("regUsernameError").textContent = "";
    document.getElementById("regPasswordError").textContent = "";
    document.getElementById("regSuccess").textContent = "";

    var valid = true;

    // Kontrollera e-postadressen
    if (!isValidEmail(email)) {
        document.getElementById("regEmailError").textContent = "Enter a valid email, e.g. you@example.com";
        valid = false;
    }

    // Kontrollera att användarnamn inte är tomt
    if (username.trim() === "") {
        document.getElementById("regUsernameError").textContent = "Please choose a username";
        valid = false;
    }

    // Kontrollera att lösenordet är tillräckligt långt
    if (password.length < 6) {
        document.getElementById("regPasswordError").textContent = "Password must be at least 6 characters";
        valid = false;
    }

    // Om allt är OK, logga in användaren lokalt och skicka vidare till index.html
    if (valid) {
        localStorage.setItem("loggedInUser", username);
        document.getElementById("regSuccess").textContent = "Account created! Welcome, " + username + ". Redirecting...";
        setTimeout(function() {
            window.location.href = "index.html";
        }, 2000);
    }
}

// Hanterar inloggning av befintlig användare samt validering
function login() {
    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;

    // Rensa gamla meddelanden
    document.getElementById("loginEmailError").textContent = "";
    document.getElementById("loginPasswordError").textContent = "";
    document.getElementById("loginSuccess").textContent = "";

    var valid = true;

    // Validera e-post
    if (!isValidEmail(email)) {
        document.getElementById("loginEmailError").textContent = "Enter a valid email, e.g. you@example.com";
        valid = false;
    }

    // Validera att fältet för lösenord inte är tomt
    if (password.trim() === "") {
        document.getElementById("loginPasswordError").textContent = "Please enter your password";
        valid = false;
    }

    // Om allt är OK, plocka ut namnet innan "@", spara som inloggad och skicka vidare
    if (valid) {
        var username = email.split("@")[0];
        localStorage.setItem("loggedInUser", username);
        document.getElementById("loginSuccess").textContent = "Logged in! Redirecting...";
        setTimeout(function() {
            window.location.href = "index.html";
        }, 2000);
    }
}

// Skickar in en ny annons och kontrollerar att alla obligatoriska fält är ifyllda
function submitListing() {
    var model = document.getElementById("sellModel").value;
    var year = document.getElementById("sellYear").value;
    var price = document.getElementById("sellPrice").value;
    var email = document.getElementById("sellEmail").value;

    // Rensa tidigare felmeddelanden
    document.getElementById("sellModelError").textContent = "";
    document.getElementById("sellYearError").textContent = "";
    document.getElementById("sellPriceError").textContent = "";
    document.getElementById("sellEmailError").textContent = "";
    document.getElementById("sellSuccess").textContent = "";

    var valid = true;

    // Fältvalideringar
    if (model.trim() === "") {
        document.getElementById("sellModelError").textContent = "Please enter the aircraft model";
        valid = false;
    }

    if (year.trim() === "") {
        document.getElementById("sellYearError").textContent = "Please enter the year";
        valid = false;
    }

    if (price.trim() === "") {
        document.getElementById("sellPriceError").textContent = "Please enter the asking price";
        valid = false;
    }

    if (!isValidEmail(email)) {
        document.getElementById("sellEmailError").textContent = "Enter a valid email, e.g. you@example.com";
        valid = false;
    }

    // Om formuläret är korrekt ifyllt, visa ett bekräftelsemeddelande och töm fälten
    if (valid) {
        document.getElementById("sellSuccess").textContent = "Your " + model + " has been listed for sale! Our team will review it within 24 hours.";
        document.getElementById("sellModel").value = "";
        document.getElementById("sellYear").value = "";
        document.getElementById("sellPrice").value = "";
        document.getElementById("sellEmail").value = "";
        document.getElementById("sellDesc").value = "";
    }
}

// Validerar och skickar meddelanden från kontaktsidan
function sendMessage() {
    var name = document.getElementById("contactName").value;
    var email = document.getElementById("contactEmail").value;
    var message = document.getElementById("contactMessage").value;

    // Rensa tidigare felmeddelanden
    document.getElementById("contactNameError").textContent = "";
    document.getElementById("contactEmailError").textContent = "";
    document.getElementById("contactMessageError").textContent = "";
    document.getElementById("contactSuccess").textContent = "";

    var valid = true;

    // Fältvalideringar
    if (name.trim() === "") {
        document.getElementById("contactNameError").textContent = "Please enter your name";
        valid = false;
    }

    if (!isValidEmail(email)) {
        document.getElementById("contactEmailError").textContent = "Enter a valid email, e.g. you@example.com";
        valid = false;
    }

    if (message.trim() === "") {
        document.getElementById("contactMessageError").textContent = "Please write a message";
        valid = false;
    }

    // Om allt är ifyllt korrekt, visa bekräftelse och töm kontaktformuläret
    if (valid) {
        document.getElementById("contactSuccess").textContent = "Message sent! We'll get back to you shortly.";
        document.getElementById("contactName").value = "";
        document.getElementById("contactEmail").value = "";
        document.getElementById("contactMessage").value = "";
    }
}