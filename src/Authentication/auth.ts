// src/auth.ts
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import { Pool } from 'pg';
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

export { pool };

export function initializeAuth() {    
    supertokens.init({
        framework: "express",
        supertokens: {
            connectionURI: process.env.SUPERTOKENS_CONNECTION_URI || "https://try.supertokens.com",
        },
        appInfo: {
            appName: "QafilaTech",
            apiDomain: process.env.API_DOMAIN || "http://localhost:8080",
            websiteDomain: process.env.WEBSITE_DOMAIN || "http://localhost:3000",
            apiBasePath: "/auth",
            websiteBasePath: "/auth",
        },
        recipeList: [
            EmailPassword.init({
                signUpFeature: {
                    formFields: [
                        {
                            id: "email",
                            validate: async (value) => {
                                if (!value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
                                    return "Please enter a valid email";
                                }
                                return undefined;
                            },
                        },
                        {
                            id: "password",
                            validate: async (value) => {
                                if (value.length < 8) {
                                    return "Password must be at least 8 characters";
                                }
                                return undefined;
                            },
                        }
                    ]
                },
                override: {
                    apis: (originalImplementation) => {
                        return {
                            ...originalImplementation,
                            signUpPOST: async (input) => {
                                const response = await originalImplementation.signUpPOST(input);
                                if (response.status === "OK") {
                                    try {
                                        await pool.query(
                                            `INSERT INTO public."Users" (supertokens_id, email, created_at)
                                            VALUES ($1, $2, $3)
                                            ON CONFLICT (supertokens_id) DO NOTHING`,
                                            [response.user.id, response.user.emails[0], new Date()]
                                        );
                                        console.log(`User ${response.user.id} stored in DB`);
                                    } catch (err) {
                                        console.log(`User ${response.user.id} not stored in DB`, err);
                                    }
                                }
                                return response;
                            }
                        };
                    }
                }
            }),
            Session.init({
                cookieSameSite: "lax",
                antiCsrf: "VIA_TOKEN",
            })
        ]
    });
}