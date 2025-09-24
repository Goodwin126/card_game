import { templateEngine } from "../lib/template-engine.js";
import { StartPage } from "./start";

export class LosePage {
    // Объявляем все свойства класса
    private element: HTMLElement;
    private currentPage: string;
    private buttonRestart: HTMLElement | null;

    constructor(element) {
        if (!(element instanceof HTMLElement)) {
            throw new Error("передана не HTML элемент");
        }
        this.element = element;
        this.currentPage = "lose";
        this.render();

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
                    content: "01.20",
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
