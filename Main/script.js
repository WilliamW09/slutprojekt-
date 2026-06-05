// Databas (array) med flygplan som används för autocompletion i sökfältet
var aircraftData = [
    { name: "Beechcraft King Air", image: "../image/pexels-deetalks-26618086.jpg" },
    { name: "Piper J-3 Cub", image: "../image/pexels-planespotter-geneva-1877406873-32334134.jpg" },
    { name: "Cessna 152", image: "../image/pexels-viliamphotography-32676348.jpg" }
];

// Uppdaterar navigationsmenyn om det finns en inloggad användare sparad i webbläsaren
function updateLoginNav() {
    var username = localStorage.getItem("loggedInUser");
    var loginNavBtn = document.getElementById("loginNavBtn");
    var mobileLoginBtn = document.getElementById("mobileLoginBtn");

    if (username) {
        if (loginNavBtn) {
            loginNavBtn.textContent = "Hi, " + username;
            loginNavBtn.href = "#";
            loginNavBtn.onclick = function(e) {
                e.preventDefault();
                toggleUserMenu();
            };
        }
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

function toggleUserMenu() {
    var userMenu = document.getElementById("userMenu");
    if (!userMenu) return;
    
    if (userMenu.classList.contains("open")) {
        userMenu.classList.remove("open");
    } else {
        userMenu.classList.add("open");
    }
}

function logout() {
    localStorage.removeItem("loggedInUser");
    var userMenu = document.getElementById("userMenu");
    if (userMenu) {
        userMenu.classList.remove("open");
    }
    updateLoginNav();
    window.location.href = "index.html";
}

document.addEventListener("click", function(e) {
    var userMenu = document.getElementById("userMenu");
    var loginNavBtn = document.getElementById("loginNavBtn");
    if (userMenu && loginNavBtn && !userMenu.contains(e.target) && !loginNavBtn.contains(e.target)) {
        userMenu.classList.remove("open");
    }
});

function updateCopyrightYear() {
    var yearElement = document.getElementById("copyrightYear");
    if (!yearElement) return;
    var currentYear = new Date().getFullYear();
    yearElement.textContent = currentYear;
}

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

    var noResults = document.getElementById("noResults");
    if (noResults) { 
        if (visibleCount === 0) {
            noResults.style.display = "block";
        } else {
            noResults.style.display = "none";
        }
    }

    autocompleteList.innerHTML = "";

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

    if (matches.length > 0) {
        autocompleteList.style.display = "block";
        for (var k = 0; k < matches.length; k++) {
            var item = document.createElement("div");
            item.className = "autocomplete-item";

            var img = document.createElement("img");
            img.src = matches[k].image;
            img.alt = matches[k].name;

            var text = document.createTextNode(matches[k].name);

            item.appendChild(img);
            item.appendChild(text);

            item.setAttribute("data-name", matches[k].name);
            item.onclick = function() {
                document.getElementById("searchBar").value = this.getAttribute("data-name");
                autocompleteList.style.display = "none";
                searchAircraft();
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

// Öppnar modal-fönstret (popupen) med dynamisk info
function openModal(name, price, specs, description, imageUrl, seller, location) {
    var modalOverlay = document.getElementById("modalOverlay");
    if (!modalOverlay) return;

    document.getElementById("modalImage").src = imageUrl;
    document.getElementById("modalImage").alt = name;
    document.getElementById("modalName").textContent = name;
    document.getElementById("modalPrice").textContent = price;
    document.getElementById("modalSeller").textContent = "Säljes av " + seller;
    document.getElementById("modalLocation").textContent = location;
    document.getElementById("modalSpecs").textContent = specs;
    document.getElementById("modalDesc").textContent = description;

    modalOverlay.classList.add("open");
    document.body.classList.add("modal-open");
}

function closeModal() {
    var modalOverlay = document.getElementById("modalOverlay");
    if (!modalOverlay) return;

    modalOverlay.classList.remove("open");
    document.body.classList.remove("modal-open");
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeModal();
    }
});

// Växlar mellan flikarna för "Registrera" och "Logga in"
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

function isValidEmail(email) {
    var atIndex = email.indexOf("@");
    if (atIndex === -1) return false;
    var afterAt = email.substring(atIndex);
    if (afterAt.indexOf(".") === -1) return false;
    return true;
}

function register() {
    var email = document.getElementById("regEmail").value;
    var username = document.getElementById("regUsername").value;
    var password = document.getElementById("regPassword").value;

    document.getElementById("regEmailError").textContent = "";
    document.getElementById("regUsernameError").textContent = "";
    document.getElementById("regPasswordError").textContent = "";
    document.getElementById("regSuccess").textContent = "";

    var valid = true;

    if (!isValidEmail(email)) {
        document.getElementById("regEmailError").textContent = "Enter a valid email, e.g. you@example.com";
        valid = false;
    }

    if (username.trim() === "") {
        document.getElementById("regUsernameError").textContent = "Please choose a username";
        valid = false;
    }

    if (password.length < 6) {
        document.getElementById("regPasswordError").textContent = "Password must be at least 6 characters";
        valid = false;
    }

    if (valid) {
        localStorage.setItem("loggedInUser", username);
        document.getElementById("regSuccess").textContent = "Account created! Welcome, " + username + ". Redirecting...";
        setTimeout(function() {
            window.location.href = "index.html";
        }, 2000);
    }
}

function login() {
    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;

    document.getElementById("loginEmailError").textContent = "";
    document.getElementById("loginPasswordError").textContent = "";
    document.getElementById("loginSuccess").textContent = "";

    var valid = true;

    if (!isValidEmail(email)) {
        document.getElementById("loginEmailError").textContent = "Enter a valid email, e.g. you@example.com";
        valid = false;
    }

    if (password.trim() === "") {
        document.getElementById("loginPasswordError").textContent = "Please enter your password";
        valid = false;
    }

    if (valid) {
        var username = email.split("@")[0];
        localStorage.setItem("loggedInUser", username);
        document.getElementById("loginSuccess").textContent = "Logged in! Redirecting...";
        setTimeout(function() {
            window.location.href = "index.html";
        }, 2000);
    }
}

function submitListing() {
    var model = document.getElementById("sellModel").value;
    var year = document.getElementById("sellYear").value;
    var price = document.getElementById("sellPrice").value;
    var email = document.getElementById("sellEmail").value;

    document.getElementById("sellModelError").textContent = "";
    document.getElementById("sellYearError").textContent = "";
    document.getElementById("sellPriceError").textContent = "";
    document.getElementById("sellEmailError").textContent = "";
    document.getElementById("sellSuccess").textContent = "";

    var valid = true;

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

    if (valid) {
        document.getElementById("sellSuccess").textContent = "Your " + model + " has been listed for sale! Our team will review it within 24 hours.";
        document.getElementById("sellModel").value = "";
        document.getElementById("sellYear").value = "";
        document.getElementById("sellPrice").value = "";
        document.getElementById("sellEmail").value = "";
        document.getElementById("sellDesc").value = "";
    }
}

function sendMessage() {
    var name = document.getElementById("contactName").value;
    var email = document.getElementById("contactEmail").value;
    var message = document.getElementById("contactMessage").value;

    document.getElementById("contactNameError").textContent = "";
    document.getElementById("contactEmailError").textContent = "";
    document.getElementById("contactMessageError").textContent = "";
    document.getElementById("contactSuccess").textContent = "";

    var valid = true;

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

    if (valid) {
        document.getElementById("contactSuccess").textContent = "Message sent! We'll get back to you shortly.";
        document.getElementById("contactName").value = "";
        document.getElementById("contactEmail").value = "";
        document.getElementById("contactMessage").value = "";
    }
}