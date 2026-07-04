// ==========================================
// 1. ІНІЦІАЛІЗАЦІЯ ДАНИХ (ГАРАЖ)
// ==========================================
let garage = []; 
let currentCarId = null; 

// Посилання на елементи головного екрана
const carNameDisplay = document.getElementById('car-name-display');
const currentMileageDisplay = document.getElementById('current-mileage');
const lastToMileage = document.getElementById('last-to-mileage');
const lastToOil = document.getElementById('last-to-oil');
const lastToCabin = document.getElementById('last-to-cabin');
const lastToAir = document.getElementById('last-to-air');

// Посилання на форми введення
const carNameInput = document.getElementById('car-name-input');
const mileageInput = document.getElementById('mileage-input');
const toMileageInput = document.getElementById('to-mileage-input');
const toOilInput = document.getElementById('to-oil-input');
const toCabinCheckbox = document.getElementById('to-cabin-checkbox');
const toAirCheckbox = document.getElementById('to-air-checkbox');

// Кнопки
const saveCarBtn = document.getElementById('save-car-btn');
const updateMileageBtn = document.getElementById('update-mileage-btn');
const saveToBtn = document.getElementById('save-to-btn');

// Модальні вікна та меню
const editNameModal = document.getElementById('edit-name-modal');
const historyModal = document.getElementById('history-modal');
const addPartModal = document.getElementById('add-part-modal');
const partsHistoryModal = document.getElementById('parts-history-modal');
const sideMenu = document.getElementById('side-menu');

// Завантаження даних при відкритті сторінки
window.addEventListener('DOMContentLoaded', function() {
    const savedGarage = localStorage.getItem('garage');
    const savedCurrentId = localStorage.getItem('currentCarId');

    if (savedGarage) {
        garage = JSON.parse(savedGarage);
    }

    // Якщо в гаражі порожньо, створюємо першу дефолтну машину
    if (garage.length === 0) {
        const defaultCar = createNewCarObject("Моє Авто");
        garage.push(defaultCar);
        currentCarId = defaultCar.id;
        saveGarageToStorage();
    } else {
        currentCarId = savedCurrentId ? parseInt(savedCurrentId) : garage[0].id;
    }

    renderGarageMenu();
    loadCurrentCarData();
});

// Шаблон для створення нової машини
function createNewCarObject(name) {
    return {
        id: Date.now(),
        name: name,
        mileage: 0,
        toMileage: "—",
        toOil: "—",
        toCabin: "—",
        toAir: "—",
        maintenanceHistory: [],
        trackedParts: []
    };
}

function saveGarageToStorage() {
    localStorage.setItem('garage', JSON.stringify(garage));
    localStorage.setItem('currentCarId', currentCarId);
}

// Виведення даних поточної машини на екран
function loadCurrentCarData() {
    const car = garage.find(c => c.id === currentCarId);
    if (!car) return;

    // Встановлюємо назву машини вгорі екрана
    if (carNameDisplay) {
        carNameDisplay.textContent = car.name;
    }
    
    currentMileageDisplay.textContent = car.mileage;
    lastToMileage.textContent = car.toMileage;
    lastToOil.textContent = car.toOil;
    lastToCabin.textContent = car.toCabin;
    lastToAir.textContent = car.toAir;

    renderHistory();
    renderParts();
}

// ==========================================
// 2. БІЧНЕ МЕНЮ (ГАРАЖ)
// ==========================================
document.getElementById('open-sidebar-btn').addEventListener('click', () => sideMenu.style.left = '0px');
document.getElementById('close-sidebar').addEventListener('click', () => sideMenu.style.left = '-280px');

document.getElementById('add-new-car-btn').addEventListener('click', function() {
    const input = document.getElementById('new-car-name-input');
    if (input.value.trim() === "") return;

    const newCar = createNewCarObject(input.value.trim());
    garage.push(newCar);
    currentCarId = newCar.id; 
    
    saveGarageToStorage();
    loadCurrentCarData();
    renderGarageMenu();
    
    input.value = "";
    sideMenu.style.left = '-280px'; 
});

function renderGarageMenu() {
    const container = document.getElementById('cars-list');
    if (!container) return;
    container.innerHTML = '';

    garage.forEach(car => {
        const item = document.createElement('div');
        item.className = `car-menu-item ${car.id === currentCarId ? 'active' : ''}`;
        
        item.innerHTML = `
            <span class="car-select-click" style="flex: 1; cursor: pointer;">🚗 ${car.name}</span>
            ${garage.length > 1 ? `<button class="delete-car-btn" onclick="deleteCar(event, ${car.id})">🗑️</button>` : ''}
        `;

        item.querySelector('.car-select-click').addEventListener('click', () => {
            currentCarId = car.id;
            saveGarageToStorage();
            loadCurrentCarData();
            renderGarageMenu();
            sideMenu.style.left = '-280px';
        });

        container.appendChild(item);
    });
}

window.deleteCar = function(event, id) {
    event.stopPropagation(); 
    if (!confirm("Видалити автомобіль та всі його дані з гаража?")) return;

    garage = garage.filter(c => c.id !== id);
    if (currentCarId === id) {
        currentCarId = garage[0].id;
    }
    saveGarageToStorage();
    loadCurrentCarData();
    renderGarageMenu();
};

// ==========================================
// 3. ЗМІНА НАЗВИ АВТО
// ==========================================
document.getElementById('edit-car-name-btn').addEventListener('click', () => {
    const car = garage.find(c => c.id === currentCarId);
    if (car) {
        carNameInput.value = car.name;
    }
    editNameModal.style.display = 'flex';
});

document.getElementById('close-edit-name-modal').addEventListener('click', () => editNameModal.style.display = 'none');

saveCarBtn.addEventListener('click', function() {
    const newName = carNameInput.value.trim();
    if (newName !== "") {
        const car = garage.find(c => c.id === currentCarId);
        if (car) {
            car.name = newName;
        }
        if (carNameDisplay) {
            carNameDisplay.textContent = newName;
        }
        saveGarageToStorage();
        renderGarageMenu();
        carNameInput.value = "";
    }
    editNameModal.style.display = 'none';
});

// ==========================================
// 4. ОНОВЛЕННЯ ПРОБІГУ
// ==========================================
updateMileageBtn.addEventListener('click', function() {
    const newMileage = parseFloat(mileageInput.value);
    if (!isNaN(newMileage) && newMileage >= 0) {
        const car = garage.find(c => c.id === currentCarId);
        if (car) {
            car.mileage = newMileage;
            currentMileageDisplay.textContent = newMileage;
            saveGarageToStorage();
            renderParts();
        }
        mileageInput.value = "";
    }
});

// ==========================================
// 5. ДОДАВАННЯ ТА ВИВЕДЕННЯ ТО
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

    const car = garage.find(c => c.id === currentCarId);
    if (car) {
        car.toMileage = mileage;
        car.toOil = oil;
        car.toCabin = cabinStatus;
        car.toAir = airStatus;
        car.mileage = parseFloat(mileage); 

        const newTo = {
            date: new Date().toLocaleDateString('uk-UA'),
            mileage: mileage,
            oil: oil,
            cabin: cabinStatus,
            air: airStatus
        };

        car.maintenanceHistory.push(newTo);
        saveGarageToStorage();
        loadCurrentCarData();
    }

    toMileageInput.value = "";
    toOilInput.value = "";
    toCabinCheckbox.checked = false;
    toAirCheckbox.checked = false;
    
    alert("Дані ТО збережено!");
});

function renderHistory() {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;

    const car = garage.find(c => c.id === currentCarId);
    if (!car || car.maintenanceHistory.length === 0) {
        historyList.innerHTML = '<p style="color: #c4c4cc;">Історія порожня...</p>';
        return;
    }
    historyList.innerHTML = '';
    for (let i = car.maintenanceHistory.length - 1; i >= 0; i--) {
        const item = car.maintenanceHistory[i];
        historyList.innerHTML += `
            <div class="history-item">
                <p style="color: #4ea8de; font-weight: bold;">Дата: ${item.date}</p>
                <p><strong>Пробіг:</strong> ${item.mileage} км</p>
                <p><strong>Мастило:</strong> ${item.oil}</p>
                <p><strong>Фільтр салону:</strong> ${item.cabin}</p>
                <p><strong>Повітряний фільтр:</strong> ${item.air}</p>
            </div>
        `;
    }
}

// ==========================================
// 6. ЛОГІКА ТРЕКЕРА ЗАПЧАСТИН
// ==========================================
document.getElementById('add-part-btn').addEventListener('click', function() {
    const nameInput = document.getElementById('part-name-input');
    const replacedInput = document.getElementById('part-replaced-mileage');
    const resourceInput = document.getElementById('part-resource-input');

    const name = nameInput.value;
    const replaced = parseFloat(replacedInput.value);
    const resource = parseFloat(resourceInput.value);
    
    if (name.trim() === "" || isNaN(replaced) || isNaN(resource)) {
        alert("Будь ласка, заповніть всі поля цифрами!");
        return;
    }

    const car = garage.find(c => c.id === currentCarId);
    if (car) {
        const newPart = {
            id: Date.now(),
            name: name,
            replacedAt: replaced,
            resource: resource
        };
        car.trackedParts.push(newPart);
        saveGarageToStorage();
        renderParts();
    }

    nameInput.value = "";
    replacedInput.value = "";
    resourceInput.value = "";
    addPartModal.style.display = 'none';
    
    alert(`Деталь "${name}" успішно додано!`);
});

function renderParts() {
    const partsList = document.getElementById('parts-list');
    if (!partsList) return;

    const car = garage.find(c => c.id === currentCarId);
    if (!car || car.trackedParts.length === 0) {
        partsList.innerHTML = '<p style="color: #c4c4cc;">Жодної деталі ще не додано...</p>';
        return;
    }

    partsList.innerHTML = '';

    car.trackedParts.forEach(function(part) {
        const nextChange = part.replacedAt + part.resource;
        const accurateLeft = nextChange - car.mileage;

        let warningClass = '';
        let leftText = `${accurateLeft} км`;

        if (accurateLeft <= 1000) warningClass = 'warning';
        if (accurateLeft <= 0) leftText = `ПРОСТРОЧЕНО на ${Math.abs(accurateLeft)} км! ⚠️`;

        partsList.innerHTML += `
            <div class="part-item ${warningClass}">
                <h4>${part.name}</h4>
                <p>Замінено на пробігу: <strong>${part.replacedAt} км</strong></p>
                <p>Ресурс деталі: <strong>${part.resource} км</strong></p>
                <p>Наступна заміна на: <strong>${nextChange} км</strong></p>
                <p>Залишилось ходити: <strong style="color: ${accurateLeft <= 1000 ? '#e63946' : '#74c69d'}">${leftText}</strong></p>
                <button class="delete-part-btn" onclick="deletePart(${part.id})">Видалити запис</button>
            </div>
        `;
    });
}

window.deletePart = function(id) {
    if (!confirm("Видалити цю деталь з історії?")) return;
    const car = garage.find(c => c.id === currentCarId);
    if (car) {
        car.trackedParts = car.trackedParts.filter(part => part.id !== id);
        saveGarageToStorage();
        renderParts();
    }
};

// Керування модальними вікнами
document.getElementById('open-history-btn').addEventListener('click', () => historyModal.style.display = 'flex');
document.getElementById('close-history-modal').addEventListener('click', () => historyModal.style.display = 'none');
document.getElementById('open-add-part-modal-btn').addEventListener('click', () => addPartModal.style.display = 'flex');
document.getElementById('close-add-part-modal').addEventListener('click', () => addPartModal.style.display = 'none');
document.getElementById('open-parts-history-modal-btn').addEventListener('click', () => {
    renderParts();
    partsHistoryModal.style.display = 'flex';
});
document.getElementById('close-parts-history-modal').addEventListener('click', () => partsHistoryModal.style.display = 'none');

window.addEventListener('click', function(e) {
    if (e.target === historyModal) historyModal.style.display = 'none';
    if (e.target === addPartModal) addPartModal.style.display = 'none';
    if (e.target === partsHistoryModal) partsHistoryModal.style.display = 'none';
    if (e.target === editNameModal) editNameModal.style.display = 'none';
});