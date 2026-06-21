import {SERVER_URL} from "./config.js";
import User from "../models/user.js";

export default async function getBestScores() {
    let response;
    try {
        response = await fetch(`${SERVER_URL}/api/leaderboard`, {
            credentials: "include"
        });
    } catch {
        throw new Error("Network error while getting the leaderboard.");
    }
    if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error ?? "Failed to fetch the leaderboard.");
    }
    const list = await response.json();
    return list.map((user) => new User(user.userId, user.username, user.bestScore));
}
