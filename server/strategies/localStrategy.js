import LocalStrategy from "passport-local";
import {getUserById, login} from "../daos/userDao.js";
import passport from "passport";

export const localStrategy = new LocalStrategy(
    async function verify(username, password, cb) {
        const user = await login(username, password);
        if(!user)
            return cb(null, false, "Incorrect username or password.");
        return cb(null, user);
    }
);

passport.serializeUser(function (user, cb) {
    cb(null, user.userId);
});

passport.deserializeUser(async function (userId, cb) {
    try {
        const user = await getUserById(userId);
        return cb(null, user);
    } catch (err) {
        return cb(err);
    }
});
