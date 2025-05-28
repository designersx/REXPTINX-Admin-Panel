import React, { useEffect, useState } from 'react';
import styles from '../Modal/Modal.module.css';

const Modal = ({ isOpen, onClose, children, height = 'auto',width }) => {
  const [showModal, setShowModal] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      document.body.style.overflow = 'hidden';
    } else if (showModal) {
      setAnimateOut(true);
      setTimeout(() => {
        setShowModal(false);
        setAnimateOut(false);
        document.body.style.overflow = 'auto';
      }, 500);
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!showModal) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalContent} ${
          animateOut ? styles.slideDown : styles.slideUp
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ height,width }} 
      
      >
        <button onClick={onClose} className={styles.closeButton}>
         Close
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
