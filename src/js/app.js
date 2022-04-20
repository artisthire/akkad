// import Splide from '@splidejs/splide';
import accordion from './accordion';
import burgerMenu from './burger-menu';
import watchElemIntersection from './watch-elem-intersection';
import ShuffleFilter from './shuffle-filter';
import animationPageLoad from './anim-page-load';
import createMap from './contact-map-leaflet';
// import AOS from 'aos';

const headerMenu = document.querySelector('#header-menu');

if (headerMenu) {
  // открытие/закрытие подменю в меню шапки
  accordion({
    mainContainer: headerMenu,
    singleOpen: true,
    outContainerClose: true,
    openOnHover: true,
    animateToggle: true,
    correctPosition: true,
  });

  // открытие/сокрытие меню на мобильных устройствах
  burgerMenu({
    mainContainer: headerMenu,
    hideMenuMedia: 768,
    bodyClass: 'locked',
  });
}

// добавляет фоновый цвет для position:fixed меню на десктопах, чтобы меню было видно на фоне страницы
watchElemIntersection();

// анимационные переходы между страницами при клике на навигационные ссылки
animationPageLoad();

// анимационное появление элементов при прокрутке с использованием библиотеки AOS
// https://github.com/michalsnik/aos/tree/v2

import(
  /* webpackChunkName: "AOS.min" */
  'aos'
).then(({default: AOS}) => {
  AOS.init({
    duration: 1100,
    disable: window.innerWidth < 576,
    once: true,
  });
});

/**
 * Анимация слайдера главного заголовка в блоке Hero
 */

const heroSlideContainer = document.querySelector('#hero-slider');

if (heroSlideContainer) {
  const heroSlideItems = heroSlideContainer.children;

  if (heroSlideItems.length > 1) {
    // динамический импорт для code splitting
    import(
      /* webpackChunkName: "fadeInOutSlider.min" */
      './fade-in-out-slider'
    ).then(({default: FadeInOutSlider}) => {
      const slider = new FadeInOutSlider({
        container: heroSlideContainer,
        interval: 4000,
        duration: 400,
      });

      slider.startAnimation();
    });
  }
}

/**
 * Фильтр категорий в блоке Portfolio
 */

const portfolioExamplesContainer = document.querySelector('#portfolio-examples');

if (portfolioExamplesContainer) {
  const exampleItemSelector = '.js-portfolio-example';
  const categoryCtrlContainer = document.querySelector('#portfolio-category-ctrls');
  const categoryCtrlSelector = '.js-category-filter-btn';

  const shuffleFilter = new ShuffleFilter({
    filterContainer: portfolioExamplesContainer,
    filterItemSelector: exampleItemSelector,
    ctrlContainer: categoryCtrlContainer,
    ctrBtnsSelector: categoryCtrlSelector,
  });

  shuffleFilter.createFilter();
}

/**
 * Фильтр постов в боке Post-filter
 */

const postFilterContainer = document.querySelector('#post-filter');

if (postFilterContainer) {
  const postItemSelector = '.js-post-filter-item';
  const postFilterCtrlContainer = document.querySelector('#post-filter-ctrl-container');
  const postFilterCtrlSelector = '.js-post-filter-ctrl';

  const shuffleFilter = new ShuffleFilter({
    filterContainer: postFilterContainer,
    filterItemSelector: postItemSelector,
    ctrlContainer: postFilterCtrlContainer,
    ctrBtnsSelector: postFilterCtrlSelector,
    filterOptions: {
      // изначально отображаются элементы в соотвествии с параметром фильтрации в первой управляющей кнопке
      group: document.querySelector('.js-post-filter-ctrl').dataset.group,
    },
    // обновляем позицию нижнего подчеркивания в блоке кнопок управления
    // через вызов функции-каллбека в обработчике клика по кнопкам управления фильтром
    func: ({targetBtn}) => {
      postFilterCtrlContainer.style.setProperty('--underline-pos', targetBtn.offsetLeft + 'px');
      postFilterCtrlContainer.style.setProperty('--underline-width', targetBtn.offsetWidth + 'px');
    },
  });

  shuffleFilter.createFilter();
}

/**
 * Карта на странице контактов
 */

const contactMapContainer = document.querySelector('#contact-map');

if (contactMapContainer) {
  createMap(contactMapContainer);
}

/**
 * Слайдер отзывов на странице About
 */

const testimonialsSlider = document.querySelector('#testimonials-slider');

if (testimonialsSlider) {
  document.addEventListener('DOMContentLoaded', () => {
    Promise.all([
      import(
        /* webpackChunkName: "splidejs.min" */
        '@splidejs/splide'
      ),
      import(
        /* webpackChunkName: "splidejs-intersection.min" */
        '@splidejs/splide-extension-intersection'
      ),
    ]).then((modules) => {
      const {Splide} = modules[0];
      const {Intersection} = modules[1];
      new Splide(testimonialsSlider, {
        type: 'loop',
        slideFocus: false,
        arrows: false,
        autoplay: 'pause',
        intersection: {
          inView: {
            autoplay: true,
          },
          outView: {
            autoplay: false,
          },
        },
      }).mount({Intersection});
    });
  });
}
