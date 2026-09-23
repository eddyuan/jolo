// database.types.ts is generated — regenerate with `pnpm db:types` from the repo root.
export type {
  CompositeTypes,
  Database,
  Enums,
  Json,
  Tables,
  TablesInsert,
  TablesUpdate,
} from './database.types'

import type { Tables } from './database.types'

export type Profile = Tables<'profiles'>
