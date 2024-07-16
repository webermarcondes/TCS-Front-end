import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;

export const apiLogin = async (data) => {
    try {
        const response = await axios.post(`${apiUrl}usuario/login`, data);
        localStorage.setItem('isLoggedIn', 'true'); 
        return response;
    } catch (error) {
        throw error.response.data;
    }
};

export const logout = () => {
    localStorage.removeItem('isLoggedIn'); // Remover estado de autenticação
};

export default apiLogin;

