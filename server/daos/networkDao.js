import Station from "../models/station.js";
import db from "./db.js";
import Segment from "../models/segment.js";

export const getStations = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT s.station_id, s.name, COUNT(DISTINCT ls.line_id) > 1 AS is_interchange
            FROM stations s LEFT JOIN line_segments ls ON s.station_id = ls.station1_id OR s.station_id = ls.station2_id
            GROUP BY s.station_id, s.name
            ORDER BY s.station_id`;
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const stations = rows.map((row) => {
                    return new Station(
                        row["station_id"],
                        row["name"],
                        Boolean(row["is_interchange"])
                    );
                });
                resolve(stations);
            }
        });
    });
};

export const getSegments = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT ls.line_id, l.name  AS line_name, ls.station1_id, s1.name AS station1_name, ls.station2_id,
                   s2.name AS station2_name, ls.position
            FROM line_segments ls JOIN lines l ON ls.line_id = l.line_id JOIN stations s1 ON ls.station1_id = s1.station_id
                 JOIN stations s2 ON ls.station2_id = s2.station_id
            ORDER BY ls.line_id, ls.position`;
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const segments = rows.map((row) => {
                    return new Segment(row["line_id"], row["line_name"], row["station1_id"], row["station1_name"],
                        row["station2_id"], row["station2_name"], row["position"]);
                });
                resolve(segments);
            }
        });
    });
};
