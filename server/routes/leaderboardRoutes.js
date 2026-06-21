import {getUsersForScores} from "../daos/userDao.js";
import {Router} from "express";
import {isLoggedIn} from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/api/leaderboard", isLoggedIn, async (req, res) => {
    try {
        const users = await getUsersForScores();
        return res.json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Failed to retrieve best scores."});
    }
})

export default router;