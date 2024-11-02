const BASE_URL = 'http://192.168.1.205:5000'

export const registerUser = async(formData) => {
    try {
        // Send registration data to the backend
        const response = await fetch(`${BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) {
            throw new Error('Failed to register user');
        }
        return await response.json();
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};