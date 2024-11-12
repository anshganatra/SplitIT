const BASE_URL = 'http://192.168.1.205:5000'
const token = localStorage.getItem('token');

export const fetchUserData = async() => {
    try {
        // Send registration data to the backend
        const response = await fetch(`${BASE_URL}/users/me`, {
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