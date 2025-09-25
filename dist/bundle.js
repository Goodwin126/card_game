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
var template_engine_js_1 = __webpack_require__(/*! ../lib/template-engine.js */ "./src/lib/template-engine.js");
var start_1 = __webpack_require__(/*! ./start */ "./src/js/start.ts");
var LosePage = /** @class */ (function () {
    function LosePage(element) {
        var _this = this;
        if (!(element instanceof HTMLElement)) {
            throw new Error("передана не HTML элемент");
        }
        this.element = element;
        this.currentPage = "lose";
        this.render();
        this.timerResult = window.application.timer;
        console.log(this.timerResult);
        this.buttonRestart = document.querySelector(".card-celebrate-button");
        if (this.buttonRestart) {
            this.buttonRestart.addEventListener("click", function () {
                _this.onClickButtonRestart();
            });
        }
    }
    LosePage.prototype.onClickButtonRestart = function () {
        this.element.innerHTML = "";
        localStorage.removeItem("level-card-game");
        new start_1.StartPage(this.element);
    };
    LosePage.prototype.render = function () {
        var template = LosePage.template(this.timerResult);
        var element = (0, template_engine_js_1.templateEngine)(template);
        this.element.innerHTML = "";
        this.element.appendChild(element);
    };
    LosePage.template = function (timeResult) {
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
                    content: timeResult ? timeResult.toString() : "00:00",
                },
                {
                    tag: "div",
                    cls: "card-celebrate-button",
                    content: "Играть снова",
                },
            ],
        };
    };
    return LosePage;
}());
exports.LosePage = LosePage;


/***/ }),

/***/ "./src/js/play.ts":
/*!************************!*\
  !*** ./src/js/play.ts ***!
  \************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayPage = void 0;
var template_engine_js_1 = __webpack_require__(/*! ../lib/template-engine.js */ "./src/lib/template-engine.js");
var start_1 = __webpack_require__(/*! ./start */ "./src/js/start.ts");
var lose_1 = __webpack_require__(/*! ./lose */ "./src/js/lose.ts");
var win_1 = __webpack_require__(/*! ./win */ "./src/js/win.ts");
var timer_1 = __webpack_require__(/*! ./timer */ "./src/js/timer.ts");
var PlayPage = /** @class */ (function () {
    function PlayPage(element) {
        var _this = this;
        this.oponCards = [];
        this.deck = [];
        this.cardsForGame = [];
        if (!(element instanceof HTMLElement)) {
            throw new Error("передана не HTML элемент");
        }
        this.element = element;
        this.currentPage = "play";
        this.level = localStorage.getItem("level-card-game");
        this.oponCards = [];
        this.deck = this.createDeck();
        this.timer = new timer_1.Timer();
        setTimeout(function () {
            _this.renderCardCover();
            _this.timer.startTimer();
        }, 5000);
        if (!this.element.querySelector(".card-deck")) {
            console.error("Элемент .card-deck не найден!");
            return;
        }
        this.buttonRestart = document.querySelector(".btn-restart");
        if (this.buttonRestart) {
            this.buttonRestart.addEventListener("click", function () {
                _this.onClickButtonRestart();
            });
        }
        this.cards = document.querySelector(".card-deck");
        if (this.cards) {
            this.cards.addEventListener("click", function (event) {
                _this.onClickCard(event);
            });
        }
    }
    PlayPage.prototype.onClickCard = function (event) {
        var target = event.target;
        if (target.classList.contains("card-back")) {
            // Извлекаем число из сохраненного значения
            var indexStr = target.dataset.index;
            if (indexStr && indexStr.startsWith("card_")) {
                var index = parseInt(indexStr.slice(5), 10);
                if (!isNaN(index) && !this.oponCards.includes(index)) {
                    this.oponCards.push(index);
                    if (index >= 0 && index < this.cardsForGame.length) {
                        var card = this.cardsForGame[index];
                        this.renderCardOne(target, card);
                        this.checkCardsMatch();
                    }
                }
            }
        }
    };
    PlayPage.prototype.checkCardsMatch = function () {
        // Функция проверки на совпадение
        if (this.oponCards.length % 2 === 0) {
            var index1 = this.oponCards[this.oponCards.length - 2];
            var index2 = this.oponCards[this.oponCards.length - 1];
            var card1 = this.cardsForGame[index1];
            var card2 = this.cardsForGame[index2];
            if (card1.rank === card2.rank && card1.suit === card2.suit) {
                this.checkGameOver();
                // Карты совпали
            }
            else {
                this.timer.reset();
                this.element.innerHTML = "";
                new lose_1.LosePage(this.element);
            }
        }
    };
    PlayPage.prototype.checkGameOver = function () {
        if (this.oponCards.length === this.cardsForGame.length) {
            this.timer.reset();
            this.element.innerHTML = "";
            new win_1.WinPage(this.element);
        }
    };
    PlayPage.prototype.onClickButtonRestart = function () {
        //Клик по кнопке "Начать заново"
        this.timer.reset();
        this.element.innerHTML = "";
        localStorage.removeItem("level-card-game");
        new start_1.StartPage(this.element);
    };
    PlayPage.prototype.createDeck = function () {
        var deck = [];
        var ranks = [6, 7, 8, 9, 10, "J", "Q", "K", "A"];
        var suits = ["clubs", "diamonds", "hearts", "spades"];
        for (var _i = 0, suits_1 = suits; _i < suits_1.length; _i++) {
            var suit = suits_1[_i];
            for (var _a = 0, ranks_1 = ranks; _a < ranks_1.length; _a++) {
                var rank = ranks_1[_a];
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
    };
    PlayPage.prototype.selectCardByLevel = function (deck) {
        //выборка карт по уровню
        var level = this.level;
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
    };
    PlayPage.prototype.createDuble = function (cards) {
        // Функция создания дублей
        var cardsForGame = [];
        cards.forEach(function (card) {
            cardsForGame.push(card);
            cardsForGame.push(__assign({}, card));
        });
        return cardsForGame;
    };
    PlayPage.prototype.renderCardCover = function () {
        //отрисовка рубашек карт
        var cards = this.element.querySelectorAll(".card");
        cards.forEach(function (card, index) {
            card.innerHTML = "";
            card.classList.add("card-back");
            card.dataset.index = "card_".concat(index);
        });
        return cards;
    };
    PlayPage.prototype.shuffleDeck = function (deck) {
        var _a;
        // Функция перемешивания колоды
        for (var i = deck.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            _a = [deck[j], deck[i]], deck[i] = _a[0], deck[j] = _a[1];
        }
    };
    PlayPage.prototype.renderCardOne = function (elementTarget, card) {
        // Функция отрисовки рубашек карты
        var template = PlayPage.templateCard(card);
        var element = (0, template_engine_js_1.templateEngine)(template);
        elementTarget.classList.remove("card-back");
        elementTarget.appendChild(element);
    };
    PlayPage.prototype.render = function () {
        var template = PlayPage.template(this.cardsForGame);
        var element = (0, template_engine_js_1.templateEngine)(template);
        this.element.innerHTML = "";
        this.element.appendChild(element);
    };
    PlayPage.template = function (deck) {
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
                    content: deck.map(function (card) { return ({
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
                                                "card-small-suit_".concat(card.suit),
                                            ],
                                        },
                                    ],
                                },
                            },
                            {
                                tag: "div",
                                cls: ["cart-suit", "cart-suit_".concat(card.suit)],
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
                                                "card-small-suit_".concat(card.suit),
                                            ],
                                        },
                                    ],
                                },
                            },
                        ],
                    }); }),
                },
            ],
        };
    };
    PlayPage.templateCard = function (card) {
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
                                "card-small-suit_".concat(card.suit),
                            ],
                        },
                    ],
                },
            },
            {
                tag: "div",
                cls: ["cart-suit", "cart-suit_".concat(card.suit)],
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
                                "card-small-suit_".concat(card.suit),
                            ],
                        },
                    ],
                },
            },
        ];
    };
    return PlayPage;
}());
exports.PlayPage = PlayPage;


/***/ }),

/***/ "./src/js/start.ts":
/*!*************************!*\
  !*** ./src/js/start.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StartPage = void 0;
var template_engine_js_1 = __webpack_require__(/*! ../lib/template-engine.js */ "./src/lib/template-engine.js");
var play_1 = __webpack_require__(/*! ./play */ "./src/js/play.ts");
var StartPage = /** @class */ (function () {
    function StartPage(element) {
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
    StartPage.prototype.render = function () {
        var template = StartPage.template();
        var element = (0, template_engine_js_1.templateEngine)(template);
        this.element.innerHTML = ""; // Очищаем элемент перед рендерингом
        this.element.appendChild(element);
    };
    StartPage.prototype.onHendkerClickStart = function () {
        this.element.innerHTML = "";
        this.currentPage = "play";
        new play_1.PlayPage(this.element);
    };
    StartPage.prototype.onHendlerClickLevel = function (event) {
        if (!event.target.classList.contains("card-level-item")) {
            return;
        }
        this.levelItems.forEach(function (item) {
            item.classList.remove("card-level-item-choice");
        });
        event.target.classList.add("card-level-item-choice");
        var level = event.target.textContent;
        localStorage.setItem("level-card-game", level);
        this.buttonChoice.removeAttribute("disabled");
    };
    StartPage.template = function () {
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
    };
    return StartPage;
}());
exports.StartPage = StartPage;


/***/ }),

/***/ "./src/js/timer.ts":
/*!*************************!*\
  !*** ./src/js/timer.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Timer = void 0;
var Timer = /** @class */ (function () {
    function Timer() {
        this.isRunning = false;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerId = null; // Лучший вариант
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerId = null;
    }
    Timer.prototype.startTimer = function () {
        var _this = this;
        if (this.isRunning) {
            console.warn("Таймер уже запущен");
            return;
        }
        this.isRunning = true;
        this.startTime = Date.now();
        this.timerId = setInterval(function () {
            _this.updateTimer();
        }, 1000);
    };
    Timer.prototype.stopTimer = function () {
        if (this.timerId) {
            console.log(this.elapsedTime);
            window.application.timer = Number(this.timerId);
            clearInterval(this.timerId);
            this.timerId = undefined;
            this.elapsedTime = undefined;
            this.startTime = undefined;
        }
    };
    Timer.prototype.updateTimer = function () {
        if (!this.timerId)
            return;
        this.elapsedTime = Date.now() - this.startTime;
        var _a = this.acquisitionTime(this.elapsedTime), minutes = _a.minutes, seconds = _a.seconds;
        var timerElement = document.querySelector(".timer-watch");
        if (timerElement) {
            timerElement.textContent = "".concat(minutes, ":").concat(seconds);
        }
    };
    Timer.prototype.acquisitionTime = function (elapsedTime) {
        var seconds = Math.floor(elapsedTime / 1000);
        var minutes = Math.floor(seconds / 60);
        // Форматируем минуты и секунды с ведущими нулями
        var formattedMinutes = minutes.toString().padStart(2, "0");
        var formattedSeconds = (seconds % 60).toString().padStart(2, "0");
        // Возвращаем объект с двумя свойствами
        return {
            minutes: formattedMinutes,
            seconds: formattedSeconds,
        };
    };
    // Дополнительные методы
    Timer.prototype.reset = function () {
        this.stopTimer();
        this.elapsedTime = 0;
        this.startTime = 0;
        var timerElement = document.querySelector(".timer-watch");
        if (timerElement) {
            timerElement.textContent = "00:00";
        }
    };
    Timer.prototype.getElapsedTime = function () {
        return this.elapsedTime;
    };
    Timer.prototype.getFormattedTime = function () {
        var seconds = Math.floor(this.elapsedTime / 1000);
        var minutes = Math.floor(seconds / 60);
        return "".concat(minutes.toString().padStart(2, "0"), ":").concat((seconds % 60)
            .toString()
            .padStart(2, "0"));
    };
    return Timer;
}());
exports.Timer = Timer;


/***/ }),

/***/ "./src/js/win.ts":
/*!***********************!*\
  !*** ./src/js/win.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WinPage = void 0;
var template_engine_js_1 = __webpack_require__(/*! ../lib/template-engine.js */ "./src/lib/template-engine.js");
var start_1 = __webpack_require__(/*! ./start */ "./src/js/start.ts");
var WinPage = /** @class */ (function () {
    function WinPage(element) {
        var _this = this;
        if (!(element instanceof HTMLElement)) {
            throw new Error("передана не HTML элемент");
        }
        this.element = element;
        this.currentPage = "win";
        this.render();
        this.buttonRestart = document.querySelector(".card-celebrate-button");
        if (this.buttonRestart) {
            this.buttonRestart.addEventListener("click", function () {
                _this.onClickButtonRestart();
            });
        }
    }
    WinPage.prototype.onClickButtonRestart = function () {
        this.element.innerHTML = "";
        localStorage.removeItem("level-card-game");
        new start_1.StartPage(this.element);
    };
    WinPage.prototype.render = function () {
        var template = WinPage.template();
        var element = (0, template_engine_js_1.templateEngine)(template);
        this.element.innerHTML = "";
        this.element.appendChild(element);
    };
    WinPage.template = function () {
        return {
            tag: "div",
            cls: "card-box",
            content: [
                {
                    tag: "img",
                    cls: "card-celebrate-img",
                    attrs: {
                        alt: "победный смайлик",
                        src: "../static/сelebrate.svg",
                    },
                },
                {
                    tag: "h6",
                    cls: "card-celebrate-text",
                    content: "Вы выиграли!",
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
    };
    return WinPage;
}());
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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
var play_1 = __webpack_require__(/*! ./play */ "./src/js/play.ts");
var start_1 = __webpack_require__(/*! ./start */ "./src/js/start.ts");
__webpack_require__(/*! ../css/style.css */ "./src/css/style.css");
// Создаём реальную переменную
window.application = {
    timer: null,
};
document.addEventListener("DOMContentLoaded", function () {
    var appElement = document.querySelector(".app");
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