import React, { useEffect, useState } from 'react';
import styles from '../css/BatchCall.module.css';
import axios from 'axios';
import { API_URL } from '../config/apiStore';
import decodeToken from '../utils/decodeToken';
import Modal from '../Modal/Modal';
import Loader from '../components/Loader';

const BatchCall = () => {
    const [selectedTask, setSelectedTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const [taskData, setTaskData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTasks, setSelectedTasks] = useState([]);
    const token = localStorage.getItem('token');
    const decodedToken = decodeToken(token);
    const userId = decodedToken.user.id;

    const fetchTask = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}api/tasks/get?user_id=${userId}`);
            setTaskData(response.data.tasks.tasks);
            console.log(response)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchTask();
    };

    const handleOpenModal = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const handleBatchCall = async (tasks = selectedTasks) => {
        if (tasks.length === 0) return;
        console.log(tasks)
        const numbersToCall = tasks.map(task => {

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
    const filteredTasks = taskData?.filter(task =>
        task.title.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        task.contact.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
    );

    const handleCheckboxChange = (taskId) => {
        setSelectedTasks(prevSelected =>
            prevSelected.includes(taskId)
                ? prevSelected.filter(id => id !== taskId)
                : [...prevSelected, taskId]
        );
    };

    const isAllSelected = filteredTasks.length > 0 && selectedTasks.length === filteredTasks.length;

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedTasks([]);
        } else {
            const allIds = filteredTasks
                .filter(task => task && task.id)
                .map(task => task.id);
            setSelectedTasks(allIds);
        }
    };


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
    const campings = async () => {
        try {
            const campaigns = await axios.get(`${API_URL}api/tasks/getCampaigns`);
            console.log(campaigns)
        } catch (error) {

        }
    }
    useEffect(() => {
        fetchTask();
        campings()
    }, []);

    return (
        <>
            <div className={styles.batchCall}>
                <h2>Tasks</h2>
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
                        {selectedTasks.length > 0 && (
                            <button className={styles.allBatchButton} onClick={() => handleBatchCall()}>
                                All Batch Call
                            </button>
                        )}
                    </div>

                    <table className={styles.taskTable}>
                        <thead>
                            <tr>

                                <th></th>
                                <th>Account ID</th>
                                <th>Title</th>
                                <th>Name</th>
                                <th>Priority</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr >
                                    <td colSpan="8" style={{ textAlign: "center" }}><Loader /></td>
                                </tr>
                            ) : currentTasks.length > 0 ? (
                                currentTasks.map((task) => (
                                    <tr key={task.id}
                                        className={selectedTasks.some(t => t.id === task.id) ? styles.selectedRow : ''} onClick={() => handleCheckboxChange(task)} >
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedTasks.some(t => t.id === task.id)}
                                                onChange={() => handleCheckboxChange(task)}
                                            />
                                        </td>
                                        <td>{task.account_id}</td>
                                        <td>{task.title}</td>
                                        <td>{task.contact.name}</td>
                                        <td>{task.priority}</td>
                                        <td>{task.type}</td>
                                        <td className={
                                            task.status === "scheduled"
                                                ? styles.scheduled
                                                : task.status === "completed"
                                                    ? styles.completed
                                                    : task.status === "archived"
                                                        ? styles.archived
                                                        : ""
                                        }>
                                            {task.status.toUpperCase()}
                                        </td>
                                        <td>
                                            <div className={styles.viewRefreshButtonDiv}>
                                                <button onClick={() => handleOpenModal(task)}>View</button>
                                                <button onClick={() => handleBatchCall([task])}>Batch Call</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>No tasks yet.</td>
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

            {showModal && selectedTask && (
                <Modal isOpen={showModal} onClose={() => setShowModal(false)} height='70vh' width='100vh'>
                    <div className="modalContent">
                        <h1>Account Details</h1>
                        <h2>{selectedTask.account?.name}</h2>
                        <p><strong>Organization Id:</strong> {selectedTask.account?.organization_id}</p>
                        <p><strong>Rwa Address:</strong> {selectedTask.account?.raw_address}</p>
                        <h1>Contact Details</h1>
                        <h2>{selectedTask.contact?.email}</h2>
                        <p><strong>Name:</strong> {selectedTask.contact?.name}</p>
                        <p><strong>Status:</strong> {selectedTask.status}</p>
                        <p><strong>Title:</strong> {selectedTask.title}</p>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default BatchCall;
