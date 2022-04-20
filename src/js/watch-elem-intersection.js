const DATA_ATTR = {
  // элемент-источник, за которым ведется наблюдение находится ли он в пределах видимости экрана
  observer: 'data-observer',
  // атрибут, который добавляется элемент-источнику и содержит ссылку на ID элемента элемента-цели,
  // которому добавляется служебный класс, когда элемент-источник скрывается за пределы видимости экрана
  target: 'data-observer-target',
};

const CSS_CLASSES = {
  // служебный класс, который допавляется к элементу-цели, если элемент-истоник выходит за пределы экрана
  outOfScreen: 'scrolled',
};

/**
 * Используя IntersectionObserver добавляет/убирает класс CSS_CLASSES.outOfScreen элементу-цели,
 * когда элемент-источник выходит/входит в пределы видимости экрана
 */
function watchElemIntersection() {
  // находим все элементы-источники по data-атрибуту
  const observerElements = document.querySelectorAll(`[${DATA_ATTR.observer}]`);

  observerElements.forEach((observElement) => {
    // ID элемента-цели находится в отдельном data-атрибуте элемента-источника
    const targetID = observElement.getAttribute(DATA_ATTR.target);
    const targetElem = document.querySelector(`#${targetID}`);

    if (targetElem) {
      const observer = new IntersectionObserver(updateTargetElem(targetElem), {threshold: 0.01});
      observer.observe(observElement);
    }
  });

  function updateTargetElem(target) {
    return function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // если элемент-истоник в пределах экрана служебный класс у элемента-цели убираем
          target.classList.remove(CSS_CLASSES.outOfScreen);
        } else {
          // иначе служебный класс элементу-цели добавляем
          target.classList.add(CSS_CLASSES.outOfScreen);
        }
      });
    };
  }
}

export default watchElemIntersection;
