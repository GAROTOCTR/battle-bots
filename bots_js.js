const nao_sei = document.querySelector(".nao_sei");
const navmenu = document.querySelector(".nav-menu");

nao_sei.addEventListener("click",() => {
    nao_sei.classList.toggle ('active');
    navmenu.classList.toggle('active');
}) 