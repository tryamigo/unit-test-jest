import { NextRequest, NextResponse } from 'next/server';
import { GET, POST, PUT, DELETE, PATCH } from '@/app/api/groups/route';
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

describe('Groups API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn(); // Mock console.log to prevent output during tests
  });

  describe('GET', () => {
    it('should fetch groups for a team', async () => {
      const mockResponse = { data: 'groups data' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/groups?teamId=team123&param1=value1', 'GET');
      const response = await GET(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'GET',
        '/groups/team123',
        undefined,
        { teamId: 'team123', param1: 'value1' }
      );
      expect(response).toEqual(mockResponse);
      expect(console.log).toHaveBeenCalledWith({ teamId: 'team123', param1: 'value1' }, 'params');
    });
  });

  describe('POST', () => {
    it('should create a new group', async () => {
      const mockBody = { name: 'New Group' };
      const mockResponse = { data: 'created group' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/groups?param1=value1', 'POST', mockBody);
      const response = await POST(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'POST',
        '/groups',
        mockBody,
        { param1: 'value1' }
      );
      expect(response).toEqual(mockResponse);
    });
  });

  describe('PUT', () => {
    it('should update a group', async () => {
      const mockBody = { name: 'Updated Group' };
      const mockResponse = { data: 'updated group' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/groups?id=group123', 'PUT', mockBody);
      const response = await PUT(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'PUT',
        '/groups/group123',
        mockBody
      );
      expect(response).toEqual(mockResponse);
    });

    it('should return 400 if group ID is missing', async () => {
      const req = mockRequest('http://localhost:3000/api/groups', 'PUT', {});
      const response = await PUT(req);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Missing client ID' });
    });
  });

  describe('DELETE', () => {
    it('should delete a group', async () => {
      const mockResponse = { data: 'deleted group' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/groups?id=group123', 'DELETE');
      const response = await DELETE(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'DELETE',
        '/groups/group123'
      );
      expect(response).toEqual(mockResponse);
    });

    it('should return 400 if group ID is missing', async () => {
      const req = mockRequest('http://localhost:3000/api/groups', 'DELETE');
      const response = await DELETE(req);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Missing client ID' });
    });
  });

  describe('PATCH', () => {
    it('should modify a client in a group', async () => {
      const mockBody = { groupId: 'group123', clientId: 'client123', action: 'add' };
      const mockResponse = { data: 'client modified in group' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/groups?param1=value1', 'PATCH', mockBody);
      const response = await PATCH(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'PATCH',
        '/groups/modify-client',
        mockBody,
        { param1: 'value1' }
      );
      expect(response).toEqual(mockResponse);
    });
  });
});