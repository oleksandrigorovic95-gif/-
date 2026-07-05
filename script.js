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

// Посилання на форми введення ТО
const carNameInput = document.getElementById('car-name-input');
const mileageInput = document.getElementById('mileage-input');
const toMileageInput = document.getElementById('to-mileage-input');
const toOilInput = document.getElementById('to-oil-input');
const toCabinCheckbox = document.getElementById('to-cabin-checkbox');
const toAirCheckbox = document.getElementById('to-air-checkbox');

// Кнопки головного екрана
const updateMileageBtn = document.getElementById('update-mileage-btn');
const saveToBtn = document.getElementById('save-to-btn');

// Модальні вікна (для бічного меню та зміни назви)
const editNameModal = document.getElementById('edit-name-modal');
const sideMenu = document.getElementById('side-menu');

// Завантаження даних при відкритті сторінки
window.addEventListener('DOMContentLoaded', function() {
    const savedGarage = localStorage.getItem('garage');
    const savedCurrentId = localStorage.getItem('currentCarId');

    if (savedGarage) {
        garage = JSON.parse(savedGarage);
    }

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

function loadCurrentCarData() {
    const car = garage.find(c => c.id === currentCarId);
    if (!car) return;

    if (carNameDisplay) {
        carNameDisplay.textContent = car.name;
    }
    
    if (currentMileageDisplay) currentMileageDisplay.textContent = car.mileage;
    if (lastToMileage) lastToMileage.textContent = car.toMileage;
    if (lastToOil) lastToOil.textContent = car.toOil;
    if (lastToCabin) lastToCabin.textContent = car.toCabin;
    if (lastToAir) lastToAir.textContent = car.toAir;

    renderHistory();
    renderParts();
}

// ==========================================
// 2. БІЧНЕ МЕНЮ (ГАРАЖ)
// ==========================================
if (document.getElementById('open-sidebar-btn')) {
    document.getElementById('open-sidebar-btn').addEventListener('click', () => sideMenu.style.left = '0px');
}
if (document.getElementById('close-sidebar')) {
    document.getElementById('close-sidebar').addEventListener('click', () => sideMenu.style.left = '-280px');
}

if (document.getElementById('add-new-car-btn')) {
    document.getElementById('add-new-car-btn').addEventListener('click', function() {
        const input = document.getElementById('new-car-name-input');
        if (!input || input.value.trim() === "") return;

        const newCar = createNewCarObject(input.value.trim());
        garage.push(newCar);
        currentCarId = newCar.id; 
        
        saveGarageToStorage();
        loadCurrentCarData();
        renderGarageMenu();
        
        input.value = "";
        sideMenu.style.left = '-280px'; 
    });
}

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
if (document.getElementById('edit-car-name-btn')) {
    document.getElementById('edit-car-name-btn').addEventListener('click', () => {
        const car = garage.find(c => c.id === currentCarId);
        if (car && carNameInput) {
            carNameInput.value = car.name;
        }
        if (editNameModal) editNameModal.style.display = 'flex';
    });
}

if (document.getElementById('close-edit-name-modal')) {
    document.getElementById('close-edit-name-modal').addEventListener('click', () => editNameModal.style.display = 'none');
}

const saveCarBtn = document.getElementById('save-car-btn');
if (saveCarBtn) {
    saveCarBtn.addEventListener('click', function() {
        const newName = carNameInput.value.trim();
        if (newName !== "") {
            const car = garage.find(c => c.id === currentCarId);
            if (car) car.name = newName;
            if (carNameDisplay) carNameDisplay.textContent = newName;
            saveGarageToStorage();
            renderGarageMenu();
        }
        if (editNameModal) editNameModal.style.display = 'none';
    });
}

// ==========================================
// 4. ОНОВЛЕННЯ ПРОБІГУ
// ==========================================
if (updateMileageBtn) {
    updateMileageBtn.addEventListener('click', function() {
        if (!mileageInput) return;
        const newMileage = parseFloat(mileageInput.value);
        if (!isNaN(newMileage) && newMileage >= 0) {
            const car = garage.find(c => c.id === currentCarId);
            if (car) {
                car.mileage = newMileage;
                if (currentMileageDisplay) currentMileageDisplay.textContent = newMileage;
                saveGarageToStorage();
                renderParts();
            }
            mileageInput.value = "";
        }
    });
}

// ==========================================
// 5. ДОДАВАННЯ ТА ВИВЕДЕННЯ ТО
// ==========================================
if (saveToBtn) {
    saveToBtn.addEventListener('click', function() {
        const mileage = toMileageInput.value;
        const oil = toOilInput.value;
        
        if (mileage.trim() === "" || oil.trim() === "") {
            alert("Будь ласка, заповніть пробіг та назву мастила!");
            return;
        }

        const cabinStatus = (toCabinCheckbox && toCabinCheckbox.checked) ? "Замінено" : "Ні";
        const airStatus = (toAirCheckbox && toAirCheckbox.checked) ? "Замінено" : "Ні";

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
        if (toCabinCheckbox) toCabinCheckbox.checked = false;
        if (toAirCheckbox) toAirCheckbox.checked = false;
        
        alert("Дані ТО збережено!");
    });
}

function renderHistory() {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;

    const car = garage.find(c => c.id === currentCarId);
    if (!car || !car.maintenanceHistory || car.maintenanceHistory.length === 0) {
        historyList.innerHTML = '<p style="color: #c4c4cc; text-align: center; padding: 10px;">Історія порожня...</p>';
        return;
    }
    historyList.innerHTML = '';
    for (let i = car.maintenanceHistory.length - 1; i >= 0; i--) {
        const item = car.maintenanceHistory[i];
        historyList.innerHTML += `
            <div class="history-item" style="background: #2d2d35; padding: 10px; margin-bottom: 10px; border-radius: 6px;">
                <p style="color: #4ea8de; font-weight: bold; margin: 0 0 5px 0;">Дата: ${item.date}</p>
                <p style="margin: 3px 0;"><strong>Пробіг:</strong> ${item.mileage} км</p>
                <p style="margin: 3px 0;"><strong>Мастило:</strong> ${item.oil}</p>
                <p style="margin: 3px 0;"><strong>Фільтр салону:</strong> ${item.cabin}</p>
                <p style="margin: 3px 0;"><strong>Повітряний фільтр:</strong> ${item.air}</p>
            </div>
        `;
    }
}

// ==========================================
// 6. ЛОГІКА ТРЕКЕРА ЗАПЧАСТИН (ПРЯМО НА ЕКРАНІ)
// ==========================================
const addPartBtn = document.getElementById('add-part-btn');
if (addPartBtn) {
    addPartBtn.addEventListener('click', function() {
        const nameInput = document.getElementById('part-name-input');
        const replacedInput = document.getElementById('part-replaced-mileage');
        const resourceInput = document.getElementById('part-resource-input');

        if (!nameInput || !replacedInput || !resourceInput) return;

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
            if (!car.trackedParts) car.trackedParts = [];
            car.trackedParts.push(newPart);
            saveGarageToStorage();
            renderParts();
        }

        nameInput.value = "";
        replacedInput.value = "";
        resourceInput.value = "";
        
        alert(`Деталь "${name}" успішно додано!`);
    });
}

function renderParts() {
    const partsList = document.getElementById('parts-list');
    if (!partsList) return;

    const car = garage.find(c => c.id === currentCarId);
    if (!car || !car.trackedParts || car.trackedParts.length === 0) {
        partsList.innerHTML = '<p style="color: #c4c4cc; text-align: center; padding: 10px;">Жодної деталі ще не додано...</p>';
        return;
    }

    partsList.innerHTML = '';

    car.trackedParts.forEach(function(part) {
        const nextChange = part.replacedAt + part.resource;
        const accurateLeft = nextChange - car.mileage;

        let warningStyle = '';
        let leftText = `${accurateLeft} км`;

        if (accurateLeft <= 1000) warningStyle = 'border: 1px solid #e63946; background: #2b1b20;';
        if (accurateLeft <= 0) leftText = `ПРОСТРОЧЕНО на ${Math.abs(accurateLeft)} км! ⚠️`;

        partsList.innerHTML += `
            <div class="part-item" style="background: #2d2d35; padding: 12px; margin-bottom: 10px; border-radius: 8px; ${warningStyle}">
                <h4 style="margin: 0 0 8px 0; color: #74c69d;">${part.name}</h4>
                <p style="margin: 4px 0; font-size: 14px;">Замінено на пробігу: <strong>${part.replacedAt} км</strong></p>
                <p style="margin: 4px 0; font-size: 14px;">Ресурс деталі: <strong>${part.resource} км</strong></p>
                <p style="margin: 4px 0; font-size: 14px;">Наступна заміна на: <strong>${nextChange} км</strong></p>
                <p style="margin: 4px 0; font-size: 14px;">Залишилось ходити: <strong style="color: ${accurateLeft <= 1000 ? '#e63946' : '#74c69d'}">${leftText}</strong></p>
                <button class="delete-part-btn" onclick="deletePart(${part.id})" style="background: #e63946; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; margin-top: 8px; font-size: 12px;">Видалити запис</button>
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

// ==========================================
// 7. КЕРУВАННЯ МОДАЛЬНИМИ ВІКНАМИ ТО (ОКРЕМА КНОПКА)
// ==========================================
const historyModal = document.getElementById('history-modal');
const openHistoryBtn = document.getElementById('open-history-btn');

if (openHistoryBtn && historyModal) {
    openHistoryBtn.addEventListener('click', () => {
        renderHistory();
        historyModal.style.display = 'flex';
    });
}

const closeHistoryModal = document.getElementById('close-history-modal');
if (closeHistoryModal && historyModal) {
    closeHistoryModal.addEventListener('click', () => historyModal.style.display = 'none');
}

window.addEventListener('click', function(e) {
    if (historyModal && e.target === historyModal) historyModal.style.display = 'none';
    if (editNameModal && e.target === editNameModal) editNameModal.style.display = 'none';
});
