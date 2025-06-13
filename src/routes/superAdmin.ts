import express, { Router, Request, Response } from 'express';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';
// import EmailPassword from 'supertokens-node/recipe/emailpassword'; // Not directly needed for this route unless creating users here
// import { User } from '../models/user'; // Example user model
import pool from '../db'; // Placeholder for DB client
// import axios from 'axios'; // Placeholder for HTTP client to call SuperTokens core

const router: Router = Router();

const SUPERADMIN_TENANT_ID = "superadmin_tenant";

/**
 * POST /companies/create
 *
 * Creates a new company in the local database and a corresponding tenant in SuperTokens.
 * This route must be accessed by a logged-in super admin.
 * The full request path is expected to be like /api/superadmin_tenant/companies/create,
 * which allows the getTenantIdFromURL in backendConfig to resolve "superadmin_tenant" for session verification.
 */
router.post('/companies/create', verifySession(), async (req: Request, res: Response) => {
    try {
        const session = (req as any).session;

        // Authorization: Ensure the logged-in user is from the superadmin_tenant
        if (session.getTenantId() !== SUPERADMIN_TENANT_ID) {
            return res.status(403).json({ message: "Forbidden: Access restricted to super admins." });
        }

        const { companyName, desiredTenantId, details } = req.body;

        // Basic validation
        if (!companyName || !desiredTenantId) {
            return res.status(400).json({ message: "Company name and desired tenant ID are required." });
        }
        if (/\s/.test(desiredTenantId) || desiredTenantId !== desiredTenantId.toLowerCase()) {
            return res.status(400).json({ message: "Desired Tenant ID must be lowercase and contain no spaces." });
        }
        // Potentially add more validation for desiredTenantId (e.g., length, allowed characters, check if exists)


        console.log(`[SuperAdmin] Received request to create company: ${companyName}, tenantId: ${desiredTenantId}, details: ${details}`);

        // Step 1: Create Company in Local DB (Placeholder)
        console.log("[SuperAdmin] Attempting to save company to local DB...");
        // TODO: Implement database logic to save the new company.
        // Example:
        // const dbResult = await pool.query(
        //   "INSERT INTO \"Businesses\" (company_name, supertokens_tenant_id, other_details) VALUES ($1, $2, $3) RETURNING *",
        //   [companyName, desiredTenantId, details]
        // );
        // const newCompany = dbResult.rows[0];
        // console.log("[SuperAdmin] Company saved to DB:", newCompany);

        const dbConn = await pool.query(
            `INSERT INTO "Businesses" 
            ( company_name, company_address, company_cr, supertokens_tenant_id) 
            VALUES ($1, $2, $3, $4) RETURNING *`,
            [ companyName, details.address, details.crNumber, desiredTenantId]
        )
        const newCompany = dbConn.rows[0];
        console.log("[SuperAdmin] Company saved to DB:", newCompany);
        const newCompanyPlaceholder = { id: Date.now(), company_name: companyName, supertokens_tenant_id: desiredTenantId, other_details: details, created_at: new Date() };


        // Step 2: Create Tenant in SuperTokens Core (Placeholder)
        console.log(`[SuperAdmin] Attempting to create SuperTokens tenant '${desiredTenantId}'...`);
        // TODO: Implement HTTP call to SuperTokens core API to create tenant.
        const supertokensCoreUrl = process.env.REACT_APP_SUPERTOKENS_CONNECTION_URI || 'http://localhost:3567'; 
        const supertokensApiKey = process.env.REACT_APP_SUPERTOKENS_API_KEY; 
        const tenantConfig = {
            tenantId: desiredTenantId,
            emailPassword: { enabled: true }, // Configure features for the new tenant
            thirdParty: { enabled: false },
            passwordless: { enabled: false },
            session: { 
                enabled: true,
                settings:{
                    // Session lifetime settings
                    accessTokenValidity: 86400,  // 1 day in seconds
                    refreshTokenValidity: 1209600,  // 14 days in seconds
                    // Domain and cookie settings
                    cookieSameSite: "lax",
                    //TODO: convert to production when launching 
                    cookieSecure: process.env.NODE_ENV === "development",
                    domain: "qafila.tech"
                } 
            },
            userRoles: {
                enabled: true,
                // Default roles for new users in this tenant
                defaultRoles: ["business-admin"]
            },
            permissionClaims: {
                enabled: true
            }
             // Assuming session recipe is used by tenants
            // Add other recipe configs as needed
        };
        // try {
        //     // Use appropriate HTTP client, e.g., axios or node-fetch
        //     // await axios.put(`${supertokensCoreUrl}/ee/tenant`, tenantConfig, {
        //     //    headers: { 'api-key': supertokensApiKey, 'Content-Type': 'application/json' }
        //     // });
        //     console.log(`[SuperAdmin] SuperTokens tenant '${desiredTenantId}' creation initiated successfully (SIMULATED).`);
        // } catch (stError: any) {
        //     console.error(`[SuperAdmin] Failed to create SuperTokens tenant '${desiredTenantId}':`, stError.response?.data || stError.message);
        //     // TODO: Implement rollback for local DB company creation or mark company as 'pending_tenant_creation'.
        //     // For example, delete the company record or update its status.
        //     // await pool.query("DELETE FROM \"Businesses\" WHERE id = $1", [newCompanyPlaceholder.id]);
        //     throw new Error('Failed to create tenant in SuperTokens core. Company creation rolled back.');
        // }

        // Simulate success for now
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async operation

        res.status(201).json({
            message: "Company registered and tenant creation initiated successfully (SIMULATED).",
            company: newCompanyPlaceholder // Use actual newCompany from DB result in real implementation
        });

    } catch (error: any) {
        console.error("[SuperAdmin] Error in /companies/create:", error);
        res.status(500).json({ message: error.message || "Internal server error." });
    }
});

export default router;
