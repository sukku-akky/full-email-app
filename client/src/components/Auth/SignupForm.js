import React, { useState } from "react";
import {signUptoDatabase, signUpToDataBase} from "../../store/auth-actions";
import { useDispatch } from "react-redux";
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

function SignupForm() {
  const dispatch=useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidated(true);

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Check if any field is empty
    if (email === "" || password === "" || confirmPassword === "") {
      setError("All fields are required.");
      return;
    }

    setError("");

    const formData={
      email:email,
      password:password,
      confirmPassword:confirmPassword
    }

    try {
      await dispatch(signUptoDatabase(formData)); // Dispatch action to sign up
  
      // Clear fields and reset state after successful signup
      setEmail(""); // Clear email field
      setPassword(""); // Clear password field
      setConfirmPassword(""); // Clear confirm password field
      setError(""); // Clear any error messages
      setValidated(false); // Reset validated state if necessary
  
      // Optionally, you can also display a success message here if needed
      alert("Signup successful!"); // Success feedback (optional)
    } catch (err) {
     
      setError(err);
    }

  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4" style={{color:"brown"}}>Mailbox</h1> 
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card
            className="p-4 shadow-sm"
            style={{ width: "30rem", margin: "0 auto" }}
          >
            <Card.Body>
              <h3 className="text-center mb-4">Sign Up</h3>
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

                <Form.Group controlId="formConfirmPassword" className="mt-3">
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please confirm your password.
                  </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-4 w-100">
                  Sign Up
                </Button>
              </Form>

              <div className="text-center mt-3">
                <span>Already have an account? </span>
                <Link to="/" className="text-primary">
                  Login
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default SignupForm;
