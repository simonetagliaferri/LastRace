import crypto from "crypto";
import User from "../models/user.js";
import db from "./db.js";

export const getUserById = (userId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT user_id, username, best_score FROM users where user_id = ?";
        db.get(sql, [userId], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve(false);
            } else {
                const user = new User(row["user_id"], row["username"], row["best_score"]);
                resolve(user);
            }
        });
    });
};

export const getUsersForScores = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT user_id, username, best_score FROM users ORDER by best_score DESC";
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows.map(row => new User(row["user_id"], row["username"], row["best_score"])));
            }
        });
    });
};

export const getBestScore = async (userId) => {
    const user = await getUserById(userId);
    return user ? user.bestScore : false;
};

export const updateBestScore = (userId, newBestScore) => {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE users SET best_score = ? WHERE user_id = ?";
        db.run(sql, [newBestScore, userId], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
};

export const login = (username, password) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT user_id, username, password, salt, best_score FROM users WHERE username = ?";
        db.get(sql, [username], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve(false);
            } else {
                const user = new User(row["user_id"], row["username"], row["best_score"]);
                crypto.scrypt(password, row["salt"], 32, (err, hash) => {
                    if (err) {
                        reject(err);
                    }
                    if (!crypto.timingSafeEqual(Buffer.from(row["password"], "hex"), hash)) {
                        resolve(false);
                    } else {
                        resolve(user)
                    }
                });
            }
        });
    });
};
