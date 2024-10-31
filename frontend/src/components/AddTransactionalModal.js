// AddTransactionModal.js
import React, { useState } from 'react';
import { Modal, Button, Form, Col } from 'react-bootstrap';

const AddTransactionModal = ({ show, onHide, onSubmit, type }) => {
  const [transaction, setTransaction] = useState({
    title: '',
    amount: '',
    currency: 'USD',
    category: '',
    selected_date: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction({ ...transaction, [name]: value });
  };

  const handleAddTransaction = () => {
    onSubmit(transaction);
    onHide();
    setTransaction({
      title: '',
      amount: '',
      currency: 'USD',
      category: '',
      selected_date: ''
    });
  };

  return (
    <Modal show={show} onHide={onHide}>
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
              <Form.Label>Currency</Form.Label>
              <Form.Control type="text" name="currency" value={transaction.currency} onChange={handleChange} required />
            </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Category</Form.Label>
            <Form.Control type="text" name="category" value={transaction.category} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mt-3">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" name="selected_date" value={transaction.selected_date} onChange={handleChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleAddTransaction}>Add {type === 'income' ? 'Income' : 'Expenditure'}</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddTransactionModal;
