class PlayPage {
    constructor(element) {
        if (!(element instanceof HTMLElement)) {
            throw new Error("передана не HTML элемент");
        }
        this.element = element;
        this.render();
    }
    render() {
        this.element.appendChild(templateEngine(PlayPage.template()));
    }
}

PlayPage.template = () => ({
    tag: "div",
    cls: "cards",
    content: [
        {
            tag: "div",
            cls: "control-panel",
            content: [
                {
                    tag: "div",
                    cls: "timer-box",
                    content: [
                        {
                            tag: "div",
                            cls: "timer-artical",
                            content: [
                                {
                                    tag: "div",
                                    cls: "timer-artical-sec",
                                    content: "sek",
                                },
                                {
                                    tag: "div",
                                    cls: "timer-artical-sec",
                                    content: "min",
                                },
                            ],
                        },
                        {
                            tag: "div",
                            cls: "timer-watch",
                            content: "00.00",
                        },
                    ],
                },
                {
                    tag: "button",
                    cls: "btn-restart",
                    content: "Начать заново",
                },
            ],
        },
        {
            tag: "div",
            cls: "card-deck",
        },
    ],
});
