import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatWindow from '../components/ChatWindow';
import UserList from '../components/UserList';
import "../styles/ChatPage.css"




const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setusers] = useState([]);
  const BASE_URL_WS =  import.meta.env.VITE_API_BASE_URL_WS;

  
// const get_all_users = async () => {
//   const url = "http://localhost:8000/api/v1/auth/users"
//   const headers = {
//     'Content-Type': 'application/json',
  
//   };
//   try{
//     const response = await axios.get(url, {headers} )
//     if (response.status == 200){
//       console.log(response.data)
//       setusers(response.data)
 
//     }
//   }
//   catch(error){}
//   }

//   useEffect( () => {
//     const get_users = async () => {
//       await get_all_users()

//     }
//     get_users()
//   }, [])



  // useEffect(() => {
  //   // Handle the beforeunload event to send the message when the tab is closed
    
  //   // Cleanup the event listener when the component unmounts
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, [userId]);


    
  useEffect( () =>{
    // console.log("useEffect chat page")
    const user_id = sessionStorage.getItem('user_id'); 

    const ws = new WebSocket(`${BASE_URL_WS}/status/${user_id}`);


    ws.onopen = () => {
      // console.log('Connected to WebSocket online users');
      ws.send(JSON.stringify( { "type": "get_online_users"}));
      
    };

    ws.onmessage = (event) => {
      const data = event.data;
      const json_data = JSON.parse(data)
      console.log(json_data)
      setusers(json_data)
      
    };
    
    ws.onclose = () => {
   
      console.log("WebSocket is already closed. Could not send message.");
    

    };

    // const handleBeforeUnload = () => {
    //   if (ws.current.readyState === WebSocket.OPEN) {
    //     ws.current.send(JSON.stringify({
    //       type: 'user_left',
    //       user_id: userId,
    //     }));
    //   }
    // };

    // Add event listener to handle page/tab close
    // window.addEventListener('beforeunload', handleBeforeUnload);

    // setSocket(ws);

    return () => {
      // window.removeEventListener('beforeunload', handleBeforeUnload);
      ws.send(JSON.stringify( { "type": "user_left"}))
      setTimeout(() => {
        ws.close();
      }, 1000);
    };
  

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