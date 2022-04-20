/* eslint-disable max-len */
/* eslint-disable quotes */
import {isRetina} from './utils';

// !!!Статическая карта на сайт на основе 2gis: https://docs.2gis.com/ru/api/map/static/overview
const IMG_ALT = 'Contact map';

const MAP_OPTIONS = {
  width: 555,
  height: 841,
  // !!!сначала долгота потом широта
  // 'center': '55.704832,37.570924',
  zoom: '17',
};

// содержит координаты и стили точек на карте
// !!!сначала широта потом долгота
// файлы кастомных иконок нужно предварительно преобразовать в Base64 формат
const GEO_JSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [37.571262, 55.705234],
      },
      properties: {
        k: 'p',
        c: 'gn',
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [37.5705, 55.70433],
      },
      properties: {
        b: 'iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABmJLR0QA/wD/AP+gvaeTAAADRElEQVRogd3a24scRRTH8c+aXQ3BNSYEIl4wELygmKCCb97+AX0XjSgacQUlf4EKgiCCb9mYVxWMD94WgqwPRvHyoKCQVVcUidFo4o2giWg2JD5UTZjMznRV90z1rH7h0EzX6Trn11Xdfbpr+J8wUbDvKVyCC+LvP3AISwVjjoRzcSeexxdCwqd7bCm27cIdgtgVw3o8iV8sTzxlP+NxrGs96y4msB2/qS+g137FA8pO9b6sw5tDJD7IXtfi6FyKzwuI6Nh+4SZRlA1YLCiiY19jYykRU/ioBREd+0Chu9ozLYro2NOjFnEdToxByBK2jlLI3kTAr/AJFmokuRCPSV1zc6MSsTUjqduj7yQOZvj/EH3hloTvKWFGVHJOhpD7M3w6nMTuDL/d0TeHCdxXI4eBHJI/InAR/qnwPYGLu/xTI3JaGOVKUiNyVU/QFNM4jNcqfN7Aj9E3l8twRZVDSsgNNYIRai+YrfDZGbcP1ez7+qrGlJDKs9CH23AN3hXKmF6+xD5c7ezpmMOVVY0pIU0KuJm47Tcqs8Kcn1G/0q3MJSXkvJrBYJsw/1/Asa79x+O+86NPXVZXNaaEHEu092Ma9wivti927X8JR3E31jbo98+qxpSQ3xsEpP/02hW3DzfsszKXyapGofRowrW4Vbjo3xdO2Ke4GVsa9rlY1ZgSsr9hUHhEEDKLVXHfzGD3JAtDHAu+l/9kn7P8CT4ZrfeJvzcek/NkP5BKMqfWms/w6ceU8IA8Ge1B4ZNRE5I55AjZ0zA4QciUMCLbE75VvDzEsWdYJT299uEVoYbqbTsarXf/T/GYdxJ9H5R3wrPYkQhW0h4dlQhYgyNjEHE4xk6SO2R/4blM31HybIw9UqaFb7VtjcYRoS4rwrYWhdxVSkSH+RZEvFVaBGwSquJSIo5jcxtCKHs7fqwtEYS3u1cLiJgzhjWSC/HtkIl32wFh9Wss3KT6G1au/Y0bW859GfcaTsQp4dV4RfCU5kKeGEO+A5kQPjTUFbHHGC7uFKvxtnwR85p9bmqFNXhPWsSHCtZRo2ItPjZYxGfG/AeBOmzQf/VqUcHV2lJsdPay2jfqLVGsKDbhu2iXjzmXodmsxWr2P8+/y3/UvJOvHYkAAAAASUVORK5CYII=',
      },
    },
  ],
};

let urlQuery = `s=${MAP_OPTIONS.width}x${MAP_OPTIONS.height}`;

if (isRetina()) {
  urlQuery += '@2x';
}

if (MAP_OPTIONS.center) {
  urlQuery += `&c=${MAP_OPTIONS.center}`;
}

urlQuery += `&z=${MAP_OPTIONS.zoom}&g=${encodeURIComponent(JSON.stringify(GEO_JSON))}`;

/**
 * Создает и добавляет карту на страницу
 *
 * @param {HTMLElement} container - элемент-контейнер, куда будет добавлена карта
 */
function createMap(container) {
  // удаляем все содержимок внутри контейнера
  container.innerHTML = '';

  // создаем img-элемент, который будет содержать карту
  const map = document.createElement('img');
  map.setAttribute('width', MAP_OPTIONS.width);
  map.setAttribute('heigth', MAP_OPTIONS.height);
  map.setAttribute('alt', IMG_ALT);
  map.setAttribute('src', `https://static.maps.2gis.com/1.0?${urlQuery}`);

  container.append(map);
}

export default createMap;
