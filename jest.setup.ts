import '@testing-library/jest-dom'
import 'whatwg-fetch';
global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
      headers: {
        get: jest.fn(),
        has: jest.fn(),
        keys: jest.fn(),
      },
      redirected: false,
      type: 'basic',
      url: 'http://localhost',
      clone: jest.fn(),
      body: null,
      bodyUsed: false,
    } as unknown as Response)
  );
  
  global.Request = jest.fn();  