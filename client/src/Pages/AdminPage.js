import { useEffect, useState } from 'react';
import './HomePage.css'
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, clearAuthTokens } from '../Auth'
import { PulseLoader } from 'react-spinners'
import UserCard from '../components/UserCard';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const [loading, setLoading] = useState(false)
  const [batch_id, setBatchid] = useState('')
  const [userDetails, setUserDetails] = useState([]);
  const Navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const logout = () => {
    const confirmation = window.confirm("Are you sure you want to logout?");
    if (!confirmation) {
      return;
    }
    clearAuthTokens();
    Navigate('/login');
  };

  const getUsers = async (type) => {
    setLoading(true)
    try {
      let response;
      if (type === 0) {
        response = await fetch(`${BACKEND_URL}/getUsers`);
      } else if (type === 1) {
        response = await fetch(`${BACKEND_URL}/getUsersWithPendingPayment`);
      } else if (type === 2) {
        response = await fetch(`${BACKEND_URL}/getUsersWithCompletedPayment`);
      }
      if (response.ok) {
        const data = await response.json();
        if(data.length==0){
          toast.error("No Users Found!")
        }
        setUserDetails(data);
        return;
      }
      else {
        const errorData = await response.json();
        toast.error(errorData.error);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUsersByBatch = async () => {
    setLoading(true)
    try {
      if(!batch_id){
        toast.error("Please select a batch.")
        return;
      }
      console.log("fetching users");
      const response = await fetch(`${BACKEND_URL}/getUsersofBatch/${batch_id}`);

      if (response.ok) {
        const data = await response.json();
        setUserDetails(data);
        if(data.length==0){
          toast.error("No Users Found!")
        }
        return;
      }
      else{
        const errorData = await response.json();
        toast.error(errorData.error);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      Navigate('/login');
      return;
    }
  }, []);

  return (
    <div className='mainWrap'>
      <h1>Admin Actions:</h1>
      <span className='row_apart'>
        <button onClick={() => getUsers(0)}>Show all users</button>
        <button className='logout' onClick={() => logout()}>Logout</button>
      </span>
      <br />
      <button onClick={() => getUsers(1)}>Show users with Pending Payment</button>
      <br />
      <button onClick={() => getUsers(2)}>Show users with Completed Payment</button>
      <br />
      <div className='batch_row'>
        <label>Batch timings:</label>
        <select name="batchId" value={batch_id} onChange={(e) => setBatchid(e.target.value)}>
          <option value="">Select a Batch</option>
          <option value="1">6-7AM</option>
          <option value="2">7-8AM</option>
          <option value="3">8-9AM</option>
          <option value="4">5-6PM</option>
        </select>
        <button onClick={() => getUsersByBatch()}>Get Users</button>
      </div>
      <PulseLoader
        loading={loading}
        color={"#ACBBBF"}
        style={{ margin: '1em' }}
        size={9}
      />
      <br />
      {/* Display user details */}
      <div className="userDetailsContainer">
        {userDetails && userDetails
          .slice()
          .sort((a, b) => a.user_id - b.user_id) // Sort by user_id
          .map((user) => (
            <UserCard key={user.user_id} user={user} />
          ))}
      </div>
    </div>
  )
}

export default AdminPage