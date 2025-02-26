import React, { useEffect } from 'react';








const UserList = ({ users, onUserSelect }) => {

  

  return (
    <div className="user-list">
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id} onClick={() => onUserSelect(user)}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;