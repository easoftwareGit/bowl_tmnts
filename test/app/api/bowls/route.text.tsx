import { NextRequest } from 'next/server';
// import { GET } from '../../../../src/app/api/bowls/route';
import { GET } from '@/app/api/bowls/route';

describe("tests for api/bowls/route", () => {
  describe ("GET", () => {
    it("should return 200", async () => {
      const requestMock = {} as NextRequest;
      const response = await GET(requestMock);
      expect(response.status).toBe(200);
    })
  })
})