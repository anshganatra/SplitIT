const BASE_URL = 'http://192.168.1.205:5000'

export const loginUser = async(credentials) => {
    try {
        // Send registration data to the backend
        const response = await fetch(`${BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });
  
        if (!response.ok) {
            throw new Error('Failed to login');
        }
        return await response.json();

        
    } catch (error) {
        console.error('Error Logging in:', error);
        throw error;
    }
};