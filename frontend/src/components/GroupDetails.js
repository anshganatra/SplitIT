// GroupDetails.js
import React from 'react';
import { Table } from 'react-bootstrap';

const GroupDetails = ({ group }) => {
  if (!group || !group.expenses) {
    return <div>Select a group to view details.</div>;
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
            <th>Currency</th>
            <th>Paid By</th>
            <th>Category</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {group.expenses.map((expense, index) => (
            <tr key={index}>
              <td>{expense.title}</td>
              <td>{expense.amount}</td>
              <td>{expense.currency}</td>
              <td>{expense.paid_by}</td>
              <td>{expense.category}</td>
              <td>{expense.selected_date}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default GroupDetails;
