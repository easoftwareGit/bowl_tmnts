import { getPotName, getBrktOrElimName } from '../../../src/lib/getName';
import { mockDivs, mockPots, mockBrkts, mockElims } from '../../mocks/tmnts/twoDivs/mockDivs';

describe('getName functions', () => {

  test('getPotName returns the correct name', () => {
    const potName = getPotName(mockPots[1], mockDivs);
    expect(potName).toBe('Game - Scratch');
  });

  test('getBrktOrElimName returns the correct name for Bracket', () => {
    const brktName = getBrktOrElimName(mockBrkts[1].id, mockBrkts);
    expect(brktName).toBe('Scratch: 1-3');
  });

  test('getBrktOrElimName returns the correct name for Elimination', () => {
    const elimName = getBrktOrElimName(mockElims[1].id, mockElims);
    expect(elimName).toBe('Scratch: 1-3');
  });
});