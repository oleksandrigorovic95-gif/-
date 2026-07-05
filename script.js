// ==========================================
// 1. ІНІЦІАЛІЗАЦІЯ ДАНИХ ТА СТРУКТУРИ ГАРАЖА
// ==========================================

let garage = JSON.parse(localStorage.getItem('garageData')) || [
    {
        id: Date.now(),
        name: "Passat B5+",
        mileage: 180000,
        toMileage: 180000,
        toOil: "5W-40",
        toCabin: false,
        toAir: false,
        history: [],
        parts: []
    }
];

let activeCarId = localStorage.getItem('activeCarId') ? Number(localStorage.getItem('activeCarId')) : (garage[0] ? garage[0].id : null);

function getActiveCar() {
    return garage.find(car => car.id === activeCarId) || garage[0];
}

function saveGarage() {
    localStorage.setItem('garageData', JSON.stringify(garage));
    if (getActiveCar()) {
        localStorage.setItem('activeCarId', activeCarId);
    }
}

// ==========================================
// 2. ФУНКЦІЯ ОНОВЛЕННЯ ІНТЕРФЕЙСУ (UI)
// ==========================================
function updateUI() {
    const car = getActiveCar();
    
    // Безпечно оновлюємо назву авто
    const carNameDisplay = document.getElementById('car-name-display');
    if (carNameDisplay) carNameDisplay.textContent = car ? car.name : "Немає авто";

    // Безпечно оновлюємо пробіг
    const currentMileage = document.getElementById('current-mileage');
    if (currentMileage) currentMileage.textContent = car ? car.mileage : "0";

    // Безпечно оновлюємо картку ТО
    const lastToMileage = document.getElementById('last-to-mileage');
    const lastToOil = document.getElementById('last-to-oil');
    const lastToCabin = document.getElementById('last-to-cabin');
    const lastToAir = document.getElementById('last-to-air');

    if (lastToMileage) lastToMileage.textContent = (car && car.toMileage) ? car.toMileage : "—";
    if (lastToOil) lastToOil.textContent = (car && car.toOil) ? car.toOil : "—";
    if (lastToCabin) lastToCabin.textContent = car ? (car.toCabin ? "Замінено ✅" : "Ні ❌") : "—";
    if (lastToAir) lastToAir.textContent = car ? (car.toAir ? "Замінено ✅" : "Ні ❌") : "—";

    // Запуск рендерингу списків
    renderCarsList();
    renderHistory();
    renderParts();
}

// ==========================================
// 3. ЛОГІКА ДЛЯ ГАРАЖА (БІЧНЕ МЕНЮ)
// ==========================================
const sideMenu = document.getElementById('side-menu');
const openSidebarBtn = document.getElementById('open-sidebar-btn');
const closeSidebar = document.getElementById('close-sidebar');

if (openSidebarBtn && sideMenu) {
    openSidebarBtn.addEventListener('click', () => sideMenu.classList.add('open'));
}
if (closeSidebar && sideMenu) {
    closeSidebar.addEventListener('click', () => sideMenu.classList.remove('open'));
}

// Додавання нового авто
const addNewCarBtn = document.getElementById('add-new-car-btn');
const newCarNameInput = document.getElementById('new-car-name-input');

if (addNewCarBtn && newCarNameInput) {
    addNewCarBtn.addEventListener('click', () => {
        const name = newCarNameInput.value.trim();
        if (!name) return alert("Введіть марку авто!");

        const newCar = {
            id: Date.now(),
            name: name,
            mileage: 0,
            toMileage: 0,
            toOil: "",
            toCabin: false,
            toAir: false,
            history: [],
            parts: []
        };

        garage.push(newCar);
        activeCarId = newCar.id;
        newCarNameInput.value = '';
        saveGarage();
        updateUI();
    });
}

function renderCarsList() {
    const carsList = document.getElementById('cars-list');
    if (!carsList) return;
    carsList.innerHTML = '';
    
    garage.forEach(car => {
        const div = document.createElement('div');
        div.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 8px; background: #29292e; border-radius: 5px; cursor: pointer;";
        if (car.id === activeCarId) div.style.border = "1px solid #74c69d";

        const span = document.createElement('span');
        span.textContent = `${car.name} (${car.mileage} км)`;
        span.addEventListener('click', () => {
            activeCarId = car.id;
            saveGarage();
            updateUI();
            if (sideMenu) sideMenu.classList.remove('open');
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "🗑️";
        deleteBtn.style.cssText = "background: none; border: none; cursor: pointer;";
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Видалити ${car.name} з гаража?`)) {
                garage = garage.filter(c => c.id !== car.id);
                if (activeCarId === car.id) {
                    activeCarId = garage[0] ? garage[0].id : null;
                }
                saveGarage();
                updateUI();
            }
        });

        div.appendChild(span);
        div.appendChild(deleteBtn);
        carsList.appendChild(div);
    });
}

// ==========================================
// 4. МОДАЛЬНЕ ВІКНО: РЕДАГУВАННЯ НАЗВИ
// ==========================================
const editCarNameBtn = document.getElementById('edit-car-name-btn');
const editNameModal = document.getElementById('edit-name-modal');
const carNameInput = document.getElementById('car-name-input');
const saveCarBtn = document.getElementById('save-car-btn');
const closeEditNameModal = document.getElementById('close-edit-name-modal');

if (editCarNameBtn && editNameModal && carNameInput) {
    editCarNameBtn.addEventListener('click', () => {
        const car = getActiveCar();
        if (car) {
            carNameInput.value = car.name;
            editNameModal.style.display = 'block';
        }
    });
}

if (closeEditNameModal && editNameModal) {
    closeEditNameModal.addEventListener('click', () => editNameModal.style.display = 'none');
}

if (saveCarBtn && editNameModal && carNameInput) {
    saveCarBtn.addEventListener('click', () => {
        const car = getActiveCar();
        const newName = carNameInput.value.trim();
        if (car && newName) {
            car.name = newName;
            saveGarage();
            updateUI();
            editNameModal.style.display = 'none';
        }
    });
}

// ==========================================
// 5. ОНОВЛЕННЯ ПРОБІГУ
// ==========================================
const updateMileageBtn = document.getElementById('update-mileage-btn');
if (updateMileageBtn) {
    updateMileageBtn.addEventListener('click', () => {
        const car = getActiveCar();
        const input = document.getElementById('mileage-input');
        if (!input) return;
        const newMileage = parseInt(input.value);

        if (car && !isNaN(newMileage) && newMileage >= 0) {
            car.mileage = newMileage;
            input.value = '';
            saveGarage();
            updateUI();
        }
    });
}

// ==========================================
// 6. ЗАПИС НОВОГО ТО
// ==========================================
const saveToBtn = document.getElementById('save-to-btn');
if (saveToBtn) {
    saveToBtn.addEventListener('click', () => {
        const car = getActiveCar();
        if (!car) return;

        const toMileageInput = parseInt(document.getElementById('to-mileage-input').value);
        const toOilInput = document.getElementById('to-oil-input').value.trim();
        const toCabinCheckbox = document.getElementById('to-cabin-checkbox').checked;
        const toAirCheckbox = document.getElementById('to-air-checkbox').checked;

        if (isNaN(toMileageInput)) return alert("Введіть коректний пробіг ТО");

        car.toMileage = toMileageInput;
        car.toOil = toOilInput || "Не вказано";
        car.toCabin = toCabinCheckbox;
        car.toAir = toAirCheckbox;

        let works = [`Заміна мастила (${car.toOil})`];
        if (toCabinCheckbox) works.push("Фільтр салону");
        if (toAirCheckbox) works.push("Повітряний фільтр");

        car.history.unshift({
            date: new Date().toLocaleDateString('uk-UA'),
            mileage: toMileageInput,
            work: works.join(', ')
        });

        document.getElementById('to-mileage-input').value = '';
        document.getElementById('to-oil-input').value = '';
        document.getElementById('to-cabin-checkbox').checked = false;
        document.getElementById('to-air-checkbox').checked = false;

        saveGarage();
        updateUI();
        alert("Дані ТО успішно збережено!");
    });
}

// ==========================================
// 7. БЕЗПЕЧНЕ НАЛАШТУВАННЯ МОДАЛОК
// ==========================================
function safeModalSetup(openBtnId, modalId, closeBtnId) {
    const openBtn = document.getElementById(openBtnId);
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeBtnId);

    if (openBtn && modal) {
        openBtn.addEventListener('click', () => modal.style.display = 'block');
    }
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => modal.style.display = 'none');
    }
}

// Налаштовуємо вікна (навіть якщо якогось ID немає в HTML, додаток НЕ зламається)
safeModalSetup('open-history-btn', 'history-modal', 'close-history-modal');
safeModalSetup('open-add-part-modal-btn', 'add-part-modal', 'close-add-part-modal');
safeModalSetup('open-parts-history-modal-btn', 'parts-history-modal', 'close-parts-history-modal');

// Закриття вікон по кліку на сірий фон навколо
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

// ==========================================
// 8. ЗБЕРЕЖЕННЯ ДЕТАЛІ
// ==========================================
const addPartBtn = document.getElementById('add-part-btn');
if (addPartBtn) {
    addPartBtn.addEventListener('click', () => {
        const car = getActiveCar();
        if (!car) return;

        const nameInput = document.getElementById('part-name-input');
        const mileageInput = document.getElementById('part-replaced-mileage');
        const resourceInput = document.getElementById('part-resource-input');

        if (!nameInput || !mileageInput || !resourceInput) return;

        const name = nameInput.value.trim();
        const replacedMileage = parseInt(mileageInput.value);
        const resource = parseInt(resourceInput.value);

        if (!name || isNaN(replacedMileage) || isNaN(resource)) return alert("Заповніть усі поля деталі!");

        car.parts.unshift({ name, replacedMileage, resource });

        nameInput.value = '';
        mileageInput.value = '';
        resourceInput.value = '';

        saveGarage();
        updateUI();
        
        const addPartModal = document.getElementById('add-part-modal');
        if (addPartModal) addPartModal.style.display = 'none';
    });
}

// ==========================================
// 9. РЕНДЕРИНГ СПИСКІВ
// ==========================================
function renderHistory() {
    const container = document.getElementById('history-list');
    if (!container) return;
    const car = getActiveCar();

    if (!car || car.history.length === 0) {
        container.innerHTML = '<p style="color: #c4c4cc;">Історія порожня...</p>';
        return;
    }

    container.innerHTML = car.history.map(item => `
        <div style="padding: 10px; background: #29292e; margin-bottom: 8px; border-radius: 5px;">
            <span style="color: #74c69d; font-weight: bold;">${item.date}</span> — <strong>${item.mileage} км</strong>
            <p style="margin: 5px 0 0 0; color: #e1e1e6;">${item.work}</p>
        </div>
    `).join('');
}

function renderParts() {
    const container = document.getElementById('parts-list');
    if (!container) return;
    const car = getActiveCar();

    if (!car || car.parts.length === 0) {
        container.innerHTML = '<p style="color: #c4c4cc;">Жодної деталі ще не додано...</p>';
        return;
    }

    container.innerHTML = car.parts.map(part => {
        const passed = car.mileage - part.replacedMileage;
        const left = part.resource - passed;
        const percent = Math.max(0, Math.min(100, (left / part.resource) * 100));
        
        let statusColor = "#74c69d";
        if (percent < 20) statusColor = "#e63946";
        else if (percent < 50) statusColor = "#ffb703";

        return `
            <div style="padding: 12px; background: #29292e; margin-bottom: 10px; border-radius: 5px;">
                <div style="display: flex; justify-content: space-between; font-weight: bold;">
                    <span>${part.name}</span>
                    <span style="color: ${statusColor}">${Math.round(percent)}% ресурсу</span>
                </div>
                <p style="margin: 5px 0; font-size: 14px; color: #c4c4cc;">
                    Замінено на: ${part.replacedMileage} км | Пройдено: ${passed} км
                </p>
                <p style="margin: 0; font-size: 14px; font-weight: 500;">
                    Залишилось ходити: <span style="color: ${statusColor}">${left > 0 ? left + ' км' : 'Потрібна заміна! ⚠️'}</span>
                </p>
            </div>
        `;
    }).join('');
}

// ==========================================
// 10. СТАРТ
// ==========================================
updateUI();