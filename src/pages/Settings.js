import React, { useEffect, useState } from 'react';
import styles from '../css/Settings.module.css';
import axios from 'axios';
import { API_URL } from '../config/apiStore';
import decodeToken from '../utils/decodeToken';
const Settings = () => {
    const [apolloKey, setApolloKey] = useState('');
    const [retellKey, setRetellKey] = useState('');
    const [verifiedNumber, setVerifiedNumber] = useState('');
    const [agentId, setAgentId] = useState('');

    const [savedApolloKey, setSavedApolloKey] = useState('');
    const [savedRetellKey, setSavedRetellKey] = useState('');
    const [savedVerifiedNumber, setSavedVerifiedNumber] = useState('');
    const [savedAgentId, setSavedAgentId] = useState('');

    const [showApollo, setShowApollo] = useState(false);
    const [showRetell, setShowRetell] = useState(false);
    const [showVerifiedNumber, setShowVerifiedNumber] = useState(false);
    const [showAgentId, setShowAgentId] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!apolloKey || !retellKey || !verifiedNumber || !agentId) {
            alert('All fields are required!');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('No token found, please login again.');
                return;
            }

            const decodedToken = decodeToken(token);
            const userId = decodedToken.user.id;

            await axios.post(
                `${API_URL}api/settings/save`,
                { apolloKey, retellKey, userId, verifiedNumber, agent_id: agentId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert('Settings saved successfully!');
            setSavedApolloKey(apolloKey);
            setSavedRetellKey(retellKey);
            setSavedVerifiedNumber(verifiedNumber);
            setSavedAgentId(agentId);

            setApolloKey('');
            setRetellKey('');
            setVerifiedNumber('');
            setAgentId('');
        } catch (err) {
            alert('Error saving settings.');
            console.error(err);
        }
    };

    const fetchSavedKeys = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const decodedToken = decodeToken(token);
        const userId = decodedToken.user.id;

        try {
            const response = await axios.get(`${API_URL}api/settings/get/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = response.data;
            setSavedApolloKey(data.apolloKey || '');
            setSavedRetellKey(data.retellKey || '');
            setSavedVerifiedNumber(data.verifiedNumber || '');
            setSavedAgentId(data.agent_id || '');
        } catch (err) {
            console.error('Error fetching keys:', err);
        }
    };

    useEffect(() => {
        fetchSavedKeys();
    }, []);

    return (
        <div className={styles.settings}>
            <h2 className={styles.heading}>API Key Settings</h2>
            <div className={styles.container}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Apollo API Key:</label>
                        <input
                            type="text"
                            value={apolloKey}
                            onChange={(e) => setApolloKey(e.target.value)}
                            placeholder="Enter Apollo API Key"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Retell API Key:</label>
                        <input
                            type="text"
                            value={retellKey}
                            onChange={(e) => setRetellKey(e.target.value)}
                            placeholder="Enter Retell API Key"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Verified Number:</label>
                        <input
                            type="text"
                            value={verifiedNumber}
                            onChange={(e) => setVerifiedNumber(e.target.value)}
                            placeholder="Enter Verified Number"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Agent Id:</label>
                        <input
                            type="text"
                            value={agentId}
                            onChange={(e) => setAgentId(e.target.value)}
                            placeholder="Enter Agent Id"
                        />
                    </div>
                    <button type="submit" className={styles.saveButton}>Save</button>
                </form>

                <div className={styles.viewSection}>
                    <h3>Saved Details</h3>
                    <div className={styles.viewRow}>
                        <strong>Apollo API Key:</strong>
                        <span>{showApollo ? savedApolloKey : '•'.repeat(savedApolloKey.length)}</span>
                        <button onClick={() => setShowApollo(!showApollo)}>
                            {showApollo ? 'Hide' : 'View'}
                        </button>
                    </div>
                    <div className={styles.viewRow}>
                        <strong>Retell API Key:</strong>
                        <span>{showRetell ? savedRetellKey : '•'.repeat(savedRetellKey.length)}</span>
                        <button onClick={() => setShowRetell(!showRetell)}>
                            {showRetell ? 'Hide' : 'View'}
                        </button>
                    </div>
                    <div className={styles.viewRow}>
                        <strong>Verified Number:</strong>
                        <span>{showVerifiedNumber ? savedVerifiedNumber : '•'.repeat(savedVerifiedNumber.length)}</span>
                        <button onClick={() => setShowVerifiedNumber(!showVerifiedNumber)}>
                            {showVerifiedNumber ? 'Hide' : 'View'}
                        </button>
                    </div>
                    <div className={styles.viewRow}>
                        <strong>Agent Id:</strong>
                        <span>{showAgentId ? savedAgentId : '•'.repeat(savedAgentId.length)}</span>
                        <button onClick={() => setShowAgentId(!showAgentId)}>
                            {showAgentId ? 'Hide' : 'View'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
