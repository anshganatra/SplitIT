// GroupDetails.js
import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { fetchDashboardData } from '../api/dashboardData';

const GroupDetails = ({ group }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [allExpenses, setAllExpenses] = useState([]);
  const [filteredGroupExpenses, setFilteredGroupExpenses] = useState([]);

  useEffect(() => {
    // Function to fetch dashboard data
    const getDashboardData = async () => {
      try {
        let allExpenseData = await fetchDashboardData();
        console.log("Fetched data:", allExpenseData); // Check the fetched data
        setAllExpenses(allExpenseData); // Update the state with fetched data
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    getDashboardData(); // Run only once on mount
  }, []); // Empty dependency array

  useEffect(() => {
    console.log("AllExpenses:", allExpenses); // Log to verify `allExpenses` updates

    // Filter expenses by matching `_id` with `group.expenses`
    if (group && group.expenses && allExpenses.length > 0) {
      const matchingExpenses = allExpenses.filter((expense) => 
        group.expenses.includes(expense._id)
      );
      console.log("Matching Expenses:", matchingExpenses); // Log the filtered expenses
      setFilteredGroupExpenses(matchingExpenses);
    }
  }, [allExpenses, group]); // Runs when `allExpenses` or `group` changes

  if (!group || !group.expenses) {
    return <div>This group has no transaction history.</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="group-details">
      <h3>{group.title} - Transactions</h3>

      {/* Transactions Table */}
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Title</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Created at</th>
            <th>Currency</th>
            <th>Paid By</th>
            <th>Selected date</th>
            <th>Shares</th>
          </tr>
        </thead>
        <tbody>
          {filteredGroupExpenses.map((expense, index) => (
            <tr key={index}>
              <td>{expense.title}</td>
              <td>{expense.amount}</td>
              <td>{expense.category}</td>
              <td>{expense.created_at}</td>
              <td>{expense.currency}</td>
              <td>{expense.paid_by}</td>
              <td>{expense.selected_date}</td>
              <td>{JSON.stringify(expense.shares)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default GroupDetails;
