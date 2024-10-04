import { NextRequest, NextResponse } from 'next/server';
import { GET, POST, PUT, DELETE } from '@/app/api/messages/route';
import { handleRequest } from '@/components/helper';

// Mock the next/server module
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => ({ json: () => body, status: init?.status })),
  },
}));

// Mock the helper function
jest.mock('@/components/helper', () => ({
  handleRequest: jest.fn(),
}));

function mockRequest(url: string, method: string, body?: any): NextRequest {
  return {
    url,
    method,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as NextRequest;
}

describe('Messages API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn(); // Mock console.log to prevent output during tests
  });

  describe('GET', () => {
    it('should fetch messages for a team', async () => {
      const mockResponse = { data: 'messages data' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/messages?teamId=team123&param1=value1', 'GET');
      const response = await GET(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'GET',
        '/messages/team123',
        undefined,
        { teamId: 'team123', param1: 'value1' }
      );
      expect(response).toEqual(mockResponse);
      expect(console.log).toHaveBeenCalledWith({ teamId: 'team123', param1: 'value1' }, 'params');
    });

    it('should fetch a specific message for a team', async () => {
      const mockResponse = { data: 'specific message data' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/messages?teamId=team123&id=msg456&param1=value1', 'GET');
      const response = await GET(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'GET',
        '/messages/team123/msg456',
        undefined,
        { teamId: 'team123', id: 'msg456', param1: 'value1' }
      );
      expect(response).toEqual(mockResponse);
    });
  });

  describe('POST', () => {
    it('should create a new message', async () => {
      const mockBody = { content: 'New message' };
      const mockResponse = { data: 'created message' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/messages?teamId=team123&createdBy=user789&param1=value1', 'POST', mockBody);
      const response = await POST(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'POST',
        '/messages/team123/user789',
        mockBody,
        { teamId: 'team123', createdBy: 'user789', param1: 'value1' }
      );
      expect(response).toEqual(mockResponse);
    });
  });

  describe('PUT', () => {
    it('should update a message', async () => {
      const mockBody = { content: 'Updated message' };
      const mockResponse = { data: 'updated message' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/messages?teamId=team123&id=msg456', 'PUT', mockBody);
      const response = await PUT(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'PUT',
        '/messages/team123/msg456',
        mockBody
      );
      expect(response).toEqual(mockResponse);
    });

    it('should return 400 if message ID is missing', async () => {
      const req = mockRequest('http://localhost:3000/api/messages?teamId=team123', 'PUT', {});
      const response = await PUT(req);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Missing client ID' });
    });
  });

  describe('DELETE', () => {
    it('should delete a message', async () => {
      const mockResponse = { data: 'deleted message' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/messages?teamId=team123&id=msg456', 'DELETE');
      const response = await DELETE(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'DELETE',
        '/messages/team123/msg456'
      );
      expect(response).toEqual(mockResponse);
    });

    it('should return 400 if message ID is missing', async () => {
      const req = mockRequest('http://localhost:3000/api/messages?teamId=team123', 'DELETE');
      const response = await DELETE(req);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Missing client ID' });
    });
  });
});