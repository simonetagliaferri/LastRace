import {Router} from "express";
import passport from "passport";
import {isLoggedIn} from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/api/sessions", passport.authenticate("local"), (req, res) => {
    return res.status(201).json(req.user);
});

router.get("/api/sessions/current", isLoggedIn, (req, res) => {
    return res.json(req.user);
});

router.delete("/api/sessions/current", (req, res) => {
    req.logout(() => {
        return res.end();
    });
});

export default router;