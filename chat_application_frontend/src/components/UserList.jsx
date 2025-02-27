import React, { useEffect, useState } from 'react';

const UserList = ({ users, onUserSelect }) => {
  const current_user_id = sessionStorage.getItem('user_id'); 


  const currentUser = users ? users.find(user => user.id === current_user_id) : null;

  useEffect(() => {
  }, [current_user_id, currentUser]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-list">
      <h5>{currentUser.username}</h5>
      <ul>
        {users
          .filter(user => user.id !== current_user_id)
          .map(user => (
            <li key={user.id} onClick={() => onUserSelect(user)}>
              {user.username}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default UserList;
