import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../css/Navbar.module.css';

const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>

        <img src='/svg/logo.png'/>
      </div>
  
    </nav>
  );
};

export default Navbar;
