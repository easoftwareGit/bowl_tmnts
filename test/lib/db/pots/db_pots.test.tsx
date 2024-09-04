import { prismaMock } from "../../../../singleton";
import { findPotById } from "@/lib/db/pots/pots";
import { mockPrismaPots } from "../../../mocks/tmnts/twoDivs/mockDivs";

// in @/lib/db/events.ts, make sure to use correct prisma client
// import { prisma } from "@/lib/prisma"  // for production & developemnt
// import prisma from '../../../test/client'  // for testing
//
// switch the prisma client back after testing  

describe('pots', () => { 

  describe('findPotById', () => { 
    // do NOT test if findPotById finds the user,
    // test if findPotById uses prisma findUnique
    // test if id is checked and valid

    it('should find pot by id', async () => { 
      prismaMock.pot.findUnique.mockResolvedValue(mockPrismaPots[0]);
      const result = await findPotById('pot_b2a7b02d761b4f5ab5438be84f642c3b');
      expect(result).toEqual(mockPrismaPots[0]);
      expect(prismaMock.pot.findUnique).toHaveBeenCalledWith({
        where: { id: 'pot_b2a7b02d761b4f5ab5438be84f642c3b' }
      })
    })
    it('should return null when no data to search', async () => { 
      prismaMock.pot.findUnique.mockResolvedValue(null);
      const result = await findPotById('pot_b2a7b02d761b4f5ab5438be84f642c3b');
      expect(result).toEqual(null);
      expect(prismaMock.pot.findUnique).toHaveBeenCalledWith({
        where: { id: 'pot_b2a7b02d761b4f5ab5438be84f642c3b' }
      })
    })
    it('should return null when empty id is passed in', async () => { 
      const result = await findPotById('');
      expect(result).toEqual(null);
      expect(prismaMock.pot.findUnique).not.toHaveBeenCalledWith({
        where: { id: '' }
      })
    })
    it('should return null when invalid id is passed in', async () => { 
      const result = await findPotById('usr_561540bd64974da9abdd97765fdb365');
      expect(result).toEqual(null);
      expect(prismaMock.pot.findUnique).not.toHaveBeenCalledWith({
        where: { id: 'usr_561540bd64974da9abdd97765fdb365' }
      })
    })
    it('should return error when network or server issues cause a request failure', async () => {
      prismaMock.pot.findUnique.mockRejectedValue(new Error('Network Error'));
      try {
        const result = await findPotById('pot_b2a7b02d761b4f5ab5438be84f642c3b');
        expect(result).toBeNull();
      } catch (error: any) {
        expect(error.message).toEqual('Network Error');
      }
    })

  })
})