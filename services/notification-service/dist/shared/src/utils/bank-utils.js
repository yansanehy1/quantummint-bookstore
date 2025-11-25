"use strict";
/**
 * Bank Account Validation Utility
 * Provides country-specific bank account field requirements
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBankFieldConfig = getBankFieldConfig;
exports.validateIBAN = validateIBAN;
exports.validateBBAN = validateBBAN;
exports.validateSWIFT = validateSWIFT;
exports.validateRoutingNumber = validateRoutingNumber;
exports.formatIBAN = formatIBAN;
exports.formatSWIFT = formatSWIFT;
exports.formatRoutingNumber = formatRoutingNumber;
exports.getValidationErrorMessage = getValidationErrorMessage;
exports.getAllCountries = getAllCountries;
exports.isInternationalCountry = isInternationalCountry;
// Country-specific bank account configurations
const BANK_CONFIGURATIONS = {
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
const DEFAULT_INTERNATIONAL_CONFIG = {
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
function getBankFieldConfig(country) {
    return BANK_CONFIGURATIONS[country] || DEFAULT_INTERNATIONAL_CONFIG;
}
/**
 * Validate IBAN format (basic validation)
 */
function validateIBAN(iban) {
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
function validateBBAN(bban) {
    // BBAN should be 9-12 digits
    const cleanBBAN = bban.replace(/\s/g, "");
    return /^\d{9,12}$/.test(cleanBBAN);
}
/**
 * Validate SWIFT/BIC code
 */
function validateSWIFT(swift) {
    // SWIFT code should be 8 or 11 characters
    const cleanSWIFT = swift.replace(/\s/g, "").toUpperCase();
    return /^[A-Z0-9]{8}([A-Z0-9]{3})?$/.test(cleanSWIFT);
}
/**
 * Validate Routing Number (US)
 */
function validateRoutingNumber(routingNumber) {
    // Routing number should be 9 digits
    const cleanRouting = routingNumber.replace(/\s/g, "");
    return /^\d{9}$/.test(cleanRouting);
}
/**
 * Format IBAN with spaces (every 4 characters)
 */
function formatIBAN(iban) {
    const cleanIBAN = iban.replace(/\s/g, "").toUpperCase();
    return cleanIBAN.replace(/(.{4})/g, "$1 ").trim();
}
/**
 * Format SWIFT code
 */
function formatSWIFT(swift) {
    return swift.replace(/\s/g, "").toUpperCase();
}
/**
 * Format Routing Number
 */
function formatRoutingNumber(routing) {
    return routing.replace(/\s/g, "");
}
/**
 * Get validation error message
 */
function getValidationErrorMessage(field, value, config) {
    switch (field) {
        case "accountNumber":
            if (!value)
                return "Account number is required";
            if (config.requiresIBAN && !validateIBAN(value)) {
                return `Invalid IBAN format (should be 15-34 characters starting with 2 letters and 2 digits)`;
            }
            if (config.requiresBAAN && !validateBBAN(value)) {
                return `Invalid BBAN format (should be 9-12 digits)`;
            }
            return null;
        case "swiftCode":
            if (!value)
                return "SWIFT/BIC code is required";
            if (!validateSWIFT(value)) {
                return `Invalid SWIFT/BIC code (should be 8 or 11 alphanumeric characters)`;
            }
            return null;
        case "routingNumber":
            if (!value)
                return "Routing number is required";
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
function getAllCountries() {
    return Object.keys(BANK_CONFIGURATIONS).sort();
}
/**
 * Check if country requires international bank details
 */
function isInternationalCountry(country) {
    const config = getBankFieldConfig(country);
    return config.isInternational;
}
