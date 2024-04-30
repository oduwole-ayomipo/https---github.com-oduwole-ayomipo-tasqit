// eslint-disable-next-line
export const database = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  searchPath: ['knex', 'public']
})

declare module 'knex/types/tables' {
  interface UserProfile {
    id: number
    username: string
    password: string
    email: string
    created_at: string
    last_login_at: string
  }

  interface Table {
    users: UserProfile
  }
}
