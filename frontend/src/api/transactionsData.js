const BASE_URL = 'http://192.168.1.205:5000'
const token = localStorage.getItem('token');

export const fetchTransactionsData = async() => {
    try {
        // Send registration data to the backend
        const response = await fetch(`${BASE_URL}/transactions`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch Transactions data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching Transactions data:', error);
        throw error;
    }
};

export const addTransaction = async(transaction) => {
    try {
        // Send registration data to the backend
        const response = await fetch(`${BASE_URL}/expenses`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
          body: JSON.stringify(transaction),
        });
  
        if (!response.ok) {
            throw new Error('Failed to add transaction');
        }
        return await response.json();
    } catch (error) {
        console.error('Error addding transaction:', error);
        throw error;
    }
};