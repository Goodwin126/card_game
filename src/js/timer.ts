export class Timer {
    private timerId: NodeJS.Timeout | null = null;
    private startTime: number = 0;
    private elapsedTime: number = 0;
    private isRunning: boolean = false;

    startTimer() {
        if (!this.isRunning) {
            this.startTime = Date.now();
            this.elapsedTime = 0;
            this.timerId = setInterval(() => this.updateTimer(), 1000);
            this.isRunning = true;
        }
    }

    updateTimer() {
        const displayElement = document.querySelector(
            ".timer-watch"
        ) as HTMLElement | null;

        if (this.isRunning && displayElement) {
            try {
                this.elapsedTime = Date.now() - this.startTime;
                this.updateDisplay(displayElement, this.elapsedTime);
            } catch (error) {
                console.error("Ошибка обновления таймера:", error);
            }
        }
    }

    updateDisplay(element: HTMLElement, countTime: number) {
        if (!element) {
            console.error("Элемент для отображения таймера не найден");
            return;
        }
        const [minutes, seconds] = this.timeConverter(countTime);
        element.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;
    }

    timeConverter(timer: number): [number, number] {
        const minutes = Math.floor(timer / 60000);
        const seconds = Math.floor((timer % 60000) / 1000);
        return [minutes, seconds];
    }

    stopTimer() {
        const savedValue = this.elapsedTime.toString();
        localStorage.setItem("timer", savedValue);

        if (this.timerId !== null) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
        this.isRunning = false;
    }

    reset() {
        this.stopTimer();
        this.elapsedTime = 0;
    }

    static globalReset() {
        const timerElement = document.querySelector(".timer-watch");
        if (timerElement) {
            timerElement.textContent = "00:00";
        }
    }
}
