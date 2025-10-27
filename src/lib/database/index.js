import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema.js';

// Crea connessione database
const sqlite = new Database('scarpari.db');
export const db = drizzle(sqlite, { schema });

// Esegui migrazioni (crea tabelle)
migrate(db, { migrationsFolder: 'drizzle' });

// Funzioni helper per il database
export const database = {
  // Giocatori
  async getGiocatori() {
    return db.select().from(schema.giocatori).all();
  },
  
  async addGiocatore(giocatore) {
    const result = await db.insert(schema.giocatori).values(giocatore).returning();
    return result[0];
  },
  
  async deleteGiocatore(id) {
    await db.delete(schema.giocatori).where(eq(schema.giocatori.id, id)).run();
  },
  
  // Eventi
  async getEventi() {
    return db.select().from(schema.eventi).all();
  },
  
  async addEvento(evento) {
    const result = await db.insert(schema.eventi).values(evento).returning();
    return result[0];
  },
  
  async deleteEvento(id) {
    await db.delete(schema.eventi).where(eq(schema.eventi.id, id)).run();
  }
};
