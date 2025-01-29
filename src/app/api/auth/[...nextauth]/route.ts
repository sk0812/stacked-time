import NextAuth, { type AuthOptions } from 'next-auth';
import type { DefaultSession } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/mongodb';
import UserModel from '@/models/User';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

interface CustomUser {
  id: string;
  email: string;
  name: string;
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession['user']
  }
  interface User {
    id: string;
    email: string;
    name: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials');
        }

        try {
          await connectToDatabase();
          console.log('Connected to MongoDB, checking connection:', mongoose.connection.readyState);
          
          if (!mongoose.connection || !mongoose.connection.db) {
            throw new Error('Database connection not established');
          }

          console.log('Current database:', mongoose.connection.db.databaseName);
          
          // List all collections
          const collections = await mongoose.connection.db.collections();
          console.log('Available collections:', collections.map(c => c.collectionName));
          
          // Check if users collection exists
          const usersCollection = collections.find(c => c.collectionName === 'users');
          if (!usersCollection) {
            console.log('Users collection not found!');
            throw new Error('Users collection not found');
          }

          console.log('Attempting to find user with email:', credentials.email);
          const user = await UserModel.findOne({ email: credentials.email });
          console.log('Query result:', user);
          
          if (!user) {
            console.log('No user found with email:', credentials.email);
            throw new Error('Invalid credentials');
          }

          console.log('User found, comparing passwords...');
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          console.log('Password valid:', isPasswordValid);
          if (!isPasswordValid) {
            throw new Error('Invalid credentials');
          }

          console.log('Authentication successful');
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name
          } as any;
        } catch (error) {
          console.error('Detailed auth error:', error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // After sign in, redirect to dashboard
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/dashboard`;
      }
      return url;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/auth',
    error: '/auth?error=true'
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };