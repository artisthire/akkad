/**
 * Проверяет и возвращает true если у устройства retina-дисплей
 *
 * @returns {boolean} true - retina-дислей
 */
function isRetina() {
  const mediaQuery = `(-webkit-min-device-pixel-ratio: 1.5),\
            (min--moz-device-pixel-ratio: 1.5),\
            (-o-min-device-pixel-ratio: 3/2),\
            (min-resolution: 1.5dppx)`;

  if (window.devicePixelRatio > 1) {
    return true;
  } else if (window.matchMedia && window.matchMedia(mediaQuery).matches) {
    return true;
  }

  return false;
}

/**
 * Используя метрики ширины/высоты проверяет видим ли элемент
 *
 * @param {HTMLElement} elem - элемент, который проверяется
 * @returns {boolean} true - элемент скрыт
 */
function isHiddenElement(elem) {
  return !elem.offsetWidth && !elem.offsetHeight;
}

/**
 * Убирает CSS-класс у группы DOM-элементов
 * @param {Object} options - объект параметров функции
 * @param {HTMLCollection} options.items - Список DOM-элементов
 * @param {string} options.className - Имя класса
 */
function itemsRemoveClass({items, className}) {
  items.forEach((item) => item.classList.remove(className));
}

/**
 * Создает функцию, после вызова которой запускается периодический вызов переданной параметром функции cb.
 * Функция вызывается на протажении заданного периода времени - dur.
 * При завершении вызывается функция - fin.
 *
 * @param {Object} animOption - объект со свойствами и функцией анимации
 * @param {number} animOption.dur - продолжительность анимации в мс
 * @param {Function} animOption.cb - функция анимации, получит значение прошедщего времени с начала запуска функции
 * @param {Function} [animOption.fin] - функция, которая будет вызвана при завершении анимации (необязательно)
 * @returns {Function} - функция, которая будет вызывать cb-функцию и передавать ей значение прошедшего времени
 */
function animateOverTime({dur, cb, fin}) {
  let timeStart;

  /**
   * На основе requestAnimationFrame вызывает полученную из внешней функии функцию cb.
   * Пример использования:
   * const ani = animateOverTime({dur: 400,
        cb: (completion) => {
          targetBlock.style.height = `${blockHeight * completion}px`;
        }
      });

      requestAnimationFrame(ani); // запуск анимации
   *
   * @param {number} time - время с начала запуска функции, которое возвращается requestAnimationFrame
   */
  function _animateOverTime(time) {
    if (!timeStart) {
      timeStart = time;
    }

    const timeElapsed = time - timeStart;
    const completion = Math.min(timeElapsed / dur, 1); // cap completion at 1 (100%)

    cb(completion);

    if (timeElapsed < dur) {
      requestAnimationFrame(_animateOverTime);
    } else if (typeof fin === 'function') {
      fin();
    }
  }

  return _animateOverTime;
}

/**
 * Функция анимированного изменения высоты или ширины элемента от нуля до максимума значения
 * Параметр (width или height) по которому происходит анимация читает из css-свойства trasition-property элемента,
 * к которому применяется анимация
 * @param {object} option - опции
 * @param {HTMLElement} option.element - элемент, для которого выполняется анимация
 * @param {boolean} option.isDown - true - элемент нужно распахнуть на всю ширину или высоту
 * @param {string} option.activeClass - css-клас, который добавляется, когда элемент распахнут
 * @param {string} [option.animProp] - height или width - направление анимации
 * По умолчанию 'height'
 * @param {number} [option.animDur] - время анимациии в мс
 * По умолчанию 300мс
 * @param {string} [option.dispValue] - значение свойста display, когда элемент отображается
 * По умолчанию 'block'
 * @param {function} [option.fin] - дополнительная функция, которая выполнится при завершении анимации
 */
function slideUpDownAnim({
  element,
  isDown,
  activeClass,
  animProp = 'height',
  animDur = 300,
  dispValue = 'block',
  fin,
}) {
  // может анимироваться width или height, другие свойства через css
  if (/(width|height)/i.test(animProp)) {
    // может быть Widht или Height, применяется для вычисления высоты или ширины блока
    const offsetDirection = animProp[0].toUpperCase() + animProp.slice(1);
    // отключаем сокрытие блока, чтобы корректно измерить величину ширины или высоты
    element.style.display = dispValue;
    element.style[animProp] = 'auto';
    const blockSize = element[`offset${offsetDirection}`];
    element.style[animProp] = '';

    let animFunct = null;

    if (isDown) {
      // начальная высота или ширина
      element.style[animProp] = '0px';
      element.classList.add(activeClass);

      animFunct = (completion) => {
        element.style[animProp] = `${blockSize * completion}px`;
      };
    } else {
      // перед сокрытием устанавливаем начальную ширину или высоту блока отличное от 'auto'
      // чтобы анимация сработала
      element.style[animProp] = blockSize + 'px';

      element.classList.remove(activeClass);
      // вызывается через setTimeout для того, чтобы сработало анимированное изменение свойства
      animFunct = (completion) => {
        element.style[animProp] = `${blockSize * (1 - completion)}px`;
      };
    }

    const ani = animateOverTime({
      dur: animDur,
      cb: animFunct,
      fin: () => {
        element.style[animProp] = '';
        element.style.display = '';

        if (fin) {
          fin();
        }
      },
    });

    requestAnimationFrame(ani); // запуск анимации
  }
}

export {isRetina, isHiddenElement, itemsRemoveClass, animateOverTime, slideUpDownAnim};
