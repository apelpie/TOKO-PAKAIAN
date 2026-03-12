import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        const result = await login(username, password);
        
        console.log('Login result:', result);
        console.log('User role:', result.user?.role);

        if (result.success) {
            // Redirect berdasarkan role
            const userRole = result.user?.role || 'pelanggan';
            
            if (userRole === 'admin') {
                navigate('/admin/dashboard');
            } else if (userRole === 'kasir') {
                navigate('/kasir/dashboard');
            } else {
                navigate('/dashboard'); // untuk pelanggan
            }
        } else {
            setError(result.message);
        }
        
        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Daphne's</h1>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Masukkan username"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Masukkan password"
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-login"
                    >
                        {loading ? 'Loading...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;