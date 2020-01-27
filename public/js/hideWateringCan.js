const hideImage = () => {
  const element = document.getElementById('watering-can');
  element.style['visibility'] = 'hidden';
  setTimeout(() => (element.style['visibility'] = 'visible'), 1000);
};