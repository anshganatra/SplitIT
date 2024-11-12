import React, { useState, useEffect } from 'react';
import { Table, Button, Form, InputGroup } from 'react-bootstrap';
import { fetchFriendsData, fetchFriendsBalanceData, addFriend } from '../api/friendsData';
import { toast } from 'react-toastify';

const Friends = () => {
  const [friendsData, setFriendsData] = useState([]);
  const [friendsBalanceData, setFriendsBalanceData] = useState({});
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Function to fetch friends data
  const getFriendsData = async () => {
    try {
      const fetchedFriendsData = await fetchFriendsData();
      const friendsArray = Object.entries(fetchedFriendsData.friends).map(([id, friend]) => ({
        id,
        name: friend.name,
        email: friend.email,
      }));

      console.log(friendsArray);

      setFriendsData(friendsArray);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Function to fetch friends balance data
  const getFriendsBalanceData = async () => {
    try {
      const fetchedFriendsBalanceData = await fetchFriendsBalanceData();

      // Convert balances object to a simpler object with friend IDs as keys and balance amounts as values
      const balanceDataMap = Object.entries(fetchedFriendsBalanceData.balances).reduce((acc, [friendId, balance]) => {
        acc[friendId] = balance.USD || 0; // Default to 0 if USD balance is not found
        return acc;
      }, {});
      setFriendsBalanceData(balanceDataMap);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getFriendsData();
    getFriendsBalanceData();
  }, []);

  const handleAddFriend = async () => {
    try {
      const newFriend = await addFriend(newFriendEmail);
      toast.success("Friend added!");
      
      // Clear input field
      setNewFriendEmail(''); 

      // Refetch friends data to trigger re-render with updated list
      await getFriendsData();
      await getFriendsBalanceData();
    } catch (err) {
      console.error('Error adding friend:', err);
      toast.warn("Failed to add user.");
    }
  };

  // Render loading, error, or the friends list
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="friends-component">
      <h3>Friends</h3>

      {/* Add Friend Form */}
      <InputGroup className="mb-4">
        <Form.Control
          type="email"
          placeholder="Enter friend's email"
          value={newFriendEmail}
          onChange={(e) => setNewFriendEmail(e.target.value)}
        />
        <Button variant="primary" onClick={handleAddFriend}>
          Add Friend
        </Button>
      </InputGroup>
      
      {/* Friends List in Table Format */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Balance (USD)</th>
          </tr>
        </thead>
        <tbody>
          {friendsData
            .filter((friend) => friend && friend.name && friend.email)
            .map((friend) => (
              <tr key={friend.id}>
                <td>{friend.name}</td>
                <td>{friend.email}</td>
                <td>{friendsBalanceData[friend.id] || 0}</td> {/* Display balance or 'N/A' if not found */}
              </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Friends;
