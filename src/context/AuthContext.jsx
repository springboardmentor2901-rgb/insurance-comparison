import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

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
        // Mock login — accept demo or any creds
        if (email === 'demo@insurance.com' && password === 'demo123') {
            const u = { id: 1, fullName: 'Demo User', email };
            localStorage.setItem('auth_token', 'mock_token_' + Date.now());
            localStorage.setItem('auth_user', JSON.stringify(u));
            setUser(u);
            return u;
        }
        throw new Error('Invalid email or password. Try demo@insurance.com / demo123');
    };

    const register = async (fullName, email, password) => {
        const u = { id: Date.now(), fullName, email };
        localStorage.setItem('auth_token', 'mock_token_' + Date.now());
        localStorage.setItem('auth_user', JSON.stringify(u));
        setUser(u);
        return u;
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
