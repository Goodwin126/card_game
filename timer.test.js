const { Timer } = require("./src/js/timer.ts");

let timer;

let localStorageMock;

describe("Timer - pure methods", () => {
    beforeEach(() => {
        // Создаем новый экземпляр таймера перед каждым тестом
        timer = new Timer();

        // Создаем мок для localStorage
        localStorageMock = {
            setItem: jest.fn(),
        };

        // Подменяем оригинальный localStorage нашим моком
        global.localStorage = localStorageMock;

        // Мокаем document для тестов
        document.body.innerHTML = `<div class="timer-watch"></div>`;
    });

    // Добавляем очистку всех таймеров после каждого теста
    afterEach(() => {
        jest.clearAllTimers();
        if (timer && timer.timerId) {
            clearInterval(timer.timerId);
        }
    });

    describe("timeConverter", () => {
        test("should convert 0 ms to 00:00", () => {
            const [minutes, seconds] = timer.timeConverter(0);
            expect(minutes).toBe(0);
            expect(seconds).toBe(0);
        });

        test("should convert 60000 ms to 01:00", () => {
            const [minutes, seconds] = timer.timeConverter(60000);
            expect(minutes).toBe(1);
            expect(seconds).toBe(0);
        });

        test("should convert 123456 ms to 02:03", () => {
            const [minutes, seconds] = timer.timeConverter(123456);
            expect(minutes).toBe(2);
            expect(seconds).toBe(3);
        });
    });

    describe("startTimer", () => {
        test("should start timer correctly", () => {
            jest.useFakeTimers();
            timer.startTimer();

            expect(timer.isRunning).toBe(true);
            expect(timer.startTime).not.toBe(0);
            expect(timer.elapsedTime).toBe(0);
            expect(timer.timerId).not.toBeNull();
        });
    });

    describe("stopTimer", () => {
        test("should stop timer correctly", async () => {
            jest.useFakeTimers();

            // Запускаем таймер
            timer.startTimer();

            // Продвигаем время на 1 секунду
            jest.advanceTimersByTime(1000);

            // Останавливаем таймер
            timer.stopTimer();

            expect(timer.isRunning).toBe(false);
            expect(timer.timerId).toBeNull();

            // Проверяем, что значение сохранено правильно
            expect(localStorageMock.setItem).toHaveBeenCalledWith(
                "timer",
                timer.elapsedTime.toString()
            );
        }, 10000);
    });

    describe("reset", () => {
        test("should reset timer correctly", () => {
            jest.useFakeTimers();
            timer.startTimer();
            jest.advanceTimersByTime(60000);
            timer.reset();

            expect(timer.elapsedTime).toBe(0);
            expect(timer.isRunning).toBe(false);
        });
    });

    describe("globalReset", () => {
        test("should perform global reset", () => {
            Timer.globalReset();
            const timerElement = document.querySelector(".timer-watch");
            expect(timerElement.textContent).toBe("00:00");
        });
    });
});
