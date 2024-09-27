import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TaskList from './components/TaskList';
import WelcomePage from './components/WelcomePage'; // Import the WelcomePage component (This will show you welcome page then navigate to todo list)

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route for WelcomePage */}
          <Route path="/" element={<WelcomePage />} />

          {/* Route for TaskList */}
          <Route path="/tasks" element={<TaskList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
