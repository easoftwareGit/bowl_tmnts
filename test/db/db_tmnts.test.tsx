import { getTmnts, getTmntYears } from "@/lib/db/tmnts";
import axios from "axios";

describe('getTmnts() - Function - passed in empty string', () => {  
  it('should return data when API returns status 200', async () => {
    const mockData = { results: ['Leonardo', 'Michelangelo'] };
    axios.get = jest.fn().mockResolvedValue({ status: 200, data: mockData });
    const result = await getTmnts('');
    expect(result).toEqual(mockData);
  });  

  it('should return undefined when API status is not 200', async () => {
    axios.get = jest.fn().mockResolvedValue({ status: 404 });
    const result = await getTmnts('');    
    expect(result).toBeUndefined();
  });  
  it('should return null when API returns status 200 but no data', async () => {
    axios.get = jest.fn().mockResolvedValue({ status: 200, data: null });
    console.log = jest.fn();
    const result = await getTmnts('');
    expect(result).toBeNull();
  });  
  it('should return null when response status is not 200', async () => {
    axios.get = jest.fn().mockResolvedValue({ status: 404, data: null });
    const result = await getTmnts('');
    expect(result).toBeNull();
  });  
  it('should return error when network or server issues cause a request failure', async () => {
    axios.get = jest.fn().mockRejectedValue(new Error('Network Error'));
    try {
      const result = await getTmnts('');
      expect(result).toEqual([]);
    } catch (error: any) {
      expect(error.message).toEqual('Network Error');
    }
  });  
  it('should return error when environment variables are missing or incorrect', async () => {
    process.env.NEXT_PUBLIC_BASE_API = undefined;
    try {
      const result = await getTmnts('');
      expect(result).toBeUndefined();        
    } catch (error: any) {
      expect(error.message).toEqual('Network Error');
    }
  });  
})

describe('getTmnts() - Function - passed in year YYYY string', () => { 
  
  it('should return data when API returns status 200', async () => {
    const mockData = { results: ['Leonardo', 'Michelangelo'] };
    axios.get = jest.fn().mockResolvedValue({ status: 200, data: mockData });
    const result = await getTmnts('2023');
    expect(result).toEqual(mockData);
  });  
  it('should return empty array when API status is not 200', async () => {
    axios.get = jest.fn().mockResolvedValue({ status: 404 });
    const result = await getTmnts('2023');
    expect(result).toBeUndefined();
  });  
  it('should return empty array when API returns status 200 but no data', async () => {
    axios.get = jest.fn().mockResolvedValue({ status: 200, data: null });
    console.log = jest.fn();
    const result = await getTmnts('2023');
    expect(result).toBeNull();
  });  
  it('should return empty array when response status is not 200', async () => {
    axios.get = jest.fn().mockResolvedValue({ status: 404, data: null });
    const result = await getTmnts('2023');
    expect(result).toBeNull()
  });  
  it('should return error network or server issues cause a request failure', async () => {
    axios.get = jest.fn().mockRejectedValue(new Error('Network Error'));
    try {
      const result = await getTmnts('2023');
      expect(result).toEqual([]);
    } catch (error: any) {
      expect(error.message).toEqual('Network Error');
    }
  });  
  it('should return error when environment variables are missing or incorrect', async () => {
    process.env.NEXT_PUBLIC_BASE_API = undefined;
    try {
      const result = await getTmnts('2023');
      expect(result).toBeUndefined();        
    } catch (error: any) {
      expect(error.message).toEqual('Network Error');
    }
  });  
})

describe('getTmntYears() - Function', () => { 
  it('should return data when API returns status 200', async () => {
    const mockData = { results: ['2022', '2023'] };
    axios.get = jest.fn().mockResolvedValue({ status: 200, data: mockData });
    const result = await getTmntYears();
    expect(result).toEqual(mockData);
  });  
  it('should return empty array when API status is not 200', async () => {
    axios.get = jest.fn().mockResolvedValue({ status: 404 });
    const result = await getTmntYears();
    expect(result).toBeUndefined();
  });  
  it('should return empty array when API returns status 200 but no data', async () => {
    axios.get = jest.fn().mockResolvedValue({ status: 200, data: null });
    console.log = jest.fn();
    const result = await getTmntYears();
    expect(result).toBeNull();
  });
  it('should return error when network or server issues cause a request failure', async () => { 
    axios.get = jest.fn().mockRejectedValue(new Error('Network Error'));
    try {
      const result = await getTmntYears();
      expect(result).toEqual([]);
    } catch (error: any) {
      expect(error.message).toEqual('Network Error');
    }
  });  
  it('should return error when environment variables are missing or incorrect', async () => {
    process.env.NEXT_PUBLIC_BASE_API = undefined;
    try {
      const result = await getTmntYears();
      expect(result).toBeUndefined();        
    } catch (error: any) {
      expect(error.message).toEqual('Network Error');
    }
  })
})