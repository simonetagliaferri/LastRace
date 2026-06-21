import {useContext} from "react";
import UserContext from "../contexts/UserContext.js";
import {Link, NavLink, useNavigate} from "react-router";
import {Container, Dropdown, Navbar} from "react-bootstrap";
import {doLogout} from "../api/auth.js";

function Header() {
    const {user, setUser} = useContext(UserContext);
    const isLoggedIn = !!user?.userId;
    return (
        <Navbar className="custom-navbar">
            <Container fluid>
                <Navbar.Brand as={Link} to="/">Last Race</Navbar.Brand>
                <div className="header-nav">
                    <NavItem to="/" label="New Game" enabled={isLoggedIn}/>
                    <NavItem to="leaderboard" label="Leaderboard" enabled={isLoggedIn}/>
                </div>
                <div className="ms-auto">
                    {user?.username ? <UserMenu user={user} setUser={setUser}/> :
                        <NavItem to="/login" label="Login" enabled={true}/>}
                </div>
            </Container>
        </Navbar>)
}

function NavItem({to, label, enabled}) {
    if (!enabled) {
        return <span className="header-text">{label}</span>;
    }
    return (
        <NavLink to={to} end className={({isActive}) => `header-text${isActive ? " active" : ""}`}>
            {label}
        </NavLink>
    );
}

function UserMenu({user, setUser}) {
    const navigate = useNavigate();
    const handleLogout = async () => {
        await doLogout();
        setUser(null);
        navigate("/");
    };
    return <div className="d-flex align-items-center">
        <Dropdown align="end">
            <Dropdown.Toggle id="user-menu" className="user-menu-toggle">
                Hello, {user.username}!
            </Dropdown.Toggle>
            <Dropdown.Menu className="custom-dropdown-menu">
                <Dropdown.ItemText>
                    Best score: {user.bestScore ?? 0}
                </Dropdown.ItemText>
                <Dropdown.Item as="button" onClick={handleLogout}>
                    Logout
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    </div>
}

export default Header
