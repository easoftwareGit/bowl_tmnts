import axios, { AxiosError } from "axios";
import { basePotsApi } from "@/db/apiPaths";
import { testBasePotsApi } from "../../../testApi";
import { potType } from "@/lib/types/types";
import { initPot } from "@/db/initVals";
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

const url = testBasePotsApi.startsWith("undefined")
  ? basePotsApi
  : testBasePotsApi;   

const notFoundId = "pot_01234567890123456789012345678901";
const nonPotId = "usr_01234567890123456789012345678901";

const pot3Id = 'pot_ab80213899ea424b938f52a062deacfe'

const div2Id = 'div_1f42042f9ef24029a0a2d48cc276a087';
const squad2Id = 'sqd_1a6c885ee19a49489960389193e8f819';

describe('Pots - API: /api/pots', () => { 

  const testPot: potType = {
    ...initPot,
    id: "pot_b2a7b02d761b4f5ab5438be84f642c3b",
    squad_id: "sqd_7116ce5f80164830830a7157eb093396",
    div_id: "div_f30aea2c534f4cfe87f4315531cef8ef",
    sort_order: 1,
    fee: '20',
    pot_type: "Game",
  }

  const blankPot = {
    id: "pot_b2a7b02d761b4f5ab5438be84f642c3b",
    squad_id: "sqd_7116ce5f80164830830a7157eb093396",
    div_id: "div_f30aea2c534f4cfe87f4315531cef8ef",
  }

  describe('GET', () => { 

    beforeAll(async () => {
      // if row left over from post test, then delete it
      const response = await axios.get(url);
      const pots = response.data.pots;
      const toDel = pots.find((p: potType) => p.fee === '13');
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

    it('should get all pots', async () => { 
      const response = await axios.get(url);
      expect(response.status).toBe(200);
      // 4 rows in prisma/seed.ts
      expect(response.data.pots).toHaveLength(4);
    })

  })

  describe('GET pots for squad API: /api/pots/squad/:id', () => { 

    beforeAll(async () => {
      // if row left over from post test, then delete it
      const response = await axios.get(url);
      const pots = response.data.pots;
      const toDel = pots.find((p: potType) => p.fee === '13');
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

    it('should get all pots for squad', async () => { 
      // const values taken from prisma/seed.ts
      const multiPotSquadId = "sqd_1a6c885ee19a49489960389193e8f819";
      const squadPotId1 = 'pot_98b3a008619b43e493abf17d9f462a65';
      const squadPotId2 = 'pot_ab80213899ea424b938f52a062deacfe';

      const multiPotUrl = url + "/squad/" + multiPotSquadId;
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: multiPotUrl
      })

      expect(response.status).toBe(200);
      // 2 rows for squad in prisma/seed.ts
      expect(response.data.pots).toHaveLength(2);
      const pots: potType[] = response.data.pots;
      // query in /api/pots/squad/ GET sorts by sort_order
      expect(pots[0].id).toBe(squadPotId1);
      expect(pots[1].id).toBe(squadPotId2);
    })

  })

  describe('GET pots for div API: /api/pots/div/:id', () => { 

    beforeAll(async () => {
      // if row left over from post test, then delete it
      const response = await axios.get(url);
      const pots = response.data.pots;
      const toDel = pots.find((p: potType) => p.fee === '13');
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

    it('should get all pots for div', async () => { 
      // const values taken from prisma/seed.ts
      const multiPotDivId = "div_1f42042f9ef24029a0a2d48cc276a087";
      const divPotId1 = 'pot_98b3a008619b43e493abf17d9f462a65';
      const divPotId2 = 'pot_ab80213899ea424b938f52a062deacfe';

      const multiPotUrl = url + "/div/" + multiPotDivId;
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: multiPotUrl
      })

      expect(response.status).toBe(200);
      // 2 rows for squad in prisma/seed.ts
      expect(response.data.pots).toHaveLength(2);
      const pots: potType[] = response.data.pots;
      // query in /api/pots/div/ GET sorts by sort_order
      expect(pots[0].id).toBe(divPotId1);
      expect(pots[1].id).toBe(divPotId2);
    })

  })

  describe('POST', () => { 

    const potToPost: potType = {
      ...initPot,
      id: "",
      squad_id: "sqd_3397da1adc014cf58c44e07c19914f72",
      div_id: 'div_66d39a83d7a84a8c85d28d8d1b2c7a90',
      fee: '13',
      pot_type: "Game",
      sort_order: 1,
    }
  
    let createdPotId = "";

    beforeAll(async () => {
      const response = await axios.get(url);
      const pots = response.data.pots;
      const toDel = pots.find((p: potType) => p.fee === '13');
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
      createdPotId = '';
    })

    afterEach(async () => {
      if (createdPotId) {
        try {
          const delResponse = await axios({
            method: "delete",
            withCredentials: true,
            url: url + "/" + createdPotId
          });
        } catch (err) {
          if (err instanceof AxiosError) console.log(err.message);
        }
      }
    })

    it('should create new pot', async () => {
      const potsJSON = JSON.stringify(potToPost);
      const response = await axios({
        method: "post",
        withCredentials: true,
        url: url,
        data: potsJSON
      })
      expect(response.status).toBe(201);
      const postedPot = response.data.pot;
      createdPotId = response.data.pot.id;
      expect(postedPot.div_id).toBe(potToPost.div_id);
      expect(postedPot.squad_id).toBe(potToPost.squad_id);
      expect(postedPot.fee).toBe(potToPost.fee);
      expect(postedPot.pot_type).toBe(potToPost.pot_type);
      expect(postedPot.sort_order).toBe(potToPost.sort_order);
      expect(isValidBtDbId(postedPot.id, 'pot')).toBeTruthy();
    })
    it('should create a new pot with the provided pot id', async () => {
      const supIdPot = {
        ...potToPost,
        id: postSecret + notFoundId, // use valid ID
      }
      const potJSON = JSON.stringify(supIdPot);
      const response = await axios({
        method: "post",
        withCredentials: true,
        url: url,
        data: potJSON
      })
      expect(response.status).toBe(201);
      const postedPot = response.data.pot;
      createdPotId = response.data.pot.id;
      expect(postedPot.id).toEqual(notFoundId);
    })
    it('should create a new pot with a pot_type of "Last Game"', async () => {
      const lgPot = {
        ...potToPost,
        pot_type: "Last Game",
      }
      const potJSON = JSON.stringify(lgPot);
      const response = await axios({
        method: "post",
        withCredentials: true,
        url: url,
        data: potJSON
      })
      expect(response.status).toBe(201);
      const postedPot = response.data.pot;
      createdPotId = response.data.pot.id;
      expect(postedPot.pot_type).toBe('Last Game');
    })
    it('should create a new pot with a pot_type of "Series"', async () => {
      const seriesPot = {
        ...potToPost,
        pot_type: "Series",
      }
      const potJSON = JSON.stringify(seriesPot);
      const response = await axios({
        method: "post",
        withCredentials: true,
        url: url,
        data: potJSON
      })
      expect(response.status).toBe(201);
      const postedPot = response.data.pot;
      createdPotId = response.data.pot.id;
      expect(postedPot.pot_type).toBe('Series');
    })
    it('should NOT create a new pot when squad_id is blank', async () => {
      const invalidPot = {
        ...potToPost,
        squad_id: "",
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "post",
          data: potJSON,
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
    it('should NOT create a new pot when div_id is blank', async () => {
      const invalidPot = {
        ...potToPost,
        div_id: "",
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "post",
          data: potJSON,
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
    it('should NOT create a new pot when fee is blank', async () => {
      const invalidPot = {
        ...potToPost,
        fee: "",
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "post",
          data: potJSON,
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
    it('should NOT create a new pot when pot_type is blank', async () => {
      const invalidPot = {
        ...potToPost,
        pot_type: "",
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "post",
          data: potJSON,
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
    it('should NOT create a new pot when sort_order is null', async () => {
      const invalidPot = {
        ...potToPost,
        sort_order: null,
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "post",
          data: potJSON,
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
    it('should NOT create a new pot when squad_id is not a valid squad id', async () => { 
      const invalidPot = {
        ...potToPost,
        squad_id: notFoundId, // a valid pot id, not a squad id
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "post",
          data: potJSON,
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
    it('should NOT create a new pot when div_id is not a valid div id', async () => { 
      const invalidPot = {
        ...potToPost,
        div_id: notFoundId, // a valid pot id, not a div id
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "post",
          data: potJSON,
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
    it('should NOT create a new pot when fee to too low', async () => {
      const invalidPot = {
        ...potToPost,
        fee: '0',
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "post",
          data: potJSON,
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
    it('should NOT create a new pot when fee to too high', async () => {
      const invalidPot = {
        ...potToPost,
        fee: '1234567',
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "post",
          data: potJSON,
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
    it('should NOT create a new pot when fee is not a number', async () => {
      const invalidPot = {
        ...potToPost,
        fee: 'invalid',
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "post",
          data: potJSON,
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
    it('should NOT create new pot with an invalid pot_type', async () => {
      const invalidPot = {
        ...potToPost,
        pot_type: "invalid",
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "post",
          data: potJSON,
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
    it('should NOT create new pot when sort_order is too low', async () => {
      const invalidPot = {
        ...potToPost,
        sort_order: 0,
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "post",
          data: potJSON,
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
    it('should NOT create new pot when sort_order is too high', async () => {
      const invalidPot = {
        ...potToPost,
        sort_order: 1234567,
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "post",
          data: potJSON,
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
    it('should NOT create new pot when sort_order is not an integer', async () => {
      const invalidPot = {
        ...potToPost,
        sort_order: 1.5,
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "post",
          data: potJSON,
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
    it('should NOT create new pot when sort_order is not a number', async () => {
      const invalidPot = {
        ...potToPost,
        sort_order: 'abc',
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "post",
          data: potJSON,
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
      const invalidPot = {
        ...potToPost,
        squad_id: testPot.squad_id,
        div_id: testPot.div_id,
        pot_type: 'Game',
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "post",
          data: potJSON,
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
    it('should create a new pot with sanitzied values', async () => { 
      const toSanitizePot = {
        ...potToPost,
        fee: '5.460',        
      }
      const potJSON = JSON.stringify(toSanitizePot);
      const response = await axios({
        method: "post",
        withCredentials: true,
        url: url,
        data: potJSON
      })
      expect(response.status).toBe(201);
      const postedPot = response.data.pot;
      createdPotId = response.data.pot.id;      
      expect(postedPot.fee).toBe('5.46');
    })

  })

  describe('GET by id - API: /api/pots/:id', () => { 

    it('should get pot by id', async () => { 
      const response = await axios.get(url + "/" + testPot.id);
      expect(response.status).toBe(200);
      const pot = response.data.pot;
      expect(pot.id).toBe(testPot.id);
      expect(pot.squad_id).toBe(testPot.squad_id);
      expect(pot.div_id).toBe(testPot.div_id);
      expect(pot.fee).toBe(testPot.fee);
      expect(pot.pot_type).toBe(testPot.pot_type);
      expect(pot.sort_order).toBe(testPot.sort_order);
    })
    it('should NOT get pot by id when ID is invalid', async () => { 
      try {
        const response = await axios.get(url + "/" + 'invalid');
        expect(response.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT get pot by id when ID is not found', async () => { 
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
    it('should NOT get pot by id when ID is valid, but not a pot ID', async () => { 
      try {
        const response = await axios.get(url + "/" + nonPotId);
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

  describe('PUT by ID - API: /api/pots/:id', () => { 

    const putPot = {
      ...testPot,
      squad_id: 'sqd_3397da1adc014cf58c44e07c19914f72',
      div_id: 'div_29b9225d8dd44a4eae276f8bde855729',
      fee: '13',
      pot_type: "Series",
      sort_order: 10,
    }

    const samplePot = {
      ...initPot,
      id: '',
      squad_id: 'sqd_3397da1adc014cf58c44e07c19914f72',
      div_id: 'div_29b9225d8dd44a4eae276f8bde855729',
      fee: '13',
      pot_type: "Last Game",
      sort_order: 11,
    }

    beforeAll(async () => {
      // make sure test div is reset in database
      const potJSON = JSON.stringify(testPot);
      const putResponse = await axios({
        method: "put",
        data: potJSON,
        withCredentials: true,
        url: url + "/" + testPot.id,
      })
    })

    afterEach(async () => {
      try {
        const potJSON = JSON.stringify(testPot);
        const putResponse = await axios({
          method: "put",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + testPot.id,
        })
      } catch (err) {
        if (err instanceof AxiosError) console.log(err.message);
      }
    })

    it('should update pot by id', async () => {
      const potJSON = JSON.stringify(putPot);
      const putResponse = await axios({
        method: "put",
        data: potJSON,
        withCredentials: true,
        url: url + "/" + testPot.id,
      })
      const pot = putResponse.data.pot;
      expect(putResponse.status).toBe(200);
      // did not update squad_id or div_id
      expect(pot.squad_id).toBe(testPot.squad_id);
      expect(pot.div_id).toBe(testPot.div_id);
      // all other fields updated
      expect(pot.fee).toBe(putPot.fee);
      expect(pot.pot_type).toBe(putPot.pot_type);
      expect(pot.sort_order).toBe(putPot.sort_order);
    })
    it('should NOT update pot by id when ID is invalid', async () => {
      try {
        const potJSON = JSON.stringify(putPot);
        const putResponse = await axios({
          method: "put",
          data: potJSON,
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
    it('should NOT update pot by id when ID is valid, but not a pot ID', async () => {
      try {
        const potJSON = JSON.stringify(putPot);
        const putResponse = await axios({
          method: "put",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + nonPotId,
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
    it('should NOT update pot by id when ID is not found', async () => {
      try {
        const potJSON = JSON.stringify(putPot);
        const putResponse = await axios({
          method: "put",
          data: potJSON,
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
    it('should NOT update pot when squad_id is blank', async () => {
      const invalidPot = {
        ...putPot,
        squad_id: "",
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "put",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + testPot.id,
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
    it('should NOT update pot when div_id is blank', async () => {
      const invalidPot = {
        ...putPot,
        div_id: "",
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "put",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + testPot.id,
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
    it('should NOT update pot when fee is blank', async () => {
      const invalidPot = {
        ...putPot,
        fee: "",
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "put",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + testPot.id,
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
    it('should NOT update pot when pot_type is blank', async () => {
      const invalidPot = {
        ...putPot,
        pot_type: "",
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "put",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + testPot.id,
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
    it('should NOT update pot when sort_order is null', async () => {
      const invalidPot = {
        ...putPot,
        sort_order: null,
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "put",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + testPot.id,
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
    it('should NOT update pot when fee is too low', async () => {
      const invalidPot = {
        ...putPot,
        fee: '0',
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "put",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + testPot.id,
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
    it('should NOT update pot when fee is too high', async () => {
      const invalidPot = {
        ...putPot,
        fee: '123456789',
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "put",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + testPot.id,
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
    it('should NOT update pot when fee is not a number', async () => {
      const invalidPot = {
        ...putPot,
        fee: 'invalid',
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "put",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + testPot.id,
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
    it('should NOT update pot when pot_type is not "Game", "Last Game" or "Series"', async () => {
      const invalidPot = {
        ...putPot,
        pot_type: 'invalid',
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "put",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + testPot.id,
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
    it('should NOT update pot when sort_order is too low', async () => {
      const invalidPot = {
        ...putPot,
        sort_order: 0,
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "put",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + testPot.id,
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
    it('should NOT update pot when sort_order is too high', async () => {
      const invalidPot = {
        ...putPot,
        sort_order: 1234567,
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "put",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + testPot.id,
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
    it('should NOT update pot when sort_order is not an integer', async () => {
      const invalidPot = {
        ...putPot,
        sort_order: 1.5,
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "put",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + testPot.id,
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
    it('should NOT update a pot when div_id + pot_type is not unique', async () => {
      const invalidPot = {
        ...initPot,
        id: pot3Id,
        squad_id: squad2Id,
        div_id: div2Id,
        sort_order: 2,
        fee: 10,
        pot_type: "Game",
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "put",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + invalidPot.id,
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
    it('should update pot by id with sanitzied values', async () => {
      const toSanitizePot = {
        ...putPot,
        fee: '5.460',        
      }
      const potJSON = JSON.stringify(toSanitizePot);
      const putResponse = await axios({
        method: "put",
        data: potJSON,
        withCredentials: true,
        url: url + "/" + testPot.id,
      })
      expect(putResponse.status).toBe(200);
      const pot = putResponse.data.pot;      
      expect(pot.fee).toBe('5.46');
    })

  })

  describe('PATCH by ID - API: /api/pots/:id', () => { 

    beforeAll(async () => {
      // make sure test pot is reset in database
      const potJSON = JSON.stringify(testPot);
      const putResponse = await axios({
        method: "put",
        data: potJSON,
        withCredentials: true,
        url: url + "/" + testPot.id,
      })
    })
      
    afterEach(async () => {
      try {
        const potJSON = JSON.stringify(testPot);
        const putResponse = await axios({
          method: "put",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + testPot.id,
        })
      } catch (err) {
        if (err instanceof AxiosError) console.log(err.message);
      }
    })

    it('should patch fee for a pot by ID', async () => { 
      const patchPot = {
        ...blankPot,
        fee: '13',
      }
      const potJSON = JSON.stringify(patchPot);
      const response = await axios({
        method: "patch",
        data: potJSON,
        withCredentials: true,
        url: url + "/" + blankPot.id,
      })
      expect(response.status).toBe(200);
      const patchedPot = response.data.pot;
      expect(patchedPot.fee).toBe(patchPot.fee);
    })
    it('should patch pot_type for a pot by ID', async () => {
      const patchPot = {
        ...blankPot,
        pot_type: 'Series',
      }
      const potJSON = JSON.stringify(patchPot);
      const response = await axios({
        method: "patch",
        data: potJSON,
        withCredentials: true,
        url: url + "/" + blankPot.id,
      })
      expect(response.status).toBe(200);
      const patchedPot = response.data.Pot;
      expect(patchPot.pot_type).toBe(patchPot.pot_type);
    })
    it('should patch sort_order for a pot by ID', async () => {
      const patchPot = {
        ...blankPot,
        sort_order: 12,
      }
      const potJSON = JSON.stringify(patchPot);
      const response = await axios({
        method: "patch",
        data: potJSON,
        withCredentials: true,
        url: url + "/" + blankPot.id,
      })
      expect(response.status).toBe(200);
      const patchedPot = response.data.pot;
      expect(patchedPot.sort_order).toBe(patchPot.sort_order);
    })
    it('should NOT patch div_id for a pot by ID', async () => {
      const patchPot = {
        ...blankPot,
        div_id: div2Id,
      }
      const potJSON = JSON.stringify(patchPot);
      const response = await axios({
        method: "patch",
        data: potJSON,
        withCredentials: true,
        url: url + "/" + blankPot.id,
      })
      expect(response.status).toBe(200);
      const patchedPot = response.data.pot;
      // for div_id, compare to blankPot.div_id
      expect(patchedPot.div_id).toBe(blankPot.div_id);
    })
    it('should NOT patch squad_id for a pot by ID', async () => {
      const patchPot = {
        ...blankPot,
        squad_id: squad2Id,
      }
      const potJSON = JSON.stringify(patchPot);
      const response = await axios({
        method: "patch",
        data: potJSON,
        withCredentials: true,
        url: url + "/" + blankPot.id,
      })
      expect(response.status).toBe(200);
      const patchedPot = response.data.pot;
      // for squad_id, compare to blankPot.squad_id
      expect(patchedPot.squad_id).toBe(blankPot.squad_id);
    })
    it('should NOT patch a pot when ID is invalid', async () => {
      const patchPot = {
        ...blankPot,
        fee: '13',
      }
      const potJSON = JSON.stringify(patchPot);
      try {
        const response = await axios({
          method: "patch",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + 'test',
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
    it('should NOT patch a pot when ID is not found', async () => {
      const patchPot = {
        ...blankPot,
        fee: '13',
      }
      const potJSON = JSON.stringify(patchPot);
      try {
        const response = await axios({
          method: "patch",
          data: potJSON,
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
    it('should NOT patch a pot when ID is valid, but not a pot ID', async () => {
      const patchPot = {
        ...blankPot,
        fee: '13',
      }
      const potJSON = JSON.stringify(patchPot);
      try {
        const response = await axios({
          method: "patch",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + nonPotId,
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
    it('should NOT patch a pot when fee is blank', async () => {
      const patchPot = {
        ...blankPot,
        fee: '',
      }
      const potJSON = JSON.stringify(patchPot);
      try {
        const response = await axios({
          method: "patch",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + blankPot.id,
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
    it('should NOT patch a pot when pot_type is blank', async () => {
      const patchPot = {
        ...blankPot,
        pot_type: "",
      }
      const potJSON = JSON.stringify(patchPot);
      try {
        const response = await axios({
          method: "patch",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + blankPot.id,
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
    it('should NOT patch a pot when sort_order is null', async () => {
      const patchPot = {
        ...blankPot,
        sort_order: null,
      }
      const potJSON = JSON.stringify(patchPot);
      try {
        const response = await axios({
          method: "patch",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + blankPot.id,
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
    it('should NOT patch a pot when fee is too low', async () => {
      const patchPot = {
        ...blankPot,
        fee: '0',
      }
      const potJSON = JSON.stringify(patchPot);
      try {
        const response = await axios({
          method: "patch",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + blankPot.id,
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
    it('should NOT patch a pot when fee is too high', async () => {
      const patchPot = {
        ...blankPot,
        fee: '123456789',
      }
      const potJSON = JSON.stringify(patchPot);
      try {
        const response = await axios({
          method: "patch",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + blankPot.id,
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
    it('should NOT patch a pot when fee is not a number', async () => {
      const patchPot = {
        ...blankPot,
        fee: 'abcdef',
      }
      const potJSON = JSON.stringify(patchPot);
      try {
        const response = await axios({
          method: "patch",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + blankPot.id,
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
    it('should NOT patch a pot when pot_type is not "Game", "Last Game" or "Series"', async () => {
      const patchPot = {
        ...blankPot,
        pot_type: 'invalid',
      }
      const potJSON = JSON.stringify(patchPot);
      try {
        const response = await axios({
          method: "patch",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + blankPot.id,
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
    it('should NOT patch a pot when sort_order is too low', async () => {
      const patchPot = {
        ...blankPot,
        sort_order: 0,
      }
      const potJSON = JSON.stringify(patchPot);
      try {
        const response = await axios({
          method: "patch",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + blankPot.id,
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
    it('should NOT patch a pot when sort_order is too high', async () => {
      const patchPot = {
        ...blankPot,
        sort_order: 1234567,
      }
      const potJSON = JSON.stringify(patchPot);
      try {
        const response = await axios({
          method: "patch",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + blankPot.id,
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
    it('should NOT patch a pot when sort_order is not an integer', async () => {
      const patchPot = {
        ...blankPot,
        sort_order: 1.5,
      }
      const potJSON = JSON.stringify(patchPot);
      try {
        const response = await axios({
          method: "patch",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + blankPot.id,
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
    it('should NOT patch a pot when div_id + pot_type is not unique', async () => {      
      const invalidPot = {
        ...initPot,
        id: pot3Id,
        squad_id: squad2Id,
        div_id: div2Id,
        pot_type: "Game",
      }
      const potJSON = JSON.stringify(invalidPot);
      try {
        const response = await axios({
          method: "patch",
          data: potJSON,
          withCredentials: true,
          url: url + "/" + invalidPot.id,
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
    it('should patch fee for a pot by ID', async () => { 
      const toSanitizePot = {
        ...blankPot,
        fee: '5.460',
      }
      const potJSON = JSON.stringify(toSanitizePot);
      const response = await axios({
        method: "patch",
        data: potJSON,
        withCredentials: true,
        url: url + "/" + blankPot.id,
      })
      expect(response.status).toBe(200);
      const patchedPot = response.data.pot;
      expect(patchedPot.fee).toBe('5.46');
    })

  })

  describe('DELETE by ID - API: /api/pots/:id', () => { 

    const toDelPot = {
      ...initPot,
      id: "pot_e3758d99c5494efabb3b0d273cf22e7a",
      squad_id: "sqd_20c24199328447f8bbe95c05e1b84644",
      div_id: "div_29b9225d8dd44a4eae276f8bde855729",
      sort_order: 1,
      fee: '20',
      pot_type: "Game",
    }

    let didDel = false

    beforeEach(() => {
      didDel = false;
    })

    afterEach(async () => {
      if (!didDel) return;
      try {
        const restoredPot = {
          ...toDelPot,
          id: postSecret + toDelPot.id,
        }
        const potJSON = JSON.stringify(restoredPot);
        const response = await axios({
          method: 'post',
          data: potJSON,
          withCredentials: true,
          url: url
        })
        console.log('response.status: ', response.status)
      } catch (err) {
        if (err instanceof Error) console.log(err.message);
      }
    })

    it('should delete a pot by ID', async () => {
      try {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + toDelPot.id,
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
    it('should NOT delete a pot by ID when ID is invalid', async () => { 
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
    it('should NOT delete a pot by ID when ID is not found', async () => { 
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
    it('should NOT delete a pot by ID when ID is valid, but not an pot id', async () => { 
      try {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + nonPotId
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
    // it('should NOT delete a pot by ID when pot has child rows', async () => { 
    //   try {
    //     const delResponse = await axios({
    //       method: "delete",
    //       withCredentials: true,
    //       url: url + "/" + testPot.id
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