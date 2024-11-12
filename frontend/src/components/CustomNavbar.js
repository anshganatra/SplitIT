// src/components/CustomNavbar.js
import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function CustomNavbar({ isAuthenticated, onLogout }) {
  
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">SplitIT</Navbar.Brand>
        <Nav className="me-auto">
          { isAuthenticated && <Nav.Link as={Link} to="/expense-management">Expense Management</Nav.Link>}          
        </Nav>
        <Nav className="ml-auto">
          {isAuthenticated ? (
            // Authenticated Links
            <>
              <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
              <Nav.Link as={Link} to="/friends">Friends</Nav.Link>
              <Nav.Link as={Link} to="/groups">Groups</Nav.Link>
              <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
              <Button variant="outline-light" onClick={handleLogoutClick} className="ml-2">
                Logout
              </Button>
            </>
          ) : (
            // Non-authenticated Links
            <>
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
