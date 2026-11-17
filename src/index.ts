// Re-export common types from @sudobility/types.
// Generic response/health types and the response constructors/guards are the
// canonical ones from @sudobility/types — this package never redefines them.
export type {
  ApiResponse,
  BaseResponse,
  NetworkClient,
  Optional,
  ApiInfoResponse,
  HealthResponse,
  HealthCheckData,
} from '@sudobility/types';
export {
  successResponse,
  errorResponse,
  isSuccessResponse,
  isErrorResponse,
} from '@sudobility/types';

export * from './crawler.js';

// =============================================================================
// Type Aliases
// =============================================================================

/**
 * ISO 8601 formatted datetime string.
 *
 * @example "2025-01-15T10:30:00.000Z"
 */
export type ISODateString = string & { readonly __brand: 'ISODateString' };

/**
 * ISO 3166-1 alpha-2 country codes supported by MogulGame.
 */
export type CountryCode = 'US' | 'CA' | 'GB' | 'AE' | 'ES' | 'AU';

/**
 * ISO 4217 currency codes used by MogulGame.
 */
export type CurrencyCode = 'USD' | 'CAD' | 'GBP' | 'AED' | 'EUR' | 'AUD';

// =============================================================================
// User
// =============================================================================

/**
 * User account information.
 *
 * @example
 * ```typescript
 * const user: User = {
 *   firebase_uid: 'uid123',
 *   email: 'user@example.com',
 *   display_name: 'John Doe',
 *   created_at: '2025-01-15T10:30:00.000Z',
 *   updated_at: '2025-01-15T10:30:00.000Z',
 * };
 * ```
 */
export interface User {
  /** Firebase Authentication UID */
  firebase_uid: string;
  /** User email address, nullable */
  email: string | null;
  /** User display name, nullable */
  display_name: string | null;
  /** ISO 8601 timestamp of account creation, nullable */
  created_at: string | null;
  /** ISO 8601 timestamp of last update, nullable */
  updated_at: string | null;
}

// =============================================================================
// API Responses, response helpers and guards
//
// `ApiInfoResponse`, `HealthResponse`, `successResponse`, `errorResponse`,
// `isSuccessResponse` and `isErrorResponse` are re-exported from
// `@sudobility/types` at the top of this file — they are not defined here.
// =============================================================================

// =============================================================================
// Property Types
// =============================================================================

export type PropertySource = CountryCode;

export type PropertyListingStatus =
  'for_sale' | 'pending' | 'sold' | 'delisted' | 'unknown';

export interface PropertyAddress {
  street: string;
  city: string;
  region: string;
  postal_code: string;
  country: CountryCode;
  unit: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface PropertyDetailSection {
  category: string;
  text: string[];
}

export interface PropertyDetail {
  year_built: number | null;
  stories: number | null;
  garage: string | null;
  pool: boolean | null;
  heating: string | null;
  cooling: string | null;
  hoa_fee: number | null;
  price_per_sqft: number | null;
  neighborhoods: string[];
  tax_history: PropertyTaxEntry[];
  property_history: PropertyHistoryEvent[];
  schools: PropertySchool[];
  detail_sections: PropertyDetailSection[];
  street_view_url: string | null;
}

export interface PropertyTaxEntry {
  year: number;
  tax: number;
  assessment_total: number | null;
}

export interface PropertyHistoryEvent {
  date: string;
  event_name: string;
  price: number | null;
  source_name: string | null;
}

export interface PropertySchool {
  name: string;
  district: string | null;
  funding_type: string | null;
  grades: string[];
  rating: number | null;
  distance_miles: number | null;
}

export interface Property {
  id: string;
  source: PropertySource;
  source_id: string;
  normalized_address: string;
  address: PropertyAddress;
  price: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  sqft: number | null;
  lot_size: number | null;
  property_type: string | null;
  listing_status: PropertyListingStatus;
  images: string[];
  description: string | null;
  zestimate: number | null;
  url: string | null;
  listed_at: string | null;
  sold_at: string | null;
  sold_price: number | null;
  detail: PropertyDetail | null;
  cached_at: string;
  created_at: string;
  updated_at: string;
}

// =============================================================================
// Property Search Types
// =============================================================================

export interface PropertySearchRequest {
  country?: CountryCode;
  query: string | null;
  latitude: number | null;
  longitude: number | null;
  radius_miles: number | null;
  postal_code: string | null;
  min_price: number | null;
  max_price: number | null;
  min_bedrooms: number | null;
  max_bedrooms: number | null;
  property_type: string | null;
  source: PropertySource | null;
  has_pretend_offers: boolean | null;
  page: number;
  limit: number;
}

export interface PropertySearchResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// =============================================================================
// Price History Types
// =============================================================================

export type PriceHistoryEvent =
  'listed' | 'price_change' | 'pending' | 'sold' | 'delisted' | 'relisted';

export interface PriceHistoryEntry {
  date: string;
  price: number;
  event: PriceHistoryEvent;
  source: string | null;
}

export interface PropertyPriceHistoryResponse {
  property_id: string;
  entries: PriceHistoryEntry[];
}

// =============================================================================
// PretendOffer Types
// =============================================================================

export type PretendOfferStatus =
  'active' | 'won' | 'lost' | 'cancelled' | 'expired';

export interface PretendOffer {
  id: string;
  user_id: string;
  property_id: string;
  offer_price: number;
  currency: CurrencyCode;
  status: PretendOfferStatus;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export interface PretendOfferCreateRequest {
  property_id: string;
  offer_price: number;
}

export interface PretendOfferUpdateRequest {
  offer_price: number;
}

export type PretendOfferPayoutType = 'competitor' | 'solo_bonus';

export interface PretendOfferResolution {
  property_id: string;
  closing_price: number;
  closing_date: string;
  winner_user_id: string | null;
  winner_offer_id: string | null;
  highest_loser_user_id: string | null;
  highest_loser_offer_id: string | null;
  payout_amount: number;
  payout_type: PretendOfferPayoutType;
  resolved_at: string;
}

// =============================================================================
// User & Balance Types
// =============================================================================

export interface UserProfile {
  firebase_uid: string;
  email: string | null;
  display_name: string | null;
  avatar_url: string | null;
  balances: Partial<Record<CountryCode, number>>;
  total_offers: number;
  total_wins: number;
  created_at: string | null;
  updated_at: string | null;
}

export type TransactionType =
  'initial_grant' | 'offer_won_payout' | 'offer_lost_payment' | 'solo_bonus';

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  currency: CurrencyCode;
  country: CountryCode;
  description: string;
  reference_id: string | null;
  created_at: string;
}

// =============================================================================
// Leaderboard Types
// =============================================================================

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  display_name: string | null;
  country: CountryCode;
  pretend_balance: number;
  total_wins: number;
  total_offers: number;
}

export interface LeaderboardRequest {
  country: CountryCode;
  sort_by: 'balance' | 'wins';
  page: number;
  limit: number;
}

export interface LeaderboardResponse {
  country: CountryCode;
  entries: LeaderboardEntry[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// =============================================================================
// Property View Types
// =============================================================================

export interface PropertyView {
  id: string;
  property_id: string;
  address: string;
  image_url: string | null;
  view_count: number;
  favorites_count: number;
  offer_count?: number;
  last_viewed_at: string;
}

export interface PropertyViewsResponse {
  views: PropertyView[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

// =============================================================================
// Favorite Types
// =============================================================================

export interface PropertyFavorite {
  property_id: string;
  created_at: string;
}

export interface PropertyFavoritesResponse {
  favorites: PropertyFavorite[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}
