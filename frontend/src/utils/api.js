import { Auth } from "./auth";
const HOST = 'https://eventmanagement-rxzo.onrender.com/';
const userBaseUrl = `${HOST}/api/users`;
const eventBaseUrl = `${HOST}/api/events`;


const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
    }
    return response.json();
};

export const api = {
    // Authentication
    login: async (userData) => {
        try {
            const response = await fetch(`${userBaseUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            return await handleResponse(response);
        } catch (error) {
            throw error;
        }
    },
    register: async (userData) => {
        try {
            const response = await fetch(`${userBaseUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            return await handleResponse(response);
        } catch (error) {
            throw error;
        }
    },

    // Events
    getEvents: async (search = "", category = "", timeframe = "") => {
        try {
            const response = await fetch(`${eventBaseUrl}?search=${search}&category=${category}&timeframe=${timeframe}`);
            return await handleResponse(response);
        } catch (error) {
            throw error;
        }
    },

    getEventById: async (eventId) => {
        try {
            const headers = {};
            if(Auth.isLoggedIn()) {
                headers.Authorization = `Bearer ${Auth.getUser().token}`;
            }
            const response = await fetch(`${eventBaseUrl}/${eventId}`,
                {
                    headers: headers,
                }
            );
            return await handleResponse(response);
        } catch (error) {
            throw error;
        }
    },

    createEvent: async (eventData, token) => {
        try {
            const response = await fetch(eventBaseUrl, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    ContentType: 'multipart/form-data',
                },
                body: eventData,
            });
            return await handleResponse(response);
        } catch (error) {
            throw error;
        }
    },

    updateEvent: async (eventId, eventData, token) => {
        try {
            const response = await fetch(`${eventBaseUrl}/${eventId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: eventData,
            });
            return await handleResponse(response);
        } catch (error) {
            throw error;
        }
    },

    deleteEvent: async (eventId, token) => {
        try {
            const response = await fetch(`${eventBaseUrl}/${eventId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return await handleResponse(response);
        } catch (error) {
            throw error;
        }
    },

    joinEvent: async (eventId, token) => {
        try {
            const response = await fetch(`${eventBaseUrl}/${eventId}/join`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return await handleResponse(response);
        } catch (error) {
            throw error;
        }
    },

    leaveEvent: async (eventId, token) => {
        try {
            const response = await fetch(`${eventBaseUrl}/${eventId}/leave`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return await handleResponse(response);
        } catch (error) {
            throw error;
        }
    },

};