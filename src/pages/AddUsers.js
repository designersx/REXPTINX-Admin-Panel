import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import PopUp from "../components/Popup";
import styles from "../css/AddUsers.module.css";
import { IoArrowBack } from "react-icons/io5";
import decodeToken from "../utils/decodeToken";
import { addNewUser } from "../config/apiStore";
import Loader from "../components/Loader";
const AddUsers = () => {
    const { id } = useParams();
    const [isEditMode, setIsEditMode] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState(null);
    const [popupMessage, setPopupMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)
    const token = localStorage.getItem('token');
    const decodedToken = decodeToken(token);
    const userId = decodedToken.user.id;
    const navigate = useNavigate()
    const defaultUserState = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
        userRole: "",
        status: "active",
        createdBy: userId,
        roleId: null,
    };
    const [newUser, setNewUser] = useState(defaultUserState);

    const [availableRoles, setAvailableRoles] = useState([
        { id: 1, title: "superadmin" },
        { id: 2, title: "admin" },
        { id: 3, title: "user" },
    ]);

    useEffect(() => {
        if (id) setIsEditMode(true);
    }, [id]);

    const showError = (message) => {
        setPopupMessage(message);
        setPopupType("failed");
        setShowPopup(true);
    };

    const validate = () => {
        const nameRegex = /^[A-Za-z\s]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^\d{10}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/;

        if (!newUser.firstName) return showError("First Name is required");
        if (!nameRegex.test(newUser.firstName)) return showError("First Name must contain only letters");
        if (!/^[A-Z]/.test(newUser.firstName)) return showError("First Name must start with a capital letter");

        if (!newUser.lastName) return showError("Last Name is required");
        if (!nameRegex.test(newUser.lastName)) return showError("Last Name must contain only letters");
        if (!/^[A-Z]/.test(newUser.lastName)) return showError("Last Name must start with a capital letter");

        if (!newUser.email) return showError("Email is required");
        if (!emailRegex.test(newUser.email)) return showError("Enter a valid email address");

        if (!newUser.phoneNumber) return showError("Mobile Number is required");
        if (!mobileRegex.test(newUser.phoneNumber)) return showError("Enter a valid 10-digit number");

        if (!newUser.userRole) return showError("Role is required");

        if (!isEditMode) {
            if (!newUser.password) {
                return Swal.fire({
                    icon: "warning",
                    title: "Password Required",
                    text: "Please enter a password.",
                });
            }

            if (!passwordRegex.test(newUser.password)) {
                return Swal.fire({
                    icon: "error",
                    title: "Weak Password",
                    html: `
            <div style="text-align: left;">
              Your password must meet the following:
              <ul>
                <li>✅ 6–20 characters</li>
                <li>✅ At least one uppercase</li>
                <li>✅ One lowercase</li>
                <li>✅ One digit</li>
                <li>✅ One special character</li>
              </ul>
            </div>
          `,
                });
            }
        }

        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "userRole") {
            const selected = availableRoles.find((role) => role.title === value);
            setNewUser((prev) => ({
                ...prev,
                userRole: value,
                roleId: selected ? selected.id : null,
                createdBy: userId
            }));
        } else {
            setNewUser((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        if (validate() === true) {
            setLoading(true)
            const response = await addNewUser(newUser)
            if (response.status === 201 || response.status === 200) {
                setPopupMessage("User submitted successfully!");
                setPopupType("success");
                setLoading(false)
                setTimeout(() => {
                    navigate("/dashboard/viewUsers")
                }, 200);
            } else {
                setPopupMessage(response.data.msg || "Something went wrong");
                setPopupType("failed");
                setLoading(false)
            }
            setShowPopup(true);


        }
    };
    return (
        <>

            <div className={styles.formContainer}>
                <div className={styles.header}>
                    {/* <button className={styles.backBtn}> */}
                    <IoArrowBack className={styles.backIcon} onClick={() => navigate(-1)} />
                    {/* </button> */}
                    <h2>Create New User</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={newUser.firstName}
                            onChange={handleChange}
                            className={styles.inputField}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={newUser.lastName}
                            onChange={handleChange}
                            className={styles.inputField}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={newUser.email}
                            onChange={handleChange}
                            className={styles.inputField}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Mobile Number"
                            value={newUser.phoneNumber}
                            onChange={handleChange}
                            className={styles.inputField}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <select
                            name="userRole"
                            value={newUser.userRole}
                            onChange={handleChange}
                            className={styles.inputField}
                        >
                            <option value="">Select Role</option>
                            {availableRoles.map((role) => (
                                <option key={role.id} value={role.title}>
                                    {role.title.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    {!isEditMode && (
                        <div className={styles.inputGroup}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={newUser.password}
                                onChange={handleChange}
                                className={styles.inputField}
                            />
                        </div>
                    )}

                    <button type="submit" className={styles.button}>
                        {loading ? <><Loader size={22} />  Submitting...</> : "Add User"}
                    </button>
                </form>
            </div>

            {showPopup && (
                <PopUp
                    type={popupType}
                    message={popupMessage}
                    onClose={() => setShowPopup(false)}
                />
            )}
        </>
    );
};

export default AddUsers;
