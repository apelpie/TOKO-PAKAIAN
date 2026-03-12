import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Setup axios
const api = axios.create({
    baseURL: 'http://localhost:3000' // PORT 3000
});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Cek token saat aplikasi dimulai
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const userData = localStorage.getItem('user');
        
        if (accessToken && refreshToken && userData) {
            // Set token di header
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post('/auth/login', { 
                username, 
                password 
            });
            
            const { accessToken, refreshToken, user } = response.data;
            
            // Simpan token dan user data
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Set default header
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            
            // Set user state
            setUser(user);
            
            return { 
                success: true, 
                user,
                role: user.role
            };
        } catch (error) {
            console.error('Login error:', error.response?.data);
            return { 
                success: false, 
                message: error.response?.data?.pesan || 'Login gagal' 
            };
        }
    };

    const logout = () => {
        // Hapus semua dari localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Hapus header
        delete api.defaults.headers.common['Authorization'];
        
        // Reset user state
        setUser(null);
    };

    // Fungsi untuk refresh token (optional)
    const refreshAccessToken = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('No refresh token');
            
            const response = await api.post('/auth/refresh', {
                refreshToken
            });
            
            const { accessToken } = response.data;
            
            localStorage.setItem('accessToken', accessToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            
            return accessToken;
        } catch (error) {
            logout();
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            loading,
            refreshAccessToken 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);