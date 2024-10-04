import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { POST } from '@/app/api/accept-invitation/route';
import query from '@/app/libs/Connectdb3';

// Mock query and nanoid function
jest.mock('@/app/libs/Connectdb3', () => jest.fn());
jest.mock('nanoid', () => ({ nanoid: jest.fn() }));

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

describe('POST /api/invite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 when userId is not provided', async () => {
    const request = {
      json: async () => ({ token: 'some-token' }),
    } as NextRequest;

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'userId is required' });
  });

  it('should return 404 when user is not found', async () => {
    (query as jest.Mock).mockResolvedValueOnce([]);

    const request = {
      json: async () => ({ userId: 'nonexistent-user' }),
    } as NextRequest;

    const response = await POST(request);

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: 'User not found' });
  });

  it('should accept the invitation successfully', async () => {
    const mockUser = { email: 'user@example.com' };
    const mockInvitation = {
      status: 'pending',
      expiresAt: new Date(Date.now() + 10000).toISOString(),
      email: 'user@example.com',
      id: 'invitation-id',
      permissions: 'some-permissions',
    };
    const mockTeam = { id: 'team-id', name: 'Team A' };

    (query as jest.Mock)
      .mockResolvedValueOnce([{ u: { properties: mockUser } }]) // Get user
      .mockResolvedValueOnce([{ i: { properties: mockInvitation }, t: { properties: mockTeam } }]) // Find invitation
      .mockResolvedValueOnce([]) // Check membership
      .mockResolvedValueOnce({}); // Accept invitation

    const request = {
      json: async () => ({ token: 'valid-token', userId: 'valid-user' }),
    } as NextRequest;

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: 200,
      message: 'Invitation accepted successfully',
      team: mockTeam,
      user: mockUser,
    });
  });

  it('should return 400 for invalid invitation token', async () => {
    const mockUser = { email: 'user@example.com' };

    (query as jest.Mock)
      .mockResolvedValueOnce([{ u: { properties: mockUser } }]) // Get user
      .mockResolvedValueOnce([]); // Find invitation (not found)

    const request = {
      json: async () => ({ token: 'invalid-token', userId: 'valid-user' }),
    } as NextRequest;

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Invalid invitation token' });
  });

  it('should return 400 for expired invitation', async () => {
    const mockUser = { email: 'user@example.com' };
    const mockInvitation = {
      status: 'pending',
      expiresAt: new Date(Date.now() - 10000).toISOString(),
      email: 'user@example.com',
    };
    const mockTeam = { id: 'team-id', name: 'Team A' };

    (query as jest.Mock)
      .mockResolvedValueOnce([{ u: { properties: mockUser } }]) // Get user
      .mockResolvedValueOnce([{ i: { properties: mockInvitation }, t: { properties: mockTeam } }]); // Find invitation

    const request = {
      json: async () => ({ token: 'expired-token', userId: 'valid-user' }),
    } as NextRequest;

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Invitation has expired' });
  });

  it('should create demo team successfully', async () => {
    const mockUser = { email: 'user@example.com' };
    const mockTeam = { id: 'demo-team-id', name: 'Demo Team' };

    (query as jest.Mock)
      .mockResolvedValueOnce([{ u: { properties: mockUser } }]) // Get user
      .mockResolvedValueOnce([]) // Check existing team (none found)
      .mockResolvedValueOnce([{ t: { properties: mockTeam } }]); // Create demo team

    (nanoid as jest.Mock).mockReturnValue('demo-team-id');

    const request = {
      json: async () => ({ userId: 'valid-user' }),
    } as NextRequest;

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: 200,
      message: 'Demo team created successfully',
      team: mockTeam,
      user: mockUser,
    });
  });

  it('should return existing team if user already has one', async () => {
    const mockUser = { email: 'user@example.com' };
    const mockTeam = { id: 'existing-team-id', name: 'Existing Team' };

    (query as jest.Mock)
      .mockResolvedValueOnce([{ u: { properties: mockUser } }]) // Get user
      .mockResolvedValueOnce([{ t: { properties: mockTeam } }]); // Check existing team (found)

    const request = {
      json: async () => ({ userId: 'valid-user' }),
    } as NextRequest;

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      status: 200,
      message: 'User already has a team',
      team: mockTeam,
      user: mockUser,
    });
  });
});
