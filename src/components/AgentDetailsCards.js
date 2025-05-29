import React from 'react';
import styles from '../css/AgentDetails.module.css';

function AgentDetailsCards({ data }) {
    let url = process.env.REACT_BASE_URL || "https://rexptinx-admin-panel.vercel.app/"
    console.log({data})
  return (
    <div className={styles.container}>
      {data?.map((agent) => (
        <div key={agent.agent_id} className={styles.card}>
          <div className={styles.header}>
            <img src={`${url}/${agent.avatar}`} alt="Avatar" className={styles.avatar} />
            <div>
              <h2>{agent.agentName}</h2>
              <p className={styles.role}>{agent.agentRole}</p>
            </div>
          </div>

          <div className={styles.details}>
            <p><strong>Voice:</strong> {agent.agentVoice}</p>
            <p><strong>Accent:</strong> {agent.agentAccent}</p>
            <p><strong>Language:</strong> {agent.agentLanguage} ({agent.agentLanguageCode})</p>
            <p><strong>Gender:</strong> {agent.agentGender}</p>
            <p><strong>Plan:</strong> {agent.agentPlan}</p>
            <p><strong>Status:</strong> {agent.agentStatus ? 'Active' : 'Inactive'}</p>
            <p><strong>Mins Left:</strong> {agent.mins_left}</p>
            <p><strong>Created At:</strong> {new Date(agent.createdAt).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AgentDetailsCards;
