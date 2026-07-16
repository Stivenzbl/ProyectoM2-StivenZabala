import { describe, it, expect } from 'vitest'
import { getDbConfig } from '../src/config/dbConnect.js'

describe('getDbConfig', () => {
  it('debe leer variables de entorno estilo Railway', () => {
    const env = {
      PGHOST: 'db.internal',
      PGPORT: '5432',
      PGDATABASE: 'railwaydb',
      PGUSER: 'railway',
      PGPASSWORD: 'secret'
    }

    expect(getDbConfig(env)).toMatchObject({
      host: 'db.internal',
      port: 5432,
      database: 'railwaydb',
      user: 'railway',
      password: 'secret'
    })
  })

  it('debe leer DATABASE_URL cuando viene en el entorno', () => {
    const env = {
      DATABASE_URL: 'postgresql://user:pass@host.example.com:6543/appdb'
    }

    expect(getDbConfig(env)).toMatchObject({
      host: 'host.example.com',
      port: 6543,
      database: 'appdb',
      user: 'user',
      password: 'pass'
    })
  })
})
