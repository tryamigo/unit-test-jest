import { NextRequest, NextResponse } from 'next/server';
import { GET, POST, PUT, DELETE } from '@/app/api/team/route';
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

describe('Teams API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should fetch teams for a user', async () => {
      const mockTeams = [
        { teamId: 'team1', teamName: 'Team 1', userPermissions: ['view', 'edit'] },
        { teamId: 'team2', teamName: 'Team 2', userPermissions: ['view'] },
      ];
      (query as jest.Mock).mockResolvedValue(mockTeams);

      const req = mockRequest('http://localhost:3000/api/teams?userId=user123', 'GET');
      const response = await GET(req);

      expect(query).toHaveBeenCalledWith({
        query: expect.stringContaining('MATCH (u:User {id: $userId})<-[r:HAS_MEMBER]-(t:Team)'),
        params: { userId: 'user123' },
      });
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(mockTeams);
    });

    it('should return 400 if userId is missing', async () => {
      const req = mockRequest('http://localhost:3000/api/teams', 'GET');
      const response = await GET(req);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'userId is required' });
    });

    it('should return 404 if no teams found', async () => {
      (query as jest.Mock).mockResolvedValue([]);

      const req = mockRequest('http://localhost:3000/api/teams?userId=user123', 'GET');
      const response = await GET(req);

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ message: 'No teams found for this user' });
    });
  });

  describe('POST', () => {
    it('should create a new team', async () => {
      const mockTeam = {
        id: 'team123',
        name: 'New Team',
        createdAt: '2023-05-01T12:00:00.000Z',
        members: [{
          id: 'user123',
          name: 'John Doe',
          permissions: 'viewClients,unassignedClients,addOrEditGroups,deleteClients,addEditContent,manageTeamMembers,manageIntegrations',
          status: 'active'
        }]
      };
      (query as jest.Mock).mockResolvedValue([{ t: { properties: mockTeam }, u: { properties: mockTeam.members[0] }, r: { properties: { permissions: mockTeam.members[0].permissions, status: mockTeam.members[0].status } } }]);
      (nanoid as jest.Mock).mockReturnValue('team123');

      const req = mockRequest('http://localhost:3000/api/teams', 'POST', { name: 'New Team', userId: 'user123' });
      const response = await POST(req);

      expect(query).toHaveBeenCalledWith({
        query: expect.stringContaining('CREATE (t:Team {id: $teamId, name: $name, createdAt: datetime()})'),
        params: { teamId: 'team123', name: 'New Team', userId: 'user123' },
      });
      expect(response.status).toBe(201);
      expect(await response.json()).toEqual({ message: 'Team created successfully', team: mockTeam });
    });
  });

  describe('PUT', () => {
    it('should update a team', async () => {
      const mockTeam = {
        id: 'team123',
        name: 'Updated Team',
        createdAt: '2023-05-01T12:00:00.000Z',
      };
      (query as jest.Mock).mockResolvedValue([{ t: { properties: mockTeam } }]);

      const req = mockRequest('http://localhost:3000/api/teams?teamId=team123', 'PUT', { name: 'Updated Team' });
      const response = await PUT(req);

      expect(query).toHaveBeenCalledWith({
        query: expect.stringContaining('MATCH (t:Team {id: $teamId})'),
        params: { teamId: 'team123', name: 'Updated Team' },
      });
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ message: 'Team updated successfully', team: mockTeam });
    });

    it('should return 400 if teamId is missing', async () => {
      const req = mockRequest('http://localhost:3000/api/teams', 'PUT', { name: 'Updated Team' });
      const response = await PUT(req);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Missing team ID' });
    });

    it('should return 404 if team not found', async () => {
      (query as jest.Mock).mockResolvedValue([]);

      const req = mockRequest('http://localhost:3000/api/teams?teamId=nonexistent', 'PUT', { name: 'Updated Team' });
      const response = await PUT(req);

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ error: 'Team not found' });
    });
  });

  describe('DELETE', () => {
    it('should delete a team', async () => {
      (query as jest.Mock).mockResolvedValue([]);

      const req = mockRequest('http://localhost:3000/api/teams?teamId=team123', 'DELETE');
      const response = await DELETE(req);

      expect(query).toHaveBeenCalledWith({
        query: expect.stringContaining('MATCH (t:Team {id: $teamId})'),
        params: { teamId: 'team123' },
      });
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ message: 'Team deleted successfully' });
    });

    it('should return 400 if teamId is missing', async () => {
      const req = mockRequest('http://localhost:3000/api/teams', 'DELETE');
      const response = await DELETE(req);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Missing team ID' });
    });
  });
});