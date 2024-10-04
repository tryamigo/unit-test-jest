const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/.next/', 
     '/node_modules/(?!nanoid)/',
    '<rootDir>/node_modules/', 
    '<rootDir>/cases/',
  ],
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
}

module.exports = createJestConfig(customJestConfig)
