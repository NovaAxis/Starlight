// Конфигурация и глобальные переменные
let turnstileWidgetId = null;
let captchaToken = null;
let downloadLinks = {
    windows: "https://github.com/starlight-dev/starlight/releases/download/v1.0.0/Starlight-Windows.exe",
    macos: "https://github.com/starlight-dev/starlight/releases/download/v1.0.0/Starlight-MacOS.dmg",
    linux: "https://github.com/starlight-dev/starlight/releases/download/v1.0.0/Starlight-Linux.AppImage"
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Инициализация плавной прокрутки
    initSmoothScrolling();
    
    // Инициализация обработчиков событий
    initEventListeners();
    
    console.log('Starlight website initialized');
}

// Плавная прокрутка для навигационных ссылок
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Инициализация обработчиков событий
function initEventListeners() {
    // Обработчик для кнопки скачивания
    document.getElementById('download-btn')?.addEventListener('click', downloadCO);
    document.getElementById('download-premium-btn')?.addEventListener('click', showPremiumPopup);
    
    // Обработчики для выбора ОС
    document.getElementById('windows-btn')?.addEventListener('click', () => startDownload('windows'));
    document.getElementById('macos-btn')?.addEventListener('click', () => startDownload('macos'));
    document.getElementById('linux-btn')?.addEventListener('click', () => startDownload('linux'));
    
    // Обработчики для попапов
    document.getElementById('captcha-popup')?.addEventListener('click', function(e) {
        if (e.target === this) {
            hideCaptchaPopup();
        }
    });
    
    document.getElementById('os-select-popup')?.addEventListener('click', function(e) {
        if (e.target === this) {
            hideOSSelectPopup();
        }
    });
    
    // Закрытие попапов по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            hideCaptchaPopup();
            hideOSSelectPopup();
        }
    });
}

// Основная функция скачивания
function downloadCO() {
    showCaptchaPopup();
}

// Показать попап с капчей
function showCaptchaPopup() {
    const popup = document.getElementById('captcha-popup');
    popup.classList.remove('hidden');
    
    // Инициализация Cloudflare Turnstile
    if (!turnstileWidgetId) {
        turnstile.ready(function () {
            turnstileWidgetId = turnstile.render("#turnstile-container", {
                sitekey: "1x00000000000000000000AA", // Тестовый ключ
                callback: function (token) {
                    captchaToken = token;
                    onCaptchaComplete();
                },
                "error-callback": function() {
                    showError("Captcha verification failed. Please try again.");
                }
            });
        });
    } else {
        turnstile.reset(turnstileWidgetId);
    }
}

// Скрыть попап с капчей
function hideCaptchaPopup() {
    const popup = document.getElementById('captcha-popup');
    popup.classList.add('hidden');
    document.getElementById('download-status')?.classList.add('hidden');
}

// Капча пройдена
function onCaptchaComplete() {
    // Показать статус загрузки
    const statusElement = document.getElementById('download-status');
    if (statusElement) {
        statusElement.classList.remove('hidden');
    }
    
    // Симуляция проверки токена
    setTimeout(() => {
        hideCaptchaPopup();
        showOSSelectPopup();
    }, 1500);
}

// Показать выбор ОС
function showOSSelectPopup() {
    const popup = document.getElementById('os-select-popup');
    popup.classList.remove('hidden');
}

// Скрыть выбор ОС
function hideOSSelectPopup() {
    const popup = document.getElementById('os-select-popup');
    popup.classList.add('hidden');
}

// Начать скачивание для конкретной ОС
function startDownload(os) {
    const statusElement = document.getElementById('download-status-os');
    if (statusElement) {
        statusElement.classList.remove('hidden');
    }
    
    // Симуляция подготовки загрузки
    setTimeout(() => {
        // В реальном приложении здесь будет редирект на файл
        const downloadUrl = downloadLinks[os];
        if (downloadUrl) {
            // Создаем временную ссылку для скачивания
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = '';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Показываем сообщение об успехе
            showSuccess(`Starlight for ${os.toUpperCase()} is downloading!`);
        } else {
            showError('Download link not available for this OS.');
        }
        
        hideOSSelectPopup();
        if (statusElement) {
            statusElement.classList.add('hidden');
        }
    }, 2000);
}

// Показать попап премиума
function showPremiumPopup() {
    showError('Premium features are coming soon! Stay tuned for updates.');
}

// Показать сообщение об ошибке
function showError(message) {
    showNotification(message, 'error');
}

// Показать сообщение об успехе
function showSuccess(message) {
    showNotification(message, 'success');
}

// Универсальная функция уведомлений
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg z-50 ${
        type === 'error' ? 'bg-red-500' : 
        type === 'success' ? 'bg-green-500' : 'bg-blue-500'
    } text-white font-medium shadow-lg`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Автоматическое скрытие через 5 секунд
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Аналитика (базовая)
function trackDownload(os) {
    console.log(`Download started for: ${os}`);
    // Здесь можно добавить Google Analytics или другую аналитику
    // gtag('event', 'download', { 'os': os });
}

// Обновление статистики в реальном времени
function updateLiveStats() {
    // Симуляция живых данных
    const stats = {
        users: Math.floor(10000 + Math.random() * 1000),
        uptime: '99.9%',
        downloads: Math.floor(50000 + Math.random() * 5000)
    };
    
    // Обновляем элементы на странице
    Object.keys(stats).forEach(key => {
        const element = document.getElementById(`stat-${key}`);
        if (element) {
            element.textContent = stats[key];
        }
    });
}

// Запуск обновления статистики
setInterval(updateLiveStats, 10000);

// Обработка видимости страницы
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        updateLiveStats();
    }
});

// Регистрация Service Worker для оффлайн работы (опционально)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
}