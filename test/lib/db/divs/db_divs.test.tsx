import { prismaMock } from "../../../../singleton";
import { findDivById } from "@/lib/db/divs/divs";
import { mockPrismaDivs } from "../../../mocks/tmnts/twoDivs/mockDivs";

// in @/lib/db/events.ts, make sure to use correct prisma client
// import { prisma } from "@/lib/prisma"  // for production & developemnt
// import prisma from '../../../test/client'  // for testing
//
// switch the prisma client back after testing  

describe('divs', () => {
  
  describe('findDivById', () => { 
    // do NOT test if findDivById finds the user,
    // test if findDivById uses prisma findUnique
    // test if id is checked and valid

    it('should find div by id', async () => { 
      prismaMock.div.findUnique.mockResolvedValue(mockPrismaDivs[0]);
      const result = await findDivById('div_578834e04e5e4885bbae79229d8b96e8');
      expect(result).toEqual(mockPrismaDivs[0]);
      expect(prismaMock.div.findUnique).toHaveBeenCalledWith({
        where: { id: 'div_578834e04e5e4885bbae79229d8b96e8' }
      });      
    })
    it('should return null when no data to search', async () => {
      prismaMock.div.findUnique.mockResolvedValue(null);
      const result = await findDivById('div_578834e04e5e4885bbae79229d8b96e8');
      expect(result).toBeNull();
      expect(prismaMock.div.findUnique).toHaveBeenCalledWith({
        where: { id: 'div_578834e04e5e4885bbae79229d8b96e8' }
      });
    })
    it('should return null when empty id is passed in', async () => {
      const result = await findDivById('');
      expect(result).toBeNull();
      expect(prismaMock.div.findUnique).not.toHaveBeenCalledWith({
        where: { id: '' }
      });
    })
    it('should return null when invalid id is passed in', async () => {
      const result = await findDivById('usr_561540bd64974da9abdd97765fdb365');
      expect(result).toBeNull();
      expect(prismaMock.div.findUnique).not.toHaveBeenCalledWith({
        where: { id: 'usr_561540bd64974da9abdd97765fdb365' }
      });
    })
    it('should return error when network or server issues cause a request failure', async () => {
      prismaMock.div.findUnique.mockRejectedValue(new Error('Network Error'));
      try {
        const result = await findDivById('div_578834e04e5e4885bbae79229d8b96e8');
        expect(result).toBeNull();
      } catch (error: any) {
        expect(error.message).toEqual('Network Error');
      }
    })
  })
})