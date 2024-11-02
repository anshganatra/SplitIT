const BASE_URL = 'http://192.168.1.205:5000'
const token = localStorage.getItem('token');

export const fetchDashboardData = async() => {
    try {
        // Send registration data to the backend
        const response = await fetch(`${BASE_URL}/expenses`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
  
        if (!response.ok) {
            throw new Error('Failed to fetch Dashboard data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching Dashboard data:', error);
        throw error;
    }
};

export const addExpense = async(expense) => {
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
            throw new Error('Failed to add expense');
        }
        return await response.json();
    } catch (error) {
        console.error('Error addding expense:', error);
        throw error;
    }
};