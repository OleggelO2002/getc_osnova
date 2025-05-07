// ======= Отвечает за поиск - обработчик + HTML ======= 
// Этот блок добавляет обработчик для поля поиска и отображает результаты
// ==========================================================================

// HTML-код для мобильной версии
const searchContainerHTMLMobile = `
  <div id="searchContainerMobile" style="position: relative; z-index: 1000; display: flex; align-items: center; background-color: white; border-radius: 20px; overflow: hidden; width: 40px; transition: width 0.3s ease;">
    <img src="https://static.tildacdn.info/tild3764-3665-4662-b664-373066626139/Search_Magnifying_Gl.svg" alt="Search" style="width: 20px; height: 20px; margin: 10px; cursor: pointer;">
    <input type="text" id="searchInputMobile" placeholder="Введите название тренинга или урока" style="border: none; outline: none; flex-grow: 1; padding: 5px; display: none;">
    <div id="searchResultsMobile" style="display: none; position: absolute; top: 100%; left: 0; width: 100%; background-color: white; border: 1px solid #ccc; border-radius: 5px; max-height: 200px; overflow-y: auto; z-index: 1001;"></div>
  </div>
`;

// HTML-код для десктопной версии
const searchContainerHTMLDesktop = `
  <div id="searchWrapper" style="width: 100%; background-color: #f8f8f8; padding: 10px; box-sizing: border-box;">
    <div id="searchContainer" style="position: relative; z-index: 1000; display: flex; align-items: center; background-color: white; border-radius: 20px; padding: 0 10px;">
      <img src="https://static.tildacdn.info/tild3764-3665-4662-b664-373066626139/Search_Magnifying_Gl.svg" alt="Search" style="width: 20px; height: 20px; margin-right: 10px;">
      <input type="text" id="searchInput" placeholder="Введите название тренинга или урока" style="border: none; outline: none; flex-grow: 1;">
      <div id="searchResults" style="display: none; position: absolute; top: 100%; left: 0; width: 100%; background-color: white; border: 1px solid #ccc; border-radius: 5px; max-height: 200px; overflow-y: auto; z-index: 1001;"></div>
    </div>
  </div>
`;

// Функция для добавления HTML-кода в нужные элементы
function addSearchContainer() {
  const isMobile = window.innerWidth <= 768;
  const isTrainingPage = window.location.href.includes('/teach/control/stream/view/id/');
  const isLessonPage = window.location.href.includes('/pl/teach/control/lesson/view/');

  if (isMobile) {
    const mobileObserver = new MutationObserver(() => {
      const leftBar = document.querySelector('.gc-account-leftbar');
      if (leftBar && !leftBar.querySelector('#searchContainerMobile')) {
        leftBar.insertAdjacentHTML('afterbegin', searchContainerHTMLMobile);

        const searchContainer = document.getElementById('searchContainerMobile');
        const searchInput = document.getElementById('searchInputMobile');
        const searchIcon = searchContainer.querySelector('img');
        const searchResults = document.getElementById('searchResultsMobile');

        searchIcon.addEventListener('click', (event) => {
          event.stopPropagation();
          const isExpanded = searchContainer.style.width === '72vw';
          searchContainer.style.width = isExpanded ? '40px' : '72vw';
          searchInput.style.display = isExpanded ? 'none' : 'block';
          searchResults.style.display = 'none';
        });

        searchInput.addEventListener('input', () => {
          searchResults.style.display = 'block';
          searchResults.innerHTML = `<p>Результаты для "${searchInput.value}"</p>`;
        });

        document.addEventListener('click', (event) => {
          if (!searchContainer.contains(event.target)) {
            searchContainer.style.width = '40px';
            searchInput.style.display = 'none';
            searchResults.style.display = 'none';
          }
        });
      }
    });

    mobileObserver.observe(document.body, { childList: true, subtree: true });
  } else {
    const desktopObserver = new MutationObserver(() => {
      const breadcrumbs = document.querySelector('.breadcrumbs');
      const mainContentUser = document.querySelector('.gc-main-content.gc-both-main-content.no-menu.account-page-content.with-left-menu.gc-user-logined.gc-user-user');
      const mainContentAdmin = document.querySelector('.gc-main-content.gc-both-main-content.wide.account-page-content.with-left-menu.gc-user-logined.gc-user-admin');

      const targetElement = mainContentUser || mainContentAdmin;

      if (targetElement && !document.querySelector('#searchWrapper')) {
        if (isTrainingPage && breadcrumbs) {
          // Вставить перед breadcrumbs
          breadcrumbs.parentElement.insertBefore(
            new DOMParser().parseFromString(searchContainerHTMLDesktop, 'text/html').body.firstChild,
            breadcrumbs
          );
        } else if (isLessonPage && targetElement) {
          // Вставить как раньше
          targetElement.insertAdjacentHTML('afterbegin', searchContainerHTMLDesktop);
        }

        const searchInput = document.getElementById('searchInput');
        const searchResults = document.getElementById('searchResults');

        if (searchInput) {
          searchInput.addEventListener('input', () => {
            searchResults.style.display = 'block';
            searchResults.innerHTML = `<p>Результаты для "${searchInput.value}"</p>`;
          });
        }
      }
    });

    desktopObserver.observe(document.body, { childList: true, subtree: true });
  }
}

// Вызов при загрузке
addSearchContainer();
window.addEventListener('resize', () => {
  addSearchContainer();
});


// ===================== Обработчик поиска =======================

$(document).ready(function () {
  let typingTimer;
  const typingDelay = 1000;

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function getData(searchStr, callback) {
    $.getJSON('/c/sa/search', { searchStr }, function (response) {
      if (response.success === true && Array.isArray(response.data.blocks)) {
        const results = response.data.blocks
          .filter(block => block.onClick?.url)
          .map(function (block) {
            const domain = window.location.origin;
            const fullUrl = domain + block.onClick.url;
            const isLesson = fullUrl.includes('lesson');
            return {
              isLesson,
              title: block.title || "Без названия",
              description: block.description || "Нет описания",
              image: block.logo?.image || null,
              url: fullUrl
            };
          });
        callback(results);
      } else {
        callback([]);
      }
    });
  }

  function renderResults(results, searchResults) {
    if (results.length > 0) {
      const lessons = results.filter(result => result.isLesson);
      const trainings = results.filter(result => !result.isLesson);

      let resultItems = '';

      if (trainings.length > 0) {
        resultItems += '<h2>Тренинги</h2>';
        resultItems += trainings.map(result => `
          <div class="result-item training-item">
            ${result.image ? `<img src="${result.image}" alt="Результат" />` : ""}
            <h3>${result.title}</h3>
            <p>${result.description}</p>
            <a href="${result.url}" target="_blank">Перейти</a>
          </div>
        `).join('');
      }

      if (lessons.length > 0) {
        resultItems += '<h2>Уроки</h2>';
        resultItems += lessons.map(result => `
          <div class="result-item lesson-item">
            ${result.image ? `<img src="${result.image}" alt="Результат" />` : ""}
            <h3>${result.title}</h3>
            <p>${result.description}</p>
            <a href="${result.url}" target="_blank">Перейти</a>
          </div>
        `).join('');
      }

      searchResults.html(resultItems);
    } else {
      searchResults.html('<p>Ничего не найдено.</p>');
    }

    searchResults.addClass('visible');
  }

  $(document).on('click', function (event) {
    const searchContainer = isMobile() ? $('#searchContainerMobile') : $('#searchContainer');
    const searchResults = isMobile() ? $('#searchResultsMobile') : $('#searchResults');

    if (!searchContainer.is(event.target) && searchContainer.has(event.target).length === 0) {
      searchResults.removeClass('visible');
    }
  });

  $(document).on('input', '#searchInput, #searchInputMobile', function () {
    clearTimeout(typingTimer);
    const searchInput = $(this);
    const searchResults = isMobile() ? $('#searchResultsMobile') : $('#searchResults');
    const searchStr = searchInput.val().trim();

    if (searchStr) {
      typingTimer = setTimeout(function () {
        getData(searchStr, function (results) {
          renderResults(results, searchResults);
        });
      }, typingDelay);
    } else {
      searchResults.removeClass('visible').empty();
    }
  });

  $(document).on('click', '.search-icon', function () {
    setTimeout(function () {
      const searchInput = $('#searchInputMobile');
      if (searchInput.length > 0) {
        searchInput.trigger('focus');
      }
    }, 300);
  });
});
