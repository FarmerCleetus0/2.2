# Strength Log

A workout tracker that runs as a phone-friendly web app, served by one Cloudflare Worker.

- **Workouts, history, weekly muscle totals, progress graphs:** run in the browser and work offline once installed.
- **Cloud backup** (`/api/state`), **Food tab** (`/api/meals`, meal photos included) and **muscle lookup** (`/api/muscles`): stored in your D1 database. The AI parts run on Cloudflare Workers AI, so there is no API key anywhere.

Your D1 database id is already set in `wrangler.jsonc`. There is no migration to run, no bucket to create and no secret to add.

## Deploy

1. Put all of these files at the **root** of a GitHub repository (so `wrangler.jsonc` is at the top level, not inside a folder) and push.
2. In the Cloudflare dashboard open Workers & Pages, create a new application and import that repository.
   - Name the Worker **`strength-log`**. It has to match the `name` in `wrangler.jsonc` (or edit that line to whatever name you chose).
   - Leave the root directory as `/`, leave the build command empty, and keep the deploy command `npx wrangler deploy`.
3. Open the `*.workers.dev` address. The tables are created automatically the first time the app talks to the Worker.
4. On your phone, open it once with a connection, then Add to Home Screen. After that it opens offline.

Dashboard labels change now and then; if a name differs, look for the equivalent.

## Run locally (optional)

```sh
npm install
npx wrangler login
npm run dev        # http://localhost:8787
```

`npm run dev` uses a local copy of the database, but AI requests run on Cloudflare's servers, so they need `wrangler login` and count toward your Workers AI allowance.

## Things to know

- **Data does not carry over from a previous host.** A new deployment starts empty. Use Settings, Export backup on the old one and Import backup on the new one.
- **No login.** The device recovery code is the only credential. Anyone who has it can read and overwrite that backup, so treat it like a password.
- **Photos live in D1.** The app shrinks them to about 1024 px before upload, so they are small. Anything over about 1.4 MB is skipped (the meal still saves). The cloud backup is capped just under 2 MB, because D1 limits a single row to about that.
- **AI model and cost:** the AI features use `@cf/meta/llama-4-scout-17b-16e-instruct` on Workers AI. Change the model by adding an `AI_MODEL` variable to the Worker. Workers AI has a free daily allowance and charges after that, so check Cloudflare's current pricing.
- **Accuracy:** meal photo estimates from Workers AI are rougher than Claude's, especially for portion sizes and mixed plates. Treat them as estimates and edit the numbers before saving. For better results, add an `ANTHROPIC_API_KEY` secret to the Worker; if it exists, Claude is used instead.
- **Muscle groups:** common exercises use a built-in table of mappings based on EMG research (in `public/index.html`, `MKEY` and `MRULES`). The AI is only asked about exercise names that table doesn't recognise.
- **Free plan CPU limit:** Workers on the free plan allow very little CPU time per request. If photo logging fails, the paid Workers plan lifts the limit.
push
