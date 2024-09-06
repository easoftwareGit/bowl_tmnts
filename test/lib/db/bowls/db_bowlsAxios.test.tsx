import { getBowls } from "@/lib/db/bowls/bowlsAxios";

describe('bowlsAxios', () => { 

  describe('getBowls()', () => { 
    it('should return all bowls data', async () => {      
      const result = await getBowls();
      expect(result).toHaveLength(4); // from prisma/seed.ts      
    });
  })

})
