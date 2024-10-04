import { NextRequest, NextResponse } from 'next/server';
import { GET, POST, PUT, DELETE } from '@/app/api/follow-ups/route';
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

describe('Followups API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should fetch followups for a client', async () => {
      const mockResponse = { data: 'followups data' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/followups?clientId=client123', 'GET');
      const response = await GET(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'GET',
        '/followups/client/client123',
        undefined,
        { clientId: 'client123' }
      );
      expect(response).toEqual(mockResponse);
    });
  });

  describe('POST', () => {
    it('should create a new followup', async () => {
      const mockBody = { title: 'New Followup' };
      const mockResponse = { data: 'created followup' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/followups?param1=value1', 'POST', mockBody);
      const response = await POST(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'POST',
        '/followups',
        mockBody,
        { param1: 'value1' }
      );
      expect(response).toEqual(mockResponse);
    });
  });

  describe('PUT', () => {
    it('should update a followup', async () => {
      const mockBody = { title: 'Updated Followup' };
      const mockResponse = { data: 'updated followup' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/followups?id=followup123', 'PUT', mockBody);
      const response = await PUT(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'PUT',
        '/followups/followup123',
        mockBody
      );
      expect(response).toEqual(mockResponse);
    });

    it('should return 400 if followup ID is missing', async () => {
      const req = mockRequest('http://localhost:3000/api/followups', 'PUT', {});
      const response = await PUT(req);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Missing followup ID' });
    });
  });

  describe('DELETE', () => {
    it('should delete a followup', async () => {
      const mockResponse = { data: 'deleted followup' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/followups?id=followup123', 'DELETE');
      const response = await DELETE(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'DELETE',
        '/followups/followup123'
      );
      expect(response).toEqual(mockResponse);
    });

    it('should return 400 if followup ID is missing', async () => {
      const req = mockRequest('http://localhost:3000/api/followups', 'DELETE');
      const response = await DELETE(req);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Missing followup ID' });
    });
  });
});