import Event from "../models/event.js";
import db from "./db.js";

export default function getAllEvents() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT event_id, name, description, effect_value FROM events";
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const events = rows.map((row) => {
                    return new Event(row["event_id"], row["name"], row["description"], row["effect_value"]);
                });
                resolve(events);
            }
        })
    })
}