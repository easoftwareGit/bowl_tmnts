import { prismaMock } from "../../../../singleton";
import { findSquadById } from "@/lib/db/squads/squads";
import { mockPrismaSquads } from "../../../mocks/tmnts/singlesAndDoubles/mockSquads";

// in @/lib/db/events.ts, make sure to use correct prisma client
// import { prisma } from "@/lib/prisma"  // for production & developemnt
// import prisma from '../../../test/client'  // for testing
//
// switch the prisma client back after testing  

describe('squads', () => { 

  describe('findDivById', () => {
    // do NOT test if findSquadById finds the user,
    // test if findSquadById uses prisma findUnique
    // test if id is checked and valid

    it('should find squad by id', async () => { 
      prismaMock.squad.findUnique.mockResolvedValue(mockPrismaSquads[0]);
      const result = await findSquadById('sqd_42be0f9d527e4081972ce8877190489d');
      expect(result).toEqual(mockPrismaSquads[0]);
      expect(prismaMock.squad.findUnique).toHaveBeenCalledWith({
        where: { id: 'sqd_42be0f9d527e4081972ce8877190489d' }
      });      
    })
    it('should return null when no data to search', async () => {
      prismaMock.squad.findUnique.mockResolvedValue(null);
      const result = await findSquadById('sqd_42be0f9d527e4081972ce8877190489d');
      expect(result).toBeNull();
      expect(prismaMock.squad.findUnique).toHaveBeenCalledWith({
        where: { id: 'sqd_42be0f9d527e4081972ce8877190489d' }
      });
    })
    it('should return null when empty id is passed in', async () => { 
      const result = await findSquadById('');
      expect(result).toBeNull();
      expect(prismaMock.squad.findUnique).not.toHaveBeenCalledWith({
        where: { id: '' }
      });
    })
    it('should return null when invalid id is passed in', async () => {
      const result = await findSquadById('usr_561540bd64974da9abdd97765fdb365');
      expect(result).toBeNull();
      expect(prismaMock.squad.findUnique).not.toHaveBeenCalledWith({
        where: { id: 'usr_561540bd64974da9abdd97765fdb365' }
      });
    })
    it('should return error when network or server issues cause a request failure', async () => {
      prismaMock.squad.findUnique.mockRejectedValue(new Error('Network Error'));
      try {
        const result = await findSquadById('sqd_42be0f9d527e4081972ce8877190489d');
        expect(result).toBeNull();
      } catch (error: any) {
        expect(error.message).toEqual('Network Error');
      }
    })
  })
})
