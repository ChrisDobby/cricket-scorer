module.exports = {
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testMatch: [ '**/__tests__/**/*.ts?(x)', '**/?(*.)(spec|test).ts?(x)' ],
    testPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/src/__tests__/setup.ts',
        '<rootDir>/src/__tests__/testData',
    ],
    setupFiles: [
        '<rootDir>/src/__tests__/setup.ts',
        'jest-localstorage-mock'
    ],
    collectCoverage: true,
    automock: false,
    testResultsProcessor: 'jest-junit',
};
