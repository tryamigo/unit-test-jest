import { NextRequest, NextResponse } from 'next/server';
import query from '@/app/libs/Connectdb3';
import { nanoid } from 'nanoid';
import { GET, POST, PUT, DELETE } from '@/app/api/files/send_files/route';

jest.mock('@/app/libs/Connectdb3');
jest.mock('nanoid', () => ({ nanoid: jest.fn() }));

function mockRequest(url: string, method: string, body?: any): NextRequest {
  const request = {
    url,
    method,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as NextRequest;
  return request;
}
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => ({ 
      json: () => body, 
      status: init?.status,
      // Add this line to ensure status is always set
      headers: new Map()
    })),
  },
}));
describe('Shared Files API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
   

    it('should return 400 if no parameters are provided', async () => {
      const req = mockRequest('http://localhost:3000/api/sharedFiles', 'GET');
      const response = await GET(req);
      
      expect(response.status).toBe(400);
    });

    it('should return 404 if no shared files are found', async () => {
      (query as jest.Mock).mockResolvedValueOnce([]);
      
      const req = mockRequest('http://localhost:3000/api/sharedFiles?userId=nonexistent', 'GET');
      const response = await GET(req);
      
      expect(response.status).toBe(404);
    });
  });

  describe('POST', () => {
    it('should create a new shared file', async () => {
      const mockBody = { file_id: 'f123', user_id: 'u123', client_id: 'c123' };
      const mockSharedFile = {
        id: 'sf123',
        shared_time: '2023-04-01T00:00:00.000Z',
        status: 'shared'
      };
      const mockFile = { id: 'f123', name: 'test.txt', time: '2023-03-31T00:00:00.000Z' };
      
      (nanoid as jest.Mock).mockReturnValue('sf123');
      (query as jest.Mock).mockResolvedValueOnce([{ sf: { properties: mockSharedFile }, f: { properties: mockFile } }]);
      
      const req = mockRequest('http://localhost:3000/api/sharedFiles', 'POST', mockBody);
      const response = await POST(req);
      
      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data).toEqual({ sharedFile: mockSharedFile, file: mockFile });
    });

    it('should return 400 if required fields are missing', async () => {
      const mockBody = { file_id: 'f123', user_id: 'u123' }; // missing client_id
      
      const req = mockRequest('http://localhost:3000/api/sharedFiles', 'POST', mockBody);
      const response = await POST(req);
      
      expect(response.status).toBe(400);
    });
  });

  describe('PUT', () => {
  

    it('should return 400 if id is missing', async () => {
      const mockBody = { status: 'viewed' }; // missing id
      
      const req = mockRequest('http://localhost:3000/api/sharedFiles', 'PUT', mockBody);
      const response = await PUT(req);
      
      expect(response.status).toBe(400);
    });

    it('should return 404 if shared file is not found', async () => {
      const mockBody = { id: 'nonexistent', status: 'viewed' };
      
      (query as jest.Mock).mockResolvedValueOnce([]);
      
      const req = mockRequest('http://localhost:3000/api/sharedFiles', 'PUT', mockBody);
      const response = await PUT(req);
      
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE', () => {
  

    it('should return 400 if id is missing', async () => {
      const req = mockRequest('http://localhost:3000/api/sharedFiles', 'DELETE');
      const response = await DELETE(req);
      
      expect(response.status).toBe(400);
    });

    it('should return 404 if shared file is not found', async () => {
      (query as jest.Mock).mockResolvedValueOnce([{ deletedCount: 0 }]);
      
      const req = mockRequest('http://localhost:3000/api/sharedFiles?id=nonexistent', 'DELETE');
      const response = await DELETE(req);
      
      expect(response.status).toBe(404);
    });
  });
});