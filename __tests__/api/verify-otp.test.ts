import { NextRequest, NextResponse } from 'next/server';
import { POST } from '@/app/api/verify-otp/route';
import { handleRequest } from '@/components/helper';

jest.mock('@/components/helper', () => ({
  handleRequest: jest.fn(),
}));

jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => ({ json: () => body, status: init?.status })),
  },
}));

function mockRequest(url: string, method: string, body?: any): NextRequest {
  return {
    url,
    method,
    json: jest.fn().mockResolvedValue(body),
  } as unknown as NextRequest;
}

describe('OTP Verification API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('should verify OTP successfully', async () => {
      const mockBody = { otp: '123456', phoneNumber: '+1234567890' };
      const mockResponse = { success: true, message: 'OTP verified successfully' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/otp/verify?param1=value1', 'POST', mockBody);
      const response = await POST(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'POST',
        '/otp/varify',
        mockBody,
        { param1: 'value1' }
      );
      expect(response).toEqual(mockResponse);
    });

    it('should handle invalid OTP', async () => {
      const mockBody = { otp: '123456', phoneNumber: '+1234567890' };
      const mockResponse = { success: false, message: 'Invalid OTP' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/otp/verify', 'POST', mockBody);
      const response = await POST(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'POST',
        '/otp/varify',
        mockBody,
        {}
      );
      expect(response).toEqual(mockResponse);
    });

    it('should handle missing OTP in request body', async () => {
      const mockBody = { phoneNumber: '+1234567890' };
      const mockResponse = { success: false, message: 'OTP is required' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/otp/verify', 'POST', mockBody);
      const response = await POST(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'POST',
        '/otp/varify',
        mockBody,
        {}
      );
      expect(response).toEqual(mockResponse);
    });

    it('should handle missing phone number in request body', async () => {
      const mockBody = { otp: '123456' };
      const mockResponse = { success: false, message: 'Phone number is required' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/otp/verify', 'POST', mockBody);
      const response = await POST(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'POST',
        '/otp/varify',
        mockBody,
        {}
      );
      expect(response).toEqual(mockResponse);
    });

    it('should pass additional query parameters', async () => {
      const mockBody = { otp: '123456', phoneNumber: '+1234567890' };
      const mockResponse = { success: true, message: 'OTP verified successfully' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/otp/verify?param1=value1&param2=value2', 'POST', mockBody);
      const response = await POST(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'POST',
        '/otp/varify',
        mockBody,
        { param1: 'value1', param2: 'value2' }
      );
      expect(response).toEqual(mockResponse);
    });

    
  });
});