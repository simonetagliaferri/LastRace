import {useEffect, useState} from "react";
import {getSegments, getStations} from "../api/networkMap.js";

let cache = null;

async function loadNetworkOnce() {
    if (cache) return cache;
    return Promise.all([getStations(), getSegments()])
        .then(([stations, segments]) => {
            cache = {stations, segments};
            return cache;
        });
}

export function useNetworkData(enabled) {
    const [data, setData] = useState(cache);
    const [loading, setLoading] = useState(!cache);
    const [error, setError] = useState("");
    useEffect(() => {
        if (!enabled || cache) return;
        loadNetworkOnce()
            .then(result => setData(result))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [enabled]);
    return {stations: data?.stations ?? [], segments: data?.segments ?? [], loading, error};
}