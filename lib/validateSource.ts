// lib/validateSource.ts

import { 
  extractDomain, 
  isDomainAllowed, 
  getAllowedTypes,
  type SourceDataType 
} from "./allowlist.config";

/**
 * Error codes for source validation
 * Makes logging and UI feedback easier
 */
export const ValidationErrorCode = {
  INVALID_URL: "INVALID_URL",
  SOURCE_NOT_ALLOWED: "SOURCE_NOT_ALLOWED",
  SOURCE_TYPE_NOT_ALLOWED: "SOURCE_TYPE_NOT_ALLOWED",
} as const;

export type ValidationErrorCodeType = typeof ValidationErrorCode[keyof typeof ValidationErrorCode];

export interface ValidationResult {
  valid: boolean;
  domain?: string;
  allowedTypes?: SourceDataType[];
  reason?: string;
  errorCode?: ValidationErrorCodeType;
}

/**
 * Validate if a URL is from an approved official source
 * 
 * @param url - The URL to validate
 * @param expectedType - Optional: check if domain supports this source type
 * @returns ValidationResult with details
 * 
 * @example
 * validateSource("https://ark.intel.com/content/www/us/en/ark/products/...")
 * // → { valid: true, domain: "intel.com", allowedTypes: ["cpu_specs"] }
 * 
 * validateSource("https://pcpartpicker.com/...")
 * // → { valid: false, reason: "...", errorCode: "SOURCE_NOT_ALLOWED" }
 * 
 * validateSource("https://intel.com/...", "price")
 * // → { valid: false, reason: "...", errorCode: "SOURCE_TYPE_NOT_ALLOWED" }
 */
export function validateSource(
  url: string,
  expectedType?: SourceDataType
): ValidationResult {
  // Step 1: Extract domain
  let domain: string;
  try {
    domain = extractDomain(url);
  } catch (error) {
    return {
      valid: false,
      reason: error instanceof Error ? error.message : "Invalid URL format",
      errorCode: ValidationErrorCode.INVALID_URL,
    };
  }

  // Step 2: Check if domain is allowed
  if (!isDomainAllowed(domain)) {
    return {
      valid: false,
      reason: `Domain "${domain}" is not in the allowlist. Only official manufacturer and approved retailer sources are permitted.`,
      errorCode: ValidationErrorCode.SOURCE_NOT_ALLOWED,
    };
  }

  // Step 3: Get allowed types for this domain
  const allowedTypes = getAllowedTypes(domain);

  // Step 4: If expectedType is specified, verify it's supported
  if (expectedType && !allowedTypes.includes(expectedType)) {
    return {
      valid: false,
      reason: `Domain "${domain}" does not support source type "${expectedType}". Allowed types: ${allowedTypes.join(", ")}`,
      errorCode: ValidationErrorCode.SOURCE_TYPE_NOT_ALLOWED,
    };
  }

  // Step 5: Valid source
  return {
    valid: true,
    domain,
    allowedTypes,
  };
}

/**
 * Validate multiple sources at once
 * Useful for batch validation of component sources
 */
export function validateSources(
  urls: string[],
  expectedType?: SourceDataType
): { url: string; result: ValidationResult }[] {
  return urls.map((url) => ({
    url,
    result: validateSource(url, expectedType),
  }));
}

/**
 * Custom error class for source validation failures
 * Includes structured error code for logging and UI
 */
export class SourceValidationError extends Error {
  constructor(
    public readonly errorCode: ValidationErrorCodeType,
    public readonly url: string,
    public readonly validationResult: ValidationResult
  ) {
    super(validationResult.reason || "Source validation failed");
    this.name = "SourceValidationError";
  }
}

/**
 * Strict validation: throws SourceValidationError if URL is invalid
 * Use this when you want to fail fast during data import
 * 
 * @throws {SourceValidationError} If validation fails
 * 
 * @example
 * try {
 *   validateSourceStrict("https://pcpartpicker.com/...");
 * } catch (error) {
 *   if (error instanceof SourceValidationError) {
 *     console.log(error.errorCode); // "SOURCE_NOT_ALLOWED"
 *     console.log(error.url); // Original URL
 *   }
 * }
 */
export function validateSourceStrict(
  url: string,
  expectedType?: SourceDataType
): void {
  const result = validateSource(url, expectedType);
  if (!result.valid) {
    throw new SourceValidationError(
      result.errorCode || ValidationErrorCode.SOURCE_NOT_ALLOWED,
      url,
      result
    );
  }
}
