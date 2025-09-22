/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/css/style.css":
/*!***************************!*\
  !*** ./src/css/style.css ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/js/play.js":
/*!************************!*\
  !*** ./src/js/play.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PlayPage: () => (/* binding */ PlayPage)
/* harmony export */ });
/* harmony import */ var _lib_template_engine_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/template-engine.js */ "./src/lib/template-engine.js");
/* harmony import */ var _start_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./start.js */ "./src/js/start.js");



class PlayPage {
    constructor(element) {
        if (!(element instanceof HTMLElement)) {
            throw new Error("передана не HTML элемент");
        }
        this.element = element;
        window.application.currentPage = "play";

        window.application.level = localStorage.getItem("level-card-game");
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
            new _start_js__WEBPACK_IMPORTED_MODULE_1__.StartPage(this.element);
        }
    }

    onClickButtonRestart() {
        //Клик по кнопке "Начать заново"
        this.element.innerHTML = "";
        localStorage.removeItem("level-card-game");
        new _start_js__WEBPACK_IMPORTED_MODULE_1__.StartPage(this.element);
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
        window.application.cards = this.cardsForGame;
        //отрисовываем карты
        this.render();
        setTimeout(() => {
            this.renderCardCover();
        }, 5000);
    }

    selectCardByLevel(deck) {
        const level = window.application.level;
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
        const element = (0,_lib_template_engine_js__WEBPACK_IMPORTED_MODULE_0__.templateEngine)(template);
        elementTarget.classList.remove("card-back");
        elementTarget.appendChild(element);
    }

    render() {
        const template = PlayPage.template(this.cardsForGame);
        const element = (0,_lib_template_engine_js__WEBPACK_IMPORTED_MODULE_0__.templateEngine)(template);
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


/***/ }),

/***/ "./src/js/start.js":
/*!*************************!*\
  !*** ./src/js/start.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StartPage: () => (/* binding */ StartPage)
/* harmony export */ });
/* harmony import */ var _lib_template_engine_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lib/template-engine.js */ "./src/lib/template-engine.js");
/* harmony import */ var _play_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./play.js */ "./src/js/play.js");



class StartPage {
    constructor(element) {
        if (!(element instanceof HTMLElement)) {
            throw new Error("передана не HTML элемент");
        }
        window.application.currentPage = "start";

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
        const element = (0,_lib_template_engine_js__WEBPACK_IMPORTED_MODULE_0__.templateEngine)(template);
        this.element.innerHTML = ""; // Очищаем элемент перед рендерингом
        this.element.appendChild(element);
    }

    onHendkerClickStart() {
        this.element.innerHTML = "";
        window.application.currentPage = "play";
        new _play_js__WEBPACK_IMPORTED_MODULE_1__.PlayPage(this.element);
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


/***/ }),

/***/ "./src/lib/template-engine.js":
/*!************************************!*\
  !*** ./src/lib/template-engine.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   templateEngine: () => (/* binding */ templateEngine)
/* harmony export */ });
function templateEngine(block) {
    if (block === undefined || block === null || block === false) {
        return document.createTextNode("");
    }
    if (
        typeof block === "string" ||
        typeof block === "number" ||
        block === true
    ) {
        return document.createTextNode(block);
    }
    if (Array.isArray(block)) {
        const fragment = document.createDocumentFragment();

        block.forEach((element) => {
            fragment.appendChild(templateEngine(element));
        });

        return fragment;
    }

    const result = document.createElement(block.tag);

    if (block.cls) {
        const classes = [].concat(block.cls);
        classes.forEach((cls) => {
            result.classList.add(cls);
        });
    }

    if (block.attrs) {
        const keys = Object.keys(block.attrs);

        keys.forEach((key) => {
            result.setAttribute(key, block.attrs[key]);
        });
    }

    result.appendChild(templateEngine(block.content));

    return result;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*************************!*\
  !*** ./src/js/index.js ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _play_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./play.js */ "./src/js/play.js");
/* harmony import */ var _start_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./start.js */ "./src/js/start.js");
/* harmony import */ var _css_style_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../css/style.css */ "./src/css/style.css");




document.addEventListener("DOMContentLoaded", () => {
    window.application = {
        currentPage: null,
    };

    const appElement = document.querySelector(".app");

    if (!appElement) {
        console.error("Элемент .app не найден!");
        return;
    }

    if (!localStorage.getItem("level-card-game")) {
        new _start_js__WEBPACK_IMPORTED_MODULE_1__.StartPage(appElement);
    } else {
        new _play_js__WEBPACK_IMPORTED_MODULE_0__.PlayPage(appElement);
    }
});

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map