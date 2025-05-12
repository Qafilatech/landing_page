import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";

console.log('[BOOT] Frontend Environment Variables:', {
    // PORT: import.meta.env.VITE_PORT,
    // DATABASE_URL: import.meta.env.VITE_DATABASE_URL ? '***REDACTED***' : 'MISSING',
    VITE_SUPERTOKENS_API: import.meta.env.VITE_SUPERTOKENS_API ? '***REDACTED***' : 'MISSING',
    VITE_API_URL: import.meta.env.VITE_API_URL ?  '***REDACTED***' : 'MISSING',
});


export function getApiDomain() {
    return import.meta.env.VITE_API_URL || 'http://localhost:8088';
}

export function getWebsiteDomain() {
    return import.meta.env.VITE_WEBSITE_URL || 'http://localhost:3000';
}

export const SuperTokensConfig = {
    appInfo: {
        appName: "Qafila.Tech",
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

// export const PreBuiltUIList = [EmailPasswordPreBuiltUI];

export const ComponentWrapper = (props: { children: JSX.Element }): JSX.Element => {
    return props.children;
};


console.log("SuperTokens appInfo:", SuperTokensConfig); // Add this line
