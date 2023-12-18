import React, { useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { PulseLoader } from 'react-spinners'

function Login() {
  
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_name: username , user_pswd: password}),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("login data", data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);
        if(username==='admin'){
          navigate('/admin');
          return;
        }
        navigate('/');
      } else {
        const errorData = await response.json();
        console.error('Error adding user:', errorData.error);
        setError(errorData.error);
      }
    } catch (error) {
      console.error('Error during login:', error);
      // setError('Error encountered!', error)
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="mainWrap">
          <h1>Login</h1>
          <form className="login-form" onSubmit={handleLogin}>
          <input type="text" placeholder="Username" value={username} autoFocus
              onChange={(e) => setUsername(e.target.value)}
            />
            <input type="password" placeholder="Password" value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className='actions'>
            <button type="submit">Login</button>
            <button onClick={()=>navigate('/addUser')}>New User</button>
            </div>
            {error && <p className="error_msg">{error}</p>}
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

export default Login;
