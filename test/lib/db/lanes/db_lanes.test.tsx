import { prismaMock } from "../../../../singleton";
import { findLaneById } from "@/lib/db/lanes/lanes";
import { mockPrismaLanes } from "../../../mocks/tmnts/mockLanes";

// in @/lib/db/events.ts, make sure to use correct prisma client
// import { prisma } from "@/lib/prisma"  // for production & developemnt
// import prisma from '../../../test/client'  // for testing
//
// switch the prisma client back after testing  

describe('lanes', () => { 

  describe('findLaneById', () => { 
    // do NOT test if findLaneById finds the user,
    // test if findLaneById uses prisma findUnique
    // test if id is checked and valid

    it('should find lane by ID', async () => { 
      prismaMock.lane.findUnique.mockResolvedValue(mockPrismaLanes[0])
      const result = await findLaneById('lan_7b5b9d9e6b6e4c5b9f6b7d9e7f9b6c5d');
      expect(result).toEqual(mockPrismaLanes[0])
      expect(prismaMock.lane.findUnique).toHaveBeenCalledWith({
        where: { id: 'lan_7b5b9d9e6b6e4c5b9f6b7d9e7f9b6c5d' }
      })
    })
    it('should return null when no data to search', async () => { 
      prismaMock.lane.findUnique.mockResolvedValue(null)
      const result = await findLaneById('lan_7b5b9d9e6b6e4c5b9f6b7d9e7f9b6c5d');
      expect(result).toEqual(null)
      expect(prismaMock.lane.findUnique).toHaveBeenCalledWith({
        where: { id: 'lan_7b5b9d9e6b6e4c5b9f6b7d9e7f9b6c5d' }
      })
    })  
    it('should return null when empty id is passed in', async () => { 
      const result = await findLaneById('');
      expect(result).toEqual(null)  
      expect(prismaMock.lane.findUnique).not.toHaveBeenCalledWith({
        where: { id: '' }
      });
    })
    it('should return null when invalid id is passed in', async () => { 
      const result = await findLaneById('usr_561540bd64974da9abdd97765fdb365');
      expect(result).toEqual(null)  
      expect(prismaMock.lane.findUnique).not.toHaveBeenCalledWith({
        where: { id: 'usr_561540bd64974da9abdd97765fdb365' }
      });
    })
    it('should return error when network or server issues cause a request failure', async () => { 
      prismaMock.lane.findUnique.mockRejectedValue(new Error('Network Error'));
      try {
        const result = await findLaneById('lan_7b5b9d9e6b6e4c5b9f6b7d9e7f9b6c5d');
        expect(result).toBeNull();
      } catch (error: any) {
        expect(error.message).toEqual('Network Error');
      }
    })
  })
})