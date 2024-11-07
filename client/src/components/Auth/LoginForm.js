import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Card,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { logIntoDatabase } from "../../store/auth-actions";
import { useDispatch } from "react-redux";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidated(true);

    // Check if form is valid
    if (email === "" || password === "") {
      setError("Both fields are required.");
      return;
    }
    setError("");

    const formData = {
      email: email,
      password: password,
    };

    try {
      await dispatch(logIntoDatabase(formData));

      setEmail("");
      setPassword("");
      setValidated(false);
    } catch (e) {
      setError(e);
    }
  };

 useEffect(()=>{
  if(isLoggedIn){
    navigate("/home")
  } 

 },[isLoggedIn,navigate])

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4" style={{ color: "brown" }}>
        Mailbox
      </h1>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card
            className="p-4 shadow-sm"
            style={{ width: "30rem", margin: "0 auto" }}
          >
            <Card.Body>
              <h3 className="text-center mb-4">Login</h3>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail">
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formPassword" className="mt-3">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a password.
                  </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-4 w-100">
                  Login
                </Button>
              </Form>

              <div className="text-center mt-3">
                <Link to="/forgot-password" className="text-muted mt-2">
                  Forgot Password?
                </Link>
              </div>

              <div className="text-center mt-3">
                <span>Don't have an account? </span>
                <Link to="/signup" className="text-primary">
                  Sign Up
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
