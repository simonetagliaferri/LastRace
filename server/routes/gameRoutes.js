import {Router} from "express";
import {isLoggedIn} from "../middlewares/authMiddleware.js";
import {pickRandomStartAndEnd, getInitialCoins, getAllCoins, isNewBestScore} from "../utils/gameLogic.js";
import getAllEvents from "../daos/eventDao.js";
import {getBestScore, updateBestScore} from "../daos/userDao.js";
import {eventSelector, validateRoute} from "../utils/gameLogic.js";
import {getSegments} from "../daos/networkDao.js";


const router = Router();

router.get("/api/game/start", isLoggedIn, async (req, res) => {
    try {
        const segments = await getSegments();
        const {startStationId, endStationId} = pickRandomStartAndEnd(segments);
        const initialCoins = getInitialCoins();
        req.session.startStationId = startStationId;
        req.session.endStationId = endStationId;
        return res.json({startStationId, endStationId, initialCoins});
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Failed to start the game."});
    }
});

router.post("/api/game/end", isLoggedIn, async (req, res) => {
    try {
        const {startStationId, endStationId} = req.session;
        delete req.session.startStationId;
        delete req.session.endStationId;
        if (!startStationId || !endStationId) {
            return res.status(400).json({error: "No active game session."});
        }
        const segmentsArray = req.body.segments;
        let segments;
        try {
            segments = segmentsArray.map(segment => ({station1Id: segment.station1Id, station2Id: segment.station2Id}));
        } catch(err) {
            return res.status(400).json({error: "Failed to process the selected segments."});
        }
        const isValid = validateRoute(segments, startStationId, endStationId);
        if (!isValid) {
            return res.json({
                valid: false,
                events: [],
                score: 0,
                isNewBestScore: false
            });
        }
        const allEvents = await getAllEvents();
        const selectedEvents = eventSelector(allEvents, segments.length);
        const totalCoins = getAllCoins(selectedEvents);
        const currentBestScore = await getBestScore(req.user.userId);
        const isNewBest = isNewBestScore(currentBestScore, totalCoins);
        if (isNewBest) {
            await updateBestScore(req.user.userId, totalCoins);
        }
        return res.json({
            valid: true,
            events: selectedEvents,
            score: totalCoins,
            isNewBestScore: isNewBest
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Failed to process the game."});
    }
});

export default router;