import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Posts } from './components/Posts';
import { NavBar } from './components/NavBar';

function App() {
  return (
    <Router>
      {/* <NavBar/> */}
        <Routes>
          <Route path="/" element={ <Posts/> } />
        </Routes>
    </Router>
  );
}

export default App;
