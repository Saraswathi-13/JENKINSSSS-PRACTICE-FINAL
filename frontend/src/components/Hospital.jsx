import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import config from './config.js';

const Hospital = () => {
  const [hospitals, setHospitals] = useState([]);
  const [hospital, setHospital] = useState({
    id: '',
    name: '',
    branch: '',
    experience: '',
    email: '',
    password: '',
    contact: ''
  });
  const [idToFetch, setIdToFetch] = useState('');
  const [fetchedHospital, setFetchedHospital] = useState(null);
  const [message, setMessage] = useState('');
  const [editMode, setEditMode] = useState(false);

  const baseUrl = `${config.url}/hospitalapi`;

  useEffect(() => {
    fetchAllHospitals();
  }, []);

  const fetchAllHospitals = async () => {
    try {
      const res = await axios.get(`${baseUrl}/all`);
      setHospitals(res.data);
    } catch (error) {
      setMessage('Failed to fetch hospitals.');
    }
  };

  const handleChange = (e) => {
    setHospital({ ...hospital, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    for (let key in hospital) {
      if (!hospital[key] || hospital[key].toString().trim() === '') {
        setMessage(`Please fill out the ${key} field.`);
        return false;
      }
    }
    return true;
  };

  const addHospital = async () => {
    if (!validateForm()) return;
    try {
      await axios.post(`${baseUrl}/add`, hospital);
      setMessage('Hospital added successfully.');
      fetchAllHospitals();
      resetForm();
    } catch (error) {
      setMessage('Error adding hospital.');
    }
  };

  const updateHospital = async () => {
    if (!validateForm()) return;
    try {
      await axios.put(`${baseUrl}/update`, hospital);
      setMessage('Hospital updated successfully.');
      fetchAllHospitals();
      resetForm();
    } catch (error) {
      setMessage('Error updating hospital.');
    }
  };

  const deleteHospital = async (id) => {
    try {
      const res = await axios.delete(`${baseUrl}/delete/${id}`);
      setMessage(res.data);
      fetchAllHospitals();
    } catch (error) {
      setMessage('Error deleting hospital.');
    }
  };

  const getHospitalById = async () => {
    try {
      const res = await axios.get(`${baseUrl}/get/${idToFetch}`);
      setFetchedHospital(res.data);
      setMessage('');
    } catch (error) {
      setFetchedHospital(null);
      setMessage('Hospital not found.');
    }
  };

  const handleEdit = (hosp) => {
    setHospital(hosp);
    setEditMode(true);
    setMessage(`Editing hospital with ID ${hosp.id}`);
  };

  const resetForm = () => {
    setHospital({
      id: '',
      name: '',
      branch: '',
      experience: '',
      email: '',
      password: '',
      contact: ''
    });
    setEditMode(false);
  };

  return (
    <div className="hospital-container">

      {message && (
        <div className={`message-banner ${message.toLowerCase().includes('error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <h2>Hospital Management</h2>

      <div>
        <h3>{editMode ? 'Edit Hospital' : 'Add Hospital'}</h3>
        <div className="form-grid">
          <input type="number" name="id" placeholder="ID" value={hospital.id} onChange={handleChange} />
          <input type="text" name="name" placeholder="Name" value={hospital.name} onChange={handleChange} />
          
          <select name="branch" value={hospital.branch} onChange={handleChange}>
            <option value="">Select Branch</option>
            <option value="HYD">HYD</option>
            <option value="VJY">VJY</option>
            <option value="VIZAG">VIZAG</option>
          </select>
          <select name="experience" value={hospital.experience} onChange={handleChange}>
            <option value="">Select Experience</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          <input type="email" name="email" placeholder="Email" value={hospital.email} onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" value={hospital.password} onChange={handleChange} />
          <input type="text" name="contact" placeholder="Contact" value={hospital.contact} onChange={handleChange} />
        </div>

        <div className="btn-group">
          {!editMode ? (
            <button className="btn-blue" onClick={addHospital}>Add Hospital</button>
          ) : (
            <>
              <button className="btn-green" onClick={updateHospital}>Update Hospital</button>
              <button className="btn-gray" onClick={resetForm}>Cancel</button>
            </>
          )}
        </div>
      </div>

      <div>
        <h3>Get Hospital By ID</h3>
        <input
          type="number"
          value={idToFetch}
          onChange={(e) => setIdToFetch(e.target.value)}
          placeholder="Enter ID"
        />
        <button className="btn-blue" onClick={getHospitalById}>Fetch</button>

        {fetchedHospital && (
          <div>
            <h4>Hospital Found:</h4>
            <pre>{JSON.stringify(fetchedHospital, null, 2)}</pre>
          </div>
        )}
      </div>

      <div>
        <h3>All Hospitals</h3>
        {hospitals.length === 0 ? (
          <p>No hospitals found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {Object.keys(hospital).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hospitals.map((hosp) => (
                  <tr key={hosp.id}>
                    {Object.keys(hospital).map((key) => (
                      <td key={key}>{hosp[key]}</td>
                    ))}
                    <td>
                      <div className="action-buttons">
                        <button className="btn-green" onClick={() => handleEdit(hosp)}>Edit</button>
                        <button className="btn-red" onClick={() => deleteHospital(hosp.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Hospital;
