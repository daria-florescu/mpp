import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Login({ onSwitchToRegister }) {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData.username, formData.password);
        
        if (!result.success) {
            setError(result.error);
        }
        
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Login to Book Manager</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="auth-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="auth-input"
                        />
                    </div>

                    <div className="form-buttons">
                        <button type="submit" className="auth-button primary" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>

                <div className="auth-switch">
                    <p>Don't have an account? 
                        <button 
                            type="button" 
                            className="link-button" 
                            onClick={onSwitchToRegister}
                        >
                            Register here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;