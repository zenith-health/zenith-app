import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import SignUpComponent from './components/SignUpComponent';
import Home from './pages/HomePage';
import ProtectedRoute from './components/PrivateRoutes';
import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import { AdminComponent } from './components/home/AdminComponent';
import { UserProvider } from './context/userContext';

function App() {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginComponent setShowSignUp={setShowSignUp} />} />
          <Route path="/signup" element={<SignUpComponent setShowSignUp={setShowSignUp} />} />
          {/* <Route element={<ProtectedRoute />}> */}
          <Route path="/home" element={<Home />} />
          <Route path="/admin" element={<AdminComponent />} />
          {/* </Route> */}
          <Route path="/" element={<LoginPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
