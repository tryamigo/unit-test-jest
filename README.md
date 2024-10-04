# Jest Testing Configuration

This repository uses Jest for testing. Follow these steps to set up and run tests.

## Setup

1. Install dependencies:
   ```
   npm install --save-dev jest @types/jest ts-jest
   ```

2. Create a `jest.config.js` file in the root of your project:
   ```javascript
   module.exports = {
     preset: 'ts-jest',
     testEnvironment: 'node',
     moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
     testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
     transform: {
       '^.+\\.(ts|tsx)$': 'ts-jest',
     },
   };
   ```

3. Update your `package.json` to include Jest scripts:
   ```json
   {
     "scripts": {
       "test": "jest",
       "test:watch": "jest --watch",
       "test:coverage": "jest --coverage"
     }
   }
   ```

## Running Tests

### Run All Tests

To run all tests:
