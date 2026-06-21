import {Router} from "express";
import {getSegments, getStations} from "../daos/networkDao.js";
import {isLoggedIn} from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/api/networkMap/stations", isLoggedIn, async (req, res) => {
    try {
        const stations = await getStations();
        return res.json(stations);
    } catch (error)  {
        console.log(error)
        return res.status(500).json({error: "Failed to retrieve stations."});
    }
});

router.get("/api/networkMap/segments", isLoggedIn, async (req, res) => {
    try {
        const segments = await getSegments();
        return res.json(segments);
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Failed to retrieve segments."});
    }
});

export default router;
