import React, { useState, useEffect } from 'react';
import { Card, Container } from 'react-bootstrap';

const BASE_URL = 'http://192.168.1.205:5000';

const fetchProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found. Please log in.');

    const response = await fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile data');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

function Profile() {
  const [profileData, setProfileData] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const data = await fetchProfile();
        setProfileData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    getProfileData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container style={{ maxWidth: '600px' }} className="mt-4">
      <Card>
        <Card.Header>
          <h2>Profile</h2>
        </Card.Header>
        <Card.Body>
          <p><strong>Name:</strong> {profileData.name || 'N/A'}</p>
          <p><strong>Email:</strong> {profileData.email || 'N/A'}</p>
          <p><strong>Joined At:</strong> {profileData.created_at || 'N/A'}</p>
          <p><strong>Link Code:</strong> {profileData.link_code || 'N/A'}</p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Profile;
