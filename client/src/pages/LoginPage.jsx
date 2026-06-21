import {Navigate, useNavigate} from "react-router";
import {useContext, useState} from "react";
import {doLogin} from "../api/auth.js";
import UserContext from "../contexts/UserContext.js";
import LoginForm from "../components/LoginForm.jsx";

function LoginPage() {
    const {user, setUser} = useContext(UserContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const loggedInUser = await doLogin(username, password);
            setUser(loggedInUser);
            navigate("/")
        } catch (error) {
            setError(error.message);
            setTimeout(() => setError(""), 3000);
        }
    }

    return (
        user?.userId ? (<Navigate to="/"/>) :
            (<LoginForm onSubmit={onSubmit}
                        username={username}
                        setUsername={setUsername}
                        password={password}
                        setPassword={setPassword}
                        error={error} />)
    );
}

export default LoginPage;
