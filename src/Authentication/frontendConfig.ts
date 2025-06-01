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
        apiBasePath: "/api", // Set apiBasePath to /api
    },
    // recipeList contains all the modules that you want to
    // use from SuperTokens. See the full list here: https://supertokens.com/docs/guides
    recipeList: [
        EmailPassword.init({
            override: {
                networkInterceptor: (request, userContext) => {
                    console.log("[NetworkInterceptor] Original Request URL:", request.url);
                    console.log("[NetworkInterceptor] UserContext:", userContext);

                    const tenantId = userContext?.tenantId as string | undefined;

                    // Check if tenantId is present and the request is for a SuperTokens auth path.
                    // The request.url here is relative to apiDomain + apiBasePath.
                    // Since apiBasePath is /api, request.url will be like /auth/signin.
                    // We want to transform it to /api/<tenantId>/auth/signin.
                    // The fetch will be made to apiDomain + new request.url.
                    if (tenantId && request.url.startsWith("/auth/")) {
                        // Prepend /api/${tenantId} - but apiBasePath is already /api.
                        // So, the SDK will call apiDomain + apiBasePath + request.url
                        // e.g. http://localhost:8088/api/auth/signin by default
                        // We need to make it http://localhost:8088/api/<tenantId>/auth/signin
                        // So, the new request.url should effectively be /<tenantId>/auth/signin
                        // when combined with apiBasePath of /api.

                        // Let's clarify:
                        // SuperTokens constructs the final URL as: apiDomain + apiBasePath + request.url (from interceptor)
                        // Our apiDomain is http://localhost:8088
                        // Our apiBasePath is /api
                        // The original request.url from ST core is /auth/signin (for example)
                        // So default call is http://localhost:8088/api/auth/signin
                        // Our backend expects http://localhost:8088/api/<tenantId>/auth/signin
                        // So the interceptor should change request.url from /auth/signin to /<tenantId>/auth/signin
                        // The final URL will be apiDomain + apiBasePath + (new request.url)
                        // http://localhost:8088 + /api + /<tenantId>/auth/signin

                        const newUrl = `/${tenantId}${request.url}`;
                        console.log(`[NetworkInterceptor] Modified URL for tenant '${tenantId}': ${newUrl}`);
                        request.url = newUrl;
                    }
                    return request;
                }
            }
        }),
        Session.init()
    ],
    getRedirectionURL: async (context) => {
        // Log the context to understand what's available, especially userContext
        console.log("[getRedirectionURL] Context:", context);

        if (context.action === "SUCCESS") { // newSessionCreated check can be here or removed if redirect always happens on SUCCESS
            const tenantId = context.userContext?.tenantId as string | undefined;
            console.log("[getRedirectionURL] UserContext tenantId:", tenantId);

            if (tenantId) {
                if (tenantId === "superadmin_tenant") {
                    console.log("[getRedirectionURL] Redirecting to Super Admin Dashboard");
                    return "/superadmin/dashboard";
                } else {
                    const redirectPath = `/${tenantId}/admin`;
                    console.log(`[getRedirectionURL] Redirecting to tenant admin: ${redirectPath}`);
                    return redirectPath;
                }
            } else {
                // Fallback if tenantId is not in userContext for some reason after a successful login.
                // This might indicate an issue with how userContext was passed or if the login flow
                // somehow didn't include it.
                console.warn("[getRedirectionURL] tenantId not found in userContext after successful login. Defaulting to /auth page.");
                return "/auth?error=missing_tenant_context"; // Redirect to login with an error, or a generic error page
            }
        }
        // For other actions like "SIGN_IN_AND_UP", "GET_LOGIN_METHODS", etc., or if not SUCCESS:
        // Return undefined to let SuperTokens handle its default redirection logic.
        console.log(`[getRedirectionURL] Action: ${context.action}. No custom redirection defined, SuperTokens default will apply.`);
        return undefined;
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
