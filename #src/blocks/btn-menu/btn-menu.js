const btnMenu = document.querySelector('.btn-menu');
const menu = document.querySelector('.header__menu');

btnMenu.addEventListener('click', () => {
  btnMenu.classList.toggle('btn-menu--close');
  menu.classList.toggle('header__menu--active');
})