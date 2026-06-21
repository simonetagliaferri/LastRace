import { useEffect, useState } from "react";
import {Outlet, Route, Routes} from "react-router";
import { Container } from "react-bootstrap"
import UserContext from "./contexts/UserContext";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Header from "./components/Header.jsx";
import {checkSession} from "./api/auth.js";
import GamePage from "./pages/GamePage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        checkSession().then(result => {
            setUser(result);
        }).catch(() => setUser(null));
    }, []);

    return (
        <UserContext.Provider value={{user, setUser}}>
            <Routes>
                <Route path="/" element={<MainLayout />} >
                    <Route index element={<HomePage/>} />
                    <Route path="login" element={<LoginPage/>} />
                    <Route path="game" element={<GamePage/>} />
                    <Route path="leaderboard" element={<LeaderboardPage/>} />
                </Route>
            </Routes>
        </UserContext.Provider>
    )
}

function MainLayout() {
    return <>
    <Header />
        <Container className="main-content">
            <Outlet />
        </Container>
    </>
}
export default App
