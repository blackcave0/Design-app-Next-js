/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


// Suggested code may be subject to a license. Learn more: ~LicenseLog:135327429.
export const authOptions: NextAuthOptions = {
  // Suggested code may be subject to a license. Learn more: ~LicenseLog:3479965696.
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any): Promise<any> {
        if (!credentials) {
          throw new Error("Invalid credentials ");
        }
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ]
          })
          if (!user) {
            throw new Error("Invalid credentials ");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account ");
          }
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordCorrect) {
            throw new Error("Invalid credentials ");
          }
          if (user && isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Invalid credentials ");
          }

        } catch (err) {
          // throw new Error(err as unknown as string);
          throw new Error(err instanceof Error ? err.message : "Error during authentication");

        }

      }

    })
  ],
  callbacks : {
    async jwt({token, user}){
      if(user) {
        //! this is important if getting error while initializing of these value. create a file in folder [types] as name file [next-auth.d.ts] 
        token._id = user._id?.toString()
        token.isVerified = user.isVerified
        token.isAcceptingMessages = user.isAcceptingMessages
        token.username = user.username
      }
      return token
    },
    async session({session, token}){
      if(token) {
        session.user._id = token._id?.toString()
        session.user.isVerified = token.isVerified
        session.user.isAcceptingMessages = token.isAcceptingMessages
        session.user.username = token.username
      }
      return session
    }
  },
  pages : {
    signIn : '/sign-in'
  },
  session : {
    strategy : 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
  
}
