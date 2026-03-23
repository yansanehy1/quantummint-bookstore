/**
 * Validation Utilities for Mail Server
 * Provides client-side validation for forms and user input
 */
class MailValidation {
    constructor() {
        this.patterns = {
            email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
            domain: /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
            ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            ipv6: /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/,
            port: /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/,
            username: /^[a-zA-Z0-9._-]{3,30}$/,
            mailboxName: /^[a-zA-Z0-9._-]{1,50}$/
        };

        this.messages = {
            required: 'This field is required',
            email: 'Please enter a valid email address',
            domain: 'Please enter a valid domain name',
            password: 'Password must be at least 8 characters long',
            passwordStrength: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
            passwordMatch: 'Passwords do not match',
            username: 'Username must be 3-30 characters and contain only letters, numbers, dots, underscores, and hyphens',
            mailboxName: 'Mailbox name must be 1-50 characters and contain only letters, numbers, dots, underscores, and hyphens',
            ipAddress: 'Please enter a valid IP address',
            port: 'Please enter a valid port number (1-65535)',
            minLength: 'Must be at least {min} characters long',
            maxLength: 'Must be no more than {max} characters long',
            numeric: 'Please enter a valid number',
            url: 'Please enter a valid URL'
        };
    }

    /**
     * Validate email address
     */
    validateEmail(email) {
        if (!email || typeof email !== 'string') {
            return { valid: false, message: this.messages.required };
        }

        email = email.trim();
        
        if (!email) {
            return { valid: false, message: this.messages.required };
        }

        if (email.length > 254) {
            return { valid: false, message: 'Email address is too long' };
        }

        if (!this.patterns.email.test(email)) {
            return { valid: false, message: this.messages.email };
        }

        // Check local part length (before @)
        const localPart = email.split('@')[0];
        if (localPart.length > 64) {
            return { valid: false, message: 'Email local part is too long' };
        }

        return { valid: true };
    }

    /**
     * Validate password
     */
    validatePassword(password, options = {}) {
        const {
            minLength = 8,
            requireStrength = true,
            allowEmpty = false
        } = options;

        if (!password && allowEmpty) {
            return { valid: true };
        }

        if (!password || typeof password !== 'string') {
            return { valid: false, message: this.messages.required };
        }

        if (password.length < minLength) {
            return { 
                valid: false, 
                message: this.messages.minLength.replace('{min}', minLength) 
            };
        }

        if (requireStrength) {
            const hasUppercase = /[A-Z]/.test(password);
            const hasLowercase = /[a-z]/.test(password);
            const hasNumbers = /\d/.test(password);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

            if (!hasUppercase || !hasLowercase || !hasNumbers || !hasSpecialChar) {
                return { valid: false, message: this.messages.passwordStrength };
            }
        }

        return { valid: true };
    }

    /**
     * Validate password confirmation
     */
    validatePasswordConfirmation(password, confirmPassword) {
        if (!confirmPassword) {
            return { valid: false, message: this.messages.required };
        }

        if (password !== confirmPassword) {
            return { valid: false, message: this.messages.passwordMatch };
        }

        return { valid: true };
    }

    /**
     * Validate domain name
     */
    validateDomain(domain) {
        if (!domain || typeof domain !== 'string') {
            return { valid: false, message: this.messages.required };
        }

        domain = domain.trim().toLowerCase();

        if (!domain) {
            return { valid: false, message: this.messages.required };
        }

        if (domain.length > 253) {
            return { valid: false, message: 'Domain name is too long' };
        }

        if (!this.patterns.domain.test(domain)) {
            return { valid: false, message: this.messages.domain };
        }

        // Check each label length
        const labels = domain.split('.');
        for (const label of labels) {
            if (label.length > 63) {
                return { valid: false, message: 'Domain label is too long' };
            }
        }

        return { valid: true };
    }

    /**
     * Validate username
     */
    validateUsername(username) {
        if (!username || typeof username !== 'string') {
            return { valid: false, message: this.messages.required };
        }

        username = username.trim();

        if (!username) {
            return { valid: false, message: this.messages.required };
        }

        if (!this.patterns.username.test(username)) {
            return { valid: false, message: this.messages.username };
        }

        return { valid: true };
    }

    /**
     * Validate mailbox name
     */
    validateMailboxName(name) {
        if (!name || typeof name !== 'string') {
            return { valid: false, message: this.messages.required };
        }

        name = name.trim();

        if (!name) {
            return { valid: false, message: this.messages.required };
        }

        if (!this.patterns.mailboxName.test(name)) {
            return { valid: false, message: this.messages.mailboxName };
        }

        return { valid: true };
    }

    /**
     * Validate IP address
     */
    validateIPAddress(ip) {
        if (!ip || typeof ip !== 'string') {
            return { valid: false, message: this.messages.required };
        }

        ip = ip.trim();

        if (!ip) {
            return { valid: false, message: this.messages.required };
        }

        const isIPv4 = this.patterns.ipv4.test(ip);
        const isIPv6 = this.patterns.ipv6.test(ip);

        if (!isIPv4 && !isIPv6) {
            return { valid: false, message: this.messages.ipAddress };
        }

        return { valid: true };
    }

    /**
     * Validate port number
     */
    validatePort(port) {
        if (!port && port !== 0) {
            return { valid: false, message: this.messages.required };
        }

        const portNum = parseInt(port, 10);
        
        if (isNaN(portNum) || portNum < 1 || portNum > 65535) {
            return { valid: false, message: this.messages.port };
        }

        return { valid: true };
    }

    /**
     * Validate URL
     */
    validateURL(url) {
        if (!url || typeof url !== 'string') {
            return { valid: false, message: this.messages.required };
        }

        url = url.trim();

        if (!url) {
            return { valid: false, message: this.messages.required };
        }

        try {
            new URL(url);
            return { valid: true };
        } catch (e) {
            return { valid: false, message: this.messages.url };
        }
    }

    /**
     * Validate required field
     */
    validateRequired(value, fieldName = 'Field') {
        if (value === null || value === undefined || value === '') {
            return { valid: false, message: `${fieldName} is required` };
        }

        if (typeof value === 'string' && !value.trim()) {
            return { valid: false, message: `${fieldName} is required` };
        }

        return { valid: true };
    }

    /**
     * Validate string length
     */
    validateLength(value, options = {}) {
        const { min, max, fieldName = 'Field' } = options;

        if (!value && min > 0) {
            return { valid: false, message: `${fieldName} is required` };
        }

        const length = value ? value.length : 0;

        if (min !== undefined && length < min) {
            return { 
                valid: false, 
                message: `${fieldName} must be at least ${min} characters long` 
            };
        }

        if (max !== undefined && length > max) {
            return { 
                valid: false, 
                message: `${fieldName} must be no more than ${max} characters long` 
            };
        }

        return { valid: true };
    }

    /**
     * Validate numeric value
     */
    validateNumeric(value, options = {}) {
        const { min, max, integer = false, fieldName = 'Field' } = options;

        if (!value && value !== 0) {
            return { valid: false, message: `${fieldName} is required` };
        }

        const num = parseFloat(value);

        if (isNaN(num)) {
            return { valid: false, message: `${fieldName} must be a valid number` };
        }

        if (integer && !Number.isInteger(num)) {
            return { valid: false, message: `${fieldName} must be a whole number` };
        }

        if (min !== undefined && num < min) {
            return { valid: false, message: `${fieldName} must be at least ${min}` };
        }

        if (max !== undefined && num > max) {
            return { valid: false, message: `${fieldName} must be no more than ${max}` };
        }

        return { valid: true };
    }

    /**
     * Validate file upload
     */
    validateFile(file, options = {}) {
        const {
            maxSize = 10 * 1024 * 1024, // 10MB default
            allowedTypes = [],
            allowedExtensions = []
        } = options;

        if (!file) {
            return { valid: false, message: 'Please select a file' };
        }

        if (file.size > maxSize) {
            const maxSizeMB = Math.round(maxSize / (1024 * 1024));
            return { valid: false, message: `File size must be less than ${maxSizeMB}MB` };
        }

        if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
            return { valid: false, message: `File type ${file.type} is not allowed` };
        }

        if (allowedExtensions.length > 0) {
            const extension = file.name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(extension)) {
                return { valid: false, message: `File extension .${extension} is not allowed` };
            }
        }

        return { valid: true };
    }

    /**
     * Validate form data
     */
    validateForm(formData, rules) {
        const errors = {};
        let isValid = true;

        for (const [fieldName, fieldRules] of Object.entries(rules)) {
            const value = formData[fieldName];
            const fieldErrors = [];

            for (const rule of fieldRules) {
                let result;

                switch (rule.type) {
                    case 'required':
                        result = this.validateRequired(value, rule.fieldName || fieldName);
                        break;
                    case 'email':
                        result = this.validateEmail(value);
                        break;
                    case 'password':
                        result = this.validatePassword(value, rule.options);
                        break;
                    case 'passwordConfirmation':
                        result = this.validatePasswordConfirmation(formData[rule.passwordField], value);
                        break;
                    case 'domain':
                        result = this.validateDomain(value);
                        break;
                    case 'username':
                        result = this.validateUsername(value);
                        break;
                    case 'mailboxName':
                        result = this.validateMailboxName(value);
                        break;
                    case 'ipAddress':
                        result = this.validateIPAddress(value);
                        break;
                    case 'port':
                        result = this.validatePort(value);
                        break;
                    case 'url':
                        result = this.validateURL(value);
                        break;
                    case 'length':
                        result = this.validateLength(value, { ...rule.options, fieldName: rule.fieldName || fieldName });
                        break;
                    case 'numeric':
                        result = this.validateNumeric(value, { ...rule.options, fieldName: rule.fieldName || fieldName });
                        break;
                    case 'file':
                        result = this.validateFile(value, rule.options);
                        break;
                    case 'custom':
                        result = rule.validator(value, formData);
                        break;
                    default:
                        result = { valid: true };
                }

                if (!result.valid) {
                    fieldErrors.push(result.message);
                    isValid = false;
                }
            }

            if (fieldErrors.length > 0) {
                errors[fieldName] = fieldErrors;
            }
        }

        return {
            valid: isValid,
            errors
        };
    }

    /**
     * Sanitize HTML to prevent XSS
     */
    sanitizeHtml(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    /**
     * Sanitize input value
     */
    sanitizeInput(value, options = {}) {
        if (!value || typeof value !== 'string') {
            return value;
        }

        const { 
            trim = true, 
            toLowerCase = false, 
            removeHtml = true,
            maxLength = null 
        } = options;

        let sanitized = value;

        if (trim) {
            sanitized = sanitized.trim();
        }

        if (toLowerCase) {
            sanitized = sanitized.toLowerCase();
        }

        if (removeHtml) {
            sanitized = this.sanitizeHtml(sanitized);
        }

        if (maxLength && sanitized.length > maxLength) {
            sanitized = sanitized.substring(0, maxLength);
        }

        return sanitized;
    }

    /**
     * Sanitize form data
     */
    sanitizeFormData(formData, rules = {}) {
        const sanitized = {};

        for (const [key, value] of Object.entries(formData)) {
            const rule = rules[key] || {};
            sanitized[key] = this.sanitizeInput(value, rule);
        }

        return sanitized;
    }

    /**
     * Real-time field validation
     */
    setupFieldValidation(form, rules) {
        const fields = form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            const fieldName = field.name;
            const fieldRules = rules[fieldName];
            
            if (!fieldRules) return;

            const validateField = () => {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                const validation = this.validateForm(data, { [fieldName]: fieldRules });
                
                // Clear previous errors
                field.classList.remove('is-invalid');
                const existingError = field.parentNode.querySelector('.invalid-feedback');
                if (existingError) {
                    existingError.remove();
                }

                // Show new errors
                if (!validation.valid && validation.errors[fieldName]) {
                    field.classList.add('is-invalid');
                    
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'invalid-feedback';
                    errorDiv.textContent = validation.errors[fieldName][0];
                    
                    field.parentNode.appendChild(errorDiv);
                }
            };

            // Validate on blur and input events
            field.addEventListener('blur', validateField);
            field.addEventListener('input', () => {
                // Debounce input validation
                clearTimeout(field._validationTimeout);
                field._validationTimeout = setTimeout(validateField, 500);
            });
        });
    }

    /**
     * Get validation rules for common forms
     */
    getCommonRules() {
        return {
            login: {
                email: [
                    { type: 'required' },
                    { type: 'email' }
                ],
                password: [
                    { type: 'required' }
                ]
            },
            
            register: {
                email: [
                    { type: 'required' },
                    { type: 'email' }
                ],
                password: [
                    { type: 'required' },
                    { type: 'password', options: { requireStrength: true } }
                ],
                confirmPassword: [
                    { type: 'required' },
                    { type: 'passwordConfirmation', passwordField: 'password' }
                ]
            },

            addUser: {
                email: [
                    { type: 'required' },
                    { type: 'email' }
                ],
                username: [
                    { type: 'required' },
                    { type: 'username' }
                ],
                password: [
                    { type: 'required' },
                    { type: 'password' }
                ]
            },

            addDomain: {
                domain: [
                    { type: 'required' },
                    { type: 'domain' }
                ]
            },

            sendEmail: {
                to: [
                    { type: 'required' },
                    { type: 'email' }
                ],
                subject: [
                    { type: 'required' },
                    { type: 'length', options: { max: 200 } }
                ],
                body: [
                    { type: 'required' }
                ]
            }
        };
    }
}

// Create global instance
const mailValidation = new MailValidation();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MailValidation;
} else {
    window.MailValidation = MailValidation;
    window.mailValidation = mailValidation;
}
