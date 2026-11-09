# @sudobility/mogulgame_types

Shared TypeScript type definitions for the MogulGame ecosystem, plus a small set of
runtime helpers. This is the foundation layer: every other `mogulgame_*` project depends
on it, and nothing in the ecosystem sits below it except `@sudobility/types`.

- **Package**: `@sudobility/mogulgame_types` (public)
- **Module format**: ESM only (`"type": "module"`)
- **License**: BUSL-1.1

## Installation

Published to **GitHub Packages**, not the public npm registry. Consumers need an `.npmrc`
scoping `@sudobility` to GitHub Packages (with an auth token for private access):

```
@sudobility:registry=https://npm.pkg.github.com
```

Then install the package and its peer dependency:

```bash
bun add @sudobility/mogulgame_types @sudobility/types
```

> Use **Bun** for dependency management (this repo is Bun-first). Do not use npm/yarn/pnpm.

## Usage

```ts
import {
  Property,
  PretendOffer,
  UserProfile,
  LeaderboardResponse,
  successResponse,
  errorResponse,
  isSuccessResponse,
  isErrorResponse,
  isCrawler,
  type BaseResponse,
  type CountryCode,
} from '@sudobility/mogulgame_types';

// Standard API envelope
const ok = successResponse({ properties: [] }); // { success: true, data: {...}, timestamp }
const err = errorResponse('Not found');         // { success: false, error: 'Not found', timestamp }

if (isSuccessResponse(ok)) {
  // ok.data is narrowed and safe to use
}

// Crawler / headless-renderer detection (shared by mogulgame_api and mogulgame_app)
isCrawler(request.headers.get('user-agent')); // boolean
```

## What's inside

All public types and helpers are exported from the `src/index.ts` barrel.

**Runtime helpers** (this package is not type-only):

| Export | Purpose |
|--------|---------|
| `successResponse<T>(data)` | Wrap data in `BaseResponse<T>` with `success: true` + ISO timestamp |
| `errorResponse(error)` | Wrap an error string with `success: false` + ISO timestamp |
| `isSuccessResponse<T>(response)` | Type guard narrowing to a success response |
| `isErrorResponse(response)` | Type guard narrowing to an error response |
| `isCrawler(userAgent)` | Crawler/headless User-Agent detection via an explicit substring allowlist |

**Domain types** (27 interfaces in `src/index.ts`):

- **Core**: `User`, `ApiInfoResponse`, `HealthResponse`
- **Property**: `Property`, `PropertyAddress`, `PropertyDetail`, `PropertyDetailSection`,
  `PropertyTaxEntry`, `PropertyHistoryEvent`, `PropertySchool`, `PropertySearchRequest`,
  `PropertySearchResponse`
- **Price history**: `PriceHistoryEntry`, `PropertyPriceHistoryResponse`
- **Offers**: `PretendOffer`, `PretendOfferCreateRequest`, `PretendOfferUpdateRequest`,
  `PretendOfferResolution`
- **User state**: `UserProfile`, `Transaction`
- **Leaderboard**: `LeaderboardEntry`, `LeaderboardRequest`, `LeaderboardResponse`
- **Views / favorites**: `PropertyView`, `PropertyViewsResponse`, `PropertyFavorite`,
  `PropertyFavoritesResponse`

**Aliases / unions**: `ISODateString`, `CountryCode` (`'US'|'CA'|'GB'|'AE'|'ES'|'AU'`),
`CurrencyCode`, `PropertySource`, `PropertyListingStatus`, `PriceHistoryEvent`,
`PretendOfferStatus`, `PretendOfferPayoutType`, `TransactionType`.

**Re-exported from `@sudobility/types`**: `ApiResponse`, `BaseResponse`, `NetworkClient`,
`Optional` — so consumers only need to import from this package.

## Development

```bash
bun install            # Install dependencies (Bun only)
bun run build          # tsc -p tsconfig.esm.json  (ESM only, emits to dist/)
bun run dev            # tsc --watch
bun run test:unit      # Run Vitest tests once
bun run test:watch     # Vitest in watch mode
bun run test:coverage  # Vitest with coverage
bun run typecheck      # tsc --noEmit
bun run lint           # ESLint over src
bun run lint:fix       # ESLint with --fix
bun run format         # Prettier write
bun run verify         # typecheck + lint + test:unit + build (run before publishing)
```

After building, sanity-check that runtime exports resolve (see Gotchas below):

```bash
node -e "import('./dist/index.js').then(m => console.log(typeof m.isCrawler))"
```

## Gotchas

- **Relative re-exports MUST carry a `.js` extension** (e.g. `export * from './crawler.js'`).
  Omitting it typechecks, passes Vitest, and builds, then dies at runtime with
  `ERR_MODULE_NOT_FOUND` — `tsc` emits ESM specifiers verbatim. `bun run verify` does not catch
  this; verify the built `dist/index.js` imports in Node.
- Changes here affect **all** consumer projects. Always consider downstream impact.
- Do not add runtime dependencies; keep the package lightweight.

## Architecture

```
@sudobility/mogulgame_types (this package)
        ^
mogulgame_api      (dependency)      — Hono + PostgreSQL backend
mogulgame_client   (devDependency)   — API client SDK, type-only use
mogulgame_lib      (devDependency)   — pure helper functions
mogulgame_app      (dependency)      — web app
mogulgame_app_rn   (dependency)      — React Native app
```

## Publishing

CI (`.github/workflows/ci-cd.yml`) publishes to GitHub Packages on push to `main`/`develop`.
Publishing is orchestrated by `mogulgame_app/scripts/push_all.sh`, which **skips repos with
clean working trees** — a committed-but-unpublished change needs a manual version bump and push.

## License

BUSL-1.1
