import React, { useState } from 'react';
import { ListGroup, Button, Modal, Form, InputGroup, Col } from 'react-bootstrap';

const Groups = ({ groups, onAddTransaction }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [transactionData, setTransactionData] = useState({
    title: '',
    amount: '',
    currency: 'USD',
    paid_by: '',
    category: '',
    selected_date: '',
    shares: {}
  });

  const handleOpenModal = (groupTitle) => {
    setSelectedGroup(groupTitle);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTransactionData({
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

  const handleTransactionChange = (e) => {
    const { name, value } = e.target;
    setTransactionData({ ...transactionData, [name]: value });
  };

  const handleAddTransaction = () => {
    if (selectedGroup) {
      onAddTransaction(selectedGroup, transactionData);
      handleCloseModal();
    } 
    else {
        alert("Please select a group before adding a transaction.");
    }
  };

  return (
    <div className="groups-component">
      <h3>Groups</h3>
      
      {/* List of Groups */}
      <ListGroup className="mt-3 mb-3">
        {groups.map((group, index) => (
          <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
            {group.title}
            <Button variant="primary" onClick={() => handleOpenModal(group.title)}>
              Add Transaction
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>

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
                {groups.map((group, index) => (
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
                value={transactionData.title}
                onChange={handleTransactionChange}
              />
            </Form.Group>
            <Form.Row className="mt-3">
              <Form.Group as={Col} controlId="transactionAmount">
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={transactionData.amount}
                  onChange={handleTransactionChange}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="transactionCurrency">
                <Form.Label>Currency</Form.Label>
                <Form.Control
                  type="text"
                  name="currency"
                  placeholder="Currency (e.g., USD)"
                  value={transactionData.currency}
                  onChange={handleTransactionChange}
                />
              </Form.Group>
            </Form.Row>
            <Form.Group controlId="transactionPaidBy" className="mt-3">
              <Form.Label>Paid By</Form.Label>
              <Form.Control
                type="text"
                name="paid_by"
                placeholder="Enter payer"
                value={transactionData.paid_by}
                onChange={handleTransactionChange}
              />
            </Form.Group>
            <Form.Group controlId="transactionCategory" className="mt-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                placeholder="Enter category"
                value={transactionData.category}
                onChange={handleTransactionChange}
              />
            </Form.Group>
            <Form.Group controlId="transactionDate" className="mt-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="selected_date"
                value={transactionData.selected_date}
                onChange={handleTransactionChange}
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
                    setTransactionData({
                      ...transactionData,
                      shares: { ...transactionData.shares, [e.target.value]: '' }
                    })
                  }
                />
                <Form.Control
                  type="number"
                  placeholder="Share Amount"
                  onChange={(e) =>
                    setTransactionData({
                      ...transactionData,
                      shares: {
                        ...transactionData.shares,
                        [Object.keys(transactionData.shares)[0]]: e.target.value
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
          <Button variant="primary" onClick={handleAddTransaction}>
            Add Transaction
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Groups;
