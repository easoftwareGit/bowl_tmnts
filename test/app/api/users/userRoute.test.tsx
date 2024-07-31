
    
// import nextAuth from "next-auth";
// import { NextRequest, NextResponse } from "next/server"; 
// import { testBaseUsersApi } from "../../../testApi";
// import axios from "axios";
// import { GET } from "../../../../src/app/api/users/route";
// import { mockUser } from "../../../mocks/tmnts/mockTmnt";
// describe('GET', () => {

//   // Verify the function returns a JSON response indicating authentication success when session exists
//   it('should return a JSON response indicating authentication success when session exists', async () => {
//     const mockRequest = new NextRequest(testBaseUsersApi);
//     const mockData = { user: mockUser };
//     axios.get = jest.fn().mockResolvedValue({ status: 200, data: mockData });
//     const response = await GET(mockRequest);
//     expect(response).toEqual(mockData);
//   });

//   // Ensure the function returns a 401 status code when no session is found
//   it('should return a 401 status code when no session is found', async () => {
//     const mockRequest = new NextRequest(testBaseUsersApi);        
//     axios.get = jest.fn().mockResolvedValue({ status: 401 });
//     const response = await GET(mockRequest);
//     expect(response.status).toBe(401);
//     expect(response.json()).resolves.toEqual({ error: 'unauthorized' });
//   });
// });
