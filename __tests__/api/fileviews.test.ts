import { NextRequest, NextResponse } from 'next/server';
import query from '@/app/libs/Connectdb3';
import { GET } from '@/app/api/files/send_files/route';

jest.mock('@/app/libs/Connectdb3');
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => ({ json: () => body, status: init?.status })),
  },
}));

jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'mocked-nanoid')
}));

function mockRequest(url: string): NextRequest {
  return {
    url,
  } as unknown as NextRequest;
}

describe('Shared Files API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
  

    it('should return 400 if required parameters are missing', async () => {
      const req = mockRequest('http://localhost:3000/api/sharedFiles');
      const response = await GET(req);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toEqual({ error: 'Missing id, userId, fileId, or clientId parameter' });
    });

    it('should return 404 if no shared file is found', async () => {
      (query as jest.Mock).mockResolvedValueOnce([]);
      
      const req = mockRequest('http://localhost:3000/api/sharedFiles?fileId=nonexistent');
      const response = await GET(req);
      
      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data).toEqual({ error: 'No shared files found' });
    });

    it('should handle database errors', async () => {
      (query as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
      
      const req = mockRequest('http://localhost:3000/api/sharedFiles?fileId=file123');
      const response = await GET(req);
      
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data).toEqual({ error: 'Error fetching shared file(s) from database' });
    });
  });
});