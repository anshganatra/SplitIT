import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Col } from 'react-bootstrap';
import AddTransactionModal from './AddTransactionalModal';
import { fetchTransactionsData, addTransaction } from '../api/transactionsData';
import { toast } from 'react-toastify';

const ExpenseManagement = () => {
  const [income, setIncome] = useState([]);
  const [expenditure, setExpenditure] = useState([]);
  const [transactionData, setTransactionData] = useState({
    income_data: [],
    expense_data: [],
  });
  const [transactionType, setTransactionType] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = (type) => {
    setTransactionType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleAddTransaction = async (transaction, transactionType) => {
    try {
      transaction.type = transactionType;
      await addTransaction(transaction);

      // Refetch transaction data to update the table
      await fetchExpenseManagementData();

      handleCloseModal(); // Close the modal
      toast.success("Transaction created successfully.");
    } catch (err) {
      console.error('Error adding transaction:', err);
      toast.warn("Error creating transaction.");
    }
  };

  // Fetches transactions data
  const fetchExpenseManagementData = async () => {
    try {
      setError('');
      setLoading(true);
      const response = await fetchTransactionsData();
      setTransactionData(response.transactions);
      setIncome(response.transactions.income_data || []);
      setExpenditure(response.transactions.expense_data || []);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenseManagementData();
  }, []);

  // Render loading, error, or the dashboard list
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
              {income.map((incomeItem, index) => (
                <tr key={index}>
                  <td>{incomeItem.title}</td>
                  <td>{incomeItem.amount}</td>
                  <td>{incomeItem.currency}</td>
                  <td>{incomeItem.category}</td>
                  <td>{incomeItem.date}</td>
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
              {expenditure.map((expenseItem, index) => (
                <tr key={index}>
                  <td>{expenseItem.title}</td>
                  <td>{expenseItem.amount}</td>
                  <td>{expenseItem.currency}</td>
                  <td>{expenseItem.category}</td>
                  <td>{expenseItem.date}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="primary" onClick={() => handleShowModal('expense')}>Add New Expense</Button>
        </Col>
      </Row>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        show={showModal}
        onClose={handleCloseModal}
        onSubmit={handleAddTransaction}
        transactionType={transactionType}
      />
    </div>
  );
};

export default ExpenseManagement;
