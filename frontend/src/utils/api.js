const HOST = 'http://localhost:5000';
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
    getEvents: async () => {
        try {
            const response = await fetch(eventBaseUrl);
            return await handleResponse(response);
        } catch (error) {
            throw error;
        }
    },

    getEventById: async (eventId) => {
        try {
            const response = await fetch(`${eventBaseUrl}/${eventId}`);
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