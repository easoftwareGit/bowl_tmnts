import { getTmnts } from "@/db/tmnts/tmnts";
import { server } from "../../mocks/server";
import { rest } from "msw";
import { testbaseTmntsResultsApi } from "../../testApi";

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