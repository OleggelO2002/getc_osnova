const container = document.querySelector('.container');

// Создаем обёртку баннера
const bannerWrapper = document.createElement('div');
bannerWrapper.classList.add('custom-banner');

// Создаем тег <img>
const img = document.createElement('img');

if (window.innerWidth <= 768) {
  // Мобильная версия
  img.src = 'https://static.tildacdn.com/tild6266-3566-4166-b565-353935386661/Group_48097271.png';
} else {
  // Десктопная версия
  img.src = 'https://static.tildacdn.info/tild3636-3765-4834-b862-323336663562/Frame_279.png';
}

img.alt = 'Banner Image';
img.style.width = '100%';
img.style.height = 'auto';

bannerWrapper.appendChild(img);

// Только для десктопа — добавляем текст и кнопки
if (window.innerWidth > 768) {
  // Добавляем текст
  const bannerText = document.createElement('div');
  bannerText.classList.add('banner-text');
  bannerText.textContent = 'Искусство построения отношений между мужчиной и женщиной'; // Меняй текст здесь
  bannerWrapper.appendChild(bannerText);

  // Создаём обёртку для кнопок
  const buttonGroup = document.createElement('div');
  buttonGroup.classList.add('banner-buttons');

  // Массив с данными для кнопок (название и ссылки)
  const buttonsData = [
    { label: 'Работа с наставником', link: 'https://example1.com' },
    { label: 'Расписание', link: 'https://example2.com' },
    { label: 'Отчет', link: 'https://example3.com' }
  ];

  // Создаем кнопки с ссылками
  buttonsData.forEach(data => {
    const buttonLink = document.createElement('a');
    buttonLink.href = data.link;
    buttonLink.classList.add('banner-button');
    buttonLink.textContent = data.label;
    buttonGroup.appendChild(buttonLink);
  });

  bannerWrapper.appendChild(buttonGroup);
}

// Добавляем баннер в начало контейнера
container.prepend(bannerWrapper);
