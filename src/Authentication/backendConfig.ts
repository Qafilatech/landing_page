import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import AccountLinking from "supertokens-node/recipe/accountlinking";
import { TypeInput } from "supertokens-node/types";
import * as dotenv from "dotenv";
import { Request } from 'express'; // Added for request type in getTenantIdFromURL

dotenv.config();

// Helper function to extract tenantId from URL
const getTenantIdFromRequest = (req: Request): string | undefined => {
    // 1. Check URL
    const pathParts = req.originalUrl.split('/');
    if (pathParts.length > 2 && pathParts[1] === 'api') {
        const potentialTenantId = pathParts[2];
        if (potentialTenantId && potentialTenantId !== 'auth') {
            console.log(`[TenantCheck] Found in URL: ${potentialTenantId}`);
            return potentialTenantId;
        }
    }
    // 2. Check body (for signIn/signUp)
    console.log("[TenantCheck] req.body:", req.body);
    if (req.body?.userContext?.tenantId) {
        console.log(`[TenantCheck] Found in body: ${req.body.userContext.tenantId}`);
        return req.body.userContext.tenantId;
    }
    // 3. Check header (optional)
    if (req.headers['x-tenant-id']) {
        console.log(`[TenantCheck] Found in header: ${req.headers['x-tenant-id']}`);
        return req.headers['x-tenant-id'] as string;
    }
    console.log("[TenantCheck] No tenantId found, defaulting to undefined");
    return undefined;
};

// Custom password validation function
const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 8) {
        errors.push("Password must be at least 8 characters long.");
    }
    if (!/[0-9]/.test(password)) {
        errors.push("Password must contain at least one number.");
    }
    if (!/[A-Z]/.test(password)) {
        errors.push("Password must contain at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
        errors.push("Password must contain at least one lowercase letter.");
    }
    // console.log("[ValidatePassword] Errors:", errors); // For debugging
    return errors;
};

// 1. ENVIRONMENT CHECKS ==============================================
console.log('[BOOT] Backend Environment Variables:', {
  PORT: process.env.PORTS,
  // DATABASE_URL: process.env.DATABASE_URL, // ? '***REDACTED***' : 'MISSING',
  REACT_APP_SUPERTOKENS_CONNECTION_URI: process.env.REACT_APP_SUPERTOKENS_CONNECTION_URI ,//? '***REDACTED***' : 'MISSING',
  REACT_APP_SUPERTOKENS_API_KEY: process.env.REACT_APP_SUPERTOKENS_API_KEY  ,//?  '***REDACTED***'  : 'MISSING',
  API_URL: process.env.REACT_APP_API_URL
});


export function getApiDomain() {
  return process.env.REACT_APP_API_URL || 'http://localhost:8088';
}

export function getWebsiteDomain() {
  return process.env.REACT_APP_WEBSITE_URL || 'http://localhost:3000';
}

export const SuperTokensConfig: TypeInput = {
  supertokens: {
      // this is the location of the SuperTokens core.
      connectionURI: process.env.REACT_APP_SUPERTOKENS_CONNECTION_URI ||"https://try.supertokens.com",
      apiKey: process.env.REACT_APP_SUPERTOKENS_API_KEY
  },
  appInfo: {
      appName: "Qafila.Tech",
      apiDomain: getApiDomain(),
      websiteDomain: getWebsiteDomain(),
      apiBasePath: "/api", // Adjusted apiBasePath
      websiteBasePath: "/auth"
  },
  // recipeList contains all the modules that you want to
  // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
  recipeList: [
    EmailPassword.init({
        override: {
            functions: (originalImplementation) => {
                return {
                    ...originalImplementation,
                    getTenantId: async (context) => {
                        return getTenantIdFromRequest(context.req as Request);
                    }
                };
            },
            apis: (originalImplementation) => {
                return {
                    ...originalImplementation,
                    signUpPOST: async function (input) {
                        const passwordField = input.formFields.find(field => field.id === "password");
                        if (passwordField) {
                            const customErrors = validatePassword(passwordField.value as string);
                            if (customErrors.length > 0) {
                                return {
                                    status: "GENERAL_ERROR",
                                    message: customErrors.join(" ")
                                };
                            }
                        }
                        return originalImplementation.signUpPOST(input);
                    },
                    passwordResetPOST: async function (input) {
                        const passwordField = input.formFields.find(field => field.id === "newPassword");
                        if (passwordField) {
                            const customErrors = validatePassword(passwordField.value as string);
                            if (customErrors.length > 0) {
                                return {
                                    status: "GENERAL_ERROR",
                                    message: customErrors.join(" ")
                                };
                            }
                        }
                        return originalImplementation.passwordResetPOST(input);
                    }
                };
            }
        }
    }),
    Session.init({
        cookieDomain: process.env.NODE_ENV === "production" ? "qafila.tech" : "localhost",
        cookieSameSite: "lax",
        cookieSecure: process.env.NODE_ENV === "production",
        sessionExpiredStatusCode: 401,
        override: {
            functions: (originalImplementation) => {
                return {
                    ...originalImplementation,
                    getTenantId: async (context) => {
                        return getTenantIdFromRequest(context.req as Request);
                    }
                };
            }
        }
    }),
    AccountLinking.init({
      shouldDoAutomaticAccountLinking: async () => {
        // Disable automatic account linking
        return { shouldAutomaticallyLink: false };
      }
    })
],
};

console.log("Backend is Live");



