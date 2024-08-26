import axios, { AxiosError } from "axios";
import { baseBowlsApi } from "@/lib/db/apiPaths";
import { testBaseBowlsApi } from "../../../testApi";
import { bowlType } from "@/lib/types/types";
import { initBowl } from "@/lib/db/initVals";
import { Bowl } from "@prisma/client";
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

const url = testBaseBowlsApi.startsWith("undefined")
  ? baseBowlsApi
  : testBaseBowlsApi;    

describe('Bowls - API: /api/bowls', () => { 

  const testBowl: bowlType = {
    ...initBowl,
    id: "bwl_561540bd64974da9abdd97765fdb3659",
    bowl_name: "Earl Anthony's Dublin Bowl",
    city: "Dublin",
    state: "CA",
    url: "https://www.earlanthonysdublinbowl.com",
  }

  const notFoundId = "bwl_01234567890123456789012345678901";
  const notfoundUserId = "usr_01234567890123456789012345678901";
  const nonBowlId = "tmt_01234567890123456789012345678901";

  const bowl2Id = "bwl_8b4a5c35ad1247049532ff53a12def0a"

  const testBowlName = "Test Bowl";

  describe('GET', () => { 

    beforeAll(async () => { 
      const response = await axios.get(url);
      const users = response.data.bowls;
      const toDel = users.find((b: bowlType) => b.bowl_name === testBowlName);
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

    it('should get all bowls', async () => { 
      const response = await axios.get(url);
      expect(response.status).toBe(200);
      // 4 rows in prisma/seed.ts 
      expect(response.data.bowls).toHaveLength(4);
    })

  })

  describe('POST', () => { 

    const bowlToPost: bowlType = {
      ...initBowl,
      id: '',
      bowl_name: testBowlName,
      city: "Somehwere",
      state: "CA",
      url: "https://www.google.com",
    }

    let createdBowlId = ""

    beforeAll(async () => { 
      const response = await axios.get(url);
      const users = response.data.bowls;
      const toDel = users.find((b: bowlType) => b.bowl_name === testBowlName);
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
      createdBowlId = "";
    })

    afterEach(async () => {
      if (createdBowlId) {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + createdBowlId  
        })
      }
      createdBowlId = "";
    })
    
    it('should create a new bowl', async () => { 
      const bowlJSON = JSON.stringify(bowlToPost);
      const response = await axios({
        method: "post",
        data: bowlJSON,
        withCredentials: true,
        url: url
      });
      expect(response.status).toBe(201);
      const postedBowl = response.data.bowl;
      createdBowlId = postedBowl.id;
      expect(postedBowl.bowl_name).toBe(bowlToPost.bowl_name);
      expect(postedBowl.city).toBe(bowlToPost.city);
      expect(postedBowl.state).toBe(bowlToPost.state);
      expect(postedBowl.url).toBe(bowlToPost.url);
      expect(isValidBtDbId(postedBowl.id, 'bwl')).toBeTruthy();
    })
    it('should create a new bowl with provided bowl_id', async () => {
      const supIdBowl = {
        ...bowlToPost,
        id: postSecret + notFoundId,
      }
      const bowlJSON = JSON.stringify(supIdBowl);
      const response = await axios({
        method: "post",
        data: bowlJSON,
        withCredentials: true,
        url: url
      });
      expect(response.status).toBe(201);
      const postedBowl = response.data.bowl;
      createdBowlId = postedBowl.id;
      expect(postedBowl.id).toEqual(notFoundId);
    })
    it('should not create a new bowl with missing bowl name', async () => {
      const invalidBowl = {
        ...bowlToPost,
        bowl_name: "",
      }
      const bowlJSON = JSON.stringify(invalidBowl);
      try {
        const response = await axios({
          method: "post",
          data: bowlJSON,
          withCredentials: true,
          url: url
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should not create a new bowl with missing city', async () => {
      const invalidBowl = {
        ...bowlToPost,
        city: "",
      }
      const bowlJSON = JSON.stringify(invalidBowl);
      try {
        const response = await axios({
          method: "post",
          data: bowlJSON,
          withCredentials: true,
          url: url
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should not create a new bowl with missing state', async () => {
      const invalidBowl = {
        ...bowlToPost,
        state: "",
      }
      const bowlJSON = JSON.stringify(invalidBowl);
      try {
        const response = await axios({
          method: "post",
          data: bowlJSON,
          withCredentials: true,
          url: url
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should not create a new bowl with missing url', async () => {
      const invalidBowl = {
        ...bowlToPost,
        url: "",
      }
      const bowlJSON = JSON.stringify(invalidBowl);
      try {
        const response = await axios({
          method: "post",
          data: bowlJSON,
          withCredentials: true,
          url: url
        });
        expect(response.status).toBe(422);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(422);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should create a new bowl with sanitized data', async () => {
      const toSanitizeBowl = {
        ...bowlToPost,
        bowl_name: "  <script>" + bowlToPost.bowl_name + "</script>  ",
        city: "%3Cdiv%3E" + bowlToPost.city + "%3C/div%3E%20%3Cp%3E!%3C/p%3E",
        state: "***" + bowlToPost.state + " **** ",
      }
      const bowlJSON = JSON.stringify(toSanitizeBowl);
      const response = await axios({
        method: "post",
        data: bowlJSON,
        withCredentials: true,
        url: url
      });
      const postedBowl = response.data.bowl;
      createdBowlId = postedBowl.id;
      expect(response.status).toBe(201);
      expect(postedBowl.bowl_name).toBe(bowlToPost.bowl_name);
      expect(postedBowl.city).toBe(bowlToPost.city);
      expect(postedBowl.state).toBe(bowlToPost.state);
      expect(postedBowl.url).toBe(bowlToPost.url);
      expect(isValidBtDbId(postedBowl.id, 'bwl')).toBeTruthy();
    })

  })

  describe('GET by ID - API: API: /api/bowls/:id', () => { 

    it('should get a bowl by ID', async () => {
      const response = await axios.get(url + "/" + testBowl.id);
      const bowl = response.data.bowl;
      expect(response.status).toBe(200);
      expect(bowl.id).toBe(testBowl.id);
      expect(bowl.bowl_name).toBe(testBowl.bowl_name);
      expect(bowl.city).toBe(testBowl.city);
      expect(bowl.state).toBe(testBowl.state);
      expect(bowl.url).toBe(testBowl.url);
    })
    it('should not get a bowl by ID when ID is invalid', async () => {
      try {
        const response =await axios.get(url + "/invalid");
        expect(response.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should not get a bowl by ID when ID is valid, but not a bowl ID', async () => { 
      try {
        const response = await axios.get(url + '/' +nonBowlId);
        expect(response.status).toBe(404);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(404);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should not get a bowl by ID when ID is not found', async () => { 
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

  describe('PUT by ID - API: API: /api/bowls/:id', () => { 

    const putBowl = {
      ...testBowl,
      bowl_name: "Updated Bowl Name",
      city: "Updated City",
      state: "US",
      url: "https://www.updated.com",
    }

    const sampleBowl = {
      ...putBowl,
      id: '',
      bowl_name: "Test Bowl Name",
      city: "Test City",
      state: "TS",
      url: "https://www.test.com",
    }

    beforeAll(async () => {
      // make sure test bowl is reset in database
      const bowlJSON = JSON.stringify(testBowl);
      const putResponse = await axios({
        method: "put",
        data: bowlJSON,
        withCredentials: true,
        url: url + "/" + testBowl.id,
      })
    })

    afterEach(async () => {
      try {
        const bowlJSON = JSON.stringify(testBowl);  
        const putResponse = await axios({
          method: "put",
          data: bowlJSON,
          withCredentials: true,
          url: url + "/" + testBowl.id,
        })
      } catch (err) {
        if (err instanceof AxiosError) console.log(err.message);
      }
    })

    it('should update a bowl by ID', async () => { 
      const bowlJSON = JSON.stringify(putBowl);
      const response = await axios({
        method: "put",
        data: bowlJSON,
        withCredentials: true,
        url: url + "/" + testBowl.id,
      })
      const bowl = response.data.bowl;
      expect(response.status).toBe(200);
      expect(bowl.id).toBe(putBowl.id);
      expect(bowl.bowl_name).toBe(putBowl.bowl_name);
      expect(bowl.city).toBe(putBowl.city);
      expect(bowl.state).toBe(putBowl.state);
      expect(bowl.url).toBe(putBowl.url);
    })
    it('should not update a bowl by ID when ID is invalid', async () => {
      try {
        const bowlJSON = JSON.stringify(putBowl);
        const response = await axios({
          method: "put",
          data: bowlJSON,
          withCredentials: true,
          url: url + "/test",
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
    it('should not update a bowl by ID when ID is valid, but not a bowl ID', async () => { 
      try {
        const bowlJSON = JSON.stringify(putBowl);
        const response = await axios({
          method: "put",
          data: bowlJSON,
          withCredentials: true,
          url: url + nonBowlId,
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
    it('should not update a bowl by ID when ID is not found', async () => { 
      try {
        const bowlJSON = JSON.stringify(putBowl);
        const response = await axios({
          method: "put",
          data: bowlJSON,
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
    it('should not update a bowl by ID when bowl name is missing', async () => {
      const invalidBowl = {
        ...putBowl,
        bowl_name: "",
      }
      const bowlJSON = JSON.stringify(invalidBowl);
      try {
        const response = await axios({
          method: "put",
          data: bowlJSON,
          withCredentials: true,
          url: url + "/" + testBowl.id,
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
    it('should not update a bowl by ID when city is missing', async () => {
      const invalidBowl = {
        ...putBowl,
        city: "",
      }
      const bowlJSON = JSON.stringify(invalidBowl);
      try {
        const response = await axios({
          method: "put",
          data: bowlJSON,
          withCredentials: true,
          url: url + "/" + testBowl.id,
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
    it('should not update a bowl by ID when state is missing', async () => {
      const invalidBowl = { 
        ...putBowl,
        state: "",
      }
      const bowlJSON = JSON.stringify(invalidBowl);
      try {
        const response = await axios({
          method: "put",
          data: bowlJSON,
          withCredentials: true,
          url: url + "/" + testBowl.id,
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
    it('should not update a bowl by ID when url is missing', async () => {
      const invalidBowl = {
        ...putBowl,
        url: "",
      }
      const bowlJSON = JSON.stringify(invalidBowl);
      try {
        const response = await axios({
          method: "put",
          data: bowlJSON,
          withCredentials: true,
          url: url + "/" + testBowl.id,
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
    it('should not update a bowl by ID when url is invalid', async () => {
      const invalidBowl = {
        ...putBowl,
        url: "invalid url",
      }
      const bowlJSON = JSON.stringify(invalidBowl);
      try {
        const response = await axios({
          method: "put",
          data: bowlJSON,
          withCredentials: true,
          url: url + "/" + testBowl.id,
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
    it('should update a bowl by ID with sanitized data', async () => {
      const sanitizedBowl = {
        ...putBowl,
        bowl_name: "   <script>" + sampleBowl.bowl_name + "</script>  ",
        city: "%3Cdiv%3E" + sampleBowl.city + "%3C/div%3E%20%3Cp%3E!%3C/p%3E",
        state: "**** " + sampleBowl.state + " ****",  
        url: "http://example.com/<script>alert('XSS')</script>"
      }
      const bowlJSON = JSON.stringify(sanitizedBowl);
      const response = await axios({
        method: "put",
        data: bowlJSON,
        withCredentials: true,
        url: url + "/" + testBowl.id,
      })
      expect(response.status).toBe(200);
      const bowl = response.data.bowl;
      expect(bowl.bowl_name).toBe(sampleBowl.bowl_name);
      expect(bowl.city).toBe(sampleBowl.city);
      expect(bowl.state).toBe(sampleBowl.state);
      expect(bowl.url).toBe("http://example.com/%3Cscript%3Ealert('XSS')%3C/script%3E");
    })

  })

  describe('PATCH by ID - API: API: /api/bowls/:id', () => {     

    beforeAll(async () => {
      // make sure test bowl is reset in database
      const bowlJSON = JSON.stringify(testBowl);
      const putResponse = await axios({
        method: "patch",
        data: bowlJSON,
        withCredentials: true,
        url: url + "/" + testBowl.id,
      })
    })

    afterEach(async () => {
      try {
        const bowlJSON = JSON.stringify(testBowl);
        const putResponse = await axios({
          method: "patch",
          data: bowlJSON,
          withCredentials: true,
          url: url + "/" + testBowl.id,
        })
      } catch (err) {
        if (err instanceof AxiosError) console.log(err.message);
      }
    })

    it('should patch a bowl name in a bowl by ID', async () => {
      const bowlJSON = JSON.stringify({
        ...testBowl,
        bowl_name: "new name",
      })
      const response = await axios({
        method: "patch",
        data: bowlJSON,
        withCredentials: true,
        url: url + "/" + testBowl.id,
      })
      const patchedBowl = response.data.bowl;
      expect(response.status).toBe(200);
      expect(patchedBowl.bowl_name).toBe("new name");
    })
    it('should patch a bowl city in a bowl by ID', async () => {
      const bowlJSON = JSON.stringify({
        ...testBowl,
        city: "new city",
      })
      const response = await axios({
        method: "patch",
        data: bowlJSON,
        withCredentials: true,
        url: url + "/" + testBowl.id,
      })
      const patchedBowl = response.data.bowl;
      expect(response.status).toBe(200);
      expect(patchedBowl.city).toBe("new city");
    })
    it('should patch a bowl state in a bowl by ID', async () => {
      const bowlJSON = JSON.stringify({
        ...testBowl,
        state: "NS",
      })
      const response = await axios({
        method: "patch",
        data: bowlJSON,
        withCredentials: true,
        url: url + "/" + testBowl.id,
      })
      const patchedBowl = response.data.bowl;
      expect(response.status).toBe(200);
      expect(patchedBowl.state).toBe("NS");
    })
    it('should patch a bowl url in a bowl by ID', async () => {
      const bowlJSON = JSON.stringify({
        ...testBowl,
        url: "http://newurl.com",
      })
      const response = await axios({
        method: "patch",
        data: bowlJSON,
        withCredentials: true,
        url: url + "/" + testBowl.id,
      })
      const patchedBowl = response.data.bowl;
      expect(response.status).toBe(200);
      expect(patchedBowl.url).toBe("http://newurl.com");
    })
    it('should not patch a bowl by ID when ID is invalid', async () => {
      try {
        const bowlJSON = JSON.stringify({
          ...testBowl,
          bowl_name: "new name",
        })
        const response = await axios({
          method: "patch",
          data: bowlJSON,
          withCredentials: true,
          url: url + "/test",
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
    it('should not patch a bowl by ID when ID is not found', async () => {
      try {
        const bowlJSON = JSON.stringify({
          ...testBowl,
          bowl_name: "new name",
        })
        const response = await axios({
          method: "patch",
          data: bowlJSON,
          withCredentials: true,
          url: url + "/" + nonBowlId,
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
    it('should not patch a bowl by ID when ID is valid, but not a bowl ID', async () => {
      try {
        const bowlJSON = JSON.stringify({
          ...testBowl,
          bowl_name: "new name",
        })
        const response = await axios({
          method: "patch",
          data: bowlJSON,
          withCredentials: true,
          url: url + nonBowlId,
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
    it('should not patch a bowl by ID when bowl name is missing', async () => {
      try {
        const bowlJSON = JSON.stringify({
          ...testBowl,
          bowl_name: "",
        })
        const response = await axios({
          method: "patch",
          data: bowlJSON,
          withCredentials: true,
          url: url + "/" + testBowl.id,
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
    it('should not patch a bowl by ID when city is missing', async () => {
      try {
        const bowlJSON = JSON.stringify({
          ...testBowl,
          city: "",
        })
        const response = await axios({
          method: "patch",
          data: bowlJSON,
          withCredentials: true,
          url: url + "/" + testBowl.id,
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
    it('should not patch a bowl by ID when state is missing', async () => {
      try {
        const bowlJSON = JSON.stringify({
          ...testBowl,
          state: "",
        })
        const response = await axios({
          method: "patch",
          data: bowlJSON,
          withCredentials: true,
          url: url + "/" + testBowl.id,
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
    it('should not patch a bowl by ID when url is missing', async () => {
      try {
        const bowlJSON = JSON.stringify({
          ...testBowl,
          url: "",
        })
        const response = await axios({
          method: "patch",
          data: bowlJSON,
          withCredentials: true,
          url: url + "/" + testBowl.id,
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
    it('should not patch a bowl by ID when bowl name is too long', async () => {
      try {
        const bowlJSON = JSON.stringify({
          ...testBowl,
          bowl_name: "a".repeat(51),
        })
        const response = await axios({
          method: "patch",
          data: bowlJSON,
          withCredentials: true,
          url: url + "/" + testBowl.id,
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
    it('should not patch a bowl by ID when city is too long', async () => {
      try {
        const bowlJSON = JSON.stringify({
          ...testBowl,
          city: "a".repeat(51),
        })
        const response = await axios({
          method: "patch",
          data: bowlJSON,
          withCredentials: true,
          url: url + "/" + testBowl.id,
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
    it('should not patch a bowl by ID when state is too long', async () => {
      try {
        const bowlJSON = JSON.stringify({
          ...testBowl,
          state: "a".repeat(51),
        })
        const response = await axios({
          method: "patch",
          data: bowlJSON,
          withCredentials: true,
          url: url + "/" + testBowl.id,
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
    it('should not patch a bowl by ID when url is too long', async () => {
      try {
        const bowlJSON = JSON.stringify({
          ...testBowl,
          url: "a".repeat(2500),
        })
        const response = await axios({
          method: "patch",
          data: bowlJSON,
          withCredentials: true,
          url: url + "/" + testBowl.id,
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
    it('should patch a bowl by ID with sanitized bowl name', async () => {
      const bowlJSON = JSON.stringify({
        ...testBowl,
        bowl_name: "<script>alert(1)</script>",
      })
      const response = await axios({
        method: "patch",
        data: bowlJSON,
        withCredentials: true,
        url: url + "/" + testBowl.id,
      })
      const patchedBowl = response.data.bowl;
      expect(response.status).toBe(200);
      expect(patchedBowl.bowl_name).toBe("alert1");
    })
    it('should patch a bowl by ID with sanitized city', async () => {
      const bowlJSON = JSON.stringify({
        ...testBowl,
        city: "   test city  ****",
      })
      const response = await axios({
        method: "patch",
        data: bowlJSON,
        withCredentials: true,
        url: url + "/" + testBowl.id,
      })
      const patchedBowl = response.data.bowl;
      expect(response.status).toBe(200);
      expect(patchedBowl.city).toBe("test city");
    })
    it('should patch a bowl by ID with sanitized state', async () => {
      const bowlJSON = JSON.stringify({
        ...testBowl,
        state: "   TS  ****",
      })
      const response = await axios({
        method: "patch",
        data: bowlJSON,
        withCredentials: true,
        url: url + "/" + testBowl.id,
      })
      const patchedBowl = response.data.bowl;
      expect(response.status).toBe(200);
      expect(patchedBowl.state).toBe("TS");
    })
    it('should patch a bowl by ID with sanitized url', async () => {
      const bowlJSON = JSON.stringify({
        ...testBowl,
        url: "http://example.com/<script>alert('XSS')</script>",
      })
      const response = await axios({
        method: "patch",
        data: bowlJSON,
        withCredentials: true,
        url: url + "/" + testBowl.id,
      })
      const patchedBowl = response.data.bowl;
      expect(response.status).toBe(200);
      expect(patchedBowl.url).toBe("http://example.com/%3Cscript%3Ealert('XSS')%3C/script%3E");
    })
    
  })

  describe('DELETE by ID - API: API: /api/bowls/:id', () => { 

    const toDelBowl = {
      ...initBowl,
      id: "bwl_91c6f24db58349e8856fe1d919e54b9e",
      bowl_name: "Diablo Lanes",
      city: "Concord",
      state: "CA",
      url: "http://diablolanes.com/",
    }

    let didDel = false

    beforeEach(() => {
      didDel = false;
    })

    afterEach(async () => {
      if (!didDel) return;
      // if deleted bowl, add bowl back
      try {
        const restoreUser = {
          ...toDelBowl,
          id: postSecret + "bwl_91c6f24db58349e8856fe1d919e54b9e",
        }
        const bowlJSON = JSON.stringify(restoreUser);
        const response = await axios({
          method: "post",
          data: bowlJSON,
          withCredentials: true,
          url: url,
        });
        console.log('response.status: ', response.status)
      } catch (err) {
        if (err instanceof Error) console.log(err.message);
      }
    })

    it('should delete a bowl by ID', async () => {
      try {
        const response = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + toDelBowl.id,
        })
        expect(response.status).toBe(200);
        didDel = true;
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(200);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should not delete a bowl by ID when ID is invalid', async () => {
      try {
        const response = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/invalid",
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
    it('should not delete a bowl by ID when ID is valid, but not a bowl ID', async () => {
      try {
        const response = await axios({
          method: "delete",
          withCredentials: true,
          url: url + nonBowlId,
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
    it('should not delete a bowl by ID when ID is not found', async () => {
      try {
        const response = await axios({
          method: "delete",
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
    it('should not delete a bowl by ID when bowl has child rows', async () => {
      try {
        const response = await axios({
          method: "delete",
          withCredentials: true,
          url: url + "/" + testBowl.id,
        })
        expect(response.status).toBe(409);
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