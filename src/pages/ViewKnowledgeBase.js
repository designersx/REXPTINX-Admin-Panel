import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import style from '../css/AgentDetails.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from 'sweetalert2';
import Loader from '../components/Loader';

function ViewKnowledgeBase() {
  const { userId } = useParams();
  const [agents, setAgents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
const [filteredAgents, setFilteredAgents] = useState([]);

  const itemsPerPage = 7;
  const navigate = useNavigate();
console.log(`${process.env.REACT_BASE_URL}`)
 const getAgents = async () => {
  try {
    setLoading(true);
    const res = await axios.get(`${process.env.REACT_APP_API_URL}agent/getKnowledgeBaseBasedUser/${userId}`);
    const agentsData = res.data.agents || [];
    setAgents(agentsData);
    setFilteredAgents(agentsData); // Initialize filtered list
   setTotalCount(agentsData.length);

    setError('');
    setLoading(false);
  } catch (err) {
    console.error(err);
    setLoading(false);
    setError('No Knowledge base found');
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


const handleDeleteAgent = async (knowledgeBaseId) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to delete this Knowledge Base?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Delete',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
  });

  if (result.isConfirmed) {
    try {
      setLoading(true);
      await axios.delete(`${process.env.REACT_APP_API_URL}/agent/inactiveknowledegeBase/${knowledgeBaseId}`);
      setLoading(false);
      Swal.fire('Deleted!', 'Knowledge base has been deleted.', 'success');
      getAgents(); // Refresh the list
    } catch (error) {
      console.error("Deletion failed:", error);
      setLoading(false);
      Swal.fire('Error', 'Failed to delete the knowledge base.', 'error');
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
  const parseService = (services) => {
  if (!services) return [];
  try {
    return typeof services === 'string' ? JSON.parse(services) : services;
  } catch (err) {
    console.error("Error parsing BusinessService:", err);
    return [];
  }
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
  <h2>Knowledge Base Details ({totalCount})</h2>
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
     <div style={{background:'white',height:'300px',width:'100%',boxShadow: "inherit",display:'flex',justifyContent:'center'}}> <p style={{ color: '#004680', textAlign: 'center', marginTop: '9rem', fontSize: '30px', fontWeight: '600' }}></p> <p style={{ color: '#004680', textAlign: 'center', marginTop: '9rem', fontSize: '30px', fontWeight: '600' }}>
        No Knowledge base found
      </p></div>
    ) : (
      <>
        <table className={style.agentTable}>
         <thead>
  <tr>
    <th>#</th>
    <th>Knowledge Base</th>
    <th>Agent Name</th>
    <th>Agent ID</th>
     <th>Business Name</th>
    <th>Type</th>
    <th>Size</th>
    <th>Service</th>
    <th>Website</th>
    <th>Status</th>
    <th>Actions</th>
  </tr>
</thead>
<tbody>
  {paginatedAgents.map((agent, index) => (
    <tr key={agent.agent_id}>
      <td>{startIndex + index + 1}</td>

      {/* Knowledge Base Name */}
      <td>
        {agent.businessDetails?.knowledgeBaseName
          ? agent.businessDetails.knowledgeBaseName
          : <span style={{ color: '#999' }}>N/A</span>}
      </td>

      {/* Agent Name */}
      <td title={agent.agentName}>
        {truncateName(agent.agentName)}
      </td>

      {/* Agent ID */}
      <td>{agent.agent_id}</td> {/* Business Name */}
      <td>{agent.businessDetails?.name || 'N/A'}</td>

      {/* Business Type */}
      <td>{agent.businessDetails?.BusinessType || 'N/A'}</td>

      {/* Business Size */}
      <td>{agent.businessDetails?.BusinessSize || 'N/A'}</td>

      {/* Business Service */}
      <td title={parseService(agent.businessDetails?.BusinessService).join(', ') || 'N/A'}>
  {parseService(agent.businessDetails?.BusinessService).length > 0
    ? parseService(agent.businessDetails?.BusinessService).slice(0, 2).join(', ') +
      (parseService(agent.businessDetails?.BusinessService).length > 2 ? '...' : '')
    : 'N/A'}
</td>


      {/* Business Website */}
      <td title={agent.businessDetails?.BusinesswebUrl || 'N/A'}>
 {agent.businessDetails?.BusinesswebUrl ? (
  <a
    href={agent.businessDetails.BusinesswebUrl}
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: '#007bff', textDecoration: 'underline' }}
  >
    {agent.businessDetails.BusinesswebUrl.length > 25
      ? agent.businessDetails.BusinesswebUrl.substring(0, 25) + '...'
      : agent.businessDetails.BusinesswebUrl}
  </a>
) : (
  'N/A'
)}

</td>
<td>
   {agent.businessDetails?.knowledgeBaseStatus === null || agent.businessDetails?.knowledgeBaseStatus === undefined
  ? "N/A"
  : agent.businessDetails.knowledgeBaseStatus === true
  ? "Active"
  : "Inactive"}

</td>


      {/* Action Buttons */}
      <td>
      <FaTrash
  size={23}
  color="black"
  title="Delete Knowledge Base"
  style={{ cursor: 'pointer' }}
  onClick={() => handleDeleteAgent(agent.knowledgeBaseId)}
/>

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

export default ViewKnowledgeBase;










