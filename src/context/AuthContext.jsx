import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Helper to get stored users from localStorage
const getStoredUsers = () => {
    try {
        return JSON.parse(localStorage.getItem('registered_users') || '[]');
    } catch { return []; }
};

const saveUsers = (users) => {
    localStorage.setItem('registered_users', JSON.stringify(users));
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('auth_user');
        if (token && savedUser) {
            try { setUser(JSON.parse(savedUser)); } catch { }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const users = getStoredUsers();
        const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!found) {
            throw new Error('No account found with this email. Please register first.');
        }
        if (found.password !== password) {
            throw new Error('Incorrect password. Please try again.');
        }

        const sessionUser = { id: found.id, fullName: found.fullName, email: found.email, phone: found.phone || '', joinedAt: found.joinedAt };
        localStorage.setItem('auth_token', 'token_' + Date.now());
        localStorage.setItem('auth_user', JSON.stringify(sessionUser));
        setUser(sessionUser);
        return sessionUser;
    };

    const register = async (fullName, email, password, phone) => {
        const users = getStoredUsers();
        const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
            throw new Error('An account with this email already exists. Please sign in.');
        }

        const newUser = {
            id: Date.now(),
            fullName,
            email,
            password,
            phone: phone || '',
            joinedAt: new Date().toISOString(),
        };
        users.push(newUser);
        saveUsers(users);

        // Return the new user info (but don't auto-login)
        return newUser;
    };

    const updateProfile = (updates) => {
        if (!user) return;
        const updatedUser = { ...user, ...updates };

        // Update in user store
        const users = getStoredUsers();
        const idx = users.findIndex(u => u.id === user.id);
        if (idx !== -1) {
            users[idx] = { ...users[idx], ...updates };
            saveUsers(users);
        }

        // Update session
        localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
}
