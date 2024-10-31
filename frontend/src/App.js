// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import CustomNavbar from './components/CustomNavbar';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Friends from './components/Friends';
import Groups from './components/Groups';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Store logged-in user details
  const [expenses, setExpenses] = useState([
    {
      title: 'Lunch',
      currency: 'USD',
      amount: 50.0,
      paid_by: 'user@example.com',
      category: 'Food',
      shares: { 'friend@example.com': 25 },
      selected_date: new Date().toISOString().slice(0, 10),
    },
  ]);
  const [userBalance, setUserBalance] = useState({
    friends: [
      { email_address: 'friend1@example.com' },
      { email_address: 'friend2@example.com' }
    ]
  });
  const [groups, setGroups] = useState([
    {
      title: 'Group 1',
      members: [],
      expenses: [
        { title: 'Dinner', amount: 50, currency: 'USD', paid_by: 'user1', category: 'Food', selected_date: '2024-10-01' },
        { title: 'Movie', amount: 20, currency: 'USD', paid_by: 'user2', category: 'Entertainment', selected_date: '2024-10-02' }
      ]
    },
    {
      title: 'Group 2',
      members: [],
      expenses: [
        { title: 'Coffee', amount: 10, currency: 'USD', paid_by: 'user3', category: 'Food', selected_date: '2024-10-03' }
      ]
    }
  ]);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };
  
  const handleRegister = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleAddExpense = (newExpense) => {
    setExpenses([...expenses, newExpense]);
  };
  
  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const handleAddFriend = (newFriend) => {
    setUserBalance((prevBalance) => ({
      ...prevBalance,
      friends: [...prevBalance.friends, newFriend]
    }));
    // Optionally, save new friend to server here
  };

  const handleAddTransaction = (groupTitle, transaction) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) =>
        group.title === groupTitle
          ? { ...group, expenses: [...group.expenses, transaction] }
          : group
      )
    );
  };

  return (
    <Router>
      {/* Custom Navbar */}
      <CustomNavbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      
      {/* Main Content */}
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Dashboard user={user} expenses={expenses} onAddExpense={handleAddExpense} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Register onRegister={handleRegister} />
              )
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/friends"
            element={
              isAuthenticated ? (
                <Friends userBalance={userBalance} onAddFriend={handleAddFriend} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/groups"
            element={
              isAuthenticated ? (
                <Groups groups={groups} onAddTransaction={handleAddTransaction} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
