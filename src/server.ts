import express from 'express';
import cors from 'cors';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';
import { middleware } from 'supertokens-node/lib/build/framework/express/framework';
import { errorHandler} from './Middleware/errorHandler';
import { Pool } from 'pg';
import * as dotenv from "dotenv"

dotenv.config();
console.log('testing',process.env.DATABASE_PASSWORD)

const pool = new Pool({
    // user: process.env.DATABASE_USER,
    // host: process.env.DATABASE_HOST,
    // database: process.env.DATABASE_NAME,
    // password: process.env.DATABASE_PASSWORD,
    // port: parseInt(process.env.DATABASE_PORT)
    connectionString: process.env.DATABASE_URL
});

pool.connect()
    .then(() => console.log('Connected to DB'))
    .catch(err => console.log('Error Connecting to DB', err));



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
        },
        override: {
          apis: (originalImplementation) => {
            return {
              ...originalImplementation,
              signUpPOST: async (input) => {
                const response = await originalImplementation.signUpPOST(input);
                if (response.status === "OK") {
                  try {
                    // Store user in PG
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
  app.use(errorHandler);

  // Health check endpoint
  app.get("/health", async (_, res, next) => {
    try{
        // Test both SuperTokens and PostgreSQL connections
       await pool.query('SELECT 1');
       res.status(200).json({
        status: "A OKAY",
        database: "Connected"
       });
    }catch (error: any) {
        next(error);}
  });

  app.get("/", (_, res) =>{
    res.send("Welcome to QT, ya Cutei");
  });

  // API routes
  app.get("/api/test", (req, res) => {
    res.json({ message: "Backend Live" });
  });

  // Protected admin route example
  app.get("/api/admin", verifySession(), async (req: any, res: any) => {
    // Access session information from req.session
    if (req.session) {
      try {
        const userData = await pool.query('SELECT * FROM public."Users" WHERE supertokens_id = $1');
        
        res.json({
            message: "Admin access granted",
            sessionInfo: req.session,
            userData: userData.rows[0]
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: "Internal server error" });
      }
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