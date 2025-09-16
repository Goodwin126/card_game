import { StartPage } from "./start.js";
import { PlayPage } from "./play.js";

document.addEventListener("DOMContentLoaded", () => {
    window.application = {
        level: null,
    };

    const value = localStorage.getItem("level-card-game");
    const appElement = document.querySelector(".app");

    if (!value) {
        if (appElement) {
            new StartPage(appElement);
        }
    } else {
        if (appElement) {
            window.application.level = value;
            new PlayPage(appElement);
        }
    }
});
