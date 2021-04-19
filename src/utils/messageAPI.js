import axios from "axios";

let url = '';
if (process.env.NODE_ENV === 'production') {
    url = "https://mst-k4h-server.herokuapp.com"
} else if (process.env.NODE_ENV === 'development') {
    url = "http://localhost:3001"
}

export default {
    createThread: (otherUser, token) => {
        return axios.post(`${url}/api/thread`, {user2: otherUser}, {
            headers: {
                authorization: `Bearer: ${token}`
            }
        });
    },

    getThreads: (token) => {
        return axios.get(`${url}/api/thread/`, {
            headers: {
                authorization: `Bearer: ${token}`
            }
        });
    },

    getThreadMessages: (threadID, token) => {
        return axios.get(`${url}/api/message/?thread=${threadID}`, {
            headers: {
                authorization: `Bearer: ${token}`
            }
        });
    },

    sendMessage: (data, token) => {
        return axios.post(`${url}/api/message`, data, {
            headers: {
                authorization: `Bearer: ${token}`
            }
        });
    },

    searchUsers: (searchTerm, token) => {
        return axios.get(`${url}/api/user/?search=${searchTerm}`, {
            headers: {
                authorization: `Bearer: ${token}`
            }
        });
    }
}