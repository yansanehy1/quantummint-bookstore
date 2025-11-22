export const ENV = {
  oAuthServerUrl: process.env.OAUTH_SERVER_URL || "",
  appId: process.env.APP_ID || "",
  cookieSecret: process.env.COOKIE_SECRET || "development-secret",
};

export default ENV;
