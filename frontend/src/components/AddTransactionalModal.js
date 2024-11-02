// AddTransactionModal.js
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddTransactionModal = ({ show, onClose, onSubmit, type }) => {
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
    onSubmit(transaction);
    onClose();
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{type === 'income' ? 'Add New Income' : 'Add New Expenditure'}</Modal.Title>
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
            <Form.Label>Amount USD</Form.Label>
            <Form.Control type="number" name="amount_usd" value={transaction.amount_usd} onChange={handleChange} required />
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
            <Form.Label>Type</Form.Label>
            <Form.Control type="text" name="type" value={transaction.type} onChange={handleChange}/>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={handleAddTransaction}>Add {type === 'income' ? 'Income' : 'Expenditure'}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddTransactionModal;
