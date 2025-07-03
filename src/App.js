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
import Partners from './pages/Partners';
import ViewKnowledgeBase from './pages/ViewKnowledgeBase';
import PromptsDetails from './components/PromptsDetails';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);
useEffect(() => {
  const container = document.getElementById("rexWidgetContainer");
  if (!container) return;

  const script = document.createElement("script");
  script.src = "https://melodic-jelly-be17df.netlify.app/index.js";
  script.async = true;
  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
}, []);
  // useEffect(() => {
  //   const script = document.createElement("script");
  //   // script.src = "https://67c97f33b59fab2d9e398d19--elegant-moxie-e0c22c.netlify.app/reviews.js"; 
  //   script.async = true;
  //   document.body.appendChild(script);

  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);
  return (
    <>
      <div id="Lk68n4f78GaVMEQQ@EFG"></div> 


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
                        <Route path='viewPartners' element={<Partners/>}/>
                        
            </Route>
            
            
          )}
          <Route path='/viewKnowledgeBase/:userId' element={<ViewKnowledgeBase/>}></Route>
          <Route path = '/view-users-agent-details/:userId' element={<AgentDetails/>} />
          <Route path = '/view-prompt-agent-details/:llmId' element={<PromptsDetails/>} />
        </Routes>
      </Router>
    </RolePermissionsProvider>
    </>
  );
}

export default App;
