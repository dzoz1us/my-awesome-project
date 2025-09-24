// Получаем элементы со страницы
const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
let lastActive = null; // Чтобы запомнить, какой элемент был в фокусе до открытия модалки

openBtn?.addEventListener('click', openModal);

// 2. Обработчик закрытия модалки по кнопке
closeBtn?.addEventListener('click', () => {
    dlg.close('cancel');
    resetForm();
});

// 3. Валидация и обработка отправки формы
form?.addEventListener('submit', (e) => {
    // 3.1. Сбрасываем кастомные сообщения об ошибках
    const allElements = [...form.elements];
    allElements.forEach(el => {
        if (el.setCustomValidity) {
            el.setCustomValidity('');
        }
        el.removeAttribute('aria-invalid');
    });

    const phoneInput = document.getElementById('phone');
    if (phoneInput && phoneInput.value && !validatePhoneNumber(phoneInput)) {
        e.preventDefault();
        phoneInput.focus();
        phoneInput.setCustomValidity('Введите корректный номер телефона (минимум 11 цифр)');
        phoneInput.setAttribute('aria-invalid', 'true');
        form.reportValidity();
        return;
    }
    

    
    // 3.2. Проверяем валидность всей формы
    if (!form.checkValidity()) {
        e.preventDefault(); // Отменяем стандартную отправку

        // 3.3. Показываем стандартные браузерные сообщения
        form.reportValidity();

        // 3.4. Помечаем невалидные поля для доступности
        allElements.forEach(el => {
            if (el.willValidate && !el.checkValidity()) {
                el.setAttribute('aria-invalid', 'true');
            }
        });
        return;
    }

    // 3.6. Если форма валидна, обрабатываем "успешную отправку"
    e.preventDefault();
    alert('Форма успешно отправлена! Мы свяжемся с вами в ближайшее время.');
    dlg.close('success');
    form.reset();
});

// 4. После закрытия модалки возвращаем фокус на кнопку
dlg?.addEventListener('close', () => {
    resetForm();
    lastActive?.focus();
});

function initPhoneMask() {
    const phoneInput = document.getElementById('phone');
    
    if (!phoneInput) return;
    
    // Переменная для отслеживания предыдущего значения
    let previousValue = '';
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value;
        
        // Если пользователь удаляет символы - разрешаем это
        if (value.length < previousValue.length) {
            previousValue = value;
            return;
        }
        
        // Удаляем все нецифровые символы
        let digits = value.replace(/\D/g, '');
        
        // Если номер начинается с 8, заменяем на 7
        if (digits.startsWith('8')) {
            digits = '7' + digits.slice(1);
        }
        
        // Если номер не начинается с 7, добавляем 7 в начало
        if (!digits.startsWith('7') && digits.length > 0) {
            digits = '7' + digits;
        }
        
        // Ограничиваем длину 11 цифрами (7 + 10 цифр номера)
        digits = digits.slice(0, 11);
        
        // Форматируем номер
        let formattedValue = '';
        if (digits.length > 0) {
            formattedValue = '+7';
            
            if (digits.length > 1) {
                formattedValue += ' (' + digits.slice(1, 4);
            }
            if (digits.length >= 5) {
                formattedValue += ') ' + digits.slice(4, 7);
            }
            if (digits.length >= 8) {
                formattedValue += '-' + digits.slice(7, 9);
            }
            if (digits.length >= 10) {
                formattedValue += '-' + digits.slice(9, 11);
            }
        }
        
        // Обновляем значение только если оно изменилось
        if (formattedValue !== value) {
            e.target.value = formattedValue;
        }
        
        previousValue = formattedValue;
    });
    
    // Разрешаем свободное удаление
    phoneInput.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' || e.key === 'Delete') {
            // Разрешаем стандартное поведение браузера
            return true;
        }
    });
    
    // Валидация при потере фокуса
    phoneInput.addEventListener('blur', function(e) {
        validatePhoneNumber(e.target);
    });
}

// Функция валидации номера
function validatePhoneNumber(input) {
    // Минимальная валидация - хотя бы 11 цифр
    const digits = input.value.replace(/\D/g, '');
    const isValid = digits.length >= 11;
    
    if (!isValid && input.value) {
        input.setCustomValidity('Введите корректный номер телефона (минимум 11 цифр)');
        input.setAttribute('aria-invalid', 'true');
    } else {
        input.setCustomValidity('');
        input.removeAttribute('aria-invalid');
    }
    
    return isValid;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initPhoneMask();
    
    // Остальной код инициализации...
});

// Функция сброса формы
function resetForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.reset();
        
        // Сбрасываем кастомные сообщения об ошибках
        const allElements = [...form.elements];
        allElements.forEach(el => {
            if (el.setCustomValidity) {
                el.setCustomValidity('');
            }
            el.removeAttribute('aria-invalid');
        });
    }
}

// Функция открытия модалки с сбросом формы
function openModal() {
    resetForm(); // Сбрасываем форму перед открытием
    lastActive = document.activeElement;
    dlg.showModal();
    dlg.querySelector('input, select, textarea, button')?.focus();
}