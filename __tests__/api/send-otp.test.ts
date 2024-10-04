import { NextRequest, NextResponse } from 'next/server';
import { POST } from '@/app/api/send-otp/route';
import { handleRequest } from '@/components/helper';

jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => ({ json: () => body, status: init?.status })),
  },
}));

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

describe('OTP API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST', () => {
    it('should send an OTP', async () => {
      const mockBody = { phoneNumber: '+1234567890' };
      const mockResponse = { success: true, message: 'OTP sent successfully' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/otp?param1=value1', 'POST', mockBody);
      const response = await POST(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'POST',
        '/otp/send',
        mockBody,
        { param1: 'value1' }
      );
      expect(response).toEqual(mockResponse);
    });

    it('should handle OTP sending with additional parameters', async () => {
      const mockBody = { phoneNumber: '+1234567890', channel: 'sms' };
      const mockResponse = { success: true, message: 'OTP sent successfully' };
      (handleRequest as jest.Mock).mockResolvedValue(mockResponse);

      const req = mockRequest('http://localhost:3000/api/otp?param1=value1&param2=value2', 'POST', mockBody);
      const response = await POST(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'POST',
        '/otp/send',
        mockBody,
        { param1: 'value1', param2: 'value2' }
      );
      expect(response).toEqual(mockResponse);
    });

    it('should handle errors from handleRequest', async () => {
      const mockBody = { phoneNumber: '+1234567890' };
      const mockError = { success: false, message: 'Failed to send OTP' };
      (handleRequest as jest.Mock).mockResolvedValue(mockError);

      const req = mockRequest('http://localhost:3000/api/otp', 'POST', mockBody);
      const response = await POST(req);

      expect(handleRequest).toHaveBeenCalledWith(
        expect.anything(),
        'POST',
        '/otp/send',
        mockBody,
        {}
      );
      expect(response).toEqual(mockError);
    });
  });
});