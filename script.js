// Завантажуємо дані або створюємо порожній масив
let parts = JSON.parse(localStorage.getItem('autoParts')) || [];

// Функція для виведення списку на екран
function renderParts() {
    const listContainer = document.getElementById('parts-list');
    listContainer.innerHTML = ''; // Очищаємо перед рендером

    if (parts.length === 0) {
        listContainer.innerHTML = '<p style="text-align:center; color:#777;">Список порожній</p>';
        return;
    }

    parts.forEach(part => {
        const partItem = document.createElement('div');
        partItem.className = 'part-item';
        
        partItem.innerHTML = `
            <div class="part-info">
                <span class="part-name">${part.name}</span>
                <span class="part-km">Пробіг: ${part.current} / ${part.max} км</span>
            </div>
            <div class="part-actions">
                <button class="action-btn edit-btn" onclick="editPart(${part.id})" title="Редагувати">
                    <i class="fas fa-pencil-alt"></i>
                </button>
                <button class="action-btn delete-btn" onclick="deletePart(${part.id})" title="Видалити">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        
        listContainer.appendChild(partItem);
    });
}

// Додавання або збереження відредагованої запчастини
function savePart() {
    const idInput = document.getElementById('part-id').value;
    const nameInput = document.getElementById('part-name').value.trim();
    const currentInput = parseInt(document.getElementById('part-current').value);
    const maxInput = parseInt(document.getElementById('part-max').value);

    if (!nameInput || isNaN(currentInput) || isNaN(maxInput)) {
        alert('Будь ласка, заповніть всі поля коректно!');
        return;
    }

    if (idInput) {
        // Редагування існуючої
        parts = parts.map(part => {
            if (part.id === parseInt(idInput)) {
                return { ...part, name: nameInput, current: currentInput, max: maxInput };
            }
            return part;
        });
    } else {
        // Створення нової
        const newPart = {
            id: Date.now(),
            name: nameInput,
            current: currentInput,
            max: maxInput
        };
        parts.push(newPart);
    }

    saveToStorage();
    resetForm();
    renderParts();
}

// Заповнення форми для редагування
function editPart(id) {
    const part = parts.find(p => p.id === id);
    if (!part) return;

    document.getElementById('part-id').value = part.id;
    document.getElementById('part-name').value = part.name;
    document.getElementById('part-current').value = part.current;
    document.getElementById('part-max').value = part.max;

    document.getElementById('form-title').innerText = 'Редагувати запчастину';
    document.getElementById('save-btn').innerText = 'Зберегти зміни';
    document.getElementById('cancel-btn').style.display = 'block';
    
    // Скролимо вгору до форми, щоб було зручно на мобільному
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Видалення запчастини
function deletePart(id) {
    if (confirm('Ви впевнені, що хочете видалити цю запчастину?')) {
        parts = parts.filter(part => part.id !== id);
        saveToStorage();
        renderParts();
    }
}

// Скидання форми в початковий стан
function resetForm() {
    document.getElementById('part-id').value = '';
    document.getElementById('part-name').value = '';
    document.getElementById('part-current').value = '';
    document.getElementById('part-max').value = '';

    document.getElementById('form-title').innerText = 'Додати запчастину';
    document.getElementById('save-btn').innerText = 'Зберегти';
    document.getElementById('cancel-btn').style.display = 'none';
}

// Збереження в локальну пам'ять
function saveToStorage() {
    localStorage.setItem('autoParts', JSON.stringify(parts));
}

// Запускаємо додаток при завантаженні сторінки
document.addEventListener('DOMContentLoaded', renderParts);