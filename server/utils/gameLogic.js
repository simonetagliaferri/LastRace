function buildAdjacencyList(segments) {
    const graph = {};
    for (const segment of segments) {
        if (!graph[segment.station1Id]) graph[segment.station1Id] = [];
        if (!graph[segment.station2Id]) graph[segment.station2Id] = [];
        graph[segment.station1Id].push(segment.station2Id);
        graph[segment.station2Id].push(segment.station1Id);
    }
    return graph;
}

function bfsDistance(graph, startId) {
    const distances = { [startId]: 0 };
    const queue = [startId];
    while (queue.length) {
        const current = queue.shift();
        for (const neighbor of graph[current]) {
            if (distances[neighbor] === undefined) {
                distances[neighbor] = distances[current] + 1;
                queue.push(neighbor);
            }
        }
    }
    return distances;
}

function pickRandomStartAndEnd(segments, minSegments = 3) {
    const graph = buildAdjacencyList(segments);
    const stationIds = Object.keys(graph).sort(() => Math.random() - 0.5);
    for (const startStationId of stationIds) {
        const distances = bfsDistance(graph, startStationId);
        const validEndStations = Object.entries(distances)
            .filter(([id, distance]) => id !== startStationId && distance >= minSegments)
            .map(([id]) => id);
        if (validEndStations.length) {
            const endStationId = validEndStations[Math.floor(Math.random() * validEndStations.length)];
            return { startStationId: Number(startStationId), endStationId: Number(endStationId)};
        }
    }
    throw new Error("No valid station pairs found in the network.");
}

function getInitialCoins() {
    return 20;
}

function validateRoute(segments, expectedStartId, expectedEndId) {
    if (!segments.length) return false;
    let current = expectedStartId;
    for (const segment of segments) {
        if (segment.station1Id === current) {
            current = segment.station2Id;
        } else if (segment.station2Id === current) {
            current = segment.station1Id;
        } else {
            return false;
        }
    }
    return current === expectedEndId;
}

function eventSelector (events, segmentCount) {
    const selectedEvents = [];
    for (let i=0; i<segmentCount; i++) {
        const randomIndex = Math.floor(Math.random() * events.length);
        selectedEvents.push(events[randomIndex]);
    }
    return selectedEvents;
}

function getAllCoins(events) {
    const totalCoins = events.reduce((acc, current) => {
        return acc + current.effectValue;
    }, getInitialCoins());
    return totalCoins >= 0 ? totalCoins : 0;
}

function isNewBestScore(currentBestScore, newScore) {
    return !currentBestScore || newScore > currentBestScore;
}

export {pickRandomStartAndEnd, getInitialCoins, validateRoute, getAllCoins, eventSelector, isNewBestScore};