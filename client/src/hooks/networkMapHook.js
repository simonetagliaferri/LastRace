import { useEffect, useState } from "react";
import { getStations, getSegments } from "../api/networkMap.js";

let cache = null;
let inflightPromise = null;

async function loadNetworkOnce() {
    if (cache) return cache;
    if (!inflightPromise) {
        inflightPromise = Promise.all([getStations(), getSegments()])
            .then(([stations, segments]) => {
                cache = { stations, segments };
                return cache;
            })
            .finally(() => { inflightPromise = null; });
    }
    return inflightPromise;
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
    return { stations: data?.stations ?? [], segments: data?.segments ?? [], loading, error };
}