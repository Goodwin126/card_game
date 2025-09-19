import { templateEngine } from "../lib/template-engine.js";
import { StartPage } from "./start.js";

export class PlayPage {
    constructor(element) {
        if (!(element instanceof HTMLElement)) {
            throw new Error("передана не HTML элемент");
        }
        this.element = element;
        this.currentPage = "play";

        this.level = localStorage.getItem("level-card-game");
        this.oponCards = [];
        this.deck = this.createDeck();

        if (!this.element.querySelector(".card-deck")) {
            console.error("Элемент .card-deck не найден!");
            return;
        }

        this.buttonRestart = document.querySelector(".btn-restart");
        this.buttonRestart.addEventListener("click", () => {
            this.onClickButtonRestart();
        });

        this.cards = document.querySelector(".card-deck");
        this.cards.addEventListener("click", (event) => {
            this.onClickCard(event);
        });
    }

    onClickCard(event) {
        // Обработчик клика по карте
        if (event.target.classList.contains("card-back")) {
            const index = event.target.dataset.index;
            if (!this.oponCards.includes(index)) {
                this.oponCards.push(index);

                const card = this.cardsForGame[index];

                this.renderCardOne(event.target, card);
                this.checkCardsMatch();
            }
        }
    }

    checkCardsMatch() {
        // Функция проверки на совпадение
        if (this.oponCards.length % 2 === 0) {
            const index1 = this.oponCards[this.oponCards.length - 2];
            const index2 = this.oponCards[this.oponCards.length - 1];
            let card1 = this.cardsForGame[index1];
            let card2 = this.cardsForGame[index2];

            if (card1.rank === card2.rank && card1.suit === card2.suit) {
                this.checkGameOver();
                // Карты совпали
            } else {
                // Перевернуть карты обратно
                alert("Вы проиграли!");
            }
        }
    }
    checkGameOver() {
        if (this.oponCards.length === this.cardsForGame.length) {
            alert("Поздравляем! Вы выиграли!");
            this.element.innerHTML = "";
            new StartPage(this.element);
        }
    }

    onClickButtonRestart() {
        //Клик по кнопке "Начать заново"
        this.element.innerHTML = "";
        localStorage.removeItem("level-card-game");
        new StartPage(this.element);
    }

    createDeck() {
        // Функция создания колоды карт
        let deck = [];
        const ranks = [6, 7, 8, 9, 10, "J", "Q", "K", "A"];
        const suits = ["clubs", "diamonds", "hearts", "spades"];

        //создаем калоду
        for (const suit of suits) {
            for (const rank of ranks) {
                deck.push({
                    rank: rank,
                    suit: suit,
                });
            }
        }
        //перемешиваем калоду
        this.shuffleDeck(deck);
        //выбираем карты исходя из уровня сложности
        this.selectCardByLevel(deck);
        //создаём дубли
        this.cardsForGame = this.createDuble(deck);
        //перемешивает полученные карты
        this.shuffleDeck(this.cardsForGame);
        this.cards = this.cardsForGame;
        //отрисовываем карты
        this.render();
        setTimeout(() => {
            this.renderCardCover();
        }, 5000);
    }

    selectCardByLevel(deck) {
        const level = this.level;
        switch (level) {
            case "1":
                deck.length = 3;
                break;
            case "2":
                deck.length = 6;
                break;
            case "3":
                deck.length = 9;
                break;
        }
    }

    createDuble(cards) {
        // Функция создания дублей
        const cardsForGame = [];
        cards.forEach((card) => {
            cardsForGame.push(card);
            cardsForGame.push({ ...card });
        });
        return cardsForGame;
    }

    renderCardCover() {
        // Функция отрисовки одной карты
        const cards = this.element.querySelectorAll(".card");
        cards.forEach((card, index) => {
            card.innerHTML = "";
            card.classList.add("card-back");
            card.dataset.index = index;
        });
        return cards;
    }

    shuffleDeck(deck) {
        // Функция перемешивания колоды
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    renderCardOne(elementTarget, card) {
        // Функция отрисовки рубашек карты
        const template = PlayPage.templateCard(card);
        const element = templateEngine(template);
        elementTarget.classList.remove("card-back");
        elementTarget.appendChild(element);
    }

    render() {
        const template = PlayPage.template(this.cardsForGame);
        const element = templateEngine(template);
        this.element.innerHTML = "";
        this.element.appendChild(element);
    }

    static template(deck) {
        return {
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
                    content: deck.map((card) => ({
                        tag: "div",
                        cls: "card",
                        content: [
                            {
                                tag: "div",
                                cls: "card-box-up",
                                content: {
                                    tag: "div",
                                    cls: "card-small-box",
                                    content: [
                                        {
                                            tag: "div",
                                            cls: "card-name",
                                            content: card.rank,
                                        },
                                        {
                                            tag: "div",
                                            cls: [
                                                "card-small-suit",
                                                `card-small-suit_${card.suit}`,
                                            ],
                                        },
                                    ],
                                },
                            },
                            {
                                tag: "div",
                                cls: ["cart-suit", `cart-suit_${card.suit}`],
                            },
                            {
                                tag: "div",
                                cls: "card-box-down",
                                content: {
                                    tag: "div",
                                    cls: "card-small-box-reverse",
                                    content: [
                                        {
                                            tag: "div",
                                            cls: "card-name",
                                            content: card.rank,
                                        },
                                        {
                                            tag: "div",
                                            cls: [
                                                "card-small-suit",
                                                `card-small-suit_${card.suit}`,
                                            ],
                                        },
                                    ],
                                },
                            },
                        ],
                    })),
                },
            ],
        };
    }

    static templateCard(card) {
        return [
            {
                tag: "div",
                cls: "card-box-up",
                content: {
                    tag: "div",
                    cls: "card-small-box",
                    content: [
                        {
                            tag: "div",
                            cls: "card-name",
                            content: card.rank,
                        },
                        {
                            tag: "div",
                            cls: [
                                "card-small-suit",
                                `card-small-suit_${card.suit}`,
                            ],
                        },
                    ],
                },
            },
            {
                tag: "div",
                cls: ["cart-suit", `cart-suit_${card.suit}`],
            },
            {
                tag: "div",
                cls: "card-box-down",
                content: {
                    tag: "div",
                    cls: "card-small-box-reverse",
                    content: [
                        {
                            tag: "div",
                            cls: "card-name",
                            content: card.rank,
                        },
                        {
                            tag: "div",
                            cls: [
                                "card-small-suit",
                                `card-small-suit_${card.suit}`,
                            ],
                        },
                    ],
                },
            },
        ];
    }
}
