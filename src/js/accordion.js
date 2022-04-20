/* eslint-disable max-lines */
import {slideUpDownAnim} from './utils';

const DATA_ATTR = {
  // селектор кнопоки управления открытием/закрытием контента аккордеона
  сtrlBtn: 'data-accordion-ctrl',
  // селектор, который добавляется к ctrBtn и в которым содержится id блока, которым управляет кнопка
  contentTarget: 'data-accordion-target',
};

const CSS_CLASSES = {
  // клас добавляется к контейнеру, когда активируется обработка открытия/закрытия контента аккордеона
  init: 'accordion-init',
  // добавляется к ctrlBtn, когда контент акордеона открыт
  ctrlBtnActive: 'expanded',
  // добавляется к контенту, когда он показан
  contentActive: 'show',
};

/**
 * Аккордеон - блоки контента, которые показываются или сворачиваются, при взаимодействии с кнопкой управления
 * соотвествующим блоком
 * @param {object} option - параметры
 * @param {string} option.containerSelector - селектор общего контейнера аккордеона
 * @param {string} [option.activatingMedia] - медиавыражение, по которому активируется аккордеон
 * @param {boolean} [option.singleOpen = false] - флаг, указывающий что одновременно в аккордеоне
 * может быть открыто только однин контентный блок.
 * @param {boolean} [option.outContainerClose = true] - флаг, указывающий что контентынй блоки должны закрываться
 * когда происходит клик или фокусировка вне кнопки управления или контентного блока
 * @param {boolean} [option.openOnHover = false] - отключает обработку открытия контента аккордеона кликом мыши,
 * если контент открывается по псевдоклассу :hover в CSS-стилях. По-умолчанию - false, клик мыши открывает контент.
 * @param {boolean} [option.animateToggle = true] - включает анимацию height или width при открытии контента
 * При включении анимации нужно проверить, чтобы параметр height или width в CSS не имел фиксированного значения
 * @param {boolean} [option.correctPosition = true] - проверку и корректировку позиционирования
 * открытого контентного блока, если его границы могут выходить за пределы видимости экрана
 */
function accordion({
  mainContainer,
  activatingMedia,
  singleOpen = false,
  outContainerClose = true,
  openOnHover = false,
  animateToggle = true,
  correctPosition = true,
  convertToButton = true,
}) {
  // хранит ссылку на открытый блок контента при активации открытия при ховере
  let activeContent = null;
  // содержит значение величины свойства display,
  // которое устанавливается/убирается при открытии/закрытии контентного блока
  let dispValue = 'block';

  // массив кнопок управления контентными блоками аккордеона
  // используется для часто выполняемых операций поиска активных кнопок
  let ctrlBtns = Array.from(mainContainer.querySelectorAll(`[${DATA_ATTR.сtrlBtn}]`));

  if (ctrlBtns.length > 0) {
    const content = getContentBlock(ctrlBtns[0]);
    document.addEventListener(
      'DOMContentLoaded',
      () => {
        // вычисляем значение свойства display
        // которое должно присваиваться контентному блоку, когда он отображается
        // выполняется при DOMContentLoaded, для уверенности что уже загружены таблицы стилей
        content.classList.add(CSS_CLASSES.contentActive);
        dispValue = getComputedStyle(content).display;
        content.classList.remove(CSS_CLASSES.contentActive);
      },
      {once: true}
    );

    // если медиавыражение не передается
    // аккордеон всегда активен на любом разрешении экрана
    if (!activatingMedia) {
      initAccordion();
      // медиавыражение может быть только в виде min|max,число
    } else if (/(min|max),\d{3,4}/i.test(activatingMedia)) {
      const [key, prop] = activatingMedia.split(',');
      const mql = window.matchMedia(`(${key}-width: ${prop}px)`);
      // если медиавыражение выполняется при первоначальном запуске
      // инициализируем аккордеон
      if (mql.matches) {
        initAccordion();
      }

      // наблюдаем за именением разрешения экрана
      // и активируем аккордеон только на разрешениях экрана при выполнении медиавыражения
      mql.addEventListener('change', (evt) => {
        if (evt.matches) {
          initAccordion();
        } else {
          // на экранах выходящих за пределы медиазапроса, деактивируем аккордеон
          deactivateAccordion();
        }
      });
    }
  }

  /**
   * Инициализация аккордеона
   */
  function initAccordion() {
    // добавляем aria-атрибуты для кнопок управления
    // если они отсутствуют в разметке
    ctrlBtns.forEach((ctrlBtn) => {
      const ariaAttr = {
        'aria-haspopup': true,
        'aria-expanded': false,
        'aria-controls': ctrlBtn.getAttribute(DATA_ATTR.contentTarget),
      };

      Object.keys(ariaAttr).forEach((key) => {
        if (!ctrlBtn.hasAttribute(key)) {
          ctrlBtn.setAttribute(key, ariaAttr[key]);
        }
      });
    });

    // если установлен флаг преобразования элементов управления в кнопки
    if (convertToButton) {
      ctrlBtns.forEach((ctrlBtn) => {
        // создаем элемент button(type="button")
        const btnElem = document.createElement('button');
        btnElem.setAttribute('type', 'button');

        // копируем все атрибуты из исходного элемента
        // которые допустимы как атрибуты для кнопок
        const allowAttributes = ctrlBtn
          .getAttributeNames()
          .filter((attr) => !/^(href|hreflang|referrerpolicy|rel|target)$/.test(attr));
        allowAttributes.forEach((attr) => btnElem.setAttribute(attr, ctrlBtn.getAttribute(attr)));
        // копируем внутренее содержимое
        btnElem.innerHTML = ctrlBtn.innerHTML;

        // заменяем текущий элемент управления на кнопку
        ctrlBtn.replaceWith(btnElem);
      });

      // также восстанавливаем глобальный массив ссылок на кнопки управления
      ctrlBtns = Array.from(mainContainer.querySelectorAll(`[${DATA_ATTR.сtrlBtn}]`));
    }

    // добавляем служебный класс, что аккордеон инициализирован
    mainContainer.classList.add(CSS_CLASSES.init);
    // добавляем обработчик клика по кнопке открытия/закрытия контенного блока аккордеона
    mainContainer.addEventListener('click', onCrtlBtnClick);

    // дополнительные обработчики на устройствах поддерживающих наведение
    // добавление обрабочиков открытия контентного блока при ховере
    if (openOnHover && window.matchMedia('(any-hover: hover)').matches) {
      mainContainer.addEventListener('mouseover', onMouseOverCtrlBtn);
      mainContainer.addEventListener('mouseout', onMouseOutCtrlBtn);
    }

    // только для аккордеонов у которых одновременно открытым может быть только один контентый блок
    if (outContainerClose) {
      // обработка закрытия аккордеона при клике вне его содержимого
      document.addEventListener('click', onDocumentClick);
    }

    // добавление обработчика при фокусировке с клавиатуры вне кнопки управления контентным блоком или контентом
    if (outContainerClose || singleOpen) {
      document.addEventListener('focusin', onDocumentFocus);
    }
  }

  /**
   * Деактивация аккордеона
   */
  function deactivateAccordion() {
    // добавляем служебный класс, что аккордеон инициализирован
    mainContainer.classList.remove(CSS_CLASSES.init);
    // добавляем обработчик клика по кнопке открытия/закрытия контенного блока аккордеона
    mainContainer.removeEventListener('click', onCrtlBtnClick);
    mainContainer.removeEventListener('mouseover', onMouseOverCtrlBtn);
    mainContainer.removeEventListener('mouseout', onMouseOutCtrlBtn);
    document.removeEventListener('focusin', onDocumentFocus);
    // обработка закрытия аккордеона при клике вне его содержимого
    document.removeEventListener('click', onDocumentClick);
  }

  /**
   * Обработчик клика на кнопку открытия/закрытия контентного блока
   * @param {Object} evt - объкт события
   */
  function onCrtlBtnClick(evt) {
    // только если клик по кнопке открытия/закрытия контентного блока
    // если меню открывается при наведении (hover) и клик мышью (evt.pageX !== 0), не обрабатываем
    if (
      evt.target.closest(`[${DATA_ATTR.сtrlBtn}]`) &&
      !(openOnHover && window.matchMedia('(any-hover: hover)').matches && evt.pageX)
    ) {
      evt.preventDefault();
      const ctrlBtn = evt.target.closest(`[${DATA_ATTR.сtrlBtn}]`);

      // если аккордеон должен одновременно отображать только один открытый блок
      // то закрываем все ненужные активные блоки
      if (singleOpen) {
        // находим все "активные" кнопки, для которых открыто подменю
        const activeCtrlBtns = getActiveCtrlBtns();

        // закрываются только блоки, которые не управляются текущей кнопкой открытия/закрытия
        activeCtrlBtns.forEach((activeCtrlBtn) => {
          if (activeCtrlBtn !== ctrlBtn) {
            hideContent(activeCtrlBtn);
          }
        });
      }

      // открытие/заркытие связанного с кнопкой блока
      if (ctrlBtn.classList.contains(CSS_CLASSES.ctrlBtnActive)) {
        hideContent(ctrlBtn);
      } else {
        showContent(ctrlBtn);
      }
    }
  }

  /**
   * Обработчик клика вне меню и кнопок управления (бурген и кнопки управления подменю)
   *
   * @param {Object} evt - объкт события
   */
  function onDocumentClick(evt) {
    // клик вне контейнера меню со ссылками
    if (!mainContainer.contains(evt.target)) {
      // все открытые контентные блоки скрываем
      const activeCtrlBtns = getActiveCtrlBtns();
      activeCtrlBtns.forEach((activeCtrlBtn) => hideContent(activeCtrlBtn));
    }
  }

  /**
   * Обработчик фокусировки вне аккордеона или вне активных кнопок или открытых контентных блоков
   * @param {Object} evt - объкт события
   */
  function onDocumentFocus(evt) {
    // фокусировка на одном из элементов контейнера
    if (singleOpen && mainContainer.contains(evt.target)) {
      // находим все кнопки с открытыми контентыми блоками
      let activeCtrlBtns = getActiveCtrlBtns();
      // получаем только активные кнопки вне фокуса
      activeCtrlBtns = activeCtrlBtns.filter(
        (activeCtrlBtn) =>
          !activeCtrlBtn.contains(evt.target) &&
          !getContentBlock(activeCtrlBtn).contains(evt.target)
      );
      // скрываем все открытые контентные блоке вне фокуса, при фокусировке в контейнере
      activeCtrlBtns.forEach((activeCtrlBtn) => hideContent(activeCtrlBtn));
    }

    if (outContainerClose && !mainContainer.contains(evt.target)) {
      // находим все кнопки с открытыми контентыми блоками
      const activeCtrlBtns = getActiveCtrlBtns();
      // скрываем все открытие контентные блоки, при фокусировке вне контейнера
      activeCtrlBtns.forEach((activeCtrlBtn) => hideContent(activeCtrlBtn));
    }
  }

  /**
   * Обработчик наведения на кнопку управления открытием контентного блока
   * @param {Object} evt - объкт события
   */
  function onMouseOverCtrlBtn(evt) {
    // если контент еще не был открыт и наведение на кнопку управления открытием блока контента
    if (!activeContent && evt.target.closest(`[${DATA_ATTR.сtrlBtn}]`)) {
      const ctrlBtn = evt.target.closest(`[${DATA_ATTR.сtrlBtn}]`);
      const content = getContentBlock(ctrlBtn);

      if (content) {
        // добавляем класс активности для кнопки управления контентом
        ctrlBtn.classList.add(CSS_CLASSES.ctrlBtnActive);
        ctrlBtn.setAttribute('aria-expanded', 'true');
        // сохраним ссылку на открытый ховером контентный блок
        activeContent = content;
        showContent(ctrlBtn);
      }
    }
  }

  /**
   * Обработчик ухода с кнопки управления открытием контента или с открытого блока контента
   * @param {Object} evt - объкт события
   */
  function onMouseOutCtrlBtn(evt) {
    // если есть открытый контентный блок, и мы переходим не на этот блока или кнопку управления блоком
    if (
      activeContent &&
      !(
        activeContent.contains(evt.relatedTarget) ||
        evt.relatedTarget?.closest(`[${DATA_ATTR.сtrlBtn}]`)
      )
    ) {
      // находим все "активные" кнопки, для которых открыт контентный блок
      const activeCtrlBtns = getActiveCtrlBtns();

      // убираем класс "активности" у всех кнопок открытого контентного блока
      activeCtrlBtns.forEach((activeCtrlBtn) => {
        activeCtrlBtn.classList.remove(CSS_CLASSES.ctrlBtnActive);
        activeCtrlBtn.setAttribute('aria-expanded', 'false');
        hideContent(activeCtrlBtn);
      });

      activeContent = null;
    }
  }

  /**
   * Показывает связанный с кнопкой управления контентный блока
   * @param {HTMLElement} ctrlBtn - кнопка управления контентным блоком
   */
  function showContent(ctrlBtn) {
    const content = getContentBlock(ctrlBtn);

    if (content) {
      ctrlBtn.classList.add(CSS_CLASSES.ctrlBtnActive);
      ctrlBtn.setAttribute('aria-expanded', 'true');

      if (animateToggle) {
        animationToggle({element: content, isDown: true});
      } else {
        content.classList.add(CSS_CLASSES.contentActive);
      }

      // выполняем дополнительное позиционирование открытого контентного блока, если оно выходит за границы экрана
      // код расположен после анимации открытия, для правильного позиционирования предваретильно скрытого контента
      if (correctPosition) {
        content.style.left = '';
        const overScreen =
          document.documentElement.clientWidth - content.getBoundingClientRect().right;

        if (overScreen < 0) {
          content.style.left = overScreen + 'px';
        }
      }
    }
  }

  /**
   * Скрывает связанный с кнопкой управления контентный блок
   * @param {HTMLElement} ctrlBtn - кнопка управления соответствующим контентный блоком
   */
  function hideContent(ctrlBtn) {
    const content = getContentBlock(ctrlBtn);

    if (content) {
      ctrlBtn.classList.remove(CSS_CLASSES.ctrlBtnActive);
      ctrlBtn.setAttribute('aria-expanded', 'false');

      if (animateToggle) {
        animationToggle({element: content, isDown: false});
      } else {
        content.classList.remove(CSS_CLASSES.contentActive);
      }
    }
  }

  /**
   * На основе ID в дата-атрибуте кнопки управления
   * возвращает блок, которым эта кнопка управляет
   * @param {HTMLElement} ctrlBtn - кнопка управления
   * @returns {HTMLElemenent} элемент, которым управляет кнопка
   */
  function getContentBlock(ctrlBtn) {
    const targetID = ctrlBtn?.getAttribute(DATA_ATTR.contentTarget);

    if (targetID) {
      return mainContainer.querySelector(`#${targetID}`);
    }

    return null;
  }

  /**
   * Возвращает массив активных кнопок управления контентыми блоками
   * @returns {HTMLElement[]} массив активных кнопок управления
   */
  function getActiveCtrlBtns() {
    return ctrlBtns.filter((сrtBtn) => сrtBtn.classList.contains(CSS_CLASSES.ctrlBtnActive));
  }

  /**
   * Анимация открытия/закрытия контентного блока
   * @param {object} option - параметры
   * @param {HTMLElement} element - элемент, к которому применяется анимация
   * @param {boolean} isDown - true - slideDown, false - slideUp
   */
  function animationToggle({element, isDown}) {
    slideUpDownAnim({
      element,
      isDown,
      activeClass: CSS_CLASSES.contentActive,
      animProp: 'height',
      animDur: 300,
      dispValue,
    });
  }
}

export default accordion;

/*
Пример разметки

#header-menu // общий контейнер
  //- кнопка управления
  //- data-accordion-ctrl - селектор кнопки управления
  //- data-accordion-target - ID контентного блока, которым управляет кнопка
  a(href="#", role="menuitem", aria-haspopup="true", aria-expanded="false", aria-controls=`submenu-1`,
    data-accordion-ctrl, data-accordion-target=`submenu-1`) Кнопка управления
  //- контентый блок связан с кнопкой управления по ID
  ul.main-menu__sublist(id=`submenu-1`, role="menu", aria-label=`${link.text}`)
      li(role="none")
        a(href=`${link.href}.html`, role="menuitem")= `${link.text}-1`
      li(role="none")
        a(href=`${link.href}.html`, role="menuitem")= `${link.text}-2`
      li(role="none")
        a(href=`${link.href}.html`, role="menuitem")= `${link.text}-3`
*/
