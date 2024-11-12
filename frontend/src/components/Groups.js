import React, { useState, useEffect } from 'react';
import { ListGroup, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import { fetchGroups, addGroupExpense } from '../api/groupsData';
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
  const [groupData, setGroupData] = useState([]);

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

  // Function to handle selecting a group
  const handleGroupClick = (group) => {
    setSelectedGroup(group);
  };
  
  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setExpenseData({ ...expenseData, [name]: value });
  };

  const handleAddExpense = async () => {
    try {
      await addGroupExpense(expenseData); // Submit the expense data
      // Refetch group data to reflect the newly added expense
      await fetchGroupsData();
      handleCloseModal(); // Close the modal
    } catch (err) {
      console.error('Error adding expense:', err);
      setError("Error adding expense.");
    }
  };

  // Fetches groups data
  const fetchGroupsData = async () => {
    try {
      setError('');
      setLoading(true);
      const groups = await fetchGroups();
      setGroupData(groups);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupsData();
  }, []);

  // Render loading, error, or the groups list
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
        {groupData.map((group) => (
          <ListGroup.Item 
            key={group._id} 
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
                {groupData.map((group) => (
                  <option key={group._id} value={group.title}>
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
