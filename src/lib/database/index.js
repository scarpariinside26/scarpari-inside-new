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
    return db.insert(schema.giocatori).values(giocatore).run();
  },
  
  // Eventi
  async getEventi() {
    return db.select().from(schema.eventi).all();
  },
  
  async addEvento(evento) {
    return db.insert(schema.eventi).values(evento).run();
  }
};
