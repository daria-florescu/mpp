import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Register({ onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { register } = useAuth();

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
        setSuccess('');

        const result = await register(formData.username, formData.password, formData.email);
        
        if (result.success) {
            setSuccess(result.message);
            setTimeout(() => {
                onSwitchToLogin();
            }, 2000);
        } else {
            setError(result.error);
        }
        
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Register for Book Manager</h2>
                
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                
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
                            minLength="3"
                            className="auth-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
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
                            minLength="6"
                            className="auth-input"
                        />
                    </div>

                    <div className="form-buttons">
                        <button type="submit" className="auth-button primary" disabled={loading}>
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>

                <div className="auth-switch">
                    <p>Already have an account? 
                        <button 
                            type="button" 
                            className="link-button" 
                            onClick={onSwitchToLogin}
                        >
                            Login here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;