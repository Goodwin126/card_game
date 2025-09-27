import { templateEngine } from "../lib/template-engine.js";
import { StartPage } from "./start";
import { LosePage } from "./lose";
import { WinPage } from "./win";
import { Timer } from "./timer";

interface Card {
    rank: string | number;
    suit: string;
}

export class PlayPage {
    // Объявляем все свойства класса
    private element: HTMLElement;
    private currentPage: string;
    private level: string | null;
    private oponCards: number[] = [];
    private deck: Card[] = [];
    private cardsForGame: Card[] = [];
    private buttonRestart: HTMLElement | null;
    private cards: HTMLElement | null;
    private timer: Timer;

    constructor(element) {
        if (!(element instanceof HTMLElement)) {
            throw new Error("передана не HTML элемент");
        }
        this.element = element;
        this.currentPage = "play";
        this.level = localStorage.getItem("level-card-game");
        this.oponCards = [];
        this.deck = this.createDeck();

        this.timer = new Timer();

        setTimeout(() => {
            this.renderCardCover();
            this.timer.startTimer();
        }, 5000);

        if (!this.element.querySelector(".card-deck")) {
            console.error("Элемент .card-deck не найден!");
            return;
        }

        this.buttonRestart = document.querySelector(".btn-restart");
        if (this.buttonRestart) {
            this.buttonRestart.addEventListener("click", () => {
                this.onClickButtonRestart();
            });
        }

        this.cards = document.querySelector(".card-deck");
        if (this.cards) {
            this.cards.addEventListener("click", (event) => {
                this.onClickCard(event);
            });
        }
    }

    onClickCard(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (target.classList.contains("card-back")) {
            // Извлекаем число из сохраненного значения
            const indexStr = target.dataset.index;
            if (indexStr && indexStr.startsWith("card_")) {
                const index = parseInt(indexStr.slice(5), 10);
                if (!isNaN(index) && !this.oponCards.includes(index)) {
                    this.oponCards.push(index);

                    if (index >= 0 && index < this.cardsForGame.length) {
                        const card = this.cardsForGame[index];
                        this.renderCardOne(target, card);
                        this.checkCardsMatch();
                    }
                }
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
                this.timer.reset();
                this.element.innerHTML = "";
                new LosePage(this.element);
            }
        }
    }
    checkGameOver() {
        if (this.oponCards.length === this.cardsForGame.length) {
            this.timer.reset();
            this.element.innerHTML = "";
            new WinPage(this.element);
        }
    }

    onClickButtonRestart() {
        //Клик по кнопке "Начать заново"
        this.timer.reset();
        this.element.innerHTML = "";
        localStorage.removeItem("level-card-game");
        new StartPage(this.element);
    }

    createDeck(): Card[] {
        let deck: Card[] = [];
        const ranks = [6, 7, 8, 9, 10, "J", "Q", "K", "A"];
        const suits = ["clubs", "diamonds", "hearts", "spades"];

        for (const suit of suits) {
            for (const rank of ranks) {
                deck.push({
                    rank: rank,
                    suit: suit,
                });
            }
        }

        this.shuffleDeck(deck);
        this.selectCardByLevel(deck);
        this.cardsForGame = this.createDuble(deck);
        this.shuffleDeck(this.cardsForGame);
        this.render();

        return deck;
    }

    selectCardByLevel(deck: Card[]) {
        //выборка карт по уровню
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
        //отрисовка рубашек карт
        const cards = this.element.querySelectorAll(".card");
        cards.forEach((card: HTMLElement, index) => {
            card.innerHTML = "";
            card.classList.add("card-back");
            card.dataset.index = `card_${index}`;
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
