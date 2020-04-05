import axios from 'axios';
const headers = {
    'Content-Type' : 'application/json'
};
const back_url = 'http://localhost:8000';

export default {
    login: (email, password) => {
        return axios.post(`${back_url}/login`, { email, password }, {headers: headers});
    },
    signup: (send) => {
        return axios.post(`${back_url}/signup`, send, {headers: headers});
    },
    isAuth: () => {
        return localStorage.getItem('token') !== null;
    },
    logout: () => {
        localStorage.clear();
    }
};
