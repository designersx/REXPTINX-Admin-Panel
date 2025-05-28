import React, { useEffect, useState } from 'react';
import styles from '../css/ViewRole.module.css';
import axios from 'axios';
import { API_URL, retrieveRoleById } from '../config/apiStore';
import decodeToken from '../utils/decodeToken';
import Modal from '../Modal/Modal';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { useSidebarPermissions } from '../context/AccessControlContext';
const ViewRole = () => {
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
    const navigate = useNavigate()
    const { rolePermissions } = useSidebarPermissions();
   
    const canCreate = rolePermissions?.Users?.create;
    const canEdit = rolePermissions?.Users?.edit;
    const canDelete = rolePermissions?.Users?.delete;
    const canView = rolePermissions?.Users?.view;
    const fetchRole = async () => {
        try {
            setLoading(true);
            const response = await retrieveRoleById(userId);
            setRoleData(response.data);
            console.log(response)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    const handleRefresh = () => {
        fetchRole();
    };
    const handleOpenModal = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };
    const handleBatchCall = async (tasks = selectedTasks) => {
        if (tasks.length === 0) return;
        console.log(tasks)
        const numbersToCall = tasks.map(task => {
            // Extracting the titles from employment history
            const servicesOffered = task.contact.employment_history.map(job => job.title);
            const latestCampaign = task.contact.contact_campaign_statuses
                .sort((a, b) => new Date(b.added_at) - new Date(a.added_at))[0];

            const latestEmailerCampaignId = [latestCampaign?.emailer_campaign_id] || null;
            return {
                name: task.contact.name,
                designationOfUser: task.contact.title,
                companyName: task.account?.name || '',
                serviceOffered: servicesOffered,
                number: task.contact.phone_numbers[0].sanitized_number,
                email: task.contact.email || '',
                emailer_campaign_id: latestEmailerCampaignId
            };
        });


        console.log(numbersToCall, "Calling these numbers");
        try {
            setLoading(true);
            await axios.post(`${API_URL}api/tasks/post?user_id=${userId}`, {
                to_number: numbersToCall,
            });
            // alert('Batch call started!');
        } catch (error) {
            console.error('Batch call error', error);
        } finally {
            setLoading(false);
        }
    };
    const filteredTasks = roleData.filter(task =>
        task.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );
    const handleCheckboxChange = (taskId) => {
        setSelectedTasks(prevSelected =>
            prevSelected.includes(taskId)
                ? prevSelected.filter(id => id !== taskId)
                : [...prevSelected, taskId]
        );
    };
    const isAllSelected = filteredTasks.length > 0 && selectedTasks.length === filteredTasks.length;
    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };
    //add role
    const handleAddRole = () => {
        navigate("/dashboard/addRole")
    }
    useEffect(() => {
        fetchRole()
    }, [])
    return (
        <>
            <div className={styles.batchCall}>
                <h2>Roles</h2>
                <div className={styles.taskList}>
                    <div className={styles.searchDiv}>
                        <input
                            type="text"
                            placeholder="Search by title or name"
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
                            Add role
                        </button>
                        {/* } */}

                    </div>

                    <table className={styles.taskTable}>
                        <thead>
                            <tr>



                                <th>Title</th>
                                <th>Description</th>
                                <th>Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr >
                                    <td colSpan="8" style={{ textAlign: "center" }}><Loader /></td>
                                </tr>
                            ) : currentTasks.length > 0 ? (
                                currentTasks.map((task) => (
                                    <tr key={task.id}>


                                        <td>{task.title}</td>
                                        <td>{task.discription || "NA"}</td>
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
                                    <td colSpan="8" style={{ textAlign: "center" }}>No roles yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {filteredTasks.length > 0 && (
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

export default ViewRole;
