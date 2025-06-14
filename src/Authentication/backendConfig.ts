import EmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import { TypeInput } from "supertokens-node/types";
import * as dotenv from "dotenv";
import { Request } from 'express'; // Added for request type in getTenantIdFromURL

dotenv.config();

// Helper function to extract tenantId from URL
const getTenantIdFromURL = (req: Request): string | undefined => {
    // Expects URL like /api/<tenantId>/... or /<tenantId>/... if apiBasePath is just /
    // Given apiBasePath will be /api, we expect /api/<tenantId>/...
    const pathParts = req.originalUrl.split('/');
    // Example for /api/customerA/users: ['', 'api', 'customerA', 'users']
    // Example for /api/auth/signin: ['', 'api', 'auth', 'signin'] - 'auth' should not be a tenantId
    if (pathParts.length > 2 && pathParts[1] === 'api') {
        const potentialTenantId = pathParts[2];
        // Add more sophisticated checks if needed, e.g., ensure it's not a reserved keyword like 'auth'
        // or matches a pattern, or exists in a list of known tenants.
        if (potentialTenantId && potentialTenantId !== 'auth') { // Ensure 'auth' or other global paths are not treated as tenants
            console.log(`[MultiTenancy] Detected tenantId: ${potentialTenantId} from URL: ${req.originalUrl}`);
            return potentialTenantId;
        }
    }
    console.log(`[MultiTenancy] No tenantId detected or path is not tenant-specific for URL: ${req.originalUrl}`);
    return undefined; // Default for non-tenant-specific paths or if pattern doesn't match
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
                        return getTenantIdFromURL(context.req as Request);
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
        cookieDomain: "localhost",
        sessionExpiredStatusCode: 401,
        override: {
            functions: (originalImplementation) => {
                return {
                    ...originalImplementation,
                    getTenantId: async (context) => {
                        return getTenantIdFromURL(context.req as Request);
                    }
                };
            }
        }
    })
],
};

console.log("Backend is Live",SuperTokensConfig);



