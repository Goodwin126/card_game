import { PlayPage } from "./play.js";
import { StartPage } from "./start.js";
import "../css/style.css";

document.addEventListener("DOMContentLoaded", () => {
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
