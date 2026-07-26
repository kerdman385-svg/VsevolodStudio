// ==========================================
// 1. СЛОВАРЬ ПЕРЕВОДОВ (МУЛЬТИЯЗЫЧНОСТЬ)
// ==========================================
const translations = {
    uk: {
        "nav-home": "Головна",
        "nav-prices": "Послуги",
        "nav-skills": "Навички",
        "nav-video": "Відео",
        "nav-gallery": "Галерея",
        "nav-about": "Про мене",
        "nav-logout": "Вийти",
        "auth-title": "Вітаємо у <span>Web Studio</span>",
        "auth-btn": "Увійти",
        "main-hero-title": "Сучасна Веб-Розробка та Дизайн",
        "main-hero-desc": "Створення унікальних інтерфейсів, лендінгів, а також професійне налаштування Minecraft серверів і плагінів під ключ.",
        "services-title": "Мої послуги та прайс-лист",
        "skills-title": "Мої навички",
        "video-title": "Відеоролики",
        "gallery-title": "Галерея зображень",
        "about-title": "Анкета про себе"
    },
    en: {
        "nav-home": "Home",
        "nav-prices": "Services",
        "nav-skills": "Skills",
        "nav-video": "Video",
        "nav-gallery": "Gallery",
        "nav-about": "About me",
        "nav-logout": "Logout",
        "auth-title": "Welcome to <span>Web Studio</span>",
        "auth-btn": "Login",
        "main-hero-title": "Modern Web Development & Design",
        "main-hero-desc": "Creating unique interfaces, landing pages, as well as professional configuration of Minecraft servers and plugins turn-key.",
        "services-title": "My Services & Price List",
        "skills-title": "My Skills",
        "video-title": "Video Clips",
        "gallery-title": "Image Gallery",
        "about-title": "Profile About Me"
    }
};

let authMode = 'login'; // 'login' или 'register'

// ==========================================
// 2. ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Восстанавливаем язык, тему и RGB цвета
    initLanguage();
    initTheme();
    initRGB();
    
    // Запускаем систему авторизации и защиты страниц
    initAuth();
    
    // Инициализируем модалку заказа (только для страницы услуг)
    initOrderModal();
    
    // Инициализируем PWA кнопку установки
    initPWA();
});

// ==========================================
// 3. СИСТЕМА АВТОРИЗАЦИИ И ЗАЩИТЫ СТРАНИЦ
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

    // ПРОВЕРКА АВТОРИЗАЦИИ
    if (currentUser) {
        // Если вошли — открываем контент
        if (siteContent) siteContent.classList.remove("hidden");
        if (authScreen) authScreen.classList.add("hidden");
    } else {
        // Если НЕ вошли
        if (authScreen) {
            // На главной странице — прячем сайт, показываем форму входа
            if (siteContent) siteContent.classList.add("hidden");
            authScreen.classList.remove("hidden");
            updateAuthUI();
        } else {
            // На внутренних страницах — жестко редиректим на главную для логина
            const currentPage = window.location.pathname.split("/").pop();
            if (currentPage !== "index.html" && currentPage !== "") {
                window.location.href = "index.html";
            }
        }
    }

    // Переключение Логин / Регистрация
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
            if (authTitle) authTitle.innerHTML = translations[lang]["auth-title"] || "Вітаємо у <span>Web Studio</span>";
            if (emailInput) {
                emailInput.style.display = "none";
                emailInput.removeAttribute("required");
            }
            if (submitBtn) submitBtn.textContent = translations[lang]["auth-btn"] || "Увійти";
            if (toggleText) toggleText.textContent = lang === 'uk' ? "Ще не маєте акаунту?" : "Don't have an account?";
            if (toggleLink) toggleLink.textContent = lang === 'uk' ? "Зареєструватися" : "Register";
        } else {
            if (authTitle) authTitle.innerHTML = lang === 'uk' ? "Створення <span>Акаунту</span>" : "Create <span>Account</span>";
            if (emailInput) {
                emailInput.style.display = "block";
                emailInput.setAttribute("required", "true");
            }
            if (submitBtn) submitBtn.textContent = lang === 'uk' ? "Зареєструватися" : "Register";
            if (toggleText) toggleText.textContent = lang === 'uk' ? "Вже є акаунт?" : "Already have an account?";
            if (toggleLink) toggleLink.textContent = translations[lang]["auth-btn"] || "Увійти";
        }
    }

    // Обработка отправки формы авторизации
    if (authForm) {
        authForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("auth-username").value.trim();
            const password = document.getElementById("auth-password").value;
            let users = JSON.parse(localStorage.getItem("webStudioUsers")) || {};

            if (authMode === 'register') {
                const email = emailInput ? emailInput.value.trim() : "";
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

    // Выход из аккаунта
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("currentUser");
            window.location.href = "index.html";
        });
    }
}

// ==========================================
// 4. УПРАВЛЕНИЕ ЯЗЫКОМ (МУЛЬТИЯЗЫЧНОСТЬ)
// ==========================================
function initLanguage() {
    let currentLang = localStorage.getItem("siteLang") || "uk";
    applyLanguage(currentLang);
}

function changeLanguage(lang) {
    localStorage.setItem("siteLang", lang);
    applyLanguage(lang);
    // Перерисовываем интерфейс авторизации, если мы на экране входа
    const authForm = document.getElementById("auth-form");
    if (authForm) {
        location.reload(); 
    }
}

function applyLanguage(lang) {
    // Переводим все элементы с атрибутом data-lang-key
    document.querySelectorAll("[data-lang-key]").forEach(el => {
        const key = el.getAttribute("data-lang-key");
        if (translations[lang] && translations[lang][key]) {
            if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
                el.placeholder = translations[lang][key];
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });

    // Обновляем плашку на кнопке выбора языка
    const langLabel = document.getElementById("current-lang-label");
    if (langLabel) langLabel.textContent = lang.toUpperCase();
    
    document.documentElement.lang = lang;
}

// ==========================================
// 5. УПРАВЛЕНИЕ ТЕМАМИ (DARK / LIGHT)
// ==========================================
function initTheme() {
    const savedTheme = localStorage.getItem("siteTheme") || "dark";
    setTheme(savedTheme);
}

function setTheme(theme) {
    localStorage.setItem("siteTheme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    
    const themeLabel = document.getElementById("current-theme-label");
    if (themeLabel) {
        themeLabel.textContent = theme === "dark" ? "🌙 Темна" : "☀️ Ярка";
    }
}

// ==========================================
// 6. КАСТОМНЫЙ RGB НАСТРОЙЩИК ЦВЕТОВ
// ==========================================
function initRGB() {
    const colorInputs = [
        { id: "rgb-color-1", cssVar: "--rgb-c1", def: "#ff007f" },
        { id: "rgb-color-2", cssVar: "--rgb-c2", def: "#7f00ff" },
        { id: "rgb-color-3", cssVar: "--rgb-c3", def: "#00f0ff" }
    ];

    colorInputs.forEach(item => {
        const input = document.getElementById(item.id);
        const savedColor = localStorage.getItem(item.id) || item.def;
        
        // Применяем сохраненный или дефолтный цвет к документу
        document.documentElement.style.setProperty(item.cssVar, savedColor);
        if (input) input.value = savedColor;

        // Вешаем событие изменения цвета
        if (input) {
            input.addEventListener("input", (e) => {
                const val = e.target.value;
                document.documentElement.style.setProperty(item.cssVar, val);
                localStorage.setItem(item.id, val);
            });
        }
    });

    // Кнопка сброса RGB цветов к дефолтным
    const resetBtn = document.getElementById("reset-rgb-btn");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            colorInputs.forEach(item => {
                localStorage.removeItem(item.id);
                document.documentElement.style.setProperty(item.cssVar, item.def);
                const input = document.getElementById(item.id);
                if (input) input.value = item.def;
            });
        });
    }
}

// ==========================================
// 7. МОДАЛЬНОЕ ОКНО ДЛЯ СТРАНИЦЫ УСЛУГ (forma.html)
// ==========================================
function initOrderModal() {
    const modal = document.getElementById("order-modal");
    const closeBtn = document.getElementById("close-modal-btn");
    const orderForm = document.getElementById("order-form");
    const serviceInput = document.getElementById("order-service");

    // Ловим клики по кнопкам "Замовити"
    document.querySelectorAll(".order-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const serviceName = btn.getAttribute("data-service");
            if (serviceInput) serviceInput.value = serviceName;
            if (modal) modal.classList.remove("hidden");
        });
    });

    // Закрытие модалки на крестик
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            if (modal) modal.classList.add("hidden");
        });
    }

    // Закрытие модалки при клике по фону
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.add("hidden");
        }
    });

    // Отправка формы заказа
    if (orderForm) {
        orderForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const service = serviceInput.value;
            const name = document.getElementById("client-firstname").value.trim();
            const contact = document.getElementById("client-contact").value.trim();
            const details = document.getElementById("order-details").value.trim();

            alert(`Дякуємо, ${name}!\nВаше замовлення на "${service}" успішно надіслано.\nМи зв'яжемося з вами в ${contact}.`);
            
            orderForm.reset();
            if (modal) modal.classList.add("hidden");
        });
    }
}

// ==========================================
// 8. ЗАКЛАДКА ПОД PWA (УСТАНОВКА ДОДАТКУ)
// ==========================================
function initPWA() {
    let deferredPrompt;
    const btnInstall = document.getElementById("btn-install");

    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (btnInstall) btnInstall.style.display = "block";
    });

    if (btnInstall) {
        btnInstall.addEventListener("click", () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === "accepted") {
                    console.log("User accepted the install prompt");
                }
                deferredPrompt = null;
                btnInstall.style.display = "none";
            });
        });
    }

    window.addEventListener("appinstalled", () => {
        console.log("PWA was installed");
        if (btnInstall) btnInstall.style.display = "none";
    });
}
