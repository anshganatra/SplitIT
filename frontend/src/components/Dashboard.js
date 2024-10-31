import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';


// Dashboard Component
const Dashboard = ({ user, expenses, onAddExpense }) => {
  const [showModal, setShowModal] = useState(false);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  useEffect(() => {
    // Filter expenses where the user is involved (either paid by or in shares)
    const userExpenses = expenses.filter(expense =>
      expense.paid_by === user.email_address || expense.shares.hasOwnProperty(user.email_address)
    );
    setFilteredExpenses(userExpenses);
  }, [user, expenses]);

  const handleAddExpense = (newExpense) => {
    onAddExpense(newExpense);
    setShowModal(false); // Close the modal after adding expense
  };

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
          {filteredExpenses.map((expense, idx) => (
            <tr key={idx}>
              <td>{expense.title}</td>
              <td>{expense.amount}</td>
              <td>{expense.currency}</td>
              <td>{expense.paid_by}</td>
              <td>{expense.category}</td>
              <td>{new Date(expense.selected_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Expense Button */}
      <Button variant="primary" onClick={() => setShowModal(true)} className="mt-4">
        Add New Expense
      </Button>

      {/* Add Expense Modal */}
      <AddExpenseModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleAddExpense}
      />
    </div>
  );
};

// AddExpenseModal Component
const AddExpenseModal = ({ show, onHide, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    currency: '',
    amount: '',
    paid_by: '',
    category: '',
    selected_date: '',
    shares: {},
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddShare = (userId, share) => {
    setFormData({
      ...formData,
      shares: { ...formData.shares, [userId]: share }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Expense</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" name="title" onChange={handleChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Currency</Form.Label>
            <Form.Control type="text" name="currency" onChange={handleChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Amount</Form.Label>
            <Form.Control type="number" name="amount" onChange={handleChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Paid By</Form.Label>
            <Form.Control type="text" name="paid_by" onChange={handleChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Control type="text" name="category" onChange={handleChange} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" name="selected_date" onChange={handleChange} />
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
                  onChange={(e) => handleAddShare(formData.shares.userId, e.target.value)}
                />
              </Col>
            </Row>
          </Form.Group>
          <Button type="submit" variant="primary" className="mt-3">
            Add Expense
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Dashboard;
