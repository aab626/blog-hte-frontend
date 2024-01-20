import React, {useState} from 'react';

// API address from enviroment variables
const API = process.env.REACT_APP_API;

// Component
export const TopBar = ({ loginStatus, updateLoginStatus }) => {

    // State variables
    // const [loginStatus, setLoginStatus] = useState(false);
    const [password, setPassword] = useState('');

    // Renders the login/logout box
    const renderLogBox = () => {
        // If logged in, render the logout box
        if (loginStatus) {
            return (
                <form className="form">
                    <div className="input-group justify-content-end align-items-center">
                        <p className="mb-0">
                            Administrator
                        </p>

                        <div className="input-group-append ms-2">
                            <button 
                                className="btn btn-secondary" 
                                type="submit"
                                onClick={e => handleAdminLogout()}
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </form>
            )
        // If not logged in, render the login box
        } else {
            return (
                <form className="form" onSubmit={handleAdminLogin}>
                    <div className="input-group">
                        <input
                            className="form-control mr-sm-2"
                            type="password"
                            placeholder="Password"
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                        />

                        <div className="input-group-appen">
                            <button className="btn btn-secondary" type="submit">
                                Log In
                            </button>
                        </div>
                    </div>
                </form>

            ) 
        }
    }

    // Handles the admin login
    const handleAdminLogin = async (e) => {
        e.preventDefault();

        // API request to check admin password
        const response = await fetch(`${API}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                {
                    password: password
                }
            )
        })

        const result = (await response.json()).result;

        if (result) {
            updateLoginStatus(result);
        } else {
            alert('Incorrect password!')
        }
    }

    // Handles the admin logout
    const handleAdminLogout = (e) => {
        e.preventDefault();
        updateLoginStatus(false);
    }

    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container">
                {/* Logo */}
                <a className="navbar-brand" href="/">
                    <img
                        src="./images/logo.png" // Replace with your image URL
                        alt="Logo"
                        width="100"
                        height="100"
                        className="d-inline-block align-top"
                    />
                </a>

                {/* Page Title */}
                <h1 className="navbar-text">Blogsito</h1>

                {/* Login Input Field */}
                {renderLogBox()}
                
            </div>
        </nav>
    );
}