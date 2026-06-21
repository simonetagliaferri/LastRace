import {useContext, useEffect, useState} from "react";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import NetworkMap from "../components/NetworkMap.jsx";
import SegmentList from "../components/SegmentList.jsx";
import {Button, Col, Row} from "react-bootstrap";
import {endGame, startGame} from "../api/game.js";
import {useNetworkData} from "../hooks/networkMapHook.js";
import Event from "../models/event.js"
import UserContext from "../contexts/UserContext.js";
import ResultCarousel from "../components/ResultCarousel.jsx";
import CountdownTimer from "../components/CountdownTimer.jsx";

function GamePage() {
    const {user, setUser} = useContext(UserContext);
    const { stations, segments, loading: networkLoading, error: networkError } = useNetworkData();
    const [startStationId, setStartStationId] = useState(undefined);
    const [endStationId, setEndStationId] = useState(undefined);
    const [gameLoading, setGameLoading] = useState(true);
    const [gameError, setGameError] = useState("");
    const [selectedSegments, setSelectedSegments] = useState([]);
    const [initialCoins, setInitialCoins] = useState(20);
    const [submitted, setSubmitted] = useState(false);
    const [routeWithEvents, setRouteWithEvents] = useState([]);
    const [score, setScore] = useState(0);
    const [isNewBestScore, setIsNewBestScore] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [routeValid, setRouteValid] = useState(false);

    useEffect(() => {
        startGame()
            .then(({startStationId, endStationId, initialCoins}) => {
                setStartStationId(startStationId);
                setEndStationId(endStationId);
                setInitialCoins(initialCoins);
            })
            .catch((err) => {
                setGameError(err)
            })
            .finally(() => setGameLoading(false));
    }, []);

    const handleSubmit = async () => {
        try {
            const response = await endGame(selectedSegments);
            const routeWithEvents = response.valid
                ? response.events.map((event, index) => ({
                    segment: selectedSegments[index],
                    event: new Event(event.eventId, event.name, event.description, event.effectValue),
                }))
                : [];
            setRouteWithEvents(routeWithEvents);
            setRouteValid(response.valid);
            setScore(response.score);
            setIsNewBestScore(response.isNewBestScore);
            if (response.isNewBestScore) {
                setUser(user => ({...user, bestScore: response.score}));
            }
            setActiveIndex(0);
            setSubmitted(true);
        } catch (err) {
            setGameError(err.message);
        }
    };

    const loading = networkLoading || gameLoading;
    const error = networkError || gameError;

    if (loading) {
        return <Spinner animation="border" />;
    }

    const segmentsRevealed = activeIndex < routeWithEvents.length ? activeIndex + 1 : routeWithEvents.length;
    const revealedScore = routeWithEvents.slice(0, segmentsRevealed).reduce((sum, { event }) => sum + (event.effectValue ?? 0), initialCoins);
    const displayedCoins = !submitted ? initialCoins : routeValid ? revealedScore : score;

    return (
        user?.userId ?  (
            <>
                <div className="d-grid align-items-center mb-3" style={{ gridTemplateColumns: "1fr auto 1fr" }}>
                    <h2 className="mb-0">Coins: {displayedCoins}</h2>
                    <h1 className="mb-0 text-nowrap">
                        {submitted && (!routeValid ? "You Lost" : "You Won!")}
                    </h1>
                    <div className="d-flex justify-content-end">
                        {!submitted && <CountdownTimer duration={90} onTimeUp={handleSubmit} />}
                    </div>
                </div>
                {error && <Alert variant="danger">{error}</Alert>}
                {!submitted ? (
                    <>
                        <Row>
                            <Col md={7} className="d-flex">
                                <NetworkMap
                                    stations={stations}
                                    segments={segments}
                                    showLines={false}
                                    startStationId={startStationId}
                                    endStationId={endStationId}
                                />
                            </Col>
                            <Col md={5} className="d-flex">
                                <SegmentList
                                    segments={segments}
                                    selectedSegments={selectedSegments}
                                    setSelectedSegments={setSelectedSegments}
                                />

                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button className="custom-button" onClick={handleSubmit}
                                        disabled={selectedSegments.length === 0}>
                                    Submit
                                </Button>
                            </Col>
                        </Row>
                    </>
                ) : (
                    <div className="carousel-wrapper">
                        <ResultCarousel stations={stations}
                                        segments={segments}
                                        startStationId={startStationId}
                                        endStationId={endStationId}
                                        routeWithEvents={routeWithEvents}
                                        score={score}
                                        isNewBestScore={isNewBestScore}
                                        activeIndex={activeIndex}
                                        setActiveIndex={setActiveIndex}
                        />
                    </div>
                )}
            </>
        ) : (
    <h1 className="text-center">Nothing for you here.</h1>
    )
    );
}

export default GamePage;