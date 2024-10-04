import { NextRequest, NextResponse } from 'next/server';
import { GET, POST, PUT, DELETE } from '@/app/api/activities/route';
import { handleRequest } from '@/components/helper';

// Mock the handleRequest function
jest.mock('@/components/helper', () => ({
  handleRequest: jest.fn(),
}));

// Mock NextResponse
jest.mock('next/server', () => ({
  ...jest.requireActual('next/server'),
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status || 200,
      json: async () => body,
    })),
  },
}));

describe('Activities API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/activities', () => {
    it('should call handleRequest with correct parameters', async () => {
      const mockRequest = {
        url: 'http://localhost:3000/api/activities?clientId=123&param1=value1',
      } as NextRequest;

      await GET(mockRequest);

      expect(handleRequest).toHaveBeenCalledWith(
        mockRequest,
        'GET',
        '/activities/123',
        undefined,
        { clientId: '123', param1: 'value1' }
      );
    });
  });

  describe('POST /api/activities', () => {
    it('should call handleRequest with correct parameters', async () => {
      const mockBody = { title: 'New Activity' };
      const mockRequest = {
        url: 'http://localhost:3000/api/activities?param1=value1',
        json: jest.fn().mockResolvedValue(mockBody),
      } as unknown as NextRequest;

      await POST(mockRequest);

      expect(handleRequest).toHaveBeenCalledWith(
        mockRequest,
        'POST',
        '/activities',
        mockBody,
        { param1: 'value1' }
      );
    });
  });

  describe('PUT /api/activities', () => {
    it('should call handleRequest with correct parameters when id is provided', async () => {
      const mockBody = { title: 'Updated Activity' };
      const mockRequest = {
        url: 'http://localhost:3000/api/activities?id=456',
        json: jest.fn().mockResolvedValue(mockBody),
      } as unknown as NextRequest;

      await PUT(mockRequest);

      expect(handleRequest).toHaveBeenCalledWith(
        mockRequest,
        'PUT',
        '/activities/456',
        mockBody
      );
    });

    it('should return 400 error when id is not provided', async () => {
      const mockRequest = {
        url: 'http://localhost:3000/api/activities',
        json: jest.fn().mockResolvedValue({}),
      } as unknown as NextRequest;

      const response = await PUT(mockRequest);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Missing client ID' });
    });
  });

  describe('DELETE /api/activities', () => {
    it('should call handleRequest with correct parameters when id is provided', async () => {
      const mockRequest = {
        url: 'http://localhost:3000/api/activities?id=789',
      } as NextRequest;

      await DELETE(mockRequest);

      expect(handleRequest).toHaveBeenCalledWith(
        mockRequest,
        'DELETE',
        '/activities/789'
      );
    });

    it('should return 400 error when id is not provided', async () => {
      const mockRequest = {
        url: 'http://localhost:3000/api/activities',
      } as NextRequest;

      const response = await DELETE(mockRequest);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Missing client ID' });
    });
  });
});