// src/components/Login.js
import React, { useState } from 'react';
import { Form, Button, Card, Container } from 'react-bootstrap';

function Login({ onLogin }) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log('Logging In:', credentials);
  //   onLogin({ email_address: credentials.email });
  // };

  // Function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send login credentials to the backend
      const response = await fetch('http://192.168.1.205:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credentials }),
      });

      // Parse the response
      const data = await response.json();

      // Check if the login was successful
      if (response.ok) {
        // Store the token in localStorage
        localStorage.setItem('token', data.token);

        // Call the onLogin function to update app state
        onLogin();
      } else {
        setError(data.message); // Display error message
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Error logging in:', err);
    }
  };

  return (
    <Container style={{ maxWidth: '400px' }}>
      <Card className="p-4">
        <h2 className="text-center mb-4">Login</h2>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default Login;
