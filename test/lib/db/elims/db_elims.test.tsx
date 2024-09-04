import { prismaMock } from "../../../../singleton";
import { findElimById } from "@/lib/db/elims/elims";
import { mockPrismaElims } from "../../../mocks/tmnts/twoDivs/mockDivs";

// in @/lib/db/events.ts, make sure to use correct prisma client
// import { prisma } from "@/lib/prisma"  // for production & developemnt
// import prisma from '../../../test/client'  // for testing
//
// switch the prisma client back after testing  

describe('elims', () => { 

  describe('findElimById', () => {
    // do NOT test if findElimById finds the user,
    // test if findElimById uses prisma findUnique
    // test if id is checked and valid

    it('should find elim by id', async () => { 
      prismaMock.elim.findUnique.mockResolvedValue(mockPrismaElims[0]);
      const result = await findElimById('elm_45d884582e7042bb95b4818ccdd9974c');
      expect(result).toEqual(mockPrismaElims[0]);
      expect(prismaMock.elim.findUnique).toHaveBeenCalledWith({
        where: { id: 'elm_45d884582e7042bb95b4818ccdd9974c' }        
      });
    })
    it('should return null when no data to search', async () => {
      prismaMock.elim.findUnique.mockResolvedValue(null);
      const result = await findElimById('elm_45d884582e7042bb95b4818ccdd9974c');
      expect(result).toBeNull();
      expect(prismaMock.elim.findUnique).toHaveBeenCalledWith({
        where: { id: 'elm_45d884582e7042bb95b4818ccdd9974c' }        
      });
    })
    it('should return null when empty id is passed in', async () => { 
      const result = await findElimById('');
      expect(result).toBeNull();
      expect(prismaMock.elim.findUnique).not.toHaveBeenCalledWith({
        where: { id: '' }        
      });
    })
    it('should return null when invalid id is passed in', async () => {
      const result = await findElimById('usr_561540bd64974da9abdd97765fdb365');
      expect(result).toBeNull();
      expect(prismaMock.elim.findUnique).not.toHaveBeenCalledWith({
        where: { id: 'usr_561540bd64974da9abdd97765fdb365' }        
      });
    })
    it('should return error when network or server issues cause a request failure', async () => {
      prismaMock.elim.findUnique.mockRejectedValue(new Error('Network Error'));
      try {
        const result = await findElimById('elm_45d884582e7042bb95b4818ccdd9974c');
        expect(result).toBeNull();
      } catch (error: any) {
        expect(error.message).toEqual('Network Error');
      }
    })
  })
})