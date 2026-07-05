// ==========================================
// 1. Отримуємо всі необхідні елементи з HTML
// ==========================================
const carNameDisplay = document.getElementById('car-name-display');
const editCarNameBtn = document.getElementById('edit-car-name-btn');

const currentMileageDisplay = document.getElementById('currentMileageDisplay'); // перевір чи збігається ID
const lastToMileage = document.getElementById('lastToMileage');
const lastToOil = document.getElementById('lastToOil');
const lastToCabin = document.getElementById('lastToCabin');
const lastToAir = document.getElementById('lastToAir');

// ==========================================
// 2. Ініціалізація даних (Завантаження з пам'яті)
// ==========================================
// Пробуємо прочитати збережені дані, якщо їх немає — створюємо дефолтний об'єкт
let car = JSON.parse(localStorage.getItem('carData')) || {
    name: "Моє Авто",
    mileage: 0,
    toMileage: 0,
    toOil: 0,
    toCabin: 0,
    toAir: 0,
    history: [],
    parts: []
};

// ==========================================
// 3. Функція оновлення інтерфейсу (Екрана)
// ==========================================
function updateUI() {
    // Встановлюємо назву машини вгорі екрана
    if (carNameDisplay) {
        carNameDisplay.textContent = car.name || "Моє Авто";
    }
    
    // Встановлюємо інші показники (додано перевірки на існування елементів, щоб не було помилок)
    if (currentMileageDisplay) currentMileageDisplay.textContent = car.mileage;
    if (lastToMileage) lastToMileage.textContent = car.toMileage;
    if (lastToOil) lastToOil.textContent = car.toOil;
    if (lastToCabin) lastToCabin.textContent = car.toCabin;
    if (lastToAir) lastToAir.textContent = car.toAir;

    // Виклик твоїх функцій рендерингу списків
    if (typeof renderHistory === "function") renderHistory();
    if (typeof renderParts === "function") renderParts();
}

// ==========================================
// 4. Функція збереження даних у LocalStorage
// ==========================================
function saveCarData() {
    localStorage.setItem('carData', JSON.stringify(car));
}

// ==========================================
// 5. Логіка кнопки-олівця (Редагування назви)
// ==========================================
if (editCarNameBtn) {
    editCarNameBtn.addEventListener('click', () => {
        // Запитуємо нове ім'я, показуючи поточне як підказку
        const newName = prompt("Введіть назву вашого авто:", car.name);
        
        // Перевіряємо, чи користувач не скасував і чи не ввів пустий рядок
        if (newName !== null && newName.trim() !== "") {
            car.name = newName.trim(); // Оновлюємо в об'єкті
            saveCarData();             // Зберігаємо в пам'ять
            updateUI();                // Перемальовуємо екран
        }
    });
}

// ==========================================
// 6. Твої функції для історії та запчастин
// (Залиш тут свій код для renderHistory та renderParts, якщо вони мають іншу логіку)
// ==========================================
function renderHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;
    historyList.innerHTML = '';
    
    car.history.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.date} - ${item.work} (${item.mileage} км)`;
        historyList.appendChild(li);
    });
}

function renderParts() {
    const partsList = document.getElementById('partsList');
    if (!partsList) return;
    partsList.innerHTML = '';
    
    car.parts.forEach((part, index) => {
        const li = document.createElement('li');
        li.textContent = `${part.name} - ${part.status}`;
        partsList.appendChild(li);
    });
}

// ==========================================
// 7. СТАРТ ДОДАТКУ
// ==========================================
// Запускаємо оновлення екрана відразу при завантаженні сторінки
updateUI();