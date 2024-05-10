import { GET } from '@/app/api/bowls/route';
import { NextRequest } from 'next/server';
// import { prisma } from '@/lib/prisma';
import { baseApi } from '@/lib/tools';

// jest.mock('@/lib/prisma', () => ({
//   prisma: {
//     bowl: {
//       findMany: jest.fn(),
//     },
//   },
// }));

const prisma = {
  bowl: {
    findMany: jest.fn().mockResolvedValue([
      {
        id: 1,
        bowl_name: 'Bowl 1',
        // include other fields here...
      },
      {
        id: 2,
        bowl_name: 'Bowl 2',
        // include other fields here...
      },
      // add more mock bowls here...
    ]),
  },
};


describe('GET /api/bowls', () => {
  // afterEach(() => {
  //   jest.clearAllMocks();
  // });

  it('should return list of bowls', async () => {
    const bowlsData = [
      { id: 1, bowl_name: 'Bowl 1' },
      { id: 2, bowl_name: 'Bowl 2' },
    ];
    (prisma.bowl.findMany as jest.Mock).mockResolvedValueOnce(bowlsData);

    const req = new NextRequest(baseApi + '/bowls');
    const response = await GET(req);

    expect(prisma.bowl.findMany).toHaveBeenCalledWith({
      orderBy: {
        bowl_name: 'asc',
      },
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: bowlsData });
  });

  it('should handle errors', async () => {
    const errorMessage = 'Database error';
    (prisma.bowl.findMany as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const req = new NextRequest(baseApi + '/bowls');
    const response = await GET(req);

    expect(prisma.bowl.findMany).toHaveBeenCalledWith({
      orderBy: {
        bowl_name: 'asc',
      },
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: errorMessage });
  });
});

// Mock Prisma Client

// import { GET } from '@/app/api/bowls/route';
// import { baseApi } from '@/lib/tools';
// import { NextRequest } from 'next/server';

// const prisma = {
//   bowl: {
//     findMany: jest.fn().mockResolvedValue([
//       {
//         id: "1",
//         bowl_name: 'Bowl 1',
//         city: 'City 1',
//         state: 'XX',
//         url: 'https://example.com',        
//       },
//       {
//         id: "2",
//         bowl_name: 'Bowl 2',
//         city: 'City 2',
//         state: 'XX',
//         url: 'https://google.com',
//       },      
//     ]),
//   },
// };

// describe('GET /api/bowls', () => {

//   it('should return list of bowls', async () => {
//     const req = new NextRequest('http://localhost:3000/api/bowls'); 
//     const res = await GET(req);      

//     expect(res).toEqual({
//       data: [
//         {
//           id: "1",
//           bowl_name: 'Bowl 1',
//           city: 'City 1',
//           state: 'XX',
//           url: 'https://example.com',        
//         },
//         {
//           id: "2",
//           bowl_name: 'Bowl 2',
//           city: 'City 2',
//           state: 'XX',
//           url: 'https://google.com',
//         },
//       ],
//       status: 200,
//     });  
//   })

// })
