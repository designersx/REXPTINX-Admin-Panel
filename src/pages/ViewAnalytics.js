
import React, { useEffect, useState } from 'react';
import styles from "../css/Analytics.module.css";
import { FaUserSecret, FaUsers, FaUserCog } from "react-icons/fa";
import { fetchAgents, retrieveAllRegisteredUsers } from '../config/apiStore';
import Loader from '../components/Loader';

const ViewAnalytics = () => {
    const [agentCount,setAgentCount]=useState()
    const [registerUsersCount,setRegisteredUsersCount]=useState()
    const [loading,setLoading]=useState(false)
    // Dummy data for now
    const stats = {
        totalAgents: agentCount,
        totalRegisteredUsers: registerUsersCount,
        totalUserManagement: 570
    };
    const fetchAgentsCount = async () => {
       
        try {
             setLoading(true)
            const response = await fetchAgents();
            setAgentCount(response.data.length);
        } catch (error) {
            console.log(error);
        } finally {
          setLoading(false)
        }
    };
     const fetchRegisterUsersCount = async () => {
       
        try {
             setLoading(true)
            const response = await retrieveAllRegisteredUsers();
         
            setRegisteredUsersCount(response.length);
        } catch (error) {
            console.log(error);
        } finally {
          setLoading(false)
        }
    };
    useEffect(()=>{
    fetchAgentsCount()
    fetchRegisterUsersCount()
    },[])
    return (
        <div className={styles.dashboardContainer}>
            <h1 className={styles.dashboardTitle}>👥 User Overview</h1>

            <div className={styles.cardGrid}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <FaUserSecret className={styles.cardIcon1} />
                        <h2>Total Agents</h2>
                    </div>
                    <p>{loading?<Loader  size={20} />:stats.totalAgents}</p>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <FaUsers className={styles.cardIcon} />
                        <h2>Total Registered Users</h2>
                    </div>
                    <p>{loading?<Loader  size={20} />:stats.totalRegisteredUsers}</p>
                </div>

                {/* <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <FaUserCog className={styles.cardIcon} />
                        <h2>Total User Management</h2>
                    </div>
                    <p>{stats.totalUserManagement}</p>
                </div> */}
            </div>

            {/* <div className={styles.chartRow}>
                <div className={styles.chartContainer}>
                    <h2 className={styles.subsectionTitle}></h2>

                </div>

                <div className={`${styles.chartContainer} ${styles.wideChart}`}>
                    <h2 className={styles.subsectionTitle}>📈 Monthly Revenue Overview</h2>

                    <div className={styles.filterRow}>
                        <label>Select Month: </label>

                    </div>

                    <div className={styles.monthlyTotal}>

                    </div>


                </div>
            </div> */}
        </div>
    );
};

export default ViewAnalytics;

