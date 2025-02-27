import React, { useState, useEffect , useRef} from 'react';
import { useNavigate } from 'react-router-dom';


const ChatWindow = ({ selectedUser }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [current_user, setCurrent_user] = useState(null)
  
  const navigate = useNavigate();

  const id_ref = useRef(null)
  const selected_user = selectedUser ? selectedUser.id : null

  useEffect(() => {



    const user_id = sessionStorage.getItem('user_id'); 
    id_ref.current = user_id

    console.log( {"current_user": id_ref.current , "selected" :selected_user } )


    if(id_ref.current === null){
      navigate("/login")
    }


    if(id_ref.current !== null & selected_user !== null){
      
      // console.log("making connn")
      const ws = new WebSocket(`ws://localhost:8000/ws/${id_ref.current}/${selected_user}`);


      ws.onopen = () => {
        console.log('Connected to WebSocket');
        
      };

      ws.onmessage = (event) => {
        const data = event.data;
        const json_data = JSON.parse(data)

        if (json_data.sender !== id_ref.current ){
          setMessages((prevMessages) => [
            ...prevMessages,
            json_data['text']
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

  const handleSendMessage = () => {
    if (message.trim() && socket) {
      socket.send(JSON.stringify( { "text": message , "sender" :id_ref.current }));
      setMessages((prevMessages) => [
        ...prevMessages,
        message,
      ]);
      setMessage('');
    }
  };

  return (
    <div className="chat-window">
      <h2>Chat with {selectedUser ? selectedUser.username : '...'}</h2>
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg}
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
