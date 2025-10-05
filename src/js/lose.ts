import { templateEngine } from "../lib/template-engine.js";
import { StartPage } from "./start";
import { Timer } from "./timer";

export class LosePage {
    private element: HTMLElement;
    private currentPage: string;
    private timer: Timer;
    private timerResult: number | null = null;
    private buttonRestart: HTMLElement | null = null;

    constructor(element: HTMLElement) {
        if (!(element instanceof HTMLElement)) {
            throw new Error("передана не HTML элемент");
        }

        this.element = element;
        this.currentPage = "lose";
        this.timer = new Timer();

        this.render();

        this.timerResult = Number(localStorage.getItem("timer"));
        const displayElement = document.querySelector(
            ".card-timer-watch"
        ) as HTMLElement | null;

        if (displayElement && this.timerResult !== null) {
            this.timer.updateDisplay(displayElement, this.timerResult);
        }

        localStorage.removeItem("timer");

        this.buttonRestart = document.querySelector(".card-celebrate-button");

        if (this.buttonRestart) {
            this.buttonRestart.addEventListener("click", () => {
                this.onClickButtonRestart();
            });
        }
    }

    onClickButtonRestart() {
        this.element.innerHTML = "";
        localStorage.removeItem("level-card-game");
        new StartPage(this.element);
    }

    render() {
        const template = LosePage.template();
        const element = templateEngine(template);

        // Очищаем элемент перед добавлением нового контента
        this.element.innerHTML = "";
        this.element.appendChild(element);
    }

    static template() {
        return {
            tag: "div",
            cls: "card-box",
            content: [
                {
                    tag: "img",
                    cls: "card-celebrate-img",
                    attrs: {
                        alt: "смайлик поражения",
                        src: "../static/lose.svg",
                    },
                },
                {
                    tag: "h6",
                    cls: "card-celebrate-text",
                    content: "Вы проиграли!",
                },
                {
                    tag: "h6",
                    cls: "card-celebrate-time-text",
                    content: "Затраченное время:",
                },
                {
                    tag: "div",
                    cls: "card-timer-watch",
                    content: "00:00",
                },
                {
                    tag: "div",
                    cls: "card-celebrate-button",
                    content: "Играть снова",
                },
            ],
        };
    }
}
