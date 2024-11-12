// AddTransactionModal.js
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddTransactionModal = ({ show, onClose, onSubmit, transactionType }) => {
  const [transaction, setTransaction] = useState({
    amount: '',
    amount_usd: '',
    category: '',
    currency: '',
    date: '',
    title: '',
    type: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction({ ...transaction, [name]: value });
  };

  const handleAddTransaction = () => {
    onSubmit(transaction, transactionType);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{transactionType === 'income' ? 'Add New Income' : 'Add New Expense'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" name="title" value={transaction.title} onChange={handleChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Amount</Form.Label>
            <Form.Control type="number" name="amount" value={transaction.amount} onChange={handleChange} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Currency</Form.Label>
            <Form.Control type="text" name="currency" value={transaction.currency} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Category</Form.Label>
            <Form.Control type="text" name="category" value={transaction.category} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" name="date" value={transaction.date} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Transaction Type</Form.Label>
            <Form.Control type="text" name="type" value={transactionType} disabled/>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleAddTransaction} transactionType={transactionType}>Add {transactionType === 'income' ? 'Income' : 'Expense'}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddTransactionModal;
