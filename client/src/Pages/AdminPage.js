import { useEffect, useState } from 'react';
import './HomePage.css'
import { useNavigate } from 'react-router-dom';
import {isAuthenticated} from '../Auth'
import { PulseLoader } from 'react-spinners'
import UserCard from '../components/UserCard';
import toast from 'react-hot-toast';

const AdminPage = () => {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg]=useState('')
  const [userDetails, setUserDetails] = useState([]);
  const Navigate=useNavigate();
  const username=localStorage.getItem('username');
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const getAllUsers = async (type) => {
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

  useEffect(() => {
    if (!isAuthenticated()) {
      Navigate('/login');
      return;
    }
  }, []);

  return (
    <div className='mainWrap'>
      <h1>Admin Actions:</h1>
      <button onClick={()=>getAllUsers(0)}>Show all users</button>
      <br />
      <button onClick={()=>getAllUsers(1)}>Show users with Pending Payment</button>
      <br />
      <button onClick={()=>getAllUsers(2)}>Show users with Completed Payment</button>
      <PulseLoader
        loading={loading}
        color={"#ACBBBF"}
        style={{ margin: '1em' }}
        size={9}
      />
        <br />
      {/* Display user details */}
      <div className="userDetailsContainer">
      {userDetails
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