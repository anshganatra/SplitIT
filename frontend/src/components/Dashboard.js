import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { fetchDashboardData, addExpense } from '../api/dashboardData';
import { fetchFriendsData } from '../api/friendsData';
import { fetchUserData } from '../api/userData';

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friends, setFriends] = useState({});
  const [shares, setShares] = useState([]); // Stores each share with friend ID and amount
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    currency: 'USD',
    paid_by: '',
    category: '',
    selected_date: '',
    shares: {} // Default to an empty object
  });

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setShares([]); // Clear shares when modal is closed
    setNewExpense({
      title: '',
      amount: '',
      currency: 'USD',
      paid_by: '',
      category: '',
      selected_date: '',
      shares: {}
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  };

  const handleAddShare = () => {
    // Adds a new share with a dropdown to select friend and an input to specify amount
    setShares([...shares, { friendId: '', shareAmount: '' }]);
  };

  const handleShareChange = (index, field, value) => {
    // Updates the specific field (friendId or shareAmount) of a particular share entry
    const updatedShares = [...shares];
    updatedShares[index][field] = value;
    setShares(updatedShares);
  };

  // Fetches dashboard and friends data
  const getDashboardData = async () => {
    try {
      setLoading(true);
      const friendsData = await fetchFriendsData();
      const dashboardData = await fetchDashboardData();
      const userData = await fetchUserData();

      friendsData["friends"][userData._id] = { name: "Self" };
      setDashboardData(dashboardData);
      setFriends(friendsData);
      setNewExpense((prevExpense) => ({
        ...prevExpense,
        paid_by: userData._id, // Set logged-in user’s ID as `paid_by`
      }));
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const handleAddExpense = async () => {
    // Convert shares array to an object format suitable for API submission
    const formattedShares = shares.reduce((acc, share) => {
      if (share.friendId && share.shareAmount) {
        acc[share.friendId] = parseFloat(share.shareAmount);
      }
      return acc;
    }, {});

    try {
      const expenseWithShares = { ...newExpense, shares: formattedShares }; // Attach shares to expense
      await addExpense(expenseWithShares); // Submit with shares included

      // Refetch dashboard data to ensure the list is updated
      await getDashboardData();
      handleCloseModal(); // Close modal and reset form
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
              <td>{friends["friends"][expense.paid_by]?.name || 'Unknown'}</td>
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
              <Form.Control type="text" name="paid_by" value={newExpense.paid_by} onChange={handleChange} disabled/>
            </Form.Group>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" name="category" value={newExpense.category} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="selected_date" value={newExpense.selected_date} onChange={handleChange} />
            </Form.Group>
            
            {/* Add Share Button */}
            <Form.Group>
              <Form.Label>Shares</Form.Label>
              {shares.map((share, index) => (
                <Row key={index} className="mb-2">
                  <Col>
                    <Form.Select
                      value={share.friendId}
                      onChange={(e) => handleShareChange(index, 'friendId', e.target.value)}
                    >
                      <option value="">Select Friend</option>
                      {Object.entries(friends.friends).map(([id, friend]) => (
                        <option key={id} value={id}>
                          {friend.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      placeholder="Share Amount"
                      value={share.shareAmount}
                      onChange={(e) => handleShareChange(index, 'shareAmount', e.target.value)}
                    />
                  </Col>
                </Row>
              ))}
              <Button variant="secondary" onClick={handleAddShare}>
                Add Another Share
              </Button>
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
