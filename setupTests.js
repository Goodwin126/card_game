const createMockStorage = () => {
    return {
        setItem: jest.fn(),
        getItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
    };
};

Object.assign(global, {
    localStorage: createMockStorage(),
    sessionStorage: createMockStorage(),
});

jest.useFakeTimers();
