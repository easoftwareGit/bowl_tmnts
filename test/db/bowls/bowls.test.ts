import { getBowls } from "@/db/bowls/bowls"
import { server } from "../../../test/mocks/server";
import { rest } from "msw";
import { testBaseBowlsApi } from "../../testApi";

describe('bowls test', () => {

  it('should return all bowls', async () => {
    const bowls = await (getBowls());
    expect(bowls.data.length).toBe(2)
  })

  it('should throw an error', () => { 
    const url = testBaseBowlsApi
    server.use(
      rest.get(url, (req, res, ctx) => {
        return res(ctx.status(400))
      })
    )
    expect(async () => {
      await getBowls();
    }).rejects.toThrow();
  })
})