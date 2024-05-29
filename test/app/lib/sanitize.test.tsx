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
  it('remove manually searched chars curved brackets, astirisk and plus ()*+', () => { 
    const input = '12(34)56*78+90'
    const expectedOutput = '1234567890'
    const result = sanitize(input);
    expect(result).toEqual(expectedOutput);
  })  
  it('remove manually searched chars when they appear multiple times ()*+', () => { 
    const input = '12((34)))56*****78++++++90'
    const expectedOutput = '1234567890'
    const result = sanitize(input);
    expect(result).toEqual(expectedOutput);
  })  
  it('remove all brackets, straight [], curved (), curly {}, angeled <> ', () => { 
    const input = '[ABC](DEF){GHI}<JKL>'
    const expectedOutput = 'ABCDEFGHI'
    const result = sanitize(input);
    expect(result).toEqual(expectedOutput);
  })
  it('remove math symbols */=+^', () => { 
    const input = '*12/34=56+78^90'
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
  it('should return the string unchanged when it contains only allowed characters', () => {
    const input = "Hello, world-123 'test'.";
    const result = sanitize(input);
    expect(result).toBe("Hello, world-123 'test'.");
  });    
  it('should return an empty string when input is empty string', () => {
    const result = sanitize('');
    expect(result).toBe('');
  });
  it('should trim leading and trailing spaces', () => {
    const input = "   leading and trailing spaces   ";
    const result = sanitize(input);
    expect(result).toBe("leading and trailing spaces");
  });  
  it('should keep multiple spaces between words', () => {
    const input = "a  b   c    d";
    const result = sanitize(input);
    expect(result).toBe("a  b   c    d");
  });  
  it('should return an empty string when input contains only spaces', () => {
    const input = "     ";
    const result = sanitize(input);
    expect(result).toBe("");
  });  
  it('should remove non-Latin characters from the string', () => {
    const input = "a.b-c@d e'fg#h1ক😀";
    const result = sanitize(input);
    expect(result).toBe("a.b-cd e'fgh1");
  });  
  it('should maintain case sensitivity when input has a combination of upper and lower case letters', () => {
    const input = "HeLlo, WoRld-123 'TeSt'.";
    const result = sanitize(input);
    expect(result).toBe("HeLlo, WoRld-123 'TeSt'.");
  });  
  it('should trim after removing non-Latin characters', () => { 
    const input = "()  a.b-c@d e'fg#h1  ক  😀";
    const result = sanitize(input);
    expect(result).toBe("a.b-cd e'fgh1");
  })
  it('should return the same string when input is a valid JSON object', () => {
    const input = '{"key": "value"}';
    const result = sanitize(input);
    expect(result).toBe("key value");
  });  
  it('should remove newline characters and non-visible characters', () => {
    const input = "a\nb\tc\r";
    const result = sanitize(input);
    expect(result).toBe("abc");
  });  
});