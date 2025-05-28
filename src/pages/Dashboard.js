import React, { useEffect, useState } from 'react';
import Settings from './Settings';
import BatchCall from './BatchCall';
import Layout from '../components/Layout';
import ViewRole from './ViewRole';
import { useLocation } from 'react-router-dom';
import AddRole from './AddRole';
import ViewUsers from './ViewUsers';
import AddUsers from './AddUsers';
import ViewRegisteredUsers from './ViewRegisteredUsers';
import ViewAnalytics from './ViewAnalytics';
import ViewAgents from './ViewAgents';
const Dashboard = () => {
  const [tab, setTab] = useState('settings');
  const location = useLocation()
  useEffect(() => {
    const pathTab = location.pathname.split('/').pop();
    if (['settings', 'batchcall', 'viewRoles', "addRole", "viewUsers", "addUsers","registeredUsers","analytics","agents"].includes(pathTab)) {
      setTab(pathTab);
    }
  }, [location.pathname]);
  const renderTabContent = () => {
    switch (tab) {
      case 'analytics':
        return <ViewAnalytics />;
      case 'batchcall':
        return <BatchCall />;
      case 'viewRoles':
        return <ViewRole />;
      case 'addRole':
        return <AddRole />;
      case 'viewUsers':
        return <ViewUsers />;
      case 'addUsers':
        return <AddUsers />
          case 'registeredUsers':
        return <ViewRegisteredUsers />
        case "analytics":
          return <ViewAnalytics/>
          case "agents":
          return <ViewAgents/>
      default:
        return <ViewAnalytics/>;
    }
  };

  return (
    <Layout setTab={setTab} tab={tab}>
      {renderTabContent()}
    </Layout>
  );
};

export default Dashboard;
