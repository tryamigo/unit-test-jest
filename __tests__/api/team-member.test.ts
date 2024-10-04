import { NextRequest, NextResponse } from 'next/server';
import { GET, POST, PUT } from '@/app/api/team-member/route';
import query from '@/app/libs/Connectdb3';
import { nanoid } from 'nanoid';

jest.mock('@/app/libs/Connectdb3', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('nanoid', () => ({
  nanoid: jest.fn(),
}));

jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => ({ 
      json: () => body, 
      status: init?.status || 200  // Add a default status of 200
    })),
  },
}));

function mockRequest(url: string, method: string, body?: any): NextRequest {
  return {
    url,
    method,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as NextRequest;
}

describe('Team Members API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe('GET', () => {
    it('should fetch team members for a given team', async () => {
      const mockMembers = [
        { userId: 'user1', email: 'user1@example.com', status: 'active', permissions: ['view', 'edit'] },
        { userId: 'user2', email: 'user2@example.com', status: 'inactive', permissions: ['view'] },
      ];
      (query as jest.Mock).mockResolvedValue(mockMembers);

      const req = mockRequest('http://localhost:3000/api/team-members?teamId=team123', 'GET');
      const response = await GET(req);

      expect(query).toHaveBeenCalledWith({
        query: expect.stringContaining('MATCH (t:Team {id: $teamId})-[r:HAS_MEMBER]->(u:User)'),
        params: { teamId: 'team123' },
      });
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(mockMembers);
    });

    it('should return 400 if teamId is missing', async () => {
      const req = mockRequest('http://localhost:3000/api/team-members', 'GET');
      const response = await GET(req);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'teamId must be provided' });
    });

    it('should return empty array if no team members found', async () => {
      (query as jest.Mock).mockResolvedValue([]);

      const req = mockRequest('http://localhost:3000/api/team-members?teamId=team123', 'GET');
      const response = await GET(req);

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual([]);
    });
  });

  describe('POST', () => {
  

    it('should return 400 if required fields are missing', async () => {
      const req = mockRequest('http://localhost:3000/api/team-members', 'POST', {
        email: 'newuser@example.com',
        teamId: 'team123',
      });
      const response = await POST(req);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'email, teamId, and permissions are required' });
    });

    it('should return 200 if invitation already exists', async () => {
      (query as jest.Mock).mockResolvedValueOnce([{ i: {} }]);

      const req = mockRequest('http://localhost:3000/api/team-members', 'POST', {
        email: 'existinguser@example.com',
        teamId: 'team123',
        permissions: ['view'],
      });
      const response = await POST(req);

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ message: 'An invitation has already been sent to this email for this team' });
    });
  });

  describe('PUT', () => {
    it('should update a team member\'s permissions and status', async () => {
      const mockUpdatedMember = {
        id: 'user123',
        email: 'user@example.com',
        permissions: ['view', 'edit'],
        status: 'active',
        teamId: 'team123',
      };
      (query as jest.Mock).mockResolvedValue([{
        u: { properties: { id: 'user123', email: 'user@example.com' } },
        r: { properties: { permissions: ['view', 'edit'], status: 'active' } },
        t: { properties: { id: 'team123' } },
      }]);

      const req = mockRequest('http://localhost:3000/api/team-members?userId=user123&teamId=team123', 'PUT', {
        permissions: ['view', 'edit'],
        status: 'active',
      });
      const response = await PUT(req);

      expect(query).toHaveBeenCalledWith({
        query: expect.stringContaining('MATCH (u:User {id: $userId})<-[r:HAS_MEMBER]-(t:Team {id: $teamId})'),
        params: expect.objectContaining({
          userId: 'user123',
          teamId: 'team123',
          permissions: ['view', 'edit'],
          status: 'active',
        }),
      });
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({
        message: 'User updated successfully in the team',
        member: mockUpdatedMember,
      });
    });

    it('should return 400 if userId or teamId is missing', async () => {
      const req = mockRequest('http://localhost:3000/api/team-members?userId=user123', 'PUT', {
        permissions: ['view'],
      });
      const response = await PUT(req);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Missing userId or teamId' });
    });

    it('should return 400 if no fields provided for update', async () => {
      const req = mockRequest('http://localhost:3000/api/team-members?userId=user123&teamId=team123', 'PUT', {});
      const response = await PUT(req);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'No fields provided for update' });
    });

    it('should return 404 if user not found in the specified team', async () => {
      (query as jest.Mock).mockResolvedValue([]);

      const req = mockRequest('http://localhost:3000/api/team-members?userId=user123&teamId=team123', 'PUT', {
        permissions: ['view'],
      });
      const response = await PUT(req);

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ error: 'User not found in the specified team' });
    });
  });
});