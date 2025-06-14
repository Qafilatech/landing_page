import supertokens from "supertokens-node";
import EmailPassword from "supertokens-node/recipe/emailpassword";
import dotenv from "dotenv";
dotenv.config();


supertokens.init({
    supertokens: {
        connectionURI: process.env.REACT_APP_SUPERTOKENS_CONNECTION_URI,
        apiKey: process.env.REACT_APP_SUPERTOKENS_API_KEY
    },
    appInfo: {
        appName: "Qafila.Tech",
        apiDomain: process.env.REACT_APP_API_URL,
        websiteDomain: process.env.REACT_APP_WEBSITE_URL,
        apiBasePath: "/api",
        websiteBasePath: "/auth"
    },
    recipeList: [EmailPassword.init()]
});

async function createSuperAdmin() {
    const email = "ahlamyusuff623@gmail.com";
    const password = "Ahlamyusuf2521";
    const tenantId = "superadmin_tenant";

    try {
        const response = await EmailPassword.signUp("public", email, password, { tenantId });
        console.log("Superadmin created:", response);
    } catch (err) {
        console.error("Error creating superadmin:", err);
    }
}

createSuperAdmin();

// node scripts/createSuperAdmin.js.