import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import style from '../css/AgentDetails.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from 'sweetalert2';
import styles from '../css/ViewRole.module.css';
import { GrView } from "react-icons/gr";
import Loader from '../components/Loader';
import { useSidebarPermissions } from '../context/AccessControlContext';
function AgentDetails() {
  const { userId } = useParams();
  const [agents, setAgents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAgents, setFilteredAgents] = useState([]);
  const { rolePermissions } = useSidebarPermissions();
  const canView = rolePermissions?.Users?.view;

  console.log(agents, "agents")
  const itemsPerPage = 7;
  const navigate = useNavigate();
  console.log(`${process.env.REACT_APP_IMAGE_URL}`)
  const getAgents = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.REACT_APP_API_URL}agent/getAgentBasedUser/${userId}`);
      const agentsData = res.data.agents || [];
      setAgents(agentsData);
      setFilteredAgents(agentsData); // Initialize filtered list
      setTotalCount(res.data.totalCount || 0);
      setError('');
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError('No agent found');
      setAgents([]);
      setFilteredAgents([]);
      setTotalCount(0);
    }
  };


  useEffect(() => {
    getAgents();
  }, [userId]);
  useEffect(() => {
    const filtered = agents.filter(agent =>
      (agent.agentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (agent.agent_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (agent.agentRole || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredAgents(filtered);
  }, [searchQuery, agents]);


  const handleDeleteAgent = async (agentId) => {
    const result = await Swal.fire({
      title: 'What do you want to do?',
      text: "You can either delete or deactivate this agent.",
      icon: 'warning',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Delete',
      denyButtonText: 'Deactivate',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      denyButtonColor: '#f0ad4e',
      cancelButtonColor: '#3085d6',
    });

    if (result.isConfirmed) {
      // Delete logic
      try {
        setLoading(true)
        await axios.delete(`${process.env.REACT_APP_API_URL}agent/AgentDelete/hard/${agentId}`);
        setLoading(false)
        Swal.fire('Deleted!', 'Agent has been deleted.', 'success');
        getAgents();
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire('Error', 'Failed to delete the agent.', 'error');
      }
    } else if (result.isDenied) {
      // Deactivate logic
      try {
        setLoading(true)
        await axios.delete(`${process.env.REACT_APP_API_URL}agent/delete-user-agent/${agentId}`);
        setLoading(false)
        Swal.fire('Deactivated!', 'Agent has been deactivated.', 'success');
        getAgents();
      } catch (error) {
        console.error("Deactivation failed:", error);
        Swal.fire('Error', 'Failed to deactivate the agent.', 'error');
      }
    }
  };




  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAgents = filteredAgents.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);


  const truncateName = (name) => {
    if (!name) return '';
    return name.length > 15 ? name.substring(0, 15) + '...' : name;
  };

  return (
    <Layout>
      <div className={style.agentpage}>


        <div className={style.header}>
          {/* <button
    onClick={() => navigate(-1)}
    className={style.backBtn}
  >
    ←
  </button> */}
          <h2>Agents Details ({totalCount})</h2>
        </div>

        <div className={style.inputGroup}>
          <input
            type="text"
            placeholder="Search by name, ID, or role..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className={style.inputsearch}
          />
        </div>


        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '9rem' }}>
            <Loader />
          </div>
        ) : (
          <>
            {filteredAgents.length === 0 ? (
                 <div style={{background:'white',height:'300px',width:'100%',boxShadow: "inherit",display:'flex',justifyContent:'center'}}>  <p style={{ color: '#004680', textAlign: 'center', marginTop: '9rem', fontSize: '30px', fontWeight: '600' }}>
                No agent found
              </p></div>
            ) : (
              <>
                <table className={style.agentTable}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Avatar</th>
                      <th>Agent ID</th>
                      <th>Agent Name</th>
                      <th>Role</th>
                      <th>Plan</th>
                      <th>Status</th>
                      <th>Mins Left</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAgents.map((agent, index) => (
                      <tr key={agent.agent_id}>
                        <td>{startIndex + index + 1}</td>
                        <td>
                          <img
                            src={agent.avatar ? `${process.env.REACT_APP_IMAGE_URL}/${agent.avatar}` : '/images/default-image.png'}
                            alt="Avatar"
                            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                          />
                        </td>{
                          console.log(process.env.REACT_APP_IMAGE_URL)
                        }
                        <td>{agent.agent_id}</td>
                        <td title={agent.agentName}>{truncateName(agent.agentName)}</td>
                        <td>{agent.agentRole}</td>
                        <td>{agent.agentPlan}</td>
                        <td style={{ color: agent.agentStatus ? 'green' : 'red', fontWeight: 'bold' }}>
                          {agent.agentStatus ? 'Active' : 'Deactivated'}
                        </td>
                        <td>{Math.floor(agent.mins_left / 60)}</td>
                        <td>
                          <div className={styles.tdBtn}>
                            {(agent.agentPlan === 'free' &&
                              ((new Date() - new Date(agent.createdAt)) / (1000 * 60 * 60 * 24) <= 2) &&
                              (((1200 - agent.mins_left) / 1200) * 100 < 5)) ? (
                              <FaTrash
                                size={23}
                                color="black"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleDeleteAgent(agent.agent_id)}
                              />
                            ) : '-'}

                            {canView && (

                              <GrView
                                onClick={() => navigate(`/view-prompt-agent-details/${agent.llmId}`)}
                                size={23}
                                color="black"
                                title="View Prompt"

                              />

                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                {filteredAgents.length > 0 && (
                  <div className={style.pagination}>
                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                      Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                      Next
                    </button>
                  </div>
                )}

              </>
            )}
          </>
        )}

      </div>
    </Layout>
  );
}

export default AgentDetails;










