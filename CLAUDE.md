# MogulGame Types

> **Git policy — never auto-commit or auto-push.** Leave your work in the working tree.
> Run `git commit`, `git push`, `gh pr create`, or `scripts/push_all.sh` **only when the user
> explicitly asks in that turn**. Approval for an earlier change does not carry forward, and
> finishing a task is not permission to commit it.

Shared TypeScript type definitions for the MogulGame ecosystem, plus a handful of runtime helpers.

**Package**: `@sudobility/mogulgame_types` (public, BUSL-1.1), published to **GitHub Packages**
(not npmjs). `.npmrc` scopes `@sudobility` to `https://npm.pkg.github.com`.

## Tech Stack

- **Language**: TypeScript (strict mode)
- **Runtime**: Bun
- **Package Manager**: Bun (do not use npm/yarn/pnpm for installing dependencies)
- **Build**: TypeScript compiler, **ESM only** (`"type": "module"`)
- **Test**: Vitest

## Project Structure

```
src/
├── index.ts           # All types + response helpers; re-exports ./crawler.js
├── index.test.ts
├── crawler.ts         # isCrawler() — UA token allowlist
└── crawler.test.ts
```

## Commands

```bash
bun run build          # tsc -p tsconfig.esm.json  (ESM only)
bun run dev            # Watch mode
bun run test:unit      # Run Vitest tests (there is NO `test` script; `bun run test` fails)
bun run typecheck      # TypeScript check
bun run lint           # Run ESLint
bun run verify         # typecheck + lint + test:unit + build (use before commit)
bun run prepublishOnly # Clean + verify (runs on publish)
```

## Key Types

Domain interfaces (27 total, all in `src/index.ts`):

- **Core**: `User`, `ApiInfoResponse`, `HealthResponse`
- **Property**: `Property`, `PropertyAddress`, `PropertyDetail`, `PropertyDetailSection`, `PropertyTaxEntry`, `PropertyHistoryEvent`, `PropertySchool`, `PropertySearchRequest`, `PropertySearchResponse`
- **Price history**: `PriceHistoryEntry`, `PropertyPriceHistoryResponse`
- **Offers**: `PretendOffer`, `PretendOfferCreateRequest`, `PretendOfferUpdateRequest`, `PretendOfferResolution`
- **User state**: `UserProfile` (with `balances: Partial<Record<CountryCode, number>>`), `Transaction`
- **Leaderboard**: `LeaderboardEntry`, `LeaderboardRequest`, `LeaderboardResponse`
- **Views / favorites**: `PropertyView`, `PropertyViewsResponse`, `PropertyFavorite`, `PropertyFavoritesResponse`

Aliases: `ISODateString`, `CountryCode` (`'US'|'CA'|'GB'|'AE'|'ES'|'AU'`), `CurrencyCode`,
`PropertySource`, `PropertyListingStatus`, `PretendOfferStatus`, `PretendOfferPayoutType`,
`TransactionType`.

## Runtime Exports

This package is **not** type-only. It ships five runtime functions:

- `successResponse<T>(data)` — wraps data in `BaseResponse<T>` with `success: true`
- `errorResponse(error)` — wraps an error string with `success: false`
- `isSuccessResponse<T>(response)` — type guard
- `isErrorResponse(response)` — type guard
- `isCrawler(userAgent)` — crawler User-Agent detection (`src/crawler.ts`)

**`isCrawler` lives here on purpose.** Both `mogulgame_api` and `mogulgame_app` need it, and this is
the only shared package with no React dependency (`mogulgame_lib` peer-depends on React, so a Bun
server cannot import it). One UA token list, no drift.

It uses an **explicit substring allowlist**, never a generic `/bot/i` — real Android devices report
`CUBOT`, and a generic match would silently serve those users stale data. `headlesschrome` is included
so `mogulgame_app`'s Playwright prerender is treated as a crawler.

## Re-exports from @sudobility/types

`ApiResponse`, `BaseResponse`, `NetworkClient`, `Optional`

## Peer Dependencies

- `@sudobility/types` — shared infrastructure types

## Architecture

```
@sudobility/mogulgame_types (this package)
    ^
mogulgame_api        (dependency)
mogulgame_client     (devDependency — type-only; consumers must supply it)
mogulgame_lib        (devDependency)
mogulgame_app        (dependency)
mogulgame_app_rn     (dependency, currently unimported)
```

Foundation layer. Nothing in the ecosystem sits below it except `@sudobility/types`.

## Related Projects

- **mogulgame_api** — Backend (Hono + PostgreSQL); imports `successResponse`/`errorResponse`/`isCrawler` and the domain types
- **mogulgame_client** — API client SDK; imports types for API contracts. Declares this package as a **devDependency**, not a peer
- **mogulgame_lib** — Pure helper functions; imports `CountryCode`, `PretendOffer`, `Transaction`. Does **not** import mogulgame_client
- **mogulgame_app** — Web app; imports this package **directly** (published npm package, not a workspace link)
- **mogulgame_app_rn** — React Native app; depends on the published package but currently has zero import sites

## Coding Patterns

- Mostly type definitions; runtime logic is limited to the five helpers above
- **ESM only.** `"type": "module"`, `exports` declares only `import`. There is no CJS build despite what older docs claimed
- All public types and helpers are exported from the `src/index.ts` barrel
- Re-export base types from `@sudobility/types` so consumers only need this package
- Use `interface` for object shapes and `type` for unions/aliases

## Gotchas

- **Relative re-exports MUST carry a `.js` extension.** `export * from './crawler'` typechecks, passes
  vitest (bundler resolution), and *builds* — then dies at runtime with `ERR_MODULE_NOT_FOUND`, because
  `tsc` emits relative specifiers verbatim and this is an ESM package. `bun run verify` does **not**
  catch it. Write `export * from './crawler.js'`. Sanity-check the built artifact:

  ```bash
  node -e "import('./dist/index.js').then(m => console.log(typeof m.isCrawler))"
  ```

- Two ESLint flat configs exist: `eslint.config.js` (used — flat-config lookup picks `.js` first)
  and `eslint.config.mjs` (dead/unused). Edit `eslint.config.js`; the `.mjs` has no effect
- Changes here affect ALL consumer projects -- always consider downstream impact
- Always run `bun run verify` before publishing, and additionally import `dist/index.js` in Node (see above)
- The `BaseResponse<T>` wrapper is the standard API envelope -- all API responses must conform to it
- Do not add runtime dependencies; keep this lightweight (the five helpers are the sole exception)
- Publishing is handled by `mogulgame_app/scripts/push_all.sh` + CI on push to `main`/`develop`. That script **skips repos with clean working trees**, so a committed-but-unpublished change requires bumping the version by hand and pushing

## Git Workflow

- Do not use feature branches for code changes. Always stay on the current branch.
