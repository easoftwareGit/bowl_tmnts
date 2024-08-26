import axios, { AxiosError } from "axios";
import { baseBrktsApi } from "@/lib/db/apiPaths";
import { testBaseBrktsApi } from "../../../testApi";
import { brktType } from "@/lib/types/types";
import { initBrkt } from "@/lib/db/initVals";
import { postSecret } from "@/lib/tools";
import { isValidBtDbId } from "@/lib/validation";

// before running this test, run the following commands in the terminal:
// 1) clear and re-seed the database
//    a) clear the database
//       npx prisma db push --force-reset
//    b) re-seed
//       npx prisma db seed  
//    if just need to re-seed, then only need step 1b
// 2) make sure the server is running
//    in the VS activity bar, 
//      a) click on "Run and Debug" (Ctrl+Shift+D)
//      b) at the top of the window, click on the drop-down arrow
//      c) select "Node.js: debug server-side"
//      d) directly to the left of the drop down select, click the green play button
//         This will start the server in debug mode. 

const url = testBaseBrktsApi.startsWith("undefined")
  ? baseBrktsApi
  : testBaseBrktsApi;   

const notFoundId = "brk_01234567890123456789012345678901";
const nonBrktId = "usr_01234567890123456789012345678901";
const squad2Id = 'sqd_1a6c885ee19a49489960389193e8f819';
const div2Id = "div_1f42042f9ef24029a0a2d48cc276a087";

describe('Brkts - PUT, PATCH, DELETE API: /api/brkts', () => { 

  const testBrkt: brktType = {
    ...initBrkt,
    id: "brk_5109b54c2cc44ff9a3721de42c80c8c1",
    squad_id: "sqd_7116ce5f80164830830a7157eb093396",
    div_id: "div_f30aea2c534f4cfe87f4315531cef8ef",
    start: 1,
    games: 3,
    players: 8,
    fee: '5',
    first: '25',
    second: '10',
    admin: '5',
    fsa: '40',
    sort_order: 1,
  }

  const blankBrkt = {
    id: "brk_5109b54c2cc44ff9a3721de42c80c8c1",
    squad_id: "sqd_7116ce5f80164830830a7157eb093396",
    div_id: "div_f30aea2c534f4cfe87f4315531cef8ef",
  }

  describe('PUT by ID - API: /api/brkts/:id', () => {

    const testBrkt: brktType = {
      ...initBrkt,
      id: "brk_5109b54c2cc44ff9a3721de42c80c8c1",
      squad_id: "sqd_7116ce5f80164830830a7157eb093396",
      div_id: "div_f30aea2c534f4cfe87f4315531cef8ef",
      start: 1,
      games: 3,
      players: 8,
      fee: '5',
      first: '25',
      second: '10',
      admin: '5',
      fsa: '40',
      sort_order: 1,
    }

    const blankBrkt = {
      id: "brk_5109b54c2cc44ff9a3721de42c80c8c1",
      squad_id: "sqd_7116ce5f80164830830a7157eb093396",
      div_id: "div_f30aea2c534f4cfe87f4315531cef8ef",
    }

    describe('PUT by ID - API: /api/brkts/:id', () => {

      const putBrkt = {
        ...testBrkt,
        squad_id: 'sqd_3397da1adc014cf58c44e07c19914f72',
        div_id: 'div_29b9225d8dd44a4eae276f8bde855729',
        fee: '3',
        first: '15',
        second: '6',
        admin: '3',
        fsa: '24',
        sort_order: 1,
      }

      const sampleBrkt = {
        ...initBrkt,
        id: '',
        squad_id: 'sqd_3397da1adc014cf58c44e07c19914f72',
        div_id: 'div_29b9225d8dd44a4eae276f8bde855729',
        fee: '10',
        first: '50',
        second: '20',
        admin: '10',
        fsa: '80',
        sort_order: 11,
      }

      beforeAll(async () => {
        // make sure test div is reset in database
        const brktJSON = JSON.stringify(testBrkt);
        const putResponse = await axios({
          method: "put",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + testBrkt.id,
        })
      })

      afterEach(async () => {
        try {
          const brktJSON = JSON.stringify(testBrkt);
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
        } catch (err) {
          if (err instanceof AxiosError) console.log(err.message);
        }
      })

      it('should update brkt by ID', async () => {
        const brktJSON = JSON.stringify(putBrkt);
        const putResponse = await axios({
          method: "put",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + testBrkt.id,
        })
        expect(putResponse.status).toBe(200);
        const brkt = putResponse.data.brkt;
        // do not update squad_id or div_id
        expect(brkt.squad_id).toEqual(testBrkt.squad_id);
        expect(brkt.div_id).toEqual(testBrkt.div_id);
        // all other fields should be updated
        expect(brkt.start).toBe(testBrkt.start);
        expect(brkt.games).toBe(testBrkt.games);
        expect(brkt.players).toBe(putBrkt.players);
        expect(brkt.fee).toBe(putBrkt.fee);
        expect(brkt.first).toBe(putBrkt.first);
        expect(brkt.second).toBe(putBrkt.second);
        expect(brkt.admin).toBe(putBrkt.admin);
        expect(brkt.fsa).toBe(putBrkt.fsa);
        expect(brkt.sort_order).toBe(putBrkt.sort_order);
      })
      it('should NOT update brkt by ID when ID is invalid', async () => {
        try {
          const brktJSON = JSON.stringify(putBrkt);
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + 'test',
          })
          expect(putResponse.status).toBe(404);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(404);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when ID is valid, but not a brkt ID', async () => {
        try {
          const brktJSON = JSON.stringify(putBrkt);
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + nonBrktId,
          })
          expect(putResponse.status).toBe(404);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(404);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when ID is not found', async () => {
        try {
          const brktJSON = JSON.stringify(putBrkt);
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + notFoundId,
          })
          expect(putResponse.status).toBe(404);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(404);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when start is null', async () => {
        const invalidBrkt = {
          ...putBrkt,
          start: null as any
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when games is null', async () => {
        const invalidBrkt = {
          ...putBrkt,
          games: null as any
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when players is null', async () => {
        const invalidBrkt = {
          ...putBrkt,
          players: null as any
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when fee is blank', async () => {
        const invalidBrkt = {
          ...putBrkt,
          fee: ""
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when first is blank', async () => {
        const invalidBrkt = {
          ...putBrkt,
          first: ""
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when second is blank', async () => {
        const invalidBrkt = {
          ...putBrkt,
          second: ''
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when admin is blank', async () => {
        const invalidBrkt = {
          ...putBrkt,
          admin: ''
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when fsa is blank', async () => {
        const invalidBrkt = {
          ...putBrkt,
          fsa: ''
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when sort_order is null', async () => {
        const invalidBrkt = {
          ...putBrkt,
          sort_order: null as any
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when start is too low', async () => {
        const invalidBrkt = {
          ...putBrkt,
          start: 0
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when start is too high', async () => {
        const invalidBrkt = {
          ...putBrkt,
          start: 100
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when start is not an integer', async () => {
        const invalidBrkt = {
          ...putBrkt,
          start: 1.5
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when start is not a number', async () => {
        const invalidBrkt = {
          ...putBrkt,
          start: 'abc' as any
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when games is too low', async () => {
        const invalidBrkt = {
          ...putBrkt,
          games: 0
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when games is too high', async () => {
        const invalidBrkt = {
          ...putBrkt,
          games: 100
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when games is not an integer', async () => {
        const invalidBrkt = {
          ...putBrkt,
          games: 1.5
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when games is not a number', async () => {
        const invalidBrkt = {
          ...putBrkt,
          games: 'abc' as any
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when players is too low', async () => {
        const invalidBrkt = {
          ...putBrkt,
          players: 0
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when players is too high', async () => {
        const invalidBrkt = {
          ...putBrkt,
          players: 100
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when players is not an integer', async () => {
        const invalidBrkt = {
          ...putBrkt,
          players: 1.5
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when players is not a number', async () => {
        const invalidBrkt = {
          ...putBrkt,
          players: 'abc' as any
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when fee is too low', async () => {
        const invalidBrkt = {
          ...putBrkt,
          fee: '0'
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when fee is too high', async () => {
        const invalidBrkt = {
          ...putBrkt,
          fee: '123456789'
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when fee is not a number', async () => {
        const invalidBrkt = {
          ...putBrkt,
          fee: 'abc'
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when first is too low', async () => {
        const invalidBrkt = {
          ...putBrkt,
          first: '0'
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when first is too high', async () => {
        const invalidBrkt = {
          ...putBrkt,
          first: '123456789'
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when first is not a number', async () => {
        const invalidBrkt = {
          ...putBrkt,
          first: 'abc'
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when second is too low', async () => {
        const invalidBrkt = {
          ...putBrkt,
          second: '0'
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when second is too high', async () => {
        const invalidBrkt = {
          ...putBrkt,
          second: '123456789'
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when second is not a number', async () => {
        const invalidBrkt = {
          ...putBrkt,
          second: 'abc'
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when admin is too low', async () => {
        const invalidBrkt = {
          ...putBrkt,
          admin: '0'
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when admin is too high', async () => {
        const invalidBrkt = {
          ...putBrkt,
          admin: '123456789'
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when admin is not a number', async () => {
        const invalidBrkt = {
          ...putBrkt,
          admin: 'abc'
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when fsa is too low', async () => {
        const invalidBrkt = {
          ...putBrkt,
          fsa: '0'
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when fsa is too high', async () => {
        const invalidBrkt = {
          ...putBrkt,
          fsa: '123456789'
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when fsa is not a number', async () => {
        const invalidBrkt = {
          ...putBrkt,
          fsa: 'abc'
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when sort_order is too low', async () => {
        const invalidBrkt = {
          ...putBrkt,
          sort_order: 0
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when sort_order is too high', async () => {
        const invalidBrkt = {
          ...putBrkt,
          sort_order: 1234567
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when sort_order is not an integer', async () => {
        const invalidBrkt = {
          ...putBrkt,
          sort_order: 1.5
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should NOT update brkt by ID when sort_order is not a number', async () => {
        const invalidBrkt = {
          ...putBrkt,
          sort_order: 'abc' as any
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const putResponse = await axios({
            method: "put",
            data: brktJSON,
            withCredentials: true,
            url: url + "/" + testBrkt.id,
          })
          expect(putResponse.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('it should NOT update brkt by ID when (fee * players) !== fsa', async () => {
        const invalidBrkt: brktType = {
          ...initBrkt,
          fee: '3',
          fsa: '25'
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const response = await axios({
            method: "put",
            withCredentials: true,
            url: url + "/" + testBrkt.id,
            data: brktJSON
          })
          expect(response.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('it should NOT upadte a brkt by ID when (fee * players) !== first + second + admin', async () => {
        const invalidBrkt: brktType = {
          ...initBrkt,
          fee: '3',
          first: '15',
          second: '6',
          admin: '4'
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const response = await axios({
            method: "put",
            withCredentials: true,
            url: url + "/" + testBrkt.id,
            data: brktJSON
          })
          expect(response.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('it should NOT update a brkt by ID when div_id + start is not unique', async () => {
        const invalidBrkt: brktType = {
          ...initBrkt,
          squad_id: squad2Id,
          div_id: div2Id,
          start: 1
        }
        const brktJSON = JSON.stringify(invalidBrkt);
        try {
          const response = await axios({
            method: "put",
            withCredentials: true,
            url: url + "/" + testBrkt.id,
            data: brktJSON
          })
          expect(response.status).toBe(422);
        } catch (err) {
          if (err instanceof AxiosError) {
            expect(err.response?.status).toBe(422);
          } else {
            expect(true).toBeFalsy();
          }
        }
      })
      it('should update a brkt BY ID with sanitzed data', async () => {
        const toSanitizeBrkt: brktType = {
          ...testBrkt,
          fee: '3.001',
          first: '15.002',
          second: '6.003',
          admin: '3.004',
          fsa: '24.001',
        }
        const brktJSON = JSON.stringify(toSanitizeBrkt);
        const response = await axios({
          method: "put",
          withCredentials: true,
          url: url + "/" + testBrkt.id,
          data: brktJSON
        })
        expect(response.status).toBe(200);
        const brkt = response.data.brkt;
        expect(brkt.squad_id).toBe(testBrkt.squad_id);
        expect(brkt.div_id).toBe(testBrkt.div_id);
        expect(brkt.fee).toBe('3');
        expect(brkt.first).toBe('15');
        expect(brkt.second).toBe('6');
        expect(brkt.admin).toBe('3');
      })
    })

  });

  describe('PATCH by ID - API: /api/brkts/:id', () => {

    beforeAll(async () => {
      // make sure test brkt is reset in database
      const brktJSON = JSON.stringify(testBrkt);
      const putResponse = await axios({
        method: "put",
        data: brktJSON,
        withCredentials: true,
        url: url + "/" + testBrkt.id,
      })
    })
      
    afterEach(async () => {
      try {
        const brktJSON = JSON.stringify(testBrkt);
        const putResponse = await axios({
          method: "put",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + testBrkt.id,
        })
      } catch (err) {
        if (err instanceof AxiosError) console.log(err.message);
      }
    })

    it('should patch start for a brkt by ID', async () => {
      const patchBrkt = {
        ...blankBrkt,
        start: 2,
      }
      const brktJSON = JSON.stringify(patchBrkt);
      const response = await axios({
        method: "patch",
        data: brktJSON,
        withCredentials: true,
        url: url + "/" + patchBrkt.id,
      })
      expect(response.status).toBe(200);
      const patchedBrkt = response.data.brkt;
      expect(patchedBrkt.start).toBe(patchBrkt.start);
    })
    // games = 3, players = 8 no patch testing for games or players
    // no patching for fsa
    it('should patch fee, first, second, admin and fsa for a brkt by ID', async () => {
      const patchBrkt = {
        ...blankBrkt,
        fee: '3',
        first: '15',
        second: '6',
        admin: '3',
        fsa: '24',
      }
      const brktJSON = JSON.stringify(patchBrkt);
      const response = await axios({
        method: "patch",
        data: brktJSON,
        withCredentials: true,
        url: url + "/" + patchBrkt.id,
      })
      expect(response.status).toBe(200);
      const patchedBrkt = response.data.brkt;
      expect(patchedBrkt.fee).toBe(patchBrkt.fee);
      expect(patchedBrkt.first).toBe(patchBrkt.first);
      expect(patchedBrkt.second).toBe(patchBrkt.second);
      expect(patchedBrkt.admin).toBe(patchBrkt.admin);
      expect(patchedBrkt.fsa).toBe(patchBrkt.fsa);
    })
    it('should NOT patch brkt by ID when ID is invalid', async () => {
      const patchBrkt = {
        ...blankBrkt,
        id: 'test',
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch brkt by ID when ID is valid, but not a brkt ID', async () => {
      const patchBrkt = {
        ...blankBrkt,
        id: nonBrktId,
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch brkt by ID when ID is not found', async () => {
      const patchBrkt = {
        ...blankBrkt,
        id: notFoundId,
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when start is null', async () => {
      const patchBrkt = {
        ...blankBrkt,
        start: null,
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when games is null', async () => {
      const patchBrkt = {
        ...blankBrkt,
        games: null,
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when players is null', async () => {
      const patchBrkt = {
        ...blankBrkt,
        players: null,
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when fee is blank', async () => {
      const patchBrkt = {
        ...blankBrkt,
        fee: "",
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when first is blank', async () => {
      const patchBrkt = {
        ...blankBrkt,
        first: "",
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when second is blank', async () => {
      const patchBrkt = {
        ...blankBrkt,
        second: "",
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when admin is blank', async () => {
      const patchBrkt = {
        ...blankBrkt,
        admin: "",
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when sort_order is null', async () => {
      const patchBrkt = {
        ...blankBrkt,
        sort_order: null,
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when start is too low', async () => {
      const patchBrkt = {
        ...blankBrkt,
        start: 0,
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when start is too high', async () => {
      const patchBrkt = {
        ...blankBrkt,
        start: 100,
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when start is not an integer', async () => {
      const patchBrkt = {
        ...blankBrkt,
        start: 1.5,
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when start is not a number', async () => {
      const patchBrkt = {
        ...blankBrkt,
        start: 'abc',
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when games is too low', async () => {
      const patchBrkt = {
        ...blankBrkt,
        games: 0,
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when games is too high', async () => {
      const patchBrkt = {
        ...blankBrkt,
        games: 100,
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when games is not an integer', async () => {
      const patchBrkt = {
        ...blankBrkt,
        games: 1.5,
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when games is not a number', async () => {
      const patchBrkt = {
        ...blankBrkt,
        games: 'abc',
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when players is too low', async () => {
      const patchBrkt = {
        ...blankBrkt,
        players: 0,
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when players is too high', async () => {
      const patchBrkt = {
        ...blankBrkt,
        players: 100,
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when players is not an integer', async () => {
      const patchBrkt = {
        ...blankBrkt,
        players: 1.5,
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when players is not a number', async () => {
      const patchBrkt = {
        ...blankBrkt,
        players: 'abc',
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when fee is too low', async () => {
      const patchBrkt = {
        ...blankBrkt,
        fee: '0',
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when fee is too high', async () => {
      const patchBrkt = {
        ...blankBrkt,
        fee: '1234567',
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when fee is not a number', async () => {
      const patchBrkt = {
        ...blankBrkt,
        fee: 'abc',
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when first is too low', async () => {
      const patchBrkt = {
        ...blankBrkt,
        first: '0',
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when first is too high', async () => {
      const patchBrkt = {
        ...blankBrkt,
        first: '1234567',
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when first is not a number', async () => {
      const patchBrkt = {
        ...blankBrkt,
        first: 'abc',
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when second is too low', async () => {
      const patchBrkt = {
        ...blankBrkt,
        second: '0',
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when second is too high', async () => {
      const patchBrkt = {
        ...blankBrkt,
        second: '1234567',
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when second is not a number', async () => {
      const patchBrkt = {
        ...blankBrkt,
        second: 'abc',
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when admin is too low', async () => {
      const patchBrkt = {
        ...blankBrkt,
        admin: '0',
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when admin is too high', async () => {
      const patchBrkt = {
        ...blankBrkt,
        admin: '1234567',
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when admin is not a number', async () => {
      const patchBrkt = {
        ...blankBrkt,
        admin: 'abc',
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when sort_order is too low', async () => {
      const patchBrkt = {
        ...blankBrkt,
        sort_order: 0,
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when sort_order is too high', async () => {
      const patchBrkt = {
        ...blankBrkt,
        sort_order: 1234567,
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when sort_order is not an integer', async () => {
      const patchBrkt = {
        ...blankBrkt,
        sort_order: 1.5,
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch a brkt when sort_order is not a number', async () => {
      const patchBrkt = {
        ...blankBrkt,
        sort_order: 'abc',
      }
      const brktJSON = JSON.stringify(patchBrkt);
      try {
        const response = await axios({
          method: "patch",
          data: brktJSON,
          withCredentials: true,
          url: url + "/" + patchBrkt.id,
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('it should NOT patch a brkt by ID when div_id + start is not unique', async () => {
      const invalidBrkt: brktType = {
        ...initBrkt,
        squad_id: squad2Id,
        div_id: div2Id,
        start: 1
      }
      const brktJSON = JSON.stringify(invalidBrkt);
      try {
        const response = await axios({
          method: "patch",
          withCredentials: true,
          url: url + "/" + testBrkt.id,
          data: brktJSON
        })
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should patch a brkt BY ID with sanitzed data', async () => {
      const toSanitizeBrkt: brktType = {
        ...testBrkt,
        fee: '3.001',
        first: '15.002',
        second: '6.003',
        admin: '3.004',
        fsa: '24.001',
      }
      const brktJSON = JSON.stringify(toSanitizeBrkt);
      const response = await axios({
        method: "patch",
        withCredentials: true,
        url: url + "/" + testBrkt.id,
        data: brktJSON
      })
      expect(response.status).toBe(200);
      const brkt = response.data.brkt;
      expect(brkt.squad_id).toBe(testBrkt.squad_id);
      expect(brkt.div_id).toBe(testBrkt.div_id);
      expect(brkt.fee).toBe('3');
      expect(brkt.first).toBe('15');
      expect(brkt.second).toBe('6');
      expect(brkt.admin).toBe('3');
    })
    
  });

  describe('DELETE by ID - API: /api/brkts/:id', () => { 

    const toDelBrkt = {
      ...initBrkt,
      id: "brk_400737cab3584ab7a59b7a4411da4474",
      squad_id: "sqd_1a6c885ee19a49489960389193e8f819",
      div_id: "div_1f42042f9ef24029a0a2d48cc276a087",
      start: 2,
      games: 3,
      players: 8,
      fee: '5',
      first: '25',
      second: '10',
      admin: '5',
      fsa: '40',
      sort_order: 3,
    }

    let didDel = false

    beforeEach(() => {
      didDel = false;
    })

    afterEach(async () => {
      if (!didDel) return;
      try {
        const restoredDiv = {
          ...toDelBrkt,
          id: postSecret + 'brk_400737cab3584ab7a59b7a4411da4474',
        }
        const brktJSON = JSON.stringify(restoredDiv);
        const response = await axios({
          method: 'post',
          data: brktJSON,
          withCredentials: true,
          url: url
        })
        console.log('response.status: ', response.status)
      } catch (err) {
        if (err instanceof Error) console.log(err.message);
      }
    })
    it('should delete a brkt by ID', async () => {
      try {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + toDelBrkt.id,
        })  
        didDel = true;
        expect(delResponse.status).toBe(200);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(200);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT delete a brkt by ID when ID is invalid', async () => { 
      try {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + 'test',
        })  
        expect(delResponse.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT delete a brkt by ID when ID is not found', async () => { 
      try {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + notFoundId,
        })  
        expect(delResponse.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT delete a brkt by ID when ID is valid, but not an brkt id', async () => { 
      try {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + nonBrktId
        })  
        expect(delResponse.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    // it('should NOT delete a brkt by ID when brkt has child rows', async () => { 
    //   try {
    //     const delResponse = await axios({
    //       method: "delete",
    //       withCredentials: true,
    //       url: url + "/" + testBrkt.id
    //     })  
    //     expect(delResponse.status).toBe(409);
    //   } catch (err) {
    //     if (err instanceof AxiosError) {
    //       expect(err.response?.status).toBe(409);
    //     } else {
    //       expect(true).toBeFalsy();
    //     }
    //   }
    // })



  })
  
});