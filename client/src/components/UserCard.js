import React from 'react';
import './UserCard.css'
const UserCard = ({ user }) => {
  return (
    <div className="Card">
      <p>User ID: {user.user_id}</p>
      <p>User Name: {user.user_name}</p>
      <p>Age: {user.age}</p>
      <p>Batch ID: {user.batch_id}</p>
      <p>Enrollment Date: {new Date(user.enrollment_date).toLocaleDateString()}</p>
      <p>Last Payment Date: {new Date(user.last_payment_date).toLocaleDateString()}</p>
      <p>Payment Status: {user.payment_status}</p>
    </div>
  );
}

export default UserCard;
