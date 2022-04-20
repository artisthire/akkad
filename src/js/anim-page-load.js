import {animateOverTime} from './utils';

const DATA_ATTR = {
  // селектор кнопкок управления меню (бургеров)
  linkSelector: 'data-load-anim',
};

/**
 * Создает анимацию начальной загрузки страницы
 * и перехода на другие страницы сайта при клике на ссылки соответствующие селектору LINK_SELECTOR
 * @param {Object} option - объект параметров
 * @param {number} [option.dur] - продолжительность анимации в мс
 * @param {number} [option.transfromOffset] - величина смещения страницы по вертикали при анимации, (px)
 * @param {number} [option.mobileResolution] - разрешение экрана, ниже которого отключаем анимацию, (px)
 */
function animationPageLoad({dur = 600, transfromOffset = 100, mobileResolution = 576} = {}) {
  document.addEventListener(
    'DOMContentLoaded',
    () => {
      // на мобилках анимацию отключаем
      if (window.matchMedia(`(min-width: ${mobileResolution}px)`).matches) {
        const body = document.body;
        // анимация при начальной загрузке страницы
        const loadAnim = animateOverTime({
          dur,
          cb: _fadeInSlideUp(body),
          fin: () => {
            // по окончанию анимации убираем ранее установленные стили на BODY
            body.style.opacity = '';
            body.style.transform = '';
          },
        });
        // запускаем анимацию
        requestAnimationFrame(loadAnim);

        // добавляем анимацию при клике на заданные селектором linkSelector ссылки
        document.addEventListener('click', (evt) => {
          const animationLink = evt.target.closest(`a[${DATA_ATTR.linkSelector}]`);

          if (animationLink) {
            evt.preventDefault();
            // сохраняем значение атрибута href ссылки
            const newLocation = animationLink.href;

            const unloadAnim = animateOverTime({
              dur,
              cb: _fadeOutSlideUp(body),
              fin: () => {
                // после выполнения анимации переходим на новую страницу
                window.location = newLocation;
              },
            });
            // запускаем анимацию
            requestAnimationFrame(unloadAnim);
          }
        });
      }
    },
    {once: true}
  );

  /**
   * Анимация плавного исчезновения c поднятием вверх
   *
   * @param {HTMLElement} el - DOM-элемент, к которому применяется анимация
   */
  function _fadeOutSlideUp(el) {
    // el.style.opacity = 1; is assumed
    // el.style.transfrom = 'translate3d(0, 0, 0)';

    // create closure
    function _animation(completion) {
      el.style.opacity = 1 - completion;
      // поднятие в -100px, для BODY это за пределы окна браузера
      el.style.transform = `translate3d(0, ${-transfromOffset * completion}px, 0)`;

      if (completion === 1) {
        el.style.transfrom = 'translate3d(0, 0, 0)';
      }
    }

    return _animation;
  }

  /**
   * Анимация плавного появления c поднятием вверх
   *
   * @param {HTMLElement} el - DOM-элемент, к которому применяется анимация
   */
  function _fadeInSlideUp(el) {
    // el.style.opacity = 0; is assumed
    // el.style.transfrom = 'translate3d(0, 100px, 0)';
    // create closure
    function _animation(completion) {
      el.style.opacity = completion; // this is easy since both 0 - 1 decimal
      el.style.transform = `translate3d(0, ${transfromOffset * (1 - completion)}px, 0)`;
    }

    return _animation;
  }
}

export default animationPageLoad;
