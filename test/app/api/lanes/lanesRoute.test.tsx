import axios, { AxiosError } from "axios";
import { baseLanesApi } from "@/lib/db/apiPaths";
import { testBaseLanesApi } from "../../../testApi";
import { laneType } from "@/lib/types/types";
import { initLane } from "@/lib/db/initVals";
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

const url = testBaseLanesApi.startsWith("undefined")
  ? baseLanesApi
  : testBaseLanesApi;   

const notFoundId = "lan_01234567890123456789012345678901";
const notfoundSquadId = "squad_01234567890123456789012345678901";
const nonLaneId = "usr_01234567890123456789012345678901";

const squad1Id = 'sqd_7116ce5f80164830830a7157eb093396';
const squad2Id = 'sqd_1a6c885ee19a49489960389193e8f819';

describe('Lanes - API: /api/lanes', () => { 

  const testLane: laneType = {
    ...initLane,
    id: "lan_7b5b9d9e6b6e4c5b9f6b7d9e7f9b6c5d",
    squad_id: "sqd_7116ce5f80164830830a7157eb093396",
    lane_number: 29,
  }

  const blankLane = {
    id: "lan_7b5b9d9e6b6e4c5b9f6b7d9e7f9b6c5d",
    squad_id: "sqd_7116ce5f80164830830a7157eb093396",
  }

  describe('GET', () => { 

    beforeAll(async () => {
      // if row left over from post test, then delete it
      const response = await axios.get(url);
      const lanes = response.data.lanes;
      const toDel = lanes.find((l: laneType) => l.lane_number === 101);
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

    it('should get all lanes', async () => {
      const response = await axios.get(url);
      expect(response.status).toEqual(200);
      // 37 rows in prisma/seed.ts
      expect(response.data.lanes).toHaveLength(37);
    })    

  })

  describe('GET lanes list APT: /api/lanes/squad/:id', () => { 

    beforeAll(async () => {
      // if row left over from post test, then delete it
      const response = await axios.get(url);
      const lanes = response.data.lanes;
      const toDel = lanes.find((l: laneType) => l.lane_number === 101);
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

    it('should get all lanes for a squad', async () => {
      // const values taken from prisma/seed.ts
      const multiLaneSquadId = "sqd_7116ce5f80164830830a7157eb093396";
      const squadLaneId1 = 'lan_7b5b9d9e6b6e4c5b9f6b7d9e7f9b6c5d';
      const squadLaneId12 = 'lan_8b78890d8b8e4c5b9f6b7d9e7f9b6abc';

      const multiLaneUrl = url + '/squad/' + multiLaneSquadId;
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: multiLaneUrl
      })
      expect(response.status).toBe(200);
      // 12 rows for tmnt in prisma/seed.ts
      expect(response.data.lanes).toHaveLength(12);
      const lanes: laneType[] = response.data.lanes;
      // query in /api/lanes/squad GET sorts by sort_order
      expect(lanes[0].id).toBe(squadLaneId1);
      expect(lanes[11].id).toBe(squadLaneId12);      
    })

  })

  describe('POST', () => { 

    const laneToPost: laneType = {
      ...initLane,
      id: "",
      squad_id: "sqd_7116ce5f80164830830a7157eb093396",
      lane_number: 101,
    }
  
    let createdLaneId = "";

    beforeAll(async () => {
      const response = await axios.get(url);
      const lanes = response.data.lanes;
      const toDel = lanes.find((l: laneType) => l.lane_number === 101);
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
      createdLaneId = '';
    })

    afterEach(async () => {
      if (createdLaneId) {
        try {
          const delResponse = await axios({
            method: "delete",
            withCredentials: true,
            url: url + "/" + createdLaneId
          });
        } catch (err) {
          if (err instanceof AxiosError) console.log(err.message);
        }
      }
    })

    it('should create a lane', async () => { 
      const laneJSON = JSON.stringify(laneToPost);
      const response = await axios({
        method: "post",
        data: laneJSON,
        withCredentials: true,
        url: url
      })      
      expect(response.status).toBe(201);
      const postedLane = response.data.lane;
      createdLaneId = postedLane.id;
      expect(response.data.lane.squad_id).toBe(laneToPost.squad_id);
      expect(response.data.lane.lane_number).toBe(laneToPost.lane_number);
      expect(isValidBtDbId(postedLane.id, 'lan')).toBeTruthy();
    })
    it('should create a lane with the provided lane id', async () => { 
      const supIdLane = {
        ...laneToPost,
        id: postSecret + notFoundId, // use valid ID 
      }
      const laneJSON = JSON.stringify(supIdLane);
      const response = await axios({
        method: "post",
        data: laneJSON,
        withCredentials: true,
        url: url
      })
      expect(response.status).toBe(201);
      const postedLane = response.data.lane;
      createdLaneId = postedLane.id;
      expect(postedLane.id).toBe(notFoundId);
    })
    it('should NOT create a new lane when squad id does not exist', async () => { 
      const invalidLane = {
        ...laneToPost,
        squad_id: notfoundSquadId,
      }
      const laneJSON = JSON.stringify(invalidLane);
      try {
        const response = await axios({
          method: "post",
          data: laneJSON,
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
    it('should NOT create a new lane when lane number is null', async () => { 
      const invalidLane = {
        ...laneToPost,
        lane_number: null,
      }
      const laneJSON = JSON.stringify(invalidLane);
      try {
        const response = await axios({
          method: "post",
          data: laneJSON,
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
    it('should NOT create a new lane when lane number is not an integer', async () => { 
      const invalidLane = {
        ...laneToPost,
        lane_number: 29.5,
      }
      const laneJSON = JSON.stringify(invalidLane);
      try {
        const response = await axios({
          method: "post",
          data: laneJSON,
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
    it('should NOT create a new lane when lane number is less than 1', async () => { 
      const invalidLane = {
        ...laneToPost,
        lane_number: 0,
      }
      const laneJSON = JSON.stringify(invalidLane);
      try {
        const response = await axios({
          method: "post",
          data: laneJSON,
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
    it('should NOT create a new lane when lane number is greater than 200', async () => {
      const invalidLane = {
        ...laneToPost,
        lane_number: 201,
      }
      const laneJSON = JSON.stringify(invalidLane);
      try {
        const response = await axios({
          method: "post",
          data: laneJSON,
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
    it('should NOT create a new lane when lane number + squd_id is not unique', async () => {
      const invalidLane = {
        ...laneToPost,
        lane_number: 29,
      }
      const laneJSON = JSON.stringify(invalidLane);
      try {
        const response = await axios({
          method: "post",
          data: laneJSON,
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

  })

  describe('GET by ID - API: /api/lanes/:id', () => { 

    it('should get a lane by ID', async () => { 
      const response = await axios.get(url + "/" + testLane.id);
      const lane = response.data.lane;
      expect(response.status).toBe(200);
      expect(lane.id).toBe(testLane.id);
      expect(lane.squad_id).toBe(testLane.squad_id);
      expect(lane.lane_number).toBe(testLane.lane_number);
    })
    it('should NOT get a lane by ID when ID is invalid', async () => { 
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
    it('should NOT get a lane by ID when ID is valid, but not a lane ID', async () => { 
      try {
        const response = await axios.get(url + "/" + nonLaneId);
        expect(response.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT get a lane by ID when ID is not found', async () => { 
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

  })

  describe('PUT by ID - API: /api/lanes/:id', () => { 

    const putLane = {
      ...testLane,
      squad_id: "sqd_20c24199328447f8bbe95c05e1b84644",
      lane_number: 101,
    }

    const samplelane = {
      ...initLane,
      id: '',
      squad_id: "sqd_20c24199328447f8bbe95c05e1b84644",
      lane_number: 101,
    }

    beforeAll(async () => {
      // make sure test div is reset in database
      const laneJSON = JSON.stringify(testLane);
      const putResponse = await axios({
        method: "put",
        data: laneJSON,
        withCredentials: true,
        url: url + "/" + testLane.id,
      })
    })

    afterEach(async () => {
      try {
        const laneJSON = JSON.stringify(testLane);
        const putResponse = await axios({
          method: "put",
          data: laneJSON,
          withCredentials: true,
          url: url + "/" + testLane.id,
        })
      } catch (err) {
        if (err instanceof AxiosError) console.log(err.message);
      }
    })

    it('should update a lane by ID', async () => { 
      const laneJSON = JSON.stringify(putLane);
      const putResponse = await axios({
        method: "put",
        data: laneJSON,
        withCredentials: true,
        url: url + "/" + testLane.id,
      })
      const lane = putResponse.data.lane;
      expect(putResponse.status).toBe(200);
      // did not update ssquad_id
      expect(lane.squad_id).toBe(testLane.squad_id);
      // all other fields updated
      expect(lane.lane_number).toBe(putLane.lane_number);
    })
    it('should NOT update a lane by ID when ID is invalid', async () => { 
      try {
        const laneJSON = JSON.stringify(putLane);
        const putResponse = await axios({
          method: "put",
          data: laneJSON,
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
    it('should NOT update a lane by ID when ID is valid, but not a lane ID', async () => { 
      try {
        const laneJSON = JSON.stringify(putLane);
        const putResponse = await axios({
          method: "put",
          data: laneJSON,
          withCredentials: true,
          url: url + "/" + nonLaneId,
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
    it('should NOT update a lane by ID when ID is not found', async () => { 
      try {
        const laneJSON = JSON.stringify(putLane);
        const putResponse = await axios({
          method: "put",
          data: laneJSON,
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
    it('should NOT update a lane by ID when lane_number is null', async () => { 
      try {
        const invalidLane = {
          ...putLane,
          lane_number: null,
        }
        const laneJSON = JSON.stringify(invalidLane);
        const putResponse = await axios({
          method: "put",
          data: laneJSON,
          withCredentials: true,
          url: url + "/" + testLane.id,
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
    it('should NOT update a lane by ID when lane_number is less than 1', async () => { 
      try {
        const invalidLane = {
          ...putLane,
          lane_number: 0,
        }
        const laneJSON = JSON.stringify(invalidLane);
        const putResponse = await axios({
          method: "put",
          data: laneJSON,
          withCredentials: true,
          url: url + "/" + testLane.id,
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
    it('should NOT update a lane by ID when lane_number is more than 200', async () => { 
      try {
        const invalidLane = {
          ...putLane,
          lane_number: 201,
        }
        const laneJSON = JSON.stringify(invalidLane);
        const putResponse = await axios({
          method: "put",
          data: laneJSON,
          withCredentials: true,
          url: url + "/" + testLane.id,
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
    it('should NOT update a lane when lane number + squd_id is not unique', async () => {
      const invalidLane = {
        ...putLane,
        squad_id: squad1Id,
        lane_number: 30,
      }
      const laneJSON = JSON.stringify(invalidLane);
      try {
        const response = await axios({
          method: "put",
          data: laneJSON,
          withCredentials: true,
          url: url + "/" + invalidLane.id,
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

  })

  describe('PATCH by ID - API: /api/lanes/:id', () => { 

    beforeAll(async () => {
      // make sure test div is reset in database
      const laneJSON = JSON.stringify(testLane);
      const putResponse = await axios({
        method: "put",
        data: laneJSON,
        withCredentials: true,
        url: url + "/" + testLane.id,
      })
    })
      
    afterEach(async () => {
      try {
        const laneJSON = JSON.stringify(testLane);
        const putResponse = await axios({
          method: "put",
          data: laneJSON,
          withCredentials: true,
          url: url + "/" + testLane.id,
        })
      } catch (err) {
        if (err instanceof AxiosError) console.log(err.message);
      }
    })

    it('should patch a lane by ID', async () => { 
      const patchLane = {
        ...testLane,
        lane_number: 101,
      }
      const laneJSON = JSON.stringify(patchLane);
      const patchResponse = await axios({
        method: "patch",
        data: laneJSON,
        withCredentials: true,
        url: url + "/" + testLane.id,
      })
      expect(patchResponse.status).toBe(200);
      const patchedlane = patchResponse.data.lane;
      expect(patchedlane.lane_number).toBe(101);
    })
    it('should NOT patch squad_id for a lane by ID', async () => { 
      const patchLane = {
        ...testLane,
        squad_id: squad2Id,
      }
      const laneJSON = JSON.stringify(patchLane);
      const patchResponse = await axios({
        method: "patch",
        data: laneJSON,
        withCredentials: true,
        url: url + "/" + testLane.id,
      })
      expect(patchResponse.status).toBe(200);
      const patchedlane = patchResponse.data.lane;
      // should not have patched squad_id
      expect(patchedlane.squad_id).toBe(testLane.squad_id);
    })    
    it('should NOT patch a lane by ID when ID is invalid', async () => { 
      try {
        const laneJSON = JSON.stringify(testLane);
        const patchResponse = await axios({
          method: "patch",
          data: laneJSON,
          withCredentials: true,
          url: url + "/" + 'test',
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
    it('should NOT patch a lane by ID when ID is valid, but not a lane ID', async () => { 
      try {
        const laneJSON = JSON.stringify(testLane);
        const patchResponse = await axios({
          method: "patch",
          data: laneJSON,
          withCredentials: true,
          url: url + "/" + nonLaneId,
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
    it('should NOT patch a lane by ID when id is not found', async () => { 
      try {
        const laneJSON = JSON.stringify(testLane);
        const patchResponse = await axios({
          method: "patch",
          data: laneJSON,
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
    it('should NOT patch a lane by ID when lane_number is null', async () => { 
      try {
        const invalidLane = {
          ...testLane,
          lane_number: null,
        }
        const laneJSON = JSON.stringify(invalidLane);
        const patchResponse = await axios({
          method: "patch",
          data: laneJSON,
          withCredentials: true,
          url: url + "/" + testLane.id,
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
    it('should NOT patch a lane by ID when lane_number is less than 1', async () => { 
      try {
        const invalidLane = {
          ...testLane,
          lane_number: 0,
        }
        const laneJSON = JSON.stringify(invalidLane);
        const patchResponse = await axios({
          method: "patch",
          data: laneJSON,
          withCredentials: true,
          url: url + "/" + testLane.id,
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
    it('should NOT patch a lane by ID when lane_number is more than 200', async () => { 
      try {
        const invalidLane = {
          ...testLane,
          lane_number: 201,
        }
        const laneJSON = JSON.stringify(invalidLane);
        const patchResponse = await axios({
          method: "patch",
          data: laneJSON,
          withCredentials: true,
          url: url + "/" + testLane.id,
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
    it('should NOT patch a lane by ID when lane_number is not an integer', async () => { 
      try {
        const invalidLane = {
          ...testLane,
          lane_number: 1.5,
        }
        const laneJSON = JSON.stringify(invalidLane);
        const patchResponse = await axios({
          method: "patch",
          data: laneJSON,
          withCredentials: true,
          url: url + "/" + testLane.id,
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
    it('should NOT patch a lane when lane number + squd_id is not unique', async () => {
      const invalidLane = {
        ...testLane,
        squad_id: squad1Id,
        lane_number: 30,
      }
      const laneJSON = JSON.stringify(invalidLane);
      try {
        const response = await axios({
          method: "patch",
          data: laneJSON,
          withCredentials: true,
          url: url + "/" + invalidLane.id,
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
    

  })

  describe('DELETE by ID - API: /api/lanes/:id', () => { 

    const toDelLane = {
      ...initLane,
      id: "lan_255dd3b8755f4dea956445e7a3511d91",
      lane_number: 99,
      squad_id: "sqd_20c24199328447f8bbe95c05e1b84644",
    }

    let didDel = false

    beforeEach(() => {
      didDel = false;
    })

    afterEach(async () => {
      if (!didDel) return;
      try {
        const restoredDiv = {
          ...toDelLane,
          id: postSecret + 'lan_255dd3b8755f4dea956445e7a3511d91',
        }
        const divJSON = JSON.stringify(restoredDiv);
        const response = await axios({
          method: 'post',
          data: divJSON,
          withCredentials: true,
          url: url
        })
        console.log('response.status: ', response.status)
      } catch (err) {
        if (err instanceof Error) console.log(err.message);
      }
    })

    it('should delete a lane by ID', async () => { 
      try {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + toDelLane.id,
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
    it('should NOT delete a lane by ID when ID is invalid', async () => { 
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
    it('should NOT delete a lane by ID when ID is not found', async () => { 
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
    it('should NOT delete a lane by ID when ID is valid, bit not an lane id', async () => { 
      try {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + nonLaneId
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
    // it('should NOT delete a lane by ID when lane has child rows', async () => { 
    //   try {
    //     const delResponse = await axios({
    //       method: "delete",
    //       withCredentials: true,
    //       url: url + "/" + testLane.id
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