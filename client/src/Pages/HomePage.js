import { useEffect, useState } from 'react';
import './HomePage.css'
import { useNavigate } from 'react-router-dom';
import {isAuthenticated} from '../Auth'
import { PulseLoader } from 'react-spinners'
import toast from 'react-hot-toast';

const HomePage = () => {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg]=useState('')
  const [batch_id, setBatchid]=useState('')
  const Navigate=useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const username=localStorage.getItem('username');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const fetchUserDetails = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${BACKEND_URL}/getUserDetails/${username}`);
        
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      setUserDetails(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async () => {
  const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
  if (!confirmDelete) {
    return;
  }
    setLoading(true)
    try {
      console.log("deleting user");
      const response = await fetch(`${BACKEND_URL}/deleteUser/${username}`);
        
      if (!response.ok) {
        return;
      }
      Navigate('/login');
      const data = await response.json();
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const doPayment = async () => {
    setLoading(true)
    try {
      console.log("doing payment");
      const response = await fetch(`${BACKEND_URL}/submitPayment/${username}`);
        
      if (!response.ok) {
        return;
      }
      const data = await response.json();
      toast.success('Payment done successfully.');
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeBatch = async () => {
    const confirmation = window.confirm("Are you sure you want to change your batch?");
  if (!confirmation) {
    return;
  }
    setLoading(true)
    try {
      console.log("changing batch");
      const response = await fetch(`${BACKEND_URL}/changeBatch`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_name: username,
          batch_id: batch_id,
        }),
      });

      if (!response.ok) {
        return;
      }
      fetchUserDetails();
      const data = await response.json();
      toast.success('Batch changed successfully.');
    } catch (error) {
      console.error('Error changing the batch:', error);
      toast.error('Error changing the batch.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      Navigate('/login');
      return;
    }
    else fetchUserDetails();
  }, []);

  return (
    <div className='mainWrap'>
      <h1>Welcome, {username}!</h1>
      <h3>User Details:</h3>
      <div>
        <p>Batch Timing: {userDetails.batch_time}</p>
        <p>Enrollment Date: {new Date(userDetails.enrollment_date).toLocaleDateString()}</p>
        <p>Last Payment Date: {new Date(userDetails.last_payment_date).toLocaleDateString()}</p>
        <p>Payment Status: {userDetails.payment_status}</p>
      </div>
      <br/>
      <h3>Available Actions:</h3>
      <div className='batch_row'>
          <label>Batch timings:</label>
          <select name="batchId" value={batch_id} onChange={(e)=>setBatchid(e.target.value)}>
            <option value="">Select a Batch</option>
            <option value="1">6-7AM</option>
            <option value="2">7-8AM</option>
            <option value="3">8-9AM</option>
            <option value="4">5-6PM</option>
          </select>
        <button onClick={()=>changeBatch()}>Change Batch</button>
      </div>
      <br/>
      <div className='batch_row'>
      <button onClick={()=>deleteUser()}>Delete User</button>
      <button onClick={()=>doPayment()}>Complete Payment</button>
      </div>
      <PulseLoader
        loading={loading}
        color={"#ACBBBF"}
        style={{ margin: '1em' }}
        size={9}
      />
    </div>
  )
}

export default HomePage