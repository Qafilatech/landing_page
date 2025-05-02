// src/server.ts
import express from 'express';
import cors from 'cors';
import { middleware } from 'supertokens-node/lib/build/framework/express/framework';
import { errorHandler } from './Middleware/errorHandler';
import { initializeAuth } from './Authentication/auth';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';
import orderRouter from './routes/orders';
import userRouter from './routes/users';
import supertokens from 'supertokens-node';
import {pool} from './Authentication/auth'

// Initialize SuperTokens
initializeAuth();

// Create Express app
const app = express();



// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
}));

app.use(express.json());
app.use(middleware()); // SuperTokens middleware
app.use(errorHandler);
app.use(express.urlencoded({ extended: true }));

// Health check endpoint this to be deleted later
app.get("/health", async (_, res, next) => {
    try {
        await pool.query('SELECT 1');
        res.status(200).json({
            status: "A OKAY",
            database: "Connected"
        });
    } catch (error: any) {
        next(error);
    }
});

// Routes
app.get("/", (_, res) => {
    res.send("Welcome to QT, ya Cutei");
});

app.get("/api/test", (req, res) => {
    res.json({ message: "Backend Live" });
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

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export { app };