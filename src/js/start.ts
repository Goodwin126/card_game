import { templateEngine } from "../lib/template-engine.js";
import { PlayPage } from "./play";

export class StartPage {
    // Объявляем все свойства класса
    private element: HTMLElement;
    private currentPage: string;
    private level: HTMLElement | null;
    private buttonChoice: HTMLElement | null;
    private levelItems: NodeListOf<Element>;

    constructor(element) {
        if (!(element instanceof HTMLElement)) {
            throw new Error("передана не HTML элемент");
        }
        this.element = element;
        this.currentPage = "start";

        this.onHendlerClickLevel = this.onHendlerClickLevel.bind(this);
        this.onHendkerClickStart = this.onHendkerClickStart.bind(this);
        this.render();
        this.level = element.querySelector(".card-level-box");

        this.buttonChoice = element.querySelector(".card-level-button");
        this.levelItems = element
            .querySelector(".card-level-box")
            .querySelectorAll(".card-level-item");

        this.level.addEventListener("click", this.onHendlerClickLevel);
        this.buttonChoice.addEventListener("click", this.onHendkerClickStart);
    }

    render() {
        const template = StartPage.template();
        const element = templateEngine(template);
        this.element.innerHTML = ""; // Очищаем элемент перед рендерингом
        this.element.appendChild(element);
    }

    onHendkerClickStart() {
        this.element.innerHTML = "";
        this.currentPage = "play";
        new PlayPage(this.element);
    }

    onHendlerClickLevel(event) {
        if (!event.target.classList.contains("card-level-item")) {
            return;
        }

        this.levelItems.forEach((item) => {
            item.classList.remove("card-level-item-choice");
        });

        event.target.classList.add("card-level-item-choice");
        const level = event.target.textContent;
        localStorage.setItem("level-card-game", level);
        this.buttonChoice.removeAttribute("disabled");
    }

    static template() {
        return {
            tag: "div",
            cls: "card-box",
            content: [
                {
                    tag: "h6",
                    cls: "card-level-text",
                    content: "Выбери сложность",
                },
                {
                    tag: "div",
                    cls: "card-level-box",
                    content: [
                        { tag: "button", cls: "card-level-item", content: 1 },
                        { tag: "button", cls: "card-level-item", content: 2 },
                        { tag: "button", cls: "card-level-item", content: 3 },
                    ],
                },
                {
                    tag: "button",
                    cls: "card-level-button",
                    content: "Старт",
                    attrs: { disabled: true },
                },
            ],
        };
    }
}
