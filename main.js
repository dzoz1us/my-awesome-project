// Получаем элементы со страницы
const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
let lastActive = null; // Чтобы запомнить, какой элемент был в фокусе до открытия модалки

// 1. Обработчик открытия модалки
openBtn?.addEventListener('click', () => {
    lastActive = document.activeElement; // Запоминаем активный элемент
    dlg.showModal(); // Показываем модалку
    // Переносим фокус на первое поле ввода внутри модалки
    dlg.querySelector('input, select, textarea, button')?.focus();
});

// 2. Обработчик закрытия модалки по кнопке
closeBtn?.addEventListener('click', () => {
    dlg.close('cancel');
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

    // 3.5. Если форма валидна, обрабатываем "успешную отправку"
    e.preventDefault(); // Заглушка, т.к. бэкенда нет

    // Здесь можно показать сообщение об успехе, например:
    alert('Форма успешно отправлена! Спасибо!');

    // Закрываем модалку и сбрасываем форму
    dlg.close('success');
    form.reset();
});

// 4. После закрытия модалки возвращаем фокус на кнопку
dlg?.addEventListener('close', () => {
    lastActive?.focus();
});