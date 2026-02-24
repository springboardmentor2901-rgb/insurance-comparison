import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('auth_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetch('/api/auth/me', {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => res.ok ? res.json() : Promise.reject())
                .then(userData => { setUser(userData); setLoading(false); })
                .catch(() => { localStorage.removeItem('auth_token'); setToken(null); setUser(null); setLoading(false); });
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            // Handle non-JSON responses (e.g., if server is down or returns HTML error)
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server returned an invalid response. Please check if the backend is running.');
            }

            const data = await res.json();
            if (!res.ok) {
                const err = new Error(data.error || 'Login failed');
                err.code = data.code;
                throw err;
            }
            localStorage.setItem('auth_token', data.token);
            setToken(data.token);
            setUser(data.user);
            return data.user;
        } catch (err) {
            console.error('Login error:', err);
            throw err;
        }
    };

    const register = async (fullName, email, password, phone) => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, password, phone })
            });

            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server returned an invalid response. Please check if the backend is running.');
            }

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Registration failed');
            // Do NOT auto-login — user must log in manually after registration
            return { success: true, message: 'Registration successful! Please log in.' };
        } catch (err) {
            console.error('Registration error:', err);
            throw err;
        }
    };

    const logout = () => {
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading, isAuthenticated: !!user, isAdmin: user?.role === 'admin' }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
