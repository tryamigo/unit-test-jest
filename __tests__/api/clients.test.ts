import { NextRequest, NextResponse } from 'next/server';
import * as helper from '@/components/helper';
import { GET, POST, PUT, DELETE } from '@/app/api/clients/route';

jest.mock('@/components/helper');
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => ({ json: () => body, status: init?.status })),
  },
}));

describe('Clients API', () => {
  const mockHandleRequest = helper.handleRequest as jest.MockedFunction<typeof helper.handleRequest>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockRequest = (url: string, method: string = 'GET', body?: any) => {
    return {
      url,
      method,
      json: jest.fn().mockResolvedValue(body),
    } as unknown as NextRequest;
  };

  it('GET should call handleRequest with correct parameters', async () => {
    const req = createMockRequest('http://localhost:3000/api/clients?param1=value1');
    await GET(req);
    expect(mockHandleRequest).toHaveBeenCalledWith(req, 'GET', '/clients', undefined, { param1: 'value1' });
  });

  it('POST should call handleRequest with correct parameters', async () => {
    const body = { name: 'Test Client' };
    const req = createMockRequest('http://localhost:3000/api/clients?param1=value1', 'POST', body);
    await POST(req);
    expect(mockHandleRequest).toHaveBeenCalledWith(req, 'POST', '/clients', body, { param1: 'value1' });
  });

  it('PUT should call handleRequest with correct parameters when ID is provided', async () => {
    const body = { name: 'Updated Client' };
    const req = createMockRequest('http://localhost:3000/api/clients?id=123', 'PUT', body);
    await PUT(req);
    expect(mockHandleRequest).toHaveBeenCalledWith(req, 'PUT', '/clients/123', body);
  });

  it('PUT should return 400 error when ID is missing', async () => {
    const req = createMockRequest('http://localhost:3000/api/clients', 'PUT');
    const response = await PUT(req);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Missing client ID' });
  });

  it('DELETE should call handleRequest with correct parameters when ID is provided', async () => {
    const req = createMockRequest('http://localhost:3000/api/clients?id=123', 'DELETE');
    await DELETE(req);
    expect(mockHandleRequest).toHaveBeenCalledWith(req, 'DELETE', '/clients/123');
  });

  it('DELETE should return 400 error when ID is missing', async () => {
    const req = createMockRequest('http://localhost:3000/api/clients', 'DELETE');
    const response = await DELETE(req);
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: 'Missing client ID' });
  });
});