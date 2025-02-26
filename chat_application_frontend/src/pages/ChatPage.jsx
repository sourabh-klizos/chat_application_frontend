import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatWindow from '../components/ChatWindow';
import UserList from '../components/UserList';
import "../styles/ChatPage.css"




const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setusers] = useState([]);

  
const get_all_users = async () => {
  const url = "http://localhost:8000/api/v1/auth/users"
  const headers = {
    'Content-Type': 'application/json',
  
  };
  try{
    const response = await axios.get(url, {headers} )
    if (response.status == 200){
      setusers(response.data)
 
    }
  }
  catch(error){}
  }

  useEffect( () => {
    const get_users = async () => {
      await get_all_users()

    }
    get_users()
  }, [])
    
  useEffect( () =>{
    const socket = new WebSocket("ws://localhost:8000/ws");

  }, [])
  


  return (
    <div className="app">
      <div className="sidebar">
      {users ? (
        <UserList users={users} onUserSelect={setSelectedUser} />
      ) : (
        <p>Loading users...</p>
      )}
        
      </div>
      <div className="main-content">
        <ChatWindow selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default App;