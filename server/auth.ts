import { betterAuth } from 'better-auth';
import { LibsqlDialect } from '@libsql/kysely-libsql';
import { createClient } from "@libsql/client";

const client = createClient({
  url: "file:test.db",
})

// @ts-ignore
const dialect = new LibsqlDialect({ client })

export const auth = betterAuth({
  database: {
    dialect,
    type: 'sqlite',
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }
  }
});