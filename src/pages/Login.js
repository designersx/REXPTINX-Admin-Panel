import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../css/Login.module.css';
import { API_URL } from '../config/apiStore';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import PopUp from '../components/Popup';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [step, setStep] = useState(1); // Step 1: email, Step 2: password
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState(null);
    const [popupMessage, setPopupMessage] = useState("");
    const navigate = useNavigate();
    const handleContinue = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() === '') {
        setPopupType("failed");
        setPopupMessage("Please enter your email.");
        setShowPopup(true);
        return;
    }
    if (!emailRegex.test(email.trim())) {
        setPopupType("failed");
        setPopupMessage("Please enter a valid email address.");
        setShowPopup(true);
        return;
    }
    setStep(2);
};

    const handleLogin = async () => {
      if (password.trim() === '') {
        setPopupType("failed");
        setPopupMessage('Please enter your password.');
        setShowPopup(true);
        return;
    }

    if (password.length < 8) {
        setPopupType("failed");
        setPopupMessage('Password must be at least 8 characters long.');
        setShowPopup(true);
        return;
    }
        try {
            setLoading(true);
            const res = await axios.post(`${API_URL}admin/login`, { email, password });
            console.log(res, "res")
            localStorage.setItem('token', res.data.token);
            setPopupType("success");
            setShowPopup(true);
            setTimeout(() => {
                navigate('/dashboard');
                setPopupMessage("Login Successfully");
                window.location.reload();
                setLoading(false);
            }, 2000);

        } catch (err) {
            setPopupType("failed");
            setPopupMessage(err?.response?.data?.msg || "Something went wrong!");
            setShowPopup(true);
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.card}>
                    <h2 className={styles.title}>
                        {step === 1 ? (
                            'Sign in to your account'
                        ) : (
                            <>
                                Welcome <br /><br /><span className={styles.emailText}>{email}</span>
                            </>
                        )}
                    </h2>


                    {step === 1 && (
                        <>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className={styles.input}
                            />


                            <button className={styles.loginBtn} onClick={handleContinue}>
                                Continue
                            </button>
                             <div style={{
  position: 'fixed',
  bottom: '10px',
  right: '10px',
  backgroundColor: '#000',
  color: '#fff',
  padding: '6px 12px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: '500',
  opacity: 0.7,
  transition: 'opacity 0.3s ease',
  zIndex: 1000,
}}
  onMouseEnter={e => e.currentTarget.style.opacity = 1}
  onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
>
  <p style={{ margin: 0 }}>Made with ❤️ by DesignersX</p>
</div>

                        </>
                    )}

                    {step === 2 && (
                        <>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className={styles.input}
                            />
                            <div className={styles.optionsRow}>
                                {/* <label className={styles.checkboxContainer}>
                                    <input type="checkbox" className={styles.customCheckbox} />
                                    <span className={styles.checkmark}></span>
                                    Keep me logged in
                                </label> */}

                                {/* <span className={styles.forgotPassword} onClick={() => alert("Redirect to forgot password page")}>
                                    Forgot password?
                                </span> */}
                            </div><br />
                            <button className={styles.loginBtn} onClick={handleLogin}>
                                {loading ? <Loader size={25} /> : "Login"}
                            </button>
                            <div style={{
  position: 'fixed',
  bottom: '0px',
  right: '20px',
  backgroundColor: '#000',
  color: '#fff',
  padding: '6px 12px',
  borderRadius: '8px',
  fontSize: '12px',
  fontWeight: '500',
  opacity: 0.7,
  transition: 'opacity 0.3s ease',
  zIndex: 1000,
}}
  onMouseEnter={e => e.currentTarget.style.opacity = 1}
  onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
>
  <p style={{ margin: 0 }}>Made with ❤️ by DesignersX</p>
</div>

                        </>
                        
                    )}
                </div>
            </div>
            {showPopup && (
                <PopUp type={popupType} onClose={() => setShowPopup(false)} message={popupMessage} />
            )}
        </>
    );
};

export default Login;
