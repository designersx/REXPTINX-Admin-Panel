import React, { useEffect, useState } from 'react';
import styles from '../css/ViewRole.module.css';
import axios from 'axios';
import { API_URL, deleteUser, fetchAgents, retrieveAllUsers } from '../config/apiStore';
import decodeToken from '../utils/decodeToken';
import Modal from '../Modal/Modal';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from "react-icons/fa";
import { useSidebarPermissions } from '../context/AccessControlContext';
const ViewAgents = () => {
    const [selectedTask, setSelectedTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
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
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetchAgents();
            console.log(response, "AGENTS")
            setData(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    const handleRefresh = () => {
        fetchData();
    };


    const filteredTasks = data && data?.filter(task =>
        task.agent_name.toLowerCase().includes(searchQuery.trim().toLowerCase())
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
    const handleDeleteUsers = async () => {
        try {
            const response = await deleteUser(userId)

        } catch (error) {

        }
    }
    useEffect(() => {
        fetchData()
    }, [])
    return (
        <>
            <div className={styles.batchCall}>
                <h2>Agents</h2>
                <div className={styles.taskList}>
                    <div className={styles.searchDiv}>
                        <input
                            type="text"
                            placeholder="Search by agent name"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className={styles.searchInput}
                        />
                        <button className={styles.allBatchButton} onClick={handleRefresh}>Refresh</button>

                        {/* {canCreate && */}
                        {/* <button className={styles.allBatchButton} onClick={() => handleAddRole()}>
                            Add user
                        </button> */}
                        {/* } */}

                    </div>

                    <table className={styles.taskTable}>
                        <thead>
                            <tr>
                                <th>Agent Name</th>
                                {/* <th>Agent Type</th> */}
                                <th>Voice</th>

                                <th>Phone</th>
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


                                        <td>   {task.agent_name.length > 50
                                            ? `${task.agent_name.slice(0, 20)}...`
                                            : task.agent_name}
                                        </td>
                                        {/* <td>{task.agent_type }</td> */}
                                        <td style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            {task.avatar_url ? (
                                                <img
                                                    src={task.avatar_url}
                                                    alt={task.voice_name}
                                                    style={{ width: "30px", height: "30px", borderRadius: "50%", objectFit: "cover" }}
                                                />
                                            ) : (
                                                <div
                                                    style={{
                                                        width: "30px",
                                                        height: "30px",
                                                        borderRadius: "50%",
                                                        backgroundColor: "#ccc",
                                                    }}
                                                />
                                            )}
                                            <span>{task.voice_name || "NA"}</span>
                                        </td>

                                        <td>{task.phoneNumber || "-"}</td>
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
                                    <td colSpan="8" style={{ textAlign: "center" }}>No agents yet.</td>
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

export default ViewAgents;
