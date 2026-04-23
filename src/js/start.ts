import { templateEngine } from "../lib/template-engine";
import { PlayPage } from "./play";

export class StartPage {
    private element: HTMLElement;
    private level: HTMLElement;
    private buttonChoice: HTMLElement | null = null;
    private levelItems: NodeListOf<Element> | null = null;

    constructor(element: HTMLElement) {
        if (!(element instanceof HTMLElement)) {
            throw new Error("передана не HTML элемент");
        }
        this.element = element;

        this.onHendlerClickLevel = this.onHendlerClickLevel.bind(this);
        this.onHendkerClickStart = this.onHendkerClickStart.bind(this);
        this.render();
        this.level = this.element.querySelector(".card-level-box")!;

        this.buttonChoice = this.element.querySelector(".card-level-button");
        this.levelItems =
            this.element
                .querySelector(".card-level-box")
                ?.querySelectorAll(".card-level-item") || null;

        this.level.addEventListener("click", this.onHendlerClickLevel);
        if (this.buttonChoice) {
            this.buttonChoice.addEventListener(
                "click",
                this.onHendkerClickStart
            );
        }
    }

    render() {
        const template = StartPage.template();
        const element = templateEngine(template);
        this.element.innerHTML = ""; // Очищаем элемент перед рендерингом
        this.element.appendChild(element);
    }

    onHendkerClickStart() {
        this.element.innerHTML = "";
        new PlayPage(this.element);
    }

    onHendlerClickLevel(event: Event) {
        const target = event.target as HTMLElement;
        if (!target.classList.contains("card-level-item")) {
            return;
        }
        if (this.levelItems) {
            this.levelItems.forEach((item) => {
                item.classList.remove("card-level-item-choice");
            });
        }

        target.classList.add("card-level-item-choice");
        const level = target.textContent;
        localStorage.setItem("level-card-game", level);
        if (this.buttonChoice) {
            this.buttonChoice.removeAttribute("disabled");
        }
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
