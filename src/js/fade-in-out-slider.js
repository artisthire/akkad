import {animateOverTime} from './utils';

/**
 * Простой слайдер FadeInOut - появление/исчезновение элементов слайдера за счет изменения CSS-свойства opacity
 * @requires <module:utils />animateOverTime
 */
class FadeInOutSlider {
  /**
   *
   * @param {Object} options - содержит настройки слайдера
   * @param {HTMLElement} options.container - главный контейнер слайдера (содержит внутри слайды)
   * @param {string} [options.itemSelector=container.children] - CSS-селектор дочерних элементов.
   * @param {number} [options.interval=3000] - интервал повторения полного цикла анимации всех элементов контейнера (мс)
   * @param {number} [options.duration=400] - интервал длительности одной анимации fadeIn или fadeOut (мс)
   */
  constructor({container, itemSelector = '', interval = 3000, duration = 400}) {
    this.container = container;
    this.items = itemSelector ? container.querySelectorAll(itemSelector) : container.children;
    this.interval = interval;
    this.duration = duration;
    // создаем циклический список элементов (слайдов) анимации
    this.itemsList = this._createItemsList();
    // задает необходимые для анимации стили для контейнера и слайдеров внутри него
    this._setCSSProperties();
    // стартовый слайд
    this.currentItem = this.itemsList[0];
    // указатель на таймер для остановки анимации
    this.timerID = null;
    this._swapSlide = this._swapSlide.bind(this);
  }

  /**
   * Запускает цикл анимации
   */
  startAnimation() {
    this.timerID = setTimeout(this._swapSlide, this.interval);
  }

  /**
   * Останавливает анимацию слайдов
   */
  stopAnimation() {
    clearTimeout(this.timerID);
  }

  /**
   * Устанавливает CSS-стили для контейнера и слайдов внутри него.
   * В основном это аблолютное позиционирование слайдов внутри контейнера друг над другом
   */
  _setCSSProperties() {
    // ширина и высота контейнера устанавливается из CSS
    this.container.style.position = 'relative';
    this.container.style.overflow = 'hidden';

    for (const item of this.items) {
      item.style.position = 'absolute';
      item.style.top = '50%';
      item.style.left = '0';
      item.style.width = '100%'; // ширина элемента ограничена контейнером
      item.style.transform = 'translate(0, -50%)';
    }
  }

  /**
   * Создает массив объектов
   * внутри которых содержится: ссылка на текущий слайдер, индекс на номер следующего слайдера.
   * Это дает возможность получить массив с циклическими объектами, перебирая который
   * мы можем получить ссылку на текущий и следующий слайд не используя перебо через for
   * @returns {array} - массив с объектами ссылающимися друг на друга по кругу
   */
  _createItemsList() {
    const itemsData = [{elem: null, next: 0}];

    for (let i = 0; i < this.items.length; i++) {
      itemsData[i].elem = this.items[i];

      if (this.items[i + 1]) {
        itemsData.push({elem: null, next: 0});
        itemsData[i].next = i + 1;
      } else {
        itemsData[i].next = 0;
      }
    }

    return itemsData;
  }

  /**
   * Выполняет одну иттерацию анимации пары соседних слайдов
   * и планирует запуск следующей иттерации через заданный интервал с помощью setTimeout
   */
  _swapSlide() {
    const nextItem = this.itemsList[this.currentItem.next];

    this._fadeOut(this.currentItem.elem);
    this._fadeIn(nextItem.elem);
    this.currentItem = nextItem;

    this.timerID = setTimeout(this._swapSlide, this.interval);
  }

  /**
   * Запускает один цикл анимации - плавное исчезновение или плавное появление за заданный период
   *
   * @requires module: animateOverTime
   * @param {object} options - объект с функцией анимации и финальной функцией
   * @param {function} options.cb - функция анимации, которая будет выполняться за заданый период
   * @param {function} options.fin - функция, которая будет вызвана в конце анимации
   */
  _startItteraction({cb, fin}) {
    const ani = animateOverTime({dur: this.duration, cb, fin});
    requestAnimationFrame(ani); // and go
  }

  /**
   * Анимация плавного исчезновения элемента
   *
   * @param {HTMLElement} el - DOM-элемент, к которому применяется анимация
   */
  _fadeOut(el) {
    // el.style.opacity = 1; is assumed

    // create closure
    function _animation(completion) {
      el.style.opacity = 1 - completion;

      if (completion === 1) {
        // el.style.display = 'none';
        el.style.zIndex = '1';
        // убираем служебный класс 'show' с показанного сейчас слайдера
        el.classList.remove('show');
      }
    }

    this._startItteraction({cb: _animation});
  }

  /**
   * Анимация плавного появления элемента
   *
   * @param {HTMLElement} el - DOM-элемент, к которому применяется анимация
   * @param {string} [display] - CSS-свойство display, которое применяется к элементу в начале появления
   */
  _fadeIn(el, display) {
    // el.style.opacity = 0; is assumed
    el.style.zIndex = '2';
    el.style.display = display ?? '';

    // create closure
    function _animation(completion) {
      el.style.opacity = completion; // this is easy since both 0 - 1 decimal
    }

    this._startItteraction({cb: _animation, fin: () => el.classList.add('show')});
  }
}

// именованый экспорт для правильного динамического импорта
export default FadeInOutSlider;

/*
Пример разметки слайдера
id="slider-container" - CSS-селектор контейнера слайдеров, используется для позиционирования слайдов внутри него
По-умолчанию слайды - все дочерние элементы слайдера, но можно задать и передать CSS-селектор в FadeInOutSlider

  <div id="slider-container">
    <!-- слайд -->
    <div class="hero__content">
    </div>
    <!-- /слайд -->

    <!-- слайд -->
    <div class="hero__content">
    </div>
    <!-- /слайд -->
  </div>
*/
