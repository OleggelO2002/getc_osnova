document.addEventListener('DOMContentLoaded', function () {
  function insertBanner(targetElement, isApp = false) {
    const bannerWrapper = document.createElement('div');
    bannerWrapper.classList.add('custom-banner');

    // Приложению добавляем дополнительные стили
    if (isApp) {
      bannerWrapper.style.maxWidth = '90vw';
      bannerWrapper.style.margin = '0 auto';
    }

    // Изображение
    const img = document.createElement('img');
    img.alt = 'Banner Image';
    img.style.width = '100%';
    img.style.height = 'auto';

    if (window.innerWidth <= 768) {
      img.src = 'https://static.tildacdn.info/tild6163-6164-4136-b063-633465616136/Frame_290.png';
    } else {
      img.src = 'https://static.tildacdn.info/tild3636-3765-4834-b862-323336663562/Frame_279.png';
    }

    bannerWrapper.appendChild(img);

    // Текст
    const bannerText = document.createElement('div');
    bannerText.classList.add('banner-text');
    bannerText.textContent = 'Искусство построения отношений между мужчиной и женщиной';
    bannerWrapper.appendChild(bannerText);

    // Кнопки
    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('banner-buttons');

    const buttonsData = [
      {
        label: 'Отзывы ДО/ПОСЛЕ',
        link: 'https://asanna.online/pl/teach/control/lesson/view?id=342464869'
      }
    ];

    buttonsData.forEach(data => {
      const buttonLink = document.createElement('a');
      buttonLink.href = data.link;
      buttonLink.classList.add('banner-button');
      buttonLink.textContent = data.label;
      buttonGroup.appendChild(buttonLink);
    });

    bannerWrapper.appendChild(buttonGroup);

    targetElement.parentNode.insertBefore(bannerWrapper, targetElement);
  }

  const container = document.querySelector('.container');

  if (container) {
    container.prepend = container.prepend || function (el) { this.insertBefore(el, this.firstChild); };
    insertBanner(container.firstChild || container);
  } else {
    const streamTable = document.querySelector('.xdget-root');
    if (streamTable) {
      insertBanner(streamTable, true); // <- передаём флаг, что это приложение
    }
  }
});



document.addEventListener('DOMContentLoaded', function () {
  const targetContainer = document.querySelector('.col-md-4');
  if (!targetContainer) return;

  if (targetContainer.querySelector('.xdget-lessonSchedule')) return;

  fetch('/teach/control/stream/index')
    .then(response => response.text())
    .then(htmlText => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      const lessonSchedule = doc.querySelector('.xdget-lessonSchedule');

      if (lessonSchedule) {
        const clone = lessonSchedule.cloneNode(true);
        targetContainer.appendChild(clone);
      }
    })
    .catch(err => {
      console.error('Ошибка при загрузке расписания:', err);
    });
});
