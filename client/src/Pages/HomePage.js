import { useEffect, useState } from 'react';
import './HomePage.css'
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, clearAuthTokens } from '../Auth'
import { PulseLoader } from 'react-spinners'
import toast from 'react-hot-toast';

const HomePage = () => {
  const [loading, setLoading] = useState(false)
  const [batch_id, setBatchid] = useState('')
  const Navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const username = localStorage.getItem('username');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const logout = () => {
    const confirmation = window.confirm("Are you sure you want to logout?");
    if (!confirmation) {
      return;
    }
    clearAuthTokens();
    Navigate('/login');
  };

  const fetchUserDetails = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${BACKEND_URL}/getUserDetails/${username}`);
      if (response.ok) {
        const data = await response.json();
        setUserDetails(data);
        return;
      }
      const errorData = await response.json();
      toast.error(errorData.error);
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

      if (response.ok) {
      Navigate('/login');
      }
      else{
        const errorData = await response.json();
        toast.error(errorData.error);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };

  const doPayment = async () => {
    setLoading(true)
    try {
      console.log("doing payment");
      const response = await fetch(`${BACKEND_URL}/submitPayment/${username}`);

      if (response.ok) {
        fetchUserDetails();
        toast.success('Payment done successfully.');
        return;
      }
      else{
        const errorData = await response.json();
        toast.error(errorData.error);
      }
    } catch (error) {
      console.error('Error doing payment:', error);
    } finally {
      setLoading(false);
    }
  };

  const changeBatch = async () => {
    if (!batch_id) {
      alert("Please select a Batch form the drop down menu.")
      return;
    }
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

      if (response.ok) {
      fetchUserDetails();
      toast.success('Batch changed successfully.');
        return;
      }
      else{
        const errorData = await response.json();
        toast.error(errorData.error);
      }
    } catch (error) {
      console.error('Error changing the batch:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      Navigate('/login');
      return;
    }
    if (username === 'admin') {
      Navigate('/admin');
      return
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
      <br />
      <h3>Available Actions:</h3>
      <div className='batch_row'>
        <label>Batch timings:</label>
        <select name="batchId" value={batch_id} onChange={(e) => setBatchid(e.target.value)}>
          <option value="">Select a Batch</option>
          <option value="1">6-7AM</option>
          <option value="2">7-8AM</option>
          <option value="3">8-9AM</option>
          <option value="4">5-6PM</option>
        </select>
        <button onClick={() => changeBatch()}>Change Batch</button>
      </div>
      <br />
      <div className='batch_row'>
        <button onClick={() => deleteUser()}>Delete User</button>
        <button onClick={() => doPayment()}>Complete Payment</button>
        <button className='logout' onClick={() => logout()}>Logout</button>
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