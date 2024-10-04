import { NextResponse } from 'next/server';
import { GET } from '@/app/api/get-csv-data/route';
import query from '@/app/libs/Connectdb';

// Mock the next/server module
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => ({ 
      json: () => body, 
      status: init?.status || 200 // Set a default status of 200 if not provided
    })),
  },
}));

// Mock the database query function
jest.mock('@/app/libs/Connectdb', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('CSV Data API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should fetch CSV data successfully', async () => {
      const mockData = [
        { user_id: '1', csv_data: 'data1' },
        { user_id: '2', csv_data: 'data2' },
      ];
      (query as jest.Mock).mockResolvedValue(mockData);

      const response = await GET();

      expect(query).toHaveBeenCalledWith({
        query: 'SELECT user_id, csv_data FROM csv_data',
        values: [],
      });
      expect(response.status).toBe(200);
      expect(await response.json()).toEqual(mockData);
    });

    it('should handle database query errors', async () => {
      const mockError = new Error('Database error');
      (query as jest.Mock).mockRejectedValue(mockError);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const response = await GET();

      expect(query).toHaveBeenCalledWith({
        query: 'SELECT user_id, csv_data FROM csv_data',
        values: [],
      });
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching data:', mockError);
      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({ error: 'Error fetching data' });

      consoleSpy.mockRestore();
    });
  });
});