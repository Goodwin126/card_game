import { PlayPage } from "./play.js";
import { StartPage } from "./start.js";
import "../css/style.css";

document.addEventListener("DOMContentLoaded", () => {
    if (window.application && window.application.initialized) {
        console.warn("Приложение уже инициализировано!");
        return;
    }

    window.application = {
        initialized: false,
        currentPage: null,
    };

    const appElement = document.querySelector(".app");

    if (!appElement) {
        console.error("Элемент .app не найден!");
        return;
    }

    if (!localStorage.getItem("level-card-game")) {
        new StartPage(appElement);
    } else {
        new PlayPage(appElement);
    }
});
