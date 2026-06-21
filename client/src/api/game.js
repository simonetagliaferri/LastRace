import {SERVER_URL} from "./config.js";

async function startGame() {
    let response;
    try {
        response = await fetch(`${SERVER_URL}/api/game/start`, {
            credentials: "include"
        });
    } catch {
        throw new Error("Network error while starting the game");
    }
    if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error ?? "Failed to start the game.");
    }
    const {startStationId, endStationId, initialCoins} = await response.json();
    return {startStationId, endStationId, initialCoins};
}

async function endGame(segments) {
    let response;
    try {
        response = await fetch(`${SERVER_URL}/api/game/end`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({segments: segments.map(segment => ({station1Id: segment.station1Id, station2Id: segment.station2Id}))}),
            credentials: "include"
        });
    } catch {
        throw new Error("Network error while submitting the game.");
    }
    if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error ?? "Failed to submit the game.");
    }
    return await response.json();
}

export {startGame, endGame};