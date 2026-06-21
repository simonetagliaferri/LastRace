import sqlite from "sqlite3";

const db = new sqlite.Database("../last_race.sqlite", (err) => {
    if (err)
        console.log("Error");
    else
        console.log("Connected to the database");
});

export default db;