// ExpenseManagement.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Col } from 'react-bootstrap';
import AddTransactionModal from './AddTransactionalModal';
import { fetchTransactionsData, addTransaction } from '../api/transactionsData';

const ExpenseManagement = () => {
  const [income, setIncome] = useState([{
    amount: '',
    amount_usd: '',
    category: '',
    currency: '',
    date: '',
    title: '',
  }]);
  const [expenditure, setExpenditure] = useState([{
    amount: '',
    amount_usd: '',
    category: '',
    currency: '',
    date: '',
    title: '',
  }]);
  const [transactions, setTransactions] = useState({
    income_data: [...income],
    expense_data: [...expenditure],
  })
  const [transactionData, setTransactionData] = useState({
    _id: '',
    transactions: transactions,
    user_id: '',    
  });
  const [transactionType, setTransactionType] = useState('');
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  

  const handleShowModal = (type) => {
    setTransactionType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleAddTransaction = async (transaction) => {
    try {
      const response = await addTransaction(transaction)
      
      if (transactionType === 'income') {
        setIncome([...income, response.income]); // Add the new expense to the expenses list
        // setIncome({ title: '', amount: '', currency: 'USD', category: '', selected_date: '' }); // Reset form
      }
      else {
        setExpenditure([...expenditure, response.expense]); // Add the new expense to the group expenses list
        // setExpenditure({ title: '', amount: '', currency: 'USD', category: '', selected_date: '' }); // Reset form
      }
      setTransactionData([...transactionData, response]);
      handleCloseModal(); // Close the modal
    } catch (err) {
      console.error('Error adding expense:', err);
    }
  };

  useEffect(() => {
    // Function to fetch expenseManagement data
    const fetchExpenseManagementData = async (e) => {
        setError('');
        
        try {
            const response = await fetchTransactionsData()
            setTransactionData(response);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

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
                <th>Amount USD</th>
                <th>Currency</th>
                <th>Category</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactionData.transactions['income_data'].map((income) => (
                <tr key={transactionData._id}>
                  <td>{income.title}</td>
                  <td>{income.amount}</td>
                  <td>{income.amount_usd}</td>
                  <td>{income.currency}</td>
                  <td>{income.category}</td>
                  <td>{income.date}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="primary" onClick={() => handleShowModal('income') }>Add New Income</Button>
        </Col>

        {/* Expenditure Column */}
        <Col>
          <h3>Expenditure</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Amount USD</th>
                <th>Currency</th>
                <th>Category</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
            {transactionData.transactions['expense_data'].map((expense) => (
                <tr key={transactionData._id}>
                  <td>{expense.title}</td>
                  <td>{expense.amount}</td>
                  <td>{expense.amount_usd}</td>
                  <td>{expense.currency}</td>
                  <td>{expense.category}</td>
                  <td>{expense.date}</td>
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
        onClose={handleCloseModal}
        onSubmit={handleAddTransaction}
        type={transactionType}
      />
    </div>
  );
};

export default ExpenseManagement;
