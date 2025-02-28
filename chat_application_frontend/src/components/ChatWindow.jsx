import React, { useState, useEffect , useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChatWindow = ({ selectedUser }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [current_user, setCurrent_user] = useState(null)
  
  const navigate = useNavigate();

  const id_ref = useRef(null)
  const selected_user = selectedUser ? selectedUser.id : null





  const get_chats_history = async () => {
    const url = `http://localhost:8000/api/v1/chat/history/${id_ref.current}/${selected_user}`
    const headers = {
      'Content-Type': 'application/json',
    
    };
    try{
      const response = await axios.get(url, {headers} )
      if (response.status == 200){

        setMessages(response.data)

        // console.log(response)
 
      }
    }
    catch(error){
      console.log(error)
    }
    }


  useEffect(() => {


    const user_id = sessionStorage.getItem('user_id'); 
    id_ref.current = user_id

    console.log( {"current_user": id_ref.current , "selected" :selected_user } )


    if(id_ref.current === null){
      navigate("/login")
    }


    if(id_ref.current !== null & selected_user !== null){


      const get_history = async () => {
              await get_chats_history()
        
            }
      get_history()



      const ws = new WebSocket(`ws://localhost:8000/ws/${id_ref.current}/${selected_user}`);


      ws.onopen = () => {
        console.log('Connected to WebSocket');
        
      };

      ws.onmessage = (event) => {
        const data = event.data;
        const json_data = JSON.parse(data)
        console.log(json_data)

        if (json_data.sender_id !== id_ref.current ){
          setMessages((prevMessages) => [
            ...prevMessages,
            json_data
          ]);
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

  const formatTimestamp = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleSendMessage = () => {
  if (message.trim() && socket) {
    const timestamp = formatTimestamp();
    const msg = {
      text: message,
      sender_id: id_ref.current,
      receiver_id: selected_user,
      created_at: timestamp
    };
    socket.send(JSON.stringify(msg));
    setMessages((prevMessages) => [
      ...prevMessages,
      msg
    ]);
    setMessage('');
  }
};

  
  return (
    <div className="chat-window">
      <h2>Chat with {selectedUser ? selectedUser.username : '...'}</h2>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender_id === id_ref.current ? 'me' : 'other'}`}>
            <div className="message-content">{msg.text}</div>
            <div className="message-timestamp">{formatTimestamp(msg.created_at)}</div>
          </div>
        ))}
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
