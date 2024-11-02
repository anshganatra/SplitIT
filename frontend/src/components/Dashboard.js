import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { fetchDashboardData, addExpense } from '../api/dashboardData';

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    currency: 'USD',
    paid_by: '',
    category: '',
    selected_date: '',
    shares: []
  });

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  };

  const handleAddShare = (userId, share) => {
    setNewExpense({ ...newExpense, shares: { ...newExpense.shares, [userId]: share } });
  };

  useEffect(() => {
    // Function to fetch dashboard data
    const getDashboardData = async () => {
      try {
        const dashboardData = await fetchDashboardData()
        setDashboardData(dashboardData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    getDashboardData();
  }, []);


  const handleAddExpense = async () => {
    try {
      const response = await addExpense(newExpense)
      setDashboardData([...dashboardData, response.expense]); // Add the new expense to the dashboard list
      handleCloseModal(); // Close the modal
      setNewExpense({ title: '', amount: '', currency: 'USD', paid_by: '', category: '', shares: [], selected_date: '' }); // Reset form
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  // Render loading, error, or the dashboard list
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      <h2>Expense Dashboard</h2>

      {/* Expenses Table */}
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Paid By</th>
            <th>Category</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {dashboardData.map((expense, idx) => (
            <tr key={idx}>
              <td>{expense.title}</td>
              <td>{expense.amount}</td>
              <td>{expense.currency}</td>
              <td>{expense.paid_by}</td>
              <td>{expense.category}</td>
              <td>{expense.selected_date}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Expense Button */}
      <Button variant="primary" onClick={handleShowModal} className="mt-4">
        Add New Expense
      </Button>

      {/* Add Expense Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" value={newExpense.title} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Amount</Form.Label>
              <Form.Control type="number" name="amount" value={newExpense.amount} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Currency</Form.Label>
              <Form.Control type="text" name="currency" value={newExpense.currency} onChange={handleChange} defaultValue="USD" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Paid By</Form.Label>
              <Form.Control type="text" name="paid_by" value={newExpense.paid_by} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" name="category" value={newExpense.category} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="selected_date" value={newExpense.date} onChange={handleChange} />
            </Form.Group>
            {/* Add user shares */}
            <Form.Group>
            <Form.Label>Shares</Form.Label>
            <Row>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="User ID"
                  onChange={(e) => handleAddShare(e.target.value, '')}
                />
              </Col>
              <Col>
                <Form.Control
                  type="number"
                  placeholder="Share Amount"
                  onChange={(e) => handleAddShare(newExpense.shares.userId, e.target.value)}
                />
              </Col>
            </Row>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddExpense}>
            Add Expense
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;
