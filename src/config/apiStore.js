import axios from "axios";
export const API_URL =process.env.REACT_APP_API_URL
export const RETELL_API_URL =  process.env.REACT_APP_RETELL_API_URL
export const RETELL_API_KEY = process.env.REACT_APP_RETELL_API_KEY
const TOKEN = localStorage.getItem("token");
const getAuthHeaders = () => {

    return {
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        },
    };
};
const getRetellAuthHeaders = () => {
    return {
        headers: {
            Authorization: `Bearer ${RETELL_API_KEY}`,
        },
    };
};
export const createRole = async (roleData) => {
    try {
        const response = await axios.post(`${API_URL}admin/addRole`, roleData);
        return response.data;
    } catch (error) {
        console.error('Error creating role:', error);
        throw error;
    }
};
export const retrieveRoleById = async (id) => {
    return await axios.get(`${API_URL}admin/getRole/${id}`, getAuthHeaders()).then((res) => res.data);
};
export const retrieveAllRoles = async () => {
    try {
        const response = await fetch(`${API_URL}admin/getRole`, getAuthHeaders());
        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};
export const addNewUser = async (newUser) => {
    try {
        const response = await axios.post(`${API_URL}admin/register`, newUser);
        return response;
    } catch (error) {
        if (error.response) {
            return error.response;
        } else {

            return { data: { msg: "Something went wrong" } };
        }
    }
};
export const retrieveAllUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}admin/retrieveAllUsers`, getAuthHeaders());
        return response;
    } catch (error) {
        if (error.response) {
            return error.response;
        } else {

            return { data: { msg: "Something went wrong" } };
        }
    }
}
export const deleteUser = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}admin/deleteUser/${id}`)
        return response;


    } catch (error) {
        if (error.response) {
            return error.response;
        } else {

            return { data: { msg: "Something went wrong" } };
        }
    }
}
export const retrieveAllRegisteredUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}endusers/getAllUsers`, getAuthHeaders());
        
        return response.data.users;
    } catch (error) {
        if (error.response) {
            return error.response;
        } else {

            return { data: { msg: "Something went wrong" } };
        }
    }
}

export const fetchListVoice = async () => {
    try {
        const response = await axios.get(`${RETELL_API_URL}/list-voices`, getRetellAuthHeaders());
        return response;
    } catch (error) {
        if (error.response) {
            return error.response;
        } else {
            return { data: { msg: "Something went wrong" } };
        }
    }
};

export const fetchAgents = async () => {
    try {
        const [agentsResponse, voicesResponse] = await Promise.all([
            axios.get(`${RETELL_API_URL}/list-agents`, getRetellAuthHeaders()),
            axios.get(`${RETELL_API_URL}/list-voices`, getRetellAuthHeaders())
        ]);

        const agents = agentsResponse.data || [];
        const voices = voicesResponse.data || [];

        // Fetch LLM details for all unique llm_ids (avoid duplicate API calls)
        const uniqueLlmIds = [
            ...new Set(
                agents.map(agent => agent?.response_engine?.llm_id).filter(Boolean)
            )
        ];

        const llmDetailsMap = {};

        await Promise.all(
            uniqueLlmIds.map(async (llm_id) => {
                try {
                    const llmRes = await axios.get(`${RETELL_API_URL}/get-retell-llm/${llm_id}`, getRetellAuthHeaders());
                    llmDetailsMap[llm_id] = llmRes.data;
                } catch (err) {
                    llmDetailsMap[llm_id] = null;
                }
            })
        );

        // Enrich agents with voice and llm details
        const enrichedAgents = agents.map(agent => {
            const matchedVoice = voices.find(voice => voice.voice_id === agent.voice_id);
            const llm_id = agent?.response_engine?.llm_id;
            const llmDetails = llm_id ? llmDetailsMap[llm_id] : null;



            // check if appointment_booking state exists inside llmDetails.states safely
            const hasAppointmentBooking = Array.isArray(llmDetails?.states)
                ? llmDetails.states.some(state => state?.name === 'appointment_booking')
                : false;
            const agent_type = hasAppointmentBooking ? "Multi Prompt" : "Single Prompt";
            return {
                ...agent,
                voice_name: matchedVoice?.voice_name || null,
                avatar_url: matchedVoice?.avatar_url || null,
                llm_details: llmDetails || null,
                agent_type
            };
        });
        console.log(enrichedAgents)
        return { data: enrichedAgents };
    } catch (error) {
        if (error.response) {
            return error.response;
        } else {
            return { data: { msg: "Something went wrong" } };
        }
    }
};

