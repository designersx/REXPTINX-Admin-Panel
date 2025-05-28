import React, { useEffect, useState } from 'react';
import styles from '../css/ViewRole.module.css';
import axios from 'axios';
import { API_URL, deleteUser, retrieveAllUsers } from '../config/apiStore';
import decodeToken from '../utils/decodeToken';
import Modal from '../Modal/Modal';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from "react-icons/fa";
import { useSidebarPermissions } from '../context/AccessControlContext';
const ViewUsers = () => {
    const [selectedTask, setSelectedTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const [roleData, setRoleData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTasks, setSelectedTasks] = useState([]);
    const token = localStorage.getItem('token');
    const decodedToken = decodeToken(token);
    const userId = decodedToken.user.id;
    const { rolePermissions } = useSidebarPermissions();
    const canCreate = rolePermissions?.Users?.create;
    const canEdit = rolePermissions?.Users?.edit;
    const canDelete = rolePermissions?.Users?.delete;
    const canView = rolePermissions?.Users?.view;
    const navigate = useNavigate()
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await retrieveAllUsers();
            setRoleData(response.data.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    const handleRefresh = () => {
        fetchUsers();
    };


    const filteredTasks = roleData?.filter(task =>
        task.email.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );


    const isAllSelected = filteredTasks?.length > 0 && selectedTasks?.length === filteredTasks?.length;
    const totalPages = Math.ceil(filteredTasks?.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTasks = filteredTasks?.slice(indexOfFirstItem, indexOfLastItem);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };
    //add users
    const handleAddRole = () => {
        navigate("/dashboard/addUsers")
    }
    //delete users
    const handleDeleteUsers=async()=>{
        try {
          const response =await deleteUser(userId)

        } catch (error) {
            
        }
    }
    useEffect(() => {
        fetchUsers()
    }, [])
    return (
        <>
            <div className={styles.batchCall}>
                <h2>Users</h2>
                <div className={styles.taskList}>
                    <div className={styles.searchDiv}>
                        <input
                            type="text"
                            placeholder="Search by email"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className={styles.searchInput}
                        />
                        <button className={styles.allBatchButton} onClick={handleRefresh}>Refresh</button>

                        {/* {canCreate && */}
                         <button className={styles.allBatchButton} onClick={() => handleAddRole()}>
                            Add user
                        </button>
                        {/* } */}

                    </div>

                    <table className={styles.taskTable}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Password</th>
                                <th>Phone number</th>
                                <th>Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr >
                                    <td colSpan="8" style={{ textAlign: "center" }}><Loader /></td>
                                </tr>
                            ) : currentTasks?.length > 0 ? (
                                currentTasks?.map((task) => (
                                    <tr key={task.id}>


                                        <td>{task.firstName + task.lastName}</td>
                                        <td>{task.email || "NA"}</td>
                                        <td>{task.password || "NA"}</td>
                                        <td>{task.phoneNumber || "NA"}</td>
                                        <td>
                                            <div className={styles.tdBtn}>

                                                {canEdit && <FaEdit size={23} color="black" />}

                                                {canDelete && <FaTrash size={23} color="black" />}

                                            </div>

                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>No users yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {filteredTasks?.length > 0 && (
                        <div className={styles.pagination}>
                            <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
                        </div>
                    )}
                </div>
            </div>


        </>
    );
};

export default ViewUsers;
