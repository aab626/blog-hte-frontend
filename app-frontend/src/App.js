import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Posts } from './components/Posts';

function App() {
  return (
    <Router>

      <div>
        <Routes>
          <Route path="/" element={ <Posts/> } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
