class StartPage {
    constructor(element) {
        if (!(element instanceof HTMLElement)) {
            throw new Error("передана не HTML элемент");
        }
        this.element = element;
        this.onHendlerClickLevel = this.onHendlerClickLevel.bind(this);
        this.onHendkerClickStart = this.onHendkerClickStart.bind(this);

        this.render();

        this.level = element.querySelector(".card-level-box");
        this.buttonChoice = element.querySelector(".card-level-button");
        this.levelItems = element.querySelectorAll(".card-level-item");

        this.level.addEventListener("click", this.onHendlerClickLevel);

        this.buttonChoice.addEventListener("click", this.onHendkerClickStart);
    }

    render() {
        this.element.appendChild(templateEngine(StartPage.template()));
    }

    onHendkerClickStart() {
        this.element.innerHTML = "";
        console.log(`Вы выбрали уровень "${window.application.level}"!`);
    }

    onHendlerClickLevel(event) {
        // Проверяем, что клик был по кнопке уровня
        if (!event.target.classList.contains("card-level-item")) {
            return;
        }

        // Удаляем класс у всех кнопок
        this.levelItems.forEach((item) => {
            item.classList.remove("card-level-item-choice");
        });

        // Добавляем класс только выбранной кнопке
        event.target.classList.add("card-level-item-choice");

        // Сохраняем выбранный уровень
        const level = event.target.textContent;
        window.application.level = level;
        localStorage.setItem("level-card-game", level);

        // Включаем кнопку старта
        this.buttonChoice.removeAttribute("disabled");
    }
}

StartPage.template = () => ({
    tag: "div",
    cls: "card-box",
    content: [
        { tag: "h6", cls: "card-level-text", content: "Выбери сложность" },
        {
            tag: "div",
            cls: "card-level-box",
            content: [
                {
                    tag: "button",
                    cls: "card-level-item",
                    content: 1,
                },
                {
                    tag: "button",
                    cls: "card-level-item",
                    content: 2,
                },
                {
                    tag: "button",
                    cls: "card-level-item",
                    content: 3,
                },
            ],
        },
        {
            tag: "button",
            cls: "card-level-button",
            content: "Старт",
            attrs: {
                disabled: true,
            },
        },
    ],
});
