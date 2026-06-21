import NetworkMap from "../components/NetworkMap.jsx";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import {Button} from "react-bootstrap";
import {useNavigate} from "react-router";
import {useNetworkData} from "../hooks/networkMapHook.js";
import {useContext} from "react";
import UserContext from "../contexts/UserContext.js";

function HomePage() {
    const {user} = useContext(UserContext);
    const {stations, segments, loading, error} = useNetworkData(!!user?.userId);
    const navigate = useNavigate();

    return (
        user?.userId ? (
            loading ? (<Spinner animation="border"/>) : (
                <>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <div className="container">
                        <NetworkMap stations={stations}
                                    segments={segments}
                                    showLines={true}
                                    startStationId={undefined}
                                    endStationId={undefined}
                        />
                        <Button className="custom-button" onClick={() => navigate("/game")}>Start Game</Button>
                        <Rules/>
                    </div>
                </>
            )) : (
            <Rules/>
        )
    );
}

function Rules() {
    return (
        <div>
            <h2>How to Play "Last Race"</h2>
            <p> You're a passenger racing across the city's underground network. Your goal: reach your assigned
                destination while keeping as many coins as possible.
                Each game starts with 20 coins and unfolds in four phases:</p>
            <ol>
                <li><strong>Setup.</strong><br/>
                    Above you can see the full network map: all stations, their connections, and the metro lines. Take a
                    moment to study it before starting.
                </li>
                <li><strong>Planning</strong><br/>
                    The server randomly assigns you a starting station and a destination station. You'll see the
                    stations on the map and a list of all the connected pairs of stations. You have 90 seconds to study
                    the list, reconstruct the network in your head, and build a route by selecting segments in order,
                    from your starting station to your destination. Each segment can be used only once, and a valid
                    route can only change lines at interchange stations. If time runs out, whatever route you've built
                    so far, complete or not, is submitted automatically.
                </li>
                <li><strong>Execution</strong><br/>
                    If your route is valid, you'll travel it one segment at a time. At each step, a random event occurs
                    (good or bad) that adjusts your coin total, and you'll see the outcome before moving to the next
                    segment. If your route was invalid or incomplete, this phase is skipped and you lose all 20 coins.
                </li>
                <li><strong>Result</strong><br/>
                    You'll see your final score (coins remaining; negative scores are shown as zero).
                </li>
            </ol>
            <p><strong>Registered</strong> players can play as many games as they like, and their best score appears on
                the public leaderboard. <strong>Visitors</strong> browsing without logging in can read these
                instructions but can't see the map or play.</p>
        </div>
    )
}

export default HomePage