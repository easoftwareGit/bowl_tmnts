import { getTmnts } from "@/db/tmnts/tmnts";
import { getTmntResults } from "@/lib/db/tmnts";
import { server } from "../../mocks/server";
import { rest } from "msw";
import { testbaseTmntsUpcomingApi } from "../../testApi";
import axios from "axios";

describe('tmnts upcoming test', () => { 

  it('should return upcoming tmnts', async () => {
    const tmnts = await (getTmnts(''))
    expect(tmnts.data.length).toBe(2);
  })

  it('should throw an error', () => { 
    const url = testbaseTmntsUpcomingApi
    server.use(
      rest.get(url, (req, res, ctx) => {
        return res(ctx.status(400))
      })
    )
    expect(async () => {
      await getTmnts('');
    }).rejects.toThrow();
  })

})
