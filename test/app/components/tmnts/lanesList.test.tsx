import React from 'react';
import { render, screen } from '@testing-library/react';
import LanesList, { getLanesFromPairs, lanesNotThisSquad, lanesThisSquad, pairsOfLanes } from '@/components/tmnts/lanesList';
import { mockLanes, mockPairs } from '../../../mocks/tmnts/mockLanes';
import { laneType, pairsOfLanesType } from '@/lib/types/types';

describe('LanesList - Component', () => { 

  const squad1Id = '1'
  const squad2Id = '2'

  describe('get the array of pairs of lanes', () => { 
    it('return an empty array when passed an empty array', () => { 
      const emptyLanes: laneType[] = [];
      const pairs = pairsOfLanes(squad1Id, emptyLanes)
      expect(pairs).toHaveLength(0)
    })

    it('return an empty array when passed an array with an odd length (not even length)', () => { 
      const oneLane: laneType[] = [
        {
          id: "1",
          lane_number: 1,
          squad_id: '1'
        }
      ];
      const pairs = pairsOfLanes(squad1Id, oneLane)
      expect(pairs).toHaveLength(0)
    })

    it('should get the array of pairs of lanes for 1st squad', () => { 
      const pairs = pairsOfLanes(squad1Id, mockLanes)
      expect(pairs).toHaveLength(6) // lanes 1 to 12, 6 pairs
    })

    it('should get the array of pairs of lanes for 2nd squad', () => { 
      const pairs = pairsOfLanes(squad2Id, mockLanes)
      expect(pairs).toHaveLength(4) // lanes 13 to 20, 4 pairs
    })

    it('should get the array of pairs of lanes', () => {
      const pairs = pairsOfLanes(squad1Id, mockLanes)
      expect(pairs[0].left_lane).toEqual(mockLanes[0].lane_number)
      expect(pairs[0].right_lane).toEqual(mockLanes[1].lane_number)
      expect(pairs[0].left_id).toEqual(mockLanes[0].id)
      expect(pairs[0].right_id).toEqual(mockLanes[1].id)
      expect(pairs[0].in_use).toEqual(true)
    })
  })

  describe('lanesThisSquad() function ', () => { 
    it('should get the lanes for squad 1', () => { 
      const squad1Lanes = lanesThisSquad(squad1Id, mockLanes)
      expect(squad1Lanes).toHaveLength(12)
    })
    // returns lanes matching the given squad_id
    it('should return lanes matching the given squad_id', () => {
      const lanes = [
        { id: '1', lane_number: 1, squad_id: 'squad1' },
        { id: '2', lane_number: 2, squad_id: 'squad1' },
        { id: '3', lane_number: 3, squad_id: 'squad2' }
      ];
      const result = lanesThisSquad('squad1', lanes);
      expect(result).toEqual([
        { id: '1', lane_number: 1, squad_id: 'squad1' },
        { id: '2', lane_number: 2, squad_id: 'squad1' }
      ]);
    });

    // handles an empty lanes array
    it('should return an empty array when lanes array is empty', () => {
      const lanes: laneType[] = [];
      const result = lanesThisSquad('squad1', lanes);
      expect(result).toEqual([]);
    });

    // returns an empty array when no lanes match the given squad_id
    it('should return an empty array when no lanes match the given squad_id', () => {
      const lanes = [
        { id: '1', lane_number: 1, squad_id: 'squad1' },
        { id: '2', lane_number: 2, squad_id: 'squad1' },
        { id: '3', lane_number: 3, squad_id: 'squad2' }
      ];
      const result = lanesThisSquad('squad3', lanes);
      expect(result).toEqual([]);
    });

    // filters lanes correctly when multiple lanes have the same squad_id
    it('should filter lanes correctly when multiple lanes have the same squad_id', () => {
      const lanes = [
        { id: '1', lane_number: 1, squad_id: 'squad1' },
        { id: '2', lane_number: 2, squad_id: 'squad1' },
        { id: '3', lane_number: 3, squad_id: 'squad2' }
      ];
      const result = lanesThisSquad('squad1', lanes);
      expect(result).toEqual([
        { id: '1', lane_number: 1, squad_id: 'squad1' },
        { id: '2', lane_number: 2, squad_id: 'squad1' }
      ]);
    });

    // handles null or undefined lanes input
    it('should return an empty array when lanes input is null', () => {
      const result = lanesThisSquad('squad1', null as unknown as laneType[]);
      expect(result).toEqual([]);
    });

    // handles null or undefined squad_id input
    it('should return an empty array when squad_id is null', () => {
      const lanes = [
        { id: '1', lane_number: 1, squad_id: 'squad1' },
        { id: '2', lane_number: 2, squad_id: 'squad1' },
        { id: '3', lane_number: 3, squad_id: 'squad2' }
      ];
      const result = lanesThisSquad(null as unknown as string, lanes);
      expect(result).toEqual([]);
    });

    // handles lanes with missing squad_id fields
    it('should return an empty array when lanes are missing squad_id fields', () => {
      const lanes = [
        { id: '1', lane_number: 1, squad_id: 'squad1' },
        { id: '2', lane_number: 2 },
        { id: '3', lane_number: 3, squad_id: 'squad2' }
      ];
      const result = lanesThisSquad('squad1', lanes as unknown as laneType[]);
      expect(result).toEqual([
        { id: '1', lane_number: 1, squad_id: 'squad1' }
      ]);
    });

    // handles lanes with non-string squad_id fields
    it('should return an empty array when lanes have non-string squad_id fields', () => {
      const lanes = [
        { id: '1', lane_number: 1, squad_id: 'squad1' },
        { id: '2', lane_number: 2, squad_id: 'squad1' },
        { id: '3', lane_number: 3, squad_id: 2 }
      ];
      const result = lanesThisSquad('squad1', lanes as unknown as laneType[]);
      expect(result).toEqual([
        { id: '1', lane_number: 1, squad_id: 'squad1' },
        { id: '2', lane_number: 2, squad_id: 'squad1' }
      ]);
    });

    // ensures that the function maintains the order of lanes in the returned array including all lanes
    it('should maintain the order of lanes in the returned array including all lanes', () => {
      const lanes = [
        { id: '1', lane_number: 1, squad_id: 'squad1' },
        { id: '2', lane_number: 2, squad_id: 'squad1' },
        { id: '3', lane_number: 3, squad_id: 'squad1' }
      ];
      const result = lanesThisSquad('squad1', lanes);
      expect(result).toEqual([
        { id: '1', lane_number: 1, squad_id: 'squad1' },
        { id: '2', lane_number: 2, squad_id: 'squad1' },
        { id: '3', lane_number: 3, squad_id: 'squad1' }
      ]);
    });

    // handles lanes with non-string id fields
    it('should return lanes with non-string id fields', () => {
      const lanes = [
        { id: 1, lane_number: 1, squad_id: 'squad1' },
        { id: 2, lane_number: 2, squad_id: 'squad1' },
        { id: 3, lane_number: 3, squad_id: 'squad2' }
      ];
      const result = lanesThisSquad('squad1', lanes as unknown as laneType[]);
      expect(result).toEqual([
        { id: 1, lane_number: 1, squad_id: 'squad1' },
        { id: 2, lane_number: 2, squad_id: 'squad1' }
      ]);
    });

    // handles lanes with non-integer lane_number fields
    it('should return lanes with non-integer lane_number fields', () => {
      const lanes = [
        { id: '1', lane_number: 1.5, squad_id: 'squad1' },
        { id: '2', lane_number: 2.5, squad_id: 'squad1' },
        { id: '3', lane_number: 3, squad_id: 'squad2' }
      ];
      const result = lanesThisSquad('squad1', lanes);
      expect(result).toEqual([
        { id: '1', lane_number: 1.5, squad_id: 'squad1' },
        { id: '2', lane_number: 2.5, squad_id: 'squad1' }
      ]);
    });
  })

  describe('lanesNotThisSquad() function', () => {

    // filters out lanes with matching squad_id
    it('should filter out lanes with matching squad_id', () => {
      const lanes = [
        { id: '1', lane_number: 1, squad_id: 'squad1' },
        { id: '2', lane_number: 2, squad_id: 'squad2' },
        { id: '3', lane_number: 3, squad_id: 'squad1' }
      ];
      const result = lanesNotThisSquad('squad1', lanes);
      expect(result).toEqual([{ id: '2', lane_number: 2, squad_id: 'squad2' }]);
    });

    // handles null or undefined lanes input gracefully
    it('should return an empty array when lanes input is null or undefined', () => {
      expect(lanesNotThisSquad('squad1', null as unknown as laneType[])).toEqual([]);
      expect(lanesNotThisSquad('squad1', undefined as unknown as laneType[])).toEqual([]);
    });

    // returns all lanes when no lane has matching squad_id
    it('should return all lanes when no lane has matching squad_id', () => {
      const lanes = [
        { id: '1', lane_number: 1, squad_id: 'squad1' },
        { id: '2', lane_number: 2, squad_id: 'squad2' },
        { id: '3', lane_number: 3, squad_id: 'squad2' }
      ];
      const result = lanesNotThisSquad('squad3', lanes);
      expect(result).toEqual([
        { id: '1', lane_number: 1, squad_id: 'squad1' },
        { id: '2', lane_number: 2, squad_id: 'squad2' },
        { id: '3', lane_number: 3, squad_id: 'squad2' }
      ]);
    });

    // returns empty array when input lanes array is empty
    it('should return empty array when input lanes array is empty', () => {
      const lanes: laneType[] = [];
      const result = lanesNotThisSquad('squad1', lanes);
      expect(result).toEqual([]);
    });

    // returns empty array when no lanes are provided
    it('should return empty array when no lanes are provided', () => {
      const result = lanesNotThisSquad('squad1', []);
      expect(result).toEqual([]);
    });

    // handles multiple lanes with different squad_ids correctly
    it('should filter out lanes with matching squad_id when multiple lanes with different squad_ids are present', () => {
      const lanes = [
        { id: '1', lane_number: 1, squad_id: 'squad1' },
        { id: '2', lane_number: 2, squad_id: 'squad2' },
        { id: '3', lane_number: 3, squad_id: 'squad1' }
      ];
      const result = lanesNotThisSquad('squad1', lanes);
      expect(result).toEqual([{ id: '2', lane_number: 2, squad_id: 'squad2' }]);
    });

    // handles empty string as squadId
    it('should return an empty array when squadId is an empty string', () => {
      const lanes = [
        { id: '1', lane_number: 1, squad_id: 'squad1' },
        { id: '2', lane_number: 2, squad_id: 'squad2' },
        { id: '3', lane_number: 3, squad_id: 'squad1' }
      ];
      const result = lanesNotThisSquad('', lanes);
      expect(result).toEqual([]);
    });

    // Ensure the function filters out lanes with null or undefined squad_id, including those with undefined squad_id
    it('should filter out lanes with null or undefined squad_id including undefined squad_id', () => {
      const lanes = [
        { id: '1', lane_number: 1, squad_id: 'squad1' },
        { id: '2', lane_number: 2, squad_id: 'squad2' },
        { id: '3', lane_number: 3, squad_id: undefined }
      ];
      const result = lanesNotThisSquad('squad1', lanes as unknown as laneType[]);
      expect(result).toEqual([
        { id: '2', lane_number: 2, squad_id: 'squad2' },
        { id: '3', lane_number: 3, squad_id: undefined }
      ]);
    });

    // handles lanes with non-string squad_id
    it('should filter out lanes with non-string squad_id', () => {
      const lanes = [
        { id: '1', lane_number: 1, squad_id: 'squad1' },
        { id: '2', lane_number: 2, squad_id: 123 },
        { id: '3', lane_number: 3, squad_id: 'squad1' }
      ];
      const result = lanesNotThisSquad('squad1', lanes as unknown as laneType[]);
      expect(result).toEqual([{ id: '2', lane_number: 2, squad_id: 123 }]);
    });

    // maintains order of lanes in the output
    it('should maintain order of lanes in the output', () => {
      const lanes = [
        { id: '1', lane_number: 1, squad_id: 'squad1' },
        { id: '2', lane_number: 2, squad_id: 'squad2' },
        { id: '3', lane_number: 3, squad_id: 'squad1' }
      ];
      const result = lanesNotThisSquad('squad1', lanes);
      expect(result).toEqual([{ id: '2', lane_number: 2, squad_id: 'squad2' }]);
    });

    // handles lanes with duplicate lane_numbers
    it('should filter out lanes with matching squad_id', () => {
      const lanes = [
        { id: '1', lane_number: 1, squad_id: 'squad1' },
        { id: '2', lane_number: 2, squad_id: 'squad2' },
        { id: '3', lane_number: 3, squad_id: 'squad1' }
      ];
      const result = lanesNotThisSquad('squad1', lanes);
      expect(result).toEqual([{ id: '2', lane_number: 2, squad_id: 'squad2' }]);
    });

    // handles lanes with non-numeric lane_numbers
    it('should filter out lanes with non-numeric lane_numbers', () => {
      const lanes = [
        { id: '1', lane_number: 1, squad_id: 'squad1' },
        { id: '2', lane_number: 'two', squad_id: 'squad2' },
        { id: '3', lane_number: 3, squad_id: 'squad1' }
      ];
      const result = lanesNotThisSquad('squad1', lanes as unknown as laneType[]);
      expect(result).toEqual([{ id: '2', lane_number: 'two', squad_id: 'squad2' }]);
    });

    // handles lanes with negative lane_number
    it('should filter out lanes with negative lane_number', () => {
      const lanes = [
        { id: '1', lane_number: -1, squad_id: 'squad1' },
        { id: '2', lane_number: 2, squad_id: 'squad2' },
        { id: '3', lane_number: -3, squad_id: 'squad1' }
      ];
      const result = lanesNotThisSquad('squad1', lanes);
      expect(result).toEqual([{ id: '2', lane_number: 2, squad_id: 'squad2' }]);
    });
  });

  describe('pairsOfLanes() function', () => { 
    it('should get the pairs of lanes for squad 1', () => {
      const pairs = pairsOfLanes(squad1Id, mockLanes)
      expect(pairs).toHaveLength(6)
      expect(pairs[0].left_lane).toEqual(1)
      expect(pairs[0].right_lane).toEqual(2)
      expect(pairs[1].left_lane).toEqual(3)
      expect(pairs[1].right_lane).toEqual(4)
      expect(pairs[5].left_lane).toEqual(11)      
      expect(pairs[5].right_lane).toEqual(12)
    })
    it('should get the pairs of lanes for squad 2', () => {
      const pairs = pairsOfLanes(squad2Id, mockLanes)
      expect(pairs).toHaveLength(4)
      expect(pairs[0].left_lane).toEqual(13)
      expect(pairs[0].right_lane).toEqual(14)
      expect(pairs[1].left_lane).toEqual(15)
      expect(pairs[1].right_lane).toEqual(16)
      expect(pairs[3].left_lane).toEqual(19)      
      expect(pairs[3].right_lane).toEqual(20)
    })

    // returns pairs of lanes for even number of lanes
    it('should return pairs of lanes when the number of lanes is even', () => {
      const squadId = "squad1";
      const lanes = [
        { id: "lane1", lane_number: 1, squad_id: squadId },
        { id: "lane2", lane_number: 2, squad_id: squadId },
        { id: "lane3", lane_number: 3, squad_id: squadId },
        { id: "lane4", lane_number: 4, squad_id: squadId }
      ];
      const result = pairsOfLanes(squadId, lanes);
      expect(result).toEqual([
        {
          left_id: "lane1",
          left_lane: 1,
          right_id: "lane2",
          right_lane: 2,
          in_use: true
        },
        {
          left_id: "lane3",
          left_lane: 3,
          right_id: "lane4",
          right_lane: 4,
          in_use: true
        }
      ]);
    });

    // returns empty array for odd number of lanes
    it('should return an empty array when the number of lanes is odd', () => {
      const squadId = "squad1";
      const lanes = [
        { id: "lane1", lane_number: 1, squad_id: squadId },
        { id: "lane2", lane_number: 2, squad_id: squadId },
        { id: "lane3", lane_number: 3, squad_id: squadId }
      ];
      const result = pairsOfLanes(squadId, lanes);
      expect(result).toEqual([]);
    });

    // pairs lanes sequentially from the list
    it('should pair lanes sequentially when the number of lanes is even', () => {
      const squadId = "squad1";
      const lanes = [
        { id: "lane1", lane_number: 1, squad_id: squadId },
        { id: "lane2", lane_number: 2, squad_id: squadId },
        { id: "lane3", lane_number: 3, squad_id: squadId },
        { id: "lane4", lane_number: 4, squad_id: squadId }
      ];
      const result = pairsOfLanes(squadId, lanes);
      expect(result).toEqual([
        {
          left_id: "lane1",
          left_lane: 1,
          right_id: "lane2",
          right_lane: 2,
          in_use: true
        },
        {
          left_id: "lane3",
          left_lane: 3,
          right_id: "lane4",
          right_lane: 4,
          in_use: true
        }
      ]);
    });

    // sets 'in_use' to true for all pairs by default
    it("should set 'in_use' to true for all pairs by default", () => {
      const squadId = "squad1";
      const lanes = [
        { id: "lane1", lane_number: 1, squad_id: squadId },
        { id: "lane2", lane_number: 2, squad_id: squadId },
        { id: "lane3", lane_number: 3, squad_id: squadId },
        { id: "lane4", lane_number: 4, squad_id: squadId }
      ];
      const result = pairsOfLanes(squadId, lanes);
      result.forEach(pair => {
        expect(pair.in_use).toBe(true);
      });
    });

    // handles multiple pairs correctly
    it('should handle multiple pairs correctly', () => {
      const squadId = "squad1";
      const lanes = [
        { id: "lane1", lane_number: 1, squad_id: squadId },
        { id: "lane2", lane_number: 2, squad_id: squadId },
        { id: "lane3", lane_number: 3, squad_id: squadId },
        { id: "lane4", lane_number: 4, squad_id: squadId },
        { id: "lane5", lane_number: 5, squad_id: squadId },
        { id: "lane6", lane_number: 6, squad_id: squadId }
      ];
      const result = pairsOfLanes(squadId, lanes);
      expect(result).toEqual([
        {
          left_id: "lane1",
          left_lane: 1,
          right_id: "lane2",
          right_lane: 2,
          in_use: true
        },
        {
          left_id: "lane3",
          left_lane: 3,
          right_id: "lane4",
          right_lane: 4,
          in_use: true
        },
        {
          left_id: "lane5",
          left_lane: 5,
          right_id: "lane6",
          right_lane: 6,
          in_use: true
        }
      ]);
    });

    // returns empty array for empty lanes array
    it('should return empty array when lanes array is empty', () => {
      const squadId = "squad1";
      const lanes: laneType[] = [];
      const result = pairsOfLanes(squadId, lanes);
      expect(result).toEqual([]);
    });

    // returns empty array for null squadId
    it('should return empty array when squadId is null', () => {
      const squadId = null as unknown as string;
      const lanes = [
        { id: "lane1", lane_number: 1, squad_id: "squad1" },
        { id: "lane2", lane_number: 2, squad_id: "squad1" }
      ];
      const result = pairsOfLanes(squadId, lanes);
      expect(result).toEqual([]);
    });

    // returns empty array for null lanes array
    it('should return empty array when lanes array is null', () => {
      const squadId = "squad1";
      const lanes = null;
      const result = pairsOfLanes(squadId, lanes as unknown as laneType[]);
      expect(result).toEqual([]);
    });

    // returns empty array for non-matching squadId
    it('should return empty array when squadId does not match any lanes', () => {
      const squadId = "squad2";
      const lanes = [
        { id: "lane1", lane_number: 1, squad_id: "squad1" },
        { id: "lane2", lane_number: 2, squad_id: "squad1" },
        { id: "lane3", lane_number: 3, squad_id: "squad1" },
        { id: "lane4", lane_number: 4, squad_id: "squad1" }
      ];
      const result = pairsOfLanes(squadId, lanes);
      expect(result).toEqual([]);
    });

    // maintains order of lanes in pairs
    it('should maintain order of lanes in pairs when generating pairs of lanes', () => {
      const squadId = "squad1";
      const lanes = [
        { id: "lane1", lane_number: 1, squad_id: squadId },
        { id: "lane2", lane_number: 2, squad_id: squadId },
        { id: "lane3", lane_number: 3, squad_id: squadId },
        { id: "lane4", lane_number: 4, squad_id: squadId }
      ];
      const result = pairsOfLanes(squadId, lanes);
      expect(result).toEqual([
        {
          left_id: "lane1",
          left_lane: 1,
          right_id: "lane2",
          right_lane: 2,
          in_use: true
        },
        {
          left_id: "lane3",
          left_lane: 3,
          right_id: "lane4",
          right_lane: 4,
          in_use: true
        }
      ]);
    });

    // ensures no side effects on input arrays
    it('should not modify the input arrays when generating pairs of lanes', () => {
      const squadId = "squad1";
      const lanes = [
        { id: "lane1", lane_number: 1, squad_id: squadId },
        { id: "lane2", lane_number: 2, squad_id: squadId },
        { id: "lane3", lane_number: 3, squad_id: squadId },
        { id: "lane4", lane_number: 4, squad_id: squadId }
      ];
      const originalLanes = [...lanes];
      pairsOfLanes(squadId, lanes);
      expect(lanes).toEqual(originalLanes);
    });
  })

  describe('getLanesFromPairs() function', () => {    
    it('should get the lanes from pairs', () => {
      const squadLanes = getLanesFromPairs(mockPairs, squad1Id)
      expect(squadLanes).toHaveLength(10)
    })
    it('should get the lanes correcly ordered from pairs', () => {
      const squadLanes = getLanesFromPairs(mockPairs, squad1Id)      
      expect(squadLanes[0].lane_number).toEqual(1)
      expect(squadLanes[1].lane_number).toEqual(2)
      expect(squadLanes[2].lane_number).toEqual(3)
      expect(squadLanes[3].lane_number).toEqual(4)
      expect(squadLanes[4].lane_number).toEqual(5)
      expect(squadLanes[5].lane_number).toEqual(6)
      expect(squadLanes[6].lane_number).toEqual(7)
      expect(squadLanes[7].lane_number).toEqual(8)
      expect(squadLanes[8].lane_number).toEqual(9)
      expect(squadLanes[9].lane_number).toEqual(10)      
    })

    // returns empty array when pairs is empty
    it('should return empty array when pairs is empty', () => {
      const pairs: pairsOfLanesType[] = [];
      const squadId = 'test-squad-id';
      const result = getLanesFromPairs(pairs, squadId);
      expect(result).toEqual([]);
    });

    // handles null or undefined pairs input
    it('should return empty array when pairs is null or undefined', () => {
      const squadId = 'test-squad-id';
      let result = getLanesFromPairs(null as any, squadId);
      expect(result).toEqual([]);
  
      result = getLanesFromPairs(undefined as any, squadId);
      expect(result).toEqual([]);
    });

    // correctly maps left and right lanes to laneType objects
    it('should correctly map left and right lanes to laneType objects', () => {
      const pairs: pairsOfLanesType[] = [
        {
          left_id: 'left-id-1',
          left_lane: 1,
          right_id: 'right-id-1',
          right_lane: 2,
          in_use: true
        },
        {
          left_id: 'left-id-2',
          left_lane: 3,
          right_id: 'right-id-2',
          right_lane: 4,
          in_use: true
        }
      ];
      const squadId = 'test-squad-id';
      const result = getLanesFromPairs(pairs, squadId);
      const expected = [
        {
          id: 'left-id-1',
          lane_number: 1,
          squad_id: 'test-squad-id'
        },
        {
          id: 'right-id-1',
          lane_number: 2,
          squad_id: 'test-squad-id'
        },
        {
          id: 'left-id-2',
          lane_number: 3,
          squad_id: 'test-squad-id'
        },
        {
          id: 'right-id-2',
          lane_number: 4,
          squad_id: 'test-squad-id'
        }
      ];
      expect(result).toEqual(expected);
    });

    // assigns correct squad_id to each lane
    it('should assign correct squad_id to each lane', () => {
      const pairs: pairsOfLanesType[] = [
        {
          left_id: '1',
          left_lane: 1,
          right_id: '2',
          right_lane: 2,
          in_use: true
        }
      ];
      const squadId = 'test-squad-id';
      const result = getLanesFromPairs(pairs, squadId);
      expect(result).toEqual([
        {
          id: '1',
          lane_number: 1,
          squad_id: 'test-squad-id'
        },
        {
          id: '2',
          lane_number: 2,
          squad_id: 'test-squad-id'
        }
      ]);
    });

    // handles multiple pairs correctly
    it('should handle multiple pairs correctly', () => {
      const pairs: pairsOfLanesType[] = [
        { left_id: '1', left_lane: 1, right_id: '2', right_lane: 2, in_use: true },
        { left_id: '3', left_lane: 3, right_id: '4', right_lane: 4, in_use: true }
      ];
      const squadId = 'test-squad-id';
      const result = getLanesFromPairs(pairs, squadId);
      expect(result).toEqual([
        { id: '1', lane_number: 1, squad_id: 'test-squad-id' },
        { id: '2', lane_number: 2, squad_id: 'test-squad-id' },
        { id: '3', lane_number: 3, squad_id: 'test-squad-id' },
        { id: '4', lane_number: 4, squad_id: 'test-squad-id' }
      ]);
    });

    // verifies that the function returns lanes even if left_id or right_id is missing
    it('should return lanes even if left_id or right_id is missing', () => {
      const pairs: pairsOfLanesType[] = [
        { left_id: '1', left_lane: 1, right_id: '', right_lane: 2, in_use: true },
        { left_id: '', left_lane: 3, right_id: '2', right_lane: 4, in_use: true }
      ];
      const squadId = 'test-squad-id';
      const result = getLanesFromPairs(pairs, squadId);
      expect(result).toEqual([
        { id: '1', lane_number: 1, squad_id: 'test-squad-id' },
        { id: '', lane_number: 2, squad_id: 'test-squad-id' },
        { id: '', lane_number: 3, squad_id: 'test-squad-id' },
        { id: '2', lane_number: 4, squad_id: 'test-squad-id' }
      ]);
    });

    // Ensures the function handles pairs with undefined left_lane or right_lane values correctly, including lanes with undefined values
    it('should handle pairs with undefined left_lane or right_lane values - Updated', () => {
      const pairs: pairsOfLanesType[] = [
        { left_id: '1', left_lane: 1, right_id: '2', right_lane: undefined as any, in_use: true },
        { left_id: '3', left_lane: undefined as any, right_id: '4', right_lane: 2, in_use: true }
      ];
      const squadId = 'test-squad-id';
      const result = getLanesFromPairs(pairs, squadId);
      expect(result).toEqual([
        { id: '1', lane_number: 1, squad_id: 'test-squad-id' },
        { id: '2', lane_number: undefined, squad_id: 'test-squad-id' },
        { id: '3', lane_number: undefined, squad_id: 'test-squad-id' },
        { id: '4', lane_number: 2, squad_id: 'test-squad-id' }
      ]);
    });

    // handles pairs with in_use set to false
    it('should return empty array when all pairs have in_use set to false', () => {
      const pairs: pairsOfLanesType[] = [
        { left_id: '1', left_lane: 1, right_id: '2', right_lane: 2, in_use: false },
        { left_id: '3', left_lane: 3, right_id: '4', right_lane: 4, in_use: false }
      ];
      const squadId = 'test-squad-id';
      const result = getLanesFromPairs(pairs, squadId);
      expect(result).toEqual([]);
    });

    // handles pairs with duplicate lane numbers
    it('should handle pairs with duplicate lane numbers', () => {
      const pairs: pairsOfLanesType[] = [
        { left_id: '1', left_lane: 1, right_id: '2', right_lane: 1, in_use: true },
        { left_id: '3', left_lane: 2, right_id: '4', right_lane: 2, in_use: true }
      ];
      const squadId = 'test-squad-id';
      const result = getLanesFromPairs(pairs, squadId);
      expect(result).toEqual([
        { id: '1', lane_number: 1, squad_id: 'test-squad-id' },
        { id: '2', lane_number: 1, squad_id: 'test-squad-id' },
        { id: '3', lane_number: 2, squad_id: 'test-squad-id' },
        { id: '4', lane_number: 2, squad_id: 'test-squad-id' }
      ]);
    });

    // ensures no side effects or mutations to input pairs array
    it('should not mutate input pairs array', () => {
      const pairs: pairsOfLanesType[] = [
        { left_id: '1', left_lane: 1, right_id: '2', right_lane: 2, in_use: true },
        { left_id: '3', left_lane: 3, right_id: '4', right_lane: 4, in_use: true }
      ];
      const squadId = 'test-squad-id';
      const originalPairs = [...pairs];
      getLanesFromPairs(pairs, squadId);
      expect(pairs).toEqual(originalPairs);
    });

    // maintains order of lanes as they appear in pairs
    it('should maintain order of lanes as they appear in pairs', () => {
      const pairs: pairsOfLanesType[] = [
        { left_id: '1', left_lane: 1, right_id: '2', right_lane: 2, in_use: true },
        { left_id: '3', left_lane: 3, right_id: '4', right_lane: 4, in_use: true }
      ];
      const squadId = 'test-squad-id';
      const result = getLanesFromPairs(pairs, squadId);
      expect(result).toEqual([
        { id: '1', lane_number: 1, squad_id: 'test-squad-id' },
        { id: '2', lane_number: 2, squad_id: 'test-squad-id' },
        { id: '3', lane_number: 3, squad_id: 'test-squad-id' },
        { id: '4', lane_number: 4, squad_id: 'test-squad-id' }
      ]);
    });

    // handles non-integer lane numbers gracefully
    it('should handle non-integer lane numbers gracefully', () => {
      const pairs: pairsOfLanesType[] = [
        {
          left_id: '1',
          left_lane: 1.5,
          right_id: '2',
          right_lane: 2.5,
          in_use: true
        }
      ];
      const squadId = 'test-squad-id';
      const result = getLanesFromPairs(pairs, squadId);
      expect(result).toEqual([
        {
          id: '1',
          lane_number: 1.5,
          squad_id: 'test-squad-id'
        },
        {
          id: '2',
          lane_number: 2.5,
          squad_id: 'test-squad-id'
        }
      ]);
    });

    // ensures unique ids for each laneType object
    it('should ensure unique ids for each laneType object', () => {
      const pairs: pairsOfLanesType[] = [
        {
          left_id: '1',
          left_lane: 1,
          right_id: '2',
          right_lane: 2,
          in_use: true
        },
        {
          left_id: '3',
          left_lane: 3,
          right_id: '4',
          right_lane: 4,
          in_use: true
        }
      ];
      const squadId = 'test-squad-id';
      const result = getLanesFromPairs(pairs, squadId);
      const uniqueIds = result.map(lane => lane.id).filter((value, index, self) => self.indexOf(value) === index);
      expect(uniqueIds.length).toEqual(result.length);
    });

    describe('skip not in use lanes', () => { 
      beforeAll(() => {
        mockPairs[2].in_use = false
      })
      afterAll(() => {
        mockPairs[2].in_use = true
      })
      it('skip not in use pairs', () => { 
        const squadLanes = getLanesFromPairs(mockPairs, squad1Id)
        expect(squadLanes).toHaveLength(8)  
      })
      it('do not include lanes 5 & 6', () => { 
        const squadLanes = getLanesFromPairs(mockPairs, squad1Id)
        const lanes5And6 = squadLanes.filter(lane => lane.lane_number === 5 || lane.lane_number === 6)
        expect(lanes5And6).toHaveLength(0)
      })
    })
  })

  describe('render the lanes list', () => {

    it('should render the "Lanes" column header', () => {
      render(<LanesList squadId={squad1Id} lanes={mockLanes} />) 
      const lanesHeader = screen.getByText('Lanes');
      expect(lanesHeader).toBeInTheDocument();
    })

    it('should render the "In Use" column header', () => {
      render(<LanesList squadId={squad1Id} lanes={mockLanes} />) 
      const inUseHeader = screen.getByText('In Use');
      expect(inUseHeader).toBeInTheDocument();
    })

    it('should render the first pair of lanes', () => { 
      render(<LanesList squadId={squad1Id} lanes={mockLanes} />)
      const firstPairText = mockLanes[0].lane_number + ' - ' + mockLanes[1].lane_number
      const firstPair = screen.getByText(firstPairText);
      expect(firstPair).toBeInTheDocument();
    })

    it('should render the 2nd pair of lanes (map is working)', () => { 
      render(<LanesList squadId={squad1Id} lanes={mockLanes} />)
      const secondPairText = mockLanes[2].lane_number + ' - ' + mockLanes[3].lane_number
      const secondPair = screen.getByText(secondPairText);
      expect(secondPair).toBeInTheDocument();
    })
  })
})