// Test file to verify the shared module
const { ServiceRegistryClient } = require('@quantummin/shared');

console.log('ServiceRegistryClient:', ServiceRegistryClient);

// Try to create an instance
const client = new ServiceRegistryClient();
console.log('ServiceRegistryClient instance created successfully:', client);
