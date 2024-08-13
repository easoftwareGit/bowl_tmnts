// import axios from "axios";
import { prismaMock } from "../../singleton";
import { getBowls, findBowlById } from "@/lib/db/bowls";
import { mockPrismaBowls } from "../mocks/bowls/mockBowls";

// in @/lib/db/bowlsPrisma.tsx, make sure to use correct prisma client
// import { prisma } from "@/lib/prisma"  // for production & developemnt
// import prisma from '../../../test/client'  // for testing
//
// switch the prisma client back after testing  

describe('bowls.tsx', () => { 

  describe('getBowlsPrisma()', () => { 
    it('should return all bowls data', async () => {
      prismaMock.bowl.findMany.mockResolvedValue(mockPrismaBowls);
      const result = await getBowls();
      expect(result).toEqual(mockPrismaBowls);
      expect(prismaMock.bowl.findMany).toHaveBeenCalled();
    });
    it('should return and empty array when no data to return', async () => {
      prismaMock.bowl.findMany.mockResolvedValue([]);
      const result = await getBowls();
      expect(result).toEqual([]);
      expect(prismaMock.bowl.findMany).toHaveBeenCalled();
    });
    it('should return error when network or server issues cause a request failure', async () => {
      prismaMock.bowl.findMany.mockRejectedValue(new Error('Network Error'));
      try {
        const result = await getBowls();
        expect(result).toEqual([]);
      } catch (error: any) {
        expect(error.message).toEqual('Network Error');
      }
    });
  })

  describe('findBowlByIdPrisma()', () => { 
    // do NOT test if findUserByIdPrisma finds the bowl,
    // test if findUserByIdPrisma uses prisma findUnique
    // test if id is checked and valid

    it('should return bowl data when found by searching by id', async () => {
      prismaMock.bowl.findUnique.mockResolvedValue(mockPrismaBowls[0]);
      const result = await findBowlById('bwl_561540bd64974da9abdd97765fdb3659');
      expect(result).toEqual(mockPrismaBowls[0]);
      expect(prismaMock.bowl.findUnique).toHaveBeenCalledWith({
        where: { id: 'bwl_561540bd64974da9abdd97765fdb3659' }        
      });
    });
    it('should return null when no data to search', async () => {
      prismaMock.bowl.findUnique.mockResolvedValue(null);
      const result = await findBowlById('bwl_561540bd64974da9abdd97765fdb3659');
      expect(result).toBeNull();
      expect(prismaMock.bowl.findUnique).toHaveBeenCalledWith({
        where: { id: 'bwl_561540bd64974da9abdd97765fdb3659' }        
      });
    })
    it('should return null when empty id is passed in', async () => {
      const result = await findBowlById('');
      expect(result).toBeNull();
      expect(prismaMock.bowl.findUnique).not.toHaveBeenCalledWith({
        where: { id: '' }        
      });
    })
    // dont need to test if id is too long
    // error check isValidBtDbId() in findUserById() will do that
    it('should return null when invalid id is passed in', async () => {
      const result = await findBowlById('usr_561540bd64974da9abdd97765fdb365');
      expect(result).toBeNull();
      expect(prismaMock.bowl.findUnique).not.toHaveBeenCalledWith({
        where: { id: 'usr_561540bd64974da9abdd97765fdb365' }        
      });
    })
    it('should return error when network or server issues cause a request failure', async () => {
      prismaMock.bowl.findUnique.mockRejectedValue(new Error('Network Error'));
      try {
        const result = await findBowlById('bwl_561540bd64974da9abdd97765fdb3659');
        expect(result).toBeNull();
      } catch (error: any) {
        expect(error.message).toEqual('Network Error');
      }
    })
  })
})