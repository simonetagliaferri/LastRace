import express from "express";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import {localStrategy} from "./strategies/localStrategy.js";
import authRoutes from "./routes/authRoutes.js";
import networkMapRoutes from "./routes/networkMapRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";

export default function createApp() {
    const app = express();

    // middlewares
    app.use(express.json());
    app.use(morgan("dev"));
    const corsOptions = {
        origin: "http://localhost:5173",
        optionsSuccessStatus: 200,
        credentials: true
    }
    app.use(cors(corsOptions));
    passport.use(localStrategy);
    app.use(session({
        secret: "secret",
        resave: false,
        saveUninitialized: false,
    }));
    app.use(passport.authenticate("session"));

    // routes
    app.use(authRoutes);
    app.use(networkMapRoutes);
    app.use(gameRoutes);
    app.use(leaderboardRoutes);

    return app;
}
