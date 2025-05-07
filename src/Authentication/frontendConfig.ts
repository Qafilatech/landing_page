import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import { EmailPasswordPreBuiltUI } from "supertokens-auth-react/recipe/emailpassword/prebuiltui";
import Session from "supertokens-auth-react/recipe/session";

console.log('[BOOT] Frontend Environment Variables:', {
    PORT: import.meta.env.VITE_APP_PORT,
    DATABASE_URL: import.meta.env.VITE_DATABASE_URL ? '***REDACTED***' : 'MISSING',
    SUPERTOKENS_CONNECTION_URI: import.meta.env.VITE_SUPERTOKENS_CONNECTION_URI ? '***REDACTED***' : 'MISSING',
    SUPERTOKENS_API: import.meta.env.VITE_SUPERTOKENS_API ? '***REDACTED***' : 'MISSING',
    VITE_APP_API_URL: import.meta.env.VITE_APP_API_URL
});

export function getApiDomain() {
    const apiPort = import.meta.env.VITE_APP_API_PORT || 3001;
    const apiUrl = import.meta.env.VITE_APP_API_URL || `http://localhost:${apiPort}`;
    return apiUrl;
}

export function getWebsiteDomain() {
    const websitePort = import.meta.env.VITE_APP_WEBSITE_PORT || 3000;
    const websiteUrl = import.meta.env.VITE_APP_WEBSITE_URL || `http://localhost:${websitePort}`;
    return websiteUrl;
}

export const SuperTokensConfig = {
    appInfo: {
        appName: "SuperTokens Demo App",
        apiDomain: getApiDomain(),
        websiteDomain: getWebsiteDomain(),
    },
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [EmailPassword.init(), Session.init()],
    getRedirectionURL: async (context) => {
        if (context.action === "SUCCESS" && context.newSessionCreated) {
            return "/";
        }
    },
};

export const recipeDetails = {
    docsLink: "https://supertokens.com/docs/emailpassword/introduction",
};

export const PreBuiltUIList = [EmailPasswordPreBuiltUI];

export const ComponentWrapper = (props: { children: JSX.Element }): JSX.Element => {
    return props.children;
};

