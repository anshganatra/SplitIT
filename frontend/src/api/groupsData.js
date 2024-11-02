const BASE_URL = 'http://192.168.1.205:5000'
const token = localStorage.getItem('token');

export const fetchGroups = async() => {
    try {
        // Send registration data to the backend
        const response = await fetch(`${BASE_URL}/groups`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
  
        if (!response.ok) {
            throw new Error('Failed to fetch Groups data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching Groups data:', error);
        throw error;
    }
};

export const addGroupExpense = async(expense) => {
    try {
        // Send registration data to the backend
        const response = await fetch(`${BASE_URL}/expenses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
          body: JSON.stringify(expense),
        });
  
        if (!response.ok) {
            throw new Error('Failed to add group expense');
        }
        return await response.json();
    } catch (error) {
        console.error('Error adding group expense:', error);
        throw error;
    }
};