import React, { useEffect, useState } from 'react';
import styles from '../css/ViewRole.module.css';
import axios from 'axios';
import { API_URL, deleteUser, retrieveAllUsers } from '../config/apiStore';
import decodeToken from '../utils/decodeToken';
import Modal from '../Modal/Modal';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from 'sweetalert2';
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
    const [editingUser, setEditingUser] = useState(null);
const [editFormData, setEditFormData] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '' });

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


   const filteredTasks = Array.isArray(roleData)
  ? roleData?.filter(task =>
      task.email.toLowerCase().includes(searchQuery.trim().toLowerCase())
    )
  : [];



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
   const handleDeleteUsers = async (id) => {
  try {
    const response = await deleteUser(id);
    console.log(response.data);
    Swal.fire("User deleted Successfully")
    fetchUsers(); // Refresh list
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

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

                                           {canEdit && (
  <FaEdit
    size={23}
    color="black"
    style={{ cursor: 'pointer', marginRight: '10px' }}
    onClick={() => {
      setEditingUser(task.id); // or task.userId
      setEditFormData({
        firstName: task.firstName || '',
        lastName: task.lastName || '',
        email: task.email || '',
        phoneNumber: task.phoneNumber || '',
        password:task.password || ''
      });
      setShowModal(true);
    }}
  />
)}


                                             {canDelete && (
  <FaTrash
    size={23}
    color="black"
    style={{ cursor: 'pointer' }}
    onClick={() => handleDeleteUsers(task.id)}
  />
)}


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
                <Modal isOpen={showModal} onClose={() => setShowModal(false)} width="400px">
  <h3>Edit User</h3>
  <form
    onSubmit={async (e) => {
      e.preventDefault();
      try {
        await axios.put(`${API_URL}admin/updateadminUser/${editingUser}`, editFormData);
        setShowModal(false);
        Swal.fire("User updated Successfully")
        setEditingUser(null);
        setEditFormData({ firstName: '', lastName: '', email: '', phoneNumber: '',password:'' });
        fetchUsers();
      } catch (err) {
        console.error("Update failed:", err);
      }
    }}
  >
    <div style={{ marginBottom: '10px' }}>
      <label>First Name:</label><br />
      <input
        type="text"
        value={editFormData.firstName}
        onChange={(e) => setEditFormData({ ...editFormData, firstName: e.target.value })}
        style={{ width: '100%' }}
      />
    </div>
    <div style={{ marginBottom: '10px' }}>
      <label>Last Name:</label><br />
      <input
        type="text"
        value={editFormData.lastName}
        onChange={(e) => setEditFormData({ ...editFormData, lastName: e.target.value })}
        style={{ width: '100%' }}
      />
    </div>
    <div style={{ marginBottom: '10px' }}>
      <label>Email:</label><br />
      <input
        type="email"
        value={editFormData.email}
        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
        style={{ width: '100%' }}
      />
    </div>
    <div style={{ marginBottom: '10px' }}>
      <label>Phone Number:</label><br />
      <input
        type="text"
        value={editFormData.phoneNumber}
        onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
        style={{ width: '100%' }}
      />
    </div><div style={{ marginBottom: '10px' }}>
      <label>Email:</label><br />
      <input
        type="email"
        value={editFormData.email}
        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
        style={{ width: '100%' }}
      />
    </div>
    <button type="submit" style={{ padding: '6px 15px' }}>Update</button>
  </form>
</Modal>

            </div>


        </>
    );
};

export default ViewUsers;
