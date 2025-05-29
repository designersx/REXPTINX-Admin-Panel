import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './App.css';
import { useEffect, useState } from 'react';
import AddRole from './pages/AddRole';
import Settings from './pages/Settings';
import BatchCall from './pages/BatchCall';
import ViewRole from './pages/ViewRole';
import ViewUsers from './pages/ViewUsers';
import AddUsers from './pages/AddUsers';
import { RolePermissionsProvider } from './context/AccessControlContext';
import CheckGoolgeCalender from './pages/checkGoogleApi';
import PaymentPage from './pages/paymentPage';
import ViewRegisteredUsers from './pages/ViewRegisteredUsers';
import ViewAnalytics from './pages/ViewAnalytics';
import ViewAgents from './pages/ViewAgents';
import AgentDetails from './pages/AgentDetails';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <RolePermissionsProvider>
      <Router>
        <Routes>
          {/* <Route
            path="/check"
            element={<CheckGoolgeCalender setIsAuthenticated={setIsAuthenticated} />}
          />
            <Route
            path="/payment"
            element={<PaymentPage setIsAuthenticated={setIsAuthenticated} />}
          /> */}
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
          />

          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
          />
          <Route path="/register" element={<Register />} />
          {isAuthenticated && (
            <Route path="/dashboard" element={<Dashboard />}>
              <Route path="settings" element={<Settings />} />
              <Route path="batchcall" element={<BatchCall />} />
              <Route path="viewRoles" element={<ViewRole />} />
              <Route path="addRole" element={<AddRole />} />
              <Route path="viewUsers" element={<ViewUsers />} />
              <Route path="addUsers" element={<AddUsers />} />
              <Route path="registeredUsers" element={<ViewRegisteredUsers />} />
                 <Route path="analytics" element={<ViewAnalytics />} />
                    <Route path="agents" element={<ViewAgents/>} />
            </Route>
            
          )}
          <Route path = '/view-users-agent-details/:userId' element={<AgentDetails/>} />
        </Routes>
      </Router>
    </RolePermissionsProvider>
  );
}

export default App;
