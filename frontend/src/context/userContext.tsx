import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import * as jwt_decode from 'jwt-decode';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                // Decode token to get user info
                const decodedToken = jwt_decode(token);
                
                // Set user info from decoded token
                setUser({
                    _id: decodedToken._id, // Ajuste o nome da chave conforme sua estrutura do token
                    email: decodedToken.email,
                });

                setLoading(false);
            } catch (error) {
                setError('Failed to decode token.');
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const sendEmail = async (userId, userEmail) => {
        if (!userId || !userEmail) {
            console.error("User ID or Email is not available.");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, email: userEmail }),
            });

            if (!response.ok) {
                console.error('Failed to send email');
            }
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    const value = useMemo(() => ({
        user,
        loading,
        error,
        sendEmail, // Expose sendEmail to components
    }), [user, loading, error]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
