/**
 * Validation Utilities for Domain Controller
 * Provides client-side validation for forms and data
 */
class DomainValidator {
    /**
     * Validate username
     */
    static validateUsername(username) {
        const errors = [];
        
        if (!username || username.trim().length === 0) {
            errors.push('Username is required');
        } else {
            if (username.length < 3) {
                errors.push('Username must be at least 3 characters long');
            }
            if (username.length > 20) {
                errors.push('Username must be no more than 20 characters long');
            }
            if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
                errors.push('Username can only contain letters, numbers, dots, hyphens, and underscores');
            }
            if (/^[._-]/.test(username) || /[._-]$/.test(username)) {
                errors.push('Username cannot start or end with special characters');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate password
     */
    static validatePassword(password, policy = {}) {
        const errors = [];
        const defaultPolicy = {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
            maxLength: 128
        };
        
        const activePolicy = { ...defaultPolicy, ...policy };
        
        if (!password) {
            errors.push('Password is required');
            return { isValid: false, errors };
        }
        
        if (password.length < activePolicy.minLength) {
            errors.push(`Password must be at least ${activePolicy.minLength} characters long`);
        }
        
        if (password.length > activePolicy.maxLength) {
            errors.push(`Password must be no more than ${activePolicy.maxLength} characters long`);
        }
        
        if (activePolicy.requireUppercase && !/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        
        if (activePolicy.requireLowercase && !/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        
        if (activePolicy.requireNumbers && !/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        
        if (activePolicy.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate email address
     */
    static validateEmail(email) {
        const errors = [];
        
        if (!email || email.trim().length === 0) {
            errors.push('Email address is required');
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.push('Please enter a valid email address');
            }
            if (email.length > 254) {
                errors.push('Email address is too long');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate group name
     */
    static validateGroupName(groupName) {
        const errors = [];
        
        if (!groupName || groupName.trim().length === 0) {
            errors.push('Group name is required');
        } else {
            if (groupName.length < 2) {
                errors.push('Group name must be at least 2 characters long');
            }
            if (groupName.length > 64) {
                errors.push('Group name must be no more than 64 characters long');
            }
            if (!/^[a-zA-Z0-9\s._-]+$/.test(groupName)) {
                errors.push('Group name can only contain letters, numbers, spaces, dots, hyphens, and underscores');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate computer name
     */
    static validateComputerName(computerName) {
        const errors = [];
        
        if (!computerName || computerName.trim().length === 0) {
            errors.push('Computer name is required');
        } else {
            if (computerName.length < 1) {
                errors.push('Computer name is required');
            }
            if (computerName.length > 15) {
                errors.push('Computer name must be no more than 15 characters long');
            }
            if (!/^[a-zA-Z0-9-]+$/.test(computerName)) {
                errors.push('Computer name can only contain letters, numbers, and hyphens');
            }
            if (/^-/.test(computerName) || /-$/.test(computerName)) {
                errors.push('Computer name cannot start or end with a hyphen');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate IP address
     */
    static validateIPAddress(ip) {
        const errors = [];
        
        if (!ip || ip.trim().length === 0) {
            errors.push('IP address is required');
        } else {
            const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
            if (!ipRegex.test(ip)) {
                errors.push('Please enter a valid IP address');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate DNS record name
     */
    static validateDNSName(name, recordType = 'A') {
        const errors = [];
        
        if (!name || name.trim().length === 0) {
            errors.push('DNS name is required');
        } else {
            if (name.length > 253) {
                errors.push('DNS name is too long');
            }
            
            // Basic DNS name validation
            const dnsRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/;
            if (!dnsRegex.test(name) && name !== '@') {
                errors.push('Please enter a valid DNS name');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate DNS record value based on type
     */
    static validateDNSValue(value, recordType) {
        const errors = [];
        
        if (!value || value.trim().length === 0) {
            errors.push('DNS value is required');
            return { isValid: false, errors };
        }
        
        switch (recordType.toUpperCase()) {
            case 'A':
                const ipValidation = this.validateIPAddress(value);
                if (!ipValidation.isValid) {
                    errors.push('A record must contain a valid IPv4 address');
                }
                break;
                
            case 'AAAA':
                const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
                if (!ipv6Regex.test(value)) {
                    errors.push('AAAA record must contain a valid IPv6 address');
                }
                break;
                
            case 'CNAME':
            case 'MX':
            case 'NS':
                const nameValidation = this.validateDNSName(value);
                if (!nameValidation.isValid) {
                    errors.push(`${recordType} record must contain a valid domain name`);
                }
                break;
                
            case 'TXT':
                if (value.length > 255) {
                    errors.push('TXT record value is too long');
                }
                break;
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate TTL value
     */
    static validateTTL(ttl) {
        const errors = [];
        const ttlNum = parseInt(ttl, 10);
        
        if (isNaN(ttlNum)) {
            errors.push('TTL must be a valid number');
        } else {
            if (ttlNum < 60) {
                errors.push('TTL must be at least 60 seconds');
            }
            if (ttlNum > 86400) {
                errors.push('TTL must be no more than 86400 seconds (24 hours)');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validate form data
     */
    static validateForm(formData, rules) {
        const errors = {};
        let isValid = true;
        
        for (const [field, fieldRules] of Object.entries(rules)) {
            const value = formData[field];
            const fieldErrors = [];
            
            // Required validation
            if (fieldRules.required && (!value || value.toString().trim().length === 0)) {
                fieldErrors.push(`${fieldRules.label || field} is required`);
            }
            
            // Skip other validations if field is empty and not required
            if (!value && !fieldRules.required) {
                continue;
            }
            
            // Type-specific validations
            if (fieldRules.type && value) {
                switch (fieldRules.type) {
                    case 'username':
                        const usernameValidation = this.validateUsername(value);
                        fieldErrors.push(...usernameValidation.errors);
                        break;
                        
                    case 'password':
                        const passwordValidation = this.validatePassword(value, fieldRules.policy);
                        fieldErrors.push(...passwordValidation.errors);
                        break;
                        
                    case 'email':
                        const emailValidation = this.validateEmail(value);
                        fieldErrors.push(...emailValidation.errors);
                        break;
                        
                    case 'ip':
                        const ipValidation = this.validateIPAddress(value);
                        fieldErrors.push(...ipValidation.errors);
                        break;
                }
            }
            
            // Length validations
            if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
                fieldErrors.push(`${fieldRules.label || field} must be at least ${fieldRules.minLength} characters long`);
            }
            
            if (fieldRules.maxLength && value && value.length > fieldRules.maxLength) {
                fieldErrors.push(`${fieldRules.label || field} must be no more than ${fieldRules.maxLength} characters long`);
            }
            
            // Pattern validation
            if (fieldRules.pattern && value && !fieldRules.pattern.test(value)) {
                fieldErrors.push(fieldRules.patternMessage || `${fieldRules.label || field} format is invalid`);
            }
            
            // Custom validation
            if (fieldRules.validator && value) {
                const customValidation = fieldRules.validator(value, formData);
                if (customValidation && !customValidation.isValid) {
                    fieldErrors.push(...customValidation.errors);
                }
            }
            
            if (fieldErrors.length > 0) {
                errors[field] = fieldErrors;
                isValid = false;
            }
        }
        
        return {
            isValid,
            errors
        };
    }

    /**
     * Sanitize input to prevent XSS
     */
    static sanitizeInput(input) {
        if (typeof input !== 'string') {
            return input;
        }
        
        return input
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    /**
     * Validate and sanitize form data
     */
    static validateAndSanitize(formData, rules) {
        const validation = this.validateForm(formData, rules);
        
        if (validation.isValid) {
            const sanitizedData = {};
            for (const [key, value] of Object.entries(formData)) {
                if (rules[key] && rules[key].sanitize !== false) {
                    sanitizedData[key] = this.sanitizeInput(value);
                } else {
                    sanitizedData[key] = value;
                }
            }
            validation.data = sanitizedData;
        }
        
        return validation;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DomainValidator;
} else {
    window.DomainValidator = DomainValidator;
}
