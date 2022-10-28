import axios from 'axios';

const api = axios.create({
    baseURL:'https://watson-assistant-example.herokuapp.com'
});

export default api;