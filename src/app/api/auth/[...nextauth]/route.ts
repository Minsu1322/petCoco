// src > app > api > auth > [...nextauth] > route.ts

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import KakaoProvider from "next-auth/providers/kakao";

const handler = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "User Name",
          type: "text"
        }
      },
      async authorize(credentials) {
        const timestamp = new Date().getTime().toString();
        const uniqueId = timestamp.slice(timestamp.length - 10);
        const user = {
          id: uniqueId,
          name: credentials?.username
        };

        if (user) {
          return user;
        }

        return null;
      }
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_MAPS_API!,
      clientSecret: process.env.KAKAO_MAPS_CONVERT_API_KEY!
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST };
