//starter code was taken from the simple spa demo from MAD9014
//https://prof3ssorst3v3.github.io/simple-spa-demo/#green

const APP = {
    active: null,
    pages: [],
    baseURL: null,
    init: () => {
        app.active = document.querySelector(".active");
        APP.pages = document.querySelectorAll(".page");
        console.log(APP.pages);
        let links = document.querySelectorAll("[data-href]");
        links.forEach(link => {
            link.addEventListener("click", APP.nav);
        });
    },
    nav: ev => {
        ev.preventDefault();
        ev.stopPropagation();
        let link = ev.target;
        let target = link.getAttribute("data-href");
        //change the display of the "page"
        APP.showPage(target);
        //use switch case with target for page specific things
    },
    showPage: target => {
        document.querySelector(".active").classList.remove("active");
        document.querySelector(`#${target}`).classList.add("active");
    }
};

//copied from https://prof3ssorst3v3.github.io/mad9014/modules/week13/#domcontentloaded-vs-deviceready
//check to see which device we are ready on:
let ready = "cordova" in window ? "deviceready" : "DOMContentLoaded";

document.addEventListener(ready, APP.init);