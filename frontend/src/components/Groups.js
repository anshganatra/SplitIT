import React, { useState, useEffect } from 'react';
import { ListGroup, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import GroupDetails from './GroupDetails';

const Groups = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [expenseData, setExpenseData] = useState({
    title: '',
    amount: '',
    currency: 'USD',
    paid_by: '',
    category: '',
    selected_date: '',
    shares: {}
  });
  const [groupData, setGroupData] = useState({
    title: '',
    users: {},
    expenses: expenseData
  });

  const handleOpenModal = (groupTitle) => {
    setSelectedGroup(groupTitle);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setExpenseData({
      title: '',
      amount: '',
      currency: 'USD',
      paid_by: '',
      category: '',
      selected_date: '',
      shares: {}
    });
    setSelectedGroup(''); // Clear selected group on modal close
  };

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setExpenseData({ ...expenseData, [name]: value });
  };

  const handleAddExpense = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://192.168.1.205:5000/add-expense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(expenseData),
      });

      if (response.ok) {
        const result = await response.json();
        setExpenseData([...expenseData, result.expense]); // Add the new expense to the expenses list
        setGroupData([...groupData, result.expense]); // Add the new expense to the group expenses list
        handleCloseModal(); // Close the modal
        setExpenseData({ title: '', amount: '', currency: 'USD', paid_by: '', category: '', shares: {}, selected_date: '' }); // Reset form
      }
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  // Function to handle selecting a group
  const handleGroupClick = (group) => {
    setSelectedGroup(group);
  };

  useEffect(() => {
    // Function to fetch groups data
    const fetchGroups = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token'); // Retrieve the JWT token from localStorage
            const response = await fetch('http://192.168.1.205:5000/groups', {
            headers: {
                'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                'Content-Type': 'application/json',
            },
            });

            if (!response.ok) {
            throw new Error('Failed to fetch groups data');
            }

            const data = await response.json();
            setExpenseData(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    fetchGroups();
  }, []);

    // Render loading, error, or the dashboard list
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="groups-component">
      <h3>Groups</h3>
      
      {/* List of Groups */}
      <ListGroup className="mt-3 mb-3">
        {expenseData.map((group, index) => (
          <ListGroup.Item 
          key={index} 
          action 
          onClick={() => handleGroupClick(group)} 
          className="d-flex justify-content-between align-items-center" 
          >
            {group.title}
            <Button variant="primary" onClick={() => handleOpenModal(group.title)}>
              Add Transaction
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
      {/* Group Details */}
      {selectedGroup && <GroupDetails group={selectedGroup} />}

      {/* Add Transaction Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Group Selection */}
            <Form.Group controlId="groupSelection">
              <Form.Label>Select Group</Form.Label>
              <Form.Control as="select" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                <option value="">Select a group</option>
                {groupData.map((group, index) => (
                  <option key={index} value={group.title}>
                    {group.title}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Transaction Details */}
            <Form.Group controlId="transactionTitle" className="mt-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Enter transaction title"
                value={expenseData.title}
                onChange={handleExpenseChange}
              />
            </Form.Group>
              <Form.Group controlId="transactionAmount" className="mt-3">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={expenseData.amount}
                  onChange={handleExpenseChange}
                />
              </Form.Group>
              <Form.Group controlId="transactionCurrency" className="mt-3">
                <Form.Label>Currency</Form.Label>
                <Form.Control
                  type="text"
                  name="currency"
                  placeholder="Currency (e.g., USD)"
                  value={expenseData.currency}
                  onChange={handleExpenseChange}
                />
              </Form.Group>
            <Form.Group controlId="transactionPaidBy" className="mt-3">
              <Form.Label>Paid By</Form.Label>
              <Form.Control
                type="text"
                name="paid_by"
                placeholder="Enter payer"
                value={expenseData.paid_by}
                onChange={handleExpenseChange}
              />
            </Form.Group>
            <Form.Group controlId="transactionCategory" className="mt-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                placeholder="Enter category"
                value={expenseData.category}
                onChange={handleExpenseChange}
              />
            </Form.Group>
            <Form.Group controlId="transactionDate" className="mt-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="selected_date"
                value={expenseData.selected_date}
                onChange={handleExpenseChange}
              />
            </Form.Group>

            {/* Optional: Add Shares */}
            <Form.Group controlId="transactionShares" className="mt-3">
              <Form.Label>Shares (if applicable)</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="User ID"
                  onChange={(e) =>
                    setExpenseData({
                      ...expenseData,
                      shares: { ...expenseData.shares, [e.target.value]: '' }
                    })
                  }
                />
                <Form.Control
                  type="number"
                  placeholder="Share Amount"
                  onChange={(e) =>
                    setExpenseData({
                      ...expenseData,
                      shares: {
                        ...expenseData.shares,
                        [Object.keys(expenseData.shares)[0]]: e.target.value
                      }
                    })
                  }
                />
              </InputGroup>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddExpense}>
            Add Transaction
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Groups;
