import React, { useState, useEffect } from 'react';
import { ListGroup, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import { fetchGroups, addGroupExpense, createGroup, fetchFriends, fetchCurrentUser } from '../api/groupsData';
import GroupDetails from './GroupDetails';

const Groups = () => {
  const [showModal, setShowModal] = useState(false);
  const [showCreateGroupModal, setshowCreateGroupModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [newGroup, setNewGroup] = useState({ title: '', members: [] }); // For new group
  const [friends, setFriends] = useState([]); 
  const [members, setMembers] = useState([]); 
  const [currentUser, setCurrentUser] = useState({}); 
  const [expenseData, setExpenseData] = useState({
    title: '',
    amount: '',
    currency: 'USD',
    paid_by: '',
    category: '',
    selected_date: '',
    shares: [],
    group_id: '',
  });
  const [groupData, setGroupData] = useState([]);

  const handleOpenModal = (groupTitle) => {
    const selectedGroupObj = groupData.find(group => group.title === groupTitle);
    setSelectedGroup(groupTitle);
    setExpenseData((prevData) => ({
      ...prevData,
      group_id: selectedGroupObj ? selectedGroupObj._id : '', // Set group_id
    }));
    setShowModal(true);
  };
  

  const handleCloseModal = () => {
    setShowModal(false);
    setExpenseData({
      title: '',
      amount: '',
      currency: 'USD',
      paid_by: '',
      category: '',
      selected_date: '',
      shares: {}
    });
    setSelectedGroup(''); // Clear selected group on modal close
  };

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setExpenseData({ ...expenseData, [name]: value });
  };

  const handleCreateGroup = async () => {
    try {
        const createdGroup = await createGroup(newGroup); // Use `newGroup` for API call
        setGroupData((prevGroups) => [...prevGroups, createdGroup]); // Append new group
        handleCloseCreateGroupModal(); // Close modal on success
        setNewGroup({ title: '', members: [] }); // Reset the form
    } catch (err) {
        console.error('Error creating group:', err);
    }
};


const handleAddExpense = async () => {
  // Calculate the total of all shares
  const totalShares = Object.values(expenseData.shares).reduce(
    (sum, share) => sum + (parseFloat(share) || 0),
    0
  );

  // Check if the total shares match the amount
  if (totalShares !== parseFloat(expenseData.amount)) {
    alert(`The total of shares (${totalShares}) does not match the entered amount (${expenseData.amount}).`);
    return; // Stop execution if validation fails
  }

  try {
    const expense = await addGroupExpense(expenseData);

    // Update the state with the new expense and reset form
    setExpenseData([...expenseData, expense]);
    setGroupData([...groupData, expense]);
    handleCloseModal();
    setExpenseData({ title: '', amount: '', currency: 'USD', paid_by: '', category: '', shares: {}, selected_date: '' });
  } catch (err) {
    console.error('Error adding expense:', err);
  }
};


  // Function to handle selecting a group
  const handleGroupClick = (group) => {
    setSelectedGroup(group);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [groups, friendsResponse, currentUser] = await Promise.all([
          fetchGroups(),
          fetchFriends(),
          fetchCurrentUser(), // Fetch current user data
        ]);
  
        setGroupData(groups);
  
        const friendsList = Object.entries(friendsResponse.friends).map(([id, friend]) => ({
          id,
          name: friend.name,
          email: friend.email,
        }));
        setFriends(friendsList);
  
        setCurrentUser(currentUser); // Save current user details
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
  
    fetchInitialData();
  }, []);
  

  const handleShowCreateGroupModal = () => setshowCreateGroupModal(true);
  const handleCloseCreateGroupModal = () => setshowCreateGroupModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGroup({ ...newGroup, [name]: value });
  };

  const handleMemberChange = (e) => {
    const selectedMembers = Array.from(e.target.selectedOptions, (option) => option.value);
    setNewGroup((prevGroup) => ({ ...prevGroup, members: selectedMembers })); // Update `newGroup.members`
};


  // Render loading, error, or the groups list
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <div className="groups-component">
      <h3>Groups</h3>
      {/* Create Group Button */}
      <Button
        variant="primary"
        onClick={handleShowCreateGroupModal}
        className="mt-4"
      >
        Create Group
      </Button>

      <Modal show={showCreateGroupModal} onHide={handleCloseCreateGroupModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Group Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={groupData.title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Members</Form.Label>
              <Form.Control as="select" multiple onChange={handleMemberChange}>
                {friends.map((friend) => (
                  <option key={friend.id} value={friend.id}>
                    {friend.name} ({friend.email})
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateGroupModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateGroup}>
            Create Group
          </Button>
        </Modal.Footer>
      </Modal>

      {/* List of Groups */}
      <ListGroup className="mt-3 mb-3">
        {console.log(groupData)}
        {groupData.map((group) => (
          <ListGroup.Item
            key={group._id}
            action
            onClick={() => handleGroupClick(group)}
            className="d-flex justify-content-between align-items-center"
          >
            {group.title}
            <Button
              variant="primary"
              onClick={() => handleOpenModal(group.title)}
            >
              Add Transaction
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
      {/* Group Details */}
      {selectedGroup && (
        <GroupDetails 
          group={selectedGroup} 
          friends={friends} 
          currentUser={currentUser} 
        />
      )}


      {/* Add Transaction Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Group Selection */}
            <Form.Group controlId="groupSelection">
              <Form.Label>Select Group</Form.Label>
              <Form.Control
                as="select"
                value={selectedGroup?._id || ""} // Use the selected group's ID
                onChange={(e) => {
                  const group = groupData.find((g) => g._id === e.target.value); // Find the group by ID
                  setSelectedGroup(group); // Update the selected group
                }}
              >
                <option value="">Select a group</option>
                {groupData.map((group) => (
                  <option key={group._id} value={group._id}>
                    {group.title}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Transaction Details */}
            <Form.Group controlId="transactionTitle" className="mt-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Enter transaction title"
                value={expenseData.title}
                onChange={handleExpenseChange}
              />
            </Form.Group>
            <Form.Group controlId="transactionAmount" className="mt-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                placeholder="Amount"
                value={expenseData.amount}
                onChange={handleExpenseChange}
              />
            </Form.Group>
            <Form.Group controlId="transactionCurrency" className="mt-3">
              <Form.Label>Currency</Form.Label>
              <Form.Control
                as="select"
                name="currency"
                value={expenseData.currency}
                onChange={(e) => setExpenseData({ ...expenseData, currency: e.target.value })}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="INR">INR - Indian Rupee</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="AUD">AUD - Australian Dollar</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="CHF">CHF - Swiss Franc</option>
                <option value="CNY">CNY - Chinese Yuan</option>
                <option value="NZD">NZD - New Zealand Dollar</option>
                <option value="SEK">SEK - Swedish Krona</option>
                <option value="SGD">SGD - Singapore Dollar</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="transactionPaidBy" className="mt-3">
              <Form.Label>Paid By</Form.Label>
              <Form.Control
                as="select"
                name="paid_by"
                value={expenseData.paid_by}
                onChange={(e) => setExpenseData({ ...expenseData, paid_by: e.target.value })}
              >
                <option value="">Select a member</option>
                {selectedGroup?.members
                  ?.map((memberId) => {
                    // Check if the member is in the friends list
                    const member = friends.find((friend) => friend.id === memberId);

                    // If the member is not in friends and is the current user, add the current user
                    if (!member && memberId === currentUser?._id) {
                      return { id: currentUser._id, name: currentUser.name, email: currentUser.email };
                    }

                    return member;
                  })
                  .filter(Boolean) // Remove any undefined values
                  .map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name === currentUser?.name ? "You" : member.name} ({member.email})
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="transactionCategory" className="mt-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                placeholder="Enter category"
                value={expenseData.category}
                onChange={handleExpenseChange}
              />
            </Form.Group>
            <Form.Group controlId="transactionDate" className="mt-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="selected_date"
                value={expenseData.selected_date}
                onChange={handleExpenseChange}
              />
            </Form.Group>
            <Form.Group controlId="transactionShares" className="mt-3">
              <Form.Label>Shares</Form.Label>
              {selectedGroup?.members
                ?.map((memberId) => {
                  // Check if the member is in the friends list
                  const member = friends.find((friend) => friend.id === memberId);

                  // If the member is not in friends and is the current user, add the current user
                  if (!member && memberId === currentUser?._id) {
                    return { id: currentUser._id, name: currentUser.name, email: currentUser.email };
                  }

                  return member;
                })
                .filter(Boolean) // Remove any undefined values
                .map((member) => (
                  <InputGroup className="mb-2" key={member.id}>
                    <InputGroup.Text>
                      {member.name === currentUser?.name ? "You" : member.name} ({member.email})
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      placeholder="Enter share amount"
                      value={expenseData.shares[member.id] || 0} // Default value is 0
                      onChange={(e) =>
                        setExpenseData({
                          ...expenseData,
                          shares: {
                            ...expenseData.shares,
                            [member.id]: parseFloat(e.target.value) || 0, // Update share amount
                          },
                        })
                      }
                    />
                  </InputGroup>
                ))}
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          {error && <div className="text-danger mb-2">{error}</div>}
          <Button variant="primary" onClick={handleAddExpense}>
            Add Transaction
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Groups;
