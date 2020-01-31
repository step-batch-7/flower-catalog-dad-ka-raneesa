'use strict';

const hideImage = () => {
  const seconds = 1000;
  const element = document.getElementById('watering-can');
  element.style['visibility'] = 'hidden';
  setTimeout(() => {
    element.style['visibility'] = 'visible';
  }, seconds);
};
