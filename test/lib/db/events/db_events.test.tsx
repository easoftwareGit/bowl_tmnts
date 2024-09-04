import { prismaMock } from "../../../../singleton";
import { findEventById, validateEvents } from "@/lib/db/events/events";
import { mockPrimsmaEvents } from "../../../mocks/tmnts/twoDivs/mockEvent";
import { mockEvents } from "../../../mocks/tmnts/singlesAndDoubles/mockEvents";
import { ErrorCode } from "@/lib/validation";
import { eventType } from "@/lib/types/types";

// in @/lib/db/events/events.ts, make sure to use correct prisma client
// import { prisma } from "@/lib/prisma"  // for production & developemnt
// import prisma from '../../../test/client'  // for testing
//
// switch the prisma client back after testing  

describe('events', () => { 

  describe('findEventById', () => { 
    // do NOT test if findEventById finds the user,
    // test if findEventById uses prisma findUnique
    // test if id is checked and valid

    it('should find event by id', async () => { 
      prismaMock.event.findUnique.mockResolvedValue(mockPrimsmaEvents[0]);
      const result = await findEventById('evt_9a58f0a486cb4e6c92ca3348702b1a62');
      expect(result).toEqual(mockPrimsmaEvents[0]);
      expect(prismaMock.event.findUnique).toHaveBeenCalledWith({
        where: { id: 'evt_9a58f0a486cb4e6c92ca3348702b1a62' }        
      });
    })
    it('should return null when no data to search', async () => {
      prismaMock.event.findUnique.mockResolvedValue(null);
      const result = await findEventById('evt_9a58f0a486cb4e6c92ca3348702b1a62');
      expect(result).toBeNull();
      expect(prismaMock.event.findUnique).toHaveBeenCalledWith({
        where: { id: 'evt_9a58f0a486cb4e6c92ca3348702b1a62' }        
      });
    })
    it('should return null when empty id is passed in', async () => { 
      const result = await findEventById('');
      expect(result).toBeNull();
      expect(prismaMock.event.findUnique).not.toHaveBeenCalledWith({
        where: { id: '' }        
      });
    })
    it('should return null when invalid id is passed in', async () => {
      const result = await findEventById('usr_561540bd64974da9abdd97765fdb365');
      expect(result).toBeNull();
      expect(prismaMock.event.findUnique).not.toHaveBeenCalledWith({
        where: { id: 'usr_561540bd64974da9abdd97765fdb365' }        
      });
    })
    it('should return error when network or server issues cause a request failure', async () => {
      prismaMock.event.findUnique.mockRejectedValue(new Error('Network Error'));
      try {
        const result = await findEventById('evt_9a58f0a486cb4e6c92ca3348702b1a62');
        expect(result).toBeNull();
      } catch (error: any) {
        expect(error.message).toEqual('Network Error');
      }
    })
  })  

  describe('validateEvents', () => { 

    it('should validate events', async () => { 
      const validEvents = [
        {
          ...mockEvents[0],
          id: '',
        },
        {
          ...mockEvents[1],          
          id: '',
        }
      ]
      const result = validateEvents(validEvents);
      expect(result).toEqual(ErrorCode.None);
    })
    it('should return ErroCode.MissingData when required data is missing', async () => { 
      const invalidEvents = [
        {
          ...mockEvents[0],
          event_name: ''
        },
        {
          ...mockEvents[1],          
        }
      ]
      const result = validateEvents(invalidEvents);
      expect(result).toEqual(ErrorCode.MissingData);
    })
    it('should return ErroCode.InvalidData when required data is invalid', async () => { 
      const invalidEvents = [
        {
          ...mockEvents[0],
          games: 100
        },
        {
          ...mockEvents[1],          
        }
      ]
      const result = validateEvents(invalidEvents);
      expect(result).toEqual(ErrorCode.InvalidData);
    })
    it('should return ErroCode.InvalidData when id is not blank', async () => { 
      const invalidEvents = [
        {
          ...mockEvents[0],
          id: 'evt_9a58f0a486cb4e6c92ca3348702b1a62',
        },
        {
          ...mockEvents[1],          
        }
      ]
      const result = validateEvents(invalidEvents);
      expect(result).toEqual(ErrorCode.InvalidData);
    })
    it('should return ErrorCode.MissingData if empty array', async () => {
      const emptyArray: eventType[] = []
      const result = validateEvents(emptyArray);
      expect(result).toEqual(ErrorCode.MissingData);      
    })
    it('should return ErrorCode.MissingData when passed null', async () => {
      const result = validateEvents(null as any);
      expect(result).toEqual(ErrorCode.MissingData);      
    })
    it('should return ErrorCode.MissingData when passed null', async () => {
      const result = validateEvents(undefined as any);
      expect(result).toEqual(ErrorCode.MissingData);      
    })
  })

})