import { getTmnts } from "@/db/tmnts/tmnts";
import { getTmntResults } from "@/lib/db/tmnts";
import { server } from "../../mocks/server";
import { rest } from "msw";
import { testbaseTmntsResultsApi } from "../../testApi";
import axios from "axios";

describe('tmnts results test', () => {
  
  it('should return tmnt results', async () => {
    const tmnts = await (getTmnts('2023')) // ARRANGE & ACT
    expect(tmnts.data.length).toBe(4); // ASSERT
  })

  it('should return no tmnt results', async () => {
    const url = testbaseTmntsResultsApi + '2024'
    server.use(
      rest.get(url, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ data: [] }))
      })
    ) // ARRANGE
    const tmnts = await (getTmnts('2024')) // ACT
    expect(tmnts.data.length).toBe(0); // ASSERT
  })

  it('should throw an error', () => { 
    const url = testbaseTmntsResultsApi + '2024'
    server.use(
      rest.get(url, (req, res, ctx) => {
        return res(ctx.status(400))
      })
    ) // ARRANGE
    expect(async () => {
      await getTmnts('2024');
    }).rejects.toThrow();  // ACT & ASSERT
  })

})

describe('Codium tests', () => {
  // Function returns data successfully when API returns status 200 and data
  it('should return data when API returns status 200', async () => {
    const mockData = { results: ['Leonardo', 'Michelangelo'] };
    axios.get = jest.fn().mockResolvedValue({ status: 200, data: mockData });
    const result = await getTmntResults();
    expect(result).toEqual(mockData);
  });  

  it('should return empty array when API status is not 200', async () => {
    axios.get = jest.fn().mockResolvedValue({ status: 404 });
    const result = await getTmntResults();
    expect(result).toEqual([]);
  });  
  it('should log message and return empty array when API returns status 200 but no data', async () => {
    axios.get = jest.fn().mockResolvedValue({ status: 200, data: null });
    console.log = jest.fn();
    const result = await getTmntResults();
    expect(result).toEqual([]);
    expect(console.log).toHaveBeenCalledWith('Tmnt Results - Non error return, but not status 200');
  });  
  it('should return empty array when response status is not 200', async () => {
    axios.get = jest.fn().mockResolvedValue({ status: 404, data: null });
    const result = await getTmntResults();
    expect(result).toEqual([]);
  });  
  it('should return empty array when network or server issues cause a request failure', async () => {
    axios.get = jest.fn().mockRejectedValue(new Error('Network Error'));
    const result = await getTmntResults();
    expect(result).toEqual([]);
  });  
  it('should return empty array when environment variables are missing or incorrect', async () => {
    process.env.NEXT_PUBLIC_BASE_API = undefined;
    const result = await getTmntResults();
    expect(result).toEqual([]);
  });  
  it('should log error message when API returns non-200 status code', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    axios.get = jest.fn().mockResolvedValue({ status: 404, data: null });
    await getTmntResults();
    expect(consoleSpy).toHaveBeenCalledWith('Tmnt Results - Non error return, but not status 200');
    consoleSpy.mockRestore();
  });  
})