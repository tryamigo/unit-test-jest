import { NextRequest, NextResponse } from 'next/server';
import { GET, PUT } from '@/app/api/users/route';
import { handleRequest } from '@/components/helper';

jest.mock('@/components/helper', () => ({
  handleRequest: jest.fn(),
}));

jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => ({ json: () => body, status: init?.status })),
  },
}));

function mockRequest(url: string, method: string, body?: any): NextRequest {
  return {
    url,
    method,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as NextRequest;
}

describe('User API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should fetch user data successfully', async () => {
      const mockResponse = { id: 'user123', name: 'John Doe' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/user?id=user123&param1=value1', 'GET');
      const response = await GET(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'GET',
        '/user/user123',
        undefined,
        { id: 'user123', param1: 'value1' }
      );
      expect(response).toEqual(mockResponse);
    });

    it('should handle missing id parameter', async () => {
      const mockResponse = { error: 'Missing user ID' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/user', 'GET');
      const response = await GET(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'GET',
        '/user/null',
        undefined,
        {}
      );
      expect(response).toEqual(mockResponse);
    });

    it('should pass additional query parameters', async () => {
      const mockResponse = { id: 'user123', name: 'John Doe' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/user?id=user123&param1=value1&param2=value2', 'GET');
      const response = await GET(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'GET',
        '/user/user123',
        undefined,
        { id: 'user123', param1: 'value1', param2: 'value2' }
      );
      expect(response).toEqual(mockResponse);
    });
  });

  describe('PUT', () => {
    it('should update user data successfully', async () => {
      const mockBody = { name: 'John Updated' };
      const mockResponse = { id: 'user123', name: 'John Updated' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/user?id=user123', 'PUT', mockBody);
      const response = await PUT(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'PUT',
        '/user/user123',
        mockBody
      );
      expect(response).toEqual(mockResponse);
    });

    it('should return 400 if user ID is missing', async () => {
      const mockBody = { name: 'John Updated' };

      const req = mockRequest('http://localhost:3000/api/user', 'PUT', mockBody);
      const response = await PUT(req);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Missing client ID' });
    });

    it('should handle empty request body', async () => {
      const mockResponse = { id: 'user123', message: 'No changes applied' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/user?id=user123', 'PUT', {});
      const response = await PUT(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'PUT',
        '/user/user123',
        {}
      );
      expect(response).toEqual(mockResponse);
    });
  });
});