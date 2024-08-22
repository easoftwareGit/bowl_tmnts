import axios, { AxiosError } from "axios";
import { baseDivsApi } from "@/db/apiPaths";
import { testBaseDivsApi } from "../../../testApi";
import { divType } from "@/lib/types/types";
import { initDiv } from "@/db/initVals";
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

const url = testBaseDivsApi.startsWith("undefined")
  ? baseDivsApi
  : testBaseDivsApi;   

const notFoundId = "div_01234567890123456789012345678901";
const notfoundTmntId = "tmt_01234567890123456789012345678901";
const nonDivId = "usr_01234567890123456789012345678901";

const div3Id = 'div_29b9225d8dd44a4eae276f8bde855729';
const tmnt2Id = 'tmt_56d916ece6b50e6293300248c6792316';

describe('Divs - API: /api/divs', () => { 

  const testDiv: divType = {
    ...initDiv,
    id: "div_f30aea2c534f4cfe87f4315531cef8ef",
    tmnt_id: "tmt_fd99387c33d9c78aba290286576ddce5",
    div_name: "Scratch",
    hdcp_per: 0,
    hdcp_from: 230,
    int_hdcp: true, 
    hdcp_for: 'Game',
    sort_order: 1,
  }

  const blankDiv = {
    id: "div_f30aea2c534f4cfe87f4315531cef8ef",
    tmnt_id: "tmt_fd99387c33d9c78aba290286576ddce5",
  }

  describe('GET', () => { 

    beforeAll(async () => {
      // if row left over from post test, then delete it
      const response = await axios.get(url);
      const divs = response.data.divs;
      const toDel = divs.find((d: divType) => d.div_name === 'Test Div');
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

    it('should get all divs', async () => { 
      const response = await axios.get(url);
      expect(response.status).toBe(200);
      // 7 rows in prisma/seed.ts
      expect(response.data.divs).toHaveLength(7);
    })

  })

  describe('GET div lists API: /api/divs/tmnt/:id', () => {

    beforeAll(async () => {
      // if row left over from post test, then delete it
      const response = await axios.get(url);
      const divs = response.data.divs;
      const toDel = divs.find((d: divType) => d.div_name === 'Test Div');
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

    it('should get all divs for a tournament', async () => { 
      // const values taken from prisma/seed.ts
      const multiDivTmntId = "tmt_56d916ece6b50e6293300248c6792316";
      const tmntDivId1 = 'div_1f42042f9ef24029a0a2d48cc276a087';
      const tmntDivId2 = 'div_29b9225d8dd44a4eae276f8bde855729';

      const multiDivUrl = url + '/tmnt/' + multiDivTmntId;
      const response = await axios({
        method: "get",
        withCredentials: true,
        url: multiDivUrl
      })
      expect(response.status).toBe(200);
      // 2 rows for tmnt in prisma/seed.ts
      expect(response.data.divs).toHaveLength(2);
      const divs: divType[] = response.data.divs;
      // query in /api/divs/tmnt GET sorts by sort_order
      expect(divs[0].id).toBe(tmntDivId1);
      expect(divs[1].id).toBe(tmntDivId2);      
    })
  
  })

  describe('POST', () => { 

    const divToPost: divType = {
      ...initDiv,
      id: "",
      tmnt_id: "tmt_e134ac14c5234d708d26037ae812ac33",
      div_name: "Test Div",
      hdcp_per: .9,
      hdcp_from: 220,
      int_hdcp: true, 
      hdcp_for: 'Game',
      sort_order: 1,
    }
  
    let createdDivId = "";

    beforeAll(async () => {
      const response = await axios.get(url);
      const divs = response.data.divs;
      const toDel = divs.find((d: divType) => d.div_name === 'Test Div');
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
      createdDivId = '';
    })

    afterEach(async () => {
      if (createdDivId) {
        try {
          const delResponse = await axios({
            method: "delete",
            withCredentials: true,
            url: url + "/" + createdDivId
          });
        } catch (err) {
          if (err instanceof AxiosError) console.log(err.message);
        }
      }
    })

    it('should create a new div', async () => { 
      const divJSON = JSON.stringify(divToPost);
      const response = await axios({
        method: "post",
        data: divJSON,
        withCredentials: true,
        url: url
      })
      expect(response.status).toBe(201);      
      const postedDiv = response.data.div;
      createdDivId = postedDiv.id;
      expect(postedDiv.tmnt_id).toBe(divToPost.tmnt_id);
      expect(postedDiv.div_name).toBe(divToPost.div_name);
      expect(postedDiv.hdcp_per).toBe(divToPost.hdcp_per);
      expect(postedDiv.hdcp_from).toBe(divToPost.hdcp_from);
      expect(postedDiv.int_hdcp).toBe(divToPost.int_hdcp);
      expect(postedDiv.hdcp_for).toBe(divToPost.hdcp_for);
      expect(postedDiv.sort_order).toBe(divToPost.sort_order);
      expect(isValidBtDbId(postedDiv.id, 'div')).toBeTruthy();
    })
    it('should create a new div with the provided div id', async () => { 
      const supIdDiv = {
        ...divToPost,
        id: postSecret + notFoundId, // use valid ID 
      }
      const divJSON = JSON.stringify(supIdDiv);
      const response = await axios({
        method: "post",
        data: divJSON,
        withCredentials: true,
        url: url
      })
      expect(response.status).toBe(201);
      const postedDiv = response.data.div;
      createdDivId = postedDiv.id;
      expect(postedDiv.id).toBe(notFoundId);
    })
    it('should create a new div with hdcp_for as "Series"', async () => { 
      const seriesDiv = {
        ...divToPost,
        hdcp_for: 'Series',
      }
      const divJSON = JSON.stringify(seriesDiv);
      const response = await axios({
        method: "post",
        data: divJSON,
        withCredentials: true,
        url: url
      })
      expect(response.status).toBe(201);      
      const postedDiv = response.data.div;
      createdDivId = postedDiv.id;
      expect(postedDiv.hdcp_for).toBe(seriesDiv.hdcp_for);
    })
    it('should NOT create a new div when tmnt_id that does not exist', async () => { 
      const invalidDiv = {
        ...divToPost,
        tmnt_id: notfoundTmntId,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "post",
          data: divJSON,
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
    it('should NOT create a new div when tmnt_id is blank', async () => { 
      const invalidDiv = {
        ...divToPost,
        tmnt_id: "",
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "post",
          data: divJSON,
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
    it('should NOT create a new div when div_name is blank', async () => { 
      const invalidDiv = {
        ...divToPost,
        div_name: "",
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "post",
          data: divJSON,
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
    it('should NOT create a new div when hdcp_per is null', async () => { 
      const invalidDiv = {
        ...divToPost,
        hdcp_per: null as any,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "post",
          data: divJSON,
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
    it('should NOT create a new div when hdcp_from is null', async () => { 
      const invalidDiv = {
        ...divToPost,
        hdcp_from: null as any,
      } 
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "post",
          data: divJSON,
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
    it('should NOT create a new div when int_hdcp is null', async () => { 
      const invalidDiv = {
        ...divToPost,
        int_hdcp: null as any,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "post",
          data: divJSON,
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
    it('should NOT create a new div when hdcp_for is blank', async () => { 
      const invalidDiv = {
        ...divToPost,
        hdcp_for: '',
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "post",
          data: divJSON,
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
    it('should NOT create a new div when sort_order is null', async () => { 
      const invalidDiv = {
        ...divToPost,
        sort_order: null as any,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "post",
          data: divJSON,
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
    it('should NOT create a new div when tmnt_id is invalid', async () => { 
      const invalidDiv = {
        ...divToPost,
        tmnt_id: 'invalid',
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "post",
          data: divJSON,
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
    it('should NOT create a new div when tmnt_id is valid, but not a tmnt_id', async () => { 
      const invalidDiv = {
        ...divToPost,
        tmnt_id: nonDivId,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "post",
          data: divJSON,
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
    it('should NOT create a new div when div_name is too long', async () => { 
      const invalidDiv = {
        ...divToPost,
        div_name: 'a'.repeat(51),
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "post",
          data: divJSON,
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
    it('should NOT create a new div when hdcp_per is negative', async () => { 
      const invalidDiv = {
        ...divToPost,
        hdcp_per: -1,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "post",
          data: divJSON,
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
    it('should NOT create a new div when hdcp_per is too high', async () => { 
      const invalidDiv = {
        ...divToPost,
        hdcp_per: 2, // 200%
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "post",
          data: divJSON,
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
    it('should NOT create a new div when hdcp_per is not a number', async () => { 
      const invalidDiv = {
        ...divToPost,
        hdcp_per: 'abc' as any,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "post",
          data: divJSON,
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
    it('should NOT create a new div when hdcp_from is negative', async () => { 
      const invalidDiv = {
        ...divToPost,
        hdcp_from: -1,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "post",
          data: divJSON,
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
    it('should NOT create a new div when hdcp_from is too high', async () => { 
      const invalidDiv = {
        ...divToPost,
        hdcp_from: 301,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "post",
          data: divJSON,
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
    it('should NOT create a new div when hdcp_from is not an integer', async () => { 
      const invalidDiv = {
        ...divToPost,
        hdcp_from: 233.3,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "post",
          data: divJSON,
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
    it('should NOT create a new div when hdcp_from is not a number', async () => { 
      const invalidDiv = {
        ...divToPost,
        hdcp_from: 'abc' as any,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "post",
          data: divJSON,
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
    it('should NOT create a new div when int_hdcp is not a boolean', async () => { 
      const invalidDiv = {
        ...divToPost,
        int_hdcp: 'true' as any,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "post",
          data: divJSON,
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
    it('should NOT create a new div when hdcp_for is anything other than "Game" or "Series"', async () => {
      const invalidDiv = {
        ...divToPost,
        hdcp_for: 'invalid' as any,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "post",
          data: divJSON,
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
    it('should NOT create a new div when sort_order is too low', async () => { 
      const invalidDiv = {
        ...divToPost,
        sort_order: 0,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "post",
          data: divJSON,
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
    it('should NOT create a new div when sort_order is too high', async () => { 
      const invalidDiv = {
        ...divToPost,
        sort_order: 1234567,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "post",
          data: divJSON,
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
    it('should NOT create a new div when sort_order is not an integer', async () => { 
      const invalidDiv = {
        ...divToPost,
        sort_order: 1.5,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "post",
          data: divJSON,
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
    it('should NOT create a new div when sort_order is not a number', async () => { 
      const invalidDiv = {
        ...divToPost,
        sort_order: 'abc' as any,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "post",
          data: divJSON,
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
    it('should NOT create a new div when tmnt_id + div_name is not unique', async () => { 
      const invalidDiv = {
        ...divToPost,
        tmnt_id: tmnt2Id,
        div_name: 'Scratch',
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "post",
          data: divJSON,
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
    it('should create a new div with sanitized data', async () => { 
      const toSanitizeDiv = {
        ...divToPost,
        div_name: "    <script>" + divToPost.div_name + "</script>   ",
      }
      const divJSON = JSON.stringify(toSanitizeDiv);
      const response = await axios({
        method: "post",
        data: divJSON,
        withCredentials: true,
        url: url
      })
      expect(response.status).toBe(201);
      const postedDiv = response.data.div;
      createdDivId = postedDiv.id;      
      expect(postedDiv.div_name).toBe(divToPost.div_name);
    })

  })

  describe('GET by ID - API: API: /api/divs/:id', () => { 

    it('should get a div by ID', async () => {
      const response = await axios.get(url + "/" + testDiv.id);
      const div = response.data.div;
      expect(response.status).toBe(200);
      expect(div.id).toBe(testDiv.id);
      expect(div.div_name).toBe(testDiv.div_name);
      expect(div.hdcp_per).toBe(testDiv.hdcp_per);
      expect(div.hdcp_from).toBe(testDiv.hdcp_from);      
      expect(div.int_hdcp).toBe(testDiv.int_hdcp);
      expect(div.hdcp_for).toBe(testDiv.hdcp_for);
      expect(div.sort_order).toBe(testDiv.sort_order);
    })
    it('should NOT get a div by ID when ID is invalid', async () => {
      try {
        const response = await axios.get(url + "/" + 'test');
        expect(response.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT get a div by ID when ID is valid, but not a div ID', async () => {
      try {
        const response = await axios.get(url + "/" + nonDivId);
        expect(response.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should NOT get a div by ID when ID is not found', async () => {
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

  describe('PUT by ID - API: API: /api/divs/:id', () => { 

    const putDiv = {
      ...testDiv,
      tmnt_id: "tmt_fe8ac53dad0f400abe6354210a8f4cd1",
      div_name: "Test Div",
      hdcp_per: .95,
      hdcp_from: 225,
      int_hdcp: false,
      hdcp_for: "Game",
      sort_order: 1
    }

    const sampleDiv = {
      ...initDiv,
      id: '',
      tmnt_id: "tmt_fe8ac53dad0f400abe6354210a8f4cd1",
      div_name: "Test Div",
      hdcp_per: 1,
      hdcp_from: 220,
      int_hdcp: true,
      hdcp_for: "Game",
      sort_order: 1
    }

    beforeAll(async () => {
      // make sure test div is reset in database
      const divJSON = JSON.stringify(testDiv);
      const putResponse = await axios({
        method: "put",
        data: divJSON,
        withCredentials: true,
        url: url + "/" + testDiv.id,
      })
    })

    afterEach(async () => {
      try {
        const divJSON = JSON.stringify(testDiv);
        const putResponse = await axios({
          method: "put",
          data: divJSON,
          withCredentials: true,
          url: url + "/" + testDiv.id,
        })
      } catch (err) {
        if (err instanceof AxiosError) console.log(err.message);
      }
    })

    it('should update a div by ID', async () => { 
      const divJSON = JSON.stringify(putDiv);
      const putResponse = await axios({
        method: "put",
        data: divJSON,
        withCredentials: true,
        url: url + "/" + testDiv.id,
      })
      const div = putResponse.data.div;
      expect(putResponse.status).toBe(200);
      // did not update tmnt_id
      expect(div.tmnt_id).toBe(testDiv.tmnt_id);
      // all other fields updated
      expect(div.div_name).toBe(putDiv.div_name);
      expect(div.hdcp_per).toBe(putDiv.hdcp_per);
      expect(div.hdcp_from).toBe(putDiv.hdcp_from);
      expect(div.int_hdcp).toBe(putDiv.int_hdcp);
      expect(div.hdcp_for).toBe(putDiv.hdcp_for);
      expect(div.sort_order).toBe(putDiv.sort_order);
    }) 
    it('should not update a div when ID is invalid', async () => { 
      try {
        const divJSON = JSON.stringify(putDiv);
        const putResponse = await axios({
          method: "put",
          data: divJSON,
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
    it('should NOT update a div when ID is valid, but not a tmnt ID', async () => {
      try {
        const divJSON = JSON.stringify(putDiv);
        const putResponse = await axios({
          method: "put",
          data: divJSON,
          withCredentials: true,
          url: url + "/" + nonDivId,
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
    it('should NOT update a divby ID when ID is not found', async () => {
      try {
        const divJSON = JSON.stringify(putDiv);
        const putResponse = await axios({
          method: "put",
          data: divJSON,
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
    it('should NOT update a div when div name is blank', async () => { 
      const invalidDiv = {
        ...putDiv,
        div_name: '',
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "put",
          data: divJSON,
          withCredentials: true,
          url: url + "/" + testDiv.id,
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
    it('should NOT update a div when hdcp_per is blank', async () => { 
      const invalidDiv = {
        ...putDiv,
        hdcp_per: '',
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "put",
          data: divJSON,
          withCredentials: true,
          url: url + "/" + testDiv.id,
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
    it('should NOT update a div when hdcp_from is blank', async () => { 
      const invalidDiv = {
        ...putDiv,
        hdcp_from: '',
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "put",
          data: divJSON,
          withCredentials: true,
          url: url + "/" + testDiv.id,
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
    it('should NOT update a div when int_hdcp is null', async () => { 
      const invalidDiv = {
        ...putDiv,
        int_hdcp: null as any,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "put",
          data: divJSON,
          withCredentials: true,
          url: url + "/" + testDiv.id,
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
    it('should NOT update a div when hdcp_for is null', async () => { 
      const invalidDiv = {
        ...putDiv,
        hdcp_for: '',
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "put",
          data: divJSON,
          withCredentials: true,
          url: url + "/" + testDiv.id,
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
    it('should NOT update a div when sort_order is null', async () => { 
      const invalidDiv = {
        ...putDiv,
        sort_order: null as any,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "put",
          data: divJSON,
          withCredentials: true,
          url: url + "/" + testDiv.id,
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
    it('it should NOT update a div when div_name is too long', async () => { 
      const invalidDiv = {
        ...putDiv,
        div_name: 'a'.repeat(51),
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "put",
          data: divJSON,
          withCredentials: true,
          url: url + "/" + testDiv.id,
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
    it('it should NOT update a div when hdcp_per is negative', async () => { 
      const invalidDiv = {
        ...putDiv,
        hdcp_per: -1, 
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "put",
          data: divJSON,
          withCredentials: true,
          url: url + "/" + testDiv.id,
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
    it('it should NOT update a div when hdcp_per is too high', async () => { 
      const invalidDiv = {
        ...putDiv,
        hdcp_per: 2, // 200%
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "put",
          data: divJSON,
          withCredentials: true,
          url: url + "/" + testDiv.id,
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
    it('it should NOT update a div when hdcp_per is not a number', async () => { 
      const invalidDiv = {
        ...putDiv,
        hdcp_per: 'abc' as any,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "put",
          data: divJSON,
          withCredentials: true,
          url: url + "/" + testDiv.id,
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
    it('it should NOT update a div when hdcp_from is negative', async () => { 
      const invalidDiv = {
        ...putDiv,
        hdcp_from: -1, 
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "put",
          data: divJSON,
          withCredentials: true,
          url: url + "/" + testDiv.id,
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
    it('it should NOT update a div when hdcp_from is too high', async () => { 
      const invalidDiv = {
        ...putDiv,
        hdcp_from: 301,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "put",
          data: divJSON,
          withCredentials: true,
          url: url + "/" + testDiv.id,
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
    it('it should NOT update a div when hdcp_from is not an integer', async () => { 
      const invalidDiv = {
        ...putDiv,
        hdcp_from: 244.4,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "put",
          data: divJSON,
          withCredentials: true,
          url: url + "/" + testDiv.id,
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
    it('it should NOT update a div when hdcp_from is not a number', async () => { 
      const invalidDiv = {
        ...putDiv,
        hdcp_from: 'abc' as any,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "put",
          data: divJSON,
          withCredentials: true,
          url: url + "/" + testDiv.id,
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
    it('it should NOT update a div when int_hdcp is not boolean', async () => { 
      const invalidDiv = {
        ...putDiv,
        int_hdcp: 'true' as any,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "put",
          data: divJSON,
          withCredentials: true,
          url: url + "/" + testDiv.id,
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
    it('it should NOT update a div when hdcp_for is not "Game" or "Series"', async () => { 
      const invalidDiv = {
        ...putDiv,
        hdcp_for: 'test',
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "put",
          data: divJSON,
          withCredentials: true,
          url: url + "/" + testDiv.id,
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
    it('it should NOT update a div when sort order is too low', async () => { 
      const invalidDiv = {
        ...putDiv,
        sort_order: 0,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "put",
          data: divJSON,
          withCredentials: true,
          url: url + "/" + testDiv.id,
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
    it('it should NOT update a div when sort order is too high', async () => { 
      const invalidDiv = {
        ...putDiv,
        sort_order: 1234567,
      } 
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "put",
          data: divJSON,
          withCredentials: true,
          url: url + "/" + testDiv.id,
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
    it('it should NOT update a div when sort order is not an integer', async () => { 
      const invalidDiv = {
        ...putDiv,
        sort_order: 1.5,
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "put",
          data: divJSON,
          withCredentials: true,
          url: url + "/" + testDiv.id,
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
    it('it should NOT update a div when tmnt_id + div_name is not unique', async () => { 
      const invalidDiv = {
        ...initDiv,
        id: div3Id,
        tmnt_id: tmnt2Id,
        div_name: 'Scratch',
      }
      const divJSON = JSON.stringify(invalidDiv);
      try {
        const response = await axios({
          method: "put",
          data: divJSON,
          withCredentials: true,
          url: url + "/" + invalidDiv.id,
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
    it('it should update a div with sanitized data', async () => { 
      const toSanitizeDiv = {
        ...putDiv,
        div_name: '<script>' + sampleDiv.div_name + '</script>',
      }
      const divJSON = JSON.stringify(toSanitizeDiv);
      const response = await axios({
        method: "put",
        data: divJSON,
        withCredentials: true,
        url: url + "/" + testDiv.id,
      })
      expect(response.status).toBe(200);
      const puttedDiv = response.data.div;
      expect(puttedDiv.div_name).toEqual(sampleDiv.div_name);
    })

  })

  describe('PATCH by ID - API: /api/divs/:id', () => { 

    beforeAll(async () => {
      // make sure test div is reset in database
      const divJSON = JSON.stringify(testDiv);
      const putResponse = await axios({
        method: "put",
        data: divJSON,
        withCredentials: true,
        url: url + "/" + testDiv.id,
      })
    })
      
    afterEach(async () => {
      try {
        const divJSON = JSON.stringify(testDiv);
        const putResponse = await axios({
          method: "put",
          data: divJSON,
          withCredentials: true,
          url: url + "/" + testDiv.id,
        })
      } catch (err) {
        if (err instanceof AxiosError) console.log(err.message);
      }
    })

    it('should patch a div_name by ID', async () => {
      const patchDiv = {
        ...blankDiv,
        div_name: 'Patched Div Name',
      }
      const divJSON = JSON.stringify(patchDiv);
      const response = await axios({
        method: "patch",
        data: divJSON,
        withCredentials: true,
        url: url + "/" + blankDiv.id,
      })
      expect(response.status).toBe(200);
      const patchedDiv = response.data.div;
      expect(patchedDiv.div_name).toEqual(patchDiv.div_name);
    })
    it('should patch a hdcp_per by ID', async () => {
      const patchDiv = {
        ...blankDiv,
        hdcp_per: .5,
      }
      const divJSON = JSON.stringify(patchDiv);
      const response = await axios({
        method: "patch",
        data: divJSON,
        withCredentials: true,
        url: url + "/" + blankDiv.id,
      })
      expect(response.status).toBe(200);
      const patchedDiv = response.data.div;
      expect(patchedDiv.hdcp_per).toEqual(patchDiv.hdcp_per);
    })
    it('should patch a hdcp_from by ID', async () => {
      const patchDiv = {
        ...blankDiv,
        hdcp_from: 215,
      }
      const divJSON = JSON.stringify(patchDiv);
      const response = await axios({
        method: "patch",
        data: divJSON,
        withCredentials: true,
        url: url + "/" + blankDiv.id,
      })
      expect(response.status).toBe(200);
      const patchedDiv = response.data.div;
      expect(patchedDiv.hdcp_from).toEqual(patchDiv.hdcp_from);
    })
    it('should patch a int_hdcp by ID', async () => {
      const patchDiv = {
        ...blankDiv,
        int_hdcp: false,
      }
      const divJSON = JSON.stringify(patchDiv);
      const response = await axios({
        method: "patch",
        data: divJSON,
        withCredentials: true,
        url: url + "/" + blankDiv.id,
      })
      expect(response.status).toBe(200);
      const patchedDiv = response.data.div;
      expect(patchedDiv.int_hdcp).toEqual(patchDiv.int_hdcp);
    })
    it('should patch hdcp_for by ID', async () => {
      const patchDiv = {
        ...blankDiv,
        hdcp_for: 'Series',
      }
      const divJSON = JSON.stringify(patchDiv);
      const response = await axios({
        method: "patch",
        data: divJSON,
        withCredentials: true,
        url: url + "/" + blankDiv.id,
      })
      expect(response.status).toBe(200);
      const patchedDiv = response.data.div;
      expect(patchedDiv.hdcp_for).toEqual(patchDiv.hdcp_for);
    })
    it('should patch sort_order by ID', async () => {
      const patchDiv = {
        ...blankDiv,
        sort_order: 20,
      }
      const divJSON = JSON.stringify(patchDiv);
      const response = await axios({
        method: "patch",
        data: divJSON,
        withCredentials: true,
        url: url + "/" + blankDiv.id,
      })
      expect(response.status).toBe(200);
      const patchedDiv = response.data.div;
      expect(patchedDiv.sort_order).toEqual(patchDiv.sort_order);
    })
    it('should NOT patch tmnt_id by ID', async () => {
      const patchDiv = {
        ...blankDiv,
        tmnt_id: tmnt2Id,
      } 
      const divJSON = JSON.stringify(patchDiv);
      const response = await axios({
        method: "patch",
        data: divJSON,
        withCredentials: true,
        url: url + "/" + blankDiv.id,
      })
      expect(response.status).toBe(200);
      const patchedDiv = response.data.div;
      // for tmnt_id, compare to blankDiv.tmnt_id
      expect(patchedDiv.tmnt_id).toBe(blankDiv.tmnt_id);
    })
    it('should NOT patch a div when ID is invalid', async () => { 
      try {
        const patchTmnt = {
          ...blankDiv,
          tmnt_name: 'patched div name',
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
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
    it('should NOT patch a div when ID is not found', async () => {
      try {
        const patchTmnt = {
          ...blankDiv,
          tmnt_name: 'patched div name',
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
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
    it('should NOT patch a div when ID is valid, but not a div ID', async () => {
      try {
        const patchTmnt = {
          ...blankDiv,
          tmnt_name: 'updated tmnt name',
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + nonDivId,
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
    it('should NOT patch a div when tmnt_id is blank', async () => {
      try {
        const patchTmnt = {
          ...blankDiv,
          tmnt_id: '',
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankDiv.id,
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
    it('should NOT patch a div when div_name is blank', async () => { 
      try {
        const patchTmnt = {
          ...blankDiv,
          div_name: '',
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankDiv.id,
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
    it('should NOT patch a div when hdcp_per is null', async () => { 
      try {
        const patchTmnt = {
          ...blankDiv,
          hdcp_per: null as any,
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankDiv.id,
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
    it('should NOT patch a div when hdcp_from is null', async () => { 
      try {
        const patchTmnt = {
          ...blankDiv,
          hdcp_from: null as any,
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankDiv.id,
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
    it('should NOT patch a div when int_hdcp is null', async () => { 
      try {
        const patchTmnt = {
          ...blankDiv,
          int_hdcp: null as any,
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankDiv.id,
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
    it('should NOT patch a div when hdcp_for is null', async () => { 
      try {
        const patchTmnt = {
          ...blankDiv,
          hdcp_for: null as any,
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankDiv.id,
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
    it('should NOT patch a div when sort_order is null', async () => { 
      try {
        const patchTmnt = {
          ...blankDiv,
          sort_order: null as any,
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankDiv.id,
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
    it('should NOT patch a div when div_name is too long', async () => { 
      try {
        const patchTmnt = {
          ...blankDiv,
          div_name: 'a'.repeat(256),
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankDiv.id,
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
    it('should NOT patch a div when hdcp_per is negative', async () => { 
      try {
        const patchTmnt = {
          ...blankDiv,
          hdcp_per: -1,
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankDiv.id,
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
    it('should NOT patch a div when hdcp_per is too large', async () => { 
      try {
        const patchTmnt = {
          ...blankDiv,
          hdcp_per: 3,
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankDiv.id,
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
    it('should NOT patch a div when hdcp_per is not a number', async () => { 
      try {
        const patchTmnt = {
          ...blankDiv,
          hdcp_per: 'abc' as any,
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankDiv.id,
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
    it('should NOT patch a div when hdcp_from is negative', async () => { 
      try {
        const patchTmnt = {
          ...blankDiv,
          hdcp_from: -1,
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankDiv.id,
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
    it('should NOT patch a div when hdcp_from is too large', async () => { 
      try {
        const patchTmnt = {
          ...blankDiv,
          hdcp_from: 301,
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankDiv.id,
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
    it('should NOT patch a div when hdcp_from is not an integer', async () => { 
      try {
        const patchTmnt = {
          ...blankDiv,
          hdcp_from: 233.33,
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankDiv.id,
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
    it('should NOT patch a div when hdcp_from is not a number', async () => { 
      try {
        const patchTmnt = {
          ...blankDiv,
          hdcp_from: 'abc' as any,
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankDiv.id,
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
    it('should NOT patch a div when int_hdcp is not a boolean', async () => { 
      try {
        const patchTmnt = {
          ...blankDiv,
          int_hdcp: "true",
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankDiv.id,
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
    it('should NOT patch a div when hdcp_for is not "Game" or "Series"', async () => { 
      try {
        const patchTmnt = {
          ...blankDiv,
          hdcp_for: "test",
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankDiv.id,
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
    it('should NOT patch a div when sort_order is too low', async () => { 
      try {
        const patchTmnt = {
          ...blankDiv,
          sort_order: 0,
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankDiv.id,
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
    it('should NOT patch a div when sort_order is too high', async () => { 
      try {
        const patchTmnt = {
          ...blankDiv,
          sort_order: 1234567,
        } 
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankDiv.id,
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
    it('should NOT patch a div when sort_order is not a number', async () => { 
      try {
        const patchTmnt = {
          ...blankDiv,
          sort_order: 'abc' as any,
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + blankDiv.id,
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
    it('should not patch a div when tmnt_id + div_name is not unique', async () => { 
      try {
        const patchTmnt = {
          ...blankDiv,
          id: div3Id,
          tmnt_id: tmnt2Id,
          div_name: "Scratch",
        }
        const tmntJSON = JSON.stringify(patchTmnt);
        const patchResponse = await axios({
          method: "patch",
          data: tmntJSON,
          withCredentials: true,
          url: url + "/" + patchTmnt.id,
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
    it('should patch a div with a sanitzed div name', async () => { 
      const patchTmnt = {
        ...blankDiv,
        div_name: "    <script>Patched Div Name</script>   ",
      }
      const tmntJSON = JSON.stringify(patchTmnt);
      const patchResponse = await axios({
        method: "patch",
        data: tmntJSON,
        withCredentials: true,
        url: url + "/" + blankDiv.id,
      })
      expect(patchResponse.status).toBe(200);
      const patchedDiv = patchResponse.data.div;
      expect(patchedDiv.div_name).toBe("Patched Div Name");
    })
    it('should patch a div with "Series" for hdcp_for', async () => { 
      const patchTmnt = {
        ...blankDiv,
        hdcp_for: "Series",
      }
      const tmntJSON = JSON.stringify(patchTmnt);
      const patchResponse = await axios({
        method: "patch",
        data: tmntJSON,
        withCredentials: true,
        url: url + "/" + blankDiv.id,
      })
      expect(patchResponse.status).toBe(200);
      const patchedDiv = patchResponse.data.div;
      expect(patchedDiv.hdcp_for).toBe("Series");
    })

  })

  describe('DELETE by id - API: /api/divs/:id', () => {

    const toDelDiv = {
      ...initDiv,
      id: "div_66d39a83d7a84a8c85d28d8d1b2c7a90",
      tmnt_id: "tmt_fe8ac53dad0f400abe6354210a8f4cd1",
      div_name: "Women's",
      hdcp_per: 0.90,
      hdcp_from: 230,
      int_hdcp: true,
      hdcp_for: 'Game',
      sort_order: 4,
    }

    let didDel = false

    beforeEach(() => {
      didDel = false;
    })

    afterEach(async () => {
      if (!didDel) return;
      try {
        const restoredDiv = {
          ...toDelDiv,
          id: postSecret + 'div_66d39a83d7a84a8c85d28d8d1b2c7a90',
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

    it('should delete a div by ID', async () => {
      try {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + toDelDiv.id,
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
    it('should NOT delete a div by ID when ID is invalid', async () => { 
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
    it('should NOT delete a div by ID when ID is not found', async () => { 
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
    it('should NOT delete a div by ID when ID is valid, bit not an div id', async () => { 
      try {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + nonDivId
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
    it('should NOT delete a div by ID when div has child rows', async () => { 
      try {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + testDiv.id
        })  
        expect(delResponse.status).toBe(409);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(409);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })

  })

})