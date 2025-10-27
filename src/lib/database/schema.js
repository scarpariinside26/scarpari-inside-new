import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Tabella giocatori
export const giocatori = sqliteTable('giocatori', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  nome: text('nome').notNull(),
  email: text('email'),
  telefono: text('telefono'),
  livello: integer('livello').default(3), // 1-5
  created_at: text('created_at').default('CURRENT_TIMESTAMP')
});

// Tabella eventi
export const eventi = sqliteTable('eventi', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  titolo: text('titolo').notNull(),
  data: text('data').notNull(), // YYYY-MM-DD
  ora: text('ora').notNull(), // HH:MM
  luogo: text('luogo'),
  max_giocatori: integer('max_giocatori').default(10),
  created_at: text('created_at').default('CURRENT_TIMESTAMP')
});

// Tabella partecipazioni
export const partecipazioni = sqliteTable('partecipazioni', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  evento_id: integer('evento_id').references(() => eventi.id),
  giocatore_id: integer('giocatore_id').references(() => giocatori.id),
  confermato: integer('confermato').default(0), // 0 = no, 1 = si
  created_at: text('created_at').default('CURRENT_TIMESTAMP')
});

// Tabella squadre generate
export const squadre = sqliteTable('squadre', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  evento_id: integer('evento_id').references(() => eventi.id),
  nome: text('nome').notNull(), // "Squadra A", "Squadra B"
  giocatori: text('giocatori').notNull() // JSON array di ID giocatori
});
