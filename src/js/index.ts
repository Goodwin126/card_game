import { PlayPage } from "./play";
import { StartPage } from "./start";
import "../css/style.css";

document.addEventListener("DOMContentLoaded", () => {
    const appElement = document.querySelector(".app") as HTMLElement;

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
