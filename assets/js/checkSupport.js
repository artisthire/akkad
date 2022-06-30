/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
/* eslint-disable strict */


(function () {
  function isJs() {
    // Добавляет к DOM-элементу html класс 'js', если включен и работает JavaScript
    if (document.documentElement.classList.contains('no-js')) {
      document.documentElement.classList.toggle('no-js');
    }

    document.documentElement.classList.add('js');
  } // перенесено в миксин PUG supportWebp

  /* Проверка поддержки webp, добавление класса webp или no-webp для HTML */
  // function isWebp() {
  //   // Проверка поддержки webp
  //   const webP = new Image();
  //   // eslint-disable-next-line no-multi-assign
  //   webP.onload = webP.onerror = () => {
  //     if (webP.height === 2) {
  //       document.documentElement.classList.add('webp');
  //     } else {
  //       document.documentElement.classList.add('no-webp');
  //     }
  //   };
  // eslint-disable-next-line max-len
  //   webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  // }


  isJs();
})();
/******/ })()
;