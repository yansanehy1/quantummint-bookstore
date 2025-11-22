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

// Country-specific bank account configurations
const BANK_CONFIGURATIONS: Record<string, BankFieldConfig> = {
  "Sierra Leone": {
    country: "Sierra Leone",
    isInternational: false,
    accountNumberLabel: "BBAN (Bank Account Number)",
    accountNumberPlaceholder: "123456789",
    accountNumberHint: "Your 9-12 digit bank account number",
    requiresIBAN: false,
    requiresBAAN: true,
    requiresRoutingNumber: false,
    requiresSWIFT: false
  },
  "United States": {
    country: "United States",
    isInternational: true,
    accountNumberLabel: "IBAN",
    accountNumberPlaceholder: "US12345678901234567890",
    accountNumberHint: "Your International Bank Account Number (IBAN)",
    requiresIBAN: true,
    requiresBAAN: false,
    requiresRoutingNumber: true,
    requiresSWIFT: true,
    ibanLength: 22,
    routingNumberLength: 9,
    swiftCodeLength: 8
  },
  "United Kingdom": {
    country: "United Kingdom",
    isInternational: true,
    accountNumberLabel: "IBAN",
    accountNumberPlaceholder: "GB82WEST12345698765432",
    accountNumberHint: "Your International Bank Account Number (IBAN)",
    requiresIBAN: true,
    requiresBAAN: false,
    requiresRoutingNumber: false,
    requiresSWIFT: true,
    ibanLength: 22,
    swiftCodeLength: 8
  },
  "Germany": {
    country: "Germany",
    isInternational: true,
    accountNumberLabel: "IBAN",
    accountNumberPlaceholder: "DE89370400440532013000",
    accountNumberHint: "Your International Bank Account Number (IBAN)",
    requiresIBAN: true,
    requiresBAAN: false,
    requiresRoutingNumber: false,
    requiresSWIFT: true,
    ibanLength: 22,
    swiftCodeLength: 8
  },
  "France": {
    country: "France",
    isInternational: true,
    accountNumberLabel: "IBAN",
    accountNumberPlaceholder: "FR1420041010050500013M02606",
    accountNumberHint: "Your International Bank Account Number (IBAN)",
    requiresIBAN: true,
    requiresBAAN: false,
    requiresRoutingNumber: false,
    requiresSWIFT: true,
    ibanLength: 27,
    swiftCodeLength: 8
  },
  "Canada": {
    country: "Canada",
    isInternational: true,
    accountNumberLabel: "IBAN",
    accountNumberPlaceholder: "CA12345678901234567890",
    accountNumberHint: "Your International Bank Account Number (IBAN)",
    requiresIBAN: true,
    requiresBAAN: false,
    requiresRoutingNumber: true,
    requiresSWIFT: true,
    ibanLength: 21,
    routingNumberLength: 9,
    swiftCodeLength: 8
  },
  "Australia": {
    country: "Australia",
    isInternational: true,
    accountNumberLabel: "IBAN",
    accountNumberPlaceholder: "AU123456789012345",
    accountNumberHint: "Your International Bank Account Number (IBAN)",
    requiresIBAN: true,
    requiresBAAN: false,
    requiresRoutingNumber: false,
    requiresSWIFT: true,
    ibanLength: 23,
    swiftCodeLength: 8
  },
  "Nigeria": {
    country: "Nigeria",
    isInternational: true,
    accountNumberLabel: "IBAN",
    accountNumberPlaceholder: "NG9030002014850293284193",
    accountNumberHint: "Your International Bank Account Number (IBAN)",
    requiresIBAN: true,
    requiresBAAN: false,
    requiresRoutingNumber: false,
    requiresSWIFT: true,
    ibanLength: 24,
    swiftCodeLength: 8
  },
  "Ghana": {
    country: "Ghana",
    isInternational: true,
    accountNumberLabel: "IBAN",
    accountNumberPlaceholder: "GH29ABSA060131290123456789",
    accountNumberHint: "Your International Bank Account Number (IBAN)",
    requiresIBAN: true,
    requiresBAAN: false,
    requiresRoutingNumber: false,
    requiresSWIFT: true,
    ibanLength: 28,
    swiftCodeLength: 8
  },
  "Kenya": {
    country: "Kenya",
    isInternational: true,
    accountNumberLabel: "IBAN",
    accountNumberPlaceholder: "KE93CBAFBAXXX9J260000001",
    accountNumberHint: "Your International Bank Account Number (IBAN)",
    requiresIBAN: true,
    requiresBAAN: false,
    requiresRoutingNumber: false,
    requiresSWIFT: true,
    ibanLength: 21,
    swiftCodeLength: 8
  },
  "South Africa": {
    country: "South Africa",
    isInternational: true,
    accountNumberLabel: "IBAN",
    accountNumberPlaceholder: "ZA9601234567890123456789",
    accountNumberHint: "Your International Bank Account Number (IBAN)",
    requiresIBAN: true,
    requiresBAAN: false,
    requiresRoutingNumber: false,
    requiresSWIFT: true,
    ibanLength: 34,
    swiftCodeLength: 8
  }
};

// Default configuration for unknown countries
const DEFAULT_INTERNATIONAL_CONFIG: BankFieldConfig = {
  country: "Other",
  isInternational: true,
  accountNumberLabel: "IBAN",
  accountNumberPlaceholder: "XXXX0000000000000000",
  accountNumberHint: "Your International Bank Account Number (IBAN)",
  requiresIBAN: true,
  requiresBAAN: false,
  requiresRoutingNumber: false,
  requiresSWIFT: true,
  ibanLength: 20,
  swiftCodeLength: 8
};

/**
 * Get bank field configuration based on country
 */
export function getBankFieldConfig(country: string): BankFieldConfig {
  return BANK_CONFIGURATIONS[country] || DEFAULT_INTERNATIONAL_CONFIG;
}

/**
 * Validate IBAN format (basic validation)
 */
export function validateIBAN(iban: string): boolean {
  // Remove spaces and convert to uppercase
  const cleanIBAN = iban.replace(/\s/g, "").toUpperCase();
  
  // IBAN should be 15-34 characters
  if (cleanIBAN.length < 15 || cleanIBAN.length > 34) {
    return false;
  }
  
  // IBAN should start with 2 letters followed by 2 digits
  if (!/^[A-Z]{2}[0-9]{2}/.test(cleanIBAN)) {
    return false;
  }
  
  return true;
}

/**
 * Validate BBAN (Sierra Leone Bank Account Number)
 */
export function validateBBAN(bban: string): boolean {
  // BBAN should be 9-12 digits
  const cleanBBAN = bban.replace(/\s/g, "");
  return /^\d{9,12}$/.test(cleanBBAN);
}

/**
 * Validate SWIFT/BIC code
 */
export function validateSWIFT(swift: string): boolean {
  // SWIFT code should be 8 or 11 characters
  const cleanSWIFT = swift.replace(/\s/g, "").toUpperCase();
  return /^[A-Z0-9]{8}([A-Z0-9]{3})?$/.test(cleanSWIFT);
}

/**
 * Validate Routing Number (US)
 */
export function validateRoutingNumber(routingNumber: string): boolean {
  // Routing number should be 9 digits
  const cleanRouting = routingNumber.replace(/\s/g, "");
  return /^\d{9}$/.test(cleanRouting);
}

/**
 * Format IBAN with spaces (every 4 characters)
 */
export function formatIBAN(iban: string): string {
  const cleanIBAN = iban.replace(/\s/g, "").toUpperCase();
  return cleanIBAN.replace(/(.{4})/g, "$1 ").trim();
}

/**
 * Format SWIFT code
 */
export function formatSWIFT(swift: string): string {
  return swift.replace(/\s/g, "").toUpperCase();
}

/**
 * Format Routing Number
 */
export function formatRoutingNumber(routing: string): string {
  return routing.replace(/\s/g, "");
}

/**
 * Get validation error message
 */
export function getValidationErrorMessage(
  field: string,
  value: string,
  config: BankFieldConfig
): string | null {
  switch (field) {
    case "accountNumber":
      if (!value) return "Account number is required";
      if (config.requiresIBAN && !validateIBAN(value)) {
        return `Invalid IBAN format (should be 15-34 characters starting with 2 letters and 2 digits)`;
      }
      if (config.requiresBAAN && !validateBBAN(value)) {
        return `Invalid BBAN format (should be 9-12 digits)`;
      }
      return null;
    
    case "swiftCode":
      if (!value) return "SWIFT/BIC code is required";
      if (!validateSWIFT(value)) {
        return `Invalid SWIFT/BIC code (should be 8 or 11 alphanumeric characters)`;
      }
      return null;
    
    case "routingNumber":
      if (!value) return "Routing number is required";
      if (!validateRoutingNumber(value)) {
        return `Invalid routing number (should be 9 digits)`;
      }
      return null;
    
    default:
      return null;
  }
}

/**
 * Get all countries with their configurations
 */
export function getAllCountries(): string[] {
  return Object.keys(BANK_CONFIGURATIONS).sort();
}

/**
 * Check if country requires international bank details
 */
export function isInternationalCountry(country: string): boolean {
  const config = getBankFieldConfig(country);
  return config.isInternational;
}
