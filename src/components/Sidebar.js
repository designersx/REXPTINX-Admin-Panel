import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../css/Sidebar.module.css';
import { FiSettings, FiList, FiLogOut, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { MdAdminPanelSettings } from 'react-icons/md';
import PopUp from './Popup';
import { FaUser } from 'react-icons/fa';
import { useSidebarPermissions } from '../context/AccessControlContext';
import { FaUsersCog } from 'react-icons/fa'
import { FaUserCheck } from 'react-icons/fa'
import { MdDashboard } from 'react-icons/md'
import { MdAnalytics } from 'react-icons/md';
import { MdSupportAgent } from 'react-icons/md';
 import { MdGroup } from 'react-icons/md';
const Sidebar = ({ onToggle }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState(null);
    const [popupMessage, setPopupMessage] = useState("");
    const [confirmAction, setConfirmAction] = useState(() => () => { });
    const { rolePermissions, loading } = useSidebarPermissions();
    const toggleSidebar = () => {
        const newState = !isOpen;
        setIsOpen(newState);
        onToggle(newState);
    };
    const handleLogout = () => {
        setPopupType("confirm");
        setPopupMessage("Are you sure you want to logout?");
        setShowPopup(true);
        setConfirmAction(() => () => {
            localStorage.clear();
            window.location.href = '/';
        })
        setTimeout(() => {
            setShowPopup(true);
        }, 10);
    }
    // Check only 'view' permissions for visibility
    const canViewRoles = rolePermissions?.Roles?.view;
    const canViewSetting = rolePermissions?.Setting?.view;
    const canViewTask = rolePermissions?.Task?.view;
    const canViewUsers = rolePermissions?.Users.view
    return (
        <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>

            <div className={styles.toggleButton} onClick={toggleSidebar}>
                {isOpen ? <b className=''>Hi welcome!</b> : ""}
                {isOpen ? <FiChevronLeft className={styles.topOpenCloseIcon} /> : <FiChevronRight className={styles.topOpenCloseIcon} />}
            </div>

            {/* {rolePermissions ? */}

            <ul>
                {/* {loading || canViewSetting ? */}
                <li>
                    <NavLink
                        to="/dashboard/analytics"
                        className={({ isActive }) =>
                            `${isActive ? styles.activeTab : ''} ${styles.navLink}`
                        }
                    >
                        <MdAnalytics className={styles.icon} /> &nbsp;&nbsp;
                        {isOpen && <span>Analytics</span>}
                    </NavLink>
                </li>
                {/* : null} */}
                <li>
                    <NavLink
                        to="/dashboard/agents"
                        className={({ isActive }) =>
                            `${isActive ? styles.activeTab : ''} ${styles.navLink}`
                        }
                    >
                        <MdSupportAgent className={styles.icon} /> &nbsp;&nbsp;
                        {isOpen && <span>Agents</span>}
                    </NavLink>
                </li>

                {/* {loading || canViewTask ? <li>
                        <NavLink
                            to="/dashboard/batchcall"
                            className={({ isActive }) =>
                                `${isActive ? styles.activeTab : ''} ${styles.navLink}`
                            }
                        >
                            <FiList className={styles.icon} /> &nbsp;&nbsp;
                            {isOpen && <span>Task</span>}
                        </NavLink>
                    </li> : null} */}
                <li>
                    <NavLink
                        to="/dashboard/registeredUsers"
                        className={({ isActive }) =>
                            `${isActive ? styles.activeTab : ''} ${styles.navLink}`
                        }
                    >
                        <FaUserCheck className={styles.icon} /> &nbsp;&nbsp;
                        {isOpen && <span>Registered Users</span>}
                    </NavLink>
                </li>
                {/* {canViewUsers || loading ?  */}
                <li>
                    <NavLink
                        to="/dashboard/viewUsers"
                        className={({ isActive }) =>
                            `${isActive ? styles.activeTab : ''} ${styles.navLink}`
                        }
                    >
                        <FaUsersCog className={styles.icon} /> &nbsp;&nbsp;
                        {isOpen && <span>User Management	</span>}
                    </NavLink>
                </li>
                {/* : null} */}

                {/* {canViewRoles || loading ? */}
                <li>
                    <NavLink
                        to="/dashboard/viewRoles"
                        className={({ isActive }) =>
                            `${isActive ? styles.activeTab : ''} ${styles.navLink}`
                        }
                    >
                        <MdAdminPanelSettings className={styles.icon} /> &nbsp;&nbsp;
                        {isOpen && <span>Role Management</span>}
                    </NavLink>
                </li>
                 {/* <li>
                    <NavLink
                        to="/dashboard/viewPartners"
                        className={({ isActive }) =>
                            `${isActive ? styles.activeTab : ''} ${styles.navLink}`
                        }
                    >
                        <MdGroup className={styles.icon} /> &nbsp;&nbsp;
                        {isOpen && <span>Partners</span>}
                    </NavLink>
                </li> */}
                 {/* : null}  */}
               
                <li onClick={handleLogout} className={styles.navLink}>
                    <NavLink className={({ isActive }) =>
                        ` ${styles.navLink}`
                    }>
                        <FiLogOut className={styles.icon} /> &nbsp;&nbsp;
                        {isOpen && <span>Logout</span>}
                    </NavLink>
                </li>
            </ul>
            {/* : null} */}
            {showPopup && (
                <PopUp type={popupType} message={popupMessage} onClose={() => setShowPopup(false)} onConfirm={confirmAction}
                />
            )}
        </div>
    );
};

export default Sidebar;
