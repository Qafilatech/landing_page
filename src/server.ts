import express from 'express';
import cors from 'cors';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';
import { middleware } from 'supertokens-node/lib/build/framework/express/framework';
import { errorHandler } from './Middleware/errorHandler';

export function initSuperTokens() {
  // Initialize SuperTokens
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
        }
      }),
      Session.init({
        // Optional session configuration
        cookieSameSite: "lax",
        antiCsrf: "VIA_TOKEN",
        // Enable if using HTTPS
        // cookieSecure: process.env.NODE_ENV === "production"
      })
    ]
  });

  const app = express();

  // Middleware
  app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
  }));

  app.use(express.json());
  app.use(middleware());

  // Health check endpoint
  app.get("/health", (_, res) => {
    res.status(200).json({ status: "OK" });
  });

  // API routes
  app.get("/api/test", (req, res) => {
    res.json({ message: "Backend Live" });
  });

  // Protected admin route example
  app.get("/api/admin", verifySession(), async (req: any, res: any) => { // You might want to type req and res more specifically
    // Access session information from req.session
    if (req.session) {
      console.log("Session information:", req.session);
      // Add your admin verification logic based on session data (e.g., user roles)
      res.json({ message: "Admin access granted", sessionInfo: req.session });
    } else {
      res.status(403).json({ message: "Unauthorized - No session found" });
    }
  });

//   // Error handling middleware (should be last)
//   app.use(errorHandler);

  // Start server
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  return app;
}

// Initialize and export the app
export const app = initSuperTokens();