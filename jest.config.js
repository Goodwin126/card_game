module.exports = {
    preset: "ts-jest",
    testEnvironment: "jest-environment-jsdom", // указываем полное название
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testTimeout: 10000, // Увеличиваем таймаут для всех тестов
    setupFiles: ["<rootDir>/setupTests.js"],
};
