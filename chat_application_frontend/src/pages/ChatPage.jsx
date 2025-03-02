import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatWindow from "../components/ChatWindow";
import UserList from "../components/UserList";
import "../styles/ChatPage.css";
import { useNavigate } from 'react-router-dom';

const App = () => {
  const token = sessionStorage.getItem("access");
  const [selectedUser, setSelectedUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]); // Store all users
  const [onlineUsers, setOnlineUsers] = useState([]); // Store online users
  const BASE_URL_WS = import.meta.env.VITE_API_BASE_URL_WS;
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  

  const getAllUsers = async () => {
    const token = sessionStorage.getItem("access");
    
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/auth/users`, { headers });
      if (response.status === 200) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching all users", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    const user_id = sessionStorage.getItem("user_id");
    const ws = new WebSocket(`${BASE_URL_WS}/status/?token=${token}`);

    ws.onerror = (error) => {
      console.error("WebSocket error", error);
      navigate("/login"); // Redirect to login on error
    };

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "get_online_users" }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setOnlineUsers(data); // Update online users
    };

    return () => {
      ws.send(JSON.stringify({ type: "user_left" }));
      setTimeout(() => ws.close(), 1000);
    };
  }, []);

  // Merge and sort users: online first, then offline
  const sortedUsers = allUsers.map(user => ({
    ...user,
    isOnline: onlineUsers.some(onlineUser => onlineUser.id === user.id),
  })).sort((a, b) => b.isOnline - a.isOnline);

  return (
    <div className="app">
      <div className="sidebar">
        {sortedUsers.length > 0 ? (
          <UserList users={sortedUsers} onUserSelect={setSelectedUser} />
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
