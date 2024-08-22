import axios, { AxiosError } from "axios";
import { baseElimsApi } from "@/db/apiPaths";
import { testBaseElimsApi } from "../../../testApi";
import { elimType } from "@/lib/types/types";
import { initElim } from "@/db/initVals";
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

const url = testBaseElimsApi.startsWith("undefined")
  ? baseElimsApi
  : testBaseElimsApi;   

  const notFoundId = "elm_01234567890123456789012345678901";
  const nonElimId = "usr_01234567890123456789012345678901";
  
  const elim3Id = 'elm_b4c3939adca140898b1912b75b3725f8'
  
  const div2Id = 'div_1f42042f9ef24029a0a2d48cc276a087';
  const squad2Id = 'sqd_1a6c885ee19a49489960389193e8f819';
  
describe('Elims - API: /api/elims', () => {

  const testElim: elimType = {
    ...initElim,
    id: "elm_45d884582e7042bb95b4818ccdd9974c",
    squad_id: "sqd_7116ce5f80164830830a7157eb093396",
    div_id: "div_f30aea2c534f4cfe87f4315531cef8ef",
    start: 1,
    games: 3,
    fee: '5',
    sort_order: 1,
  }
  
  const blankElim = {
    id: "elm_45d884582e7042bb95b4818ccdd9974c",
    squad_id: "sqd_7116ce5f80164830830a7157eb093396",
    div_id: "div_f30aea2c534f4cfe87f4315531cef8ef",
  }

  describe('GET', () => { 

    beforeAll(async () => {
      // if row left over from post test, then delete it
      const response = await axios.get(url);
      const elims = response.data.elims;
      const toDel = elims.find((e: elimType) => e.fee === '13');
      if (toDel) {
        try {
          const delResponse = await axios({
            method: "delete",
            withCredentials: true,
            url: url + "/" + toDel.id
          });
        } catch (err) {
          if (err instanceof AxiosError) console.log(err.message);
        }
      }
    })

    it('should get all elims', async () => { 
      const response = await axios.get(url);
      expect(response.status).toBe(200);
      // 5 rows in prisma/seed.ts
      expect(response.data.elims).toHaveLength(5);
    })

  })

  describe('GET elims for squad API: /api/elims/squad/:id', () => { 

    beforeAll(async () => {
      // if row left over from post test, then delete it
      const response = await axios.get(url);
      const elims = response.data.elims;
      const toDel = elims.find((e: elimType) => e.fee === '13');
      if (toDel) {
        try {
          const delResponse = await axios({
            method: "delete",
            withCredentials: true,
            url: url + "/" + toDel.id
          });
        } catch (err) {
          if (err instanceof AxiosError) console.log(err.message);
        }
      }
    })

    it('should get all elims for squad', async () => { 
      // const values taken from prisma/seed.ts
      const multiElimSquadId = "sqd_7116ce5f80164830830a7157eb093396";
      const squadElimId1 = 'elm_45d884582e7042bb95b4818ccdd9974c';
      const squadElimId2 = 'elm_9d01015272b54962a375cf3c91007a12';

      const multiElimUrl = url + "/squad/" + multiElimSquadId;
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: multiElimUrl
      })

      expect(response.status).toBe(200);
      // 2 rows for squad in prisma/seed.ts
      expect(response.data.elims).toHaveLength(2);
      const elims: elimType[] = response.data.elims;
      // query in /api/pots/squad/ GET sorts by sort_order
      expect(elims[0].id).toBe(squadElimId1);
      expect(elims[1].id).toBe(squadElimId2);
    })

  })

  describe('GET elims for div API: /api/elims/div/:id', () => { 

    beforeAll(async () => {
      // if row left over from post test, then delete it
      const response = await axios.get(url);
      const elims = response.data.elims;
      const toDel = elims.find((e: elimType) => e.fee === '13');
      if (toDel) {
        try {
          const delResponse = await axios({
            method: "delete",
            withCredentials: true,
            url: url + "/" + toDel.id
          });
        } catch (err) {
          if (err instanceof AxiosError) console.log(err.message);
        }
      }
    })

    it('should get all elims for div', async () => { 
      // const values taken from prisma/seed.ts
      const multiElimDivId = "div_f30aea2c534f4cfe87f4315531cef8ef";
      const divElimId1 = 'elm_45d884582e7042bb95b4818ccdd9974c';
      const divElimId2 = 'elm_9d01015272b54962a375cf3c91007a12';

      const multiElimUrl = url + "/div/" + multiElimDivId;
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: multiElimUrl
      })

      expect(response.status).toBe(200);
      // 2 rows for squad in prisma/seed.ts
      expect(response.data.elims).toHaveLength(2);
      const elims: elimType[] = response.data.elims;
      // query in /api/pots/div/ GET sorts by sort_order
      expect(elims[0].id).toBe(divElimId1);
      expect(elims[1].id).toBe(divElimId2);
    })

  })

  describe('POST', () => { 

    const elimToPost: elimType = {
      ...initElim,
      id: "",
      squad_id: "sqd_3397da1adc014cf58c44e07c19914f72",
      div_id: 'div_66d39a83d7a84a8c85d28d8d1b2c7a90',
      start: 1,
      games: 3,
      fee: '13',
      sort_order: 1,
    }
  
    let createdElimId = "";

    beforeAll(async () => {
      const response = await axios.get(url);
      const elims = response.data.elims;
      const toDel = elims.find((e: elimType) => e.fee === '13');
      if (toDel) {
        try {
          const delResponse = await axios({
            method: "delete",
            withCredentials: true,
            url: url + "/" + toDel.id
          });
        } catch (err) {
          if (err instanceof AxiosError) console.log(err.message);
        }
      }
    })

    beforeEach(() => {
      createdElimId = '';
    })

    afterEach(async () => {
      if (createdElimId) {
        try {
          const delResponse = await axios({
            method: "delete",
            withCredentials: true,
            url: url + "/" + createdElimId
          });
        } catch (err) {
          if (err instanceof AxiosError) console.log(err.message);
        }
      }
    })

    it('should create a new elim', async () => { 
      const elimJSON = JSON.stringify(elimToPost);
      const response = await axios({
        method: "post",
        data: elimJSON,
        withCredentials: true,
        url: url
      })
      expect(response.status).toBe(201);
      const postedElim = response.data.elim;
      createdElimId = postedElim.id;      
      expect(postedElim.squad_id).toBe(elimToPost.squad_id);
      expect(postedElim.div_id).toBe(elimToPost.div_id);
      expect(postedElim.start).toBe(elimToPost.start);
      expect(postedElim.games).toBe(elimToPost.games);
      expect(postedElim.fee).toBe(elimToPost.fee);
      expect(postedElim.sort_order).toBe(elimToPost.sort_order);
      expect(isValidBtDbId(postedElim.id, 'elm')).toBeTruthy();
    })
    it('should create a new elim with the provided elim id', async () => { 
      const supIdElim = {
        ...elimToPost,
        id: postSecret + notFoundId, // use valid ID
      }
      const elimJSON = JSON.stringify(supIdElim);
      const response = await axios({
        method: "post",
        data: elimJSON,
        withCredentials: true,
        url: url
      })
      expect(response.status).toBe(201);
      const postedElim = response.data.elim;
      createdElimId = postedElim.id;      
      expect(postedElim.id).toBe(notFoundId);
    })
    it('should NOT create a new elim when squad_id is blank', async () => { 
      const invalidElim = {
        ...elimToPost,
        squad_id: '',
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "post",
          data: elimJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new elim when div_id is blank', async () => { 
      const invalidElim = {
        ...elimToPost,
        div_id: '',
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "post",
          data: elimJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new elim when start is null', async () => { 
      const invalidElim = {
        ...elimToPost,
        start: null,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "post",
          data: elimJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new elim when games is null', async () => { 
      const invalidElim = {
        ...elimToPost,
        games: null,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "post",
          data: elimJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new elim when fee is blank', async () => { 
      const invalidElim = {
        ...elimToPost,
        fee: '',
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "post",
          data: elimJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new elim when sort_order is null', async () => { 
      const invalidElim = {
        ...elimToPost,
        sort_order: null,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "post",
          data: elimJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new elim when squad_id is not a valid squad id', async () => { 
      const invalidElim = {
        ...elimToPost,
        squad_id: notFoundId, // a valid elim id, not a squad id
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "post",
          data: elimJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create a new elim when div_id is not a valid div id', async () => { 
      const invalidElim = {
        ...elimToPost,
        div_id: notFoundId, // a valid elim id, not a div id
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "post",
          data: elimJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create new elim when start is too low', async () => {
      const invalidElim = {
        ...elimToPost,
        start: 0,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "post",
          data: elimJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create new elim when start is too high', async () => {
      const invalidElim = {
        ...elimToPost,
        start: 100,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "post",
          data: elimJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create new elim when start is not an integer', async () => {
      const invalidElim = {
        ...elimToPost,
        start: 1.5,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "post",
          data: elimJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create new elim when start is not a number', async () => {
      const invalidElim = {
        ...elimToPost,
        start: 'abc',
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "post",
          data: elimJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create new elim when games is too low', async () => {
      const invalidElim = {
        ...elimToPost,
        games: 0,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "post",
          data: elimJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create new elim when games is too high', async () => {
      const invalidElim = {
        ...elimToPost,
        games: 100,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "post",
          data: elimJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create new elim when games is not an integer', async () => {
      const invalidElim = {
        ...elimToPost,
        games: 1.5,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "post",
          data: elimJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create new elim when games is not a number', async () => {
      const invalidElim = {
        ...elimToPost,
        games: 'abc',
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "post",
          data: elimJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create new elim when fee is too low', async () => {
      const invalidElim = {
        ...elimToPost,
        fee: '0',
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "post",
          data: elimJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create new elim when fee is too high', async () => {
      const invalidElim = {
        ...elimToPost,
        fee: '1234567',
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "post",
          data: elimJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create new elim when fee is not a number', async () => {
      const invalidElim = {
        ...elimToPost,
        fee: 'abc',
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "post",
          data: elimJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create new elim when sort_order is too low', async () => {
      const invalidElim = {
        ...elimToPost,
        sort_order: 0,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "post",
          data: elimJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create new elim when sort_order is too high', async () => {
      const invalidElim = {
        ...elimToPost,
        sort_order: 1234567,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "post",
          data: elimJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create new elim when sort_order is not an integer', async () => {
      const invalidElim = {
        ...elimToPost,
        sort_order: 1.5,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "post",
          data: elimJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create new elim when sort_order is not a number', async () => {
      const invalidElim = {
        ...elimToPost,
        sort_order: 'abc',
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "post",
          data: elimJSON,
          withCredentials: true,
          url: url
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
    it('should NOT create new pot when div_id + pot_type is not unique', async () => {
      const invalidElim = {
        ...elimToPost,        
        div_id: testElim.div_id,
        start: testElim.start,
        games: testElim.games,        
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "post",
          data: elimJSON,
          withCredentials: true,
          url: url
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
    it('should create new elim with sanitzied values', async () => { 
      const toSanitizeElim = {
        ...elimToPost,        
        fee: '5.460',
      }
      const elimJSON = JSON.stringify(toSanitizeElim);
      const response = await axios({
        method: "post",
        data: elimJSON,
        withCredentials: true,
        url: url
      })
      expect(response.status).toBe(201);      
      const createdElim = response.data.elim;
      createdElimId = createdElim.id;
      expect(createdElim.fee).toBe('5.46');
    })

  })

  describe('GET by ID - API: /api/elim/:id', () => { 

    it('should get elim by ID', async () => {
      const response = await axios.get(url + "/" + testElim.id);
      expect(response.status).toBe(200);
      const elim = response.data.elim;
      expect(elim.id).toBe(testElim.id);
      expect(elim.squad_id).toBe(testElim.squad_id);
      expect(elim.div_id).toBe(testElim.div_id);
      expect(elim.start).toBe(testElim.start);  
      expect(elim.games).toBe(testElim.games);
      expect(elim.fee).toBe(testElim.fee);
      expect(elim.sort_order).toBe(testElim.sort_order);
    })
    it('should NOT get elim by ID when ID is invalid', async () => {
      try {
        const response = await axios.get(url + "/" + "invalid");
        expect(response.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT get elim by ID when ID is not found', async () => {
      try {
        const response = await axios.get(url + "/" + notFoundId);
        expect(response.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT get elim by ID when ID is valid, but not an elim ID', async () => { 
      try {
        const response = await axios.get(url + "/" + nonElimId);
        expect(response.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })

  })

  describe('PUT by ID - API: /api/elim/:id', () => { 

    const putElim = {
      ...testElim,
      squad_id: 'sqd_3397da1adc014cf58c44e07c19914f72',
      div_id: 'div_29b9225d8dd44a4eae276f8bde855729',
      start: 2,
      games: 4,
      fee: '13',
      sort_order: 11,
    }

    beforeAll(async () => {
      // make sure test div is reset in database
      const elimJSON = JSON.stringify(testElim);
      const putResponse = await axios({
        method: "put",
        data: elimJSON,
        withCredentials: true,
        url: url + "/" + testElim.id,
      })
    })

    afterEach(async () => {
      try {
        const elimJSON = JSON.stringify(testElim);
        const putResponse = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + testElim.id,
        })
      } catch (err) {
        if (err instanceof AxiosError) console.log(err.message);
      }
    })
    
    it('should update a elim by ID', async () => { 
      const elimJSON = JSON.stringify(putElim);
      const response = await axios({
        method: "put",
        data: elimJSON,
        withCredentials: true,
        url: url + "/" + testElim.id,
      })
      expect(response.status).toBe(200);
      const elim = response.data.elim;
      // did not update squad_id or div_id
      expect(elim.squad_id).toBe(testElim.squad_id);
      expect(elim.div_id).toBe(testElim.div_id);
      // all other fields updated
      expect(elim.start).toBe(putElim.start);
      expect(elim.games).toBe(putElim.games);
      expect(elim.fee).toBe(putElim.fee);
      expect(elim.sort_order).toBe(putElim.sort_order);
    })
    it('should NOT update elim by ID when ID is invalid', async () => {
      try {
        const elimJSON = JSON.stringify(putElim);
        const response = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + "test",
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
    it('should NOT update elim by ID when ID is valid, but not an elim ID', async () => { 
      try {
        const elimJSON = JSON.stringify(putElim);
        const response = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + nonElimId,
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
    it('should NOT update elim by ID when ID is not found', async () => { 
      try {
        const elimJSON = JSON.stringify(putElim);
        const response = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + notFoundId,
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
    it('should NOT update elim by ID when squad_id is blank', async () => { 
      const invalidElim = {
        ...putElim,
        squad_id: '',
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + testElim.id,
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
    it('should NOT update elim by ID when div_id is blank', async () => { 
      const invalidElim = {
        ...putElim,
        div_id: '',
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + testElim.id,
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
    it('should NOT update elim by ID when start is null', async () => { 
      const invalidElim = {
        ...putElim,
        start: null,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + testElim.id,
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
    it('should NOT update elim by ID when games is null', async () => { 
      const invalidElim = {
        ...putElim,
        games: null,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + testElim.id,
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
    it('should NOT update elim by ID when fee is blank', async () => { 
      const invalidElim = {
        ...putElim,
        fee: '',
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + testElim.id,
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
    it('should NOT update elim by ID when sort_order is null', async () => { 
      const invalidElim = {
        ...putElim,
        sort_order: null,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + testElim.id,
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
    it('should NOT update elim by ID when start is too low', async () => { 
      const invalidElim = {
        ...putElim,
        start: 0,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + testElim.id,
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
    it('should NOT update elim by ID when start is too high', async () => { 
      const invalidElim = {
        ...putElim,
        start: 100,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + testElim.id,
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
    it('should NOT update elim by ID when start is not an integer', async () => { 
      const invalidElim = {
        ...putElim,
        start: 1.5,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + testElim.id,
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
    it('should NOT update elim by ID when start is not a number', async () => { 
      const invalidElim = {
        ...putElim,
        start: 'abc' as any,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + testElim.id,
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
    it('should NOT update elim by ID when games is too low', async () => { 
      const invalidElim = {
        ...putElim,
        games: 0,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + testElim.id,
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
    it('should NOT update elim by ID when games is too high', async () => { 
      const invalidElim = {
        ...putElim,
        games: 100,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + testElim.id,
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
    it('should NOT update elim by ID when games is not an integer', async () => { 
      const invalidElim = {
        ...putElim,
        games: 1.5,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + testElim.id,
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
    it('should NOT update elim by ID when games is not a number', async () => { 
      const invalidElim = {
        ...putElim,
        games: 'abc' as any,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + testElim.id,
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
    it('should NOT update elim by ID when fee is too low', async () => { 
      const invalidElim = {
        ...putElim,
        fee: '0',
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + testElim.id,
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
    it('should NOT update elim by ID when fee is too high', async () => { 
      const invalidElim = {
        ...putElim,
        fee: '1234567',
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + testElim.id,
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
    it('should NOT update elim by ID when fee is not a number', async () => { 
      const invalidElim = {
        ...putElim,
        fee: 'abc',
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + testElim.id,
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
    it('should NOT update elim by ID when sort_order is too low', async () => { 
      const invalidElim = {
        ...putElim,
        sort_order: 0,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + testElim.id,
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
    it('should NOT update elim by ID when sort_order is too high', async () => { 
      const invalidElim = {
        ...putElim,
        sort_order: 1234567,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + testElim.id,
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
    it('should NOT update elim by ID when sort_order is not an integer', async () => { 
      const invalidElim = {
        ...putElim,
        sort_order: 1.5,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + testElim.id,
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
    it('should NOT update elim by ID when sort_order is not a number', async () => { 
      const invalidElim = {
        ...putElim,
        sort_order: 'abc' as any,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + testElim.id,
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
    it('should NOT update elim by ID when div_id + start + games is not unique', async () => { 
      const invalidElim = {
        ...putElim,
        id: elim3Id,    
        div_id: div2Id,
        start: 4,
        games: 3,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const response = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + testElim.id,
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
    it('should update elom by id with sanitized data', async () => { 
      const toSanitizeElim = {
        ...putElim,
        fee: '5.460',
      }
      const elimJSON = JSON.stringify(toSanitizeElim);
      const putResponse = await axios({
        method: "put",
        data: elimJSON,
        withCredentials: true,
        url: url + "/" + testElim.id,
      })
      expect(putResponse.status).toBe(200);
      const elim = putResponse.data.elim;
      expect(elim.fee).toBe('5.46');
    })

  })

  describe('PATCH by ID - API: /api/elims/:id', () => { 

    beforeAll(async () => {
      // make sure test elim is reset in database
      const elimJSON = JSON.stringify(testElim);
      const putResponse = await axios({
        method: "put",
        data: elimJSON,
        withCredentials: true,
        url: url + "/" + testElim.id,
      })
    })
      
    afterEach(async () => {
      try {
        const elimJSON = JSON.stringify(testElim);
        const putResponse = await axios({
          method: "put",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + testElim.id,
        })
      } catch (err) {
        if (err instanceof AxiosError) console.log(err.message);
      }
    })

    it('should patch start for a elim by id', async () => { 
      const patchElim = {
        ...blankElim,
        start: 2,
      }
      const elimJSON = JSON.stringify(patchElim);
      const patchResponse = await axios({
        method: "patch",
        data: elimJSON,
        withCredentials: true,
        url: url + "/" + testElim.id,
      })
      expect(patchResponse.status).toBe(200);
      const elim = patchResponse.data.elim;
      expect(elim.start).toBe(2);
    })
    it('should patch games for a elim by id', async () => { 
      const patchElim = {
        ...blankElim,
        games: 4,
      }
      const elimJSON = JSON.stringify(patchElim);
      const patchResponse = await axios({
        method: "patch",
        data: elimJSON,
        withCredentials: true,
        url: url + "/" + testElim.id,
      })
      expect(patchResponse.status).toBe(200);
      const elim = patchResponse.data.elim;
      expect(elim.games).toBe(4);
    })
    it('should patch fee for a elim by id', async () => { 
      const patchElim = {
        ...blankElim,
        fee: '13',
      }
      const elimJSON = JSON.stringify(patchElim);
      const patchResponse = await axios({
        method: "patch",
        data: elimJSON,
        withCredentials: true,
        url: url + "/" + testElim.id,
      })
      expect(patchResponse.status).toBe(200);
      const elim = patchResponse.data.elim;
      expect(elim.fee).toBe('13');
    })
    it('should patch sort_order for a elim by id', async () => { 
      const patchElim = {
        ...blankElim,
        sort_order: 12,
      }
      const elimJSON = JSON.stringify(patchElim);
      const patchResponse = await axios({
        method: "patch",
        data: elimJSON,
        withCredentials: true,
        url: url + "/" + testElim.id,
      })
      expect(patchResponse.status).toBe(200);
      const elim = patchResponse.data.elim;
      expect(elim.sort_order).toBe(12);
    })
    it('should NOT patch squad_id for a elim by id', async () => { 
      const patchElim = {
        ...blankElim,
        squad_id: squad2Id,
      }
      const elimJSON = JSON.stringify(patchElim);
      const patchResponse = await axios({
        method: "patch",
        data: elimJSON,
        withCredentials: true,
        url: url + "/" + testElim.id,
      })
      expect(patchResponse.status).toBe(200);
      const elim = patchResponse.data.elim;
      // for squad_id, compare to blackElim.squad_id
      expect(elim.squad_id).toBe(blankElim.squad_id);
    })
    it('should NOT patch div_id for a elim by id', async () => { 
      const patchElim = {
        ...blankElim,
        div_id: div2Id,
      }
      const elimJSON = JSON.stringify(patchElim);
      const patchResponse = await axios({
        method: "patch",
        data: elimJSON,
        withCredentials: true,
        url: url + "/" + testElim.id,
      })
      expect(patchResponse.status).toBe(200);
      const elim = patchResponse.data.elim;
      // for div_id, compare to blackElim.div_id
      expect(elim.div_id).toBe(blankElim.div_id);
    })
    it('should NOT patch an elim when ID is invalid', async () => { 
      const patchElim = {
        ...blankElim,
        fee: '13',
      }
      const elimJSON = JSON.stringify(patchElim);
      try {
        const patchResponse = await axios({
          method: "patch",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + "test",        
        })
        expect(patchResponse.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch an elim when ID is not found', async () => { 
      const patchElim = {
        ...blankElim,
        fee: '13',
      }
      const elimJSON = JSON.stringify(patchElim);
      try {
        const patchResponse = await axios({
          method: "patch",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + notFoundId,        
        })
        expect(patchResponse.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch an elim when ID is valid, but not an elim ID', async () => { 
      const patchElim = {
        ...blankElim,
        fee: '13',
      }
      const elimJSON = JSON.stringify(patchElim);
      try {
        const patchResponse = await axios({
          method: "patch",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + nonElimId,        
        })
        expect(patchResponse.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT patch an elim when start is null', async () => { 
      const patchElim = {
        ...blankElim,
        start: null,
      }
      const elimJSON = JSON.stringify(patchElim);
      try {
        const patchResponse = await axios({
          method: "patch",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + blankElim.id,        
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        } 
      }
    })
    it('should NOT patch an elim when games is null', async () => { 
      const patchElim = {
        ...blankElim,
        games: null,
      }
      const elimJSON = JSON.stringify(patchElim);
      try {
        const patchResponse = await axios({
          method: "patch",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + blankElim.id,        
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        } 
      }
    })
    it('should NOT patch an elim when fee is blank', async () => { 
      const patchElim = {
        ...blankElim,
        fee: '',
      }
      const elimJSON = JSON.stringify(patchElim);
      try {
        const patchResponse = await axios({
          method: "patch",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + blankElim.id,        
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        } 
      }
    })
    it('should NOT patch an sort_order when start is null', async () => { 
      const patchElim = {
        ...blankElim,
        sort_order: null,
      }
      const elimJSON = JSON.stringify(patchElim);
      try {
        const patchResponse = await axios({
          method: "patch",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + blankElim.id,        
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        } 
      }
    })
    it('should NOT patch an elim when start is too low', async () => { 
      const patchElim = {
        ...blankElim,
        start: 0,
      }
      const elimJSON = JSON.stringify(patchElim);
      try {
        const patchResponse = await axios({
          method: "patch",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + blankElim.id,        
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        } 
      }
    })
    it('should NOT patch an elim when start is too high', async () => { 
      const patchElim = {
        ...blankElim,
        start: 100,
      }
      const elimJSON = JSON.stringify(patchElim);
      try {
        const patchResponse = await axios({
          method: "patch",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + blankElim.id,        
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        } 
      }
    })
    it('should NOT patch an elim when start is not an integer', async () => { 
      const patchElim = {
        ...blankElim,
        start: 1.5,
      }
      const elimJSON = JSON.stringify(patchElim);
      try {
        const patchResponse = await axios({
          method: "patch",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + blankElim.id,        
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        } 
      }
    })
    it('should NOT patch an elim when start is not a number', async () => { 
      const patchElim = {
        ...blankElim,
        start: 'abc',
      }
      const elimJSON = JSON.stringify(patchElim);
      try {
        const patchResponse = await axios({
          method: "patch",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + blankElim.id,        
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        } 
      }
    })
    it('should NOT patch an elim when games is too low', async () => { 
      const patchElim = {
        ...blankElim,
        games: 0,
      }
      const elimJSON = JSON.stringify(patchElim);
      try {
        const patchResponse = await axios({
          method: "patch",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + blankElim.id,        
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        } 
      }
    })
    it('should NOT patch an elim when games is too high', async () => { 
      const patchElim = {
        ...blankElim,
        games: 100,
      }
      const elimJSON = JSON.stringify(patchElim);
      try {
        const patchResponse = await axios({
          method: "patch",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + blankElim.id,        
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        } 
      }
    })
    it('should NOT patch an elim when games is not an integer', async () => { 
      const patchElim = {
        ...blankElim,
        games: 1.5,
      }
      const elimJSON = JSON.stringify(patchElim);
      try {
        const patchResponse = await axios({
          method: "patch",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + blankElim.id,        
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        } 
      }
    })
    it('should NOT patch an elim when games is not a number', async () => { 
      const patchElim = {
        ...blankElim,
        games: 'abc',
      }
      const elimJSON = JSON.stringify(patchElim);
      try {
        const patchResponse = await axios({
          method: "patch",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + blankElim.id,        
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        } 
      }
    })
    it('should NOT patch an elim when fee is too low', async () => { 
      const patchElim = {
        ...blankElim,
        fee: '0',
      }
      const elimJSON = JSON.stringify(patchElim);
      try {
        const patchResponse = await axios({
          method: "patch",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + blankElim.id,        
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        } 
      }
    })
    it('should NOT patch an elim when fee is too high', async () => { 
      const patchElim = {
        ...blankElim,
        fee: '1234567',
      }
      const elimJSON = JSON.stringify(patchElim);
      try {
        const patchResponse = await axios({
          method: "patch",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + blankElim.id,        
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        } 
      }
    })
    it('should NOT patch an elim when fee is not a number', async () => { 
      const patchElim = {
        ...blankElim,
        fee: 'abc',
      }
      const elimJSON = JSON.stringify(patchElim);
      try {
        const patchResponse = await axios({
          method: "patch",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + blankElim.id,        
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        } 
      }
    })
    it('should NOT patch an elim when sort_order is too low', async () => { 
      const patchElim = {
        ...blankElim,
        sort_order: 0,
      }
      const elimJSON = JSON.stringify(patchElim);
      try {
        const patchResponse = await axios({
          method: "patch",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + blankElim.id,        
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        } 
      }
    })
    it('should NOT patch an elim when sort_order is too high', async () => { 
      const patchElim = {
        ...blankElim,
        sort_order: 1234567,
      }
      const elimJSON = JSON.stringify(patchElim);
      try {
        const patchResponse = await axios({
          method: "patch",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + blankElim.id,        
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        } 
      }
    })
    it('should NOT patch an elim when sort_order is not an integer', async () => { 
      const patchElim = {
        ...blankElim,
        sort_order: 1.5,
      }
      const elimJSON = JSON.stringify(patchElim);
      try {
        const patchResponse = await axios({
          method: "patch",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + blankElim.id,        
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        } 
      }
    })
    it('should NOT patch an elim when sort_order is not a number', async () => { 
      const patchElim = {
        ...blankElim,
        sort_order: 'abc',
      }
      const elimJSON = JSON.stringify(patchElim);
      try {
        const patchResponse = await axios({
          method: "patch",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + blankElim.id,        
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        } 
      }
    })
    it('should NOT update elim by ID when div_id + start + games is not unique', async () => { 
      const invalidElim = {
        ...blankElim,    
        id: elim3Id,        
        div_id: div2Id,
        start: 4,
        games: 3,
      }
      const elimJSON = JSON.stringify(invalidElim);
      try {
        const patchResponse = await axios({
          method: "patch",
          data: elimJSON,
          withCredentials: true,
          url: url + "/" + testElim.id,
        })
        expect(patchResponse.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should update elom by id with sanitized data', async () => { 
      const toSanitizeElim = {
        ...blankElim,
        fee: '5.460',
      }
      const elimJSON = JSON.stringify(toSanitizeElim);
      const putResponse = await axios({
        method: "patch",
        data: elimJSON,
        withCredentials: true,
        url: url + "/" + testElim.id,
      })
      expect(putResponse.status).toBe(200);
      const elim = putResponse.data.elim;
      expect(elim.fee).toBe('5.46');
    })

  })

  describe('DELETE by ID - API: /api/elim/:id', () => { 

    const toDelElim = {
      ...initElim,
      id: "elm_4c5aad9baa7246c19e07f215561e58c4",
      squad_id: "sqd_1a6c885ee19a49489960389193e8f819",
      div_id: "div_1f42042f9ef24029a0a2d48cc276a087",
      start: 3,
      games: 4,
      fee: '10',
      sort_order: 3,
    }

    let didDel = false

    beforeEach(() => {
      didDel = false;
    })

    afterEach(async () => {
      if (!didDel) return;
      try {
        const restoredElim = {
          ...toDelElim,
          id: postSecret + toDelElim.id,
        }
        const elimJSON = JSON.stringify(restoredElim);
        const response = await axios({
          method: 'post',
          data: elimJSON,
          withCredentials: true,
          url: url
        })
        console.log('response.status: ', response.status)
      } catch (err) {
        if (err instanceof Error) console.log(err.message);
      }
    })

    it('should delete elim by ID', async () => { 
      try {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + toDelElim.id,
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
    it('should NOT delete an elim by ID when ID is invalid', async () => { 
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
    it('should NOT delete an elim by ID when ID is not found', async () => { 
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
    it('should NOT delete an elim by ID when ID is valid, but not an pot id', async () => { 
      try {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + nonElimId
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
    // it('should NOT delete en elim by ID when pot has child rows', async () => { 
    //   try {
    //     const delResponse = await axios({
    //       method: "delete",
    //       withCredentials: true,
    //       url: url + "/" + testElim.id
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

})  