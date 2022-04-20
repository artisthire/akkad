/* global L */
// Интерактивная карта с использованием библиотеки Leaflet
// требует подключения стилей и скрипта в теге HEAD https://leafletjs.com/examples/quick-start/

const MAP_OPTIONS = {
  center: [55.704832, 37.570924],
  zoom: '17',
};

// коордитнаты маркеров
// если нужне один маркер, можно в массиве оставить один элемент
const MARKERS_COORD = [
  [55.704494569644545, 37.569801391031305],
  [55.70563833072354, 37.57299512227082],
];

/**
 * Создает и добавляет карту на страницу
 *
 * @param {HTMLElement} container - элемент-контейнер, куда будет добавлена карта
 */
function createMap(container) {
  // содержимое внутри контейнера автоматически заменится при запуске скрипта

  // стили иконок, если нужны отдельные иконки нужно создавать отдельные переменные
  const customIcon = L.icon({
    // ссылка на кастомную картинку иконки
    iconUrl: './assets/img/map-pin.png',
    iconSize: [64, 64], // размер иконки (ширина, высота)
    iconAnchor: [32, 63], // относительная позиция (по ширине и высоте), по которой иконка будет размещена в координатах
    popupAnchor: [0, -60], // смещение относительно iconAnchor, по которому будет появляться окно подсказки
  });

  // обернуто в DOMContentLoaded, чтобы не было проблем загрузкой карты в еще не инициализированный HTMLElement
  document.addEventListener(
    'DOMContentLoaded',
    () => {
      // scrollWheelZoom: false - запрещаем изменение маштаба карты колесиком мыши
      const map = L.map(container, {scrollWheelZoom: false}).setView(
        MAP_OPTIONS.center,
        MAP_OPTIONS.zoom
      );

      /*
    // Если нужна карта visicom, раскоментировать и заменить инициализацию от openstreetmap
    L.tileLayer('https://tms{s}.visicom.ua/2.0.0/planet3/base/{z}/{x}/{y}.png', {
      attribution: 'Данные карт © 2019 ЧАО «<a href=\'https://api.visicom.ua/\'>Визиком</a>»',
      subdomains: '123',
      maxZoom: 19,
      tms: true
    }).addTo(map);
    */

      // openstreetmap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // добавляем иконки на карту по заданным координатам
      // если нужны разные иконки на разных координатах, то цикл нужно заменить на отдельные строки
      for (const coords of MARKERS_COORD) {
        L.marker(coords, {icon: customIcon}).addTo(map);
      }
      /*
      // если нужен tooltip при клике на иконку
      .bindPopup('Popup text');
    */
    },
    {once: true}
  );
}

export default createMap;
