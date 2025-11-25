/**
 * Bank Account Validation Utility
 * Provides country-specific bank account field requirements
 */
export interface BankFieldConfig {
    country: string;
    isInternational: boolean;
    accountNumberLabel: string;
    accountNumberPlaceholder: string;
    accountNumberHint: string;
    requiresIBAN: boolean;
    requiresBAAN: boolean;
    requiresRoutingNumber: boolean;
    requiresSWIFT: boolean;
    ibanLength?: number;
    routingNumberLength?: number;
    swiftCodeLength?: number;
}
/**
 * Get bank field configuration based on country
 */
export declare function getBankFieldConfig(country: string): BankFieldConfig;
/**
 * Validate IBAN format (basic validation)
 */
export declare function validateIBAN(iban: string): boolean;
/**
 * Validate BBAN (Sierra Leone Bank Account Number)
 */
export declare function validateBBAN(bban: string): boolean;
/**
 * Validate SWIFT/BIC code
 */
export declare function validateSWIFT(swift: string): boolean;
/**
 * Validate Routing Number (US)
 */
export declare function validateRoutingNumber(routingNumber: string): boolean;
/**
 * Format IBAN with spaces (every 4 characters)
 */
export declare function formatIBAN(iban: string): string;
/**
 * Format SWIFT code
 */
export declare function formatSWIFT(swift: string): string;
/**
 * Format Routing Number
 */
export declare function formatRoutingNumber(routing: string): string;
/**
 * Get validation error message
 */
export declare function getValidationErrorMessage(field: string, value: string, config: BankFieldConfig): string | null;
/**
 * Get all countries with their configurations
 */
export declare function getAllCountries(): string[];
/**
 * Check if country requires international bank details
 */
export declare function isInternationalCountry(country: string): boolean;
