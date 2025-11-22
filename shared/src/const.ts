// Shared constants used across frontend and services
export const COOKIE_NAME = "sb.session";

// One year in milliseconds
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;

// Axios default timeout for service-to-service and SDK calls
export const AXIOS_TIMEOUT_MS = 15000;

export default {
  COOKIE_NAME,
  ONE_YEAR_MS,
  AXIOS_TIMEOUT_MS,
};
