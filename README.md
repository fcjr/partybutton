# party button

Party mode toggle for Recurse Center. React + Tailwind frontend and a Hono API, running on Cloudflare Workers with D1 + Drizzle.

## API

| Method | Path                   | Auth                                | Description                       |
| ------ | ---------------------- | ----------------------------------- | --------------------------------- |
| GET    | `/api/v1/party`        | none                                | Current party state               |
| POST   | `/api/v1/party`        | `Authorization: Bearer <PARTY_KEY>` | Toggle party mode on/off          |
| GET    | `/api/v1/openapi.json` | none                                | OpenAPI spec                      |
| GET    | `/docs`                | none                                | Scalar API reference              |

```sh
curl https://example.com/api/v1/party
# {"party":false,"updatedAt":null}

curl -X POST -H "Authorization: Bearer $PARTY_KEY" https://example.com/api/v1/party
# {"party":true,"updatedAt":"2026-07-17T17:55:13.537Z"}
```

## Development

```sh
pnpm install
cd apps/web
cp .dev.vars.example .dev.vars   # set PARTY_KEY
pnpm db:migrate                  # apply migrations to local D1
pnpm dev
```

## Database changes

Edit `apps/web/worker/db/schema.ts`, then:

```sh
pnpm db:generate   # generate SQL migration with drizzle-kit
pnpm db:migrate    # apply locally
```

## Deploy

One-time setup:

```sh
cd apps/web
wrangler d1 create recurse-partybutton   # copy database_id into wrangler.jsonc
wrangler secret put PARTY_KEY
pnpm db:migrate:prod
```

Then:

```sh
pnpm deploy
```
