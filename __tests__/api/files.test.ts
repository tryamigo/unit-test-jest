import { NextRequest, NextResponse } from 'next/server';
import query from '@/app/libs/Connectdb3';
import fs from 'fs/promises';
import { DELETE, GET, POST } from '@/app/api/files/route';
import { nanoid } from 'nanoid';

jest.mock('@/app/libs/Connectdb3');
jest.mock('fs/promises');
jest.mock('nanoid', () => ({ nanoid: jest.fn() }));
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => ({
      status: init?.status || 200,
      json: async () => body,
    })),
  },
}));

function mockRequest(url: string, method: string, body?: any): NextRequest {
  const request = {
    url,
    method,
    formData: jest.fn().mockResolvedValue(body),
  } as unknown as NextRequest;
  return request;
}

async function parseResponse(response: any) {
  return await response.json();
}

describe('File API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should fetch a file by id', async () => {
      (query as jest.Mock).mockResolvedValueOnce([{ f: { properties: { id: '123', title: 'test.txt' } } }]);
      const req = mockRequest('http://localhost:3000/api/files?id=123', 'GET');
      const response = await GET(req);
      expect(response.status).toBe(200);
      console.log('Response:', response);
      const data = await parseResponse(response);
      expect(data).toEqual({ id: '123', title: 'test.txt' });
    });


    it('should return 400 if no id or userId is provided', async () => {
      const req = mockRequest('http://localhost:3000/api/files', 'GET');
      const response = await GET(req);
      expect(response.status).toBe(400);
    });

    it('should return 404 if no files are found', async () => {
      (query as jest.Mock).mockResolvedValueOnce([]);
      const req = mockRequest('http://localhost:3000/api/files?id=nonexistent', 'GET');
      const response = await GET(req);
      expect(response.status).toBe(404);
    });
  });

  describe('POST', () => {
 

    it('should return 400 if required fields are missing', async () => {
      const formData = new FormData();
      const req = mockRequest('http://localhost:3000/api/files', 'POST', formData);
      const response = await POST(req);
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE', () => {
 

    it('should return 400 if file ID is missing', async () => {
      const req = mockRequest('http://localhost:3000/api/files', 'DELETE');
      const response = await DELETE(req);
      expect(response.status).toBe(400);
    });

    it('should return 404 if file is not found', async () => {
      (query as jest.Mock).mockResolvedValueOnce([]);
      const req = mockRequest('http://localhost:3000/api/files?id=nonexistent', 'DELETE');
      const response = await DELETE(req);
      expect(response.status).toBe(404);
    });
  });
});