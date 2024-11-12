import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { fetchDashboardData } from '../api/dashboardData';

const GroupDetails = ({ group, friends, currentUser }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [allExpenses, setAllExpenses] = useState([]);
  const [filteredGroupExpenses, setFilteredGroupExpenses] = useState([]);

  useEffect(() => {
    // Function to fetch dashboard data
    const getDashboardData = async () => {
      try {
        let allExpenseData = await fetchDashboardData();
        setAllExpenses(allExpenseData); // Update the state with fetched data
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    getDashboardData(); // Run only once on mount
  }, []);

  useEffect(() => {
    // Filter expenses by matching `group_id` in `allExpenses` with the group's `_id`
    if (group && group._id && allExpenses.length > 0) {
      const matchingExpenses = allExpenses.filter(
        (expense) => expense.group_id === group._id
      );
      setFilteredGroupExpenses(matchingExpenses);
    }
  }, [allExpenses, group]);

  // Helper function to resolve user ID to name
  const resolveUserName = (userId) => {
    if (userId === currentUser._id) {
      return `${currentUser.name} (You)`;
    }
    const friend = friends.find((friend) => friend.id === userId);
    return friend ? friend.name : 'Unknown User';
  };

  if (!group || !group._id) {
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
            <th>Selected Date</th>
            <th>Shares</th>
          </tr>
        </thead>
        <tbody>
          {filteredGroupExpenses.map((expense, index) => (
            <tr key={index}>
              <td>{expense.title}</td>
              <td>{expense.amount}</td>
              <td>{expense.category}</td>
              <td>{new Date(expense.created_at).toLocaleString()}</td>
              <td>{expense.currency}</td>
              <td>{resolveUserName(expense.paid_by)}</td>
              <td>{new Date(expense.selected_date).toLocaleDateString()}</td>
              <td>
                {Object.entries(expense.shares).map(([userId, shareAmount]) => (
                  <div key={userId}>
                    {resolveUserName(userId)}: {shareAmount}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default GroupDetails;
