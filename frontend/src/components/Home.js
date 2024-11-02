// src/components/Home.js
import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="content-wrapper">
      <div className="card card-custom text-center">
        <h1>Welcome to SplitIT</h1>
        <p className="lead">Join us and explore exciting features by creating an account or logging in.</p>
        <div>
          <Button variant="primary" as={Link} to="/register" className="mx-2">Register</Button>
          <Button variant="outline-primary" as={Link} to="/login" className="mx-2">Login</Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
