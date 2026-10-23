// Re-export common types from @sudobility/types
export type {
  ApiResponse,
  BaseResponse,
  NetworkClient,
  Optional,
} from '@sudobility/types';
import type { BaseResponse } from '@sudobility/types';

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
// API Responses
// =============================================================================

/**
 * Response for the root API metadata endpoint (`GET /`).
 *
 * @example
 * ```typescript
 * const info: ApiInfoResponse = {
 *   name: 'Starter API',
 *   version: '1.0.0',
 *   status: 'healthy',
 * };
 * ```
 */
export interface ApiInfoResponse {
  /** The name of the API */
  name: string;
  /** The API version string */
  version: string;
  /** Current operational status */
  status: string;
}

/**
 * Response for the health check endpoint (`GET /health`).
 *
 * @example
 * ```typescript
 * const health: HealthResponse = {
 *   status: 'ok',
 *   version: '1.0.0',
 * };
 * ```
 */
export interface HealthResponse {
  /** Current health status */
  status: string;
  /** The API version string */
  version: string;
}

// =============================================================================
// Response Helpers
// =============================================================================

/**
 * Constructs a successful API response.
 *
 * Creates a {@link BaseResponse} with `success: true`, the provided data payload,
 * and a timestamp set to the current time in ISO 8601 format.
 *
 * @typeParam T - The type of the response payload
 * @param data - The response payload (can be any type, including `undefined` or `null`)
 * @returns A {@link BaseResponse} with `success: true` and `data` property set
 *
 * @example
 * ```typescript
 * // Successful single record
 * const response1 = successResponse({ id: '123', name: 'test' });
 *
 * // Array of records
 * const response2 = successResponse([
 *   { id: '1', value: 100 },
 *   { id: '2', value: 200 },
 * ]);
 *
 * // Null or undefined data (valid, though potentially unusual)
 * const response3 = successResponse(null);
 * ```
 *
 * @internal
 * Timestamp is always included in the response envelope and formatted as ISO 8601.
 */
export function successResponse<T>(data: T): BaseResponse<T> {
  return { success: true, data, timestamp: new Date().toISOString() };
}

/**
 * Constructs an error API response.
 *
 * Creates a {@link BaseResponse} with `success: false`, the provided error message,
 * and a timestamp set to the current time in ISO 8601 format.
 *
 * **Note:** This function accepts empty strings as valid error messages. While this
 * is allowed by the runtime and type system, it is generally recommended to provide
 * meaningful, non-empty error descriptions for better debugging and client-side handling.
 *
 * @param error - A descriptive error message (may be empty, though not recommended)
 * @returns A {@link BaseResponse} with `success: false` and `error` property set
 *
 * @example
 * ```typescript
 * // Standard error
 * const response1 = errorResponse('User not found');
 *
 * // Error with context
 * const response2 = errorResponse('Invalid datetime format: expected ISO 8601');
 *
 * // Empty string (allowed but not recommended)
 * const response3 = errorResponse('');
 * ```
 *
 * @internal
 * Timestamp is always included in the response envelope and formatted as ISO 8601.
 */
export function errorResponse(error: string): BaseResponse<never> {
  return { success: false, error, timestamp: new Date().toISOString() };
}

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

// =============================================================================
// Type Guards
// =============================================================================

/**
 * Type guard to narrow a {@link BaseResponse} to a successful response.
 *
 * Checks if a response has `success: true`, allowing TypeScript to narrow
 * the type to access the `data` property safely.
 *
 * @typeParam T - The expected type of the response data
 * @param response - The response to check
 * @returns `true` if the response is successful, `false` otherwise
 *
 * @example
 * ```typescript
 * async function fetchHistory(): Promise<BaseResponse<History[]>> {
 *   const response = await client.get('/history');
 *   if (isSuccessResponse<History[]>(response)) {
 *     // TypeScript now knows response.data is History[]
 *     const histories = response.data;
 *     return histories;
 *   }
 *   console.error('Failed:', response.error);
 * }
 * ```
 */
export function isSuccessResponse<T>(
  response: BaseResponse<T>
): response is BaseResponse<T> & { success: true; data: T } {
  return response.success === true;
}

/**
 * Type guard to narrow a {@link BaseResponse} to an error response.
 *
 * Checks if a response has `success: false`, allowing TypeScript to narrow
 * the type to access the `error` property safely.
 *
 * @param response - The response to check
 * @returns `true` if the response is an error, `false` otherwise
 *
 * @example
 * ```typescript
 * async function updateHistory(id: string, value: number): Promise<void> {
 *   const response = await client.patch(`/history/${id}`, { value });
 *   if (isErrorResponse(response)) {
 *     // TypeScript now knows response.error is string
 *     throw new Error(response.error);
 *   }
 *   // Success case
 * }
 * ```
 */
export function isErrorResponse(
  response: BaseResponse<unknown>
): response is BaseResponse<never> & { success: false; error: string } {
  return response.success === false;
}
