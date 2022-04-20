/* eslint-disable max-lines */
import {isHiddenElement} from './utils';

const DATA_ATTR = {
  // селектор кнопкок управления меню (бургеров)
  burgerBtn: 'data-burger',
  // атрибут, который содержит ID блока контейнера ссылок меню, которым управляет бургер
  burgerTarget: 'data-burger-target',
  // отдельный атрибут, который содержит непосредственно ссылки меню
  // используется, для обработки закрытия меню при клике вне области со ссылками меню
  // и как общий контейнер для добавления обработчиков подменю
  linkContainer: 'data-burger-navmenu',
};

const CSS_CLASSES = {
  // CSS-класс, который добавляется кнопке бургера при открытии меню на мобильном устройстве
  burgerActive: 'open',
  // добавляется к контейнеру меню, при его открытии на мобильном устройстве
  menuActive: 'expanded',
};

/**
 * Управление меню на сайте
 * В т.ч. открытие/закрытие меню на мобильных устройствах
 * Открытие/закрытие подменю
 * @param {object} option - параметры
 * @param {HTMLElement} option.mainContainer - общий контейнер меню, содержащий кнопку бергер, меню ссылок, подменю
 * @param {number} [option.hideMenuMedia] - разрешения экрана, устанавливающее границу ниже которой меню скрывается.
 * Если не установлено, меню всегда показано.
 * @param {string} [option.bodyClass] - класс, который добавляется к тегу BODY, когда открывается мобильное меню.
 * Например, используетс для предотвращения прокрутки страницы, когда открыто мобильное меню.
 * Если пусто, класс добавлен не будет
 */
function burgerMenu({mainContainer, hideMenuMedia, bodyClass}) {
  // непосредственно контейнер со ссылками меню
  // const linkContainer = mainContainer.querySelector(`[${DATA_ATTR.linkContainer}]`);
  const ctrlBtn = mainContainer.querySelector(`[${DATA_ATTR.burgerBtn}]`);
  const menuID = ctrlBtn?.getAttribute(DATA_ATTR.burgerTarget);
  const menu = mainContainer.querySelector(`#${menuID}`);

  if (menu) {
    // обработка клика по кнопке открытия/закрытия меню
    ctrlBtn.addEventListener('click', onCtrlBtnClick);

    // если нужно скрывать меню выше определенного разрешения
    if (hideMenuMedia) {
      const mql = window.matchMedia(`(max-width: ${hideMenuMedia}px)`);

      if (!mql.matches) {
        hideMenu();
      }

      // наблюдаем за именением разрешения экрана
      mql.addEventListener('change', (evt) => {
        if (!evt.matches) {
          // на экранах больше заданного размера, скрываем мобильное меню
          hideMenu();
        }
      });
    }
  }

  // обработка закрытия меню при клике вне области меню
  document.addEventListener('click', onDocumentClick);

  /**
   * Обработчик клика на кнопку открытия/закрытия мобильного меню
   *
   * @param {Object} evt - объкт события
   */
  function onCtrlBtnClick(evt) {
    evt.preventDefault();

    if (ctrlBtn.classList.contains(CSS_CLASSES.burgerActive)) {
      hideMenu();
    } else {
      showMenu();
    }
  }

  /**
   * Обработчик клика вне меню и кнопок управления (бурген и кнопки управления подменю)
   *
   * @param {Object} evt - объкт события
   */
  function onDocumentClick(evt) {
    // клик вне контейнера меню со ссылками
    // и вне кнопки-бургера открытия меню
    // т.к. кнопка переключения отображения меню может быть скрыта на некоторых разрешениях экрана
    // меню скрываем только если такой функционал нужен, т.е. есть видна кнопка управления сокрытием меню
    if (
      !evt.target.closest(`[${DATA_ATTR.linkContainer}]`) &&
      !evt.target.closest(`[${DATA_ATTR.burgerBtn}]`) &&
      ctrlBtn?.classList.contains(CSS_CLASSES.burgerActive) &&
      !isHiddenElement(ctrlBtn)
    ) {
      hideMenu();
    }
  }

  /**
   * Функция сокрытия меню
   */
  function hideMenu() {
    ctrlBtn.classList.remove(CSS_CLASSES.burgerActive);
    ctrlBtn.setAttribute('aria-expanded', 'false');
    menu.classList.remove(CSS_CLASSES.menuActive);

    if (bodyClass) {
      // убираем специальный класс с элемента BODY
      document.body.classList.remove(bodyClass);
    }
  }

  /**
   * Функция показа меню
   */
  function showMenu() {
    ctrlBtn.classList.add(CSS_CLASSES.burgerActive);
    ctrlBtn.setAttribute('aria-expanded', 'true');
    menu.classList.add(CSS_CLASSES.menuActive);

    if (bodyClass) {
      // добавляем специальный класс с элемента BODY
      document.body.classList.add(bodyClass);
    }
  }
}

export default burgerMenu;
