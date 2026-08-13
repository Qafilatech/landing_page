import express, { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { verifySession } from 'supertokens-node/recipe/session/framework/express';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import crypto from 'crypto';
// import {pool}  from '../Authentication/auth' // or wherever you export the pool


const router = express.Router();

// TODO: Consider if this generic /user endpoint needs to be tenant-aware or removed/changed.
router.get("/user", verifySession(), async(req,res) =>{
    // try{
    //     const result = await pool.query('SELECT * FROM public."Users"');
    //     res.json({users: result.rows});
    // } catch (error){
    //     console.log('Error fetching users:', error);
    //     res.status(500).json({message: "Internal server error"});
    // }

    res.json("We LIVE")
});

router.post("/:tenantId/users/invite", verifySession(), async (req: Request, res: Response) => {
    try {
        const session = (req as any).session;
        const { tenantId } = req.params;
        const { emailToInvite } = req.body;

        if (!tenantId) {
            return res.status(400).json({ message: "Tenant ID is required" });
        }
        if (!emailToInvite) {
            return res.status(400).json({ message: "Email to invite is required" });
        }

        const invitingSupertokensUserId = session!.getUserId();
        // TODO: Fetch inviting user's details from 'Users' table using invitingSupertokensUserId.
        // TODO: Verify this user belongs to the 'tenantId' from the URL (e.g., by checking their linked business_id or a tenant_id column) AND has admin rights (e.g., user_type === 'business').
        // TODO: Fetch the inviting user's actual business_id which should correspond to this tenantId.
        // For now, assume the user is an admin and this is their business_id linked to the tenantId
        const invitingUserBusinessId = 1; // Placeholder - Replace with actual business_id for the tenant.

        // SuperTokens calls are tenant-aware due to backendConfig.ts overrides
        const existingUser = await EmailPassword.getUserByEmail(emailToInvite);
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }

        const temporaryPassword = crypto.randomBytes(16).toString('hex');
        const signUpResponse = await EmailPassword.signUp(emailToInvite, temporaryPassword);

        if (signUpResponse.status !== "OK") {
            // Handle case where sign up was not OK (e.g. email already exists - though we checked, this is a safeguard)
            return res.status(500).json({ message: "Failed to create user in SuperTokens" });
        }
        const newSupertokensUserId = signUpResponse.user.id;

        // TODO: Insert into 'Users' table: emailToInvite, newSupertokensUserId, user_type = 'invited_user' (or 'business'), and the invitingUserBusinessId (which corresponds to tenantId). Ensure this business_id correctly links to the tenant.
        // Ensure the 'password' column in your 'Users' table is not filled with the temporary password or is handled appropriately.
        console.log(`// TODO: Insert into 'Users' table for tenant '${tenantId}': email: ${emailToInvite}, supertokensUserId: ${newSupertokensUserId}, user_type: 'invited_user', businessId: ${invitingUserBusinessId}`);

        // SuperTokens call is tenant-aware
        const tokenResponse = await EmailPassword.createResetPasswordToken(newSupertokensUserId);
        if (tokenResponse.status !== "OK") {
            // Handle error in token generation
            return res.status(500).json({ message: "Failed to generate password reset token" });
        }
        const token = tokenResponse.token;

        // const websiteDomain = "http://localhost:3000"; // Example, retrieve from config (e.g., from process.env or a config file)
        // TODO: Send an email to 'emailToInvite' with a tenant-aware link: ${websiteDomain}/${tenantId}/activate-account?token=${token}
        console.log(`// TODO: Send email to ${emailToInvite} for tenant '${tenantId}' with link: http://localhost:3000/${tenantId}/activate-account?token=${token}`);

        return res.status(200).json({ message: `Invitation sent successfully for tenant ${tenantId}.` });

    } catch (error) {
        console.error("Error inviting user:", error);
        // Check for SuperTokens specific errors if needed, e.g. error.isSuperTokensError
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/:tenantId/users/activate", async (req: Request, res: Response) => {
    try {
        const { tenantId } = req.params;
        const { token, newPassword } = req.body;

        if (!tenantId) {
            return res.status(400).json({ message: "Tenant ID is required" });
        }
        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required" });
        }

        // SuperTokens call is tenant-aware due to backendConfig.ts and how the token was generated
        const response = await EmailPassword.resetPasswordUsingToken(token, newPassword);

        if (response.status === "OK") {
            // TODO: Optionally, update user status/type in your local 'Users' table from 'invited_user' to 'active_user' or 'business' FOR THIS TENANT.
            // This requires fetching the supertokens_user_id associated with the token if not directly available,
            // or modifying the user record based on other criteria if the token doesn't directly yield the user ID post-consumption.
            // Note: resetPasswordUsingToken itself doesn't directly return the user ID in its success response.
            // One way to get the userId would be to now ask the user to login (to the specific tenant), then get their Id.
            console.log(`// TODO: Optionally, update user status/type in local 'Users' table for tenant '${tenantId}'.`);
            return res.status(200).json({ message: "Password updated successfully. You can now log in." });
        } else if (response.status === "RESET_PASSWORD_INVALID_TOKEN_ERROR") {
            return res.status(400).json({ message: "Invalid or expired token." });
        } else {
            // Handle other SuperTokens specific errors
            console.error(`SuperTokens reset password error for tenant '${tenantId}':`, response);
            return res.status(500).json({ message: "Failed to update password. Please try again." });
        }

    } catch (error) {
        console.error(`Error activating account for tenant '${tenantId}':`, error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router