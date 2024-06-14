import { btDbUuid } from "@/lib/uuid";
import { isValidBtDbId } from "@/lib/validation";

describe('tests for uuid', () => {  

  it('should return a valid btDb uuid', () => { 
    const type = 'bwl';
    const bowUuid = btDbUuid(type);
    expect(bowUuid).toHaveLength(36);
    expect(isValidBtDbId(bowUuid, type)).toBe(true);    
  })
  it('shoudl return a blank uuid for invalid type', () => { 
    const bad = 'bad';
    const bowUuid = btDbUuid(bad);
    expect(bowUuid).toHaveLength(0);
  })
})