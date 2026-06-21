import {Button, Form} from "react-bootstrap";

export default function LoginForm({onSubmit, username, setUsername, password, setPassword, error}) {
    return (
        <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control className="custom-textfield" type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control className="custom-textfield" type="password" placeholder="Enter password" value={password} onChange={(ev) => setPassword(ev.target.value)} />
            </Form.Group>
            <Button className="custom-button" variant="primary" type="submit" disabled={username.length === 0 || password.length === 0}>
                Log in
            </Button> {error && <div className="text-danger">{error}</div>}
        </Form>
    )
}