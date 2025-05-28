// import React, { useEffect, useState } from 'react';
// import styles from "../css/Analytics.module.css";

// import axios from 'axios';
// import { API_URL } from '../config/apiStore';
// import decodeToken from '../utils/decodeToken';
// import {
//   FaProjectDiagram,
//   FaClipboardList,
//   FaMoneyBillWave,
//   FaMoneyCheckAlt,
// } from "react-icons/fa";
// import { MdOutlineLeaderboard } from "react-icons/md";
// const ViewAnalytics = () => {


//     return (
//     <> <div className={styles.dashboardContainer}>
//       <h1 className={styles.dashboardTitle}>📊 Dashboard Overview</h1>

//       {/* Stat Cards */}
//       <div className={styles.cardGrid}>
//         <div className={styles.card}>
//           <div className={styles.cardHeader}>
//             <FaProjectDiagram className={styles.cardIcon1} />
//             <h2>Total Projects</h2>
//           </div>
//           <p>
//             {/* {stats.totalProjects} */}

//           </p>
//         </div>
//         <div className={styles.card}>
//           <div className={styles.cardHeader}>
//             <FaClipboardList className={styles.cardIcon} />
//             <h2>Pending Punch List</h2>
//           </div>
//           <p>
//             {/* {stats.totalPendingPunchList} */}
//             </p>
//         </div>
//         <div className={styles.card}>
//           <div className={styles.cardHeader}>
//             <FaMoneyBillWave className={styles.cardIcon} />
//             <h2>Total Value Of Projects</h2>
//           </div>
//           <p>
//             {/* $ {stats.totalProjectValue.toLocaleString()} */}
//             </p>
//         </div>
//         <div className={styles.card}>
//           <div className={styles.cardHeader}>
//             <FaMoneyCheckAlt className={styles.cardIcon} />
//             <h2>Total Paid Amount</h2>
//           </div>
//           <p>
//             {/* $ {stats.totalPaidAmount.toLocaleString()} */}
//             </p>
//         </div>
//       </div>

//       {/* Top Customers */}
//       <h2 className={styles.subsectionTitle}>
//         <MdOutlineLeaderboard /> Top 3 Customers by Project Value
//       </h2>
//       <div className={styles.cardGrid}>
//         {/* {stats?.topCustomers?.map((customer, index) => (
//           <div key={customer.clientId} className={styles.customerCard}>
//             <div className={styles.customerHeader}>
//               <img
//                 src={
//                   customer.profilePhoto
//                     ? `${url2}/${customer.profilePhoto}`
//                     : `${process.env.PUBLIC_URL}/assets/Default_pfp.jpg`
//                 }
//                 alt={customer.full_name}
//                 className={styles.customerAvatar}
//               />
//               <div>
//                 <h3 className={styles.customerName}>
//                   #{index + 1} {customer.full_name}
//                 </h3>
//                 <p className={styles.customerValue}>
//                   Total Value: $ {customer.totalProjectValue.toLocaleString()}
//                 </p>
//               </div>
//             </div>

//             {customer?.projects?.length > 0 && (
//               <div className={styles.projectList}>
//                 <h4>Projects</h4>
//                 <ul>
//                   {customer.projects.map((projectName, i) => (
//                     <li
//                       title={`Total Value ${projectName?.value}`}
//                       key={i}
//                     >
//                       {projectName.name}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         ))} */}
//       </div>

//       {/* Charts */}

//     </div></>
//     );
// };

// export default ViewAnalytics;
import React from 'react';
import styles from "../css/Analytics.module.css";
import { FaUserSecret, FaUsers, FaUserCog } from "react-icons/fa";

const ViewAnalytics = () => {
    // Dummy data for now
    const stats = {
        totalAgents: 120,
        totalRegisteredUsers: 450,
        totalUserManagement: 570
    };

    return (
        <div className={styles.dashboardContainer}>
            <h1 className={styles.dashboardTitle}>👥 User Overview</h1>

            <div className={styles.cardGrid}>
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <FaUserSecret className={styles.cardIcon1} />
                        <h2>Total Agents</h2>
                    </div>
                    <p>{stats.totalAgents}</p>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <FaUsers className={styles.cardIcon} />
                        <h2>Total Registered Users</h2>
                    </div>
                    <p>{stats.totalRegisteredUsers}</p>
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

