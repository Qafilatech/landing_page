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
                functions: (originalImplementation) => {
                    return {
                        ...originalImplementation,
                        networkInterceptor: (request, userContext) => {
                            console.log("[NetworkInterceptor] Original Request URL:", request.url);
                            console.log("[NetworkInterceptor] UserContext:", userContext);

                            const tenantId = userContext?.tenantId as string | undefined;

                            if (tenantId && request.url.startsWith("/auth/")) {
                                const newUrl = `/${tenantId}${request.url}`;
                                console.log(`[NetworkInterceptor] Modified URL for tenant '${tenantId}': ${newUrl}`);
                                request.url = newUrl;
                            }
                            return request;
                        }
                    };
                }
            }
        }),
        Session.init({
            onHandleEvent: async (context) => {
                if (context.action === "SESSION_CREATED") {
                    console.log("Session created successfully");
                }
            }
        })
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
