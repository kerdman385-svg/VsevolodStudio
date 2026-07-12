// ==========================================
// НАСТРОЙКА УВЕДОМЛЕНИЙ TELEGRAM
// ==========================================
const TELEGRAM_BOT_TOKEN = "8954531461:AAGlWf3qvfIP-mOeZWFiaT56GWSprkHUvYc";
const TELEGRAM_CHAT_ID = "8592436593";

// ==========================================
// СЛОВАРЬ ДЛЯ МУЛЬТИЯЗЫЧНОСТИ
// ==========================================
const translations = {
    uk: {
        "auth-title": "Вітаємо у <span>Web Studio</span>",
        "auth-desc": "Будь ласка, зареєструйтеся або увійдіть для доступу.",
        "auth-btn": "Увійти",
        "nav-home": "Головна", 
        "nav-prices": "Послуги", 
        "nav-skills": "Навички",
        "nav-video": "Відео", 
        "nav-gallery": "Галерея", 
        "nav-about": "Про мене", 
        "nav-logout": "Вийти",
        "hero-title": "Привіт, я <span>Всеволод Кердман</span>",
        "hero-desc": "Починаючий Web-розробник. Створюю плагіни, моди та красиві сайти.",
        "hero-btn": "Дивитись прайс-лист",
        "services-title": "Мої послуги та прайс-лист",
        "skills-title": "Мої навички",
        "video-title": "Відеоролики", 
        "gallery-title": "Галерея зображень", 
        "about-title": "Анкета про себе"
    },
    en: {
        "auth-title": "Welcome to <span>Web Studio</span>",
        "auth-desc": "Please register or log in to get access.",
        "auth-btn": "Log In",
        "nav-home": "Home", 
        "nav-prices": "Services", 
        "nav-skills": "Skills",
        "nav-video": "Videos", 
        "nav-gallery": "Gallery", 
        "nav-about": "About Me", 
        "nav-logout": "Log Out",
        "hero-title": "Hi, I am <span>Vsevolod Kerdman</span>",
        "hero-desc": "Aspiring Web Developer. Creating modern mods, server plugins, and responsive sites.",
        "hero-btn": "View Price List",
        "services-title": "My Services & Price List",
        "skills-title": "My Professional Skills",
        "video-title": "Video Showcase", 
        "gallery-title": "Image Gallery", 
        "about-title": "Profile About Me"
    }
};

let authMode = 'login';

document.addEventListener("DOMContentLoaded", () => {
    initAuth();
    initDropdowns();
    loadSavedSettings();
    initInterfaceHandlers();
});

// ==========================================
// СИСТЕМА РЕГИСТРАЦИИ И ВХОДА
// ==========================================
function initAuth() {
    const authScreen = document.getElementById("auth-screen");
    const siteContent = document.getElementById("site-content");
    const authForm = document.getElementById("auth-form");
    const logoutBtn = document.getElementById("btn-logout");
    
    const toggleLink = document.getElementById("auth-toggle-link");
    const toggleText = document.getElementById("auth-toggle-text");
    const emailInput = document.getElementById("auth-email");
    const submitBtn = document.getElementById("auth-submit-btn");
    const authTitle = document.getElementById("auth-title");

    const currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
        if (siteContent) siteContent.classList.remove("hidden");
        if (authScreen) authScreen.classList.add("hidden");
    } else {
        if (siteContent) siteContent.classList.add("hidden");
        if (authScreen) {
            authScreen.classList.remove("hidden");
            updateAuthUI();
        } else {
            window.location.href = "index.html";
        }
    }

    if (toggleLink) {
        toggleLink.addEventListener("click", (e) => {
            e.preventDefault();
            authMode = (authMode === 'login') ? 'register' : 'login';
            updateAuthUI();
        });
    }

    function updateAuthUI() {
        if (!authForm) return;
        const lang = localStorage.getItem("siteLang") || "uk";
        
        if (authMode === 'login') {
            authTitle.innerHTML = translations[lang]["auth-title"] || "Вітаємо у <span>Web Studio</span>";
            if (emailInput) {
                emailInput.style.display = "none";
                emailInput.removeAttribute("required");
            }
            if (submitBtn) submitBtn.textContent = translations[lang]["auth-btn"] || "Увійти";
            if (toggleText) toggleText.textContent = lang === 'uk' ? "Ще не маєте акаунту?" : "Don't have an account?";
            if (toggleLink) toggleLink.textContent = lang === 'uk' ? "Зареєструватися" : "Register";
        } else {
            authTitle.innerHTML = lang === 'uk' ? "Створення <span>Акаунту</span>" : "Create <span>Account</span>";
            if (emailInput) {
                emailInput.style.display = "block";
                emailInput.setAttribute("required", "true");
            }
            if (submitBtn) submitBtn.textContent = lang === 'uk' ? "Зареєструватися" : "Register";
            if (toggleText) toggleText.textContent = lang === 'uk' ? "Вже є акаунт?" : "Already have an account?";
            if (toggleLink) toggleLink.textContent = translations[lang]["auth-btn"] || "Увійти";
        }
    }

    if (authForm) {
        authForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("auth-username").value.trim();
            const password = document.getElementById("auth-password").value;
            let users = JSON.parse(localStorage.getItem("webStudioUsers")) || {};

            if (authMode === 'register') {
                const email = emailInput.value.trim();
                if (users[username]) {
                    alert(localStorage.getItem("siteLang") === 'en' ? "Username taken!" : "Цей логін вже зайнятий!");
                    return;
                }
                users[username] = { email: email, password: password };
                localStorage.setItem("webStudioUsers", JSON.stringify(users));
                localStorage.setItem("currentUser", username);
                location.reload();
            } else {
                const user = users[username];
                if (user && user.password === password) {
                    localStorage.setItem("currentUser", username);
                    location.reload();
                } else {
                    alert(localStorage.getItem("siteLang") === 'en' ? "Invalid login or password!" : "Невірний логін або пароль!");
                }
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("currentUser");
            window.location.href = "index.html";
        });
    }
}

// ==========================================
// УПРАВЛЕНИЕ ВЫПАДАЮЩИМИ СПИСКАМИ (DROPDOWNS)
// ==========================================
function initDropdowns() {
    document.querySelectorAll(".dropdown-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const currentContent = btn.nextElementSibling;
            
            document.querySelectorAll(".dropdown-content").forEach(content => {
                if (content !== currentContent) content.classList.remove("show");
            });

            if (currentContent) currentContent.classList.toggle("show");
        });
    });

    document.addEventListener("click", () => {
        document.querySelectorAll(".dropdown-content").forEach(content => {
            content.classList.remove("show");
        });
    });

    const rgbMenu = document.querySelector(".rgb-dropdown");
    if (rgbMenu) {
        rgbMenu.addEventListener("click", (e) => e.stopPropagation());
    }
}

// ==========================================
// ТЕМЫ, ЯЗЫК И RGB
// ==========================================
function setTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('siteTheme', themeName);
    const label = document.getElementById("current-theme-label");
    if (label) {
        label.textContent = themeName === 'dark' ? "🌙 Темна" : "☀️ Ярка";
    }
}

function changeLanguage(lang) {
    localStorage.setItem("siteLang", lang);
    const label = document.getElementById("current-lang-label");
    if (label) label.textContent = lang.toUpperCase();

    document.querySelectorAll("[data-lang-key]").forEach(elem => {
        const key = elem.getAttribute("data-lang-key");
        if (translations[lang] && translations[lang][key]) {
            if (elem.tagName === "INPUT" || elem.tagName === "TEXTAREA") {
                elem.placeholder = translations[lang][key];
            } else {
                if (translations[lang][key].includes("<span>")) {
                    elem.innerHTML = translations[lang][key];
                } else {
                    elem.textContent = translations[lang][key];
                }
            }
        }
    });
}

function loadSavedSettings() {
    const savedTheme = localStorage.getItem('siteTheme') || 'dark';
    setTheme(savedTheme);

    const savedLang = localStorage.getItem('siteLang') || 'uk';
    changeLanguage(savedLang);

    const c1 = localStorage.getItem('--c1') || '#ff007f';
    const c2 = localStorage.getItem('--c2') || '#7f00ff';
    const c3 = localStorage.getItem('--c3') || '#00bfff';

    document.documentElement.style.setProperty('--c1', c1);
    document.documentElement.style.setProperty('--c2', c2);
    document.documentElement.style.setProperty('--c3', c3);

    const i1 = document.getElementById("rgb-color-1");
    const i2 = document.getElementById("rgb-color-2");
    const i3 = document.getElementById("rgb-color-3");

    if (i1) i1.value = c1;
    if (i2) i2.value = c2;
    if (i3) i3.value = c3;
}

function initInterfaceHandlers() {
    ["1", "2", "3"].forEach(num => {
        const input = document.getElementById(`rgb-color-${num}`);
        if (input) {
            input.addEventListener("input", (e) => {
                const val = e.target.value;
                document.documentElement.style.setProperty(`--c${num}`, val);
                localStorage.setItem(`--c${num}`, val);
            });
        }
    });

    const resetBtn = document.getElementById("reset-rgb-btn");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            localStorage.removeItem('--c1');
            localStorage.removeItem('--c2');
            localStorage.removeItem('--c3');
            loadSavedSettings();
        });
    }

    // Обработка формы заказа и отправка в Telegram
    const orderBtns = document.querySelectorAll(".order-btn");
    const orderModal = document.getElementById("order-modal");
    const closeModalBtn = document.getElementById("close-modal-btn");
    const orderForm = document.getElementById("order-form");
    const serviceInput = document.getElementById("order-service");

    orderBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const service = btn.getAttribute("data-service");
            if (serviceInput) serviceInput.value = service;
            if (orderModal) orderModal.classList.remove("hidden");
        });
    });

    if (closeModalBtn && orderModal) {
        closeModalBtn.addEventListener("click", () => orderModal.classList.add("hidden"));
    }

    if (orderForm) {
        orderForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const service = serviceInput.value;
            const clientName = document.getElementById("client-firstname").value.trim();
            const clientContact = document.getElementById("client-contact").value.trim();
            const orderDetails = document.getElementById("order-details").value.trim();
            const userLogged = localStorage.getItem("currentUser") || "Гість";

            const message = `🔔 **НОВЕ ЗАМОВЛЕННЯ!**\n\n` +
                            `💻 Послуга: ${service}\n` +
                            `👤 Ім'я клієнта: ${clientName}\n` +
                            `✈️ Контакты: ${clientContact}\n` +
                            `📝 Деталі: ${orderDetails}\n\n` +
                            `🔑 Авторизований як: ${userLogged}`;

            const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

            fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: "Markdown"
                })
            })
            .then(response => {
                if (response.ok) {
                    alert("Дякуємо! Ваше замовлення успішно надіслано в Telegram Всеволоду.");
                } else {
                    alert("Помилка відправки. Перевірте правильність токена або ID чату в script.js");
                }
            })
            .catch(error => {
                console.error("Помилка:", error);
                alert("Не вдалося зв'язатися з Telegram API.");
            });

            if (orderModal) orderModal.classList.add("hidden");
            orderForm.reset();
        });
    }
}