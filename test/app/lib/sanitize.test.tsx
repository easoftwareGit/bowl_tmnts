import { sanitize } from '../../../src/lib/sanitize';

describe('sanitize', () => {
  it('should remove special characters and trim spaces', () => {
    const input = "a.b-c@d e'fg#h1ক😀";
    const expectedOutput = "a.b-cd e'fgh1";
    const result = sanitize(input);
    expect(result).toEqual(expectedOutput);
  });

  it('should remove special characters and trim spaces, CAPITAL LETTERS', () => {
    const input = "A.B-C@D E'FG#H1ক😀";
    const expectedOutput = "A.B-CD E'FGH1";
    const result = sanitize(input);
    expect(result).toEqual(expectedOutput);
  });

  it('should return an empty string if input is falsy', () => {
    const input = "";
    const expectedOutput = "";
    const result = sanitize(input);
    expect(result).toEqual(expectedOutput);
  });

  it('should return a strign with no leading or tailing spaces', () => {
    const input = "  a.b-c@d e'fg#h1ক😀  ";
    const expectedOutput = "a.b-cd e'fgh1";
    const result = sanitize(input);
    expect(result).toEqual(expectedOutput);
  })

  it('remove semi colon, <, >', () => { 
    const input = '<abc>;'
    const expectedOutput = 'abc'
    const result = sanitize(input);
    expect(result).toEqual(expectedOutput);
  })
});