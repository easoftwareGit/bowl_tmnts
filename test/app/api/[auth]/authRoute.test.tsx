import axios, { AxiosError } from "axios";
import { baseUsersApi, baseRegisterApi } from "@/lib/db/apiPaths";
import { testBaseUsersApi, testBaseRegisterApi } from "../../../testApi";
import { userType } from "@/lib/types/types";
import { initUser } from "@/lib/db/initVals";
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

describe('auth route', () => { 

  const user1email = "adam@email.com"

  describe('register route POST', () => { 
    const url = testBaseRegisterApi.startsWith("undefined")
      ? baseRegisterApi
      : testBaseRegisterApi;

    const userUrl = testBaseUsersApi.startsWith("undefined")
      ? baseUsersApi
      : testBaseUsersApi;
    
    let createdUserId = "";
    
    const registerUser: userType = {
      ...initUser,
      email: "test@email.com",
      first_name: "Zach",
      last_name: "Jones",
      password: "Test123!",
      phone: "+18005559999",
    }
    
    beforeAll(async () => {
      const response = await axios.get(userUrl);
      const users = response.data.users;
      const toDel = users.find((u: userType) => u.email === 'test@email.com');
      if (toDel) {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: userUrl + "/" + toDel.id
        });
        if (delResponse.status === 200) {
          console.log("deleted user with ID: " + createdUserId);
        } else {
          console.log("failed to delete user with ID: " + createdUserId);
        }
      }
    })

    beforeEach(() => {
      createdUserId = "";
    })

    afterEach(async () => {
      if (createdUserId !== "") {
        const delResponse = await axios({
          method: "delete",
          withCredentials: true,
          url: userUrl + "/" + createdUserId,
        });
        if (delResponse.status === 200) {
          console.log("deleted user with ID: " + createdUserId);
        } else {
          console.log("failed to delete user with ID: " + createdUserId);
        }
      }
      createdUserId = "";
    })

    it('should register a new user', async () => {
      const userJSON = JSON.stringify(registerUser);
      const response = await axios({
        method: "post",
        data: userJSON,
        withCredentials: true,
        url: url,
      });
      expect(response.status).toBe(201);
      const postedUser: userType = response.data.user;
      createdUserId = postedUser.id;
      expect(postedUser.first_name).toEqual(registerUser.first_name);
      expect(postedUser.last_name).toEqual(registerUser.last_name);
      expect(postedUser.email).toEqual(registerUser.email);
      expect(postedUser.phone).toEqual(registerUser.phone);
      expect(postedUser.role).toEqual("USER");
      expect(isValidBtDbId(postedUser.id, 'usr')).toBeTruthy();
    })
    it('should register a new user with a missing phone', async () => {
      const validUser = {
        ...registerUser,
        phone: "",
      }
      const userJSON = JSON.stringify(validUser);
      const response = await axios({
        method: "post",
        data: userJSON,
        withCredentials: true,
        url: url,
      });
      expect(response.status).toBe(201);
      const postedUser: userType = response.data.user;
      createdUserId = postedUser.id;
      expect(postedUser.phone).toEqual("");
    })
    it('should not register a new user with a missing first name', async () => {
      const invalidUser = {
        ...registerUser,
        first_name: "",
      }
      const userJSON = JSON.stringify(invalidUser);
      try {
        const response = await axios({
          method: "post",
          data: userJSON,
          withCredentials: true,
          url: url,
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
    it('should not register a new user with a missing last name', async () => {
      const invalidUser = {
        ...registerUser,
        last_name: "",
      }
      const userJSON = JSON.stringify(invalidUser);
      try {
        const response = await axios({
          method: "post",
          data: userJSON,
          withCredentials: true,
          url: url,
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
    it('should not register a new user with a missing email', async () => {
      const invalidUser = {
        ...registerUser,
        email: "",
      }
      const userJSON = JSON.stringify(invalidUser);
      try {
        const response = await axios({
          method: "post",
          data: userJSON,
          withCredentials: true,
          url: url,
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
    it('should not register a new user with a missing password', async () => {
      const invalidUser = {
        ...registerUser,
        password: "",
      }
      const userJSON = JSON.stringify(invalidUser);
      try {
        const response = await axios({
          method: "post",
          data: userJSON,
          withCredentials: true,
          url: url,
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
    it('should not register a new user with an invalid email', async () => {
      const invalidUser = {
        ...registerUser,
        email: "test",
      }
      const userJSON = JSON.stringify(invalidUser);
      try {
        const response = await axios({
          method: "post",
          data: userJSON,
          withCredentials: true,
          url: url,
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
    it('should not register a new user with an invalid phone', async () => {
      const invalidUser = {
        ...registerUser,
        phone: "test",
      }
      const userJSON = JSON.stringify(invalidUser);
      try {
        const response = await axios({
          method: "post",
          data: userJSON,
          withCredentials: true,
          url: url,
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
    it('should not register a new user with an invalid password', async () => {
      const invalidUser = {
        ...registerUser,
        password: "test",
      }
      const userJSON = JSON.stringify(invalidUser);
      try {
        const response = await axios({
          method: "post",
          data: userJSON,
          withCredentials: true,
          url: url,
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
    it('should not register a new user with a duplicate email', async () => {
      const invalidUser = {
        ...registerUser,
        email: user1email,
      }
      const userJSON = JSON.stringify(invalidUser);
      try {
        const response = await axios({
          method: "post",
          data: userJSON,
          withCredentials: true,
          url: url,
        });
        expect(response.status).toBe(409);
      } catch (err) {
        if (err instanceof AxiosError) {
          expect(err.response?.status).toBe(409);
        } else {
          expect(true).toBeFalsy();
        }
      }
    })
    it('should register a new user with sanitized data', async () => {
      const toSanitizeUser = {
        ...registerUser,
        first_name: "    <script>" + registerUser.first_name + "</script>   ",
        last_name: "%3Cdiv%3E" + registerUser.last_name + "%3C/div%3E%20%3Cp%3E!%3C/p%3E",
      }
      const userJSON = JSON.stringify(toSanitizeUser);
      const response = await axios({
        method: "post",
        data: userJSON,
        withCredentials: true,
        url: url,
      });
      const postedUser: userType = response.data.user;
      createdUserId = postedUser.id;
      expect(response.status).toBe(201);
      expect(postedUser.first_name).toEqual(registerUser.first_name);
      expect(postedUser.last_name).toEqual(registerUser.last_name);
      expect(postedUser.email).toEqual(registerUser.email);
      expect(postedUser.phone).toEqual(registerUser.phone);
    })
  })
  
})