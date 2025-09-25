import { PlayPage } from "./play";
import { StartPage } from "./start";
import "../css/style.css";

// Объявляем глобальную переменную
declare global {
    interface Window {
        application: {
            timer: number | null;
        };
    }
}

// Создаём реальную переменную
window.application = {
    timer: null,
};

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
