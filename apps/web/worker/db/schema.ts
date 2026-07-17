import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const partyState = sqliteTable("party_state", {
  id: integer("id").primaryKey(),
  on: integer("is_on", { mode: "boolean" }).notNull().default(false),
  updatedAt: text("updated_at").notNull(),
});
