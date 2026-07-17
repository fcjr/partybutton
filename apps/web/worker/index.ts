import { Hono } from "hono";
import { drizzle } from "drizzle-orm/d1";
import { eq, not, sql } from "drizzle-orm";
import { Scalar } from "@scalar/hono-api-reference";
import { partyState } from "./db/schema";
import { openApiSpec } from "./openapi";

const app = new Hono<{ Bindings: Env }>();

async function keyIsValid(provided: string, expected: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(provided)),
    crypto.subtle.digest("SHA-256", enc.encode(expected)),
  ]);
  return crypto.subtle.timingSafeEqual(a, b);
}

app.get("/api/v1/party", async (c) => {
  const db = drizzle(c.env.DB);
  const row = await db
    .select()
    .from(partyState)
    .where(eq(partyState.id, 1))
    .get();
  return c.json({ party: row?.on ?? false, updatedAt: row?.updatedAt ?? null });
});

app.post("/api/v1/party", async (c) => {
  const auth = c.req.header("Authorization");
  const key = auth?.startsWith("Bearer ") ? auth.slice("Bearer ".length) : null;
  if (!key || !(await keyIsValid(key, c.env.PARTY_KEY))) {
    return c.json({ error: "invalid party key" }, 401);
  }

  const db = drizzle(c.env.DB);
  const now = new Date().toISOString();
  const [row] = await db
    .insert(partyState)
    .values({ id: 1, on: true, updatedAt: now })
    .onConflictDoUpdate({
      target: partyState.id,
      set: { on: not(partyState.on), updatedAt: sql`excluded.updated_at` },
    })
    .returning();
  return c.json({ party: row.on, updatedAt: row.updatedAt });
});

app.get("/api/v1/openapi.json", (c) => c.json(openApiSpec));
app.get("/docs", Scalar({ url: "/api/v1/openapi.json" }));

export default app;
