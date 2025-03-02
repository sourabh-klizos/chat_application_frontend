import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChatWindow = ({ selectedUser }) => {
  const token = sessionStorage.getItem("access");
  const BASE_URL =  import.meta.env.VITE_API_BASE_URL;
  const BASE_URL_WS =  import.meta.env.VITE_API_BASE_URL_WS;
  // console.log("API URL:", BASE_URL);
  // console.log("API URL:", BASE_URL_WS);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const id_ref = useRef(null);
  const selected_user = selectedUser ? selectedUser.id : null;

  const messagesEndRef = useRef(null); // Reference to the bottom of the messages

  const navigate = useNavigate();

  // Get chat history from the backend
  const get_chats_history = async () => {
    // const url = `http://localhost:8000/api/v1/chat/history/${id_ref.current}/${selected_user}`;

    // const url = `${BASE_URL}/api/v1/chat/history/${id_ref.current}/${selected_user}`;
    const url = `${BASE_URL}/api/v1/chat/history/${selected_user}`;


    console.log({url})

    const headers = {
      "Content-Type": "application/json",
       Authorization: `Bearer ${token}`,

    };
    try {
      const response = await axios.get(url, { headers });
      if (response.status === 200) {
        setMessages(response.data);
      }
    } catch (error) {
      navigate('/login');
    }
  };

  useEffect(() => {
    const user_id = sessionStorage.getItem('user_id');
    id_ref.current = user_id;

    if (!id_ref.current) {
      navigate('/login');
    }

    if (id_ref.current && selected_user) {
      const get_history = async () => {
        await get_chats_history();
      };
      get_history();

      // const ws = new WebSocket(`${BASE_URL_WS}/${id_ref.current}/${selected_user}/?token=${token}`);
      const ws = new WebSocket(`${BASE_URL_WS}/${selected_user}/?token=${token}`);


      console.log(`${BASE_URL_WS}/${id_ref.current}/${selected_user}`)

      ws.onerror = (error) => {
        console.error("WebSocket error", error);
        navigate("/login"); // Redirect to login on error
      };

      ws.onopen = () => {
        console.log('Connected to WebSocket');
      };

      ws.onmessage = (event) => {
        const data = event.data;
        const json_data = JSON.parse(data);
        if (json_data.sender_id !== id_ref.current) {
          setMessages((prevMessages) => [...prevMessages, json_data]);
        }
      };

      ws.onclose = () => {
        console.log('Disconnected from WebSocket');
      };

      setSocket(ws);

      return () => {
        ws.close();
      };
    }
  }, [selected_user, id_ref]);

  // Scroll to the bottom of the chat when messages are updated
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Format timestamp for each message
  const formatTimestamp = (timestamp) => {
    const now = new Date(timestamp);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (message.trim() && socket) {
      const timestamp = new Date().toISOString();
      const msg = {
        text: message,
        sender_id: id_ref.current,
        receiver_id: selected_user,
        created_at: timestamp,
      };
      socket.send(JSON.stringify(msg));
      setMessages((prevMessages) => [...prevMessages, msg]);
      setMessage('');
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2>Chating with {selectedUser ? selectedUser.username : '...'}</h2>
      </div>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender_id === id_ref.current ? 'me' : 'other'}`}>
            <div className="message-content">{msg.text}</div>
            <div className="message-timestamp">
              {formatTimestamp(msg.created_at)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Scrolls to this div */}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
