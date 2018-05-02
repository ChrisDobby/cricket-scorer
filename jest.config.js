module.exports = {
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testMatch: ['**/__tests__/**/*.tests.+(ts|tsx|js)'],
    testPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/src/__tests__/setup.ts',
        '<rootDir>/src/__tests__/fileTransformer.js',
    ],
    setupFiles: [
        '<rootDir>/src/__tests__/setup.ts',
    ],
    collectCoverage: true,
    automock: false,
    testResultsProcessor: 'jest-junit',
};
