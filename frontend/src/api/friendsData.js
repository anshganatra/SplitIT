const BASE_URL = 'http://192.168.1.205:5000'
const token = localStorage.getItem('token');

export const fetchFriendsData = async() => {
    try {
        // Send registration data to the backend
        const response = await fetch(`${BASE_URL}/balances/friends`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch Friends data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching Friends data:', error);
        throw error;
    }
};

export const fetchFriendsBalanceData = async() => {
    try {
        // Send registration data to the backend
        const response = await fetch(`${BASE_URL}/balances`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch Balance data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching Balance data:', error);
        throw error;
    }
};

export const addFriend = async(friend) => {
    try {
        // Send registration data to the backend
        const response = await fetch(`${BASE_URL}/users/add_friend`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
          body: JSON.stringify({'email': friend}),
        });
  
        if (!response.ok) {
            throw new Error('Failed to add friend');
        }
        return await response.json();
    } catch (error) {
        console.error('Error adding friend:', error);
        throw error;
    }
};