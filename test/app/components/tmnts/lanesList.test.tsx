import React from 'react';
import { render, screen } from '@testing-library/react';
import LanesList, { getLanesFromPairs, lanesNotThisSquad, lanesThisSquad, pairsOfLanes } from '@/components/tmnts/lanesList';
import { mockLanes, mockPairs } from '../../../mocks/tmnts/mockLanes';
import { laneType } from '@/lib/types/types';

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
          lane: 1,
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
      expect(pairs[0].left_lane).toEqual(mockLanes[0].lane)
      expect(pairs[0].right_lane).toEqual(mockLanes[1].lane)
      expect(pairs[0].left_id).toEqual(mockLanes[0].id)
      expect(pairs[0].right_id).toEqual(mockLanes[1].id)
      expect(pairs[0].in_use).toEqual(true)
    })
  })

  describe('get lanes this squad/ NOT this squad', () => { 
    it('should get the lanes for squad 1', () => { 
      const squad1Lanes = lanesThisSquad(squad1Id, mockLanes)
      expect(squad1Lanes).toHaveLength(12)
    })
    it('should get the lanes for squad 2', () => { 
      const squad1Lanes = lanesNotThisSquad(squad1Id, mockLanes)
      expect(squad1Lanes).toHaveLength(8)
    })
  })

  describe('pairsOfLanes - 1 suqad', () => { 

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
  })

  describe('get the lanes from pairs', () => {    
    it('should get the lanes from pairs', () => {
      const squadLanes = getLanesFromPairs(mockPairs, squad1Id)
      expect(squadLanes).toHaveLength(10)
    })
    it('should get the lanes correcly ordered from pairs', () => {
      const squadLanes = getLanesFromPairs(mockPairs, squad1Id)      
      expect(squadLanes[0].lane).toEqual(1)
      expect(squadLanes[1].lane).toEqual(2)
      expect(squadLanes[2].lane).toEqual(3)
      expect(squadLanes[3].lane).toEqual(4)
      expect(squadLanes[4].lane).toEqual(5)
      expect(squadLanes[5].lane).toEqual(6)
      expect(squadLanes[6].lane).toEqual(7)
      expect(squadLanes[7].lane).toEqual(8)
      expect(squadLanes[8].lane).toEqual(9)
      expect(squadLanes[9].lane).toEqual(10)      
    })
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
        const lanes5And6 = squadLanes.filter(lane => lane.lane === 5 || lane.lane === 6)
        expect(lanes5And6).toHaveLength(0)
      })
    })
  })

  describe('render the lanes list', () => {

    it('should render the lanes list', () => { 
      render(<LanesList squadId={squad1Id} lanes={mockLanes} />)
    })

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
      const firstPairText = mockLanes[0].lane + ' - ' + mockLanes[1].lane
      const firstPair = screen.getByText(firstPairText);
      expect(firstPair).toBeInTheDocument();
    })

    it('should render the 2nd pair of lanes (map is working)', () => { 
      render(<LanesList squadId={squad1Id} lanes={mockLanes} />)
      const secondPairText = mockLanes[2].lane + ' - ' + mockLanes[3].lane
      const secondPair = screen.getByText(secondPairText);
      expect(secondPair).toBeInTheDocument();
    })
  })
})