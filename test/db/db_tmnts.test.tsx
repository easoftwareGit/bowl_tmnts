import { prismaMock } from "../../singleton";
import {
  getTmnts,
  getTmntYears,
  findTmntById,
  exportedForTesting,
} from "@/lib/db/tmnts";
import { mockPrismaTmnts, mockPrismaTmntsList } from "../mocks/tmnts/mockTmnt";
import { endOfDayFromString, startOfDayFromString, todayStr } from "@/lib/dateTools";
const { getTmntsForYear, getUpcomingTmnts } = exportedForTesting;

describe('tmnts', () => {

  describe("getTmnts() - passed in empty string", () => {
    // do NOT test if getTmnts('') returns all upcoming tmnts
    // test if getTmnts('') uses prisma findMany    

    it('should return all tmnts data', async () => { 
      prismaMock.tmnt.findMany.mockResolvedValue(mockPrismaTmnts);
      const result = await getTmnts('');
      expect(result).toEqual(mockPrismaTmnts);
      expect(prismaMock.tmnt.findMany).toHaveBeenCalled();
    })
    it('should return and empty array when no data to return', async () => {
      prismaMock.tmnt.findMany.mockResolvedValue([]);
      const result = await getTmnts('');
      expect(result).toEqual([]);
      expect(prismaMock.tmnt.findMany).toHaveBeenCalled();
    })
    it('should return error when network or server issues cause a request failure', async () => {
      prismaMock.tmnt.findMany.mockRejectedValue(new Error('Network Error'));
      try {
        const result = await getTmnts('');
        expect(result).toEqual([]);
      } catch (error: any) {
        expect(error.message).toEqual('Network Error');
      }
    })
  })

  describe('getUpcomingTmnts()', () => {
    it('should return all upcoming tmnts', async () => {
      prismaMock.tmnt.findMany.mockResolvedValue(mockPrismaTmnts);
      const result = await getUpcomingTmnts();
      expect(result).toEqual(mockPrismaTmnts);
      expect(prismaMock.tmnt.findMany).toHaveBeenCalled();
    })
    it('should return and empty array when no data to return', async () => {
      prismaMock.tmnt.findMany.mockResolvedValue([]);
      const result = await getUpcomingTmnts();
      expect(result).toEqual([]);
      expect(prismaMock.tmnt.findMany).toHaveBeenCalled();
    })
    it('should return error when network or server issues cause a request failure', async () => {
      prismaMock.tmnt.findMany.mockRejectedValue(new Error('Network Error'));
      try {
        const result = await getUpcomingTmnts();
        expect(result).toEqual([]);
      } catch (error: any) {
        expect(error.message).toEqual('Network Error');
      }
    })
  })

  describe("getTmnts('yyyy') - passed in year YYYY string", () => { 
    // do NOT test if getTmnts('yyyy') returns all upcoming tmnts
    // test if getTmnts('yyyy') uses prisma findMany    
    // test if getTmnts('yyyy') checks for valid year

    it('should return all tmnts data for that year', async () => {
      prismaMock.tmnt.findMany.mockResolvedValue(mockPrismaTmnts);
      const result = await getTmnts('2023');
      expect(result).toEqual(mockPrismaTmnts);
      expect(prismaMock.tmnt.findMany).toHaveBeenCalled();
    })
    it('should return and empty array when no data to return', async () => {
      prismaMock.tmnt.findMany.mockResolvedValue([]);
      const result = await getTmnts('2023');
      expect(result).toEqual([]);
      expect(prismaMock.tmnt.findMany).toHaveBeenCalled();
    })
    it('should return error when network or server issues cause a request failure', async () => {
      prismaMock.tmnt.findMany.mockRejectedValue(new Error('Network Error'));
      try {
        const result = await getTmnts('2023');
        expect(result).toEqual([]);
      } catch (error: any) {
        expect(error.message).toEqual('Network Error');
      }
    })
  })
  
  describe('getTmntsForYear()', () => {
    it('should return all tmnts data for that year', async () => {
      prismaMock.tmnt.findMany.mockResolvedValue(mockPrismaTmnts);
      const result = await getTmntsForYear('2023');
      expect(result).toEqual(mockPrismaTmnts);
      const maxDate = endOfDayFromString(`2023-12-31`) as Date
      const jan1st = startOfDayFromString(`2023-01-01`) as Date
      expect(prismaMock.tmnt.findMany).toHaveBeenCalledWith({
        where: {
          start_date: {
            lte: maxDate,
            gte: jan1st
          }
        },
        orderBy: [
          {
            start_date: 'desc'
          }
        ],
        select: {
          id: true,
          tmnt_name: true,
          start_date: true,
          bowls: {
            select: {
              bowl_name: true,
              city: true,
              state: true,
              url: true,
            },
          },
        },
        skip: undefined,
        take: undefined
      });
    })
    it('should return and empty array when no data to return', async () => {
      prismaMock.tmnt.findMany.mockResolvedValue([]);
      const result = await getTmntsForYear('2023');
      expect(result).toEqual([]);
      const maxDate = endOfDayFromString(`2023-12-31`) as Date
      const jan1st = startOfDayFromString(`2023-01-01`) as Date
      expect(prismaMock.tmnt.findMany).toHaveBeenCalled();      
    })
    it('should return empty array when no passed invalid year', async () => { 
      prismaMock.tmnt.findMany.mockResolvedValue([]);
      const result = await getTmntsForYear('20233');
      expect(result).toEqual([]);
      expect(prismaMock.tmnt.findUnique).not.toHaveBeenCalled();
    })
    it('should return error when network or server issues cause a request failure', async () => {
      prismaMock.tmnt.findMany.mockRejectedValue(new Error('Network Error'));
      try {
        const result = await getTmntsForYear('2023');
        expect(result).toEqual([]);
      } catch (error: any) {
        expect(error.message).toEqual('Network Error');
      }
    })
  })

  describe('getTmntYears()', () => { 
    it('should return all tmnts years from today and BEFORE', async () => {
      const result = await getTmntYears();
      const spy = jest.spyOn(prismaMock, '$queryRawUnsafe').mockResolvedValue(['2022', '2023']);
      expect(spy).toHaveBeenCalled();
    })
    it('should return error when network or server issues cause a request failure', async () => {
      prismaMock.tmnt.findMany.mockRejectedValue(new Error('Network Error'));
      try {
        const result = await getTmntYears();
        const spy = jest.spyOn(prismaMock, '$queryRawUnsafe').mockRejectedValue(new Error('Network Error'));
        expect(spy).toHaveBeenCalled();
      } catch (error: any) {
        expect(error.message).toEqual('Network Error');
      }
    })  
  })

  describe('findTmntById()', () => {
    it('should return tmnt data', async () => { 
      prismaMock.tmnt.findUnique.mockResolvedValue(mockPrismaTmnts[0]);
      const result = await findTmntById('tmt_fe8ac53dad0f400abe6354210a8f4cd1');
      expect(result).toEqual(mockPrismaTmnts[0]);
      expect(prismaMock.tmnt.findUnique).toHaveBeenCalledWith({
        where: { id: 'tmt_fe8ac53dad0f400abe6354210a8f4cd1' }        
      });      
    })
    it('should return null when no data to search', async () => {
      prismaMock.tmnt.findUnique.mockResolvedValue(null);
      const result = await findTmntById('tmt_fe8ac53dad0f400abe6354210a8f4cd1');
      expect(result).toBeNull();
      expect(prismaMock.tmnt.findUnique).toHaveBeenCalledWith({
        where: { id: 'tmt_fe8ac53dad0f400abe6354210a8f4cd1' }        
      });
    })
    it('should return null when empty id is passed in', async () => { 
      const result = await findTmntById('');
      expect(result).toBeNull();
      expect(prismaMock.tmnt.findUnique).not.toHaveBeenCalledWith({
        where: { id: '' }        
      });
    })
    it('should return null when invalid id is passed in', async () => {
      const result = await findTmntById('usr_561540bd64974da9abdd97765fdb365');
      expect(result).toBeNull();
      expect(prismaMock.tmnt.findUnique).not.toHaveBeenCalledWith({
        where: { id: 'usr_561540bd64974da9abdd97765fdb365' }        
      });
    })
    it('should return error when network or server issues cause a request failure', async () => {
      prismaMock.tmnt.findUnique.mockRejectedValue(new Error('Network Error'));
      try {
        const result = await findTmntById('tmt_fe8ac53dad0f400abe6354210a8f4cd1');
        expect(result).toBeNull();
      } catch (error: any) {
        expect(error.message).toEqual('Network Error');
      }
    })
  })
  
});
