import { getTmntYears } from "@/db/tmnts/years"
import { server } from "../../mocks/server";
import { rest } from "msw";
import { testbaseTmntsYearsApi } from "../../testApi";

describe('tmnt years tests', () => {

  it('should return tmnt years', async () => {
    const tmntYears = await getTmntYears()
    expect(tmntYears.data.length).toBe(2);    
  })

  it('should throw an error', () => {
    const year = new Date().getFullYear().toString();
    const url = testbaseTmntsYearsApi + year
    server.use(
      rest.get(url, (req, res, ctx) => {
        return res(ctx.status(400))
      })
    )
    expect(async () => {
      await getTmntYears();
    }).rejects.toThrow();
  })
})