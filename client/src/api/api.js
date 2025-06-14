import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;
console.log(apiUrl);

const api = {
    register: async (name, username, password) => {
        const response = await axios.post(`${apiUrl}/users/register`, { name, username, password });
        return response.data;
    },
    login: async (username, password) => {
        const response = await axios.post(`${apiUrl}/users/login`, { username, password });
        return response.data;
    },
    update: async (username, name, token) => {
        const response = await axios.post(`${apiUrl}/users/${username}`, { name }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    },
    fetchProfile: async(token) => {
        const response = await axios.get(`${apiUrl}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.user;
    },
    logout: async() => {
        localStorage.clear();
    },
    findGame: async(id) => {
        const response = await axios.post(`${apiUrl}/game`, {id});
        return response.data;
    },
    fetchGame: async(gameId) => {
        const response = await axios.get(`${apiUrl}/game/${gameId}`, {gameId});
        return response.data;
    },
    playMove: async(gameId, board, currentPlayer, playerId) => {
        const response = await axios.post(`${apiUrl}/game/${gameId}/move`, {gameId, board, currentPlayer, playerId});
        return response.data;
    }
}

export default api;