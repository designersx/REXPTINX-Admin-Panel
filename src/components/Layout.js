import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import styles from '../css/Layout.module.css';

const Layout = ({ children, setTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className={styles.layout}>
      <div className={`${styles.sideBar} ${sidebarOpen ? styles.open : styles.closed}`}>
        <Sidebar setTab={setTab} onToggle={setSidebarOpen} />
      </div>
      <div className={`${styles.mainContent} ${sidebarOpen ? styles.mainOpen : styles.mainClosed}`}>
        <Navbar />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
