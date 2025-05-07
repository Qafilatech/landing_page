
import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import { TypeInput } from "supertokens-node/types";
import * as dotenv from "dotenv";

dotenv.config();

// 1. ENVIRONMENT CHECKS ==============================================
console.log('[BOOT] Backend Environment Variables:', {
  PORT: process.env.PORTS,
  DATABASE_URL: process.env.DATABASE_URL ? '***REDACTED***' : 'MISSING',
  SUPATOKSUPERTOKENS_CONNECTION_URIEN_URL: process.env.SUPATOKSUPERTOKENS_CONNECTION_URIEN_URL ? '***REDACTED***' : 'MISSING',
  SUPATOKSUPERTOKENS_API: process.env.SUPATOKSUPERTOKENS_API ?  '***REDACTED***'  : 'MISSING',
  VITE_APP_API_URL: process.env.VITE_APP_API_URL
});


export function getApiDomain() {
  const apiPort = process.env.VITE_APP_API_PORT || 3001;
  const apiUrl = process.env.VITE_APP_API_URL || `http://localhost:${apiPort}`;
  return apiUrl;
}

export function getWebsiteDomain() {
  const websitePort = process.env.VITE_APP_WEBSITE_PORT || 3000;
  const websiteUrl = process.env.VITE_APP_WEBSITE_URL || `http://localhost:${websitePort}`;
  return websiteUrl;
}

export const SuperTokensConfig: TypeInput = {
  supertokens: {
      // this is the location of the SuperTokens core.
      connectionURI: process.env.SUPATOKSUPERTOKENS_CONNECTION_URIEN_URL ||"https://try.supertokens.com",
  },
  appInfo: {
      appName: "Qafila.Tech",
      apiDomain: getApiDomain(),
      websiteDomain: getWebsiteDomain(),
  },
  // recipeList contains all the modules that you want to
  // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
  recipeList: [EmailPassword.init(), Session.init()],
};




