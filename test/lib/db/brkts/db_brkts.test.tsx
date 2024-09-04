import { prismaMock } from "../../../../singleton";
import { findBrktById } from "@/lib/db/brkts/brkts";
import { mockPrismaBrkts } from "../../../mocks/tmnts/twoDivs/mockDivs";

// in @/lib/db/events.ts, make sure to use correct prisma client
// import { prisma } from "@/lib/prisma"  // for production & developemnt
// import prisma from '../../../test/client'  // for testing
//
// switch the prisma client back after testing  

describe('brkts', () => { 

  describe('findBrktById', () => { 
    // do NOT test if findBrktById finds the user,
    // test if findBrktById uses prisma findUnique
    // test if id is checked and valid

    it('should find brkt by id', async () => { 
      prismaMock.brkt.findUnique.mockResolvedValue(mockPrismaBrkts[0]);
      const result = await findBrktById('brk_5109b54c2cc44ff9a3721de42c80c8c1');
      expect(result).toEqual(mockPrismaBrkts[0]);
      expect(prismaMock.brkt.findUnique).toHaveBeenCalledWith({
        where: { id: 'brk_5109b54c2cc44ff9a3721de42c80c8c1' }
      });      
    })
    it('should return null when no data to search', async () => {
      prismaMock.brkt.findUnique.mockResolvedValue(null);
      const result = await findBrktById('brk_5109b54c2cc44ff9a3721de42c80c8c1');
      expect(result).toEqual(null);
      expect(prismaMock.brkt.findUnique).toHaveBeenCalledWith({
        where: { id: 'brk_5109b54c2cc44ff9a3721de42c80c8c1' }
      });      
    })
    it('should return null when empty id is passed in', async () => { 
      const result = await findBrktById('');
      expect(result).toEqual(null);
      expect(prismaMock.brkt.findUnique).not.toHaveBeenCalledWith({
        where: { id: '' }
      });
    })
    it('should return null when invalid id is passed in', async () => {
      const result = await findBrktById('usr_561540bd64974da9abdd97765fdb365');
      expect(result).toEqual(null);
      expect(prismaMock.brkt.findUnique).not.toHaveBeenCalledWith({
        where: { id: 'usr_561540bd64974da9abdd97765fdb365' }
      });
    })
    it('should return error when network or server issues cause a request failure', async () => {
      prismaMock.brkt.findUnique.mockRejectedValue(new Error('Network Error'));
      try {
        const result = await findBrktById('brk_5109b54c2cc44ff9a3721de42c80c8c1');
        expect(result).toBeNull();
      } catch (error: any) {
        expect(error.message).toEqual('Network Error');
      }
    })
  })
})