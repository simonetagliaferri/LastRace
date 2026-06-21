import {SERVER_URL} from "./config.js";
import Segment from "../models/segment.js";
import Station from "../models/station.js";

async function getStations() {
    let response;
    try {
        response = await fetch(`${SERVER_URL}/api/networkMap/stations`, {
            credentials: "include",
        });
    } catch {
        throw new Error("Network error while getting stations.");
    }
    if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error ?? "Failed to fetch stations.");
    }
    const list = await response.json();
    return list.map(item => new Station(item.stationId, item.name, item.isInterchange));
}

async function getSegments() {
    let response;
    try {
        response = await fetch(`${SERVER_URL}/api/networkMap/segments`, {
            credentials: "include",
        });
    } catch {
        throw new Error("Network error while getting segments.");
    }
    if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error ?? "Failed to fetch segments.");
    }
    const list = await response.json();
    return list.map(item => new Segment(item.lineId, item.lineName, item.station1Id, item.station1Name,
        item.station2Id, item.station2Name));
}

export {getStations, getSegments};
