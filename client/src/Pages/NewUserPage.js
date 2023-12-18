import React, { useState } from 'react';
import './NewUserPage.css';
import { useNavigate } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import toast from 'react-hot-toast';

function NewUserPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    batchId: '',
    userPassword: '',
  });
  const navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await fetch(`${BACKEND_URL}/addUser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: formData.name,
          age: formData.age,
          batch_id: formData.batchId,
          user_pswd: formData.userPassword,
        }),
      });

      if (response.ok) {
        toast.success("User registered successfully. Please login.");
        navigate('/login');
      } else {
        const errorData = await response.json();
        console.error('Error adding user:', errorData.error);
        toast.error(errorData.error);
      }
    } catch (error) {
      console.error('Error adding user:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="mainWrap">
      <h1>New User</h1>
      <form className="user-form" onSubmit={handleSubmit}>
        <div className='form_row'>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className='form_row'>
          <label>Age:</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} required min="18" max="65" />
        </div>
        <div className='form_row'>
          <label>Batch timings:</label>
          <select name="batchId" value={formData.batchId} onChange={handleChange} required>
            <option value="">Select a Batch</option>
            <option value="1">6-7AM</option>
            <option value="2">7-8AM</option>
            <option value="3">8-9AM</option>
            <option value="4">5-6PM</option>
          </select>
        </div>
        <div className='form_row'>
          <label>Password: &nbsp; </label>
          <input type="password" name="userPassword" value={formData.userPassword} onChange={handleChange} required minLength="8" />
        </div>
        <button type="submit">Complete Payment and Register</button>
        <button onClick={() => navigate('/login')}>Existing User Log In</button>
      </form>
      <PulseLoader
        loading={loading}
        color={"#ACBBBF"}
        style={{ margin: '1em' }}
        size={9}
      />
    </div>
  );
}

export default NewUserPage;
