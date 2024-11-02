import React, { useState } from 'react';
import { ListGroup, Button, Form, InputGroup } from 'react-bootstrap';

const Friends = ({ userBalance, onAddFriend }) => {
  const [friends, setFriends] = useState(userBalance.friends);
  const [newFriendEmail, setNewFriendEmail] = useState('');

  const handleAddFriend = () => {
    if (newFriendEmail) {
      const newFriend = { email_address: newFriendEmail };
      setFriends([...friends, newFriend]);
      onAddFriend(newFriend); // Optional: Trigger parent action for adding friend
      setNewFriendEmail(''); // Clear input field
    }
  };

  return (
    <div className="friends-component">
      <h3>Friends</h3>
      
      {/* Friends List */}
      <ListGroup className="mt-3 mb-3">
        {friends.map((friend, index) => (
          <ListGroup.Item key={index}>
            {friend.name}
            {friend.email_address}
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Add Friend Form */}
      <InputGroup className="mb-3">
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
    </div>
  );
};

export default Friends;
