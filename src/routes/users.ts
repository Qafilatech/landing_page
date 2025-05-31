import express, { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { verifySession } from 'supertokens-node/recipe/session/framework/express';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import crypto from 'crypto';
// import {pool}  from '../Authentication/auth' // or wherever you export the pool


const router = express.Router();

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

router.post("/invite", verifySession(), async (req: Request, res: Response) => {
    try {
        const session = (req as any).session;
        const { emailToInvite } = req.body;

        if (!emailToInvite) {
            return res.status(400).json({ message: "Email to invite is required" });
        }

        // TODO: Get supertokens_user_id from session: session!.getUserId()
        // TODO: Fetch inviting user's details from 'Users' table using supertokens_user_id.
        // TODO: Check if invitingUser.user_type === 'business' and if they are linked to a valid business_id in 'Businesses' table.
        // For now, assume the user is an admin and get their business_id (e.g., const invitingUserBusinessId = 1;)
        const invitingUserBusinessId = 1; // Placeholder

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

        // TODO: Insert into 'Users' table: emailToInvite, newSupertokensUserId, user_type = 'invited_user' (or 'business'), and the invitingUserBusinessId.
        // Ensure the 'password' column in your 'Users' table is not filled with the temporary password or is handled appropriately.
        console.log(`// TODO: Insert into 'Users' table: email: ${emailToInvite}, supertokensUserId: ${newSupertokensUserId}, user_type: 'invited_user', businessId: ${invitingUserBusinessId}`);


        const tokenResponse = await EmailPassword.createResetPasswordToken(newSupertokensUserId);
        if (tokenResponse.status !== "OK") {
            // Handle error in token generation
            return res.status(500).json({ message: "Failed to generate password reset token" });
        }
        const token = tokenResponse.token;

        // TODO: Send an email to 'emailToInvite' with a link like: ${websiteDomain}/activate-account?token=${token}
        // const websiteDomain = "http://localhost:3000"; // Example, retrieve from config
        console.log(`// TODO: Send email to ${emailToInvite} with link: http://localhost:3000/activate-account?token=${token}`);

        return res.status(200).json({ message: "Invitation sent successfully." });

    } catch (error) {
        console.error("Error inviting user:", error);
        // Check for SuperTokens specific errors if needed, e.g. error.isSuperTokensError
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/activate", async (req: Request, res: Response) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required" });
        }

        const response = await EmailPassword.resetPasswordUsingToken(token, newPassword);

        if (response.status === "OK") {
            // TODO: Optionally, update user status/type in your local 'Users' table from 'invited_user' to 'active_user' or 'business'.
            // This requires fetching the supertokens_user_id associated with the token if not directly available,
            // or modifying the user record based on other criteria if the token doesn't directly yield the user ID post-consumption.
            // Note: resetPasswordUsingToken itself doesn't directly return the user ID in its success response.
            // One way to get the userId would be to now ask the user to login, then get their Id.
            console.log("// TODO: Optionally, update user status/type in your local 'Users' table.");
            return res.status(200).json({ message: "Password updated successfully. You can now log in." });
        } else if (response.status === "RESET_PASSWORD_INVALID_TOKEN_ERROR") {
            return res.status(400).json({ message: "Invalid or expired token." });
        } else {
            // Handle other SuperTokens specific errors, e.g., if password policy is not met (though typically checked client-side first)
            console.error("SuperTokens reset password error:", response);
            return res.status(500).json({ message: "Failed to update password. Please try again." });
        }

    } catch (error) {
        console.error("Error activating account:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router