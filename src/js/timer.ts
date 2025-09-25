// Инициализируем глобальную переменную
declare global {
    interface Window {
        application: {
            timer: number | null;
        };
    }
}

if (!window.application) {
    window.application = {
        timer: null,
    };
}

export class Timer {
    private isRunning: boolean = false;
    private startTime: number = 0;
    private elapsedTime: number = 0;
    private timeResult: number | null;
    private timerId: NodeJS.Timeout | null = null;

    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerId = null;
    }

    startTimer() {
        if (this.isRunning) {
            console.warn("Таймер уже запущен");
            return;
        }
        this.isRunning = true;
        this.startTime = Date.now();
        this.timerId = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }

    stopTimer() {
        window.application.timer = Number(this.elapsedTime);
        clearInterval(this.timerId);
        this.timerId = null;
        this.isRunning = false;
        this.elapsedTime = 0;
        this.startTime = 0;
    }

    updateTimer() {
        if (this.timerId && this.isRunning === true) {
            this.elapsedTime = Date.now() - this.startTime;
            const { minutes, seconds } = Timer.acquisitionTime(
                this.elapsedTime
            );
            const timerElement = document.querySelector(".timer-watch");
            if (timerElement) {
                timerElement.textContent = `${minutes}:${seconds}`;
            }
        } else {
            return;
        }
    }

    static acquisitionTime(elapsedTime: number): {
        minutes: string;
        seconds: string;
    } {
        const seconds = Math.floor(elapsedTime / 1000);
        const minutes = Math.floor(seconds / 60);

        // Форматируем минуты и секунды с ведущими нулями
        const formattedMinutes = minutes.toString().padStart(2, "0");
        const formattedSeconds = (seconds % 60).toString().padStart(2, "0");

        return {
            minutes: formattedMinutes,
            seconds: formattedSeconds,
        };
    }

    reset() {
        this.stopTimer();
        this.elapsedTime = 0;
        this.startTime = 0;
        const timerElement = document.querySelector(".timer-watch");
        if (timerElement) {
            timerElement.textContent = "00:00";
        }
    }

    getElapsedTime(): number {
        return this.elapsedTime;
    }

    getFormattedTime(): string {
        const seconds = Math.floor(this.elapsedTime / 1000);
        const minutes = Math.floor(seconds / 60);
        return `${minutes.toString().padStart(2, "0")}:${(seconds % 60)
            .toString()
            .padStart(2, "0")}`;
    }
}

// Экспортируем статический метод отдельно
export const acquisitionTime = Timer.acquisitionTime;
