// ExpenseManagement.js
import React, { useState } from 'react';
import { Table, Button, Row, Col } from 'react-bootstrap';
import AddTransactionModal from './AddTransactionalModal';

const ExpenseManagement = () => {
  const [income, setIncome] = useState([]);
  const [expenditure, setExpenditure] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState('');

  const handleShowModal = (type) => {
    setTransactionType(type);
    setShowModal(true);
  };

  const handleHideModal = () => setShowModal(false);

  const handleAddTransaction = (transaction) => {
    if (transactionType === 'income') {
      setIncome([...income, transaction]);
    } else {
      setExpenditure([...expenditure, transaction]);
    }
  };

  return (
    <div className="expense-management">
      <h2>Expense Management</h2>
      <Row>
        {/* Income Column */}
        <Col>
          <h3>Income</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Category</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {income.map((inc, index) => (
                <tr key={index}>
                  <td>{inc.title}</td>
                  <td>{inc.amount}</td>
                  <td>{inc.currency}</td>
                  <td>{inc.category}</td>
                  <td>{inc.selected_date}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="primary" onClick={() => handleShowModal('income')}>Add New Income</Button>
        </Col>

        {/* Expenditure Column */}
        <Col>
          <h3>Expenditure</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Category</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {expenditure.map((exp, index) => (
                <tr key={index}>
                  <td>{exp.title}</td>
                  <td>{exp.amount}</td>
                  <td>{exp.currency}</td>
                  <td>{exp.category}</td>
                  <td>{exp.selected_date}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="primary" onClick={() => handleShowModal('expenditure')}>Add New Expenditure</Button>
        </Col>
      </Row>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        show={showModal}
        onHide={handleHideModal}
        onSubmit={handleAddTransaction}
        type={transactionType}
      />
    </div>
  );
};

export default ExpenseManagement;
