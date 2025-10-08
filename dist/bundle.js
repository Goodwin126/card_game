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

/***/ "./src/js/lose.ts":
/*!************************!*\
  !*** ./src/js/lose.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LosePage = void 0;
const template_engine_js_1 = __webpack_require__(/*! ../lib/template-engine.js */ "./src/lib/template-engine.js");
const start_1 = __webpack_require__(/*! ./start */ "./src/js/start.ts");
const timer_1 = __webpack_require__(/*! ./timer */ "./src/js/timer.ts");
class LosePage {
    constructor(element) {
        this.timerResult = null;
        this.buttonRestart = null;
        if (!(element instanceof HTMLElement)) {
            throw new Error("передана не HTML элемент");
        }
        this.element = element;
        this.currentPage = "lose";
        this.timer = new timer_1.Timer();
        this.render();
        this.timerResult = Number(localStorage.getItem("timer"));
        const displayElement = document.querySelector(".card-timer-watch");
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
        new start_1.StartPage(this.element);
    }
    render() {
        const template = LosePage.template();
        const element = (0, template_engine_js_1.templateEngine)(template);
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
exports.LosePage = LosePage;


/***/ }),

/***/ "./src/js/play.ts":
/*!************************!*\
  !*** ./src/js/play.ts ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayPage = void 0;
const template_engine_js_1 = __webpack_require__(/*! ../lib/template-engine.js */ "./src/lib/template-engine.js");
const start_1 = __webpack_require__(/*! ./start */ "./src/js/start.ts");
const lose_1 = __webpack_require__(/*! ./lose */ "./src/js/lose.ts");
const win_1 = __webpack_require__(/*! ./win */ "./src/js/win.ts");
const timer_1 = __webpack_require__(/*! ./timer */ "./src/js/timer.ts");
class PlayPage {
    constructor(element) {
        this.oponCards = [];
        this.deck = [];
        this.cardsForGame = [];
        this.buttonRestart = null;
        this.cards = null;
        if (!(element instanceof HTMLElement)) {
            throw new Error("передана не HTML элемент");
        }
        this.element = element;
        this.currentPage = "play";
        this.timer = new timer_1.Timer();
        this.level = localStorage.getItem("level-card-game");
        this.oponCards = [];
        this.deck = this.createDeck();
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
    onClickCard(event) {
        const target = event.target;
        // Обработчик клика по карте
        if (target.classList.contains("card-back")) {
            const indexStr = target.dataset.index;
            if (indexStr && !isNaN(Number(indexStr))) {
                const index = Number(indexStr);
                // Проверяем, что индекс не уже в массиве
                if (!this.oponCards.includes(index)) {
                    this.oponCards.push(index);
                    // Проверяем существование карты
                    if (this.cardsForGame[index]) {
                        this.renderCardOne(target, this.cardsForGame[index]);
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
            }
            else {
                this.timer.reset();
                timer_1.Timer.globalReset();
                new lose_1.LosePage(this.element);
            }
        }
    }
    checkGameOver() {
        if (this.oponCards.length === this.cardsForGame.length) {
            this.timer.reset();
            timer_1.Timer.globalReset();
            new win_1.WinPage(this.element);
        }
    }
    onClickButtonRestart() {
        this.timer.reset();
        timer_1.Timer.globalReset();
        localStorage.removeItem("level-card-game");
        if (this.buttonRestart) {
            this.buttonRestart.removeEventListener("click", this.onClickButtonRestart);
        }
        if (this.cards) {
            this.cards.removeEventListener("click", this.onClickCard);
        }
        new start_1.StartPage(this.element);
    }
    createDeck() {
        let deck = [];
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
        setTimeout(() => {
            this.renderCardCover();
            this.timer.startTimer();
        }, 5000);
        return deck;
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
            cardsForGame.push(Object.assign({}, card));
        });
        return cardsForGame;
    }
    renderCardCover() {
        // Функция отрисовки одной карты
        const cards = this.element.querySelectorAll(".card");
        cards.forEach((card, index) => {
            const htmlCard = card;
            htmlCard.innerHTML = "";
            htmlCard.classList.add("card-back");
            htmlCard.dataset.index = index.toString(); // Преобразуем индекс в строку
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
        const element = (0, template_engine_js_1.templateEngine)(template);
        elementTarget.classList.remove("card-back");
        elementTarget.appendChild(element);
    }
    render() {
        const template = PlayPage.template(this.cardsForGame);
        const element = (0, template_engine_js_1.templateEngine)(template);
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
exports.PlayPage = PlayPage;


/***/ }),

/***/ "./src/js/start.ts":
/*!*************************!*\
  !*** ./src/js/start.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StartPage = void 0;
const template_engine_js_1 = __webpack_require__(/*! ../lib/template-engine.js */ "./src/lib/template-engine.js");
const play_1 = __webpack_require__(/*! ./play */ "./src/js/play.ts");
class StartPage {
    constructor(element) {
        var _a;
        this.buttonChoice = null;
        this.levelItems = null;
        if (!(element instanceof HTMLElement)) {
            throw new Error("передана не HTML элемент");
        }
        this.element = element;
        this.currentPage = "start";
        this.onHendlerClickLevel = this.onHendlerClickLevel.bind(this);
        this.onHendkerClickStart = this.onHendkerClickStart.bind(this);
        this.render();
        this.level = this.element.querySelector(".card-level-box");
        this.buttonChoice = this.element.querySelector(".card-level-button");
        this.levelItems =
            ((_a = this.element
                .querySelector(".card-level-box")) === null || _a === void 0 ? void 0 : _a.querySelectorAll(".card-level-item")) || null;
        this.level.addEventListener("click", this.onHendlerClickLevel);
        if (this.buttonChoice) {
            this.buttonChoice.addEventListener("click", this.onHendkerClickStart);
        }
    }
    render() {
        const template = StartPage.template();
        const element = (0, template_engine_js_1.templateEngine)(template);
        this.element.innerHTML = ""; // Очищаем элемент перед рендерингом
        this.element.appendChild(element);
    }
    onHendkerClickStart() {
        this.element.innerHTML = "";
        this.currentPage = "play";
        new play_1.PlayPage(this.element);
    }
    onHendlerClickLevel(event) {
        const target = event.target;
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
exports.StartPage = StartPage;


/***/ }),

/***/ "./src/js/timer.ts":
/*!*************************!*\
  !*** ./src/js/timer.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Timer = void 0;
class Timer {
    constructor() {
        this.timerId = null;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.isRunning = false;
    }
    startTimer() {
        if (!this.isRunning) {
            console.log("start!");
            this.startTime = Date.now();
            this.elapsedTime = 0;
            this.timerId = Number(setInterval(() => this.updateTimer(), 1000));
            this.isRunning = true;
        }
    }
    updateTimer() {
        const displayElement = document.querySelector(".timer-watch");
        if (this.isRunning && displayElement) {
            this.elapsedTime = Date.now() - this.startTime;
            this.updateDisplay(displayElement, this.elapsedTime);
        }
    }
    updateDisplay(element, countTime) {
        if (!element) {
            console.error("Элемент для отображения таймера не найден");
            return;
        }
        const [minutes, seconds] = this.timeConverter(countTime);
        if (element) {
            element.textContent = `${minutes
                .toString()
                .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }
    }
    timeConverter(timer) {
        const minutes = Math.floor(timer / 60000);
        const seconds = Math.floor((timer % 60000) / 1000);
        return [minutes, seconds];
    }
    stopTimer() {
        localStorage.setItem("timer", this.elapsedTime.toString());
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
        this.isRunning = false;
    }
    reset() {
        this.stopTimer();
        this.elapsedTime = 0;
    }
    // Статический метод для глобального сброса всех таймеров
    static globalReset() {
        console.log("Глобальный сброс таймера");
        // Сбрасываем отображение таймера
        const timerElement = document.querySelector(".timer-watch");
        if (timerElement) {
            timerElement.textContent = "00:00";
        }
    }
}
exports.Timer = Timer;


/***/ }),

/***/ "./src/js/win.ts":
/*!***********************!*\
  !*** ./src/js/win.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WinPage = void 0;
const template_engine_js_1 = __webpack_require__(/*! ../lib/template-engine.js */ "./src/lib/template-engine.js");
const start_1 = __webpack_require__(/*! ./start */ "./src/js/start.ts");
const timer_1 = __webpack_require__(/*! ./timer */ "./src/js/timer.ts");
class WinPage {
    constructor(element) {
        this.timerResult = null;
        this.buttonRestart = null;
        if (!(element instanceof HTMLElement)) {
            throw new Error("передана не HTML элемент");
        }
        this.element = element;
        this.currentPage = "lose";
        this.timer = new timer_1.Timer();
        this.render();
        this.timerResult = Number(localStorage.getItem("timer"));
        const displayElement = document.querySelector(".card-timer-watch");
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
        new start_1.StartPage(this.element);
    }
    render() {
        const template = WinPage.template();
        const element = (0, template_engine_js_1.templateEngine)(template);
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
                        alt: "смайлик победы",
                        src: "../static/сelebrate.svg",
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
exports.WinPage = WinPage;


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
var exports = __webpack_exports__;
/*!*************************!*\
  !*** ./src/js/index.ts ***!
  \*************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const play_1 = __webpack_require__(/*! ./play */ "./src/js/play.ts");
const start_1 = __webpack_require__(/*! ./start */ "./src/js/start.ts");
__webpack_require__(/*! ../css/style.css */ "./src/css/style.css");
document.addEventListener("DOMContentLoaded", () => {
    const appElement = document.querySelector(".app");
    if (!appElement) {
        console.error("Элемент .app не найден!");
        return;
    }
    if (!localStorage.getItem("level-card-game")) {
        new start_1.StartPage(appElement);
    }
    else {
        new play_1.PlayPage(appElement);
    }
});

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map