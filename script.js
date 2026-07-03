// Елементи екрана
const carNameDisplay = document.getElementById('car-name-display');
const carNameInput = document.getElementById('car-name-input');
const saveCarBtn = document.getElementById('save-car-btn');

const currentMileageDisplay = document.getElementById('current-mileage');
const mileageInput = document.getElementById('mileage-input');
const updateMileageBtn = document.getElementById('update-mileage-btn');

const saveToBtn = document.getElementById('save-to-btn');
const toMileageInput = document.getElementById('to-mileage-input');
const toOilInput = document.getElementById('to-oil-input');
const toCabinCheckbox = document.getElementById('to-cabin-checkbox');
const toAirCheckbox = document.getElementById('to-air-checkbox');

const lastToMileage = document.getElementById('last-to-mileage');
const lastToOil = document.getElementById('last-to-oil');
const lastToCabin = document.getElementById('last-to-cabin');
const lastToAir = document.getElementById('last-to-air');

// Елементи модального вікна
const openHistoryBtn = document.getElementById('open-history-btn');
const historyModal = document.getElementById('history-modal');
const closeModalBtn = document.querySelector('.close-modal-btn');
const historyList = document.getElementById('history-list');

// Масив для збереження ВСІХ ТО
let maintenanceHistory = [];

// ==========================================
// ЗАВАНТАЖЕННЯ ДАНИХ ПРИ СТАРТІ
// ==========================================
window.addEventListener('DOMContentLoaded', function() {
    const savedCar = localStorage.getItem('carName');
    if (savedCar) carNameDisplay.textContent = savedCar;

    const savedMileage = localStorage.getItem('mileage');
    if (savedMileage) currentMileageDisplay.textContent = savedMileage;

    // Завантажуємо ОСТАННЄ ТО для головного екрана
    const savedToMileage = localStorage.getItem('toMileage');
    const savedToOil = localStorage.getItem('toOil');
    const savedToCabin = localStorage.getItem('toCabin');
    const savedToAir = localStorage.getItem('toAir');

    if (savedToMileage) lastToMileage.textContent = savedToMileage;
    if (savedToOil) lastToOil.textContent = savedToOil;
    if (savedToCabin) lastToCabin.textContent = savedToCabin;
    if (savedToAir) lastToAir.textContent = savedToAir;

    // Завантажуємо ІСТОРІЮ ТО
    const savedHistory = localStorage.getItem('maintenanceHistory');
    if (savedHistory) {
        maintenanceHistory = JSON.parse(savedHistory);
        renderHistory(); // Малюємо історію у вікні
    }
});

// ==========================================
// ЛОГІКА МОДАЛЬНОГО ВІКНА
// ==========================================
openHistoryBtn.addEventListener('click', function() {
    historyModal.style.display = 'flex'; // Показуємо вікно
});

closeModalBtn.addEventListener('click', function() {
    historyModal.style.display = 'none'; // Ховаємо вікно за хрестиком
});

// Закриття вікна, якщо клікнути поза його межами
window.addEventListener('click', function(e) {
    if (e.target === historyModal) {
        historyModal.style.display = 'none';
    }
});

// Функція виведення історії у вікно
function renderHistory() {
    if (maintenanceHistory.length === 0) {
        historyList.innerHTML = '<p style="color: #c4c4cc;">Історія порожня...</p>';
        return;
    }

    historyList.innerHTML = ''; // Очищаємо старий список перед малюванням
    
    // Перебираємо історію з кінця до початку (свіжі ТО вгорі)
    for (let i = maintenanceHistory.length - 1; i >= 0; i--) {
        const item = maintenanceHistory[i];
        
        const itemHtml = `
            <div class="history-item">
                <p style="color: #4ea8de; font-weight: bold;">Дата: ${item.date}</p>
                <p><strong>Пробіг:</strong> ${item.mileage} км</p>
                <p><strong>Мастило:</strong> ${item.oil}</p>
                <p><strong>Фільтр салону:</strong> ${item.cabin}</p>
                <p><strong>Повітряний фільтр:</strong> ${item.air}</p>
            </div>
        `;
        historyList.innerHTML += itemHtml;
    }
}

// ==========================================
// КНОПКИ: НАЗВА ТА ПРОБІГ
// ==========================================
saveCarBtn.addEventListener('click', function() {
    const newName = carNameInput.value;
    if (newName.trim() !== "") {
        carNameDisplay.textContent = newName;
        localStorage.setItem('carName', newName);
        carNameInput.value = "";
    }
});

updateMileageBtn.addEventListener('click', function() {
    const newMileage = parseFloat(mileageInput.value);
    if (!isNaN(newMileage) && newMileage >= 0) {
        currentMileageDisplay.textContent = newMileage;
        localStorage.setItem('mileage', newMileage);
        mileageInput.value = "";
    }
});

// ==========================================
// ДОДАВАННЯ НОВОГО ТО
// ==========================================
saveToBtn.addEventListener('click', function() {
    const mileage = toMileageInput.value;
    const oil = toOilInput.value;
    
    if (mileage.trim() === "" || oil.trim() === "") {
        alert("Будь ласка, заповніть пробіг та назву мастила!");
        return;
    }

    const cabinStatus = toCabinCheckbox.checked ? "Замінено" : "Ні";
    const airStatus = toAirCheckbox.checked ? "Замінено" : "Ні";

    // Оновлюємо картку останнього ТО
    lastToMileage.textContent = mileage;
    lastToOil.textContent = oil;
    lastToCabin.textContent = cabinStatus;
    lastToAir.textContent = airStatus;

    // Оновлюємо поточний пробіг
    currentMileageDisplay.textContent = mileage;
    localStorage.setItem('mileage', mileage);

    // Зберігаємо останнє ТО окремо
    localStorage.setItem('toMileage', mileage);
    localStorage.setItem('toOil', oil);
    localStorage.setItem('toCabin', cabinStatus);
    localStorage.setItem('toAir', airStatus);

    // СТВОРЮЄМО ОБ'ЄКТ НОВОГО ТО ДЛЯ ІСТОРІЇ
    const currentDate = new Date().toLocaleDateString('uk-UA'); // Автоматична поточна дата
    const newToRecord = {
        date: currentDate,
        mileage: mileage,
        oil: oil,
        cabin: cabinStatus,
        air: airStatus
    };

    // Додаємо запис у наш загальний масив історії
    maintenanceHistory.push(newToRecord);

    // Зберігаємо всю історію в пам'ять
    localStorage.setItem('maintenanceHistory', JSON.stringify(maintenanceHistory));

    // Оновлюємо список у спливаючому вікні
    renderHistory();

    // Очищаємо поля форми
    toMileageInput.value = "";
    toOilInput.value = "";
    toCabinCheckbox.checked = false;
    toAirCheckbox.checked = false;
    
    alert("Дані ТО успішно збережено в історію!");
});