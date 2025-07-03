import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import style from '../css/AgentDetails.module.css';
import Swal from 'sweetalert2'; 
function PromptsDetails() {
    const { llmId } = useParams();
    const [generalPrompt, setGeneralPrompt] = useState('');
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPrompt = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}agent/llmprompt/fetch/${llmId}`);
                const fetchedPrompt = res.data?.prompt;

                if (fetchedPrompt && typeof fetchedPrompt === 'object') {
                    setGeneralPrompt(fetchedPrompt.general_prompt || '');
                } else {
                    setErrorMsg('No valid general prompt found.');
                }
            } catch (err) {
                console.error('Fetch error:', err);
                setErrorMsg('Failed to fetch prompt.');
            } finally {
                setLoading(false);
            }
        };

        fetchPrompt();
    }, [llmId]);

    const handleUpdate = async () => {
        if (!llmId || !generalPrompt || typeof generalPrompt !== 'string') {
            Swal.fire('Error', 'Prompt is empty or invalid.', 'error');
            return;
        }

        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to update the prompt?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#004680',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!',
        });

        if (!confirm.isConfirmed) return;

        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}agent/llmprompt/update/${llmId}`,
                {
                    llmId,
                    prompt: generalPrompt,
                }
            );

            Swal.fire('Updated!', 'Prompt updated successfully.', 'success');
        } catch (error) {
            console.error("Update error:", error?.response?.data || error.message);
            Swal.fire(
                'Error!',
                error?.response?.data?.details?.error_message || 'Something went wrong.',
                'error'
            );
        }
    };

    return (
        <Layout>
            <div className={style.agentpage}>
                <div className={style.header}>
                    <h2>Prompt Details</h2>
                </div>

                {loading ? (
                    <p style={{ textAlign: 'center', fontSize: '18px' }}>Loading...</p>
                ) : (
                    <div
                        style={{
                            backgroundColor: '#ffffff',
                            padding: '1rem',
                            borderRadius: '10px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            maxWidth: '1000px',
                            margin: '1rem auto 0',
                        }}
                    >


                        {/* Back Button */}
                        <div style={{ marginBottom: '1rem' }}>
                            <button
                                onClick={() => navigate(-1)}
                                style={{
                                    backgroundColor: '#ccc',
                                    color: '#333',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '5px',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                }}
                            >
                                ← Back
                            </button>
                        </div>
                        <h3 style={{ marginBottom: '1rem', color: '#004680' }}>General Prompt</h3>

                        <textarea
                            value={generalPrompt}
                            onChange={(e) => setGeneralPrompt(e.target.value)}
                            style={{
                                width: '100%',
                                minHeight: '300px',
                                padding: '1rem',
                                fontSize: '16px',
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                resize: 'vertical',
                                backgroundColor: '#f9f9f9',
                            }}
                        />

                        {errorMsg && (
                            <p style={{ color: 'red', marginTop: '1rem' }}>{errorMsg}</p>
                        )}

                        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                            <button
                                onClick={handleUpdate}
                                style={{
                                    backgroundColor: '#004680',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                }}
                            >
                                Update Prompt
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default PromptsDetails;
