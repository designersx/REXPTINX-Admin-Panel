import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../css/AddRole.module.css"
// import { createRole } from "../lib/api";
// import "../styles/createRoles.css";
import useRolePermissions from "../hooks/userRolePermission";
import { IoArrowBack } from "react-icons/io5";
import { createRole } from "../config/apiStore";
import decodeToken from "../utils/decodeToken";
import PopUp from "../components/Popup";
import Loader from "../components/Loader";
const rolePermissionLevels = {
    "superAdmin": 1,
    "admin": 2,
    "user": 3,

};
const AddRole = () => {
    const [title, setTitle] = useState("");
    const [description, setDesc] = useState("");
    const [permissions, setPermissions] = useState({});
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState(null);
    const [popupMessage, setPopupMessage] = useState("");
  const { rolePermissions } = useRolePermissions(24);

    const navigate = useNavigate();
    // const { rolePermissions } = useRolePermissions(24);
    const inputRef = useRef(null);
    const suggestionBoxRef = useRef(null);
    const [isLoading, setLoading] = useState(false);
    // const userRole = userData?.user?.userRole || "";
    // const userPermissionLevel = rolePermissionLevels[userRole] || 5;
    const token = localStorage.getItem('token');
    // if (!token) return;

    const decodedToken = decodeToken(token);
    const userId = decodedToken.user.id;
    // const availableRoles = predefinedRoles.filter(
    //     (role) => rolePermissionLevels[role] > userPermissionLevel
    // );
    const availableRoles = ["SUPERADMIN", "ADMIN", "USER"];


    const modules = [
        "Setting",
        "Task",
        "Roles",
        "Users"
    ];

    const actions = ["create", "delete", "view", "edit", "fullAccess"];

    useEffect(() => {
        if (rolePermissions) {
            const formattedPermissions = {};
            modules.forEach((module) => {
                const formattedModule = module.replace(/\s+/g, "");
                formattedPermissions[formattedModule] = {};

                actions.forEach((action) => {
                    formattedPermissions[formattedModule][action] =
                        rolePermissions[module]?.[action.charAt(0).toUpperCase() + action.slice(1)] || false;
                });
            });

            setPermissions(formattedPermissions);
        }
    }, [rolePermissions]);

    // useEffect(() => {
    //     function handleClickOutside(event) {
    //         if (
    //             suggestionBoxRef.current &&
    //             !suggestionBoxRef.current.contains(event.target) &&
    //             inputRef.current !== event.target
    //         ) {
    //             setDropdownOpen(false);
    //         }
    //     }
    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => {
    //         document.removeEventListener("mousedown", handleClickOutside);
    //     };
    // }, []);



    const selectSuggestion = (role) => {
        setTitle(role);
        setDropdownOpen(false);
    };


    const handleCheckboxChange = (module, action) => {
        const formattedModule = module.replace(/\s+/g, "");

        setPermissions((prev) => {
            let newPermissions = {
                ...prev,
                [formattedModule]: {
                    ...prev[formattedModule],
                    [action]: !prev[formattedModule]?.[action],
                },
            };

            const updatedValue = !prev[formattedModule]?.[action];

            // If "create" is checked, auto-check delete & view
            if (action === "create" && updatedValue) {
                newPermissions[formattedModule]["delete"] = true;
                newPermissions[formattedModule]["view"] = true;
            }

            // If "edit" is checked, auto-check delete & view
            if (action === "edit" && updatedValue) {
                newPermissions[formattedModule]["delete"] = true;
                newPermissions[formattedModule]["view"] = true;
            }

            // If "delete" is checked, auto-check view
            if (action === "delete" && updatedValue) {
                newPermissions[formattedModule]["view"] = true;
            }

            // If full Access is manually checked, check everything
            if (action === "fullAccess" && updatedValue) {
                // Check all actions for this module
                actions.forEach((act) => {
                    newPermissions[formattedModule][act] = true;
                });
            }

            // If full Access is manually unchecked, uncheck everything
            if (action === "fullAccess" && !updatedValue) {
                // Uncheck all actions for this module
                actions.forEach((act) => {
                    newPermissions[formattedModule][act] = false;
                });
            }

            // Auto-manage full Access if all basic actions are true
            const allBasicChecked = actions
                .filter((a) => a !== "fullAccess")
                .every((a) => newPermissions[formattedModule]?.[a]);

            newPermissions[formattedModule]["fullAccess"] = allBasicChecked;

            return newPermissions;
        });
    };


    const handleSubmit = async () => {
        if (!title.trim()) {
            setPopupType("failed");
            setPopupMessage("Please enter a role title before saving!");
            setShowPopup(false);
            setTimeout(() => {
                setShowPopup(true);
            }, 10);
            return;
        }
        const finalPermissions = {};
        modules.forEach((module) => {
            const formattedModule = module.replace(/\s+/g, "");
            finalPermissions[formattedModule] = {};

            actions.forEach((action) => {
                finalPermissions[formattedModule][action] = permissions[formattedModule]?.[action] || false;
            });
        });


        const defaultPermissionLevel = rolePermissionLevels[title] || 6;
        const roleData = {
            title,
            description,
            permissions: finalPermissions,
            createdBy: userId,
            defaultPermissionLevel,
        };

        try {
            setLoading(true);
            const response = await createRole(roleData);
            setPopupType("success");
            setPopupMessage("Role Created Successfully!");
            setShowPopup(true);
            setTimeout(() => {
                navigate("/dashboard/viewRoles");
            }, 2000);

        } catch (error) {
            setPopupType("failed");
            setPopupMessage(error?.response?.data?.message || "Something went wrong!");
            setShowPopup(true);
        } finally {
            setLoading(false);
        }
    };

    const handleInputClick = () => {
        setDropdownOpen(true);
    };
    return (

        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}>
                    <IoArrowBack />
                </button>
                <h2>Create New Role</h2>
            </div>

            <div className={styles.inputGroup}>
                <label>Role Title:</label>
                <div className={styles.autocompleteContainer}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            setDropdownOpen(true);
                        }}
                        required
                        onClick={handleInputClick}
                        placeholder="Select role..."
                        className={styles.customInput}
                    />
                    {isDropdownOpen && availableRoles.length > 0 && (
                        <ul className={styles.suggestionsList} ref={suggestionBoxRef}>
                            {availableRoles
                                .filter((role) =>
                                    role.toLowerCase().includes(title.toLowerCase())
                                )
                                .map((role, index) => (
                                    <li key={index} onClick={() => selectSuggestion(role)}>
                                        {role}
                                    </li>
                                ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label>Description:</label>
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDesc(e.target.value)}
                    className={styles.customInput}
                />
            </div>

            <table className={styles.permissionsTable}>
                <thead>
                    <tr>
                        <th>Module</th>
                        {actions.map((action) => (
                            <th key={action}>
                                {action.charAt(0).toUpperCase() + action.slice(1)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {modules.map((module) => {
                        const formattedModule = module.replace(/\s+/g, "");
                        return (
                            <tr key={module}>
                                <td>{module}</td>
                                {actions.map((action) => {
                                    // Condition to disable all except "view" for Setting and Task
                                    const isViewOnlyModule = module === "Setting" || module === "Task";
                                    const isDisabled = isViewOnlyModule && action !== "view";

                                    return (
                                        <td key={action}>
                                            <input
                                                type="checkbox"
                                                checked={permissions[formattedModule]?.[action] || false}
                                                disabled={isDisabled}
                                                onChange={() => handleCheckboxChange(module, action)}
                                            />
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>

            </table>

            <div className={styles.buttonGroup}>
                <button className={styles.submitBtn} onClick={handleSubmit}>
                    {isLoading ? <><Loader size={20} /> Saving... </> : "Save Role"}
                </button>
            </div>
            {showPopup && !isLoading && (
                <PopUp type={popupType} onClose={() => setShowPopup(false)} message={popupMessage} />
            )}
        </div>


    );
};

export default AddRole;
