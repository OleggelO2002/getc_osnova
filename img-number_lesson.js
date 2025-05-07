document.querySelectorAll('[class*="training-row"]').forEach(function(row, index) {
  const imageUrl = row.getAttribute('data-training-image');
  if (imageUrl) {
    const fullUrl = imageUrl.startsWith('http') ? imageUrl : 'https:' + imageUrl;

    // Находим первую ячейку (td) в строке — или нужную тебе
    const firstTd = row.querySelector('td');
    if (!firstTd) return;

    // Добавляем класс и position: relative
    const uniqueClass = 'training-image-after-' + index;
    firstTd.classList.add(uniqueClass);
    firstTd.style.position = 'relative';

    // Создаем CSS
    const style = document.createElement('style');
    style.textContent = `
      .${uniqueClass}::after {
        content: '';
        position: absolute;
        top: 10px;
        right: 10px;
        width: 100px;
        height: 100px;
        background-image: url('${fullUrl}');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        border-radius: 10px;
      }
    `;
    document.head.appendChild(style);
  }
});


document.addEventListener("DOMContentLoaded", function () {
    const elements = document.querySelectorAll(".user-state-label.user-state-label-ex");
    elements.forEach(element => {
        const text = element.textContent.trim();
        if (text === "Необходимо выполнить задание (стоп-урок)" || text === "Необходимо выполнить задание") {
            element.textContent = "Важное задание";
        }
    });
});


        // 3. Нумерация уроков (только тем, у кого есть .item-main-td)
        const tdElements = document.querySelectorAll('.lesson-list li table td.item-main-td');
        tdElements.forEach((td, index) => {
            const lessonNumber = index + 1;
            const lessonIdClass = 'lesson-id-' + lessonNumber;
            td.classList.add(lessonIdClass);

            if (!td.querySelector('.lesson-number')) {
                const afterElement = document.createElement('span');
                afterElement.textContent = "Урок №" + lessonNumber;
                afterElement.classList.add('lesson-number');
                td.appendChild(afterElement);
            }
        });
    }

    function waitForLessons() {
        const hasLessons = document.querySelectorAll('.lesson-list li').length > 0;

        if (hasLessons) {
            processLessons();

            // Подключаем наблюдатель на все lesson-list
            document.querySelectorAll('.lesson-list').forEach(list => {
                const observer = new MutationObserver(() => processLessons());
                observer.observe(list, { childList: true, subtree: true });
            });

        } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(waitForLessons, 300);
        } else {
            console.warn("Уроки не были найдены вовремя.");
        }
    }

    waitForLessons();
});
