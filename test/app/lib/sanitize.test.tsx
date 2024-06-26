import { sanitize, sanitizeCurrency, sanitizeUrl } from '../../../src/lib/sanitize';

describe('sanitize inputs', () => {

  describe('tests for sanitize function', () => {

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
    it('remove manually searched chars curved brackets and astirisk ()*', () => {
      const input = '12(34)56*78+90'
      const expectedOutput = '12345678+90'
      const result = sanitize(input);
      expect(result).toEqual(expectedOutput);
    })
    it('remove manually searched chars when they appear multiple times ()*', () => {
      const input = '12((34)))56*****7890'
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
    it('remove math symbols */=^', () => {
      const input = '*12/34=5678^90'
      const expectedOutput = '1234567890'
      const result = sanitize(input);
      expect(result).toEqual(expectedOutput);
    })
    it('keep math symbols +- plus and minus', () => {
      const input = '12+34-56++78--90'
      const expectedOutput = '12+34-56++78--90'
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

  describe('tests for the sanitizeUrl function', () => { 
    
    it('should return the sanitized URL when given a valid HTTP URL', () => {
      const result = sanitizeUrl('http://example.com/path?query=123#hash');
      expect(result).toBe('http://example.com/path?query=123#hash');
    });
    
    it('should return an empty string when the URL protocol is unsupported', () => {
      const result = sanitizeUrl('ftp://example.com/path');
      expect(result).toBe('');
    });
    
    it('should return the sanitized URL with port number when given a valid HTTP URL with port', () => {
      const result = sanitizeUrl('http://example.com:8080/path?query=123#hash');
      expect(result).toBe('http://example.com:8080/path?query=123#hash');
    });

    it('should return the sanitized URL when given a valid HTTPS URL', () => {
      const result = sanitizeUrl('https://example.com/path?query=123#hash');
      expect(result).toBe('https://example.com/path?query=123#hash');
    });

    it('should return the sanitized URL when given a valid URL with a path', () => {
      const result = sanitizeUrl('http://example.com/path?query=123#hash');
      expect(result).toBe('http://example.com/path?query=123#hash');
    });

    it('should return the sanitized URL when given a valid HTTP URL with query parameters', () => {
      const result = sanitizeUrl('http://example.com/path?query=123#hash');
      expect(result).toBe('http://example.com/path?query=123#hash');
    });

    it('should return the sanitized URL when given a URL with a hash fragment', () => {
      const result = sanitizeUrl('http://example.com/path?query=123#hash');
      expect(result).toBe('http://example.com/path?query=123#hash');
    });

    it('should return an empty string when given a URL with a malformed structure', () => {
      const result = sanitizeUrl('invalidurl');
      expect(result).toBe('');
    });

    it('should return an empty string when given an empty URL', () => {
      const result = sanitizeUrl('');
      expect(result).toBe('');
    });

    it('should return the URL-encoded version of the input URL with spaces', () => {
      const result = sanitizeUrl('http://example.com/with spaces');
      expect(result).toBe('http://example.com/with%20spaces');
    });

    it('should return an empty string when given a URL with a very long length', () => {
      const longUrl = 'http://' + 'a'.repeat(10000); // creating a URL with a very long length
      const result = sanitizeUrl(longUrl);
      expect(result).toBe('');
    });

    it('should return an empty string when given a URL with missing protocol', () => {
      const result = sanitizeUrl('example.com');
      expect(result).toBe('');
    });

    it('should return an empty string when given an invalid URL', () => {
      const result = sanitizeUrl('invalidurl');
      expect(result).toBe('');
    });

    it('should ignore username and password in the URL', () => {
      const result = sanitizeUrl('http://username:password@example.com/path?query=123#hash');
      expect(result).toBe('http://example.com/path?query=123#hash');
    });

    it('should correctly parse and rebuild URLs with complex query parameters', () => {
      const result = sanitizeUrl('https://example.com/path/to/resource?param1=value1&param2=value2#section');
      expect(result).toBe('https://example.com/path/to/resource?param1=value1&param2=value2#section');
    });
  })
  
  describe('test for sanitizeCurrency function', () => {
    it('should return the sanitized currency when given a valid currency string', () => {
      const result = sanitizeCurrency('123.45');
      expect(result).toBe('123.45');
    });
    it('should return an empty string when given an empty currency string', () => { 
      const result = sanitizeCurrency('');
      expect(result).toBe('');
    })
    it('should return a strig with no decimal point when given a currency string without any decimal points', () => { 
      const result = sanitizeCurrency('123');
      expect(result).toBe('123');
    })
    it('should return a strig with 1 digit after decimal point when given a currency string with 1 digit after decimal point', () => { 
      const result = sanitizeCurrency('123.4');
      expect(result).toBe('123.4');      
    })
    it('should return a strig with 2 digits after decimal point when given a currency string with 2 digits after decimal point', () => { 
      const result = sanitizeCurrency('123.45');
      expect(result).toBe('123.45');
    })  
    it('should return a strig with a leading negative sign', () => { 
      const result = sanitizeCurrency('-123.45');
      expect(result).toBe('-123.45');
    })
    it('should remove trailing ".0" when given a currency string with trailing ".0"', () => {
      const result = sanitizeCurrency('123.0');
      expect(result).toBe('123');
    })
    it('should remove trailing ".00" when given a currency string with trailing ".00"', () => {
      const result = sanitizeCurrency('123.00');
      expect(result).toBe('123');
    })
    it('should remove trailing ".000" when given a currency string with trailing ".000"', () => {
      const result = sanitizeCurrency('123.000');
      expect(result).toBe('123');
    })
    it('should return an empty sstring when given a strig with a leading currency sign', () => { 
      const result = sanitizeCurrency('$123.45');
      expect(result).toBe('');
    })
    it('should return aN EMPTY string when given a strig with a brackets for a negative number', () => { 
      const result = sanitizeCurrency('(123.45)');
      expect(result).toBe('');
    })
    it('should return a strig with 2 digits after decimal point when given a currency string with 3 digits after decimal point', () => { 
      const result = sanitizeCurrency('123.456');
      expect(result).toBe('123.45');
    })
    it('should return a strig with 2 digits after decimal point, trimmed, not rounded when given a currency string with 3 digits after decimal point', () => { 
      const result = sanitizeCurrency('123.899');
      expect(result).toBe('123.89');
    })    
    it('should return an empty string when given an invalid currency string', () => {
      const result = sanitizeCurrency('abc');
      expect(result).toBe('');
    });
    it('should return an empty string when passed null', () => { 
      const result = sanitizeCurrency(null as any);
      expect(result).toBe('');
    })
    it('should return an empty string when passed undefined', () => { 
      const result = sanitizeCurrency(undefined as any);
      expect(result).toBe('');
    })    
  })

});

