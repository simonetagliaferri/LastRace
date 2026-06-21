import Leaderboard from "../components/Leaderboard.jsx";
import {useContext, useEffect, useState} from "react";
import UserContext from "../contexts/UserContext.js";
import getBestScores from "../api/leaderboard.js";
import Spinner from "react-bootstrap/esm/Spinner";
import Alert from "react-bootstrap/esm/Alert";

function LeaderboardPage() {
    const {user} = useContext(UserContext);
    const [scores, setScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user?.userId) {
            getBestScores()
                .then(scores => setScores(scores))
                .catch(err => {
                    setError(err);
                    setTimeout(() => setError(""), 3000);
                })
                .finally(() => setLoading(false));
        }
    }, [user?.userId]);

    return (
        user?.userId ? (
            loading ? (<Spinner animation="border"/>) : (
                <>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Leaderboard scores={scores}/>
                </>
            )
        ) : <h1 className="text-center">Nothing for you here.</h1>
    );
}

export default LeaderboardPage;