import { db, Db } from './db';

export type Context = {
  db: Db;
};

export const context = {
  db,
};
