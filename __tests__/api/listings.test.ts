import { NextRequest, NextResponse } from 'next/server';
import { GET, POST, PUT, DELETE } from '@/app/api/listings/route';
import query from '@/app/libs/Connectdb';

// Mock the next/server module
jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => ({ json: () => body, status: init?.status })),
  },
}));

// Mock the database query function
jest.mock('@/app/libs/Connectdb', () => ({
  __esModule: true,
  default: jest.fn(),
}));

function mockRequest(url: string, method: string, body?: any): NextRequest {
  return {
    url,
    method,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as NextRequest;
}

describe('Real Estate Listings API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn(); // Mock console.error to prevent output during tests
  });

  describe('GET', () => {
  

    it('should handle database query errors', async () => {
      const mockError = new Error('Database error');
      (query as jest.Mock).mockRejectedValue(mockError);

      const response = await GET();

      expect(console.error).toHaveBeenCalledWith('Error fetching listings:', mockError);
      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({ error: 'Error fetching listings from database' });
    });
  });

  describe('POST', () => {
    it('should create a new listing successfully', async () => {
      const mockBody = { name: 'New Listing', contact: 'New Contact', closedDeals: 0, city: 'New City' };
      const mockInsertResult = { insertId: 3 };
      (query as jest.Mock).mockResolvedValue(mockInsertResult);

      const req = mockRequest('http://localhost:3000/api/realEstateListings', 'POST', mockBody);
      const response = await POST(req);

      expect(query).toHaveBeenCalledWith({
        query: expect.stringContaining('INSERT INTO'),
        values: expect.arrayContaining([mockBody.name, mockBody.contact, mockBody.closedDeals, mockBody.city, 'active']),
      });
      expect(response.status).toBe(201);
      expect(await response.json()).toEqual({ ...mockBody, id: 3, status: 'active' });
    });

    it('should handle database insert errors', async () => {
      const mockBody = { name: 'New Listing', contact: 'New Contact', closedDeals: 0, city: 'New City' };
      const mockError = new Error('Database error');
      (query as jest.Mock).mockRejectedValue(mockError);

      const req = mockRequest('http://localhost:3000/api/realEstateListings', 'POST', mockBody);
      const response = await POST(req);

      expect(console.error).toHaveBeenCalledWith('Error adding listing:', mockError);
      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({ error: 'Error adding listing to database' });
    });
  });

  describe('PUT', () => {

    it('should return 400 if listing ID is missing', async () => {
      const mockBody = { name: 'Updated Listing' };
      const req = mockRequest('http://localhost:3000/api/realEstateListings', 'PUT', mockBody);
      const response = await PUT(req);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Missing listing ID' });
    });

    it('should return 400 if no fields to update', async () => {
      const mockBody = { id: 1 };
      const req = mockRequest('http://localhost:3000/api/realEstateListings', 'PUT', mockBody);
      const response = await PUT(req);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'No fields to update' });
    });

    it('should return 404 if listing is not found', async () => {
      const mockBody = { id: 999, name: 'Non-existent Listing' };
      (query as jest.Mock)
        .mockResolvedValueOnce(undefined) // For the UPDATE query
        .mockResolvedValueOnce([]); // For the SELECT query (empty result)

      const req = mockRequest('http://localhost:3000/api/realEstateListings', 'PUT', mockBody);
      const response = await PUT(req);

      expect(response.status).toBe(404);
      expect(await response.json()).toEqual({ error: 'Listing not found' });
    });

    it('should handle database update errors', async () => {
      const mockBody = { id: 1, name: 'Updated Listing' };
      const mockError = new Error('Database error');
      (query as jest.Mock).mockRejectedValue(mockError);

      const req = mockRequest('http://localhost:3000/api/realEstateListings', 'PUT', mockBody);
      const response = await PUT(req);

      expect(console.error).toHaveBeenCalledWith('Error updating listing:', mockError);
      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({ error: 'Error updating listing in database' });
    });
  });

  describe('DELETE', () => {
   

    it('should return 400 if listing ID is missing', async () => {
      const req = mockRequest('http://localhost:3000/api/realEstateListings', 'DELETE');
      const response = await DELETE(req);

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Missing listing ID' });
    });

    it('should handle database delete errors', async () => {
      const mockError = new Error('Database error');
      (query as jest.Mock).mockRejectedValue(mockError);

      const req = mockRequest('http://localhost:3000/api/realEstateListings?id=1', 'DELETE');
      const response = await DELETE(req);

      expect(console.error).toHaveBeenCalledWith('Error deleting listing:', mockError);
      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({ error: 'Error deleting listing from database' });
    });
  });
});