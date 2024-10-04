import { NextRequest, NextResponse } from 'next/server';
import { GET } from '@/app/api/follow-ups/[teamId]/route';
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

function mockRequest(url: string): NextRequest {
  return {
    url,
  } as unknown as NextRequest;
}

describe('Team Followups API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn(); // Mock console.log to prevent output during tests
  });

  describe('GET', () => {
    it('should fetch followups for a team', async () => {
      const mockResponse = { data: 'team followups data' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/followups/team123');
      const response = await GET(req, { params: { teamId: 'team123' } });

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'GET',
        '/followups/team/team123'
      );
      expect(response).toEqual(mockResponse);
      expect(console.log).toHaveBeenCalledWith('team123', 'teamId');
    });

    it('should return 400 if teamId is missing', async () => {
      const req = mockRequest('http://localhost:3000/api/followups');
      const response = await GET(req, { params: { teamId: '' } });

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Missing teamId parameter' });
    });
  });
});