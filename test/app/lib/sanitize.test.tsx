import { sanitize } from '../../../src/lib/sanitize';

describe('sanitize', () => {
  it('should remove special characters and trim spaces', () => {
    const input = "a.b-c@d e'fg#h,1ক😀";
    const expectedOutput = "a.b-cd e'fgh,1";
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

  it('remove punctuation :;?!"', () => {
    const input = 'abc:def;opq?rst!uvw"xyz'
    const expectedOutput = 'abcdefopqrstuvwxyz'
    const result = sanitize(input);
    expect(result).toEqual(expectedOutput);
  })
  it("keep allowed punctuation '.,", () => { 
    const input = "abc.def,ghi'jkl"
    const expectedOutput = "abc.def,ghi'jkl"
    const result = sanitize(input);
    expect(result).toEqual(expectedOutput);
  })
  it('remove all brackets, straight [], curved (), curly {}, angeled <> ', () => { 
    const input = '[ABC](DEF){GHI}<JKL>'
    const expectedOutput = 'ABCDEFGHIJKL'
    const result = sanitize(input);
    expect(result).toEqual(expectedOutput);
  })
  it('remove math symbols */=+^%', () => { 
    const input = '*12/34=56+78^90%'
    const expectedOutput = '1234567890'
    const result = sanitize(input);
    expect(result).toEqual(expectedOutput);
  })
  it("remove other special chars `~@#$&|\\", () => { 
    const input = "AB`CDE~FGH@IJK#LMN$OPQ&RST|UVW\\XYZ"
    const expectedOutput = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const result = sanitize(input);
    expect(result).toEqual(expectedOutput);
  })
  it('remove random advaned unicode symbols "¼©«¬±ĂĖõœϢ֍جᴻ╢█"', () => { 
    const input = "ABC¼©«¬±ĂĖõœϢ֍جᴻ╢█xyz"
    const expectedOutput = "ABCxyz"
    const result = sanitize(input);
    expect(result).toEqual(expectedOutput);
  })
    
});