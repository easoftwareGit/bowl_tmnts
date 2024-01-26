import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
import { compare } from "bcrypt";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

const splitName = (name = "") => {
  const [firstName, ...lastName] = name.split(" ").filter(Boolean);
  return {
    firstName: firstName,
    lastName: lastName.join(" "),
  };
};

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        // Handle Auth - start with simple hard coded user
        // const user = { id: "usr_5sbcefb5d314fff1ff5da6521a2fa7bde", email: "adam@email.com", name: 'Adam Smith' }
        // return users

        // if no credentials, return null tells authJs credentials not correct
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // find user in database by matching email
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!user) {
          return null;
        }

        // make sure got password from database (google log in user might not have password)
        if (!user.password || user.password === "") {
          return null;
        }
        // compare the entered password vs the saved password
        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.first_name + " " + user.last_name,
          first_name: user.first_name,
          last_name: user.last_name,
        };
      },
    }),
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    // session & jwt are used for CredentialsProvider (look up user in database)
    // signIn is for GoogleProvider
    session: ({ session, token, user }) => {
      // console.log("Session Callback", { session, token, user });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          first_name: token.first_name,
          last_name: token.last_name,
        },
      };
    },
    jwt: ({ token, user, account }) => {
      // console.log("JWT Callback", { token, user, account });
      if (user) {
        const u = user as unknown as User;
        if (account?.provider === "credentials") {          
          return {
            ...token,
            id: user.id,
            first_name: u.first_name,
            last_name: u.last_name,
          };
          // } else if (account?.provider === 'google') {
        } else {
          // using else now becsue only oauth is google
          // extract first and last name from name
          let firstName
          let lastName
          try {
            if (user?.name) {
              let firstPart = user.name.split(' ');
              firstName = firstPart[0];
              lastName = user.name.substring(firstName.length + 1);
            } else {
              firstName = ''
              lastName = '';
            }
            if (!firstName || firstName === '') {
              firstName = 'none'
            }
            if (!lastName || lastName === '') {
              lastName = 'none'
            }            
          } catch (error) {
            firstName = 'none'
            lastName = 'none'
          }
          return {
            ...token,
            id: user.id,
            first_name: firstName,
            last_name: lastName
          }          
        }
      }
      return token;
    },
    async signIn({ account, profile, user }) {
      if (account?.provider === "credentials") {
        if (!user) {
          return false;
        }
        return true;
        // } else if (account?.provider === 'google') {        
      } else { 
        // using else now becsue only oauth is google
        if (!profile?.email) {
          throw new Error("No Profile email");
        }

        // need to extract first name and last name from profile
        const googleInfo = profile as unknown as GoogleProfile;
        // console.log("GoogleInfo", googleInfo);
        let fName = googleInfo.given_name;
        if (!fName || fName === "") {
          fName = "none";
        }
        let lName = googleInfo.family_name;
        if (!lName || lName === "") {
          lName = "none";
        }
        if (fName === "none" && lName === "none" && profile?.name) {
          fName = profile.name;
        }

        // use upsert to UPdate or inSERT user in database
        await prisma.user.upsert({
          where: {
            email: googleInfo.email,
          },
          create: {
            email: googleInfo.email,
            first_name: fName,
            last_name: lName,
          },
          update: {
            first_name: fName,
            last_name: lName,
          },
        });
        // user was authenticated and upserted
        return true;
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
