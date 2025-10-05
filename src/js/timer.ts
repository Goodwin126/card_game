export class Timer {
    private timerId: number | null = null;
    private startTime: number = 0;
    private elapsedTime: number = 0;
    private isRunning: boolean = false;

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
        const displayElement = document.querySelector(
            ".timer-watch"
        ) as HTMLElement | null;

        if (this.isRunning && displayElement) {
            this.elapsedTime = Date.now() - this.startTime;
            this.updateDisplay(displayElement, this.elapsedTime);
        }
    }

    updateDisplay(element: HTMLElement, countTime: number) {
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

    timeConverter(timer: number): [number, number] {
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
