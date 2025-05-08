
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import { TypeInput } from "supertokens-node/types";
import * as dotenv from "dotenv";

dotenv.config();

// 1. ENVIRONMENT CHECKS ==============================================
console.log('[BOOT] Backend Environment Variables:', {
  PORT: process.env.PORTS,
  DATABASE_URL: process.env.DATABASE_URL ? '***REDACTED***' : 'MISSING',
  SUPERTOKENS_CONNECTION_URI: process.env.SUPERTOKENS_CONNECTION_URI ? '***REDACTED***' : 'MISSING',
  SUPERTOKENS_API_KEY: process.env.SUPERTOKENS_API_KEY ?  '***REDACTED***'  : 'MISSING',
  API_URL: process.env.API_URL
});


export function getApiDomain() {
  return process.env.API_URL || 'http://localhost:8088';
}

export function getWebsiteDomain() {
  return process.env.WEBSITE_URL || 'http://localhost:3000';
}

export const SuperTokensConfig: TypeInput = {
  supertokens: {
      // this is the location of the SuperTokens core.
      connectionURI: process.env.SUPERTOKENS_CONNECTION_URI ||"https://try.supertokens.com",
      apiKey: process.env.SUPERTOKENS_API_KEY
  },
  appInfo: {
      appName: "Qafila.Tech",
      apiDomain: getApiDomain(),
      websiteDomain: getWebsiteDomain(),
      apiBasePath: "/auth",
      websiteBasePath: "/auth"
  },
  // recipeList contains all the modules that you want to
  // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
  recipeList: [EmailPassword.init(), Session.init({
    cookieDomain: "localhost",
    sessionExpiredStatusCode: 401,
    errorHandlers: {
      onUnauthorised: async (message, request, response) => {
        // Your error handling
      }}
  })],
};




