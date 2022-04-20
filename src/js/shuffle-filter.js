// !!! npm install shufflejs

// import Shuffle from 'shufflejs';
import {itemsRemoveClass} from './utils';

/**
 * Создает виджет фильтруемых элементов c анимированной фильтрацией
 * @requires https://vestride.github.io/Shuffle/
 */
class ShuffleFilter {
  /**
   * Устанавливает параметры фильтра
   * Если option.ctrBtnsSelector не задан, то кнопки управления фильтром будут выбраны через ctrlContainer.children
   *
   * @param {Object} option - объект с настройками
   * @param {HTMLElement} option.filterContainer - общий контейнер фильтруемых элементов
   * @param {string} option.filterItemSelector - CSS-селектор для выбора всех фильтруемых элементов
   * @param {HTMLElement} option.ctrlContainer - общий контейнер с кнопками управления фильтром
   * @param {string} [option.ctrBtnsSelector] - CSS-селектор для выбора всех кнопок управления (необязательно)
   * если не задано, то кнопками управления будут считаться дочерние элементы общего контейнера кнопок управления
   * @param {Object} [option.filterOptions] - дополнительные опции для ShuffleJS
   * https://vestride.github.io/Shuffle/#options
   * @param {Function} [option.func] - функция-каллбек, которая вызывается после фильтрации элементов
   * при клике на кнопку управления (получает список кнопок управления и текущую активную кнопку управления)
   */
  constructor({
    filterContainer,
    filterItemSelector,
    ctrlContainer,
    ctrBtnsSelector = '',
    filterOptions = {},
    func = null,
  }) {
    this.filterContainer = filterContainer;
    this.filterItemSelector = filterItemSelector;
    this.ctrlContainer = ctrlContainer;
    this.ctrBtnsSelector = ctrBtnsSelector;
    this.filterOptions = filterOptions;
    this.func = func;

    this.shuffleFiter = null;
  }

  /**
   * Добавляет обработчики кнопок фильтрации и задает параметры фильтрации для библиотеки Shuffle
   */
  createFilter() {
    // если CSS-селектор кнопок управления не задан,
    // то в качестве кнопок управления берутся дочерние элементы конейнера кнопок
    if (this.ctrBtnsSelector === '') {
      this.ctrBtns = this.ctrlContainer.children;
      this.ctrBtnsArray = Array.from(this.ctrBtns);
    } else {
      this.ctrBtns = this.ctrlContainer.querySelectorAll(this.ctrBtnsSelector);
    }

    // обернуто в обработчик события DOMContentLoaded для корректного вычисления размеров filterItemElements,
    // когда точные размеры фильтруемых элементов зависят от их содержимого,
    // например, внутри картинки с без фиксации их размеров из CSS-стилей
    document.addEventListener(
      'DOMContentLoaded',
      () => {
        // динамический импорт для code splitting
        import(
          /* webpackChunkName: "shufflejs.min" */
          'shufflejs'
        ).then(({default: Shuffle}) => {
          // Shuffle.ShuffleItem.Css.INITIAL.overflow = 'hidden';

          // дополнительная анимация slideUp для фильтруемых элементов
          // по-умолчанияю Shuffle с настройкой 'useTransforms: false' применяет только анимацию opacity
          Shuffle.ShuffleItem.Css.VISIBLE.before.transform = 'translate3d(0, 0, 0)';
          // Shuffle.ShuffleItem.Css.VISIBLE.after.transform = 'translate3d(0, 0, 0)';
          Shuffle.ShuffleItem.Css.HIDDEN.before.transform = 'translate3d(0, 0, 0)';
          Shuffle.ShuffleItem.Css.HIDDEN.after.transform = 'translate3d(0, 50px, 0)';

          // базовые (дефолтные) настройки для фильтра
          const baseShuffleOptions = {
            itemSelector: this.filterItemSelector,
            // для перемещения элементов не используем transform, т.к. они уже используется для дополнительной анимации
            // также отключает дефолтную анимацию 'transform: scale' у Shuffle
            useTransforms: false,
            // скорость анимации
            speed: 600,
            // начальное значение параметра для фильтрации элементов
            // 'all' - отображаются все элементы
            // передавая другое значение, изначально будут отображаться только элементы,
            // в атрибуте [data-groups] которых содержатся только эти строки
            group: 'all',
            // разделитель групп к которым принадлежит фильтруемый элемент
            // сами группы по-умолчанию задаются в атрибуте [data-groups]
            // например, data-groups="webdesign, graphic"
            // ! группы разделяются именно запятой с пробелом
            delimiter: ', ',
          };

          // к дефолтным настройкам фильтра добавляются переданные в конструкторе
          const shuffleOptions = {
            ...baseShuffleOptions,
            ...this.filterOptions,
          };

          this.shuffleFiter = new Shuffle(this.filterContainer, shuffleOptions);

          // добавяем обработчик клика на кнопки фильтрации
          this._onCtrlBtnClick = this._onCtrlBtnClick.bind(this);
          this.ctrlContainer.addEventListener('click', this._onCtrlBtnClick);
        });
      },
      {once: true}
    );
  }

  /**
   * Обработчик кликов по кнопкам управления фильтрацией
   *
   * @param {Object} evt - объект события
   */
  _onCtrlBtnClick(evt) {
    let clickBtn = null;

    // если CSS-селектор кнопок управления не задан,
    // ищем источник клика среди всех дочерних элементов контейнера кнопок
    if (this.ctrBtnsSelector === '') {
      clickBtn = this.ctrBtnsArray.find((btn) => btn.contains(evt.target));
    } else {
      // иначе ищим источник клика по CSS-селектору
      clickBtn = evt.target.closest(this.ctrBtnsSelector);
    }

    // если клик не по кнопке управления
    // ничего не делаем
    if (!clickBtn) {
      return;
    }

    evt.preventDefault();

    // если клик по уже активной кнопке управления
    // ничего не делаем
    if (clickBtn.classList.contains('active')) {
      return;
    }

    // добавляем класс 'active' для кнопки по которой был клик
    itemsRemoveClass({items: this.ctrBtns, className: 'active'});
    clickBtn.classList.add('active');

    // получаем селектор фильтрации, который будем сравнивать с атрибутом в элементах фильтрации
    // по-умолчанию селектор фильтации содержится в атрибуте кнопки [data-group]
    const filterGroup = clickBtn.dataset.group;

    if (filterGroup === '' || filterGroup === '*' || filterGroup.toLowerCase() === 'all') {
      this.shuffleFiter.filter(this.shuffleFiter.ALL_ITEMS);
    } else {
      // фильтруем элементы по селектору фильтрации из кнопки управления
      // по-умолчанию данные о том к какой группе принадлежит конкретный элемент фильтрации
      // содержится в атрибуте [data-groups]
      this.shuffleFiter.filter(filterGroup);
    }

    // если нужна дополнительная логика
    // вызываем функцию-каллбек, переданную при создании фильтра
    // в качестве параметров передаем ей HTMLList кнопок управления
    // и HTMLElement - кнопку, по которой мы кликнули
    if (this.func) {
      this.func({ctrlBtns: this.ctrBtns, targetBtn: clickBtn});
    }
  }
}

export default ShuffleFilter;

/*
Пример HTML верстки
id="ctrls-container" - общий контейнер кнопок управления для делегации события
js-ctrl-btn - CSS-класс обработки клика именно по кнопкам управления
data-group="webdesign" - атрибут кнопки фильтрации, сравнивается с атрибутом data-groups в фильтруемых элементах;
  для выбора всех элементов может быть пустым или содержать "*", или "all"
id="fiter-elements-container" - контейнер фильтруемых элементов, передается Shuffle
js-filter-element - селектор фильтруемых элементов, передается Shuffle
data-groups="webdesign, logo" - атрибут, который устанавливает к каким группам принадлежит фильтруемый элемент
  может содержать несколько слов разделенных запятой с пробелом, когда элемент принадлежит нескольким группам

    <ul id="ctrls-container">
      <li>
        <a href="#" class="js-ctrl-btn" data-group="all">all</a>
      </li>
      <li>
        <a href="#" class="js-ctrl-btn" data-group="webdesign">webdesign</a>
      </li>
    </ul>

    <div id="fiter-elements-container">
      <a class="js-filter-element" href="" data-groups="logo">
        <img src="" alt="" width="" height="">
      </a>
      <a class="js-filter-element" href="" data-groups="logo, webdesign">
        <img src="" alt="" width="" height="">
      </a>
    </div>
*/
