import {Table} from "react-bootstrap";

function Leaderboard({scores}) {
    return (
            <Table className="custom-table custom-table--has-head">
                <thead>
                    <tr>
                        <th scope="col">Ranking</th>
                        <th scope="col">Username</th>
                        <th scope="col">Score</th>
                    </tr>
                </thead>
                <tbody>{scores.map((score, index) => <LeaderboardRow key={score.userId} score={score} rank={index+1}></LeaderboardRow>)}</tbody>
            </Table>
    );
}

function LeaderboardRow({ score, rank }) {
    return (
        <tr>
            <td>{rank}</td>
            <td>{score.username}</td>
            <td>{score.bestScore}</td>
        </tr>
    );
}

export default Leaderboard;