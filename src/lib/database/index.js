// TEMPORANEAMENTE COMMENTATO - DATABASE DISABILITATO PER DEPLOY
/*
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq } from 'drizzle-orm';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema.js';

// Crea connessione database
const sqlite = new Database('scarpari.db');
export const db = drizzle(sqlite, { schema });

// Esegui migrazioni (crea tabelle)
migrate(db, { migrationsFolder: 'drizzle' });

// Funzioni REALI del database (commentate)
export const database = {
  async getGiocatori() {
    return db.select().from(schema.giocatori).all();
  },
  
  async addGiocatore(giocatore) {
    const result = await db.insert(schema.giocatori).values(giocatore).returning();
    return result[0];
  },
  
  async deleteGiocatore(id) {
    await db.delete(schema.giocatori).where(eq(schema.giocatori.id, id)).run();
  }
};
*/

// FUNZIONI MOCK PER ORA (queste vengono usate)
export const database = {
  async getGiocatori() {
    // Dati mock
    return [
      { id: 1, nome: 'Mario Rossi', email: 'mario@email.com', telefono: '333 1234567', livello: 4 },
      { id: 2, nome: 'Luca Bianchi', email: 'luca@email.com', telefono: '334 7654321', livello: 3 },
      { id: 3, nome: 'Paolo Verdi', email: 'paolo@email.com', telefono: '335 1122334', livello: 5 },
      { id: 4, nome: 'Giuseppe Neri', email: 'giuseppe@email.com', telefono: '336 4433221', livello: 2 },
      { id: 5, nome: 'Antonio Gialli', email: 'antonio@email.com', telefono: '337 5566778', livello: 4 }
    ];
  },
  
  async addGiocatore(giocatore) {
    // Simula aggiunta
    const nuovoId = Math.floor(Math.random() * 1000) + 6;
    return { ...giocatore, id: nuovoId };
  },
  
  async deleteGiocatore(id) {
    // Simula eliminazione
    console.log('Simulazione eliminazione giocatore:', id);
    return true;
  },
  
  // Eventi mock
  async getEventi() {
    return [
      {
        id: 1,
        titolo: 'Calcetto Venerdì Sera',
        data: '2024-12-27',
        ora: '20:30', 
        luogo: 'Campo Comunale',
        max_giocatori: 10
      },
      {
        id: 2,
        titolo: 'Torneo Domenicale', 
        data: '2024-12-29',
        ora: '16:00',
        luogo: 'Palasport',
        max_giocatori: 12
      }
    ];
  },
  
  async addEvento(evento) {
    const nuovoId = Math.floor(Math.random() * 1000) + 3;
    return { ...evento, id: nuovoId };
  },
  
  async deleteEvento(id) {
    console.log('Simulazione eliminazione evento:', id);
    return true;
  }
};
