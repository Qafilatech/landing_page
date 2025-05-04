// src/server.ts
import express from 'express';
import cors from 'cors';
import { middleware } from 'supertokens-node/lib/build/framework/express/framework';
import { errorHandler } from './Middleware/errorHandler';
// import { initializeAuth } from './Authentication/authConfig';
import { backendConfig } from './Authentication/backendConfig';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';
import orderRouter from './routes/orders';
import userRouter from './routes/users';
import supertokens from 'supertokens-node';
import {pool} from './Authentication/authConfig'


// 1. ENVIRONMENT CHECKS ==============================================
console.log('[BOOT] Environment Variables:', {
    
    API_DOMAIN: process.env.API_DOMAIN ,
    WEBSITE_DOMAIN: process.env.WEBSITE_DOMAIN,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL ? '***REDACTED***' : 'MISSING',
    SUPERTOKENS_CONNECTION_URI: process.env.SUPERTOKENS_CONNECTION_URI || 'Using default'
  });



// 2. INITIALIZATION ==================================================
// initializeAuth();
supertokens.init(backendConfig());
console.log(`
     ====================================================
     ||  SuperTokens initialized successfully  🚀 🚀 🚀 ||
     ====================================================`);


// Create Express app
const app = express();

// 3. MIDDLEWARE PIPELINE (CRITICAL ORDER) ============================
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middleware()); // SuperTokens middleware

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Error handler should be after all routes and middleware
app.use(errorHandler);

// 4. ROUTES =========================================================
// 4.1. Health Check (With DB verification)
app.get("/health", async (_, res, next) => {
    try {
        console.log('Attempting database connection...');
        const result = await pool.query('SELECT 1');
        console.log('Database connection successful');
        res.status(200).json({
            status: "A OKAY",
            database: "Connected"
        });
    } catch (error: any) {
        console.error('Database connection error:', error);
        next(error);
    }
});


app.get("/", (_, res) => {  
  res.send("Welcome to QT API");
});



app.get("/api/admin", verifySession(), async (req: any, res: any) => {
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

// Mount routers
app.use('/api', orderRouter);
app.use('/api', userRouter);

// 5. SERVER START ===================================================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(
        `
  ====================================================
  🚀 Server running on http://localhost:${PORT}
  ====================================================
  Health Check:    http://localhost:${PORT}/health
  SuperTokens:     http://localhost:${PORT}/auth/config
  ====================================================
  `
    );
});

export { app };