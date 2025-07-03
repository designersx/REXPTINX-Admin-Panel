import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import style from '../css/Partners.module.css';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

function Partners() {
  const [partners, setPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const navigate = useNavigate();

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}agent/refereedendusers/data`);
      const data = response.data.endUsers || [];
      setPartners(data);
      setFilteredPartners(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch partners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  useEffect(() => {
    const filtered = partners.filter(partner =>
      (partner.userId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (partner.referralCode || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPartners(filtered);
    setCurrentPage(1); // Reset to page 1 on search
  }, [searchQuery, partners]);

  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);
  const paginatedData = filteredPartners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className={style.container}>
      <div className={style.header}>
        {/* <button className={style.backBtn} onClick={() => navigate(-1)}>
          <IoArrowBack />
        </button> */}
        <h2>Referred Partners</h2>
      </div>

      <div className={style.inputGroup}>
        <input
          type="text"
          placeholder="Search by name or referral code..."
          className={style.customInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <p className={style.error}>{error}</p>
      ) : (
        <>
          <table className={style.partnerTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Partner Name</th>
                <th>Referral Code</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((partner, index) => (
                  <tr key={partner._id || index}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{partner.userId || 'NA'}</td>
                    <td>{partner.referralCode || 'NA'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className={style.noData}>No referred users found.</td>
                </tr>
              )}
            </tbody>
          </table>

       {filteredPartners.length > 0 && (
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
    </div>
  );
}

export default Partners;
