import React, {useState} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Posts } from './Posts';
import { TopBar } from './TopBar';

// Component
export const StateShare = () => {
    const [loginStatus, setLoginStatus] = useState(false);

    const updateLoginStatus = (newLoginStatus) => {
        setLoginStatus(newLoginStatus);
    }

    return (
        <Router>
            <div className='container'>
            <TopBar loginStatus={loginStatus} updateLoginStatus={updateLoginStatus} />
            <hr className="hr hr-blurry" />
            <Routes>
                <Route path="/" element={<Posts loginStatus={loginStatus} />} />
            </Routes>
            </div>
        </Router>
    );
};
