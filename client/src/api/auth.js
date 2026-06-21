import {SERVER_URL} from "./config.js"

async function doLogin(username, password) {
    let response;
    try {
        response = await fetch(`${SERVER_URL}/api/sessions`, {
            method: "POST",
            body: JSON.stringify({username, password}),
            headers: {"Content-Type": "application/json"},
            credentials: "include"
        });
    } catch {
        throw new Error("Network error while logging in.");
    }
    if (response.ok) {
        return await response.json();
    } else {
        throw new Error("Login failed, incorrect credentials.");
    }
}

async function doLogout() {
    let response;
    try {
        response = await fetch(`${SERVER_URL}/api/sessions/current`, {
            method: "DELETE",
            credentials: "include"
        });
    } catch {
        throw new Error("Network error while logging out.");
    }
    if (!response.ok) {
        throw new Error("Logout failed.");
    }
    return true;
}

async function checkSession() {
    const response = await fetch(`${SERVER_URL}/api/sessions/current`, {
        credentials: "include"
    })
    if (response.ok) {
        return await response.json()
    } else {
        return null
    }
}

export {doLogin, doLogout, checkSession};
